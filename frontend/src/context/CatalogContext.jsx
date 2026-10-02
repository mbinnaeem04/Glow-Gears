import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshCatalog = useCallback(async () => {
    const includeArchived = user?.role === 'admin' ? '?all=true' : '';
    setLoading(true);
    setError('');
    try {
      const [categoryData, productData] = await Promise.all([
        apiRequest(`/api/categories${includeArchived}`),
        apiRequest(`/api/products?limit=100${includeArchived ? '&all=true' : ''}`),
      ]);
      setCategories(Array.isArray(categoryData.categories) ? categoryData.categories : []);
      setProducts(Array.isArray(productData.products) ? productData.products : []);
    } catch (requestError) {
      setCategories([]);
      setProducts([]);
      setError(requestError.message || 'The catalog could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    if (!authLoading) refreshCatalog();
  }, [authLoading, refreshCatalog]);

  const addCategory = useCallback(async (category) => {
    await apiRequest('/api/admin/categories', { method: 'POST', body: category });
    await refreshCatalog();
  }, [refreshCatalog]);
  const updateCategory = useCallback(async (id, changes) => {
    await apiRequest(`/api/admin/categories/${encodeURIComponent(id)}`, { method: 'PATCH', body: changes });
    await refreshCatalog();
  }, [refreshCatalog]);
  const deleteCategory = useCallback(async (id) => {
    await apiRequest(`/api/admin/categories/${encodeURIComponent(id)}`, { method: 'DELETE' });
    await refreshCatalog();
  }, [refreshCatalog]);
  const addProduct = useCallback(async (product) => {
    await apiRequest('/api/admin/products', { method: 'POST', body: product });
    await refreshCatalog();
  }, [refreshCatalog]);
  const updateProduct = useCallback(async (id, changes) => {
    await apiRequest(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'PATCH', body: changes });
    await refreshCatalog();
  }, [refreshCatalog]);
  const deleteProduct = useCallback(async (id) => {
    await apiRequest(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    await refreshCatalog();
  }, [refreshCatalog]);

  const value = useMemo(() => ({
    categories, products, loading, error, refreshCatalog,
    addCategory, updateCategory, deleteCategory,
    addProduct, updateProduct, deleteProduct,
  }), [categories, products, loading, error, refreshCatalog, addCategory, updateCategory, deleteCategory, addProduct, updateProduct, deleteProduct]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used inside CatalogProvider');
  return context;
}
