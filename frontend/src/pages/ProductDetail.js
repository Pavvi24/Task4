import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, addReview } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const StarRating = ({ rating, count }) => (
  <div className="stars-row">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={`star ${s <= Math.round(rating) ? 'filled' : ''}`}>★</span>
    ))}
    {count !== undefined && <span className="rating-label">{rating.toFixed(1)} ({count} reviews)</span>}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then(res => setProduct(res.data.product))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) { toast.info('Please login to add items to cart'); navigate('/login'); return; }
    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    await handleAddToCart();
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to submit a review'); return; }
    setSubmittingReview(true);
    try {
      await addReview(id, reviewForm);
      toast.success('Review submitted!');
      const res = await getProduct(id);
      setProduct(res.data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="loading-spinner" style={{ minHeight: '60vh' }}><div className="spinner"></div></div>;
  if (!product) return null;

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div className="product-detail-page">
      <div className="page-container">
        <div className="breadcrumb">
          <button onClick={() => navigate('/products')}>Products</button>
          <span>›</span>
          <button onClick={() => navigate(`/products?category=${product.category}`)}>{product.category}</button>
          <span>›</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* Images */}
          <div className="product-images">
            <div className="main-image-wrap">
              <img
                src={product.images?.[activeImage]?.url || 'https://via.placeholder.com/500?text=No+Image'}
                alt={product.name}
                className="main-image"
              />
              {discount && <span className="detail-discount">-{discount}%</span>}
            </div>
            {product.images?.length > 1 && (
              <div className="thumbnail-list">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb ${i === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img.url} alt={`View ${i+1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-name">{product.name}</h1>
            {product.brand && <p className="detail-brand">by <strong>{product.brand}</strong></p>}

            <StarRating rating={product.ratings} count={product.numReviews} />

            <div className="detail-price-row">
              <span className="detail-price">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="detail-original">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="detail-description">
              <p>{product.description}</p>
            </div>

            <div className="stock-info">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock-text">✗ Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <>
                <div className="quantity-row">
                  <label>Quantity:</label>
                  <div className="qty-control">
                    <button onClick={() => setQuantity(q => Math.max(1, q-1))}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock, q+1))}>+</button>
                  </div>
                </div>

                <div className="detail-actions">
                  <button
                    className="btn btn-outline btn-lg flex-1"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    🛒 {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button className="btn btn-primary btn-lg flex-1" onClick={handleBuyNow}>
                    ⚡ Buy Now
                  </button>
                </div>
              </>
            )}

            {product.tags?.length > 0 && (
              <div className="tags-row">
                {product.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>

          {user && (
            <form className="review-form card" onSubmit={handleReviewSubmit}>
              <h3>Write a Review</h3>
              <div className="form-group">
                <label>Rating</label>
                <div className="star-picker">
                  {[1,2,3,4,5].map(s => (
                    <button
                      key={s} type="button"
                      className={`star-pick ${s <= reviewForm.rating ? 'filled' : ''}`}
                      onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                    >★</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          <div className="reviews-list">
            {product.reviews?.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            ) : (
              product.reviews.map(r => (
                <div key={r._id} className="review-card card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">{r.name?.[0]?.toUpperCase()}</div>
                      <div>
                        <strong>{r.name}</strong>
                        <p className="review-date">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="stars">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`star ${s <= r.rating ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
