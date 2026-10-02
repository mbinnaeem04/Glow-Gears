import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand"><span className="brand-mark">g.</span><span>glowgears</span></Link>
          <p>Thoughtfully selected tech for how you work, play, and create. Better gear, less noise.</p>
        </div>
        <div><h3 className="footer-title">Explore</h3><div className="footer-links"><Link to="/shop">Shop all</Link><Link to="/shop">Categories</Link><Link to="/about">Our story</Link></div></div>
        <div><h3 className="footer-title">Need a hand?</h3><div className="footer-links"><Link to="/support">Support center</Link><Link to="/support">Shipping & returns</Link><Link to="/support">Contact us</Link></div></div>
        <div><h3 className="footer-title">The good stuff</h3><div className="footer-links"><span>New drops, useful advice, zero spam.</span><a href="mailto:support@glowgears.com">support@glowgears.com</a></div></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} GlowGears. Gear for your next move.</span><span>Designed for everyday curious minds.</span></div>
    </footer>
  );
}
