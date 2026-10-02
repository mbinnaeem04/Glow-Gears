import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';

export default function Support() {
  return <div className="site-shell"><Navbar /><main className="page-content container info-page"><div className="info-panel"><span className="eyebrow">Here to help</span><h1>Let’s sort it out.</h1><p>Questions about an order, need a recommendation, or just want a hand? Drop us a line — a real person will get back to you.</p><a className="btn btn-dark" href="mailto:support@glowgears.com">Email support <span aria-hidden="true">↗</span></a><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 18, marginTop: 38 }}><div style={{ padding: 20, borderRadius: 14, background: '#f4f6ef' }}><strong>Product questions</strong><p style={{ margin: '8px 0 0', fontSize: '.9rem' }}>Tell us what you’re looking for — we’ll help find the right fit.</p></div><div style={{ padding: 20, borderRadius: 14, background: '#f4f6ef' }}><strong>Order support</strong><p style={{ margin: '8px 0 0', fontSize: '.9rem' }}>Include your order details in an email and we’ll take it from there.</p></div></div></div></main><Footer /></div>;
}
