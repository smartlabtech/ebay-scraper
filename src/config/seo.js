/**
 * SEO configuration for all pages
 * Contains metadata for each route in the application
 */

export const seoConfig = {
  // Public Pages
  "/": {
    title: "Brand Banda - AI-Powered Brand Psychology & Marketing Platform",
    description:
      "Transform your brand messaging with AI-driven psychological insights. Create compelling brand messages, generate platform-specific social media copy, and build stronger customer connections using advanced brand psychology.",
    keywords:
      "Brand Banda, AI branding platform, brand psychology, brand messaging, AI copywriting, social media content generator, marketing automation, brand strategy, customer psychology, content creation AI, brand identity, marketing psychology platform",
    ogImage: "https://brandbanda.com/og-home.png"
  },
  "/pricing": {
    title: "Pricing Plans - Brand Banda",
    description:
      "Choose the perfect Brand Banda plan for your brand management needs. Flexible pricing options for individuals, teams, and enterprises with AI-powered features.",
    keywords:
      "Brand Banda pricing, AI marketing platform pricing, brand management costs, subscription plans, marketing automation pricing, brand psychology tools pricing",
    ogImage: "https://brandbanda.com/og-pricing.png"
  },

  // Auth Pages
  "/auth/login": {
    title: "Login - Brand Banda",
    description:
      "Sign in to your Brand Banda account to access your brand projects, AI-powered content creation tools, and marketing analytics.",
    keywords: "Brand Banda login, sign in, account access, brand dashboard",
    noindex: true // Don't index login pages
  },
  "/auth/forgot-password": {
    title: "Reset Password - Brand Banda",
    description: "Reset your Brand Banda account password securely.",
    noindex: true
  },

  // Legal Pages
  "/terms": {
    title: "Terms of Service - Brand Banda",
    description:
      "Read Brand Banda's terms of service, user agreement, and conditions for using our AI-powered brand psychology and marketing platform.",
    keywords:
      "terms of service, user agreement, legal terms, Brand Banda terms, AI platform terms"
  },
  "/privacy": {
    title: "Privacy Policy - Brand Banda",
    description:
      "Learn how Brand Banda protects your privacy and handles your data. Our commitment to data security, GDPR compliance, and user privacy.",
    keywords:
      "privacy policy, data protection, GDPR, CCPA, user privacy, Brand Banda privacy, data security"
  },
  "/cookies": {
    title: "Cookie Policy - Brand Banda",
    description:
      "Understand how Brand Banda uses cookies and similar technologies to improve your experience and personalize content.",
    keywords:
      "cookie policy, cookies, tracking, Brand Banda cookies, website cookies"
  },
  "/legal": {
    title: "Legal Information - Brand Banda",
    description:
      "Access all legal documents, policies, compliance information, and regulatory details for Brand Banda.",
    keywords:
      "legal information, policies, compliance, Brand Banda legal, terms and conditions"
  },
  "/refund-policy": {
    title: "Refund Policy - Brand Banda",
    description:
      "Learn about Brand Banda's refund policy, cancellation terms, and money-back guarantee for our subscription plans.",
    keywords:
      "refund policy, cancellation, money back guarantee, Brand Banda refunds"
  },

  // Protected Pages (noindex)
  "/dashboard": {
    title: "Dashboard - Brand Banda",
    description:
      "Manage your brand projects, view analytics, and access AI-powered marketing tools in your Brand Banda dashboard.",
    noindex: true
  },
  "/projects": {
    title: "Brand Projects - Brand Banda",
    description:
      "View and manage all your brand projects with AI-powered insights and version control.",
    noindex: true
  },
  "/projects/create": {
    title: "Create New Project - Brand Banda",
    description:
      "Start a new brand project with AI-guided setup and psychological profiling.",
    noindex: true
  },
  "/brand-messages": {
    title: "Brand Messages - Brand Banda",
    description:
      "Create and manage AI-powered brand messages with psychological insights and A/B testing.",
    noindex: true
  },
  "/brand-messages/new": {
    title: "Create Brand Message - Brand Banda",
    description:
      "Generate new brand messages using AI and psychological frameworks.",
    noindex: true
  },
  "/copies": {
    title: "Content Copies - Brand Banda",
    description:
      "Generate and manage platform-specific content for social media, ads, and marketing campaigns.",
    noindex: true
  },
  "/copies/new": {
    title: "Generate Copy - Brand Banda",
    description:
      "Create AI-powered marketing copy optimized for different platforms and audiences.",
    noindex: true
  },
  "/products": {
    title: "Products Catalog - Brand Banda",
    description:
      "Manage your product catalog with AI-enhanced descriptions and psychological positioning.",
    noindex: true
  },
  "/products/new": {
    title: "Add Product - Brand Banda",
    description:
      "Add new products to your catalog with AI-generated descriptions.",
    noindex: true
  },
  "/analytics": {
    title: "Analytics Dashboard - Brand Banda",
    description:
      "View comprehensive performance analytics, engagement metrics, and AI-driven insights.",
    noindex: true
  },
  "/analytics/performance": {
    title: "Performance Analytics - Brand Banda",
    description:
      "Track content performance and conversion metrics with AI recommendations.",
    noindex: true
  },
  "/analytics/engagement": {
    title: "Engagement Analytics - Brand Banda",
    description:
      "Monitor audience engagement and psychological response patterns.",
    noindex: true
  },
  "/settings": {
    title: "Settings - Brand Banda",
    description: "Manage your account settings, preferences, and integrations.",
    noindex: true
  },
  "/settings/account": {
    title: "Account Settings - Brand Banda",
    description: "Update your profile, security settings, and account details.",
    noindex: true
  },
  "/settings/billing": {
    title: "Billing & Subscription - Brand Banda",
    description:
      "Manage your subscription, payment methods, and billing information.",
    noindex: true
  },
  "/settings/preferences": {
    title: "Preferences - Brand Banda",
    description:
      "Customize your Brand Banda experience and notification settings.",
    noindex: true
  },
  "/settings/team": {
    title: "Team Management - Brand Banda",
    description: "Manage team members, roles, and permissions.",
    noindex: true
  },

  // Payment Pages
  "/payment/success": {
    title: "Payment Successful - Brand Banda",
    description: "Your payment has been processed successfully.",
    noindex: true
  },
  "/payment/cancel": {
    title: "Payment Cancelled - Brand Banda",
    description: "Your payment has been cancelled.",
    noindex: true
  },
  "/payment/failure": {
    title: "Payment Failed - Brand Banda",
    description: "Your payment could not be processed.",
    noindex: true
  }
}

/**
 * Get SEO data for a specific route
 * @param {string} pathname - The current route pathname
 * @returns {Object} SEO configuration for the route
 */
export const getSEOData = (pathname) => {
  return (
    seoConfig[pathname] || {
      title: "Page",
      description: "Brand Banda - AI-Powered Brand Management Platform"
    }
  )
}

/**
 * Default SEO configuration
 */
export const defaultSEO = {
  title: "Brand Banda - AI-Powered Brand Psychology Platform",
  description:
    "Transform your brand with AI-driven psychological insights. Create compelling brand messages, generate platform-specific content, and build stronger customer connections.",
  keywords:
    "Brand Banda, AI marketing, brand psychology, content creation, brand messaging",
  image: "https://brandbanda.com/og-default.png",
  siteUrl: "https://brandbanda.com",
  twitterHandle: "@brandbanda",
  locale: "en_US",
  type: "website",
  siteName: "Brand Banda"
}
