import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart as apiGetCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], totalAmount: 0 }); return; }
    try {
      setLoading(true);
      const res = await apiGetCart();
      setCart(res.data.cart);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await apiAddToCart({ productId, quantity });
    setCart(res.data.cart);
    return res.data;
  };

  const updateCartItem = async (productId, quantity) => {
    const res = await apiUpdateCartItem(productId, { quantity });
    setCart(res.data.cart);
  };

  const removeFromCart = async (productId) => {
    const res = await apiRemoveFromCart(productId);
    setCart(res.data.cart);
  };

  const clearCart = async () => {
    await apiClearCart();
    setCart({ items: [], totalAmount: 0 });
  };

  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateCartItem, removeFromCart, clearCart, fetchCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
