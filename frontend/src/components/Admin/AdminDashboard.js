import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../api';
import './AdminDashboard.css';

const StatCard = ({ icon, title, value, sub, color }) => (
  <div className="stat-card card" style={{ borderTop: `3px solid ${color}` }}>
    <div className="stat-icon" style={{ background: `${color}15`, color }}>{icon}</div>
    <div>
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner" style={{ minHeight: '60vh' }}><div className="spinner"></div></div>;

  const orderStatusMap = {};
  stats?.ordersByStatus?.forEach(s => { orderStatusMap[s._id] = s.count; });

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to the admin panel</p>
      </div>

      <div className="stats-grid">
        <StatCard icon="👥" title="Total Users" value={stats?.totalUsers?.toLocaleString()} color="#6366f1" />
        <StatCard icon="📦" title="Total Orders" value={stats?.totalOrders?.toLocaleString()} color="#f59e0b" />
        <StatCard icon="💰" title="Total Revenue" value={`$${(stats?.totalRevenue || 0).toFixed(2)}`} color="#10b981" />
        <StatCard icon="🛒" title="Avg Order Value" value={`$${(stats?.avgOrderValue || 0).toFixed(2)}`} color="var(--accent)" />
      </div>

      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="card recent-orders">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="see-all">View all →</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map(order => (
                <tr key={order._id}>
                  <td><Link to={`/admin/orders/${order._id}`} className="order-link">{order.orderNumber}</Link></td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td>${order.totalAmount?.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${order.orderStatus === 'delivered' ? 'success' : order.orderStatus === 'cancelled' ? 'danger' : 'info'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="card top-products">
          <div className="card-header">
            <h3>Top Products</h3>
          </div>
          {stats?.topProducts?.map((p, i) => (
            <div key={p._id} className="top-product-row">
              <span className="rank">#{i+1}</span>
              <div className="top-product-info">
                <strong>{p.name}</strong>
                <span>{p.totalSold} sold</span>
              </div>
              <strong className="top-product-revenue">${p.revenue?.toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Order Status Summary */}
      <div className="card order-status-summary">
        <h3>Orders by Status</h3>
        <div className="status-grid">
          {['pending','confirmed','processing','shipped','delivered','cancelled'].map(status => (
            <div key={status} className="status-stat">
              <span className="status-count">{orderStatusMap[status] || 0}</span>
              <span className="status-label">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
        <Link to="/admin/products" className="btn btn-secondary">Manage Products</Link>
        <Link to="/admin/orders" className="btn btn-secondary">Manage Orders</Link>
        <Link to="/admin/users" className="btn btn-secondary">Manage Users</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
