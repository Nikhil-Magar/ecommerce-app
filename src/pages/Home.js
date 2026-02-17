import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import db from '../db/indexedDB';
import './Home.css';

export default function Home() {
  const [categoryGroups, setCategoryGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDynamicContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDynamicContent = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const allProducts = await db.getAll('products');
      const activeProducts = allProducts.filter(p => p.status === 'active');

      // Group products by category
      const grouped = {};
      activeProducts.forEach(product => {
        if (!grouped[product.category]) {
          grouped[product.category] = [];
        }
        grouped[product.category].push(product);
      });

      setCategoryGroups(grouped);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  const getCategoryGradient = (index) => {
    const gradients = [
      'bg-indigo-purple-pink',
      'bg-amber-orange-red',
      'bg-emerald-teal-cyan',
      'bg-blue-indigo-violet'
    ];
    return gradients[index % gradients.length];
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
    <div className="main-content-wrapper">
      <section className="category-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {Object.keys(categoryGroups).length > 0 ? (
            Object.entries(categoryGroups).map(([category, products], index) => (
              <CategoryCard
                key={category}
                title={category}
                products={products.slice(0, 4)}
                bgGradientClass={getCategoryGradient(index)}
                category={category}
                totalProducts={products.length}
                navigate={navigate}
              />
            ))
          ) : (
            <div className="no-products-message">
              <p>No products available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const CategoryCard = ({ title, products, bgGradientClass, category, totalProducts, navigate }) => {
  return (
    <div className="category-card-modern">
      <div className="category-header-modern">
        <h3 className="category-title-modern">{title}</h3>
        <span className="product-count">{totalProducts} {totalProducts === 1 ? 'Product' : 'Products'}</span>
      </div>
      
      <div className="products-preview-grid">
        {products.map((product) => (
          <div key={product.id} className="product-preview-card">
            <div className="product-preview-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="product-no-image">
                  <span>📦</span>
                  <p>No Image</p>
                </div>
              )}
            </div>
            <div className="product-preview-info">
              <p className="product-preview-name">{product.name}</p>
              <p className="product-preview-price">${product.price}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        className={`category-discover-btn-modern ${bgGradientClass}`}
        onClick={() => navigate(`/category/${category}`)}
      >
        View All {title}
      </button>
    </div>
  );
};