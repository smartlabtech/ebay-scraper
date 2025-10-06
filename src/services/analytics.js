import api from './api';
import { mockAnalytics, mockProjects, mockBrandMessages, mockCopies } from '../data/mockData';
import authService from './auth';

class AnalyticsService {
  // Get dashboard overview
  async getDashboardOverview() {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Calculate real-time stats from mock data
    const userProjects = mockProjects.filter(p => p.userId === user.id);
    const userMessages = mockBrandMessages.filter(m => m.userId === user.id);
    const userCopies = mockCopies.filter(c => c.userId === user.id);

    const totalViews = userCopies.reduce((sum, copy) => 
      sum + (copy.performance?.views || 0), 0
    );

    const totalEngagement = userCopies.reduce((sum, copy) => {
      if (!copy.performance) return sum;
      return sum + copy.performance.likes + copy.performance.shares + copy.performance.comments;
    }, 0);

    const avgEngagementRate = totalViews > 0 ? 
      ((totalEngagement / totalViews) * 100).toFixed(2) : 0;

    return {
      totalProjects: userProjects.length,
      activeProjects: userProjects.filter(p => p.status === 'active').length,
      totalMessages: userMessages.length,
      totalCopies: userCopies.length,
      avgEngagementRate: parseFloat(avgEngagementRate),
      totalViews,
      growth: mockAnalytics.overview.growth
    };
  }

  // Get performance metrics
  async getPerformanceMetrics(timeRange = 'week') {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Generate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Generate mock daily data
    const dailyData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dailyData.push({
        date: currentDate.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 2000) + 500,
        engagement: (Math.random() * 2 + 2).toFixed(2),
        copies: Math.floor(Math.random() * 10) + 1,
        messages: Math.floor(Math.random() * 5)
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      timeRange,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      data: dailyData,
      summary: {
        totalViews: dailyData.reduce((sum, day) => sum + day.views, 0),
        avgEngagement: (dailyData.reduce((sum, day) => sum + parseFloat(day.engagement), 0) / dailyData.length).toFixed(2),
        totalCopies: dailyData.reduce((sum, day) => sum + day.copies, 0),
        totalMessages: dailyData.reduce((sum, day) => sum + day.messages, 0)
      }
    };
  }

  // Get project analytics
  async getProjectAnalytics(projectId) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const project = mockProjects.find(p => p.id === projectId && p.userId === user.id);
    if (!project) {
      throw new Error('Project not found');
    }

    const projectMessages = mockBrandMessages.filter(m => m.projectId === projectId);
    const projectCopies = mockCopies.filter(c => c.projectId === projectId);

    const topPerformingCopies = projectCopies
      .filter(c => c.performance)
      .sort((a, b) => b.performance.views - a.performance.views)
      .slice(0, 5);

    const avgMessageScore = projectMessages.length > 0 ?
      projectMessages.reduce((sum, m) => sum + m.score, 0) / projectMessages.length : 0;

