import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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

  const handleCheckout = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('❌ Please fill in all required fields');
      return;
    }

    if (!selectedPayment) {
      alert('❌ Please select a payment method');
      return;
    }

    // Show payment modal
    setShowPaymentModal(true);
  };

  const simulatePayment = () => {
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setShowPaymentModal(false);
      
      // Show success message
      alert(`✅ Payment successful via ${selectedPayment}!\n\nOrder Details:\nTotal: NPR ${(getTotalPrice() * 1.1 * 132).toFixed(2)}\nItems: ${cartItems.length}\n\nThank you for your purchase!`);
      
      // Clear cart
      clearCart();
      
      // Redirect to home
      navigate('/home');
    }, 3000);
  };

  const cancelPayment = () => {
    setShowPaymentModal(false);
    setProcessing(false);
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const totalNPR = total * 132; // Convert to NPR (approximate)

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
                </div>

                <div 
                  className={`payment-option ${selectedPayment === 'Khalti' ? 'selected' : ''}`}
                  onClick={() => handlePaymentSelect('Khalti')}
                >
                  <div className="payment-logo khalti-logo">
                    <span className="payment-icon">💰</span>
                    <span className="payment-name">Khalti</span>
                  </div>
                  {selectedPayment === 'Khalti' && <span className="check-mark">✓</span>}
                </div>

                <div 
                  className={`payment-option ${selectedPayment === 'fonepay' ? 'selected' : ''}`}
                  onClick={() => handlePaymentSelect('fonepay')}
                >
                  <div className="payment-logo fonepay-logo">
                    <span className="payment-icon">📱</span>
                    <span className="payment-name">fonepay</span>
                  </div>
                  {selectedPayment === 'fonepay' && <span className="check-mark">✓</span>}
                </div>
              </div>
            </div>

            <button type="submit" className="place-order-btn">
              Place Order - NPR {totalNPR.toFixed(2)}
            </button>
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
                <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total (USD)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row total-npr">
              <span>Total (NPR)</span>
              <span>NPR {totalNPR.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className={`payment-modal-header ${selectedPayment.toLowerCase()}-header`}>
              <h2>{selectedPayment} Payment</h2>
              {!processing && (
                <button className="modal-close" onClick={cancelPayment}>×</button>
              )}
            </div>

            <div className="payment-modal-body">
              {processing ? (
                <div className="processing-payment">
                  <div className="payment-spinner"></div>
                  <p>Processing payment...</p>
                  <p className="payment-amount">NPR {totalNPR.toFixed(2)}</p>
                </div>
              ) : (
                <div className="payment-simulation">
                  <div className="payment-details">
                    <h3>Payment Details</h3>
                    <div className="detail-row">
                      <span>Merchant:</span>
                      <span>Bagmati E-commerce</span>
                    </div>
                    <div className="detail-row">
                      <span>Amount:</span>
                      <span className="amount-highlight">NPR {totalNPR.toFixed(2)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Payment Method:</span>
                      <span>{selectedPayment}</span>
                    </div>
                  </div>

                  <div className="simulation-note">
                    <p>🔔 This is a simulated payment for local testing</p>
                    <p>No real money will be charged</p>
                  </div>

                  <div className="mock-credentials">
                    <p><strong>Test Credentials:</strong></p>
                    <p>Phone: 9800000000</p>
                    <p>PIN: 1234</p>
                  </div>

                  <div className="payment-actions">
                    <button className="pay-btn" onClick={simulatePayment}>
                      Pay Now
                    </button>
                    <button className="cancel-btn" onClick={cancelPayment}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}