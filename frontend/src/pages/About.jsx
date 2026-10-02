import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import HeroImage from '../assets/HeroSection.png';

export default function About() {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="page-content container info-page">
        <div
          className="info-panel"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr minmax(220px,.8fr)",
            gap: 36,
            alignItems: "center",
          }}
        >
          <div>
            <span className="eyebrow">A little about us</span>
            <h1>We believe good gear makes room for good things.</h1>
            <p>
              GlowGears is a small edit of useful, well-made tech for people who
              want their devices to work beautifully and fit naturally into
              everyday life.
            </p>
            <p>
              We care about thoughtful details, uncomplicated shopping, and
              helping you find just the right thing — not the most things.
            </p>
          </div>
          <img
            src={HeroImage}
            alt="A laptop ready for work and play"
            style={{
              width: "100%",
              aspectRatio: "4 / 3",
              objectFit: "cover",
              borderRadius: 16,
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
