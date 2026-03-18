const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const Order = require('../models/Order');


// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generate HMAC-SHA256 signature required by eSewa v2.
 * Message format: "total_amount=<amt>,transaction_uuid=<uuid>,product_code=<code>"
 */
function generateSignature(totalAmount, transactionUuid, productCode) {
  const secretKey = process.env.ESEWA_SECRET_KEY;
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  return require('crypto').createHmac('sha256', secretKey).update(message).digest('base64');
}

// ─── Routes ──────────────────────────────────────────────────────────────────

/**
 * POST /api/payment/esewa/initiate
 * Frontend calls this to get the signed params to submit to eSewa.
 * Body: { totalNPR, orderData: { items, customerInfo, userId } }
 */
router.post('/initiate', async (req, res) => {
  try {
    const { totalNPR, orderData } = req.body;
    const amount = parseFloat(totalNPR).toFixed(2);
    const transactionUuid = `ESW-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const productCode = process.env.ESEWA_MERCHANT_CODE;

    // Create a pending order in DB so we can track it on callback
    const order = new Order({
      ...orderData,
      total: orderData.total,
      totalNPR: parseFloat(amount),
      paymentMethod: 'eSewa',
      paymentStatus: 'unpaid',
      transactionId: transactionUuid,
    });
    await order.save();

    const signature = generateSignature(amount, transactionUuid, productCode);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    res.json({
      success: true,
      orderId: order._id,
      esewaParams: {
        amount: amount,
        tax_amount: '0',
        total_amount: amount,
        transaction_uuid: transactionUuid,
        product_code: productCode,
        product_service_charge: '0',
        product_delivery_charge: '0',
        success_url: `${frontendUrl}/payment/success`,
        failure_url: `${frontendUrl}/payment/failure`,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature: signature,
      },
      paymentUrl: process.env.ESEWA_PAYMENT_URL,
    });
  } catch (err) {
    console.error('eSewa initiate error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/payment/esewa/verify
 * Frontend calls this after eSewa redirects to success page with ?data=<base64>.
 * Verifies with eSewa's status API and marks the order as paid.
 */
router.post('/verify', async (req, res) => {
  try {
    const { data } = req.body; // base64 encoded response from eSewa

    // Decode the base64 payload
    const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    const {
      transaction_uuid,
      total_amount,
      status,
      signed_field_names,
      signature: esewaSignature,
    } = decoded;

    // 1. Verify signature from eSewa response
    const productCode = process.env.ESEWA_MERCHANT_CODE;
    const fields = signed_field_names.split(',');
    const signatureMessage = fields.map((f) => `${f}=${decoded[f]}`).join(',');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.ESEWA_SECRET_KEY)
      .update(signatureMessage)
      .digest('base64');

    if (expectedSignature !== esewaSignature) {
      return res.status(400).json({ success: false, message: 'Invalid signature from eSewa' });
    }

    // 2. Verify with eSewa's transaction status API
    const verifyUrl = `${process.env.ESEWA_VERIFY_URL}?product_code=${productCode}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;
    const verifyResponse = await axios.get(verifyUrl);
    const verifyData = verifyResponse.data;

    if (verifyData.status !== 'COMPLETE') {
      // Update order as failed
      await Order.findOneAndUpdate(
        { transactionId: transaction_uuid },
        { paymentStatus: 'failed' }
      );
      return res.status(400).json({ success: false, message: 'Payment not completed', verifyData });
    }

    // 3. Mark order as paid
    const order = await Order.findOneAndUpdate(
      { transactionId: transaction_uuid },
      {
        paymentStatus: 'paid',
        esewaRefId: verifyData.ref_id || transaction_uuid,
        status: 'processing',
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Payment verified successfully', order });
  } catch (err) {
    console.error('eSewa verify error:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
