import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getAllOrders, getOrder, updateOrderStatus } from '../../api';
import { toast } from 'react-toastify';
import './AdminOrders.css';

const STATUS_COLORS = {
  pending: 'warning', confirmed: 'info', processing: 'info',
  shipped: 'info', delivered: 'success', cancelled: 'danger', refunded: 'secondary'
};

const ORDER_STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];

export const AdminOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filterStatus, setFilterStatus] = useState('');

  const fetchOrders = async (p = 1, status = '') => {
    setLoading(true);
    try {
      const params = { page: p, limit: 15 };
      if (status) params.status = status;
      const res = await getAllOrders(params);
      setOrders(res.data.orders);
      setStats(res.data.stats);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(page, filterStatus); }, [page, filterStatus]);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2>Orders</h2>
          <p>Total Revenue: ${(stats.totalRevenue || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="status-filter">
        <button className={`status-filter-btn ${!filterStatus ? 'active' : ''}`} onClick={() => { setFilterStatus(''); setPage(1); }}>All</button>
        {ORDER_STATUSES.map(s => (
          <button key={s} className={`status-filter-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => { setFilterStatus(s); setPage(1); }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : (
        <>
          <div className="card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td><span className="order-num">{order.orderNumber}</span></td>
                    <td>
                      <p className="customer-name">{order.user?.name}</p>
                      <p className="customer-email">{order.user?.email}</p>
                    </td>
                    <td className="date-cell">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.items?.length}</td>
                    <td><strong>${order.totalAmount?.toFixed(2)}</strong></td>
                    <td>
                      <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td><span className={`badge badge-${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span></td>
                    <td><Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-secondary">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pagination.pages }, (_, i) => i+1).map(p => (
                <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusForm, setStatusForm] = useState({ status: '', note: '', trackingNumber: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getOrder(id)
      .then(res => {
        setOrder(res.data.order);
        setStatusForm(f => ({ ...f, status: res.data.order.orderStatus }));
      })
      .catch(() => navigate('/admin/orders'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await updateOrderStatus(id, statusForm);
      setOrder(res.data.order);
      toast.success('Order status updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!order) return null;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <button onClick={() => navigate('/admin/orders')} className="back-link">← Back to Orders</button>
          <h2>Order: {order.orderNumber}</h2>
          <p>Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className={`badge badge-${STATUS_COLORS[order.orderStatus]}`} style={{ fontSize: '14px', padding: '6px 16px' }}>
          {order.orderStatus.toUpperCase()}
        </span>
      </div>

      <div className="order-detail-admin-grid">
        <div>
          {/* Items */}
          <div className="card" style={{ padding: '0', marginBottom: '20px' }}>
            <div className="card-header"><h3>Order Items</h3></div>
            <table className="data-table">
              <thead>
                <tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th></tr>
              </thead>
              <tbody>
                {order.items?.map(item => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={item.image || 'https://via.placeholder.com/40'} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</span>
                      </div>
                    </td>
                    <td>${item.price?.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td><strong>${(item.price * item.quantity).toFixed(2)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="order-totals">
              <div className="total-row"><span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
              <div className="total-row"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost?.toFixed(2)}`}</span></div>
              <div className="total-row"><span>Tax</span><span>${order.taxAmount?.toFixed(2)}</span></div>
              <div className="total-row total-row-final"><span>Total</span><strong>${order.totalAmount?.toFixed(2)}</strong></div>
            </div>
          </div>

          {/* Update Status */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: '700' }}>Update Order Status</h3>
            <form onSubmit={handleStatusUpdate}>
              <div className="form-row" style={{ marginBottom: '12px' }}>
                <div className="form-group">
                  <label>Status</label>
                  <select value={statusForm.status} onChange={e => setStatusForm(f => ({ ...f, status: e.target.value }))} className="form-control">
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tracking Number</label>
                  <input value={statusForm.trackingNumber} onChange={e => setStatusForm(f => ({ ...f, trackingNumber: e.target.value }))} className="form-control" placeholder="Optional" />
                </div>
              </div>
              <div className="form-group">
                <label>Note</label>
                <input value={statusForm.note} onChange={e => setStatusForm(f => ({ ...f, note: e.target.value }))} className="form-control" placeholder="Optional status note" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </form>
          </div>
        </div>

        <div>
          {/* Customer Info */}
          <div className="card info-card">
            <h4>Customer</h4>
            <p><strong>{order.user?.name}</strong></p>
            <p>{order.user?.email}</p>
          </div>

          {/* Shipping */}
          <div className="card info-card">
            <h4>Shipping Address</h4>
            <p><strong>{order.shippingAddress?.fullName}</strong></p>
            <p>{order.shippingAddress?.street}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
            <p>{order.shippingAddress?.country}</p>
            {order.shippingAddress?.phone && <p>📞 {order.shippingAddress.phone}</p>}
          </div>

          {/* Payment */}
          <div className="card info-card">
            <h4>Payment</h4>
            <p>Method: <strong>{order.paymentMethod?.replace('_', ' ').toUpperCase()}</strong></p>
            <p>Status: <strong className={order.isPaid ? 'text-success' : ''}>{order.isPaid ? '✓ Paid' : 'Unpaid'}</strong></p>
            {order.paidAt && <p>Date: {new Date(order.paidAt).toLocaleDateString()}</p>}
          </div>

          {/* Timeline */}
          <div className="card info-card">
            <h4>Status History</h4>
            {order.statusHistory?.map((s, i) => (
              <div key={i} className="mini-timeline-item">
                <span className="mini-dot"></span>
                <div>
                  <strong>{s.status}</strong>
                  {s.note && <p>{s.note}</p>}
                  <small>{new Date(s.updatedAt).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
