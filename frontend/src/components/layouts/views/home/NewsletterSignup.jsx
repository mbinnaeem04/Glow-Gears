import { Link } from 'react-router-dom';

export default function NewsletterSignup() {
  return <section className="newsletter"><div className="container"><div className="newsletter-panel"><div><span className="eyebrow">A better setup starts here</span><h2>Ready for a fresh favorite?</h2><p>Explore the collection and find a little something that makes your everyday better.</p></div><Link className="btn btn-dark" to="/shop">Find your next favorite <span aria-hidden="true">↗</span></Link></div></div></section>;
}
