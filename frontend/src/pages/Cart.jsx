import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api.js';

const emptyAddress = { fullName: '', street: '', city: '', country: '', postalCode: '', phone: '' };

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, refreshCart, loading: cartLoading, error: cartError } = useCart();
  const { user } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [address, setAddress] = useState(emptyAddress);
  const [checkoutError, setCheckoutError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

  const handleCheckout = async (event) => {
    event.preventDefault();
    setCheckoutError('');
    setPlacingOrder(true);
    try {
      const data = await apiRequest('/api/orders', { method: 'POST', body: { shippingAddress: address, paymentMethod: 'cash_on_delivery' } });
      setPlacedOrder(data.order);
      setCheckoutOpen(false);
      await refreshCart();
    } catch (requestError) {
      setCheckoutError(requestError.message || 'Your order could not be placed.');
    } finally { setPlacingOrder(false); }
  };

  return <div className="site-shell"><Navbar /><main className="page-content container"><div className="page-hero"><span className="eyebrow">Your picks</span><h1>Your bag.</h1><p>The little things that make every day better.</p></div>
    {placedOrder && <section role="status" className="info-panel" style={{ marginBottom: 24 }}><span className="eyebrow">Order placed</span><h2>Thanks for your order.</h2><p>Order <strong>{placedOrder.orderNumber}</strong> is recorded. Payment is cash on delivery; pay when it arrives.</p><Link to="/account" className="btn btn-dark">View your orders</Link></section>}
    {cartLoading ? <div className="loading-state">Loading your bag…</div> : !cartItems.length ? <div className="cart-list cart-empty"><div className="state-icon" style={{ marginInline: 'auto' }}>◇</div><h2>Your bag is taking a breather.</h2><p style={{ color: 'var(--muted)', marginBottom: 22 }}>Nothing in here yet — let’s find something good.</p><Link to="/shop" className="btn btn-dark">Explore the shop</Link></div> : <div className="cart-layout"><section className="cart-list" aria-label="Items in your bag">{(cartError || checkoutError) && <p className="form-error" role="alert">{checkoutError || cartError}</p>}{cartItems.map((item) => { const title = item.title || item.name || 'Everyday essential'; const quantity = Number(item.quantity) || 1; return <article className="cart-item" key={item.id}><img src={item.image || '/placeholder-product.svg'} alt={title} /><div><h3>{title}</h3><p>Qty {quantity}</p><button className="remove-button" onClick={() => removeFromCart(item.id).catch((error) => setCheckoutError(error.message))}>Remove</button></div><div className="cart-item-price">${((Number(item.price) || 0) * quantity).toFixed(2)}</div></article>; })}</section><aside className="cart-summary"><h2>Order summary</h2><div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="summary-row"><span>Shipping</span><span>Free</span></div><div className="summary-row total"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>{!user ? <><p>Log in to place an order. Your guest bag will be merged after sign-in.</p><Link className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }} to="/login">Log in to checkout</Link></> : <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setCheckoutError(''); setCheckoutOpen((open) => !open); }}>{checkoutOpen ? 'Close checkout' : 'Continue to checkout'}</button>}<button className="remove-button" style={{ width: '100%', marginTop: 10 }} onClick={() => clearCart().catch((error) => setCheckoutError(error.message))}>Clear bag</button></aside></div>}
    {checkoutOpen && user && cartItems.length > 0 && <form onSubmit={handleCheckout} className="info-panel" style={{ maxWidth: 700, margin: '28px auto', display: 'grid', gap: 14 }}><span className="eyebrow">Cash on delivery</span><h2>Where should we send it?</h2><p>Online card payments are not configured in this project. This checkout currently places an order for cash payment on delivery.</p><div className="form-field"><label htmlFor="ship-name">Full name</label><input id="ship-name" value={address.fullName} onChange={(event) => setAddress({ ...address, fullName: event.target.value })} maxLength={100} required /></div><div className="form-field"><label htmlFor="ship-street">Street address</label><input id="ship-street" value={address.street} onChange={(event) => setAddress({ ...address, street: event.target.value })} maxLength={200} required /></div><div className="form-field"><label htmlFor="ship-city">City</label><input id="ship-city" value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} maxLength={100} required /></div><div className="form-field"><label htmlFor="ship-country">Country</label><input id="ship-country" value={address.country} onChange={(event) => setAddress({ ...address, country: event.target.value })} maxLength={80} required /></div><div className="form-field"><label htmlFor="ship-postal">Postal code (optional)</label><input id="ship-postal" value={address.postalCode} onChange={(event) => setAddress({ ...address, postalCode: event.target.value })} maxLength={30} /></div><div className="form-field"><label htmlFor="ship-phone">Phone (optional)</label><input id="ship-phone" type="tel" value={address.phone} onChange={(event) => setAddress({ ...address, phone: event.target.value })} maxLength={30} /></div>{checkoutError && <p className="form-error" role="alert">{checkoutError}</p>}<button className="btn btn-dark" disabled={placingOrder}>{placingOrder ? 'Placing order…' : 'Place cash-on-delivery order'}</button></form>}
  </main><Footer /></div>;
}
