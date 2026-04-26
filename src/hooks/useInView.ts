/**
 * useInView Hook
 *
 * Custom hook for viewport detection using Intersection Observer API.
 * Returns a ref to attach to an element and a boolean indicating if the element is in view.
 *
 * @example
 * const { ref, inView } = useInView({ threshold: 0.5 });
 *
 * <motion.div
 *   ref={ref}
 *   initial="hidden"
 *   animate={inView ? "visible" : "hidden"}
 *   variants={fadeUp}
 * >
 *   Content
 * </motion.div>
 */

import { useEffect, useRef, useState } from 'react';

export interface UseInViewOptions {
  /**
   * Threshold for intersection (0.0 to 1.0)
   * 0.5 means element is considered "in view" when 50% visible
   * @default 0.5
   */
  threshold?: number | number[];

  /**
   * Root margin for intersection observer
   * Allows triggering before element enters viewport
   * @default "0px"
   */
  rootMargin?: string;

  /**
   * Whether to trigger only once
   * If true, element stays "in view" after first trigger
   * @default false
   */
  triggerOnce?: boolean;

  /**
   * Root element for intersection observer
   * @default null (viewport)
   */
  root?: Element | null;
}

export interface UseInViewReturn<T extends Element = HTMLDivElement> {
  /**
   * Ref to attach to the element being observed
   */
  ref: React.RefObject<T>;

  /**
   * Whether the element is currently in view
   */
  inView: boolean;
}

/**
 * Hook to detect when an element enters the viewport
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {}
): UseInViewReturn<T> {
  const {
    threshold = 0.5,
    rootMargin = '0px',
    triggerOnce = false,
    root = null,
  } = options;

  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    // If already triggered and triggerOnce is true, don't create observer
    if (hasTriggered.current && triggerOnce) {
      return;
    }

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('IntersectionObserver is not supported in this browser');
      setInView(true); // Fallback: consider everything visible
      return;
    }

    // Initial check: if element is already in viewport on mount, show it immediately
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const isInitiallyVisible = rect.top < windowHeight && rect.bottom > 0;

    if (isInitiallyVisible && !hasTriggered.current) {
      setInView(true);
      if (triggerOnce) {
        hasTriggered.current = true;
        return; // Don't create observer if already triggered
      }
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const isIntersecting = entry.isIntersecting;

        if (isIntersecting) {
          setInView(true);

          if (triggerOnce) {
            hasTriggered.current = true;
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root,
      rootMargin,
      threshold,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(element);

    // Cleanup
    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, root]);

  return { ref, inView };
}

/**
 * Hook variant with immediate triggering (no threshold)
 * Useful for elements that should animate as soon as any part is visible
 */
export function useInViewImmediate<T extends Element = HTMLDivElement>(
  options: Omit<UseInViewOptions, 'threshold'> = {}
): UseInViewReturn<T> {
  return useInView<T>({
    ...options,
    threshold: 0.01, // Trigger as soon as 1% is visible
  });
}

/**
 * Hook variant with delayed triggering
 * Useful for elements that should only animate when mostly visible
 */
export function useInViewDelayed<T extends Element = HTMLDivElement>(
  options: Omit<UseInViewOptions, 'threshold'> = {}
): UseInViewReturn<T> {
  return useInView<T>({
    ...options,
    threshold: 0.8, // Trigger when 80% is visible
  });
}

/**
 * Hook variant that triggers once and persists
 * Useful for scroll-triggered animations that shouldn't reverse
 */
export function useInViewOnce<T extends Element = HTMLDivElement>(
  options: Omit<UseInViewOptions, 'triggerOnce'> = {}
): UseInViewReturn<T> {
  return useInView<T>({
    ...options,
    triggerOnce: true,
  });
}
