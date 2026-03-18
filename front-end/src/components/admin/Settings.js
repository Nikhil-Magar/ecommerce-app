import React, { useState } from 'react';
import './Settings.css';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'Bagmati',
    currency: 'NPR (Rs)',
    taxRate: 13,
    minimumOrder: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings to localStorage or send to backend
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    alert('✅ Settings saved successfully!');
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>
      
      <form onSubmit={handleSubmit} className="settings-form">
        {/* Site Name */}
        <div className="form-group">
          <label>Site Name</label>
          <input
            type="text"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter site name"
          />
        </div>

        <div className="form-row">
          {/* Currency Selector */}
          <div className="form-group">
            <label>Currency</label>
            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="form-control"
            >
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
              <option value="INR (₹)">INR (₹)</option>
              <option value="NPR (Rs)">NPR (Rs)</option>
            </select>
          </div>

          {/* Tax Rate */}
          <div className="form-group">
            <label>Tax Rate (%)</label>
            <input
              type="number"
              name="taxRate"
              value={settings.taxRate}
              onChange={handleChange}
              className="form-control"
              placeholder="13"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
        </div>

        {/* Minimum Order */}
        <div className="form-group">
          <label>Minimum Order ({settings.currency.split(' ')[1] || '$'})</label>
          <input
            type="number"
            name="minimumOrder"
            value={settings.minimumOrder}
            onChange={handleChange}
            className="form-control"
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>

        {/* Save Button */}
        <button type="submit" className="save-settings-btn">
          Save Settings
        </button>
      </form>

      {/* Categories Section */}
      <div className="categories-section">
        <h3>Categories</h3>
        <div className="categories-info">
          <p>Manage your product categories in the Products section</p>
          <button 
            onClick={() => window.location.href = '#products'}
            className="manage-categories-btn"
          >
            Manage Categories
          </button>
        </div>
      </div>
    </div>
  );
}