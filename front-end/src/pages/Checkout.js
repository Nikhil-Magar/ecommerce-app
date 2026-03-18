import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CryptoJS from 'crypto-js';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
  };

  // eSewa v2 Configuration
  const ESEWA_CONFIG = {
    merchant_code: "EPAYTEST",
    secret_key: "8gBm/:&EnhH.1/q",
    success_url: `${window.location.origin}/payment/success`,
    failure_url: `${window.location.origin}/payment/failure`,
    payment_url: "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
  };

  // Generate HMAC-SHA256 signature
  const generateSignature = (message) => {
    const hash = CryptoJS.HmacSHA256(message, ESEWA_CONFIG.secret_key);
    return CryptoJS.enc.Base64.stringify(hash);
  };

  const handleEsewaPayment = () => {
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.13; // 13% VAT in Nepal
    const total = subtotal + tax;
    
    // Generate unique transaction UUID
    const transactionUuid = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate amounts (eSewa requires in paisa, multiply by 100)
    const totalAmount = Math.round(total * 100); // Convert to paisa
    const taxAmount = Math.round(tax * 100);
    const productServiceCharge = 0;
    const productDeliveryCharge = 0;
    const amount = totalAmount - taxAmount - productServiceCharge - productDeliveryCharge;
    
    // Create message for signature
    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_CONFIG.merchant_code}`;
    
    // Generate signature
    const signature = generateSignature(message);
    
    // Create form data
    const esewaPayload = {
      amount: amount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: ESEWA_CONFIG.merchant_code,
      product_service_charge: productServiceCharge,
      product_delivery_charge: productDeliveryCharge,
      success_url: ESEWA_CONFIG.success_url,
      failure_url: ESEWA_CONFIG.failure_url,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: signature
    };
    
    // Store order details
    localStorage.setItem('pendingOrder', JSON.stringify({
      transactionUuid,
      orderDetails: {
        items: cartItems,
        customerInfo: formData,
        amounts: {
          subtotal,
          tax,
          total
        }
      },
      timestamp: Date.now()
    }));
    
    // Submit form to eSewa
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = ESEWA_CONFIG.payment_url;
    
    Object.keys(esewaPayload).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = esewaPayload[key];
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
  };

  const handleCheckout = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('❌ Please fill in all required fields');
      return;
    }

    if (!selectedPayment) {
      alert('❌ Please select a payment method');
      return;
    }

    setProcessing(true);

    if (selectedPayment === 'eSewa') {
      handleEsewaPayment();
    } else {
      alert(`${selectedPayment} integration coming soon! For now, please use eSewa.`);
      setProcessing(false);
    }
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.13; // 13% VAT
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products before checkout</p>
        <button onClick={() => navigate('/home')} className="continue-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-container">
        {/* Left Side - Shipping Information */}
        <div className="checkout-form-section">
          <h2>Shipping Information</h2>
          <form onSubmit={handleCheckout} className="checkout-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ram Sharma"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ram@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="98XXXXXXXX"
                required
              />
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street Address"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Kathmandu"
                  required
                />
              </div>

              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="44600"
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-section">
              <h2>Payment Method</h2>
              <div className="payment-methods">
                <div 
                  className={`payment-option ${selectedPayment === 'eSewa' ? 'selected' : ''}`}
                  onClick={() => handlePaymentSelect('eSewa')}
                >
                  <div className="payment-logo esewa-logo">
                    <span className="payment-icon">💳</span>
                    <span className="payment-name">eSewa</span>
                  </div>
                  {selectedPayment === 'eSewa' && <span className="check-mark">✓</span>}
                  <span className="payment-badge">LIVE</span>
                </div>

                <div 
                  className={`payment-option ${selectedPayment === 'Khalti' ? 'selected' : ''} disabled`}
                  onClick={() => handlePaymentSelect('Khalti')}
                >
                  <div className="payment-logo khalti-logo">
                    <span className="payment-icon">💰</span>
                    <span className="payment-name">Khalti</span>
                  </div>
                  {selectedPayment === 'Khalti' && <span className="check-mark">✓</span>}
                  <span className="payment-badge coming-soon">Coming Soon</span>
                </div>

                <div 
                  className={`payment-option ${selectedPayment === 'fonepay' ? 'selected' : ''} disabled`}
                  onClick={() => handlePaymentSelect('fonepay')}
                >
                  <div className="payment-logo fonepay-logo">
                    <span className="payment-icon">📱</span>
                    <span className="payment-name">fonepay</span>
                  </div>
                  {selectedPayment === 'fonepay' && <span className="check-mark">✓</span>}
                  <span className="payment-badge coming-soon">Coming Soon</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="place-order-btn"
              disabled={processing}
            >
              {processing ? 'Processing...' : `Pay with ${selectedPayment || 'Selected Method'} - NPR ${total.toFixed(2)}`}
            </button>

            {selectedPayment === 'eSewa' && (
              <div className="payment-info">
                <p className="info-text">
                  ✓ Secure payment powered by eSewa<br/>
                  ✓ You will be redirected to eSewa payment page<br/>
                  ✓ Complete payment and return to see your order
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Right Side - Order Summary */}
        <div className="order-summary-section">
          <h2>Order Summary</h2>
          
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-quantity">Qty: {item.quantity}</p>
                </div>
                <p className="item-price">NPR {item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>NPR {subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>VAT (13%)</span>
              <span>NPR {tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>NPR {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}