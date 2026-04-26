import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
}

export const SEOHead = ({
  title = 'Honeyman Enterprises – Strategic Systems & AI Consulting',
  description = 'Helping growth-minded organizations scale through systems, automation, and intelligent innovation. Expert strategy, digital transformation, and AI consulting.',
  keywords = 'business consulting, AI consulting, digital transformation, systems thinking, business strategy, operational efficiency, automation, enterprise AI, strategic planning, business development',
  ogImage = 'https://honeymanenterprises.com/og-image.jpg',
  ogUrl = 'https://honeymanenterprises.com',
  canonicalUrl = 'https://honeymanenterprises.com',
}: SEOHeadProps) => {
  useEffect(() => {
    // Update meta tags dynamically
    document.title = title;

    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Honeyman Enterprises');
    updateMetaTag('robots', 'index, follow, max-image-preview:large');

    // Open Graph meta tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', ogUrl, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'Honeyman Enterprises', true);

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [title, description, keywords, ogImage, ogUrl, canonicalUrl]);

  return null;
};
