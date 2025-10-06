import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import creditUsageService from '../services/creditUsage';

export const useCreditUsage = () => {
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(() => creditUsageService.getCurrentMonthRange());
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const fetchUsageData = useCallback(async (customDateRange = null) => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const range = customDateRange || dateRange;
      const data = await creditUsageService.getAIUsageReport({
        ...range,
        groupBy: 'module'
      });
      
      setUsageData(data);
    } catch (err) {
      console.error('Error fetching credit usage:', err);
      setError(err.message || 'Failed to fetch credit usage data');
    } finally {
      setLoading(false);
    }
  }, [dateRange, isAuthenticated]);

  // Fetch data on mount and when date range changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsageData();
    }
  }, [isAuthenticated]); // Remove fetchUsageData from dependencies to avoid infinite loop

  const updateDateRange = useCallback((newDateRange) => {
    setDateRange(newDateRange);
    fetchUsageData(newDateRange);
  }, [fetchUsageData]);

  const refreshUsageData = useCallback(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  // Preset date range functions
  const setLast30Days = useCallback(() => {
    const range = creditUsageService.getLastNDaysRange(30);
    updateDateRange(range);
  }, [updateDateRange]);

  const setLast7Days = useCallback(() => {
    const range = creditUsageService.getLastNDaysRange(7);
    updateDateRange(range);
  }, [updateDateRange]);

  const setCurrentMonth = useCallback(() => {
    const range = creditUsageService.getCurrentMonthRange();
    updateDateRange(range);
  }, [updateDateRange]);

  const setPreviousMonth = useCallback(() => {
    const range = creditUsageService.getPreviousMonthRange();
    updateDateRange(range);
  }, [updateDateRange]);

  const setCustomRange = useCallback((start, end) => {
    const range = {
      start: typeof start === 'string' ? start : start.toISOString().split('T')[0],
      end: typeof end === 'string' ? end : end.toISOString().split('T')[0]
    };
    updateDateRange(range);
  }, [updateDateRange]);

  // Calculate total credits used
  const totalCreditsUsed = usageData?.totals?.totalCredits || 0;
  
  // Get usage by module
  const usageByModule = usageData?.results || [];

  return {
    usageData,
    loading,
    error,
    dateRange,
    totalCreditsUsed,
    usageByModule,
    refreshUsageData,
    setLast30Days,
    setLast7Days,
    setCurrentMonth,
    setPreviousMonth,
    setCustomRange,
    formatModuleName: creditUsageService.formatModuleName,
    getModuleColor: creditUsageService.getModuleColor
  };
};