import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api';
import { toast } from 'react-toastify';
import './Checkout.css';

const PAYMENT_METHODS = [
  { value: 'credit_card', label: '💳 Credit Card' },
  { value: 'debit_card', label: '🏦 Debit Card' },
  { value: 'paypal', label: '📱 PayPal' },
  { value: 'cod', label: '💵 Cash on Delivery' }
];

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'USA',
    phone: user?.phone || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const subtotal = cart.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleShippingChange = (e) => {
    setShippingAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const items = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      }));

      const res = await createOrder({ items, shippingAddress, paymentMethod });
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items?.length) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="page-container">
        <div className="page-header">
          <h1>Checkout</h1>
        </div>

        {/* Steps */}
        <div className="checkout-steps">
          {['Shipping', 'Payment', 'Review'].map((s, i) => (
            <div key={s} className={`step ${step >= i+1 ? 'active' : ''} ${step > i+1 ? 'completed' : ''}`}>
              <span className="step-num">{step > i+1 ? '✓' : i+1}</span>
              <span className="step-label">{s}</span>
              {i < 2 && <div className="step-line"></div>}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-form">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="checkout-step-content card">
                <h2>Shipping Address</h2>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Full Name *</label>
                    <input name="fullName" value={shippingAddress.fullName} onChange={handleShippingChange} className="form-control" required />
                  </div>
                  <div className="form-group full-width">
                    <label>Street Address *</label>
                    <input name="street" value={shippingAddress.street} onChange={handleShippingChange} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <input name="city" value={shippingAddress.city} onChange={handleShippingChange} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input name="state" value={shippingAddress.state} onChange={handleShippingChange} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input name="zipCode" value={shippingAddress.zipCode} onChange={handleShippingChange} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label>Country *</label>
                    <input name="country" value={shippingAddress.country} onChange={handleShippingChange} className="form-control" required />
                  </div>
                  <div className="form-group full-width">
                    <label>Phone</label>
                    <input name="phone" value={shippingAddress.phone} onChange={handleShippingChange} className="form-control" />
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    const required = ['fullName','street','city','state','zipCode','country'];
                    const missing = required.find(f => !shippingAddress[f]);
                    if (missing) { toast.error('Please fill all required fields'); return; }
                    setStep(2);
                  }}
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="checkout-step-content card">
                <h2>Payment Method</h2>
                <div className="payment-options">
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.value} className={`payment-option ${paymentMethod === m.value ? 'active' : ''}`}>
                      <input
                        type="radio" name="payment" value={m.value}
                        checked={paymentMethod === m.value}
                        onChange={() => setPaymentMethod(m.value)}
                      />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
                {paymentMethod !== 'cod' && (
                  <div className="payment-note">
                    <p>💡 This is a demo app. No real payment is processed.</p>
                  </div>
                )}
                <div className="step-buttons">
                  <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="checkout-step-content card">
                <h2>Review Order</h2>
                <div className="review-section">
                  <h4>Shipping To</h4>
                  <p>{shippingAddress.fullName}</p>
                  <p>{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                  <p>{shippingAddress.country}</p>
                </div>
                <div className="review-section">
                  <h4>Payment</h4>
                  <p>{PAYMENT_METHODS.find(m => m.value === paymentMethod)?.label}</p>
                </div>
                <div className="review-items">
                  <h4>Items ({cart.items.length})</h4>
                  {cart.items.map(item => (
                    <div key={item._id} className="review-item">
                      <img src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/48'} alt="" />
                      <span className="review-item-name">{item.product?.name}</span>
                      <span>x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="step-buttons">
                  <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? 'Placing Order...' : '✓ Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-summary card">
            <h3>Order Summary</h3>
            {cart.items.map(item => (
              <div key={item._id} className="summary-item">
                <span className="summary-item-name">{item.product?.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <hr />
            <div className="summary-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
