import axiosInstance from '../api/axios';

class CreditUsageService {
  constructor() {
    // Track ongoing requests to prevent duplicates
    this.aiUsagePromises = new Map();
  }
  /**
   * Get AI usage report for a date range grouped by module
   * @param {Object} params - Query parameters
   * @param {string} params.start - Start date (YYYY-MM-DD)
   * @param {string} params.end - End date (YYYY-MM-DD)
   * @param {string} params.groupBy - Group by parameter (default: 'module')
   * @returns {Promise<Object>} - AI usage report data
   */
  async getAIUsageReport({ start, end, groupBy = 'module' }) {
    try {
      // Create a unique key for this specific request
      const cacheKey = `${groupBy}_${start}_${end}`;

      // Check if this exact request is already in progress
      if (this.aiUsagePromises.has(cacheKey)) {
        console.log(`AI usage report already being fetched for ${start} to ${end}, reusing existing request`);
        return this.aiUsagePromises.get(cacheKey);
      }

      // Create the request promise
      const usagePromise = axiosInstance.get('/en/credit/ai-usage-report', {
        params: {
          groupBy,
          start,
          end
        }
      }).then(response => {
        // The response is directly in response.data
        const responseData = response.data;

        return {
          results: responseData.results || [],
          totals: responseData.totals || {
            totalTokens: 0,
            totalCredits: 0,
            transactionCount: 0
          },
          filters: responseData.filters || {},
          tokenToCreditRate: responseData.tokenToCreditRate || 1
        };
      }).catch(error => {
        if (error.response?.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (error.response?.status === 403) {
          throw new Error('You do not have permission to view credit usage');
        } else if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error('Failed to fetch credit usage report. Please try again.');
      }).finally(() => {
        // Clean up after completion
        this.aiUsagePromises.delete(cacheKey);
      });

      // Store the promise
      this.aiUsagePromises.set(cacheKey, usagePromise);

      return usagePromise;
    } catch (error) {
      console.error('Error in getAIUsageReport:', error);
      throw error;
    }
  }

  /**
   * Calculate date range for last N days
   * @param {number} days - Number of days to go back
   * @returns {Object} - Object with start and end dates
   */
  getLastNDaysRange(days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  }

  /**
   * Get current month date range
   * @returns {Object} - Object with start and end dates
   */
  getCurrentMonthRange() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  }

  /**
   * Get previous month date range
   * @returns {Object} - Object with start and end dates
   */
  getPreviousMonthRange() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  }

  /**
   * Format module name for display
   * @param {string} module - Module name from API
   * @returns {string} - Formatted module name
   */
  formatModuleName(module) {
    const moduleNames = {
      brandMessage: 'Brand Messages',
      product: 'Product Descriptions',
      project: 'Project Generation',
      copy: 'Copy Generation',
      splitTest: 'Split Tests'
    };
    
    return moduleNames[module] || module;
  }

  /**
   * Get module color for UI
   * @param {string} module - Module name
   * @returns {string} - Color name for Mantine theme
   */
  getModuleColor(module) {
    const moduleColors = {
      brandMessage: 'blue',
      product: 'green',
      project: 'violet',
      copy: 'orange',
      splitTest: 'pink'
    };
    
    return moduleColors[module] || 'gray';
  }
}

// Create and export service instance
const creditUsageService = new CreditUsageService();
export default creditUsageService;