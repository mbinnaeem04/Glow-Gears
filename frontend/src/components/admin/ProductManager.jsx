import { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';

const emptyForm = { name: '', price: '', image: '', description: '', categoryId: '', quantity: '0' };

export default function ProductManager() {
  const { products, categories, loading, error: catalogError, addProduct, updateProduct, deleteProduct } = useCatalog();
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const reset = () => { setForm(emptyForm); setEditId(null); setShowForm(false); setError(''); };
  const handleEdit = (product) => {
    setForm({ name: product.name || '', price: String(product.price ?? ''), image: product.image || '', description: product.description || '', categoryId: product.categoryId || '', quantity: String(product.quantity ?? 0) });
    setEditId(product.id);
    setShowForm(true);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const price = Number(form.price);
    const quantity = Number(form.quantity);
    if (!form.name.trim() || !form.description.trim() || !form.categoryId || !Number.isFinite(price) || price <= 0 || !Number.isInteger(quantity) || quantity < 0) {
      setError('Enter a name, description, category, valid price, and non-negative whole-number stock.');
      return;
    }
    setSaving(true);
    try {
      const product = { ...form, name: form.name.trim(), price, quantity };
      if (editId) await updateProduct(editId, product); else await addProduct(product);
      reset();
    } catch (requestError) {
      setError(requestError.message || 'Product could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Archive “${product.name}” from the storefront?`)) return;
    setError('');
    try { await deleteProduct(product.id); }
    catch (requestError) { setError(requestError.message || 'Product could not be archived.'); }
  };

  return <section className="admin-manager"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20 }}><div><h2 style={{ margin: 0 }}>Products</h2><p style={{ margin: '5px 0 0', color: 'var(--muted)' }}>Changes are saved to the MongoDB catalog.</p></div><button className="btn btn-dark" onClick={() => { reset(); setShowForm(true); }}>Add product</button></div>
    {(error || catalogError) && <p className="form-error" role="alert">{error || catalogError}</p>}
    {showForm && <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 600, margin: '20px auto 28px', padding: 20, border: '1px solid var(--line)', borderRadius: 14, background: '#fbfcf9' }}><h3 style={{ margin: 0 }}>{editId ? 'Edit product' : 'New product'}</h3><div className="form-field"><label htmlFor="product-name">Name</label><input id="product-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength={160} required /></div><div className="form-field"><label htmlFor="product-price">Price (USD)</label><input id="product-price" type="number" step="0.01" min="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></div><div className="form-field"><label htmlFor="product-quantity">Stock quantity</label><input id="product-quantity" type="number" step="1" min="0" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} required /></div><div className="form-field"><label htmlFor="product-category">Category</label><select id="product-category" value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} required><option value="">Choose a category</option>{categories.filter((category) => category.status !== 'archived').map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><div className="form-field"><label htmlFor="product-description">Description</label><textarea id="product-description" rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} maxLength={5000} required /></div><div className="form-field"><label htmlFor="product-image">Image URL or local path</label><input id="product-image" type="text" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://… or /images/example.jpg" /></div>{error && <p className="form-error" role="alert">{error}</p>}<div style={{ display: 'flex', gap: 10 }}><button className="btn btn-dark" disabled={saving}>{saving ? 'Saving…' : editId ? 'Save product' : 'Add product'}</button><button className="btn" type="button" onClick={reset} style={{ border: '1px solid var(--line)', background: 'white' }}>Cancel</button></div></form>}
    {loading ? <div className="loading-state">Loading products…</div> : products.length ? <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ textAlign: 'left', background: '#f0f2eb' }}><th style={{ padding: 12 }}>Image</th><th style={{ padding: 12 }}>Name</th><th style={{ padding: 12 }}>Category</th><th style={{ padding: 12 }}>Price</th><th style={{ padding: 12 }}>Stock</th><th style={{ padding: 12 }}>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} style={{ borderTop: '1px solid var(--line)', opacity: product.status === 'archived' ? 0.55 : 1 }}><td style={{ padding: 10 }}><img src={product.image || '/placeholder-product.svg'} alt="" width="60" height="48" style={{ objectFit: 'cover', borderRadius: 8 }} /></td><td style={{ padding: 10, fontWeight: 700 }}>{product.name}{product.status === 'archived' && <small> · archived</small>}</td><td style={{ padding: 10 }}>{categories.find((category) => category.id === product.categoryId)?.name || 'Uncategorized'}</td><td style={{ padding: 10 }}>${(Number(product.price) || 0).toFixed(2)}</td><td style={{ padding: 10 }}>{Number(product.quantity) || 0}</td><td style={{ padding: 10, whiteSpace: 'nowrap' }}><button className="add-button" onClick={() => handleEdit(product)}>Edit</button>{product.status !== 'archived' && <> <button className="remove-button" onClick={() => handleDelete(product)}>Archive</button></>}</td></tr>)}</tbody></table></div> : <div className="empty-state">No products found. Run the seed command or add a product.</div>}
  </section>;
}