    return {
      project,
      stats: {
        messages: projectMessages.length,
        copies: projectCopies.length,
        avgMessageScore: avgMessageScore.toFixed(1),
        totalViews: projectCopies.reduce((sum, c) => sum + (c.performance?.views || 0), 0),
        completionRate: project.progress
      },
      topPerformingCopies,
      messageBreakdown: {
        draft: projectMessages.filter(m => m.status === 'draft').length,
        published: projectMessages.filter(m => m.status === 'published').length,
        testing: projectMessages.filter(m => m.status === 'testing').length,
        archived: projectMessages.filter(m => m.status === 'archived').length
      },
      platformBreakdown: this.getPlatformBreakdown(projectCopies)
    };
  }

  // Get platform breakdown
  getPlatformBreakdown(copies) {
    const platforms = {};
    
    copies.forEach(copy => {
      if (!platforms[copy.platform]) {
        platforms[copy.platform] = {
          count: 0,
          views: 0,
          engagement: 0
        };
      }
      
      platforms[copy.platform].count++;
      if (copy.performance) {
        platforms[copy.platform].views += copy.performance.views;
        platforms[copy.platform].engagement += 
          copy.performance.likes + copy.performance.shares + copy.performance.comments;
      }
    });

    return Object.entries(platforms).map(([platform, data]) => ({
      platform,
      ...data,
      avgEngagement: data.views > 0 ? (data.engagement / data.views * 100).toFixed(2) : 0
    }));
  }

  // Get content performance
  async getContentPerformance(contentType = 'all') {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const userCopies = mockCopies.filter(c => c.userId === user.id && c.performance);

    let filteredCopies = userCopies;
    if (contentType !== 'all') {
      filteredCopies = userCopies.filter(c => c.format === contentType);
    }

    const performance = filteredCopies.map(copy => ({
      id: copy.id,
      title: copy.title,
      platform: copy.platform,
      format: copy.format,
      views: copy.performance.views,
      engagement: copy.performance.likes + copy.performance.shares + copy.performance.comments,
      engagementRate: ((copy.performance.likes + copy.performance.shares + copy.performance.comments) / copy.performance.views * 100).toFixed(2),
      createdAt: copy.createdAt
    }));

    return {
      contentType,
      totalContent: performance.length,
      avgViews: performance.length > 0 ? 
        Math.floor(performance.reduce((sum, p) => sum + p.views, 0) / performance.length) : 0,
      avgEngagementRate: performance.length > 0 ?
        (performance.reduce((sum, p) => sum + parseFloat(p.engagementRate), 0) / performance.length).toFixed(2) : 0,
      topPerformers: performance.sort((a, b) => b.views - a.views).slice(0, 10),
      lowPerformers: performance.sort((a, b) => a.views - b.views).slice(0, 5)
    };
  }

  // Get engagement trends
  async getEngagementTrends(timeRange = 'month') {
    const metrics = await this.getPerformanceMetrics(timeRange);
    
    const trends = {
      likes: [],
      shares: [],
      comments: [],
      overall: []
    };

    metrics.data.forEach(day => {
      const likes = Math.floor(Math.random() * 100) + 20;
      const shares = Math.floor(Math.random() * 30) + 5;
      const comments = Math.floor(Math.random() * 20) + 2;
      
      trends.likes.push({ date: day.date, value: likes });
      trends.shares.push({ date: day.date, value: shares });
      trends.comments.push({ date: day.date, value: comments });
      trends.overall.push({ 
        date: day.date, 
        value: parseFloat(day.engagement)
      });
    });

    return trends;
  }

  // Get recent activity
  async getRecentActivity(limit = 10) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // In real app, this would fetch from activity log
    return mockAnalytics.recentActivity.slice(0, limit);
  }

  // Get conversion funnel
  async getConversionFunnel() {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    return {
      stages: [
        { name: 'Views', value: 10000, percentage: 100 },
        { name: 'Engagement', value: 3500, percentage: 35 },
        { name: 'Clicks', value: 1200, percentage: 12 },
        { name: 'Conversions', value: 150, percentage: 1.5 }
      ],
      conversionRate: 1.5,
      avgTimeToConvert: '3.2 days'
    };
  }

  // Export analytics data
  async exportAnalytics(format = 'csv', dateRange) {
    const data = await this.getPerformanceMetrics(dateRange);
    
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real app, this would generate actual file
    const mockFile = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(mockFile);
    
    return {
      url,
      filename: `analytics-export-${new Date().toISOString().split('T')[0]}.${format}`,
      size: mockFile.size
    };
  }

  // Get insights and recommendations
  async getInsights() {
    const overview = await this.getDashboardOverview();
    
    const insights = [];
    
    if (overview.avgEngagementRate < 2) {
      insights.push({
        type: 'warning',
        title: 'Low engagement rate',
        description: 'Your average engagement rate is below 2%. Consider testing different content formats.',
        action: 'View content tips'
      });
    }
    
    if (overview.activeProjects > 5) {
      insights.push({
        type: 'info',
        title: 'Multiple active projects',
        description: 'You have many active projects. Consider focusing on top performers.',
        action: 'Review projects'
      });
    }
    
    insights.push({
      type: 'success',
      title: 'Growing audience',
      description: `Your content views increased by ${overview.growth.engagement}% this month.`,
      action: 'See what\'s working'
    });

    return insights;
  }
}

// Create and export service instance
const analyticsService = new AnalyticsService();
export default analyticsService;