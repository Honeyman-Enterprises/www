export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'Home', path: '#home' },
    { name: 'About', path: '#about' },
    { name: 'Capabilities', path: '#capabilities' },
    { name: 'Engagement', path: '#engagement' },
    { name: 'Contact', path: '#contact' }
  ];

  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading">Honeyman Enterprises</h3>
            <p className="text-white/80">
              Strategic systems and intelligent innovation for organizations built to grow
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading">Quick Links</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    className="text-white/80 hover:text-white transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading">Stay Connected</h3>
            <p className="text-white/80 mb-4">Insights on systems thinking, innovation, and scalable growth</p>
            <form className="flex flex-col lg:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                type="submit"
                className="bg-gold hover:bg-gold-dark text-white font-bold px-6 py-2 rounded transition whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/60">
          <p>&copy; {currentYear} Honeyman Enterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
