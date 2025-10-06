import api from './api';
import { TOKEN_COSTS } from '../types';

// Copy Generation API Service
const copyService = {
  // Generate new copy
  generate: async (data) => {
    try {
      const response = await api.post('/project-copy/generate', data);
      return response.data;
    } catch (error) {
      console.error('Error generating copy:', error);
      throw error;
    }
  },

  // Get all copies with filters
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(`${key}[]`, item));
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/project-copy?${queryString}` : '/project-copy';
      console.log('Fetching copies from:', url);
      const response = await api.get(url);
      console.log('Copies response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching copies:', error);
      // Return empty array if API fails to prevent app crash
      if (error.response?.status === 404) {
        console.log('Copies endpoint not found, returning empty array');
        return [];
      }
      throw error;
    }
  },

  // Get copy by ID
  getById: async (id, options = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (options.includeProject) queryParams.append('includeProject', 'true');
      if (options.includeBrandMessage) queryParams.append('includeBrandMessage', 'true');
      if (options.includePerformance) queryParams.append('includePerformance', 'true');

      const queryString = queryParams.toString();
      const url = queryString ? `/project-copy/${id}?${queryString}` : `/project-copy/${id}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching copy:', error);
      throw error;
    }
  },

  // Delete copy (soft delete)
  delete: async (id) => {
    try {
      const response = await api.delete(`/project-copy/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting copy:', error);
      throw error;
    }
  },

  // Delete a specific variation from a copy
  deleteVariation: async (variationId) => {
    try {
      const response = await api.delete(`/generated-copies/${variationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting variation:', error);
      throw error;
    }
  },

  // Get copy statistics
  getStatistics: async () => {
    try {
      const response = await api.get('/project-copy/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching copy statistics:', error);
      throw error;
    }
  },

  // Calculate token cost for copy generation
  calculateTokenCost: (numberOfPosts = 1) => {
    const baseTokens = 500;
    const perPostTokens = 750;
    const totalTokens = baseTokens + (numberOfPosts * perPostTokens);
    return Math.ceil(totalTokens / 1000); // Return credits (1 credit = 1000 tokens)
  }
};

// Export constants for UI usage
export const PLATFORMS = {
  // Facebook Formats
  FACEBOOK_POST: 'FACEBOOK_POST',
  FACEBOOK_STORY: 'FACEBOOK_STORY',
  FACEBOOK_REEL: 'FACEBOOK_REEL',
  FACEBOOK_VIDEO: 'FACEBOOK_VIDEO',
  FACEBOOK_LIVE: 'FACEBOOK_LIVE',
  
  // Instagram Formats
  INSTAGRAM_POST: 'INSTAGRAM_POST',
  INSTAGRAM_STORY: 'INSTAGRAM_STORY',
  INSTAGRAM_REEL: 'INSTAGRAM_REEL',
  INSTAGRAM_CAROUSEL: 'INSTAGRAM_CAROUSEL',
  INSTAGRAM_LIVE: 'INSTAGRAM_LIVE',
  INSTAGRAM_THREADS: 'INSTAGRAM_THREADS',
  
  // LinkedIn Formats
  LINKEDIN_POST: 'LINKEDIN_POST',
  LINKEDIN_ARTICLE: 'LINKEDIN_ARTICLE',
  LINKEDIN_VIDEO: 'LINKEDIN_VIDEO',
  LINKEDIN_NEWSLETTER: 'LINKEDIN_NEWSLETTER',
  LINKEDIN_EVENT: 'LINKEDIN_EVENT',
  
  // X (Twitter) Formats
  X_TWEET: 'X_TWEET',
  X_THREAD: 'X_THREAD',
  X_SPACE: 'X_SPACE',
  
  // TikTok Formats
  TIKTOK_VIDEO: 'TIKTOK_VIDEO',
  TIKTOK_LIVE: 'TIKTOK_LIVE',
  TIKTOK_STORY: 'TIKTOK_STORY',
  
  // YouTube Formats
  YOUTUBE_SHORT: 'YOUTUBE_SHORT',
  YOUTUBE_VIDEO: 'YOUTUBE_VIDEO',
  YOUTUBE_COMMUNITY: 'YOUTUBE_COMMUNITY',
  YOUTUBE_LIVE: 'YOUTUBE_LIVE',
  
  // WhatsApp Formats
  WHATSAPP_STATUS: 'WHATSAPP_STATUS',
  WHATSAPP_BROADCAST: 'WHATSAPP_BROADCAST',
  WHATSAPP_BUSINESS: 'WHATSAPP_BUSINESS',
  
  // Pinterest Formats
  PINTEREST_PIN: 'PINTEREST_PIN',
  PINTEREST_STORY: 'PINTEREST_STORY',
  PINTEREST_IDEA: 'PINTEREST_IDEA',
  
  // Snapchat Formats
  SNAPCHAT_STORY: 'SNAPCHAT_STORY',
  SNAPCHAT_SPOTLIGHT: 'SNAPCHAT_SPOTLIGHT',
  
  // Email Formats
  EMAIL_NEWSLETTER: 'EMAIL_NEWSLETTER',
  EMAIL_PROMOTIONAL: 'EMAIL_PROMOTIONAL',
  EMAIL_TRANSACTIONAL: 'EMAIL_TRANSACTIONAL',
  
  // Blog/Website
  BLOG_POST: 'BLOG_POST',
  BLOG_GUEST: 'BLOG_GUEST',
  
  // Other Platforms
  REDDIT_POST: 'REDDIT_POST',
  DISCORD_MESSAGE: 'DISCORD_MESSAGE',
  TELEGRAM_POST: 'TELEGRAM_POST'
};

// Group platforms for easier UI organization
export const PLATFORM_GROUPS = {
  'Facebook': [
    { value: 'FACEBOOK_POST', label: 'Post' },
    { value: 'FACEBOOK_STORY', label: 'Story' },
    { value: 'FACEBOOK_REEL', label: 'Reel' },
    { value: 'FACEBOOK_VIDEO', label: 'Video' },
    { value: 'FACEBOOK_LIVE', label: 'Live' }
  ],
  'Instagram': [
    { value: 'INSTAGRAM_POST', label: 'Post' },
    { value: 'INSTAGRAM_STORY', label: 'Story' },
    { value: 'INSTAGRAM_REEL', label: 'Reel' },
    { value: 'INSTAGRAM_CAROUSEL', label: 'Carousel' },
    { value: 'INSTAGRAM_LIVE', label: 'Live' },
    { value: 'INSTAGRAM_THREADS', label: 'Threads' }
  ],
  'TikTok': [
    { value: 'TIKTOK_VIDEO', label: 'Video' },
    { value: 'TIKTOK_LIVE', label: 'Live' },
    { value: 'TIKTOK_STORY', label: 'Story' }
  ],
  'WhatsApp': [
    { value: 'WHATSAPP_STATUS', label: 'Status' },
    { value: 'WHATSAPP_BROADCAST', label: 'Broadcast' },
    { value: 'WHATSAPP_BUSINESS', label: 'Business Message' }
  ],
  'X (Twitter)': [
    { value: 'X_TWEET', label: 'Tweet' },
    { value: 'X_THREAD', label: 'Thread' },
    { value: 'X_SPACE', label: 'Space' }
  ],
  'YouTube': [
    { value: 'YOUTUBE_SHORT', label: 'Short' },
    { value: 'YOUTUBE_VIDEO', label: 'Video' },
    { value: 'YOUTUBE_COMMUNITY', label: 'Community Post' },
    { value: 'YOUTUBE_LIVE', label: 'Live' }
  ],
  'Pinterest': [
    { value: 'PINTEREST_PIN', label: 'Pin' },
    { value: 'PINTEREST_STORY', label: 'Story' },
    { value: 'PINTEREST_IDEA', label: 'Idea Pin' }
  ],
  'LinkedIn': [
    { value: 'LINKEDIN_POST', label: 'Post' },
    { value: 'LINKEDIN_ARTICLE', label: 'Article' },
    { value: 'LINKEDIN_VIDEO', label: 'Video' },
    { value: 'LINKEDIN_NEWSLETTER', label: 'Newsletter' },
    { value: 'LINKEDIN_EVENT', label: 'Event' }
  ],
  'Snapchat': [
    { value: 'SNAPCHAT_STORY', label: 'Story' },
    { value: 'SNAPCHAT_SPOTLIGHT', label: 'Spotlight' }
  ],
  'Email': [
    { value: 'EMAIL_NEWSLETTER', label: 'Newsletter' },
    { value: 'EMAIL_PROMOTIONAL', label: 'Promotional' },
    { value: 'EMAIL_TRANSACTIONAL', label: 'Transactional' }
  ],
  'Blog': [
    { value: 'BLOG_POST', label: 'Blog Post' },
    { value: 'BLOG_GUEST', label: 'Guest Post' }
  ],
  'Other': [
    { value: 'REDDIT_POST', label: 'Reddit Post' },
    { value: 'DISCORD_MESSAGE', label: 'Discord Message' },
    { value: 'TELEGRAM_POST', label: 'Telegram Post' }
  ]
};

export const COPY_TYPES = {
  AWARENESS: 'AWARENESS',
  EDUCATION: 'EDUCATION',
  ENGAGEMENT: 'ENGAGEMENT',
  CONSIDERATION: 'CONSIDERATION',
  CONVERSION: 'CONVERSION',
  RETENTION: 'RETENTION'
};

export const CTA_TYPES = {
  BUY_NOW: 'BUY_NOW',
  LEARN_MORE: 'LEARN_MORE',
  SIGN_UP: 'SIGN_UP',
  SHARE: 'SHARE',
  COMMENT: 'COMMENT',
  DOWNLOAD: 'DOWNLOAD',
  CONTACT_US: 'CONTACT_US',
  GET_STARTED: 'GET_STARTED',
  BOOK_DEMO: 'BOOK_DEMO',
  SUBSCRIBE: 'SUBSCRIBE'
};

// Alias for backward compatibility
export const CALL_TO_ACTION_TYPES = CTA_TYPES;

export const LANGUAGES = {
  // European
  ENGLISH: 'ENGLISH',
  SPANISH: 'SPANISH',
  FRENCH: 'FRENCH',
  GERMAN: 'GERMAN',
  ITALIAN: 'ITALIAN',
  PORTUGUESE: 'PORTUGUESE',
  DUTCH: 'DUTCH',
  POLISH: 'POLISH',
  RUSSIAN: 'RUSSIAN',
  // Asian
  CHINESE: 'CHINESE',
  JAPANESE: 'JAPANESE',
  KOREAN: 'KOREAN',
  HINDI: 'HINDI',
  BENGALI: 'BENGALI',
  VIETNAMESE: 'VIETNAMESE',
  THAI: 'THAI',
  INDONESIAN: 'INDONESIAN',
  MALAY: 'MALAY',
  FILIPINO: 'FILIPINO',
  // Middle Eastern
  ARABIC: 'ARABIC',
  HEBREW: 'HEBREW',
  TURKISH: 'TURKISH',
  // Nordic
  SWEDISH: 'SWEDISH',
  NORWEGIAN: 'NORWEGIAN',
  DANISH: 'DANISH',
  FINNISH: 'FINNISH',
  ICELANDIC: 'ICELANDIC',
  FAROESE: 'FAROESE',
  GREENLANDIC: 'GREENLANDIC',
  SAMI: 'SAMI',
  // Eastern European
  CZECH: 'CZECH',
  SLOVAK: 'SLOVAK',
  ROMANIAN: 'ROMANIAN',
  HUNGARIAN: 'HUNGARIAN',
  BULGARIAN: 'BULGARIAN',
  CROATIAN: 'CROATIAN',
  SERBIAN: 'SERBIAN',
  UKRAINIAN: 'UKRAINIAN',
  LITHUANIAN: 'LITHUANIAN',
  LATVIAN: 'LATVIAN',
  ESTONIAN: 'ESTONIAN',
  SLOVENIAN: 'SLOVENIAN',
  ALBANIAN: 'ALBANIAN',
  MACEDONIAN: 'MACEDONIAN',
  BOSNIAN: 'BOSNIAN',
  MONTENEGRIN: 'MONTENEGRIN',
  BELARUSIAN: 'BELARUSIAN',
  MOLDOVAN: 'MOLDOVAN',
  // Other
  GREEK: 'GREEK',
  IRISH: 'IRISH',
  WELSH: 'WELSH',
  BASQUE: 'BASQUE',
  CATALAN: 'CATALAN',
  MALTESE: 'MALTESE',
  LUXEMBOURGISH: 'LUXEMBOURGISH',
  GALICIAN: 'GALICIAN',
  SCOTS_GAELIC: 'SCOTS_GAELIC',
  BRETON: 'BRETON',
  CORSICAN: 'CORSICAN',
  ESPERANTO: 'ESPERANTO',
  LATIN: 'LATIN'
};

export const COPY_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  DELETED: 'DELETED'
};

