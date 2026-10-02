const TestimonialBox = ({ name, role, comment, avatar }) => (
  <div className="bg-zinc-900 p-6 rounded-lg shadow-md hover:shadow-green-500/40 transition duration-300">
    <div className="flex items-center mb-4">
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-green-500"
      />
      <div>
        <h4 className="font-bold text-green-300">{name}</h4>
        <p className="text-gray-400 text-sm">{role}</p>
      </div>
    </div>
    <p className="text-gray-300 italic">"{comment}"</p>
    <div className="flex mt-4 text-green-400">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  </div>
);

export default TestimonialBox;
