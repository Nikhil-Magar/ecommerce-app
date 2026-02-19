import React, { useState, useEffect } from 'react';
import db from '../../db/indexedDB';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    site_name: '',
    currency: '',
    tax_rate: '',
    shipping_fee: '',
    min_order: ''
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
    loadCategories();
  }, []);

  const loadSettings = async () => {
    try {
      const allSettings = await db.getAll('settings');
      const settingsObj = {};
      allSettings.forEach(s => {
        settingsObj[s.key] = s.value;
      });
      setSettings({
        site_name: settingsObj.site_name || '',
        currency: settingsObj.currency || 'USD',
        tax_rate: settingsObj.tax_rate || '0',
        shipping_fee: settingsObj.shipping_fee || '0',
        min_order: settingsObj.min_order || '0'
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadCategories = async () => {
    const data = await db.getAll('categories');
    setCategories(data);
  };

  const handleSettingChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage('');
    try {
      for (const [key, value] of Object.entries(settings)) {
        await db.update('settings', { key, value });
      }
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage('Error saving settings');
    }
    setSaving(false);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return;

    try {
      await db.add('categories', newCategory);
      setNewCategory({ name: '', description: '' });
      loadCategories();
      setMessage('Category added successfully!');
    } catch (error) {
      setMessage('Error adding category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await db.delete('categories', id);
      loadCategories();
    }
  };

  const handleClearDatabase = async () => {
    if (window.confirm('⚠️ This will delete ALL data including products, users, and orders. Are you absolutely sure?')) {
      if (window.confirm('Last chance! This action cannot be undone.')) {
        try {
          const stores = ['products', 'users', 'orders', 'analytics'];
          for (const store of stores) {
            const all = await db.getAll(store);
            for (const item of all) {
              await db.delete(store, item.id);
            }
          }
          setMessage('Database cleared successfully!');
        } catch (error) {
          setMessage('Error clearing database');
        }
      }
    }
  };

  return (
    <div className="settings">
      <h1>Settings</h1>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="settings-sections">
        {/* General Settings */}
        <div className="settings-section">
          <h2>General Settings</h2>
          <div className="settings-form">
            <div className="form-group">
              <label>Site Name</label>
              <input
                type="text"
                name="site_name"
                value={settings.site_name}
                onChange={handleSettingChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Currency</label>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleSettingChange}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tax Rate (%)</label>
                <input
                  type="number"
                  name="tax_rate"
                  value={settings.tax_rate}
                  onChange={handleSettingChange}
                  step="0.1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Shipping Fee ($)</label>
                <input
                  type="number"
                  name="shipping_fee"
                  value={settings.shipping_fee}
                  onChange={handleSettingChange}
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Minimum Order ($)</label>
                <input
                  type="number"
                  name="min_order"
                  value={settings.min_order}
                  onChange={handleSettingChange}
                  step="0.01"
                />
              </div>
            </div>

            <button 
              className="btn btn-primary"
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Category Management */}
        <div className="settings-section">
          <h2>Categories</h2>
          
          <form onSubmit={handleAddCategory} className="category-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
              <button type="submit" className="btn btn-primary">
                Add Category
              </button>
            </div>
          </form>

          <div className="categories-list">
            {categories.map(cat => (
              <div key={cat.id} className="category-item">
                <div>
                  <strong>{cat.name}</strong>
                  {cat.description && <p>{cat.description}</p>}
                </div>
                <button
                  className="btn btn-small btn-delete"
                  onClick={() => handleDeleteCategory(cat.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <h2>Danger Zone</h2>
          <p>These actions are irreversible. Proceed with caution.</p>
          <button 
            className="btn btn-danger"
            onClick={handleClearDatabase}
          >
            Clear All Database Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
