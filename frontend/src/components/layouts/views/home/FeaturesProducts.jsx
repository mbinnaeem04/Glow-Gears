import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../../../../context/CartContext';
import { useCatalog } from '../../../../context/CatalogContext';

export default function FeaturesProducts() {
  const { products, loading, error } = useCatalog();
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);
  const [actionError, setActionError] = useState('');
  const handleAdd = async (product) => {
    setActionError('');
    try {
      await addToCart(product);
      setAddedId(product.id);
      window.setTimeout(() => setAddedId((current) => current === product.id ? null : current), 1300);
    } catch (requestError) { setActionError(requestError.message || 'Could not add this item.'); }
  };

  return <section className="section featured-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">The good stuff</span><h2>Favorites worth a closer look.</h2></div><Link className="text-link" to="/shop">Explore everything <span aria-hidden="true">→</span></Link></div>{error && <p className="form-error" role="alert">{error}</p>}{actionError && <p className="form-error" role="alert">{actionError}</p>}{loading ? <div className="loading-state">Loading favorites…</div> : products.length ? <div className="product-grid">{products.slice(0, 4).map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt={product.name} loading="lazy" /><span className="product-badge">{product.featured ? 'A good pick' : 'In the collection'}</span></div><div className="product-card-body"><p className="product-category">GlowGears selection</p><h3>{product.name}</h3><p className="product-description">{product.description}</p><div className="product-card-footer"><span className="product-price">${(Number(product.price) || 0).toFixed(2)}</span><button disabled={Number(product.quantity) <= 0} className={`add-button${addedId === product.id ? ' added' : ''}`} onClick={() => handleAdd(product)}>{Number(product.quantity) <= 0 ? 'Sold out' : addedId === product.id ? 'Added ✓' : 'Add to bag +'}</button></div></div></article>)}</div> : <div className="empty-state">No products are available yet.</div>}</div></section>;
}
