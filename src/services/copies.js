import api from './api';
import { mockCopies } from '../data/mockData';
import authService from './auth';
import { COPY_PLATFORMS, COPY_FORMATS } from '../types';

class CopiesService {
  // Get all copies for a project
  async getCopies(projectId, filters = {}) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    let copies = mockCopies.filter(c => 
      c.projectId === projectId && c.userId === user.id
    );

    // Apply filters
    if (filters.platform) {
      copies = copies.filter(c => c.platform === filters.platform);
    }
    if (filters.format) {
      copies = copies.filter(c => c.format === filters.format);
    }
    if (filters.messageId) {
      copies = copies.filter(c => c.messageId === filters.messageId);
    }
    if (filters.status) {
      copies = copies.filter(c => c.status === filters.status);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      copies = copies.filter(c => 
        c.title.toLowerCase().includes(searchLower) ||
        c.content.toLowerCase().includes(searchLower) ||
        c.hashtags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    if (filters.sortBy) {
      copies.sort((a, b) => {
        switch (filters.sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'createdAt':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'performance':
            const aEngagement = a.performance ? 
              (a.performance.likes + a.performance.shares + a.performance.comments) / a.performance.views : 0;
            const bEngagement = b.performance ? 
              (b.performance.likes + b.performance.shares + b.performance.comments) / b.performance.views : 0;
            return bEngagement - aEngagement;
          default:
            return 0;
        }
      });
    }

    return copies;
  }

  // Get single copy
  async getCopy(copyId) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const copy = mockCopies.find(c => c.id === copyId && c.userId === user.id);
    
    if (!copy) {
      throw new Error('Copy not found');
    }

    return copy;
  }

  // Create copy
  async createCopy(copyData) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const newCopy = {
      id: Date.now().toString(),
      userId: user.id,
      ...copyData,
      characterCount: copyData.content.length,
      status: 'draft',
      createdAt: new Date().toISOString(),
      performance: null
    };

    mockCopies.push(newCopy);

