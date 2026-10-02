import { useEffect, useState } from 'react';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api.js';

export default function Account() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.displayName || user?.name || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    setName(user?.displayName || user?.name || '');
  }, [user?.displayName, user?.name]);

  useEffect(() => {
    apiRequest('/api/orders/mine')
      .then((data) => setOrders(data.orders || []))
      .catch((requestError) => setOrdersError(requestError.message || 'Order history could not be loaded.'));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaved(false);
    try {
      await updateProfile({ displayName: name.trim() });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (requestError) {
      setError(requestError.message || 'Your profile could not be updated.');
    }
  };

  return <div className="site-shell"><Navbar /><main className="page-content container info-page"><div className="info-panel" style={{ maxWidth: 900, margin: '0 auto' }}><span className="eyebrow">Your space</span><h1>Account settings</h1><p>Update your profile and review recent orders.</p><form onSubmit={handleSubmit} style={{ maxWidth: 470, marginTop: 28 }}><div className="form-field"><label htmlFor="account-name">Display name</label><input id="account-name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} required /></div><div className="form-field"><label htmlFor="account-email">Email address</label><input id="account-email" type="email" value={user?.email || ''} disabled /></div>{error && <p className="form-error" role="alert">{error}</p>}{saved && <p role="status" style={{ color: '#587148' }}>Profile saved.</p>}<button className="btn btn-dark" style={{ width: '100%' }}>Save profile</button></form><section style={{ marginTop: 44 }}><h2>Order history</h2>{ordersError && <p className="form-error" role="alert">{ordersError}</p>}{!ordersError && orders.length === 0 && <p>Your orders will appear here after checkout.</p>}{orders.map((order) => <article key={order.id} style={{ padding: 16, marginTop: 12, border: '1px solid var(--line)', borderRadius: 12, background: '#fff' }}><div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }}><strong>{order.orderNumber}</strong><span>{new Date(order.createdAt).toLocaleDateString()}</span></div><p style={{ marginBottom: 4 }}>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p><p style={{ margin: 0, color: 'var(--muted)' }}>Total: {order.currency} {Number(order.total).toFixed(2)} · {order.fulfillmentStatus} · {String(order.paymentMethod || 'cash_on_delivery').replaceAll('_', ' ')}</p></article>)}</section></div></main><Footer /></div>;
}
