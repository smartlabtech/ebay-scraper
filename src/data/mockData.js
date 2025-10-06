import { 
  USER_ROLES, 
  PROJECT_STATUS, 
  PROJECT_TYPES,
  MESSAGE_STATUS,
  MESSAGE_TYPES,
  COPY_PLATFORMS,
  COPY_FORMATS,
  TEST_STATUS,
  RECORDING_STATUS,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_STATUS
} from '../types';

// Mock Users
export const mockUsers = [
  {
    id: '1',
    email: 'demo@BrandBanda.com',
    password: 'demo123', // In real app, this would be hashed
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: USER_ROLES.PREMIUM,
    subscription: {
      plan: SUBSCRIPTION_PLANS.PROFESSIONAL,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      autoRenew: true
    },
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-06-26T10:00:00Z'
  }
];

// Mock Projects
export const mockProjects = [
  {
    id: '1',
    userId: '1',
    name: 'Tech Startup Launch',
    description: 'Complete brand identity for our new AI startup',
    type: PROJECT_TYPES.BRAND_IDENTITY,
    status: PROJECT_STATUS.ACTIVE,
    color: '#0ea5e9',
    progress: 65,
    dueDate: '2024-07-15',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-25T00:00:00Z',
    businessType: 'SaaS',
    location: 'San Francisco, CA',
    priceRange: '$100-$500',
    businessStage: 'growing',
    businessGoal: 'increase-awareness',
    stats: {
      messages: 8,
      copies: 24,
      recordings: 3
    }
  },
  {
    id: '2',
    userId: '1',
    name: 'Summer Marketing Campaign',
    description: 'Social media campaign for summer product launch',
    type: PROJECT_TYPES.MARKETING_CAMPAIGN,
    status: PROJECT_STATUS.ACTIVE,
    color: '#a855f7',
    progress: 40,
    dueDate: '2024-08-01',
    createdAt: '2024-06-10T00:00:00Z',
    updatedAt: '2024-06-24T00:00:00Z',
    businessType: 'E-commerce',
    location: 'New York, NY',
    priceRange: '$50-$100',
    businessStage: 'established',
    businessGoal: 'drive-sales',
    stats: {
      messages: 5,
      copies: 15,
      recordings: 1
    }
  },
  {
    id: '3',
    userId: '1',
    name: 'LinkedIn Content Strategy',
    description: 'Professional content for LinkedIn presence',
    type: PROJECT_TYPES.CONTENT_STRATEGY,
    status: PROJECT_STATUS.DRAFT,
    color: '#eab308',
    progress: 10,
    dueDate: '2024-09-01',
    createdAt: '2024-06-20T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z',
    businessType: 'Consulting',
    location: 'Austin, TX',
    priceRange: '$500+',
    businessStage: 'just-starting',
    businessGoal: 'build-credibility',
    stats: {
      messages: 2,
      copies: 5,
      recordings: 0
    }
  }
];

// Mock Brand Messages
export const mockBrandMessages = [
  {
    id: '1',
    projectId: '1',
    userId: '1',
    type: MESSAGE_TYPES.TAGLINE,
    title: 'Main Tagline',
    content: 'Empowering Tomorrow with AI Today',
    status: MESSAGE_STATUS.PUBLISHED,
    score: 92,
    createdAt: '2024-06-05T00:00:00Z',
    updatedAt: '2024-06-10T00:00:00Z',
    metrics: {
      clarity: 95,
      impact: 90,
      memorability: 91
    }
  },
  {
    id: '2',
    projectId: '1',
    userId: '1',
    type: MESSAGE_TYPES.VALUE_PROPOSITION,
    title: 'Core Value Prop',
    content: 'We transform complex AI into simple solutions that drive real business growth',
    status: MESSAGE_STATUS.TESTING,
    score: 88,
    createdAt: '2024-06-08T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z',
    metrics: {
      clarity: 87,
      impact: 89,
      memorability: 88
    }
  },
  {
    id: '3',
    projectId: '2',
    userId: '1',
    type: MESSAGE_TYPES.TAGLINE,
    title: 'Summer Campaign Tagline',
    content: 'Make Waves This Summer',
    status: MESSAGE_STATUS.DRAFT,
    score: 0,
    createdAt: '2024-06-12T00:00:00Z',
    updatedAt: '2024-06-12T00:00:00Z',
    metrics: {
      clarity: 0,
      impact: 0,
      memorability: 0
    }
  }
];

