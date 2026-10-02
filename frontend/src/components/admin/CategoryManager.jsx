import { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';

const emptyForm = { name: '', description: '', image: '' };

export default function CategoryManager() {
  const { categories, loading, error: catalogError, addCategory, updateCategory, deleteCategory } = useCatalog();
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const reset = () => { setForm(emptyForm); setEditId(null); setShowForm(false); setError(''); };
  const handleEdit = (category) => { setForm({ name: category.name || '', description: category.description || '', image: category.image || '' }); setEditId(category.id); setShowForm(true); };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.name.trim().length < 2) { setError('Enter a category name with at least 2 characters.'); return; }
    setSaving(true);
    try {
      if (editId) await updateCategory(editId, form); else await addCategory(form);
      reset();
    } catch (requestError) {
      setError(requestError.message || 'Category could not be saved.');
    } finally { setSaving(false); }
  };
  const handleDelete = async (category) => {
    if (!window.confirm(`Archive “${category.name}” from the storefront?`)) return;
    setError('');
    try { await deleteCategory(category.id); }
    catch (requestError) { setError(requestError.message || 'Category could not be archived.'); }
  };

  return <section className="admin-manager"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20 }}><div><h2 style={{ margin: 0 }}>Categories</h2><p style={{ margin: '5px 0 0', color: 'var(--muted)' }}>Changes are saved to the MongoDB catalog.</p></div><button className="btn btn-dark" onClick={() => { reset(); setShowForm(true); }}>Add category</button></div>
    {(error || catalogError) && <p className="form-error" role="alert">{error || catalogError}</p>}
    {showForm && <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 600, margin: '20px auto 28px', padding: 20, border: '1px solid var(--line)', borderRadius: 14, background: '#fbfcf9' }}><h3 style={{ margin: 0 }}>{editId ? 'Edit category' : 'New category'}</h3><div className="form-field"><label htmlFor="cat-name">Name</label><input id="cat-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength={80} required /></div><div className="form-field"><label htmlFor="cat-description">Description</label><textarea id="cat-description" rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} maxLength={500} /></div><div className="form-field"><label htmlFor="cat-image">Image URL or local path</label><input id="cat-image" type="text" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://… or /images/example.jpg" /></div>{error && <p className="form-error" role="alert">{error}</p>}<div style={{ display: 'flex', gap: 10 }}><button className="btn btn-dark" disabled={saving}>{saving ? 'Saving…' : editId ? 'Save category' : 'Add category'}</button><button className="btn" type="button" onClick={reset} style={{ border: '1px solid var(--line)', background: 'white' }}>Cancel</button></div></form>}
    {loading ? <div className="loading-state">Loading categories…</div> : categories.length ? <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}><thead><tr style={{ textAlign: 'left', background: '#f0f2eb' }}><th style={{ padding: 12 }}>Image</th><th style={{ padding: 12 }}>Name</th><th style={{ padding: 12 }}>Description</th><th style={{ padding: 12 }}>Actions</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id} style={{ borderTop: '1px solid var(--line)', opacity: category.status === 'archived' ? 0.55 : 1 }}><td style={{ padding: 10 }}><img src={category.image || '/placeholder-product.svg'} alt="" width="60" height="48" style={{ objectFit: 'cover', borderRadius: 8 }} /></td><td style={{ padding: 10, fontWeight: 700 }}>{category.name}{category.status === 'archived' && <small> · archived</small>}</td><td style={{ padding: 10 }}>{category.description}</td><td style={{ padding: 10, whiteSpace: 'nowrap' }}><button className="add-button" onClick={() => handleEdit(category)}>Edit</button>{category.status !== 'archived' && <> <button className="remove-button" onClick={() => handleDelete(category)}>Archive</button></>}</td></tr>)}</tbody></table></div> : <div className="empty-state">No categories found. Run the seed command or add a category.</div>}
  </section>;
}
