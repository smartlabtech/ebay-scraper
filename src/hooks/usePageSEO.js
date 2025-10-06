import { useEffect } from 'react';

/**
 * Custom hook for managing page-specific SEO without external dependencies
 * Works with React 19 and updates document head directly
 */
export const usePageSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
}) => {
  useEffect(() => {
    const siteTitle = 'BrandBanda';
    const defaultDescription = 'AI-Powered Brand Management Platform - Create targeted brand messaging and generate engaging social media copy';
    const defaultImage = 'https://brandbanda.com/og-default.png';
    const baseUrl = 'https://brandbanda.com';

    // Prepare SEO data
    const seo = {
      title: title ? `${title} | ${siteTitle}` : siteTitle,
      description: description || defaultDescription,
      image: image || defaultImage,
      url: url ? `${baseUrl}${url}` : baseUrl,
    };

    // Update title
    document.title = seo.title;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          element.setAttribute('property', selector.split('"')[1]);
        } else if (selector.includes('name=')) {
          element.setAttribute('name', selector.split('"')[1]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // Update primary meta tags
    updateMetaTag('meta[name="title"]', 'content', seo.title);
    updateMetaTag('meta[name="description"]', 'content', seo.description);
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', 'content', keywords);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seo.url);

    // Update Open Graph tags
    updateMetaTag('meta[property="og:type"]', 'content', type);
    updateMetaTag('meta[property="og:url"]', 'content', seo.url);
    updateMetaTag('meta[property="og:title"]', 'content', seo.title);
    updateMetaTag('meta[property="og:description"]', 'content', seo.description);
    updateMetaTag('meta[property="og:image"]', 'content', seo.image);
    updateMetaTag('meta[property="og:site_name"]', 'content', siteTitle);

    // Update Twitter Card tags
    updateMetaTag('meta[property="twitter:card"]', 'content', twitterCard);
    updateMetaTag('meta[property="twitter:url"]', 'content', seo.url);
    updateMetaTag('meta[property="twitter:title"]', 'content', seo.title);
    updateMetaTag('meta[property="twitter:description"]', 'content', seo.description);
    updateMetaTag('meta[property="twitter:image"]', 'content', seo.image);

    // Handle robots meta tag
    if (noindex) {
      updateMetaTag('meta[name="robots"]', 'content', 'noindex,nofollow');
    } else {
      const robotsTag = document.querySelector('meta[name="robots"]');
      if (robotsTag && robotsTag.content === 'noindex,nofollow') {
        robotsTag.setAttribute('content', 'index,follow');
      }
    }

    // Cleanup function to restore defaults when component unmounts
    return () => {
      // Optionally restore default title
      document.title = `${siteTitle} - AI-Powered Brand Management Platform`;
    };
  }, [title, description, keywords, image, url, type, twitterCard, noindex]);
};

export default usePageSEO;