    return newCopy;
  }

  // Update copy
  async updateCopy(copyId, updates) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const index = mockCopies.findIndex(c => c.id === copyId && c.userId === user.id);
    
    if (index === -1) {
      throw new Error('Copy not found');
    }

    const updatedCopy = {
      ...mockCopies[index],
      ...updates,
      characterCount: updates.content ? updates.content.length : mockCopies[index].characterCount
    };

    mockCopies[index] = updatedCopy;

    return updatedCopy;
  }

  // Delete copy
  async deleteCopy(copyId) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const index = mockCopies.findIndex(c => c.id === copyId && c.userId === user.id);
    
    if (index === -1) {
      throw new Error('Copy not found');
    }

    mockCopies.splice(index, 1);

    return { success: true, deletedId: copyId };
  }

  // Generate copy from message (AI simulation)
  async generateCopy(messageId, platform, format) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Platform-specific character limits
    const limits = {
      [COPY_PLATFORMS.TWITTER]: 280,
      [COPY_PLATFORMS.INSTAGRAM]: 2200,
      [COPY_PLATFORMS.FACEBOOK]: 63206,
      [COPY_PLATFORMS.LINKEDIN]: 3000,
      [COPY_PLATFORMS.TIKTOK]: 150,
      [COPY_PLATFORMS.YOUTUBE]: 5000,
      [COPY_PLATFORMS.EMAIL]: 10000,
      [COPY_PLATFORMS.WEBSITE]: 50000
    };

    // Generate platform-specific content
    const platformTemplates = {
      [COPY_PLATFORMS.TWITTER]: {
        content: '🚀 Exciting news! {message}\n\n#Innovation #Success #Growth',
        hashtags: ['Innovation', 'Success', 'Growth']
      },
      [COPY_PLATFORMS.INSTAGRAM]: {
        content: '✨ {message}\n\nDouble tap if you agree! 💯\n\n#BrandLove #Marketing #Business',
        hashtags: ['BrandLove', 'Marketing', 'Business']
      },
      [COPY_PLATFORMS.LINKEDIN]: {
        content: 'I\'m thrilled to share: {message}\n\nIn today\'s competitive landscape, this approach has helped us achieve remarkable results.\n\nWhat\'s your take on this?\n\n#ProfessionalGrowth #BusinessStrategy',
        hashtags: ['ProfessionalGrowth', 'BusinessStrategy']
      }
    };

    const template = platformTemplates[platform] || platformTemplates[COPY_PLATFORMS.TWITTER];
    const baseContent = template.content.replace('{message}', 'Your brand message here');

    // Ensure content fits platform limits
    const maxLength = limits[platform] || 1000;
    const content = baseContent.length > maxLength ? 
      baseContent.substring(0, maxLength - 3) + '...' : baseContent;

    return {
      platform,
      format,
      content,
      hashtags: template.hashtags,
      characterCount: content.length,
      suggestions: [
        'Add a clear call-to-action',
        'Include relevant emojis for engagement',
        'Test different posting times'
      ]
    };
  }

  // Generate multiple variations
  async generateVariations(copyId, count = 3) {
    const copy = await this.getCopy(copyId);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const variations = [];
    const tones = ['professional', 'casual', 'enthusiastic', 'informative'];
    
    for (let i = 0; i < count; i++) {
      const tone = tones[i % tones.length];
      variations.push({
        id: `var-${i + 1}`,
        content: `[${tone} tone] ${copy.content}`,
        tone,
        characterCount: copy.content.length + tone.length + 10
      });
    }

    return variations;
  }

  // Publish copy
  async publishCopy(copyId) {
    return this.updateCopy(copyId, { 
      status: 'published',
      publishedAt: new Date().toISOString()
    });
  }

  // Schedule copy
  async scheduleCopy(copyId, scheduledDate) {
    return this.updateCopy(copyId, { 
      status: 'scheduled',
      scheduledDate
    });
  }

  // Get copy performance
  async getCopyPerformance(copyId) {
    const copy = await this.getCopy(copyId);
    
    if (!copy.performance) {
      // Simulate fetching performance data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const performance = {
        views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 50) + 5,
        clicks: Math.floor(Math.random() * 200) + 20,
        lastUpdated: new Date().toISOString()
      };

      await this.updateCopy(copyId, { performance });
      
      return performance;
    }

    return copy.performance;
  }

  // Get platform templates
  getPlatformTemplates(platform) {
    const templates = {
      [COPY_PLATFORMS.TWITTER]: [
        { name: 'Announcement', template: '📢 Big news! {message} #Announcement' },
        { name: 'Question', template: 'What do you think about {message}? Let us know! 🤔' },
        { name: 'Tip', template: '💡 Pro tip: {message} #TipTuesday' }
      ],
      [COPY_PLATFORMS.INSTAGRAM]: [
        { name: 'Story', template: 'Swipe up to learn about {message} ⬆️' },
        { name: 'Carousel', template: 'Slide 1/5: {message}\n\nKeep swiping for more →' },
        { name: 'Reel', template: 'POV: {message} 🎬\n\n#Reels #Viral' }
      ],
      [COPY_PLATFORMS.LINKEDIN]: [
        { name: 'Thought Leadership', template: 'After 10 years in the industry, here\'s what I learned about {message}...' },
        { name: 'Case Study', template: 'How we achieved {message}: A case study thread 🧵' },
        { name: 'Industry News', template: 'Breaking: {message}. Here\'s what it means for our industry...' }
      ]
    };

    return templates[platform] || [];
  }

  // Duplicate copy
  async duplicateCopy(copyId) {
    const copy = await this.getCopy(copyId);
    
    return this.createCopy({
      ...copy,
      title: `${copy.title} (Copy)`,
      status: 'draft',
      performance: null
    });
  }

  // Get hashtag suggestions
  async getHashtagSuggestions(platform, content) {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 500));

    const suggestions = {
      trending: ['2024Trends', 'Innovation', 'GrowthMindset'],
      relevant: ['BrandStrategy', 'MarketingTips', 'BusinessGrowth'],
      niche: ['B2BMarketing', 'StartupLife', 'DigitalTransformation']
    };

    return suggestions;
  }
}

// Create and export service instance
const copiesService = new CopiesService();
export default copiesService;