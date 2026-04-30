import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.put('/auth/change-password', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const getCategories = () => API.get('/products/categories');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);

// Cart
export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart', data);
export const updateCartItem = (productId, data) => API.put(`/cart/${productId}`, data);
export const removeFromCart = (productId) => API.delete(`/cart/${productId}`);
export const clearCart = () => API.delete('/cart');

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = (params) => API.get('/orders/my-orders', { params });
export const getOrder = (id) => API.get(`/orders/${id}`);
export const cancelOrder = (id, data) => API.put(`/orders/${id}/cancel`, data);

// Admin
export const getAllOrders = (params) => API.get('/orders', { params });
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const getAllUsers = (params) => API.get('/users', { params });
export const getDashboardStats = () => API.get('/users/dashboard/stats');
export const updateUser = (id, data) => API.put(`/users/${id}`, data);

export default API;