// Helper function to format platform name for display
export const formatPlatformName = (platform) => {
  if (!platform) return '';
  
  // Find the platform in groups to get proper formatting
  for (const [group, items] of Object.entries(PLATFORM_GROUPS)) {
    const found = items.find(item => item.value === platform);
    if (found) {
      return `${group} ${found.label}`;
    }
  }
  
  // Fallback to basic formatting
  return platform.replace(/_/g, ' ').toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper to get platform group from platform value
export const getPlatformGroup = (platform) => {
  for (const [group, items] of Object.entries(PLATFORM_GROUPS)) {
    if (items.some(item => item.value === platform)) {
      return group;
    }
  }
  return null;
};

// Helper to get platform icon based on group
export const getPlatformIcon = (platform) => {
  const group = getPlatformGroup(platform);
  const iconMap = {
    'Facebook': '📘',
    'Instagram': '📷',
    'LinkedIn': '💼',
    'X (Twitter)': '𝕏',
    'TikTok': '🎵',
    'YouTube': '📺',
    'WhatsApp': '💬',
    'Pinterest': '📌',
    'Snapchat': '👻',
    'Email': '✉️',
    'Blog': '📝',
    'Other': '🌐'
  };
  return iconMap[group] || '📱';
};

// CTA Compatibility by Copy Type
export const getCTACompatibility = (copyType) => {
  const compatibility = {
    AWARENESS: [
      'LEARN_MORE',
      'DOWNLOAD',
      'SUBSCRIBE',
      'SHARE'
    ],
    EDUCATION: [
      'LEARN_MORE',
      'DOWNLOAD',
      'SUBSCRIBE',
      'SHARE'
    ],
    ENGAGEMENT: [
      'COMMENT',
      'SHARE',
      'SUBSCRIBE',
      'CONTACT_US'
    ],
    
    SALES: [
      'BUY_NOW',
      'GET_STARTED',
      'BOOK_DEMO',
      'SIGN_UP'
    ],
    RETENTION: [
      'BUY_NOW',
      'GET_STARTED',
      'CONTACT_US',
      'SHARE'
    ]
  };
  
  return compatibility[copyType] || Object.keys(CTA_TYPES);
};

// Get CTA Instructions and Psychology
export const getCTAInstructions = (ctaType) => {
  const instructions = {
    BUY_NOW: {
      urgency: 'HIGH',
      approach: 'Direct and commanding',
      examples: ['Shop Now', 'Buy Today', 'Get Yours', 'Order Now', 'Purchase'],
      psychology: 'Create immediate action through scarcity and urgency',
      avoid: 'Being too soft or indirect',
      color: 'red',
      icon: '🛒'
    },
    LEARN_MORE: {
      urgency: 'LOW',
      approach: 'Educational and curious',
      examples: ['Learn More', 'Discover How', 'Find Out Why', 'Read More', 'Explore'],
      psychology: 'Appeal to curiosity and desire for knowledge',
      avoid: 'Being pushy or sales-focused',
      color: 'blue',
      icon: '📚'
    },
    SIGN_UP: {
      urgency: 'MEDIUM',
      approach: 'Value-focused enrollment',
      examples: ['Sign Up Free', 'Join Now', 'Register Today', 'Start Free Trial', 'Create Account'],
      psychology: 'Emphasize benefits of joining and ease of process',
      avoid: 'Complex registration implications',
      color: 'green',
      icon: '✍️'
    },
    SHARE: {
      urgency: 'LOW',
      approach: 'Community and viral',
      examples: ['Share This', 'Spread the Word', 'Tell Friends', 'Pass It On', 'Share if You Agree'],
      psychology: 'Leverage social proof and tribal belonging',
      avoid: 'Begging or desperate requests',
      color: 'violet',
      icon: '🔄'
    },
    COMMENT: {
      urgency: 'LOW',
      approach: 'Conversational and engaging',
      examples: ['Comment Below', 'What Do You Think?', 'Share Your Thoughts', 'Let Us Know', 'Drop a Comment'],
      psychology: 'Make them feel their opinion matters',
      avoid: 'Closed-ended prompts',
      color: 'cyan',
      icon: '💬'
    },
    DOWNLOAD: {
      urgency: 'MEDIUM',
      approach: 'Value delivery focus',
      examples: ['Download Free', 'Get Your Copy', 'Download Now', 'Save PDF', 'Get Template'],
      psychology: 'Emphasize immediate value and no cost',
      avoid: 'Hidden requirements or costs',
      color: 'teal',
      icon: '⬇️'
    },
    CONTACT_US: {
      urgency: 'LOW',
      approach: 'Personal and helpful',
      examples: ['Contact Us', 'Get in Touch', 'Reach Out', 'Talk to Us', 'Message Us'],
      psychology: 'Show accessibility and willingness to help',
      avoid: 'Cold or corporate tone',
      color: 'indigo',
      icon: '📞'
    },
    GET_STARTED: {
      urgency: 'MEDIUM',
      approach: 'Journey beginning',
      examples: ['Get Started', 'Begin Now', 'Start Today', 'Launch Your Journey', 'Take First Step'],
      psychology: 'Focus on ease and excitement of starting',
      avoid: 'Overwhelming with complexity',
      color: 'orange',
      icon: '🚀'
    },
    BOOK_DEMO: {
      urgency: 'MEDIUM',
      approach: 'Consultative selling',
      examples: ['Book Demo', 'Schedule Call', 'See It Live', 'Request Demo', 'Watch Demo'],
      psychology: 'Promise personalized experience and expertise',
      avoid: 'High-pressure sales tactics',
      color: 'grape',
      icon: '📅'
    },
    SUBSCRIBE: {
      urgency: 'LOW',
      approach: 'Long-term value',
      examples: ['Subscribe', 'Follow Us', 'Join Newsletter', 'Stay Updated', 'Get Updates'],
      psychology: 'FOMO on future content and exclusivity',
      avoid: 'Spam implications',
      color: 'pink',
      icon: '🔔'
    }
  };
  
  return instructions[ctaType] || null;
};

// Get Platform-specific CTA Format Guidelines
export const getPlatformCTAFormat = (platform, ctaType) => {
  const formats = {
    // Instagram formats
    INSTAGRAM_POST: {
      format: 'Caption CTA + Link in bio strategy',
      example: `Ready to transform? Click the link in our bio to ${ctaType === 'BUY_NOW' ? 'shop now' : 'learn more'} 🔗`,
      tips: ['Place CTA before "more" fold', 'Use emoji arrows', 'Mention link in bio clearly']
    },
    INSTAGRAM_STORY: {
      format: 'Interactive stickers (link, poll, question)',
      example: 'Swipe up to learn more! ⬆️',
      tips: ['Keep under 5 words', 'Tap-friendly placement', 'Upper third positioning']
    },
    INSTAGRAM_REEL: {
      format: '3-part CTA strategy',
      example: 'Hook CTA → Mid reminder → Caption CTA',
      tips: ['Hook in first 3 seconds', 'Mid-video reminder', 'Strong caption CTA with emoji']
    },
    INSTAGRAM_CAROUSEL: {
      format: 'Progressive CTA through slides',
      example: 'Soft intro → Build urgency → Strong final CTA',
      tips: ['Soft on slide 1', 'Build through slides', 'Strongest on final slide']
    },
    
    // Facebook formats
    FACEBOOK_POST: {
      format: 'Native button CTA with early text hook',
      example: `${ctaType === 'BUY_NOW' ? '🛍️ Limited time offer!' : '📖 Discover the secret...'} [Read more]`,
      tips: ['CTA in first 125 chars', 'Use native buttons', 'Emoji pointers 👉']
    },
    FACEBOOK_STORY: {
      format: 'Full-screen tap zones with stickers',
      example: 'Tap to shop now! 🛒',
      tips: ['Swipe-up links', 'Sticker CTAs', '15-second window']
    },
    
    // LinkedIn formats
    LINKEDIN_POST: {
      format: 'Professional CTA with direct link',
      example: 'Learn how industry leaders are transforming... Read the full report:',
      tips: ['Professional tone', 'First 3 lines visible', 'Direct link inclusion']
    },
    LINKEDIN_ARTICLE: {
      format: 'Multiple strategic CTA placements',
      example: 'Download our comprehensive guide below',
      tips: ['After intro CTA', 'Mid-article CTA', 'Conclusion CTA']
    },
    
    // X (Twitter) formats
    X_TWEET: {
      format: 'Ultra-concise with link',
      example: '🔥 Game-changer alert → [link]',
      tips: ['Under 20 chars CTA', 'Shortened links', 'Thread teasers']
    },
    X_THREAD: {
      format: 'Build momentum through thread',
      example: 'Thread: 1/ Hook... 5/ Strong CTA with recap',
      tips: ['Build CTA momentum', 'Final tweet strongest', 'Recap value']
    },
    
    // TikTok formats
    TIKTOK_VIDEO: {
      format: 'Triple CTA approach',
      example: 'Verbal + Text overlay + Caption "Link in bio 🔗"',
      tips: ['Verbal in video', 'Text overlay', 'Caption with link']
    },
    
    // YouTube formats
    YOUTUBE_VIDEO: {
      format: '5-point CTA strategy',
      example: 'Verbal + Description + Cards + End screen + Pinned',
      tips: ['Multiple touchpoints', 'End screen CTA', 'Pinned comment']
    },
    YOUTUBE_SHORT: {
      format: 'Quick end screen CTA',
      example: 'Subscribe for more! 👆',
      tips: ['Last 5 seconds', 'Pinned comment', 'Visual cue']
    },
    
    // Email formats
    EMAIL_NEWSLETTER: {
      format: 'Above-fold button with multiple links',
      example: '[CTA BUTTON] + text links throughout',
      tips: ['Above-fold button', '3-click rule', 'Multiple formats']
    },
    EMAIL_PROMOTIONAL: {
      format: 'Urgency-driven prominent buttons',
      example: '⏰ 24 HOURS ONLY [SHOP NOW]',
      tips: ['Contrasting colors', 'Mobile-optimized', 'Urgency elements']
    },
    
    // Default
    DEFAULT: {
      format: 'Clear, action-oriented CTA',
      example: 'Take action now!',
      tips: ['Be specific', 'Create urgency', 'Make it stand out']
    }
  };
  
  return formats[platform] || formats.DEFAULT;
};

// Get CopyType Details and Guidance
export const getCopyTypeDetails = (copyType) => {
  const details = {
    AWARENESS: {
      title: 'Awareness',
      purpose: 'Make audience aware of problems or solutions they didn\'t know existed',
      funnelStage: 'Top of Funnel',
      psychologicalDriver: 'Curiosity & Discovery',
      approach: 'Educational without selling',
      icon: '💡',
      color: 'blue',
      structure: [
        'Hook with surprising fact or question',
        'Problem revelation - "Did you know..."',
        'Explore consequences of ignoring',
        'Introduce hope - there\'s a better way',
        'Soft CTA - Learn more, not buy'
      ],
      bestPlatforms: ['Blog Posts', 'LinkedIn Articles', 'YouTube Videos', 'Instagram Carousels'],
      metrics: ['Engagement rate', 'Content consumption time', 'Brand awareness lift', 'Search volume'],
      examples: [
        '90% of Small Businesses Make This SEO Mistake',
        'The Hidden Cost of Poor Sleep Quality',
        'Why Traditional Marketing Doesn\'t Work Anymore'
      ],
      avoid: [
        'Being too salesy too soon',
        'Not providing enough value',
        'Weak problem identification'
      ],
      psychology: 'Unconscious Incompetence → Conscious Incompetence → Problem Recognition → Solution Awareness'
    },
    SALES: {
      title: 'Sales',
      purpose: 'Convert interested prospects into paying customers through persuasion and urgency',
      funnelStage: 'Bottom of Funnel',
      psychologicalDriver: 'Urgency & Desire',
      approach: 'Direct conversion focus',
      icon: '🛒',
      color: 'red',
      structure: [
        'Hook with benefit or offer',
        'Clear value proposition',
        'Social proof (reviews, testimonials)',
        'Offer details with urgency',
        'Risk reversal guarantee',
        'Strong CTA - Buy now'
      ],
      bestPlatforms: ['Facebook/Instagram Ads', 'Email Campaigns', 'Landing Pages', 'Instagram Stories'],
      metrics: ['Conversion rate', 'Average order value', 'ROAS', 'Cart abandonment rate'],
      examples: [
        'Flash Sale: 50% Off Everything - 24 Hours Only!',
        'Last Chance: Only 5 Items Left in Stock',
        'Limited Edition Release - Once It\'s Gone, It\'s Gone'
      ],
      avoid: [
        'No urgency creation',
        'Weak value proposition',
        'Missing social proof',
        'Complex purchase process'
      ],
      psychology: 'Desire → Justification → Urgency → Risk Mitigation → Action'
    },
    ENGAGEMENT: {
      title: 'Engagement',
      purpose: 'Maximize interactions, build community, and create viral content',
      funnelStage: 'Middle of Funnel',
      psychologicalDriver: 'Belonging & Expression',
      approach: 'Conversation and community focus',
      icon: '💬',
      color: 'violet',
      structure: [
        'Hook with question or statement',
        'Frame the discussion context',
        'Specific participation prompt',
        'Explain why input matters',
        'Community CTA - Comment, share'
      ],
      bestPlatforms: ['Instagram Posts/Reels', 'TikTok Videos', 'Facebook Groups', 'Twitter/X Threads'],
      metrics: ['Engagement rate', 'Viral coefficient', 'Comments per post', 'User-generated content'],
      examples: [
        'Unpopular Opinion: Coffee Is Better Cold ☕ Change My Mind',
        'Tag Someone Who Needs to See This Today',
        'Quick Poll: Team iPhone 📱 or Team Android 🤖?'
      ],
      avoid: [
        'Asking for too much',
        'Not responding to comments',
        'Generic questions',
        'No community building'
      ],
      psychology: 'Attention → Interest → Participation → Community → Advocacy'
    },
    EDUCATION: {
      title: 'Education',
      purpose: 'Establish authority and build trust through valuable knowledge',
      funnelStage: 'Top-Middle Funnel',
      psychologicalDriver: 'Learning & Growth',
      approach: 'Value-first expert positioning',
      icon: '📚',
      color: 'green',
      structure: [
        'Promise of learning outcome',
        'Credibility statement',
        'Structured content (steps/tips)',
        'Real practical examples',
        'Key takeaways summary',
        'Implementation CTA'
      ],
      bestPlatforms: ['YouTube Long-form', 'Blog Posts', 'LinkedIn Articles', 'Email Newsletters'],
      metrics: ['Content saves', 'Time on page', 'Resource downloads', 'Return visitor rate'],
      examples: [
        '5 Proven Ways to Double Your Email Open Rates',
        'The Complete Guide to Starting a Podcast in 2025',
        'Master Excel: 10 Formulas That Will Save You Hours'
      ],
      avoid: [
        'Too complex for audience',
        'Not actionable enough',
        'No clear takeaways',
        'Boring presentation'
      ],
      psychology: 'Knowledge Gap → Curiosity → Learning → Implementation → Mastery'
    },
    CONSIDERATION: {
      title: 'Consideration',
      purpose: 'Help prospects evaluate and compare solutions to make informed decisions',
      funnelStage: 'Middle of Funnel',
      psychologicalDriver: 'Trust & Validation',
      approach: 'Evidence-based persuasion',
      icon: '🤔',
      color: 'violet',
      structure: [
        'Acknowledge evaluation stage',
        'Present clear differentiators',
        'Show social proof and testimonials',
        'Address common objections',
        'Comparison framework',
        'Evaluation CTA - Try, compare, demo'
      ],
      bestPlatforms: ['Case Studies', 'Comparison Pages', 'Webinars', 'Email Series'],
      metrics: ['Demo requests', 'Trial signups', 'Comparison page views', 'Time in consideration'],
      examples: [
        'Why 10,000+ Companies Switched to Our Solution',
        'Side-by-Side Comparison: Us vs. Competitors',
        'Real Customer Results: 3 Success Stories'
      ],
      avoid: [
        'Bashing competitors directly',
        'Weak social proof',
        'Not addressing concerns',
        'Unclear differentiators'
      ],
      psychology: 'Comparison → Validation → Trust Building → Risk Assessment → Preference Formation'
    },
    CONVERSION: {
      title: 'Conversion',
      purpose: 'Drive immediate action and close the sale with compelling offers',
      funnelStage: 'Bottom of Funnel',
      psychologicalDriver: 'Urgency & FOMO',
      approach: 'Direct response with clear value',
      icon: '🎯',
      color: 'orange',
      structure: [
        'Attention-grabbing offer',
        'Clear value proposition',
        'Specific benefits list',
        'Urgency or scarcity element',
        'Risk reversal (guarantee)',
        'Strong CTA - Buy now, Start today'
      ],
      bestPlatforms: ['Landing Pages', 'Email Campaigns', 'Google Ads', 'Facebook Ads'],
      metrics: ['Conversion rate', 'Cost per acquisition', 'Cart abandonment', 'Revenue per visitor'],
      examples: [
        'Last 24 Hours: Get 40% Off + Free Shipping',
        'Start Your Free Trial - No Credit Card Required',
        'Limited Spots: Join Before Price Increases'
      ],
      avoid: [
        'Weak CTAs',
        'Hidden costs or terms',
        'No urgency',
        'Complex checkout process'
      ],
      psychology: 'Desire → Justification → Urgency → Risk Mitigation → Action'
    },
    RETENTION: {
      title: 'Retention',
      purpose: 'Keep existing customers engaged, satisfied, and purchasing repeatedly',
      funnelStage: 'Post-Purchase',
      psychologicalDriver: 'Appreciation & Exclusivity',
      approach: 'VIP treatment and loyalty focus',
      icon: '🎁',
      color: 'orange',
      structure: [
        'Appreciation hook - thank you',
        'Exclusive VIP-only benefit',
        'Customer success stories',
        'Community element',
        'Loyalty reward offering',
        'Retention CTA - Upgrade, refer'
      ],
      bestPlatforms: ['Email Marketing', 'SMS Marketing', 'Private Groups', 'WhatsApp Business'],
      metrics: ['Customer lifetime value', 'Repeat purchase rate', 'NPS score', 'Churn rate'],
      examples: [
        '🎉 Happy Anniversary! Here\'s 30% Off as Our Thank You',
        'VIP Early Access: Shop Before Everyone Else',
        'You\'ve Unlocked Gold Status - See Your New Benefits'
      ],
      avoid: [
        'Treating all customers the same',
        'Not celebrating milestones',
        'Generic communications',
        'Ignoring feedback'
      ],
      psychology: 'Purchase → Validation → Satisfaction → Loyalty → Advocacy'
    }
  };
  
  return details[copyType] || null;
};

// Get recommended content mix for strategy
export const getContentMixRecommendation = (goal) => {
  const mixes = {
    balanced: {
      name: 'Balanced Strategy',
      distribution: [
        { type: 'EDUCATION', count: 2 },
        { type: 'ENGAGEMENT', count: 2 },
        { type: 'AWARENESS', count: 1 },
        { type: 'SALES', count: 1 },
        { type: 'RETENTION', count: 1 }
      ],
      description: 'Well-rounded approach for established brands'
    },
    growth: {
      name: 'Growth Focus',
      distribution: [
        { type: 'AWARENESS', count: 3 },
        { type: 'EDUCATION', count: 2 },
        { type: 'ENGAGEMENT', count: 2 }
      ],
      description: 'Ideal for new brands building awareness'
    },
    revenue: {
      name: 'Revenue Focus',
      distribution: [
        { type: 'SALES', count: 3 },
        { type: 'RETENTION', count: 2 },
        { type: 'ENGAGEMENT', count: 1 },
        { type: 'EDUCATION', count: 1 }
      ],
      description: 'Maximize conversions and customer value'
    },
    community: {
      name: 'Community Building',
      distribution: [
        { type: 'ENGAGEMENT', count: 4 },
        { type: 'EDUCATION', count: 2 },
        { type: 'AWARENESS', count: 1 }
      ],
      description: 'Focus on building active community'
    }
  };
  
  return mixes[goal] || mixes.balanced;
};

// Get customer journey stage for copy type
export const getJourneyStage = (copyType) => {
  const stages = {
    AWARENESS: {
      stage: 'Discovery',
      mindset: 'I might have a problem',
      next: 'Research'
    },
    EDUCATION: {
      stage: 'Research',
      mindset: 'What are my options?',
      next: 'Consideration'
    },
    ENGAGEMENT: {
      stage: 'Building Interest',
      mindset: 'This is interesting',
      next: 'Consideration'
    },
    CONSIDERATION: {
      stage: 'Evaluation',
      mindset: 'Which solution is best?',
      next: 'Decision'
    },
    CONVERSION: {
      stage: 'Decision',
      mindset: 'I\'m ready to buy',
      next: 'Purchase'
    },
    RETENTION: {
      stage: 'Post-Purchase',
      mindset: 'I\'m a happy customer',
      next: 'Advocacy'
    }
  };
  
  return stages[copyType] || null;
};

// Get platform details
export const getPlatformDetails = (platform) => {
  const platformDetails = {
    FACEBOOK: {
      icon: '📘',
      characterLimit: '63,206',
      idealLength: '40-80 characters',
      mediaSupport: 'Images, Videos, Links',
      overview: 'Facebook is ideal for building community and sharing detailed content with established audiences.',
      bestPractices: [
        'Use conversational tone',
        'Include questions to boost engagement',
        'Post during peak hours (9am-3pm)',
        'Use high-quality visuals',
        'Keep initial text concise with "See More" expansion'
      ],
      contentFormat: {
        headline: 'Optional but impactful',
        body: 'Main message with storytelling',
        cta: 'Clear call-to-action button'
      },
      hashtagStrategy: 'Use 1-2 relevant hashtags maximum',
      limitations: [
        'Organic reach is limited without paid promotion',
        'Link posts have lower reach than native content',
        'Frequent posting can reduce reach'
      ],
      audience: 'Broad demographic, 25-54 age range, community-focused',
      recommendedCopyTypes: ['AWARENESS', 'ENGAGEMENT', 'RETENTION'],
      deviceOptimization: 'mobile',
      copyTypeAdvice: {
        AWARENESS: 'Focus on shareable, educational content',
        ENGAGEMENT: 'Use polls, questions, and interactive content',
        RETENTION: 'Share customer stories and behind-the-scenes content'
      },
      contentApproach: 'community building and storytelling'
    },
    INSTAGRAM: {
      icon: '📷',
      characterLimit: '2,200',
      idealLength: '125-150 characters',
      mediaSupport: 'Images, Videos, Reels, Stories',
      overview: 'Instagram is a visual-first platform perfect for brand storytelling and lifestyle content.',
      bestPractices: [
        'Lead with stunning visuals',
        'Use emoji strategically',
        'Post consistently at optimal times',
        'Leverage Stories and Reels',
        'Engage with comments quickly'
      ],
      contentFormat: {
        caption: 'Hook + story + CTA',
        hashtags: 'After main caption or in first comment',
        mentions: 'Tag relevant accounts'
      },
      hashtagStrategy: 'Use 8-15 targeted hashtags, mix popular and niche',
      limitations: [
        'No clickable links in posts',
        'Algorithm favors Reels over static posts',
        'Stories disappear after 24 hours'
      ],
      audience: 'Millennials and Gen Z, visual-oriented, lifestyle-focused',
      recommendedCopyTypes: ['AWARENESS', 'CONVERSION', 'ENGAGEMENT'],
      deviceOptimization: 'mobile',
      copyTypeAdvice: {
        AWARENESS: 'Create visually appealing, discoverable content',
        CONVERSION: 'Use Stories with swipe-up links or link in bio',
        ENGAGEMENT: 'Ask questions and create interactive content'
      },
      contentApproach: 'visual storytelling and lifestyle branding'
    },
    TWITTER: {
      icon: '🐦',
      characterLimit: '280',
      idealLength: '100-280 characters',
      mediaSupport: 'Images, Videos, GIFs, Threads',
      overview: 'Twitter is best for real-time updates, news, and conversational content.',
      bestPractices: [
        'Be concise and punchy',
        'Use threads for longer content',
        'Engage in conversations',
        'Tweet at peak times',
        'Use relevant trending hashtags'
      ],
      contentFormat: {
        tweet: 'Hook + key message + CTA/hashtag',
        thread: 'Numbered points for clarity',
        reply: 'Engage authentically'
      },
      hashtagStrategy: 'Use 1-2 hashtags, focus on trending topics',
      limitations: [
        'Very short character limit',
        'Fast-moving feed',
        'Content has short lifespan'
      ],
      audience: 'News-savvy, professionals, real-time engagement seekers',
      recommendedCopyTypes: ['AWARENESS', 'THOUGHT_LEADERSHIP', 'CONVERSION'],
      deviceOptimization: 'mobile',
      copyTypeAdvice: {
        AWARENESS: 'Share insights and join trending conversations',
        THOUGHT_LEADERSHIP: 'Share unique perspectives and industry insights',
        CONVERSION: 'Use clear CTAs with trackable links'
      },
      contentApproach: 'concise, timely, conversational messaging'
    },
    LINKEDIN: {
      icon: '💼',
      characterLimit: '3,000',
      idealLength: '150-300 characters',
      mediaSupport: 'Articles, Images, Videos, Documents',
      overview: 'LinkedIn is the premier platform for B2B marketing and professional networking.',
      bestPractices: [
        'Maintain professional tone',
        'Share valuable insights',
        'Post during business hours',
        'Use native video',
        'Engage with industry content'
      ],
      contentFormat: {
        post: 'Professional insight + context + discussion prompt',
        article: 'Long-form thought leadership',
        update: 'Company news and achievements'
      },
      hashtagStrategy: 'Use 3-5 professional hashtags',
      limitations: [
        'Casual content performs poorly',
        'Overly promotional content is penalized',
        'Limited reach without employee advocacy'
      ],
      audience: 'Professionals, decision-makers, B2B buyers',
      recommendedCopyTypes: ['THOUGHT_LEADERSHIP', 'EDUCATIONAL', 'SALES'],
      deviceOptimization: 'desktop',
      copyTypeAdvice: {
        THOUGHT_LEADERSHIP: 'Share industry insights and expertise',
        EDUCATIONAL: 'Provide valuable how-to content',
        SALES: 'Focus on business value and ROI'
      },
      contentApproach: 'professional value and industry expertise'
    },
    YOUTUBE: {
      icon: '📺',
      characterLimit: '5,000 (description)',
      idealLength: '125-150 words',
      mediaSupport: 'Videos, Shorts, Live Streams',
      overview: 'YouTube is ideal for long-form video content, tutorials, and entertainment.',
      bestPractices: [
        'Optimize titles for search',
        'Write compelling descriptions',
        'Use custom thumbnails',
        'Include timestamps',
        'Encourage subscriptions'
      ],
      contentFormat: {
        title: 'Keyword-rich and clickable',
        description: 'Summary + timestamps + links + hashtags',
        tags: 'Relevant keywords for discovery'
      },
      hashtagStrategy: 'Use 3-5 hashtags in description',
      limitations: [
        'Requires video content',
        'High production expectations',
        'Competitive algorithm'
      ],
      audience: 'All demographics, entertainment and education seekers',
      recommendedCopyTypes: ['EDUCATIONAL', 'AWARENESS', 'ENGAGEMENT'],
      deviceOptimization: 'mobile',
      copyTypeAdvice: {
        EDUCATIONAL: 'Create how-to and tutorial content',
        AWARENESS: 'Share brand stories and behind-the-scenes',
        ENGAGEMENT: 'Ask viewers to like, comment, and subscribe'
      },
      contentApproach: 'video-first educational and entertainment content'
    },
    TIKTOK: {
      icon: '🎵',
      characterLimit: '2,200',
      idealLength: '100-150 characters',
      mediaSupport: 'Short Videos, Live Streams',
      overview: 'TikTok is perfect for creative, trending, and authentic short-form video content.',
      bestPractices: [
        'Follow and create trends',
        'Keep videos under 60 seconds',
        'Use trending sounds',
        'Be authentic and fun',
        'Post consistently'
      ],
      contentFormat: {
        caption: 'Hook + context + hashtags',
        video: 'Attention-grabbing first 3 seconds',
        sounds: 'Trending audio for visibility'
      },
      hashtagStrategy: 'Mix trending and niche hashtags (3-5)',
      limitations: [
        'Video-only platform',
        'Very young audience',
        'Trends change rapidly'
      ],
      audience: 'Gen Z and younger Millennials, entertainment-focused',
      recommendedCopyTypes: ['AWARENESS', 'VIRAL', 'ENGAGEMENT'],
      deviceOptimization: 'mobile',
      copyTypeAdvice: {
        AWARENESS: 'Create entertaining, shareable content',
        VIRAL: 'Jump on trends quickly',
        ENGAGEMENT: 'Use challenges and duets'
      },
      contentApproach: 'trendy, authentic, and entertaining'
    },
    PINTEREST: {
      icon: '📌',
      characterLimit: '500',
      idealLength: '100-200 characters',
      mediaSupport: 'Images, Videos, Story Pins',
      overview: 'Pinterest is a visual discovery platform ideal for inspiration and planning.',
      bestPractices: [
        'Use vertical images (2:3 ratio)',
        'Include text overlays',
        'Create themed boards',
        'Pin consistently',
        'Use rich Pins'
      ],
      contentFormat: {
        title: 'SEO-optimized and descriptive',
        description: 'Detailed with keywords',
        board: 'Organized by theme'
      },
      hashtagStrategy: 'Use relevant hashtags in descriptions',
      limitations: [
        'Slower engagement than other platforms',
        'Requires high-quality visuals',
        'Limited direct interaction'
      ],
      audience: 'Predominantly female, planners and DIY enthusiasts',
      recommendedCopyTypes: ['EDUCATIONAL', 'INSPIRATIONAL', 'CONVERSION'],
      deviceOptimization: 'mobile',
      copyTypeAdvice: {
        EDUCATIONAL: 'Create how-to guides and infographics',
        INSPIRATIONAL: 'Share aspirational lifestyle content',
        CONVERSION: 'Link to product pages and blog posts'
      },
      contentApproach: 'visual inspiration and practical solutions'
    },
    SNAPCHAT: {
      icon: '👻',
      characterLimit: '250',
      idealLength: '80-100 characters',
      mediaSupport: 'Photos, Videos, AR Lenses',
      overview: 'Snapchat is ideal for ephemeral, authentic content targeting younger audiences.',
      bestPractices: [
        'Keep content casual and fun',
        'Use AR filters and lenses',
        'Create exclusive content',
        'Leverage Stories',
        'Be authentic'
      ],
      contentFormat: {
        snap: 'Visual with text overlay',
        story: 'Sequential narrative',
        chat: 'Direct messaging'
      },
      hashtagStrategy: 'Limited hashtag use, focus on stickers',
      limitations: [
        'Content disappears quickly',
        'Younger demographic only',
        'Limited analytics'
      ],
      audience: 'Gen Z, casual and authentic content preference',
      recommendedCopyTypes: ['AWARENESS', 'ENGAGEMENT', 'EXCLUSIVE'],
      deviceOptimization: 'mobile',
      copyTypeAdvice: {
        AWARENESS: 'Share behind-the-scenes content',
        ENGAGEMENT: 'Create interactive AR experiences',
        EXCLUSIVE: 'Offer Snapchat-only promotions'
      },
      contentApproach: 'ephemeral, authentic, and playful'
    },
    REDDIT: {
      icon: '👽',
      characterLimit: '40,000',
      idealLength: '100-300 words',
      mediaSupport: 'Text, Images, Videos, Links',
      overview: 'Reddit is a community-driven platform perfect for authentic discussions and niche targeting.',
      bestPractices: [
        'Understand subreddit rules',
        'Be authentic, not promotional',
        'Contribute value first',
        'Use proper formatting',
        'Engage in discussions'
      ],
      contentFormat: {
        title: 'Clear and intriguing',
        post: 'Detailed with proper formatting',
        comment: 'Thoughtful and contributory'
      },
      hashtagStrategy: 'No hashtags, use relevant subreddits',
      limitations: [
        'Strong anti-promotion sentiment',
        'Each subreddit has unique rules',
        'Requires community building'
      ],
      audience: 'Tech-savvy, skeptical of marketing, value authenticity',
      recommendedCopyTypes: ['EDUCATIONAL', 'THOUGHT_LEADERSHIP', 'COMMUNITY'],
      deviceOptimization: 'desktop',
      copyTypeAdvice: {
        EDUCATIONAL: 'Share genuine expertise without promotion',
        THOUGHT_LEADERSHIP: 'Contribute unique perspectives',
        COMMUNITY: 'Build trust through consistent value'
      },
      contentApproach: 'authentic community contribution'
    },
    EMAIL: {
      icon: '✉️',
      characterLimit: 'No limit',
      idealLength: '50-125 words',
      mediaSupport: 'HTML, Images, Videos',
      overview: 'Email marketing allows for personalized, direct communication with your audience.',
      bestPractices: [
        'Compelling subject lines',
        'Personalization tokens',
        'Mobile optimization',
        'Clear CTAs',
        'A/B testing'
      ],
      contentFormat: {
        subject: '30-50 characters',
        preheader: 'Complements subject line',
        body: 'Scannable with clear hierarchy'
      },
      hashtagStrategy: 'Not applicable',
      limitations: [
        'Spam filters',
        'Inbox competition',
        'Deliverability issues'
      ],
      audience: 'Opted-in subscribers, varies by list',
      recommendedCopyTypes: ['SALES', 'RETENTION', 'EDUCATIONAL'],
      deviceOptimization: 'mobile',
      copyTypeAdvice: {
        SALES: 'Focus on benefits and urgency',
        RETENTION: 'Provide exclusive value to subscribers',
        EDUCATIONAL: 'Share valuable insights and tips'
      },
      contentApproach: 'personalized and value-driven messaging'
    },
    WHATSAPP: {
      icon: '💬',
      characterLimit: '4,096',
      idealLength: '100-200 characters',
      mediaSupport: 'Text, Images, Videos, Documents',
      overview: 'WhatsApp Business enables direct, personal communication with customers.',
      bestPractices: [
        'Keep messages concise',
        'Use rich media',
        'Respond quickly',
        'Respect privacy',
        'Use broadcast lists wisely'
      ],
      contentFormat: {
        message: 'Personal and conversational',
        broadcast: 'Valuable updates only',
        status: 'Business updates and offers'
      },
      hashtagStrategy: 'Not commonly used',
      limitations: [
        'Requires opt-in',
        'No mass marketing allowed',
        'Limited automation'
      ],
      audience: 'Existing customers, personal communication preference',
      recommendedCopyTypes: ['CUSTOMER_SERVICE', 'RETENTION', 'URGENT'],
      deviceOptimization: 'mobile',
      copyTypeAdvice: {
        CUSTOMER_SERVICE: 'Provide quick, helpful responses',
        RETENTION: 'Share exclusive offers and updates',
        URGENT: 'Send time-sensitive information'
      },
      contentApproach: 'personal and conversational messaging'
    },
    TELEGRAM: {
      icon: '✈️',
      characterLimit: '4,096',
      idealLength: '100-300 characters',
      mediaSupport: 'Text, Images, Videos, Files',
      overview: 'Telegram is ideal for broadcast channels and community building.',
      bestPractices: [
        'Create valuable channels',
        'Use formatting options',
        'Schedule posts',
        'Build communities',
        'Share exclusive content'
      ],
      contentFormat: {
        channel: 'Broadcast-style updates',
        group: 'Community discussions',
        bot: 'Automated interactions'
      },
      hashtagStrategy: 'Use inline hashtags for organization',
      limitations: [
        'Requires active management',
        'Competition from other channels',
        'No native advertising'
      ],
      audience: 'Tech-savvy, privacy-conscious, global audience',
      recommendedCopyTypes: ['ANNOUNCEMENT', 'EDUCATIONAL', 'COMMUNITY'],
      deviceOptimization: 'mobile',
      copyTypeAdvice: {
        ANNOUNCEMENT: 'Share important updates and news',
        EDUCATIONAL: 'Provide detailed guides and resources',
        COMMUNITY: 'Foster discussions and engagement'
      },
      contentApproach: 'broadcast and community building'
    },
    DISCORD: {
      icon: '🎮',
      characterLimit: '2,000',
      idealLength: '100-500 characters',
      mediaSupport: 'Text, Images, Videos, Voice',
      overview: 'Discord is perfect for building engaged communities around shared interests.',
      bestPractices: [
        'Build genuine community',
        'Use voice channels',
        'Create themed channels',
        'Host events',
        'Moderate actively'
      ],
      contentFormat: {
        announcement: 'Server-wide updates',
        channel: 'Topic-specific discussions',
        dm: 'Personal outreach'
      },
      hashtagStrategy: 'Use channel tags instead',
      limitations: [
        'Requires constant moderation',
        'Gaming-centric reputation',
        'Learning curve for new users'
      ],
      audience: 'Gamers, creators, tight-knit communities',
      recommendedCopyTypes: ['COMMUNITY', 'ENGAGEMENT', 'EVENT'],
      deviceOptimization: 'desktop',
      copyTypeAdvice: {
        COMMUNITY: 'Foster discussions and shared experiences',
        ENGAGEMENT: 'Create interactive events and activities',
        EVENT: 'Host voice chats and live streams'
      },
      contentApproach: 'community-first interactive engagement'
    }
  };

  return platformDetails[platform] || {
    icon: '🌐',
    characterLimit: 'Varies',
    idealLength: 'Platform-specific',
    mediaSupport: 'Platform-specific',
    overview: 'Platform-specific content guidelines apply.',
    bestPractices: ['Follow platform guidelines'],
    limitations: ['Check platform requirements'],
    audience: 'Platform-specific audience',
    recommendedCopyTypes: ['AWARENESS', 'ENGAGEMENT'],
    deviceOptimization: 'responsive',
    contentApproach: 'platform best practices'
  };
};

// Get platform best practices
export const getPlatformBestPractices = (platform) => {
  const details = getPlatformDetails(platform);
  return details.bestPractices || [];
};

// Get platform limitations
export const getPlatformLimitations = (platform) => {
  const details = getPlatformDetails(platform);
  return details.limitations || [];
};

export default copyService;