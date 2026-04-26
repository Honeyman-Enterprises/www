import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { fadeUp, reducedMotionVariants } from '../../lib/motionVariants';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'navy' | 'cream' | 'full-bleed';
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ variant = 'default', className, children, id }, ref) => {
    const { ref: inViewRef, inView } = useInView({
      threshold: 0.1,
      triggerOnce: true,
      rootMargin: '0px 0px -100px 0px' // Trigger when 100px before entering viewport
    });
    const prefersReducedMotion = useReducedMotion();

    const variants = {
      default: 'bg-white',
      navy: 'bg-navy text-white',
      cream: 'bg-cream',
      'full-bleed': 'bg-white',
    };

    const containerStyles = variant !== 'full-bleed'
      ? 'max-w-7xl mx-auto px-6'
      : 'w-full';

    const animationVariants = prefersReducedMotion ? reducedMotionVariants.fadeUp : fadeUp;

    return (
      <motion.section
        ref={(node) => {
          // Merge refs
          inViewRef.current = node as HTMLElement;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        id={id}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={animationVariants}
        className={cn(
          'py-16 md:py-20 lg:py-28',
          variants[variant],
          className
        )}
      >
        <div className={containerStyles}>
          {children}
        </div>
      </motion.section>
    );
  }
);

Section.displayName = 'Section';

export default Section;
