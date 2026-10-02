import { useState } from "react";
import { useCart } from "../../../../context/CartContext";

const ProductCard = ({ id, title, price, image, description }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({ id, title, price, image, description });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="border rounded-lg shadow p-4 bg-zinc-900 text-white flex flex-col">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-green-400 mt-1 flex-grow">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-green-500 font-semibold text-lg">${price.toFixed(2)}</p>
        <button
          onClick={handleAddToCart}
          className={`bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded transition-shadow shadow-md ${
            added ? "ring-4 ring-green-300" : ""
          }`}
        >
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
