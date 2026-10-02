import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const BagIcon = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 8h14l1 13H4L5 8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { cartItems } = useCart();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  useEffect(() => { setAccountOpen(false); setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    const closeOnOutsideClick = (event) => { if (accountRef.current && !accountRef.current.contains(event.target)) setAccountOpen(false); };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    navigate('/');
  };
  const links = role === 'admin'
    ? [{ to: '/', label: 'Home' }, { to: '/shop', label: 'Shop' }, { to: '/admin', label: 'Admin' }]
    : [{ to: '/', label: 'Home' }, { to: '/shop', label: 'Shop' }, { to: '/about', label: 'Our story' }, { to: '/support', label: 'Support' }];

  return <header className="site-header"><div className="container nav-inner">
    <Link to="/" className="brand" aria-label="GlowGears home"><span className="brand-mark">g.</span><span>glowgears</span></Link>
    <nav className="nav-links" aria-label="Main navigation">{links.map(({ to, label }) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>{label}</NavLink>)}</nav>
    <div className="nav-actions">
      {!user ? <Link to="/login" className="nav-login">Log in</Link> : <div ref={accountRef} style={{ position: 'relative' }}><button className="icon-button" aria-label="Open account menu" aria-expanded={accountOpen} onClick={() => setAccountOpen((open) => !open)}>{(user.displayName || user.name || user.email || 'G').slice(0, 1).toUpperCase()}</button>{accountOpen && <div className="nav-dropdown"><Link to="/account">My profile</Link><Link to="/cart">My bag</Link>{role === 'admin' && <Link to="/admin">Admin dashboard</Link>}<button onClick={handleLogout}>Log out</button></div>}</div>}
      <Link to="/cart" className="icon-button cart-link" aria-label={`Shopping bag, ${cartCount} items`}><BagIcon />{cartCount > 0 && <span className="cart-count">{cartCount}</span>}</Link>
      <button className="mobile-toggle" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? '×' : '☰'}</button>
    </div>
  </div>{mobileOpen && <nav className="mobile-menu container" aria-label="Mobile navigation">{links.map(({ to, label }) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}{!user && <Link to="/login">Log in</Link>}{user && <><Link to="/account">My profile</Link><button className="nav-user" onClick={handleLogout}>Log out</button></>}</nav>}</header>;
}
