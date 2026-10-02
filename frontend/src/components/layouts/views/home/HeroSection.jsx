import { Link } from 'react-router-dom';
import HeroImage from '../../../../assets/HeroSection.png';

export default function HeroSection() {
  return (
    <section className="hero-wrap">
      <div className="container">
        <div className="hero" style={{ '--hero-image': `url("${HeroImage}")` }}>
          <div className="hero-copy">
            <span className="hero-tag"><span /> The next generation of everyday tech</span>
            <h1>Good gear.<br /><em>Great days.</em></h1>
            <p>Meet the tech that keeps up with you. Carefully chosen essentials for work, play, and everything in between.</p>
            <div className="hero-actions"><Link className="btn btn-primary" to="/shop">Explore the shop <span aria-hidden="true">↗</span></Link><Link className="hero-secondary" to="/about">A little about us&nbsp; →</Link></div>
          </div>
          <span className="hero-note">Find your next favorite</span>
        </div>
      </div>
    </section>
  );
}
