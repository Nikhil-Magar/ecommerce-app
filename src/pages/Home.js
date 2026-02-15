import React, { useState, useEffect } from 'react';
import db from '../db/indexedDB';
import './Home.css';

export default function Home() {
  const [categories, setCategories] = useState({
    wireless: [],
    travel: [],
    topDeals: [],
    pcSetup: []
  });
  const [books, setBooks] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDynamicContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDynamicContent = async () => {
    try {
      // Wait a moment for App.js to initialize the database
      await new Promise(resolve => setTimeout(resolve, 200));

      // Fetch all products (database already initialized in App.js)
      const allProducts = await db.getAll('products');

      // If no products exist, seed the database
      if (allProducts.length === 0) {
        await db.seedInitialData();
        // Fetch again after seeding
        const newProducts = await db.getAll('products');
        organizeProducts(newProducts);
      } else {
        organizeProducts(allProducts);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  const organizeProducts = (allProducts) => {
    // Organize products by category
    const wireless = allProducts.filter(p => 
      ['Electronics', 'Smartphones', 'Watches', 'Headphones', 'Tablets'].includes(p.category)
    ).slice(0, 4);

    const travel = allProducts.filter(p => 
      ['Travel', 'Backpacks', 'Suitcases', 'Accessories'].includes(p.category)
    ).slice(0, 4);

    const topDeals = allProducts.filter(p => 
      p.status === 'active' && p.stock > 0
    ).sort((a, b) => b.price - a.price).slice(0, 4);

    const pcSetup = allProducts.filter(p => 
      ['Electronics', 'PC', 'Laptops', 'Monitors'].includes(p.category)
    ).slice(0, 4);

    // For books category - filter by Books category
    const bookProducts = allProducts.filter(p => p.category === 'Books').slice(0, 8);

    setCategories({
      wireless: wireless.map(p => ({
        id: p.id,
        name: p.name,
        image: getProductEmoji(p.category || p.name),
        colorClass: getRandomGradient(),
        price: p.price,
        product: p
      })),
      travel: travel.map(p => ({
        id: p.id,
        name: p.name,
        image: getProductEmoji(p.category || p.name),
        colorClass: getRandomGradient(),
        price: p.price,
        product: p
      })),
      topDeals: topDeals.map(p => ({
        id: p.id,
        name: p.name,
        image: getProductEmoji(p.category || p.name),
        colorClass: getRandomGradient(),
        price: p.price,
        product: p
      })),
      pcSetup: pcSetup.map(p => ({
        id: p.id,
        name: p.name,
        image: getProductEmoji(p.category || p.name),
        colorClass: getRandomGradient(),
        price: p.price,
        product: p
      }))
    });

    setBooks(bookProducts.map(p => ({
      id: p.id,
      title: p.name,
      author: p.description || 'Unknown Author',
      color: getRandomColor(),
      price: p.price,
      product: p
    })));

    // Featured products for additional sections
    setFeaturedProducts(allProducts.filter(p => p.status === 'active').slice(0, 4));
  };

  // Helper function to get emoji based on category/product name
  const getProductEmoji = (text) => {
    const emojiMap = {
      'Smartphones': '📱',
      'Watches': '⌚',
      'Headphones': '🎧',
      'Tablets': '📱',
      'Backpacks': '🎒',
      'Suitcases': '🧳',
      'Accessories': '💼',
      'Handbags': '👜',
      'Books': '📚',
      'Fashion': '🧥',
      'PC': '💻',
      'Beauty': '💄',
      'Laptops': '💻',
      'PCs': '🖥️',
      'Hard Drives': '💾',
      'Monitors': '🖥️',
      'Electronics': '📱',
      'Clothing': '👕',
      'Home & Garden': '🏡',
      'Sports': '⚽'
    };

    // Check if text contains any key
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (text.toLowerCase().includes(key.toLowerCase())) {
        return emoji;
      }
    }
    return '🛍️'; // Default emoji
  };

  // Helper function to get random gradient class
  const getRandomGradient = () => {
    const gradients = [
      'bg-blue-gradient',
      'bg-purple-gradient',
      'bg-pink-gradient',
      'bg-indigo-gradient',
      'bg-amber-gradient',
      'bg-yellow-gradient',
      'bg-orange-gradient',
      'bg-red-gradient',
      'bg-green-gradient',
      'bg-rose-gradient',
      'bg-cyan-gradient',
      'bg-fuchsia-gradient',
      'bg-slate-gradient',
      'bg-gray-gradient',
      'bg-zinc-gradient',
      'bg-stone-gradient'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // Helper function to get random color for book cards
  const getRandomColor = () => {
    const colors = [
      '#4ECDC4', '#2C2C2C', '#9333EA', '#F0F4F8',
      '#FDE047', '#86EFAC', '#0F172A', '#F5F5F5',
      '#FF6B6B', '#4DABF7', '#51CF66', '#FFA94D'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
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
      {/* Book Carousel Section */}
      {books.length > 0 && (
        <section className="book-carousel-section">
          <div className="book-carousel-container">
            <h2 className="book-carousel-title">Featured Books</h2>
            <div className="book-carousel-wrapper">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="book-card"
                  style={{ backgroundColor: book.color }}
                >
                  <div className="book-card-content">
                    <div className={['#FDE047', '#F0F4F8', '#86EFAC', '#F5F5F5'].includes(book.color) ? 'book-card-text-light' : 'book-card-text-dark'}>
                      <div className="book-card-title">{book.title}</div>
                      <div className="book-card-author">{book.author}</div>
                      <div className="book-card-price">${book.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Category Grid */}
      <section className="category-section">
        <div className="category-grid">
          {/* Wireless Tech */}
          {categories.wireless.length > 0 && (
            <CategoryCard
              title="Wireless Tech"
              items={categories.wireless}
              bgGradientClass="bg-indigo-purple-pink"
            />
          )}

          {/* Travel Essentials */}
          {categories.travel.length > 0 && (
            <CategoryCard
              title="Most-loved travel essentials"
              items={categories.travel}
              bgGradientClass="bg-amber-orange-red"
            />
          )}

          {/* Top Categories */}
          {categories.topDeals.length > 0 && (
            <CategoryCard
              title="Deals on top categories"
              items={categories.topDeals}
              bgGradientClass="bg-emerald-teal-cyan"
            />
          )}

          {/* PC Setup */}
          {categories.pcSetup.length > 0 && (
            <CategoryCard
              title="Level up your PC here"
              items={categories.pcSetup}
              bgGradientClass="bg-blue-indigo-violet"
            />
          )}
        </div>
      </section>

      {/* Additional Content Sections */}
      <section className="category-section">
        <div className="category-grid">
          {featuredProducts.map((product, idx) => (
            <FeatureCard
              key={product.id}
              title={product.name}
              product={product}
              bgColorClass={['bg-slate-light', 'bg-orange-light', 'bg-green-light', 'bg-blue-light'][idx % 4]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

const CategoryCard = ({ title, items, bgGradientClass }) => {
  return (
    <div className="category-card">
      <div className="category-card-content">
        <h3 className="category-card-title">{title}</h3>
        
        <div className="category-items-grid">
          {items.map((item) => (
            <div key={item.id} className="category-item">
              <div className={`category-item-image ${item.colorClass}`}>
                <span className="category-item-emoji">{item.image}</span>
              </div>
              <p className="category-item-name">{item.name}</p>
              {item.price && (
                <p className="category-item-price">${item.price}</p>
              )}
            </div>
          ))}
        </div>

        <button className={`category-discover-btn ${bgGradientClass}`}>
          Discover more
        </button>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, product, bgColorClass }) => {
  return (
    <div className={`feature-card ${bgColorClass}`}>
      <div className="feature-card-content">
        <h3 className="feature-card-title">{title}</h3>
        <div className="feature-card-image-wrapper">
          {product?.image ? (
            <img src={product.image} alt={title} className="feature-card-image" />
          ) : (
            <span className="feature-card-placeholder">🖼️</span>
          )}
        </div>
        {product?.price && (
          <p className="feature-card-price">${product.price}</p>
        )}
        <button className="feature-card-link">See more</button>
      </div>
    </div>
  );
};