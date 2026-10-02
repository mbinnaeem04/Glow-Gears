import { Link } from 'react-router-dom';
import Headphones from '../../../../assets/Headphones.jpg';
import Mobile from '../../../../assets/Mobile.jpg';
import Laptops from '../../../../assets/Laptops.jfif';
import Keyboards from '../../../../assets/Keyboards.jpg';

const defaults = [Headphones, Mobile, Laptops, Keyboards];

export default function TopCategories({ categories = [] }) {
  return <section className="section"><div className="container">
    <div className="section-heading"><div><span className="eyebrow">Browse by interest</span><h2>Find your kind of tech.</h2></div><Link className="text-link" to="/shop">All categories <span aria-hidden="true">→</span></Link></div>
    {categories.length ? <div className="category-grid">{categories.slice(0, 4).map((category, index) => <Link to={`/shop/category/${category.id}`} className="category-card" key={category.id}><img src={category.image || defaults[index % defaults.length]} alt={category.name || 'Product category'} loading="lazy" /><div className="category-card-copy"><div><h3>{category.name || 'Discover more'}</h3><p>{category.description || 'Explore the collection'}</p></div><span className="category-arrow" aria-hidden="true">↗</span></div></Link>)}</div> : <div className="empty-state"><div><div className="state-icon">⌕</div><h2>More categories are on the way</h2><p>In the meantime, explore the gear we’ve picked out for you.</p><Link className="btn btn-dark" to="/shop">Browse the shop</Link></div></div>}
  </div></section>;
}
