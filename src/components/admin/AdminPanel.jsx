import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Dashboard from './Dashboard';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import Settings from './Settings';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentUser, logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>🛍️ Admin Panel</h2>
        </div>
        
        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span className="nav-icon">📦</span>
            Products
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon">👥</span>
            Users
          </button>
          <button
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span className="nav-icon">📈</span>
            Analytics
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            Settings
          </button>
        </nav>

        <div className="admin-user-info">
          <div className="user-avatar">
            {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="user-details">
            <p className="user-name">{currentUser?.name || 'Admin'}</p>
            <p className="user-email">{currentUser?.email}</p>
          </div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;