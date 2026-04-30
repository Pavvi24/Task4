import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>🛍️ ShopNow</h3>
          <p>Your one-stop destination for quality products at great prices.</p>
          <div className="social-links">
            <a href="#!" aria-label="Facebook">📘</a>
            <a href="#!" aria-label="Twitter">🐦</a>
            <a href="#!" aria-label="Instagram">📷</a>
          </div>
        </div>
        <div className="footer-links">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?category=Electronics">Electronics</Link></li>
            <li><Link to="/products?category=Clothing">Clothing</Link></li>
            <li><Link to="/products?category=Books">Books</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><a href="#!">Help Center</a></li>
            <li><a href="#!">Returns</a></li>
            <li><a href="#!">Shipping Info</a></li>
            <li><a href="#!">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ShopNow. All rights reserved.</p>
        <div className="payment-icons">
          <span>💳</span><span>🏦</span><span>📱</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
