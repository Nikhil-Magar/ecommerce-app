import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './PaymentResult.css';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [verifying, setVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    verifyPayment();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const verifyPayment = async () => {
    try {
      // Get payment data from URL parameters (eSewa callback)
      const data = searchParams.get('data');
      
      if (data) {
        // Decode base64 data from eSewa
        const decodedData = JSON.parse(atob(data));
        
        // Get pending order from localStorage
        const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder') || '{}');
        
        // Verify transaction UUID matches
        if (decodedData.transaction_uuid === pendingOrder.transactionUuid) {
          // Payment verified!
          setOrderDetails({
            transactionId: decodedData.transaction_code,
            transactionUuid: decodedData.transaction_uuid,
            amount: decodedData.total_amount / 100, // Convert from paisa to rupees
            status: decodedData.status,
            ...pendingOrder.orderDetails
          });
          
          // Clear cart
          clearCart();
          
          // Clear pending order
          localStorage.removeItem('pendingOrder');
          
          setVerifying(false);
        } else {
          throw new Error('Transaction mismatch');
        }
      } else {
        throw new Error('No payment data received');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setVerifying(false);
      // Redirect to failure page
      navigate('/payment/failure?error=verification_failed');
    }
  };

  if (verifying) {
    return (
      <div className="payment-result-page">
        <div className="result-card">
          <div className="loading-spinner"></div>
          <h2>Verifying Payment...</h2>
          <p>Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result-page success">
      <div className="result-card">
        <div className="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p className="result-message">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {orderDetails && (
          <div className="order-details">
            <h3>Order Details</h3>
            <div className="detail-row">
              <span>Transaction ID:</span>
              <span className="detail-value">{orderDetails.transactionId}</span>
            </div>
            <div className="detail-row">
              <span>Amount Paid:</span>
              <span className="detail-value">NPR {orderDetails.amount?.toFixed(2)}</span>
            </div>
            <div className="detail-row">
              <span>Payment Method:</span>
              <span className="detail-value">eSewa</span>
            </div>
            <div className="detail-row">
              <span>Status:</span>
              <span className="detail-value status-success">{orderDetails.status || 'Completed'}</span>
            </div>

            {orderDetails.customerInfo && (
              <>
                <h3>Shipping Information</h3>
                <div className="shipping-info">
                  <p><strong>{orderDetails.customerInfo.name}</strong></p>
                  <p>{orderDetails.customerInfo.email}</p>
                  <p>{orderDetails.customerInfo.phone}</p>
                  <p>{orderDetails.customerInfo.address}</p>
                  <p>{orderDetails.customerInfo.city} {orderDetails.customerInfo.postalCode}</p>
                </div>
              </>
            )}

            {orderDetails.items && (
              <>
                <h3>Items Ordered ({orderDetails.items.length})</h3>
                <div className="items-list">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="result-actions">
          <button className="primary-btn" onClick={() => navigate('/home')}>
            Continue Shopping
          </button>
          <button className="secondary-btn" onClick={() => window.print()}>
            Print Receipt
          </button>
        </div>

        <p className="email-note">
          📧 A confirmation email has been sent to your email address.
        </p>
      </div>
    </div>
  );
}
