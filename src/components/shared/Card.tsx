import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'flat' | 'bordered';
  interactive?: boolean;
  showUnderline?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    variant = 'elevated',
    interactive = false,
    showUnderline = false,
    className,
    children,
    ...rest
  }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    const baseStyles = 'rounded-lg overflow-hidden';

    const variants = {
      elevated: 'bg-white shadow-lg',
      flat: 'bg-cream',
      bordered: 'bg-white border-2 border-cream',
    };

    // Static styles for reduced motion users
    const interactiveStyles = interactive
      ? 'cursor-pointer'
      : '';

    // Motion variants for hover animation
    const hoverVariants = {
      rest: {
        scale: 1,
        boxShadow: variant === 'elevated'
          ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
          : 'none',
      },
      hover: {
        scale: prefersReducedMotion ? 1 : 1.03,
        boxShadow: variant === 'elevated'
          ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
          : 'none',
        transition: {
          duration: 0.2,
          ease: [0, 0, 0.2, 1] as const,
        },
      },
    };

    const underlineVariants = {
      rest: {
        width: '0%',
        transition: {
          duration: 0.2,
          ease: [0, 0, 0.2, 1] as const,
        },
      },
      hover: {
        width: '100%',
        transition: {
          duration: 0.2,
          ease: [0, 0, 0.2, 1] as const,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        initial="rest"
        whileHover={interactive ? "hover" : "rest"}
        animate="rest"
        variants={interactive && !prefersReducedMotion ? hoverVariants : { rest: {}, hover: {} }}
        className={cn(
          baseStyles,
          variants[variant],
          interactiveStyles,
          'p-6 relative',
          className
        )}
        {...rest}
      >
        {children}

        {interactive && showUnderline && (
          <motion.div
            className="absolute bottom-0 left-6 right-6 h-0.5 bg-gold"
            variants={!prefersReducedMotion ? underlineVariants : { rest: {}, hover: {} }}
          />
        )}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
