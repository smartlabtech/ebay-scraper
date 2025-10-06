// User Types
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  PREMIUM: 'premium'
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

// Project Types
export const PROJECT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

export const PROJECT_TYPES = {
  BRAND_IDENTITY: 'brand_identity',
  MARKETING_CAMPAIGN: 'marketing_campaign',
  SOCIAL_MEDIA: 'social_media',
  CONTENT_STRATEGY: 'content_strategy'
};

// Brand Message Types
export const MESSAGE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  TESTING: 'testing',
  ARCHIVED: 'archived'
};

export const MESSAGE_TYPES = {
  TAGLINE: 'tagline',
  MISSION: 'mission',
  VISION: 'vision',
  VALUE_PROPOSITION: 'value_proposition',
  ELEVATOR_PITCH: 'elevator_pitch'
};

export const TONE_OPTIONS = {
  PROFESSIONAL: 'professional',
  CASUAL: 'casual',
  FRIENDLY: 'friendly',
  AUTHORITATIVE: 'authoritative',
  INSPIRATIONAL: 'inspirational',
  PLAYFUL: 'playful',
  URGENT: 'urgent',
  EMPATHETIC: 'empathetic'
};

// Copy Types
export const COPY_PLATFORMS = {
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  EMAIL: 'email',
  WEBSITE: 'website'
};

export const COPY_FORMATS = {
  POST: 'post',
  STORY: 'story',
  REEL: 'reel',
  CAPTION: 'caption',
  HEADLINE: 'headline',
  BODY: 'body',
  CTA: 'cta'
};

export const COPY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SCHEDULED: 'scheduled',
  ARCHIVED: 'archived'
};

// Split Test Types
export const TEST_STATUS = {
  DRAFT: 'draft',
  RUNNING: 'running',
  COMPLETED: 'completed',
  PAUSED: 'paused'
};

// Recording Types
export const RECORDING_STATUS = {
  DRAFT: 'draft',
  RECORDING: 'recording',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Subscription Types
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise'
};

// AI Token Credit System
export const TOKEN_COSTS = {
  BRAND_MESSAGE: 50,      // Cost per brand message generation
  COPY_GENERATION: 30,    // Cost per copy generation
  SPLIT_TEST: 100,        // Cost per split test
  VIDEO_SCRIPT: 80        // Cost per teleprompter script
};

export const SUBSCRIPTION_PLAN_DETAILS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    interval: 'month',
    credits: 500,           // Monthly AI token credits
    features: [
      '500 AI Token Credits/month',
      '~10 Brand Messages',
      '~16 Copy Generations',
      'Basic support',
      'No credit rollover'
    ],
    limits: {
      creditsPerMonth: 500,
      creditRollover: false,
      maxProjects: 3
    }
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    yearlyPrice: 182,
    interval: 'month',
    credits: 5000,          // Monthly AI token credits
    features: [
      '5,000 AI Token Credits/month',
      '~100 Brand Messages',
      '~166 Copy Generations',
      'Priority email support',
      'Split testing',
      'Credit rollover (if paid on time)'
    ],
    limits: {
      creditsPerMonth: 5000,
      creditRollover: true,
      maxProjects: 10
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 49,
    yearlyPrice: 470,
    interval: 'month',
    credits: 20000,         // Monthly AI token credits
    features: [
      '20,000 AI Token Credits/month',
      '~400 Brand Messages',
      '~666 Copy Generations',
      'Priority support',
      'Advanced split testing',
      'Team collaboration',
      'API access',
      'Credit rollover (if paid on time)'
    ],
    limits: {
      creditsPerMonth: 20000,
      creditRollover: true,
      maxProjects: -1
    },
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 149,
    yearlyPrice: 1430,
    interval: 'month',
    credits: 100000,        // Monthly AI token credits
    features: [
      '100,000 AI Token Credits/month',
      'Unlimited projects',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Advanced security features',
      'Custom training',
      'Credit rollover (if paid on time)'
    ],
    limits: {
      creditsPerMonth: 100000,
      creditRollover: true,
      maxProjects: -1
    }
  }
];

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  TRIAL: 'trial'
};

