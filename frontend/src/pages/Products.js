import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../api';
import ProductCard from '../components/Products/ProductCard';
import './Products.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' }
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (category) params.category = category;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await getProducts(params);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, sort, category, search, minPrice, maxPrice]);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data.categories));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) params[key] = value;
    else delete params[key];
    delete params.page;
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  return (
    <div className="products-page">
      <div className="page-container">
        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-header">
              <h3>Filters</h3>
              <button onClick={clearFilters} className="clear-filters">Clear all</button>
            </div>

            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-options">
                <label className={`filter-option ${!category ? 'active' : ''}`}>
                  <input type="radio" name="category" value="" checked={!category} onChange={() => updateParam('category', '')} />
                  All Categories
                </label>
                {categories.map(cat => (
                  <label key={cat} className={`filter-option ${category === cat ? 'active' : ''}`}>
                    <input type="radio" name="category" value={cat} checked={category === cat} onChange={() => updateParam('category', cat)} />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                  className="form-control price-input"
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="form-control price-input"
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="products-main">
            <div className="products-toolbar">
              <div className="results-info">
                {search && <span>Results for "<strong>{search}</strong>"</span>}
                {!loading && <span className="result-count">{pagination.total || 0} products</span>}
              </div>
              <div className="sort-control">
                <label>Sort by:</label>
                <select
                  value={sort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="sort-select"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-spinner"><div className="spinner"></div></div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <span>😔</span>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="products-grid-main">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {pagination.pages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={`page-btn ${p === page ? 'active' : ''}`}
                        onClick={() => updateParam('page', p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
