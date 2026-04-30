import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProducts, deleteProduct, createProduct, updateProduct, getProduct } from '../../api';
import { toast } from 'react-toastify';
import './AdminProducts.css';

const CATEGORIES = ['Electronics','Clothing','Books','Home & Garden','Sports','Beauty','Toys','Food','Other'];

export const AdminProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchProducts = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getProducts({ page: p, limit: 15 });
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(page); }, [page]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts(page);
    } catch { toast.error('Failed to delete product'); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2>Products</h2>
          <p>{pagination.total || 0} total products</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : (
        <>
          <div className="card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div className="product-cell">
                        <img src={p.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={p.name} className="product-mini-img" />
                        <div>
                          <p className="product-cell-name">{p.name}</p>
                          <p className="product-cell-brand">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-secondary">{p.category}</span></td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>
                      <span className={p.stock === 0 ? 'text-danger' : p.stock < 10 ? 'text-warning' : ''}>{p.stock}</span>
                    </td>
                    <td>⭐ {p.ratings?.toFixed(1)} ({p.numReviews})</td>
                    <td><span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="action-btns">
                        <Link to={`/admin/products/${p._id}/edit`} className="btn btn-sm btn-secondary">Edit</Link>
                        <button onClick={() => handleDelete(p._id, p.name)} className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626' }}>Delete</button>
                      </div>
                    </td>
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

const defaultForm = {
  name: '', description: '', price: '', originalPrice: '', category: 'Electronics',
  brand: '', stock: '', sku: '', tags: '', isFeatured: false, isActive: true,
  images: [{ url: '', alt: '' }]
};

export const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      getProduct(id).then(res => {
        const p = res.data.product;
        setForm({
          name: p.name, description: p.description,
          price: p.price, originalPrice: p.originalPrice || '',
          category: p.category, brand: p.brand || '',
          stock: p.stock, sku: p.sku || '',
          tags: p.tags?.join(', ') || '',
          isFeatured: p.isFeatured, isActive: p.isActive,
          images: p.images?.length ? p.images : [{ url: '', alt: '' }]
        });
        setFetching(false);
      }).catch(() => navigate('/admin/products'));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (i, field, value) => {
    setForm(f => {
      const images = [...f.images];
      images[i] = { ...images[i], [field]: value };
      return { ...f, images };
    });
  };

  const addImage = () => setForm(f => ({ ...f, images: [...f.images, { url: '', alt: '' }] }));
  const removeImage = (i) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock: Number(form.stock),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        images: form.images.filter(img => img.url)
      };
      if (isEdit) {
        await updateProduct(id, data);
        toast.success('Product updated!');
      } else {
        await createProduct(data);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="product-form">
      <div className="admin-page-header">
        <div>
          <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <p>{isEdit ? 'Update product details' : 'Fill in the product information'}</p>
        </div>
        <button onClick={() => navigate('/admin/products')} className="btn btn-secondary">← Back</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <div className="card form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows={4} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange} className="form-control">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input name="brand" value={form.brand} onChange={handleChange} className="form-control" />
              </div>
            </div>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange} className="form-control" placeholder="wireless, headphones, audio" />
            </div>
          </div>

          <div>
            <div className="card form-section">
              <h3>Pricing & Stock</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Original Price</label>
                  <input name="originalPrice" type="number" step="0.01" value={form.originalPrice} onChange={handleChange} className="form-control" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock *</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>SKU</label>
                  <input name="sku" value={form.sku} onChange={handleChange} className="form-control" />
                </div>
              </div>
              <div className="checkbox-row">
                <label className="checkbox-label">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                  Featured Product
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                  Active (visible)
                </label>
              </div>
            </div>

            <div className="card form-section">
              <h3>Images</h3>
              {form.images.map((img, i) => (
                <div key={i} className="image-row">
                  <input
                    value={img.url} onChange={e => handleImageChange(i, 'url', e.target.value)}
                    className="form-control" placeholder="Image URL" style={{ flex: 2 }}
                  />
                  <input
                    value={img.alt} onChange={e => handleImageChange(i, 'alt', e.target.value)}
                    className="form-control" placeholder="Alt text" style={{ flex: 1 }}
                  />
                  {form.images.length > 1 && (
                    <button type="button" onClick={() => removeImage(i)} className="remove-img-btn">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addImage} className="btn btn-secondary btn-sm">+ Add Image</button>
            </div>
          </div>
        </div>

        <div className="form-submit-row">
          <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-secondary btn-lg">Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
