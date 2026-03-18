import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PaymentResult.css';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const errorType = searchParams.get('error') || 'unknown';

  const getErrorMessage = () => {
    switch (errorType) {
      case 'user_cancelled':
        return 'You cancelled the payment process.';
      case 'verification_failed':
        return 'Payment verification failed. Please try again.';
      case 'insufficient_balance':
        return 'Insufficient balance in your eSewa account.';
      case 'timeout':
        return 'Payment session timed out.';
      default:
        return 'Payment was not completed. Please try again.';
    }
  };

  const handleRetry = () => {
    navigate('/checkout');
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="payment-result-page failure">
      <div className="result-card">
        <div className="failure-icon">✗</div>
        <h1>Payment Failed</h1>
        <p className="result-message">
          {getErrorMessage()}
        </p>

        <div className="failure-details">
          <h3>What went wrong?</h3>
          <ul>
            <li>Your payment was not processed</li>
            <li>No amount was deducted from your account</li>
            <li>Your cart items are still saved</li>
          </ul>
        </div>

        <div className="help-section">
          <h3>Need Help?</h3>
          <p>If you're experiencing issues with payment:</p>
          <ul>
            <li>Check your eSewa account balance</li>
            <li>Verify your internet connection</li>
            <li>Try a different payment method</li>
            <li>Contact our support if the problem persists</li>
          </ul>
        </div>

        <div className="result-actions">
          <button className="primary-btn" onClick={handleRetry}>
            Try Again
          </button>
          <button className="secondary-btn" onClick={handleBackToCart}>
            Back to Cart
          </button>
        </div>

        <div className="support-contact">
          <p>Need assistance? Contact us at:</p>
          <p><strong>support@bagmati.com</strong></p>
          <p><strong>+977 98XXXXXXXX</strong></p>
        </div>
      </div>
    </div>
  );
}
