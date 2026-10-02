import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);
const GUEST_CART_KEY = 'glowgears:guest-cart-token';

const getGuestToken = () => {
  let token = localStorage.getItem(GUEST_CART_KEY);
  if (!token) {
    token = globalThis.crypto?.randomUUID?.().replaceAll('-', '')
      || `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(GUEST_CART_KEY, token);
  }
  return token;
};

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const guestToken = getGuestToken();
  const cartHeaders = useMemo(() => ({ 'x-guest-cart-token': guestToken }), [guestToken]);

  const refreshCart = useCallback(async () => {
    const data = await apiRequest('/api/cart', { headers: cartHeaders });
    setCartItems(Array.isArray(data.cartItems) ? data.cartItems : []);
    return data.cartItems || [];
  }, [cartHeaders]);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        if (user) await apiRequest('/api/cart/merge', { method: 'POST', headers: cartHeaders });
        const data = await apiRequest('/api/cart', { headers: cartHeaders });
        if (active) setCartItems(Array.isArray(data.cartItems) ? data.cartItems : []);
      } catch (requestError) {
        if (active) setError(requestError.message || 'Your bag could not be loaded.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [authLoading, user?.id, cartHeaders]);

  const addToCart = useCallback(async (product) => {
    if (!product?.id) throw new Error('This product is missing its catalog ID.');
    setError('');
    try {
      const data = await apiRequest('/api/cart/items', {
        method: 'POST', headers: cartHeaders, body: { productId: product.id, quantity: 1 },
      });
      setCartItems(data.cartItems || []);
      return data.cartItems || [];
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  }, [cartHeaders]);

  const removeFromCart = useCallback(async (productId) => {
    const data = await apiRequest(`/api/cart/items/${encodeURIComponent(productId)}`, { method: 'DELETE', headers: cartHeaders });
    setCartItems(data.cartItems || []);
  }, [cartHeaders]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    const data = await apiRequest(`/api/cart/items/${encodeURIComponent(productId)}`, {
      method: 'PATCH', headers: cartHeaders, body: { quantity },
    });
    setCartItems(data.cartItems || []);
  }, [cartHeaders]);

  const clearCart = useCallback(async () => {
    const data = await apiRequest('/api/cart', { method: 'DELETE', headers: cartHeaders });
    setCartItems(data.cartItems || []);
  }, [cartHeaders]);

  const value = useMemo(() => ({ cartItems, loading, error, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart }), [cartItems, loading, error, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
