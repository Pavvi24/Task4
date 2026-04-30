import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const StarRating = ({ rating, count }) => (
  <div className="rating-row">
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`star ${s <= Math.round(rating) ? 'filled' : ''}`}>★</span>
      ))}
    </div>
    {count !== undefined && <span className="rating-count">({count})</span>}
  </div>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to add items to cart'); return; }
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {discount && <span className="discount-badge">-{discount}%</span>}
        {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
        {product.isFeatured && <span className="featured-badge">⭐ Featured</span>}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        {product.brand && <p className="product-brand">{product.brand}</p>}
        <StarRating rating={product.ratings} count={product.numReviews} />
        <div className="product-footer">
          <div className="price-group">
            <span className="product-price">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            aria-label="Add to cart"
          >
            {product.stock === 0 ? '✕' : '+'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
