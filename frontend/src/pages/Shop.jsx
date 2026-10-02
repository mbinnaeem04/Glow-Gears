import { Link } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import { useCatalog } from '../context/CatalogContext';

export default function Shop() {
  const { categories, loading, error } = useCatalog();
  return <div className="site-shell"><Navbar /><main className="page-content"><div className="container"><header className="page-hero"><span className="eyebrow">The GlowGears edit</span><h1>Find your next favorite.</h1><p>From your workday setup to your weekend soundtrack, start with a category and see where it takes you.</p></header>
    {loading ? <div className="loading-state">Loading categories…</div> : error ? <div className="empty-state"><div><h2>Shop is temporarily unavailable</h2><p>{error}</p><button className="btn btn-dark" onClick={() => window.location.reload()}>Try again</button></div></div> : categories.length ? <div className="shop-category-grid">{categories.map((category) => <Link to={`/shop/category/${category.id}`} key={category.id} className="category-card shop-category-card"><img src={category.image} alt={category.name} loading="lazy" /><div className="category-card-copy"><div><h3>{category.name}</h3><p>{category.description}</p></div><span className="category-arrow" aria-hidden="true">↗</span></div></Link>)}</div> : <div className="empty-state"><div><div className="state-icon">⌕</div><h2>No categories yet</h2><p>Check back soon for new collections.</p></div></div>}
  </div></main><Footer /></div>;
}
