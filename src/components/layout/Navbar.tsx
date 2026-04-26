import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useScrolled } from '../../hooks/useScrolled';

export const Navbar = () => {
  const isScrolled = useScrolled(50);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'capabilities', label: 'Services' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'contact', label: 'Contact' },
  ];

  // Smooth scroll to section
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close mobile menu after clicking a link
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Track active section using IntersectionObserver
  useEffect(() => {
    const sections = ['home', 'about', 'michelle', 'capabilities', 'engagement', 'contact'];
    const observedSections = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        // Update the map with latest entries
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observedSections.set(entry.target.id, entry);
          } else {
            observedSections.delete(entry.target.id);
          }
        });

        // Find the section with the highest intersection ratio among visible sections
        let maxRatio = 0;
        let activeId = 'home';

        observedSections.forEach((entry, id) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeId = id;
          }
        });

        setActiveSection(activeId);
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '-80px 0px -40% 0px'
      }
    );

    // Observe all sections
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 text-white z-[1000] px-4 md:px-8 py-4 transition-all duration-300 ease-in-out bg-navy ${
        isScrolled ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, 'home')}
          className="flex items-center gap-2 md:gap-4 no-underline text-white hover:text-gold transition-colors z-[1001]"
        >
          <img
            src="/logo.svg"
            alt="Honeyman Enterprises"
            className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] object-contain"
          />
          <span className="text-lg md:text-xl font-bold">Honeyman Enterprises</span>
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex list-none gap-8 m-0 p-0">
          {navItems.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className={
                  activeSection === link.id
                    ? 'text-gold border-b-2 border-gold pb-1 no-underline text-base font-medium transition-colors'
                    : 'text-white hover:text-gold transition-colors no-underline text-base font-medium'
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white hover:text-gold transition-colors z-[1001] p-2"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-[72px] left-0 right-0 bg-navy border-t border-teal transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-screen opacity-100 visible'
            : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}
      >
        <ul className="flex flex-col list-none gap-0 m-0 p-0">
          {navItems.map((link) => (
            <li key={link.id} className="border-b border-navy-light">
              <a
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className={
                  activeSection === link.id
                    ? 'text-gold bg-navy-dark block px-6 py-4 no-underline text-base font-medium transition-colors'
                    : 'text-white hover:text-gold hover:bg-navy-dark block px-6 py-4 transition-colors no-underline text-base font-medium'
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