// Payment Types
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

// API Response Types
export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Must be no more than ${max} characters`,
  PASSWORD_MATCH: 'Passwords do not match',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_PHONE: 'Please enter a valid phone number'
};

// Credit System Configuration
export const CREDIT_CONFIG = {
  ROLLOVER_ENABLED: true,              // Allow credit rollover
  ROLLOVER_MAX_MONTHS: 3,              // Maximum months to accumulate credits
  LOW_CREDIT_THRESHOLD: 100,           // Warning threshold
  PAYMENT_GRACE_PERIOD_DAYS: 3        // Days after due date to still get rollover
};

// Feature Limits by Plan
export const PLAN_LIMITS = {
  [SUBSCRIPTION_PLANS.FREE]: {
    credits: 500,
    maxProjects: 3,
    teamMembers: 1,
    creditRollover: false
  },
  [SUBSCRIPTION_PLANS.STARTER]: {
    credits: 5000,
    maxProjects: 10,
    teamMembers: 3,
    creditRollover: true
  },
  [SUBSCRIPTION_PLANS.PROFESSIONAL]: {
    credits: 20000,
    maxProjects: Infinity,
    teamMembers: 10,
    creditRollover: true
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    credits: 100000,
    maxProjects: Infinity,
    teamMembers: Infinity,
    creditRollover: true
  }
};

// Pricing
export const PRICING = {
  [SUBSCRIPTION_PLANS.FREE]: {
    monthly: 0,
    yearly: 0,
    name: 'Free',
    description: 'Perfect for trying out our AI-powered platform',
    credits: 500
  },
  [SUBSCRIPTION_PLANS.STARTER]: {
    monthly: 19,
    yearly: 182,
    name: 'Starter',
    description: 'Great for small businesses with moderate AI usage',
    credits: 5000
  },
  [SUBSCRIPTION_PLANS.PROFESSIONAL]: {
    monthly: 49,
    yearly: 470,
    name: 'Professional',
    description: 'Ideal for growing brands and agencies',
    credits: 20000
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    monthly: 149,
    yearly: 1430,
    name: 'Enterprise',
    description: 'For large teams with high-volume AI needs',
    credits: 100000
  }
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  WITH_TIME: 'MMM d, yyyy h:mm a',
  TIME_ONLY: 'h:mm a',
  RELATIVE: 'relative' // for "2 hours ago" style
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'brandbanda_auth_token',
  USER_DATA: 'brandbanda_user_data',
  THEME: 'brandbanda_theme',
  ONBOARDING_COMPLETED: 'brandbanda_onboarding_completed'
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar'
  },
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    GET: (id) => `/projects/${id}`,
    UPDATE: (id) => `/projects/${id}`,
    DELETE: (id) => `/projects/${id}`
  },
  MESSAGES: {
    LIST: '/brand-messages',
    CREATE: '/brand-messages',
    GET: (id) => `/brand-messages/${id}`,
    UPDATE: (id) => `/brand-messages/${id}`,
    DELETE: (id) => `/brand-messages/${id}`,
    TEST: (id) => `/brand-messages/${id}/test`
  },
  COPIES: {
    LIST: '/copies',
    CREATE: '/copies',
    GENERATE: '/copies/generate',
    GET: (id) => `/copies/${id}`,
    UPDATE: (id) => `/copies/${id}`,
    DELETE: (id) => `/copies/${id}`
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    PROJECTS: '/analytics/projects',
    MESSAGES: '/analytics/brand-messages',
    COPIES: '/analytics/copies'
  },
  PAYMENTS: {
    CREATE_CHECKOUT: '/payments/create-checkout',
    CREATE_SUBSCRIPTION: '/payments/create-subscription',
    CANCEL_SUBSCRIPTION: '/payments/cancel-subscription',
    UPDATE_PAYMENT_METHOD: '/payments/update-payment-method',
    INVOICES: '/payments/invoices'
  }
};