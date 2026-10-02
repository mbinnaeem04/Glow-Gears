import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api.js';

const orderStatuses = ['unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadOrders() {
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/api/admin/orders');
      setOrders(data.orders || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function changeStatus(order, newStatus) {
    try {
      await apiRequest(`/api/admin/orders/${order.id}/fulfillment`, {
        method: 'PATCH',
        body: { fulfillmentStatus: newStatus },
      });
      await loadOrders();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section className="admin-manager">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2>Orders</h2>
          <p>Review orders and update their delivery status.</p>
        </div>
        <button className="btn" onClick={loadOrders}>Refresh</button>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}
      {loading && <p>Loading orders…</p>}
      {!loading && orders.length === 0 && <p>No orders have been placed yet.</p>}

      {!loading && orders.map((order) => (
        <article key={order.id} style={{ padding: 18, marginTop: 14, border: '1px solid var(--line)', borderRadius: 14, background: 'white' }}>
          <strong>{order.orderNumber}</strong>
          <p>{order.customerEmail}</p>
          <p>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p>
          <p>Total: {order.currency} {Number(order.total).toFixed(2)} · Cash on delivery</p>
          <label>
            Delivery status{' '}
            <select value={order.fulfillmentStatus} onChange={(event) => changeStatus(order, event.target.value)}>
              {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
        </article>
      ))}
    </section>
  );
}