// Mock Copies
export const mockCopies = [
  {
    id: '1',
    projectId: '1',
    messageId: '1',
    userId: '1',
    platform: COPY_PLATFORMS.LINKEDIN,
    format: COPY_FORMATS.POST,
    title: 'Launch Announcement',
    content: `🚀 Exciting news! We're thrilled to announce the launch of our AI-powered platform.

Empowering Tomorrow with AI Today - that's not just our tagline, it's our promise to you.

Join us as we transform the way businesses leverage artificial intelligence.

#AI #Innovation #TechStartup #FutureOfWork`,
    hashtags: ['AI', 'Innovation', 'TechStartup', 'FutureOfWork'],
    characterCount: 245,
    status: 'published',
    createdAt: '2024-06-10T00:00:00Z',
    performance: {
      views: 1250,
      likes: 87,
      shares: 23,
      comments: 15
    }
  },
  {
    id: '2',
    projectId: '1',
    messageId: '1',
    userId: '1',
    platform: COPY_PLATFORMS.TWITTER,
    format: COPY_FORMATS.POST,
    title: 'Twitter Launch',
    content: '🤖 Empowering Tomorrow with AI Today\n\nWe\'re live! Experience the future of AI-driven solutions.\n\n#AI #Launch #Innovation',
    hashtags: ['AI', 'Launch', 'Innovation'],
    characterCount: 124,
    status: 'published',
    createdAt: '2024-06-10T00:00:00Z',
    performance: {
      views: 3420,
      likes: 156,
      retweets: 45,
      comments: 28
    }
  },
  {
    id: '3',
    projectId: '2',
    messageId: '3',
    userId: '1',
    platform: COPY_PLATFORMS.INSTAGRAM,
    format: COPY_FORMATS.CAPTION,
    title: 'Summer Product Launch',
    content: `☀️ Make Waves This Summer with our newest collection!

Dive into style with pieces designed to turn heads at every pool party, beach day, and sunset gathering.

Shop the collection now - link in bio! 🌊

#SummerStyle #MakeWaves #NewCollection #BeachLife #SummerVibes`,
    hashtags: ['SummerStyle', 'MakeWaves', 'NewCollection', 'BeachLife', 'SummerVibes'],
    characterCount: 267,
    status: 'draft',
    createdAt: '2024-06-15T00:00:00Z',
    performance: null
  }
];

// Mock Split Tests
export const mockSplitTests = [
  {
    id: '1',
    messageId: '1',
    projectId: '1',
    userId: '1',
    name: 'Tagline Variations Test',
    status: TEST_STATUS.COMPLETED,
    startDate: '2024-06-05',
    endDate: '2024-06-10',
    variants: [
      {
        id: 'a',
        content: 'Empowering Tomorrow with AI Today',
        metrics: {
          impressions: 5000,
          clicks: 450,
          conversions: 45,
          conversionRate: 0.9
        }
      },
      {
        id: 'b',
        content: 'AI Solutions for Tomorrow\'s Success',
        metrics: {
          impressions: 5000,
          clicks: 380,
          conversions: 32,
          conversionRate: 0.64
        }
      }
    ],
    winner: 'a',
    confidence: 95
  }
];

// Mock Recordings
export const mockRecordings = [
  {
    id: '1',
    projectId: '1',
    messageId: '2',
    userId: '1',
    title: 'Elevator Pitch Recording',
    duration: 45,
    status: RECORDING_STATUS.COMPLETED,
    url: '/recordings/elevator-pitch.mp4',
    thumbnail: '/recordings/elevator-pitch-thumb.jpg',
    transcript: 'We transform complex AI into simple solutions that drive real business growth...',
    createdAt: '2024-06-20T00:00:00Z'
  }
];

// Mock Analytics Data
export const mockAnalytics = {
  overview: {
    totalProjects: 12,
    activeProjects: 3,
    totalMessages: 48,
    totalCopies: 156,
    avgEngagementRate: 3.2,
    totalViews: 28500,
    growth: {
      projects: 12,
      messages: 8,
      copies: 23,
      engagement: 15
    }
  },
  recentActivity: [
    {
      id: '1',
      type: 'project_created',
      title: 'Created new project',
      description: 'LinkedIn Content Strategy',
      timestamp: '2024-06-26T14:30:00Z'
    },
    {
      id: '2',
      type: 'copy_generated',
      title: 'Generated new copy',
      description: 'Instagram caption for Summer Campaign',
      timestamp: '2024-06-26T13:15:00Z'
    },
    {
      id: '3',
      type: 'test_completed',
      title: 'Split test completed',
      description: 'Tagline Variations Test',
      timestamp: '2024-06-26T10:00:00Z'
    }
  ],
  performance: {
    daily: [
      { date: '2024-06-20', views: 1200, engagement: 3.1 },
      { date: '2024-06-21', views: 1450, engagement: 3.3 },
      { date: '2024-06-22', views: 1100, engagement: 2.9 },
      { date: '2024-06-23', views: 980, engagement: 3.0 },
      { date: '2024-06-24', views: 1650, engagement: 3.5 },
      { date: '2024-06-25', views: 1820, engagement: 3.8 },
      { date: '2024-06-26', views: 1500, engagement: 3.4 }
    ]
  }
};

// Mock Testimonials
export const mockTestimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechCorp',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: 'BrandTopia transformed our messaging strategy. The AI-powered suggestions are spot-on!',
    rating: 5
  },
  {
    id: '2',
    name: 'Mike Chen',
    role: 'Startup Founder',
    company: 'InnovateLab',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    content: 'The split testing feature helped us find our perfect tagline. ROI increased by 40%!',
    rating: 5
  },
  {
    id: '3',
    name: 'Emma Davis',
    role: 'Brand Manager',
    company: 'StyleHub',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    content: 'Creating consistent brand messages across platforms has never been easier.',
    rating: 5
  }
];

// Mock Notifications
export const mockNotifications = [
  {
    id: '1',
    userId: '1',
    type: 'success',
    title: 'Split test completed',
    message: 'Your tagline test has finished with significant results',
    read: false,
    createdAt: '2024-06-26T10:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    type: 'info',
    title: 'New feature available',
    message: 'Try our new AI-powered copy variations generator',
    read: false,
    createdAt: '2024-06-25T15:00:00Z'
  },
  {
    id: '3',
    userId: '1',
    type: 'warning',
    title: 'Subscription renewal',
    message: 'Your Professional plan will renew in 5 days',
    read: true,
    createdAt: '2024-06-24T09:00:00Z'
  }
];