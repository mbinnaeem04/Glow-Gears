import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import ProductCard from '../components/common/ProductCard';
import { useCatalog } from '../context/CatalogContext';

const clean = (value) => String(value ?? '').trim().toLowerCase();

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { categories, products, loading, error } = useCatalog();
  const [sort, setSort] = useState('featured');
  const category = categories.find((item) => item.id === categoryId);
  const categoryProducts = products.filter((product) => clean(product.categoryId ?? product.category ?? product.categoryName) === clean(categoryId) || clean(product.categoryId ?? product.category ?? product.categoryName) === clean(category?.name));
  const visibleProducts = useMemo(() => {
    const sorted = [...categoryProducts];
    if (sort === 'price-low') sorted.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    if (sort === 'price-high') sorted.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    if (sort === 'name') sorted.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    return sorted;
  }, [categoryProducts, sort]);

  return <div className="site-shell"><Navbar /><main className="page-content"><div className="container"><div className="breadcrumbs"><Link to="/">Home</Link> &nbsp;/&nbsp; <Link to="/shop">Shop</Link>{category && <> &nbsp;/&nbsp; <span>{category.name}</span></>}</div>
    {loading ? <div className="loading-state">Loading this collection…</div> : error ? <div className="empty-state"><div><div className="state-icon">⌕</div><h2>Collection unavailable</h2><p>{error}</p><Link to="/shop" className="btn btn-dark">Back to shop</Link></div></div> : !category ? <div className="empty-state"><div><div className="state-icon">⌕</div><h2>That category isn’t here</h2><p>It may have moved, but there’s plenty more to explore.</p><Link to="/shop" className="btn btn-dark">Explore all categories</Link></div></div> : <><header className="category-hero"><img src={category.image} alt="" /><div><span className="eyebrow" style={{ color: '#d9f5ad' }}>A GlowGears collection</span><h1>{category.name}</h1><p>{category.description || 'Thoughtful tech to make every day a little better.'}</p></div></header><div className="shop-toolbar"><span>{categoryProducts.length} {categoryProducts.length === 1 ? 'piece' : 'pieces'} to explore</span><label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label></div>{visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} categoryName={category.name} />)}</div> : <div className="empty-state"><div><div className="state-icon">⌕</div><h2>Nothing in this collection just yet</h2><p>Take a look at the rest of the shop — your next favorite might be there.</p><Link to="/shop" className="btn btn-dark">Browse other categories</Link></div></div>}</>}
  </div></main><Footer /></div>;
}
