/**
 * ScrollToTop Component
 *
 * Automatically scrolls window to top on route changes in React Router.
 * This ensures each new page loads from the top of the viewport.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately when pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
