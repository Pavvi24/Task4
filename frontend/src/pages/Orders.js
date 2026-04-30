import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getMyOrders, getOrder, cancelOrder } from '../api';
import { toast } from 'react-toastify';
import './Orders.css';

const STATUS_COLORS = {
  pending: 'warning', confirmed: 'info', processing: 'info',
  shipped: 'info', delivered: 'success', cancelled: 'danger', refunded: 'secondary'
};

const STATUS_ICONS = {
  pending: '⏳', confirmed: '✅', processing: '⚙️',
  shipped: '🚚', delivered: '📦', cancelled: '✕', refunded: '↩️'
};

export const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner" style={{ minHeight: '60vh' }}><div className="spinner"></div></div>;

  return (
    <div className="orders-page">
      <div className="page-container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <span>📦</span>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders.</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <Link to={`/orders/${order._id}`} key={order._id} className="order-card card">
                <div className="order-card-header">
                  <div>
                    <span className="order-number">{order.orderNumber}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`badge badge-${STATUS_COLORS[order.orderStatus]}`}>
                    {STATUS_ICONS[order.orderStatus]} {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>
                <div className="order-card-items">
                  {order.items?.slice(0, 3).map(item => (
                    <img
                      key={item._id}
                      src={item.image || 'https://via.placeholder.com/48'}
                      alt={item.name}
                      className="order-thumb"
                      title={item.name}
                    />
                  ))}
                  {order.items?.length > 3 && (
                    <span className="more-items">+{order.items.length - 3}</span>
                  )}
                </div>
                <div className="order-card-footer">
                  <span className="order-items-count">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                  <strong className="order-total">${order.totalAmount?.toFixed(2)}</strong>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    getOrder(id)
      .then(res => setOrder(res.data.order))
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await cancelOrder(id, { reason: 'Cancelled by customer' });
      setOrder(res.data.order);
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="loading-spinner" style={{ minHeight: '60vh' }}><div className="spinner"></div></div>;
  if (!order) return null;

  return (
    <div className="order-detail-page">
      <div className="page-container">
        <div className="page-header">
          <button onClick={() => navigate('/orders')} className="back-btn">← Back to Orders</button>
          <div>
            <h1>Order {order.orderNumber}</h1>
            <p>Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="order-detail-layout">
          <div className="order-main">
            {/* Status Timeline */}
            <div className="card status-card">
              <div className="status-header">
                <span className={`badge badge-${STATUS_COLORS[order.orderStatus]}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
                  {STATUS_ICONS[order.orderStatus]} {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
                {order.trackingNumber && (
                  <span className="tracking">Tracking: <strong>{order.trackingNumber}</strong></span>
                )}
              </div>
              <div className="status-timeline">
                {order.statusHistory?.map((s, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <strong>{s.status.charAt(0).toUpperCase() + s.status.slice(1)}</strong>
                      {s.note && <p>{s.note}</p>}
                      <span className="timeline-time">{new Date(s.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="card items-card">
              <h3>Order Items ({order.items?.length})</h3>
              {order.items?.map(item => (
                <div key={item._id} className="order-item">
                  <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} />
                  <div className="order-item-info">
                    <Link to={`/products/${item.product?._id || item.product}`} className="order-item-name">{item.name}</Link>
                    <span className="order-item-price">${item.price.toFixed(2)} × {item.quantity}</span>
                  </div>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="order-sidebar">
            {/* Summary */}
            <div className="card summary-card">
              <h3>Order Summary</h3>
              <div className="summary-rows">
                <div className="summary-row"><span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
                <div className="summary-row"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost?.toFixed(2)}`}</span></div>
                <div className="summary-row"><span>Tax</span><span>${order.taxAmount?.toFixed(2)}</span></div>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <strong>${order.totalAmount?.toFixed(2)}</strong>
              </div>
              <div className="payment-info">
                <span>Payment: <strong>{order.paymentMethod?.replace('_', ' ').toUpperCase()}</strong></span>
                <span className={order.isPaid ? 'paid' : 'unpaid'}>{order.isPaid ? '✓ Paid' : '○ Unpaid'}</span>
              </div>
            </div>

            {/* Shipping */}
            <div className="card shipping-card">
              <h3>Shipping Address</h3>
              <p><strong>{order.shippingAddress?.fullName}</strong></p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
              <p>{order.shippingAddress?.country}</p>
              {order.shippingAddress?.phone && <p>📞 {order.shippingAddress.phone}</p>}
            </div>

            {/* Actions */}
            {['pending', 'confirmed'].includes(order.orderStatus) && (
              <button
                className="btn btn-outline btn-lg cancel-btn"
                onClick={handleCancel}
                disabled={cancelling}
                style={{ width: '100%', borderColor: 'var(--accent)', color: 'var(--accent)' }}
              >
                {cancelling ? 'Cancelling...' : '✕ Cancel Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
