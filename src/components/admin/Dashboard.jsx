import React, { useState, useEffect } from 'react';
import db from '../../db/indexedDB';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStock: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Wait for database to be ready
      if (!db.db) {
        await db.init();
      }

      const products = await db.getAll('products');
      const users = await db.getAll('users');
      const orders = await db.getAll('orders');

      const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const lowStockProducts = products.filter(p => p.stock < 10).length;
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        lowStock: lowStockProducts,
        recentOrders
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-details">
            <h3>Total Products</h3>
            <p className="stat-number">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-details">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-details">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-details">
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Alerts</h2>
          <div className="alert-box">
            {stats.lowStock > 0 ? (
              <div className="alert warning">
                ⚠️ {stats.lowStock} product(s) running low on stock
              </div>
            ) : (
              <div className="alert success">
                ✓ All products have sufficient stock
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Orders</h2>
          <div className="recent-orders">
            {stats.recentOrders.length > 0 ? (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customerName || 'N/A'}</td>
                      <td>${order.total?.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;