import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface LoadingSpinnerProps {
  /** Size of the spinner in pixels */
  size?: number;
  /** Color of the spinner (defaults to gold) */
  color?: string;
  /** Whether to show full-screen overlay */
  fullScreen?: boolean;
}

/**
 * Professional loading spinner with accessibility support
 * Matches brand colors and respects reduced motion preferences
 */
export const LoadingSpinner = ({
  size = 48,
  color = '#BE8A2F',
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const shouldReduceMotion = useReducedMotion();

  // Container classes - full screen or inline
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-navy z-50'
    : 'flex items-center justify-center';

  // Reduced motion: simple pulsing dot instead of spinning circle
  if (shouldReduceMotion) {
    return (
      <div className={containerClasses} role="status" aria-label="Loading">
        <motion.div
          style={{
            width: size / 2,
            height: size / 2,
            borderRadius: '50%',
            backgroundColor: color,
          }}
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Full animation: spinning circle with elegant fade-in
  return (
    <div className={containerClasses} role="status" aria-label="Loading">
      <motion.div
        style={{
          width: size,
          height: size,
          border: `3px solid rgba(190, 138, 47, 0.2)`,
          borderTop: `3px solid ${color}`,
          borderRadius: '50%',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
