export const siteMeta = {
  // Site Identity
  siteName: {
    en: "BrandBanda",
    ar: "براند باندا"
  },

  // Currency Settings
  defaultCurrency: "USD",
  supportedCurrencies: ["USD"],

  // Contact Information
  supportEmail: "support@brandbanda.com",
  // mobile: "+1234567890",
  website: "https://www.brandbanda.com",

  // Social Media
  social: {
    facebook: "https://facebook.com/Brandbanda.offecial",
    instagram: "https://instagram.com/brandbanda_official"
    // twitter: "https://twitter.com/brandbanda",
    // linkedin: "https://linkedin.com/company/brandbanda",
    // youtube: "https://youtube.com/@brandbanda"
  },

  // SEO & Meta Tags
  seo: {
    title: "BrandBanda - AI-Powered Brand Psychology & Marketing Platform",
    description:
      "Transform your brand messaging with AI-driven psychological insights. Create compelling content that resonates with your audience using advanced brand psychology.",
    keywords:
      "brand psychology, AI marketing, brand messaging, content creation, marketing psychology, brand strategy, AI copywriting, brand identity, marketing automation",
    author: "BrandBanda Team",
    ogImage: "https://www.brandbanda.com/og-image.jpg",
    twitterCard: "summary_large_image",
    twitterSite: "@brandbanda"
  },

  // Favicons
  favicons: {
    favicon16: "/favicon-16x16.png",
    favicon32: "/favicon-32x32.png",
    faviconApple: "/apple-touch-icon.png",
    faviconIco: "/favicon.ico"
  },

  // Analytics & Tracking
  analytics: {
    GA_MEASUREMENT_ID: import.meta.env.VITE_GA_ID || "",
    FB_PIXEL_ID: import.meta.env.VITE_FB_PIXEL_ID || "",
    GTM_ID: import.meta.env.VITE_GTM_ID || "",
    HOTJAR_ID: import.meta.env.VITE_HOTJAR_ID || "",
    CLARITY_ID: import.meta.env.VITE_CLARITY_ID || ""
  },

  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3041/api",
    timeout: 30000,
    retryAttempts: 3
  },

  // Feature Flags
  features: {
    enableChat: true,
    enableVideoRecording: true,
    enableAIAssistant: true,
    enableSocialSharing: true,
    maintenanceMode: false
  },

  // Subscription & Credits
  credits: {
    tokenToCreditRatio: 1, // 1 token = 1 credit
    costPer1MCredits: 5, // $5 per 1M credits
    freeTrialCredits: 1000
  },

  // Support & Legal
  legal: {
    termsUrl: "/terms",
    privacyUrl: "/privacy",
    cookiePolicyUrl: "/cookies",
    refundPolicyUrl: "/refund-policy"
  },

  // Branding Colors (for dynamic theming)
  brandColors: {
    primary: "#7c3aed", // Violet
    secondary: "#6d28d9", // Purple
    accent: "#efcc7e", // Gold
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444"
  }
}

// Helper functions
export const getSiteMeta = () => siteMeta

export const getSEOMeta = (pageSpecific = {}) => ({
  ...siteMeta.seo,
  ...pageSpecific
})

export const getAnalyticsId = (platform) => siteMeta.analytics[platform] || null

export const isFeatureEnabled = (feature) => siteMeta.features[feature] || false

export const getSocialLink = (platform) => siteMeta.social[platform] || null
