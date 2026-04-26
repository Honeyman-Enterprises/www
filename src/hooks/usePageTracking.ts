import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for GA4 page view tracking
 * Automatically tracks page views on route changes
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if gtag is available and GA is configured
    if (typeof window.gtag !== 'undefined' && import.meta.env.VITE_GA_MEASUREMENT_ID) {
      const pageTitle = document.title;
      const pagePath = location.pathname + location.search;
      const pageLocation = window.location.href;

      // Send page_view event to GA4
      window.gtag('event', 'page_view', {
        page_title: pageTitle,
        page_path: pagePath,
        page_location: pageLocation,
      });

      // Optional: log for debugging (remove in production)
      if (import.meta.env.DEV) {
        console.log('GA4 Page View:', {
          page_title: pageTitle,
          page_path: pagePath,
          page_location: pageLocation,
        });
      }
    }
  }, [location]);
};

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}
