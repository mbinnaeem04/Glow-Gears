const SectionContainer = ({ title, children }) => (
  <section className="py-16 bg-black text-white rounded-lg px-4 md:px-12">
    <h2 className="text-3xl font-bold mb-6 text-green-400 text-center">{title}</h2>
    <div>{children}</div>
  </section>
);

export default SectionContainer;
