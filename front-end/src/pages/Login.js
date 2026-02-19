import React, { useState } from 'react';
import db from '../db/indexedDB';
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Initialize database if needed
      if (!db.db) await db.init();

      // Find user by email
      const users = await db.getByIndex('users', 'email', formData.email);
      const user = users.find(u => u.password === formData.password && u.status === 'active');

      if (user) {
        // Save user to localStorage
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

        alert(`✅ Welcome back, ${user.name}!`);
        
        // Force page reload to update navbar
        window.location.href = '/';
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your account</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`auth-button ${loading ? 'disabled' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-links">
          <p className="auth-footer">
            Don't have an account?{' '}
            <a href="/signup" className="auth-link">Sign up here</a>
          </p>
          <p className="auth-footer">
            Admin?{' '}
            <a href="/admin/login" className="auth-link">Admin Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}