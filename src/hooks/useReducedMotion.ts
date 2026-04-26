import { useMediaQuery } from './useMediaQuery';

/**
 * Custom hook that checks if user prefers reduced motion
 * Respects the prefers-reduced-motion media query for accessibility
 *
 * @returns Boolean indicating if animations should be disabled
 *
 * @example
 * const shouldReduceMotion = useReducedMotion();
 *
 * <motion.div
 *   animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
 *   transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
 * />
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
