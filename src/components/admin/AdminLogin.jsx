import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setLoading(true);
    setError('');

    console.log('Attempting login with:', formData.email);

    const result = await login(formData.email, formData.password);
    
    console.log('Login result:', result);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
    } else {
      console.log('Login successful! Redirecting...');
      // Success - AuthContext will handle redirect
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>🛍️</h1>
          <h2>Admin Panel</h2>
          <p>Sign in to manage your e-commerce store</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@ecommerce.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="demo-credentials">
            <p>Demo Credentials:</p>
            <p>Email: admin@ecommerce.com</p>
            <p>Password: admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;