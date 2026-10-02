import { Link } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import HeroSection from '../components/layouts/views/home/HeroSection';
import TopCategories from '../components/layouts/views/home/TopCategories';
import FeaturesProducts from '../components/layouts/views/home/FeaturesProducts';
import Testimonials from '../components/layouts/views/home/Testimonials';
import NewsletterSignup from '../components/layouts/views/home/NewsletterSignup';
import { useCatalog } from '../context/CatalogContext';

const trust = [
  ['↗', 'Curated, not crowded'], ['◇', 'Quality you can feel'], ['⌁', 'Fast, careful shipping'], ['♡', 'Real human support'],
];

export default function Home() {
  const { categories } = useCatalog();
  return <div className="site-shell"><Navbar /><main className="page-content">
    <HeroSection />
    <div className="container trust-strip" aria-label="Shopping benefits">{trust.map(([icon, label]) => <div className="trust-item" key={label}><span className="trust-icon" aria-hidden="true">{icon}</span>{label}</div>)}</div>
    <TopCategories categories={categories} />
    <FeaturesProducts />
    <section className="promise-section"><div className="container promise-inner"><div><span className="eyebrow" style={{ color: '#c9f45a' }}>The GlowGears difference</span><h2>Thoughtful picks.<br />No endless scrolling.</h2></div><div className="promise-list"><div className="promise-item"><strong>Only the good stuff</strong><p>Useful, well-made tech selected with a little extra care.</p></div><div className="promise-item"><strong>Made for real life</strong><p>Gear that feels at home at your desk, on the move, or in the game.</p></div><div className="promise-item"><strong>Here when you need us</strong><p>Friendly help from people who actually know the products.</p></div></div></div></section>
    <Testimonials /><NewsletterSignup />
  </main><Footer /></div>;
}
