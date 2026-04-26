/**
 * Google Analytics 4 Utility Functions
 * Provides type-safe helpers for GA4 event tracking
 */

interface GAEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Send a custom event to GA4
 * @param eventName - Name of the event (e.g., 'button_click', 'form_submit')
 * @param params - Event parameters
 */
export const trackEvent = (eventName: string, params?: GAEventParams): void => {
  if (typeof window.gtag !== 'undefined' && import.meta.env.VITE_GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, params);

    if (import.meta.env.DEV) {
      console.log('GA4 Event:', eventName, params);
    }
  }
};

/**
 * Track a button click event
 * @param label - Descriptive label for the button
 * @param category - Optional category (defaults to 'engagement')
 */
export const trackButtonClick = (label: string, category = 'engagement'): void => {
  trackEvent('button_click', {
    event_category: category,
    event_label: label,
  });
};

/**
 * Track a form submission
 * @param formName - Name of the form
 * @param success - Whether the submission was successful
 */
export const trackFormSubmit = (formName: string, success = true): void => {
  trackEvent('form_submit', {
    event_category: 'forms',
    event_label: formName,
    value: success ? 1 : 0,
  });
};

/**
 * Track a link click (external or internal)
 * @param url - The link URL
 * @param label - Descriptive label for the link
 * @param isExternal - Whether it's an external link
 */
export const trackLinkClick = (url: string, label: string, isExternal = false): void => {
  trackEvent('link_click', {
    event_category: isExternal ? 'external_links' : 'internal_links',
    event_label: label,
    link_url: url,
  });
};

/**
 * Track a file download
 * @param fileName - Name of the downloaded file
 * @param fileType - Type/extension of the file
 */
export const trackFileDownload = (fileName: string, fileType: string): void => {
  trackEvent('file_download', {
    event_category: 'downloads',
    event_label: fileName,
    file_type: fileType,
  });
};

/**
 * Track video interactions
 * @param action - Video action (play, pause, complete)
 * @param videoTitle - Title of the video
 */
export const trackVideoInteraction = (
  action: 'play' | 'pause' | 'complete',
  videoTitle: string
): void => {
  trackEvent('video_interaction', {
    event_category: 'video',
    event_label: videoTitle,
    video_action: action,
  });
};

/**
 * Track search queries
 * @param searchTerm - The search term used
 * @param resultsCount - Number of results returned
 */
export const trackSearch = (searchTerm: string, resultsCount?: number): void => {
  trackEvent('search', {
    event_category: 'search',
    search_term: searchTerm,
    ...(resultsCount !== undefined && { results_count: resultsCount }),
  });
};

/**
 * Track errors or exceptions
 * @param description - Error description
 * @param fatal - Whether the error is fatal
 */
export const trackError = (description: string, fatal = false): void => {
  trackEvent('exception', {
    description,
    fatal: fatal ? 'true' : 'false',
  });
};

/**
 * Track timing/performance metrics
 * @param name - Name of the metric
 * @param value - Time value in milliseconds
 * @param category - Optional category
 */
export const trackTiming = (name: string, value: number, category = 'performance'): void => {
  trackEvent('timing_complete', {
    event_category: category,
    name,
    value,
  });
};
