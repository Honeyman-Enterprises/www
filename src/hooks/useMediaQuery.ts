import { useState, useEffect } from 'react';

/**
 * Custom hook that tracks a CSS media query match state
 *
 * @param query - CSS media query string (e.g., '(min-width: 768px)')
 * @returns Boolean indicating if the media query matches
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 640px)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
