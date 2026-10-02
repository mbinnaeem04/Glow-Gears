const testimonials = [
  { name: 'Sarah Johnson', role: 'Designer & happy customer', comment: 'The quality is lovely, but the recommendations are what got me. I found exactly what I needed without the usual hours of searching.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Michael Chen', role: 'Tech enthusiast', comment: 'A refreshing place to shop for gear. Everything feels considered, delivery was quick, and the team was genuinely helpful.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Emma Davis', role: 'Everyday explorer', comment: 'My new desk setup feels completely different. Great products, no pressure, and a surprisingly personal experience.', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
];

export default function Testimonials() {
  return <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Kind words from the community</span><h2>Good gear, good stories.</h2></div></div><div className="testimonial-grid">{testimonials.map((item) => <article className="testimonial-card" key={item.name}><div className="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“{item.comment}”</blockquote><div className="testimonial-person"><img src={item.avatar} alt="" loading="lazy" /><div><strong>{item.name}</strong><span>{item.role}</span></div></div></article>)}</div></div></section>;
}
