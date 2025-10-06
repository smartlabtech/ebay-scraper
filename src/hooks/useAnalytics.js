import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  fetchDashboardOverview,
  fetchPerformanceMetrics,
  fetchProjectAnalytics,
  fetchContentPerformance,
  fetchEngagementTrends,
  fetchRecentActivity,
  fetchConversionFunnel,
  fetchInsights,
  exportAnalytics,
  setTimeRange,
  setContentType,
  clearProjectAnalytics,
  selectOverview,
  selectPerformanceMetrics,
  selectProjectAnalytics,
  selectContentPerformance,
  selectEngagementTrends,
  selectRecentActivity,
  selectConversionFunnel,
  selectInsights,
  selectAnalyticsLoading,
  selectTimeRange,
  selectContentType,
  selectExportProgress
} from '../store/slices/analyticsSlice';
import { useNotifications } from './useNotifications';

export const useAnalytics = () => {
  const dispatch = useDispatch();
  const { notifySuccess, notifyError, notifyInfo } = useNotifications();
  
  const overview = useSelector(selectOverview);
  const performanceMetrics = useSelector(selectPerformanceMetrics);
  const projectAnalytics = useSelector(selectProjectAnalytics);
  const contentPerformance = useSelector(selectContentPerformance);
  const engagementTrends = useSelector(selectEngagementTrends);
  const recentActivity = useSelector(selectRecentActivity);
  const conversionFunnel = useSelector(selectConversionFunnel);
  const insights = useSelector(selectInsights);
  const loading = useSelector(selectAnalyticsLoading);
  const timeRange = useSelector(selectTimeRange);
  const contentType = useSelector(selectContentType);
  const exportProgress = useSelector(selectExportProgress);

  // Load dashboard overview
  const loadOverview = useCallback(async () => {
    try {
      const result = await dispatch(fetchDashboardOverview()).unwrap();
      return result;
    } catch (error) {
      notifyError('Failed to load dashboard overview');
      throw error;
    }
  }, [dispatch, notifyError]);

  // Load performance metrics
  const loadPerformanceMetrics = useCallback(async (range = timeRange) => {
    try {
      const result = await dispatch(fetchPerformanceMetrics(range)).unwrap();
      return result;
    } catch (error) {
      notifyError('Failed to load performance metrics');
      throw error;
    }
  }, [dispatch, timeRange, notifyError]);

  // Load project analytics
  const loadProjectAnalytics = useCallback(async (projectId) => {
    try {
      const result = await dispatch(fetchProjectAnalytics(projectId)).unwrap();
      return result;
    } catch (error) {
      notifyError('Failed to load project analytics');
      throw error;
    }
  }, [dispatch, notifyError]);

  // Load content performance
  const loadContentPerformance = useCallback(async (type = contentType) => {
    try {
      const result = await dispatch(fetchContentPerformance(type)).unwrap();
      return result;
    } catch (error) {
      notifyError('Failed to load content performance');
      throw error;
    }
  }, [dispatch, contentType, notifyError]);

  // Load engagement trends
  const loadEngagementTrends = useCallback(async (range = timeRange) => {
    try {
      const result = await dispatch(fetchEngagementTrends(range)).unwrap();
      return result;
    } catch (error) {
      notifyError('Failed to load engagement trends');
      throw error;
    }
  }, [dispatch, timeRange, notifyError]);

  // Load recent activity
  const loadRecentActivity = useCallback(async (limit = 10) => {
    try {
      const result = await dispatch(fetchRecentActivity(limit)).unwrap();
      return result;
    } catch (error) {
      notifyError('Failed to load recent activity');
      throw error;
    }
  }, [dispatch, notifyError]);

  // Load conversion funnel
  const loadConversionFunnel = useCallback(async () => {
    try {
      const result = await dispatch(fetchConversionFunnel()).unwrap();
      return result;
    } catch (error) {
      notifyError('Failed to load conversion funnel');
      throw error;
    }
  }, [dispatch, notifyError]);

  // Load insights
  const loadInsights = useCallback(async () => {
    try {
      const result = await dispatch(fetchInsights()).unwrap();
      return result;
    } catch (error) {
      notifyError('Failed to load insights');
      throw error;
    }
  }, [dispatch, notifyError]);

  // Export analytics data
  const exportData = useCallback(async (format = 'csv', dateRange = timeRange) => {
    try {
      notifyInfo('Exporting analytics data...');
      const result = await dispatch(exportAnalytics({ format, dateRange })).unwrap();
      notifySuccess('Export completed successfully');
      
      // Trigger download
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return result;
    } catch (error) {
      notifyError('Failed to export analytics');
      throw error;
    }
  }, [dispatch, timeRange, notifySuccess, notifyError, notifyInfo]);

  // Update time range
  const updateTimeRange = useCallback((range) => {
    dispatch(setTimeRange(range));
  }, [dispatch]);

  // Update content type filter
  const updateContentType = useCallback((type) => {
    dispatch(setContentType(type));
  }, [dispatch]);

  // Clear project analytics
  const clearProjectData = useCallback(() => {
    dispatch(clearProjectAnalytics());
  }, [dispatch]);

  // Refresh all analytics
  const refreshAllAnalytics = useCallback(async () => {
    try {
      notifyInfo('Refreshing analytics...');
      await Promise.all([
        loadOverview(),
        loadPerformanceMetrics(),
        loadEngagementTrends(),
        loadRecentActivity(),
        loadInsights()
      ]);
      notifySuccess('Analytics refreshed');
    } catch (error) {
      notifyError('Failed to refresh analytics');
    }
  }, [
    loadOverview,
    loadPerformanceMetrics,
    loadEngagementTrends,
    loadRecentActivity,
    loadInsights,
    notifyInfo,
    notifySuccess,
    notifyError
  ]);

  // Calculate growth percentages
  const calculateGrowth = useCallback((current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  }, []);

  // Get performance summary
  const getPerformanceSummary = useCallback(() => {
    if (!performanceMetrics) return null;
    
    const { summary } = performanceMetrics;
    return {
      ...summary,
      viewsPerDay: Math.floor(summary.totalViews / performanceMetrics.data.length),
      peakDay: performanceMetrics.data.reduce((max, day) => 
        day.views > max.views ? day : max, performanceMetrics.data[0])
    };
  }, [performanceMetrics]);

  // Commented out auto-refresh since analytics endpoints are not available
  // useEffect(() => {
  //   if (timeRange) {
  //     loadPerformanceMetrics();
  //     loadEngagementTrends();
  //   }
  // }, [timeRange]);

  // useEffect(() => {
  //   if (contentType) {
  //     loadContentPerformance();
  //   }
  // }, [contentType]);

  return {
    overview,
    performanceMetrics,
    projectAnalytics,
    contentPerformance,
    engagementTrends,
    recentActivity,
    conversionFunnel,
    insights,
    loading,
    timeRange,
    contentType,
    exportProgress,
    loadOverview,
    loadPerformanceMetrics,
    loadProjectAnalytics,
    loadContentPerformance,
    loadEngagementTrends,
    loadRecentActivity,
    loadConversionFunnel,
    loadInsights,
    exportData,
    updateTimeRange,
    updateContentType,
    clearProjectData,
    refreshAllAnalytics,
    calculateGrowth,
    getPerformanceSummary
  };
};