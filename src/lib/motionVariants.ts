/**
 * Motion Variants
 *
 * Centralized Framer Motion animation variants for consistent animations
 * across the application. Includes reduced-motion variants for accessibility.
 */

import type { Variants } from 'framer-motion';

/**
 * Fade In - Simple opacity transition
 * Duration: 600ms for headlines, 500ms for sections
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeIn',
    },
  },
};

/**
 * Fade In (Headline) - Hero headline animation
 * Duration: 600ms with ease-in
 */
export const fadeInHeadline: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeIn',
    },
  },
};

/**
 * Fade In (Subhead) - Hero subheadline animation
 * Duration: 300ms with delay after headline
 */
export const fadeInSubhead: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: 0.3,
      ease: 'easeIn',
    },
  },
};

/**
 * Fade Up - Vertical slide with fade
 * Duration: 500ms for section entries
 */
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Slide In Left - Horizontal slide from left
 * Duration: 500ms
 */
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Slide In Right - Horizontal slide from right
 * Duration: 300ms for mobile menu
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

/**
 * Scale Up - Scale with fade for card hovers
 * Duration: 200ms for interactions
 */
export const scaleUp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

/**
 * Stagger Container - Parent container for staggered children
 * Staggers child animations with 100ms delay between each
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger Item - Child item for staggered animations
 */
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * Footer Reveal - Slide up animation for footer
 * Duration: 400ms
 */
export const footerReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * Mobile Menu - Slide animation for mobile navigation
 * Duration: 300ms
 */
export const mobileMenu: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

/**
 * Link Underline - Underline animation from left
 * Duration: 150ms
 */
export const linkUnderline: Variants = {
  hidden: {
    width: 0,
  },
  visible: {
    width: '100%',
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
};

/**
 * Reduced Motion Variants
 *
 * Accessible variants that respect prefers-reduced-motion
 * All animations are disabled for users who prefer reduced motion
 */
export const reducedMotionVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  },
  fadeUp: {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0 },
  },
  slideInLeft: {
    hidden: { opacity: 1, x: 0 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 1, x: 0 },
    visible: { opacity: 1, x: 0 },
  },
  scaleUp: {
    hidden: { opacity: 1, scale: 1 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1 },
  },
  staggerContainer: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  },
  footerReveal: {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0 },
  },
  mobileMenu: {
    hidden: { x: 0, opacity: 1 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 0, opacity: 1 },
  },
  linkUnderline: {
    hidden: { width: '100%' },
    visible: { width: '100%' },
  },
};

/**
 * Get appropriate variants based on reduced motion preference
 *
 * @param variantName - Name of the variant to retrieve
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns The appropriate variants object
 */
export const getVariants = (
  variantName: keyof typeof reducedMotionVariants,
  prefersReducedMotion: boolean
): Variants => {
  if (prefersReducedMotion) {
    return reducedMotionVariants[variantName];
  }

  switch (variantName) {
    case 'fadeIn':
      return fadeIn;
    case 'fadeUp':
      return fadeUp;
    case 'slideInLeft':
      return slideInLeft;
    case 'slideInRight':
      return slideInRight;
    case 'scaleUp':
      return scaleUp;
    case 'staggerContainer':
      return staggerContainer;
    case 'footerReveal':
      return footerReveal;
    case 'mobileMenu':
      return mobileMenu;
    case 'linkUnderline':
      return linkUnderline;
    default:
      return fadeIn;
  }
};
