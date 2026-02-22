import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import db from '../db/indexedDB';
import { useCart } from '../contexts/CartContext';
import './CategoryPage.css';

export default function CategoryPage() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    loadCategoryProducts();
  }, [categoryName]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategoryProducts = async () => {
    try {
      if (!db.db) await db.init();
      
      const allProducts = await db.getAll('products');
      const categoryProducts = allProducts.filter(
        p => p.category === categoryName && p.status === 'active'
      );
      
      setProducts(categoryProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  const checkUserLoggedIn = () => {
    const currentUser = localStorage.getItem('currentUser');
    const adminUser = localStorage.getItem('adminUser');
    return !!(currentUser || adminUser);
  };

  const handleAddToCart = (product) => {
    // Check if user is logged in
    if (!checkUserLoggedIn()) {
      setAlertType('error');
      setAlertMessage('Please login to add items to cart');
      setShowAlert(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    // Add to cart
    addToCart(product, 1);
    setAlertType('success');
    setAlertMessage(`✅ ${product.name} added to cart!`);
    setShowAlert(true);
    
    // Hide alert after 3 seconds
    setTimeout(() => setShowAlert(false), 3000);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Alert Notification */}
      {showAlert && (
        <div className={`alert-notification ${alertType}`}>
          {alertType === 'error' ? '⚠️' : '✅'} {alertMessage}
        </div>
      )}

      <div className="category-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          ← Back to Home
        </button>
        <h1>{categoryName}</h1>
        <p>{products.length} products available</p>
      </div>

      {products.length > 0 ? (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="product-placeholder">
                    {getProductEmoji(product.category)}
                  </div>
                )}
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price}</span>
                  <span className="product-stock">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <button 
                  className={`add-to-cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 
                    ? isInCart(product.id) 
                      ? '✓ In Cart' 
                      : '🛒 Add to Cart'
                    : 'Out of Stock'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-products">
          <p>No products available in this category yet.</p>
          <button className="back-button" onClick={() => navigate('/home')}>
            Browse Other Categories
          </button>
        </div>
      )}
    </div>
  );
}

const getProductEmoji = (category) => {
  const emojiMap = {
    'Electronics': '📱',
    'Books': '📚',
    'Sports': '⚽',
    'Clothing': '👕',
    'Home & Garden': '🏡'
  };
  return emojiMap[category] || '🛍️';
};