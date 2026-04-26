import { ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');

  // Parallax scroll effect - disable on mobile and for reduced motion
  const { scrollY } = useScroll();
  const y = useTransform(
    scrollY,
    [0, 500],
    [0, 500 * 0.4],
    { clamp: false }
  );

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Animation variants for headline
  const headlineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeIn' }
    }
  };

  // Disable animations if reduced motion is preferred
  const noAnimation = { hidden: {}, visible: {} };

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center bg-navy overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 0,
          // Apply parallax only on desktop and without reduced motion
          y: !isMobile && !shouldReduceMotion ? y : 0
        }}
      >
        <img
          src="/hero_image.png"
          alt="Honeyman Enterprises"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Radial Gradient Overlay - fades from center to navy edges */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 1,
          background: `radial-gradient(ellipse at center, transparent 0%, transparent 30%, rgba(11, 36, 66, 0.4) 60%, rgba(11, 36, 66, 0.8) 85%, #0B2442 100%)`
        }}
      />
      <div className="container mx-auto px-6 relative z-10 text-center text-white">
        <motion.h1
          className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-10 font-heading"
          style={{ textShadow: '2px 2px black' }}
          initial="hidden"
          animate="visible"
          variants={shouldReduceMotion ? noAnimation : headlineVariants}
        >
          Processes that work for you
        </motion.h1>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#contact"
            className="bg-gold hover:bg-gold-dark text-white font-bold py-4 px-8 rounded-full transition duration-300"
          >
            Schedule a Call
          </a>
          <a
            href="#capabilities"
            className="bg-transparent hover:bg-white/20 border-2 border-white text-white font-bold py-4 px-8 rounded-full transition duration-300"
          >
            Explore Services
          </a>
        </div>
      </div>
      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce cursor-pointer z-20 bg-transparent border-none p-4 hover:opacity-80 transition-opacity"
        aria-label="Scroll to about section"
      >
        <ChevronDown className="text-white h-10 w-10" />
      </button>
    </section>
  );
};
