import { useEffect } from 'react';
import { siteMeta } from '../../config/siteMeta';

const SiteMetaTags = ({
  title,
  description,
  keywords,
  ogImage,
  noIndex = false,
  canonicalUrl
}) => {
  // Use page-specific values or fallback to site defaults
  const pageTitle = title
    ? `${title} | ${siteMeta.siteName.en}`
    : siteMeta.seo.title;

  const pageDescription = description || siteMeta.seo.description;
  const pageKeywords = keywords || siteMeta.seo.keywords;
  const pageOgImage = ogImage || siteMeta.seo.ogImage;

  useEffect(() => {
    // Update document title
    document.title = pageTitle;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          element.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
        } else if (selector.includes('name=')) {
          element.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // Update basic meta tags
    updateMetaTag('meta[name="description"]', 'content', pageDescription);
    updateMetaTag('meta[name="keywords"]', 'content', pageKeywords);
    updateMetaTag('meta[name="author"]', 'content', siteMeta.seo.author);

    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', 'content', pageTitle);
    updateMetaTag('meta[property="og:description"]', 'content', pageDescription);
    updateMetaTag('meta[property="og:image"]', 'content', pageOgImage);
    updateMetaTag('meta[property="og:site_name"]', 'content', siteMeta.siteName.en);
    updateMetaTag('meta[property="og:type"]', 'content', 'website');

    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', 'content', siteMeta.seo.twitterCard);
    updateMetaTag('meta[name="twitter:site"]', 'content', siteMeta.seo.twitterSite);
    updateMetaTag('meta[name="twitter:title"]', 'content', pageTitle);
    updateMetaTag('meta[name="twitter:description"]', 'content', pageDescription);
    updateMetaTag('meta[name="twitter:image"]', 'content', pageOgImage);

    // Update theme color
    updateMetaTag('meta[name="theme-color"]', 'content', siteMeta.brandColors.primary);

    // Handle canonical URL
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }

    // Handle noIndex
    if (noIndex) {
      updateMetaTag('meta[name="robots"]', 'content', 'noindex, nofollow');
    }

    // Cleanup function to restore original title if component unmounts
    return () => {
      if (title) {
        document.title = siteMeta.seo.title;
      }
    };
  }, [pageTitle, pageDescription, pageKeywords, pageOgImage, canonicalUrl, noIndex]);

  return null; // This component doesn't render anything visible
};

export default SiteMetaTags;