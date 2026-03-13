import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import db from '../db/indexedDB';
import { useCart } from '../contexts/CartContext';
import './SearchResults.css';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [categories, setCategories] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    searchProducts();
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchProducts = async () => {
    setLoading(true);
    try {
      // Wait for DB initialization
      if (!db.db) await db.init();
      await new Promise(resolve => setTimeout(resolve, 100));

      const allProducts = await db.getAll('products');
      const activeProducts = allProducts.filter(p => p.status === 'active');

      // Search logic
      let searchResults = [];
      
      if (query.trim() === '') {
        searchResults = activeProducts;
      } else {
        const searchTerm = query.toLowerCase();
        searchResults = activeProducts.filter(product => {
          const nameMatch = product.name.toLowerCase().includes(searchTerm);
          const categoryMatch = product.category.toLowerCase().includes(searchTerm);
          const descMatch = product.description?.toLowerCase().includes(searchTerm) || false;
          const priceMatch = product.price.toString().includes(searchTerm);
          
          return nameMatch || categoryMatch || descMatch || priceMatch;
        });
      }

      // Get unique categories
      const uniqueCategories = [...new Set(activeProducts.map(p => p.category))];
      setCategories(uniqueCategories);

      setResults(searchResults);
      setLoading(false);
    } catch (error) {
      console.error('Error searching products:', error);
      setLoading(false);
    }
  };

  const checkUserLoggedIn = () => {
    const currentUser = localStorage.getItem('currentUser');
    const adminUser = localStorage.getItem('adminUser');
    return !!(currentUser || adminUser);
  };

  const handleAddToCart = (product) => {
    if (!checkUserLoggedIn()) {
      setAlertType('error');
      setAlertMessage('Please login to add items to cart');
      setShowAlert(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    addToCart(product, 1);
    setAlertType('success');
    setAlertMessage(`✅ ${product.name} added to cart!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getFilteredAndSortedResults = () => {
    let filtered = [...results];

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    // Filter by price range
    if (priceRange.min !== '') {
      filtered = filtered.filter(p => p.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== '') {
      filtered = filtered.filter(p => p.price <= parseFloat(priceRange.max));
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // relevance (keep original order)
        break;
    }

    return filtered;
  };

  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={index} className="highlight">{part}</mark>
        : part
    );
  };

  const clearFilters = () => {
    setFilterCategory('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('relevance');
  };

  const filteredResults = getFilteredAndSortedResults();

  if (loading) {
    return (
      <div className="search-loading">
        <div className="spinner"></div>
        <p>Searching products...</p>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      {/* Alert Notification */}
      {showAlert && (
        <div className={`alert-notification ${alertType}`}>
          {alertType === 'error' ? '⚠️' : '✅'} {alertMessage}
        </div>
      )}

      {/* Search Header */}
      <div className="search-header">
        <h1>Search Results</h1>
        {query && (
          <p className="search-query">
            Results for: <strong>"{query}"</strong>
          </p>
        )}
        <p className="results-count">
          {filteredResults.length} {filteredResults.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      <div className="search-container">
        {/* Sidebar Filters */}
        <aside className="search-sidebar">
          <div className="filter-section">
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="clear-filters" onClick={clearFilters}>
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <h4>Category</h4>
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                  className="price-input"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                  className="price-input"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <h4>Sort By</h4>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Search Results Grid */}
        <div className="search-results-content">
          {filteredResults.length > 0 ? (
            <div className="products-grid">
              {filteredResults.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="product-placeholder">
                        {getCategoryEmoji(product.category)}
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="out-of-stock-badge">Out of Stock</div>
                    )}
                  </div>
                  
                  <div className="product-details">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-name">
                      {highlightText(product.name, query)}
                    </h3>
                    <p className="product-description">
                      {product.description && highlightText(product.description, query)}
                    </p>
                    
                    <div className="product-footer">
                      <div className="product-price-section">
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
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h2>No products found</h2>
              <p>Try adjusting your search or filters</p>
              <div className="no-results-actions">
                <button onClick={() => navigate('/home')} className="browse-btn">
                  Browse All Products
                </button>
                {(filterCategory !== 'all' || priceRange.min || priceRange.max) && (
                  <button onClick={clearFilters} className="clear-filters-btn">
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const getCategoryEmoji = (category) => {
  const emojiMap = {
    'Electronics': '📱',
    'Books': '📚',
    'Sports': '⚽',
    'Clothing': '👕',
    'Home & Garden': '🏡'
  };
  return emojiMap[category] || '🛍️';
};
