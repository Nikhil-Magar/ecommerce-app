import React, { useState, useEffect, useCallback } from 'react';
import db from '../../db/indexedDB';
import './Analytics.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    salesData: [],
    topProducts: [],
    categoryBreakdown: {},
    ordersByStatus: {},
    revenueByMonth: [],
    averageOrderValue: 0
  });

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  // ✅ Wrapped in useCallback (Fixes ESLint warning)
  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      const products = await db.getAll('products');
      const orders = await db.getAll('orders');

      // Calculate date range
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

      // Filter orders by time range
      const filteredOrders = orders.filter(order =>
        new Date(order.createdAt) >= daysAgo
      );

      // ===== Top Products =====
      const productSales = {};
      filteredOrders.forEach(order => {
        order.items?.forEach(item => {
          productSales[item.productId] =
            (productSales[item.productId] || 0) + item.quantity;
        });
      });

      const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([productId, quantity]) => {
          const product = products.find(p => p.id === parseInt(productId));
          return {
            name: product?.name || 'Unknown',
            quantity,
            revenue: quantity * (product?.price || 0)
          };
        });

      // ===== Category Breakdown =====
      const categoryBreakdown = {};
      products.forEach(product => {
        const category = product.category || 'Uncategorized';
        categoryBreakdown[category] =
          (categoryBreakdown[category] || 0) + 1;
      });

      // ===== Orders By Status =====
      const ordersByStatus = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };

      filteredOrders.forEach(order => {
        const status = order.status || 'pending';
        ordersByStatus[status] =
          (ordersByStatus[status] || 0) + 1;
      });

      // ===== Average Order Value =====
      const totalRevenue = filteredOrders.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      );

      const avgOrderValue =
        filteredOrders.length > 0
          ? totalRevenue / filteredOrders.length
          : 0;

      // ===== Revenue By Month (Last 6 Months) =====
      const revenueByMonth = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);

        const monthName = date.toLocaleString('default', {
          month: 'short'
        });

        const monthOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate.getMonth() === date.getMonth() &&
            orderDate.getFullYear() === date.getFullYear()
          );
        });

        const revenue = monthOrders.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        );

        revenueByMonth.push({ month: monthName, revenue });
      }

      // ===== Set Final Analytics =====
      setAnalytics({
        salesData: filteredOrders,
        topProducts,
        categoryBreakdown,
        ordersByStatus,
        revenueByMonth,
        averageOrderValue: avgOrderValue
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setLoading(false);
    }
  }, [timeRange]);

  // ✅ Correct dependency
  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  const maxRevenue = Math.max(
    ...analytics.revenueByMonth.map(m => m.revenue),
    1
  );

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h1>Analytics & Insights</h1>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-range-select"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      <div className="analytics-grid">

        {/* Revenue Chart */}
        <div className="analytics-card full-width">
          <h3>Revenue Trend</h3>

          <div className="chart">
            <div className="bar-chart">
              {analytics.revenueByMonth.map((data, idx) => (
                <div key={idx} className="bar-item">
                  <div
                    className="bar"
                    style={{
                      height: `${(data.revenue / maxRevenue) * 100}%`,
                      minHeight: data.revenue > 0 ? '5%' : '0%'
                    }}
                  >
                    <span className="bar-value">
                      ${data.revenue.toFixed(0)}
                    </span>
                  </div>

                  <span className="bar-label">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="analytics-card">
          <h3>Top Products</h3>

          <div className="top-products-list">
            {analytics.topProducts.length > 0 ? (
              analytics.topProducts.map((product, idx) => (
                <div key={idx} className="product-item">
                  <div className="product-rank">
                    #{idx + 1}
                  </div>

                  <div className="product-details">
                    <strong>{product.name}</strong>
                    <p>
                      {product.quantity} sold · $
                      {product.revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">
                No sales data available
              </p>
            )}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="analytics-card">
          <h3>Orders by Status</h3>

          <div className="status-breakdown">
            {Object.entries(analytics.ordersByStatus).map(
              ([status, count]) => (
                <div key={status} className="status-item">
                  <span className={`status-badge ${status}`}>
                    {status}
                  </span>
                  <span className="status-count">
                    {count}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="analytics-card">
          <h3>Products by Category</h3>

          <div className="category-breakdown">
            {Object.entries(
              analytics.categoryBreakdown
            ).map(([category, count]) => (
              <div key={category} className="category-item">

                <div className="category-info">
                  <span className="category-name">
                    {category}
                  </span>
                  <span className="category-count">
                    {count} products
                  </span>
                </div>

                <div className="category-bar">
                  <div
                    className="category-fill"
                    style={{
                      width: `${
                        (count /
                          Math.max(
                            ...Object.values(
                              analytics.categoryBreakdown
                            )
                          )) *
                        100
                      }%`
                    }}
                  />
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="analytics-card">
          <h3>Key Metrics</h3>

          <div className="metrics-list">
            <div className="metric-item">
              <span className="metric-label">
                Average Order Value
              </span>
              <span className="metric-value">
                ${analytics.averageOrderValue.toFixed(2)}
              </span>
            </div>

            <div className="metric-item">
              <span className="metric-label">
                Total Orders
              </span>
              <span className="metric-value">
                {analytics.salesData.length}
              </span>
            </div>

            <div className="metric-item">
              <span className="metric-label">
                Total Revenue
              </span>
              <span className="metric-value">
                $
                {analytics.salesData
                  .reduce(
                    (sum, order) =>
                      sum + (order.total || 0),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Analytics;
