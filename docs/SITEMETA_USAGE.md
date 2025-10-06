# SiteMetaTags Usage Guide

## Overview
`SiteMetaTags` is a React component that dynamically updates the page's meta tags for SEO optimization. It works without external dependencies and is compatible with React 19.

## How It Works
- Updates document meta tags using `useEffect`
- Automatically creates missing meta tags
- Cleans up when component unmounts
- Uses centralized configuration from `siteMeta.js`

## Basic Usage

### 1. Import the Component
```jsx
import SiteMetaTags from '../components/SEO/SiteMetaTags';
```

### 2. Add to Your Page Component

#### Landing Page Example
```jsx
const Landing2 = () => {
  return (
    <>
      <SiteMetaTags
        title="AI-Powered Brand Psychology Platform"
        description="Transform your brand with AI-driven psychological insights."
        keywords="brand psychology, AI marketing, brand messaging"
      />
      {/* Rest of your component */}
    </>
  );
};
```

#### Login Page Example
```jsx
const Login = () => {
  return (
    <>
      <SiteMetaTags
        title="Login"
        description="Sign in to your BrandBanda account"
        noIndex={true} // Prevent indexing of auth pages
      />
      {/* Login form */}
    </>
  );
};
```

#### Dashboard Example
```jsx
const Dashboard = () => {
  return (
    <>
      <SiteMetaTags
        title="Dashboard"
        description="Manage your brand content and analytics"
        noIndex={true} // Private page
      />
      {/* Dashboard content */}
    </>
  );
};
```

#### Pricing Page Example
```jsx
const Pricing = () => {
  return (
    <>
      <SiteMetaTags
        title="Pricing Plans"
        description="Choose the perfect plan for your brand. Flexible pricing with no hidden fees."
        keywords="pricing, plans, subscription, credits"
        canonicalUrl="https://www.brandbanda.com/pricing"
      />
      {/* Pricing content */}
    </>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | siteMeta.seo.title | Page title (will be appended with site name) |
| `description` | string | siteMeta.seo.description | Meta description for SEO |
| `keywords` | string | siteMeta.seo.keywords | SEO keywords |
| `ogImage` | string | siteMeta.seo.ogImage | Open Graph image URL |
| `noIndex` | boolean | false | Set to true for private pages |
| `canonicalUrl` | string | null | Canonical URL for the page |

## Best Practices

### 1. Public Pages (SEO Important)
```jsx
<SiteMetaTags
  title="Your Page Title"
  description="Compelling description for search engines"
  keywords="relevant, keywords, here"
  canonicalUrl="https://www.brandbanda.com/your-page"
/>
```

### 2. Private/Auth Pages
```jsx
<SiteMetaTags
  title="Private Page"
  description="Private page description"
  noIndex={true} // Prevent search engine indexing
/>
```

### 3. Dynamic Content Pages
```jsx
const BlogPost = ({ post }) => {
  return (
    <>
      <SiteMetaTags
        title={post.title}
        description={post.excerpt}
        keywords={post.tags.join(', ')}
        ogImage={post.featuredImage}
        canonicalUrl={`https://www.brandbanda.com/blog/${post.slug}`}
      />
      {/* Post content */}
    </>
  );
};
```

## Page-Specific Examples

### Settings Pages
```jsx
// Billing.jsx
<SiteMetaTags
  title="Billing & Subscription"
  description="Manage your subscription and billing"
  noIndex={true}
/>

// Account.jsx
<SiteMetaTags
  title="Account Settings"
  description="Manage your account settings"
  noIndex={true}
/>
```

### Marketing Pages
```jsx
// Terms.jsx
<SiteMetaTags
  title="Terms of Service"
  description="BrandBanda terms of service and user agreement"
  canonicalUrl="https://www.brandbanda.com/terms"
/>

// Privacy.jsx
<SiteMetaTags
  title="Privacy Policy"
  description="How we protect your data and privacy"
  canonicalUrl="https://www.brandbanda.com/privacy"
/>
```

### Product Pages
```jsx
// Projects.jsx
<SiteMetaTags
  title="Projects"
  description="Manage your brand projects"
  noIndex={true}
/>

// BrandMessages.jsx
<SiteMetaTags
  title="Brand Messages"
  description="Create AI-powered brand messages"
  noIndex={true}
/>
```

## Integration Checklist

- [x] Landing2.jsx - Added
- [ ] Login.jsx - Add with noIndex
- [ ] Register.jsx - Add with noIndex
- [ ] Dashboard.jsx - Add with noIndex
- [ ] Pricing.jsx - Add for SEO
- [ ] Terms.jsx - Add for SEO
- [ ] Privacy.jsx - Add for SEO
- [ ] Settings pages - Add with noIndex
- [ ] Project pages - Add with noIndex

## Notes

1. **Default Behavior**: If no props are provided, the component uses values from `siteMeta.js`

2. **Title Format**: Titles are automatically formatted as `"Your Title | BrandBanda"`

3. **Performance**: The component only updates meta tags when props change

4. **Cleanup**: When navigating away, the component cleans up dynamically added tags

5. **No External Dependencies**: Works without react-helmet or react-helmet-async

6. **React 19 Compatible**: Built with native JavaScript, no compatibility issues

## Troubleshooting

### Meta tags not updating?
- Check browser DevTools > Elements > `<head>` section
- Ensure component is rendered at the top of your page component
- Check for JavaScript errors in console

### SEO not working?
- Use Google's Rich Results Test tool
- Check Open Graph tags with Facebook's Sharing Debugger
- Verify canonical URLs are correct

### Title shows briefly then changes?
- This is normal - the default title loads first, then updates
- For critical pages, consider server-side rendering (SSR)