import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: "headphones",
    name: "Headphones",
    image: "https://i.ibb.co/27KjXYFV/Headphones.jpg",
    description: "Experience high-quality sound with our headphones.",
  },
  {
    id: "mobiles",
    name: "Mobiles",
    image: "https://i.ibb.co/Y4hkQxPV/Mobile.jpg",
    description: "Latest smartphones with cutting-edge features.",
  },
  {
    id: "laptops",
    name: "Laptops",
    image: "https://i.ibb.co/HLNwG6XW/Laptops.jpg",
    description: "Powerful and portable laptops for work and play.",
  },
  {
    id: "keyboards",
    name: "Keyboards",
    image: "https://i.ibb.co/LMzxF0m/Keyboards.jpg",
    description: "Mechanical and membrane keyboards for every need.",
  },
  // Add more categories here...
];

export default function Shop() {
  const navigate = useNavigate();

  const handleCategoryClick = (id) => {
    navigate(`/shop/category/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Shop by Category</h1>
      <div className="flex flex-col space-y-8">
        {categories.map(({ id, name, image, description }) => (
          <div
            key={id}
            onClick={() => handleCategoryClick(id)}
            className="relative cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition"
            style={{ paddingTop: "56.25%" }} // 16:9 aspect ratio
          >
            <img
              src={image}
              alt={name}
              className="absolute top-0 left-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center p-6 text-white backdrop-blur-sm">
              <h2 className="text-4xl font-bold mb-2">{name}</h2>
              <p className="max-w-xl text-center text-lg">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
