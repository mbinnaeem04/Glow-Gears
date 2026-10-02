import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Headphones from '../../assets/Headphones.jpg';

export default function ProductCard({ product, categoryName = 'GlowGears selection' }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const name = product.name || product.title || 'Everyday essential';
  const price = Number(product.price) || 0;

  const handleAdd = async () => {
    setError('');
    try {
      await addToCart(product);
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1300);
    } catch (requestError) {
      setError(requestError.message || 'Could not add this item.');
    }
  };

  return <article className="product-card"><div className="product-image"><img src={product.image || Headphones} alt={name} loading="lazy" /><span className="product-badge">{Number(product.quantity) > 0 ? 'In the collection' : 'Out of stock'}</span></div><div className="product-card-body"><p className="product-category">{categoryName}</p><h3>{name}</h3><p className="product-description">{product.description || 'Thoughtfully picked, ready for whatever’s next.'}</p><div className="product-card-footer"><span className="product-price">${price.toFixed(2)}</span><button className={`add-button${added ? ' added' : ''}`} onClick={handleAdd} disabled={Number(product.quantity) <= 0}>{Number(product.quantity) <= 0 ? 'Sold out' : added ? 'Added ✓' : 'Add to bag +'}</button></div>{error && <p className="form-error" role="alert">{error}</p>}</div></article>;
}
