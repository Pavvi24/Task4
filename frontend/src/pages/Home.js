import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../api';
import ProductCard from '../components/Products/ProductCard';
import './Home.css';

const CATEGORY_ICONS = {
  'Electronics': '💻', 'Clothing': '👕', 'Books': '📚',
  'Home & Garden': '🏡', 'Sports': '⚽', 'Beauty': '💄', 'Toys': '🎮', 'Food': '🍎', 'Other': '📦'
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, catRes] = await Promise.all([
          getProducts({ featured: true, limit: 8 }),
          getCategories()
        ]);
        setFeatured(featuredRes.data.products);
        setCategories(catRes.data.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🔥 New Arrivals Every Week</span>
          <h1>Shop Smarter,<br />Live Better</h1>
          <p>Discover thousands of products at unbeatable prices. Quality guaranteed.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now →</Link>
            <Link to="/products?featured=true" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>View Featured</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>10K+</strong><span>Products</span></div>
            <div className="stat"><strong>50K+</strong><span>Customers</span></div>
            <div className="stat"><strong>4.8★</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600" alt="Shopping" />
        </div>
      </section>

      {/* Features */}
      <section className="features-strip">
        <div className="features-container">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $100' },
            { icon: '🔒', title: 'Secure Payment', desc: '100% safe & secure' },
            { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
            { icon: '💬', title: '24/7 Support', desc: 'Always here to help' }
          ].map(f => (
            <div key={f.title} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <strong>{f.title}</strong>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="page-container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/products" className="see-all">See all →</Link>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <button
                key={cat}
                className="category-card"
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
              >
                <span className="cat-icon">{CATEGORY_ICONS[cat] || '📦'}</span>
                <span className="cat-name">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-alt">
        <div className="page-container">
          <div className="section-header">
            <h2>⭐ Featured Products</h2>
            <Link to="/products?featured=true" className="see-all">See all →</Link>
          </div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner"></div></div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="page-container">
          <div className="cta-content">
            <h2>Ready to Start Shopping?</h2>
            <p>Join thousands of happy customers today.</p>
            <Link to="/register" className="btn btn-primary btn-lg">Create Account Free</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
