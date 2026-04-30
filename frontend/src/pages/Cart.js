import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, qty) => {
    try {
      await updateCartItem(productId, qty);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Clear all items from cart?')) return;
    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch (err) {
      toast.error('Failed to clear cart');
    }
  };

  const subtotal = cart.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  if (loading) return <div className="loading-spinner" style={{ minHeight: '60vh' }}><div className="spinner"></div></div>;

  return (
    <div className="cart-page">
      <div className="page-container">
        <div className="page-header">
          <h1>Shopping Cart</h1>
          <p>{cart.items?.length || 0} item{cart.items?.length !== 1 ? 's' : ''}</p>
        </div>

        {!cart.items?.length ? (
          <div className="empty-cart">
            <span>🛒</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              <div className="cart-header">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>

              {cart.items.map(item => (
                <div key={item.product?._id || item._id} className="cart-item">
                  <div className="item-product">
                    <Link to={`/products/${item.product?._id}`}>
                      <img
                        src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/80?text=No+Img'}
                        alt={item.product?.name}
                        className="item-image"
                      />
                    </Link>
                    <div>
                      <Link to={`/products/${item.product?._id}`} className="item-name">
                        {item.product?.name || 'Product'}
                      </Link>
                      {item.product?.stock <= 5 && item.product?.stock > 0 && (
                        <p className="low-stock">Only {item.product.stock} left!</p>
                      )}
                    </div>
                  </div>

                  <span className="item-price">${item.price.toFixed(2)}</span>

                  <div className="qty-control">
                    <button onClick={() => handleQuantityChange(item.product?._id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.product?._id, item.quantity + 1)} disabled={item.quantity >= item.product?.stock}>+</button>
                  </div>

                  <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>

                  <button className="remove-btn" onClick={() => handleRemove(item.product?._id)} title="Remove">✕</button>
                </div>
              ))}

              <div className="cart-footer">
                <button className="btn btn-secondary btn-sm" onClick={handleClearCart}>🗑 Clear Cart</button>
                <Link to="/products" className="btn btn-secondary btn-sm">← Continue Shopping</Link>
              </div>
            </div>

            <div className="order-summary card">
              <h3>Order Summary</h3>

              <div className="summary-rows">
                <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="free">FREE</span> : `$${shipping.toFixed(2)}`}</span></div>
                <div className="summary-row"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
                {subtotal < 100 && subtotal > 0 && (
                  <p className="free-shipping-note">Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>
                )}
              </div>

              <div className="summary-total">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>

              <button
                className="btn btn-primary btn-lg checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout →
              </button>

              <div className="secure-badge">🔒 Secure checkout</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
