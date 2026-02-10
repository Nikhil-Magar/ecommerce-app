import React from 'react';
import './Home.css';

export default function Home() {
  const categories = {
    wireless: [
      { name: 'Smartphones', image: '📱', colorClass: 'bg-blue-gradient' },
      { name: 'Watches', image: '⌚', colorClass: 'bg-purple-gradient' },
      { name: 'Headphones', image: '🎧', colorClass: 'bg-pink-gradient' },
      { name: 'Tablets', image: '📱', colorClass: 'bg-indigo-gradient' }
    ],
    travel: [
      { name: 'Backpacks', image: '🎒', colorClass: 'bg-amber-gradient' },
      { name: 'Suitcases', image: '🧳', colorClass: 'bg-yellow-gradient' },
      { name: 'Accessories', image: '💼', colorClass: 'bg-orange-gradient' },
      { name: 'Handbags', image: '👜', colorClass: 'bg-red-gradient' }
    ],
    topDeals: [
      { name: 'Books', image: '📚', colorClass: 'bg-green-gradient' },
      { name: 'Fashion', image: '🧥', colorClass: 'bg-rose-gradient' },
      { name: 'PC', image: '💻', colorClass: 'bg-cyan-gradient' },
      { name: 'Beauty', image: '💄', colorClass: 'bg-fuchsia-gradient' }
    ],
    pcSetup: [
      { name: 'Laptops', image: '💻', colorClass: 'bg-slate-gradient' },
      { name: 'PCs', image: '🖥️', colorClass: 'bg-gray-gradient' },
      { name: 'Hard Drives', image: '💾', colorClass: 'bg-zinc-gradient' },
      { name: 'Monitors', image: '🖥️', colorClass: 'bg-stone-gradient' }
    ]
  };

  const books = [
    { title: 'The Myth Gap', author: 'William Macaskill', color: '#4ECDC4' },
    { title: 'The Doorway', author: 'Toby Ord', color: '#2C2C2C' },
    { title: 'The Current Thing', author: 'Max Tegmark', color: '#9333EA' },
    { title: 'Empty Planet', author: 'Brian Christian', color: '#F0F4F8' },
    { title: 'What We Owe', author: 'Oliver Burkeman', color: '#FDE047' },
    { title: 'Humankind', author: 'Rutger Bregman', color: '#86EFAC' },
    { title: 'The Future', author: 'William Macaskill', color: '#0F172A' },
    { title: 'Understanding Universe', author: 'Steve Williams', color: '#F5F5F5' }
  ];

  return (
    <div className="main-content-wrapper">
      {/* Book Carousel Section */}
      <section className="book-carousel-section">
        <div className="book-carousel-container">
          <h2 className="book-carousel-title">Featured Books</h2>
          <div className="book-carousel-wrapper">
            {books.map((book, idx) => (
              <div
                key={idx}
                className="book-card"
                style={{ backgroundColor: book.color }}
              >
                <div className="book-card-content">
                  <div className={['#FDE047', '#F0F4F8', '#86EFAC', '#F5F5F5'].includes(book.color) ? 'book-card-text-light' : 'book-card-text-dark'}>
                    <div className="book-card-title">{book.title}</div>
                    <div className="book-card-author">{book.author}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Category Grid */}
      <section className="category-section">
        <div className="category-grid">
          {/* Wireless Tech */}
          <CategoryCard
            title="Wireless Tech"
            items={categories.wireless}
            bgGradientClass="bg-indigo-purple-pink"
          />

          {/* Travel Essentials */}
          <CategoryCard
            title="Most-loved travel essentials"
            items={categories.travel}
            bgGradientClass="bg-amber-orange-red"
          />

          {/* Top Categories */}
          <CategoryCard
            title="Deals on top categories"
            items={categories.topDeals}
            bgGradientClass="bg-emerald-teal-cyan"
          />

          {/* PC Setup */}
          <CategoryCard
            title="Level up your PC here"
            items={categories.pcSetup}
            bgGradientClass="bg-blue-indigo-violet"
          />
        </div>
      </section>

      {/* Additional Content Sections */}
      <section className="category-section">
        <div className="category-grid">
          {/* Most-loved watches */}
          <FeatureCard
            title="Most-loved watches"
            bgColorClass="bg-slate-light"
          />

          {/* Home & Kitchen essentials */}
          <FeatureCard
            title="Home & Kitchen essentials"
            bgColorClass="bg-orange-light"
          />

          {/* Home decor - Top deals */}
          <FeatureCard
            title="Home decor - Top deals"
            bgColorClass="bg-green-light"
          />

          {/* Score the PCs & accessories */}
          <FeatureCard
            title="Score the PCs & accessories"
            bgColorClass="bg-blue-light"
          />
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
          {items.map((item, idx) => (
            <div key={idx} className="category-item">
              <div className={`category-item-image ${item.colorClass}`}>
                <span className="category-item-emoji">{item.image}</span>
              </div>
              <p className="category-item-name">{item.name}</p>
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

const FeatureCard = ({ title, bgColorClass }) => {
  return (
    <div className={`feature-card ${bgColorClass}`}>
      <div className="feature-card-content">
        <h3 className="feature-card-title">{title}</h3>
        <div className="feature-card-image-wrapper">
          <span className="feature-card-placeholder">🖼️</span>
        </div>
        <button className="feature-card-link">See more</button>
      </div>
    </div>
  );
};