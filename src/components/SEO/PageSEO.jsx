import { usePageSEO } from '../../hooks/usePageSEO';

/**
 * PageSEO Component
 * Wrapper component for page-specific SEO
 */
const PageSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
}) => {
  usePageSEO({
    title,
    description,
    keywords,
    image,
    url,
    type,
    twitterCard,
    noindex,
  });

  // This component doesn't render anything
  return null;
};

export default PageSEO;