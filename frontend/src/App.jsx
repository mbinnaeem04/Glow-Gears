import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, Link } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Admin = lazy(() => import('./pages/Admin'));
const Cart = lazy(() => import('./pages/Cart'));
const Account = lazy(() => import('./pages/Account'));
const Shop = lazy(() => import('./pages/Shop'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Support = lazy(() => import('./pages/Support'));
const About = lazy(() => import('./pages/About'));

function NotFound() {
  return <div className="site-shell"><Navbar /><main className="page-content container"><section className="empty-state" style={{ minHeight: 480 }}><div><span className="eyebrow">Wrong turn</span><h2 style={{ fontSize: '2.5rem', marginTop: 14 }}>This page wandered off.</h2><p>Let’s get you back to good gear.</p><Link className="btn btn-dark" to="/">Back to home</Link></div></section></main><Footer /></div>;
}

export default function App() {
  return <BrowserRouter><Suspense fallback={<div className="site-shell"><main className="page-content loading-state">Opening GlowGears…</main></div>}><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/shop/category/:categoryId" element={<CategoryPage />} />
    <Route path="/support" element={<Support />} />
    <Route path="/about" element={<About />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
    <Route path="/account" element={<ProtectedRoute allowedRoles={['customer', 'admin']}><Account /></ProtectedRoute>} />
    <Route path="/pages" element={<Navigate to="/shop" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes></Suspense></BrowserRouter>;
}
