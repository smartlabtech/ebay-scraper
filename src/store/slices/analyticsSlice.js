import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../../services/analytics';

// Async thunks
export const fetchDashboardOverview = createAsyncThunk(
  'analytics/fetchDashboardOverview',
  async () => {
    const response = await analyticsService.getDashboardOverview();
    return response;
  }
);

export const fetchPerformanceMetrics = createAsyncThunk(
  'analytics/fetchPerformanceMetrics',
  async (timeRange) => {
    const response = await analyticsService.getPerformanceMetrics(timeRange);
    return response;
  }
);

export const fetchProjectAnalytics = createAsyncThunk(
  'analytics/fetchProjectAnalytics',
  async (projectId) => {
    const response = await analyticsService.getProjectAnalytics(projectId);
    return response;
  }
);

export const fetchContentPerformance = createAsyncThunk(
  'analytics/fetchContentPerformance',
  async (contentType) => {
    const response = await analyticsService.getContentPerformance(contentType);
    return response;
  }
);

export const fetchEngagementTrends = createAsyncThunk(
  'analytics/fetchEngagementTrends',
  async (timeRange) => {
    const response = await analyticsService.getEngagementTrends(timeRange);
    return response;
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'analytics/fetchRecentActivity',
  async (limit) => {
    const response = await analyticsService.getRecentActivity(limit);
    return response;
  }
);

export const fetchConversionFunnel = createAsyncThunk(
  'analytics/fetchConversionFunnel',
  async () => {
    const response = await analyticsService.getConversionFunnel();
    return response;
  }
);

export const fetchInsights = createAsyncThunk(
  'analytics/fetchInsights',
  async () => {
    const response = await analyticsService.getInsights();
    return response;
  }
);

export const exportAnalytics = createAsyncThunk(
  'analytics/exportAnalytics',
  async ({ format, dateRange }) => {
    const response = await analyticsService.exportAnalytics(format, dateRange);
    return response;
  }
);

// Initial state
const initialState = {
  overview: null,
  performanceMetrics: null,
  projectAnalytics: null,
  contentPerformance: null,
  engagementTrends: null,
  recentActivity: [],
  conversionFunnel: null,
  insights: [],
  loading: {
    overview: false,
    metrics: false,
    project: false,
    content: false,
    trends: false,
    activity: false,
    funnel: false,
    insights: false,
    export: false
  },
  error: null,
  selectedTimeRange: 'week',
  selectedContentType: 'all',
  exportProgress: null
};

// Analytics slice
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setTimeRange: (state, action) => {
      state.selectedTimeRange = action.payload;
    },
    setContentType: (state, action) => {
      state.selectedContentType = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearProjectAnalytics: (state) => {
      state.projectAnalytics = null;
    },
    updateMetric: (state, action) => {
      const { metric, value } = action.payload;
      if (state.overview && state.overview[metric] !== undefined) {
        state.overview[metric] = value;
      }
    }
  },
  extraReducers: (builder) => {
    // Dashboard overview
    builder
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.loading.overview = true;
        state.error = null;
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.loading.overview = false;
        state.overview = action.payload;
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.loading.overview = false;
        state.error = action.error.message || 'Failed to fetch dashboard overview';
      });

    // Performance metrics
    builder
      .addCase(fetchPerformanceMetrics.pending, (state) => {
        state.loading.metrics = true;
        state.error = null;
      })
      .addCase(fetchPerformanceMetrics.fulfilled, (state, action) => {
        state.loading.metrics = false;
        state.performanceMetrics = action.payload;
      })
      .addCase(fetchPerformanceMetrics.rejected, (state, action) => {
        state.loading.metrics = false;
        state.error = action.error.message || 'Failed to fetch performance metrics';
      });

    // Project analytics
    builder
      .addCase(fetchProjectAnalytics.pending, (state) => {
        state.loading.project = true;
        state.error = null;
      })
      .addCase(fetchProjectAnalytics.fulfilled, (state, action) => {
        state.loading.project = false;
        state.projectAnalytics = action.payload;
      })
      .addCase(fetchProjectAnalytics.rejected, (state, action) => {
        state.loading.project = false;
        state.error = action.error.message || 'Failed to fetch project analytics';
      });

    // Content performance
    builder
      .addCase(fetchContentPerformance.pending, (state) => {
        state.loading.content = true;
        state.error = null;
      })
      .addCase(fetchContentPerformance.fulfilled, (state, action) => {
        state.loading.content = false;
        state.contentPerformance = action.payload;
      })
      .addCase(fetchContentPerformance.rejected, (state, action) => {
        state.loading.content = false;
        state.error = action.error.message || 'Failed to fetch content performance';
      });

    // Engagement trends
    builder
      .addCase(fetchEngagementTrends.pending, (state) => {
        state.loading.trends = true;
        state.error = null;
      })
      .addCase(fetchEngagementTrends.fulfilled, (state, action) => {
        state.loading.trends = false;
        state.engagementTrends = action.payload;
      })
      .addCase(fetchEngagementTrends.rejected, (state, action) => {
        state.loading.trends = false;
        state.error = action.error.message || 'Failed to fetch engagement trends';
      });

    // Recent activity
    builder
      .addCase(fetchRecentActivity.pending, (state) => {
        state.loading.activity = true;
        state.error = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.loading.activity = false;
        state.recentActivity = action.payload;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.loading.activity = false;
        state.error = action.error.message || 'Failed to fetch recent activity';
      });

    // Conversion funnel
    builder
      .addCase(fetchConversionFunnel.pending, (state) => {
        state.loading.funnel = true;
        state.error = null;
      })
      .addCase(fetchConversionFunnel.fulfilled, (state, action) => {
        state.loading.funnel = false;
        state.conversionFunnel = action.payload;
      })
      .addCase(fetchConversionFunnel.rejected, (state, action) => {
        state.loading.funnel = false;
        state.error = action.error.message || 'Failed to fetch conversion funnel';
      });

    // Insights
    builder
      .addCase(fetchInsights.pending, (state) => {
        state.loading.insights = true;
        state.error = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading.insights = false;
        state.insights = action.payload;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading.insights = false;
        state.error = action.error.message || 'Failed to fetch insights';
      });

    // Export analytics
    builder
      .addCase(exportAnalytics.pending, (state) => {
        state.loading.export = true;
        state.error = null;
        state.exportProgress = { status: 'generating', percentage: 0 };
      })
      .addCase(exportAnalytics.fulfilled, (state, action) => {
        state.loading.export = false;
        state.exportProgress = { 
          status: 'completed', 
          percentage: 100,
          url: action.payload.url,
          filename: action.payload.filename
        };
      })
      .addCase(exportAnalytics.rejected, (state, action) => {
        state.loading.export = false;
        state.error = action.error.message || 'Failed to export analytics';
        state.exportProgress = null;
      });
  }
});

// Export actions
export const { 
  setTimeRange, 
  setContentType, 
  clearError, 
  clearProjectAnalytics,
  updateMetric 
} = analyticsSlice.actions;

// Export selectors
export const selectOverview = (state) => state.analytics.overview;
export const selectPerformanceMetrics = (state) => state.analytics.performanceMetrics;
export const selectProjectAnalytics = (state) => state.analytics.projectAnalytics;
export const selectContentPerformance = (state) => state.analytics.contentPerformance;
export const selectEngagementTrends = (state) => state.analytics.engagementTrends;
export const selectRecentActivity = (state) => state.analytics.recentActivity;
export const selectConversionFunnel = (state) => state.analytics.conversionFunnel;
export const selectInsights = (state) => state.analytics.insights;
export const selectAnalyticsLoading = (state) => state.analytics.loading;
export const selectAnalyticsError = (state) => state.analytics.error;
export const selectTimeRange = (state) => state.analytics.selectedTimeRange;
export const selectContentType = (state) => state.analytics.selectedContentType;
export const selectExportProgress = (state) => state.analytics.exportProgress;

// Export reducer
export default analyticsSlice.reducer;