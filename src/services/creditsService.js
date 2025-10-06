import axiosInstance from '../api/axios';

class CreditsService {
  constructor() {
    // Track ongoing requests to prevent duplicates
    this.balancePromise = null;
    this.overviewPromise = null;
  }
  // Helper function to fetch all transactions with pagination
  async fetchAllTransactions(params = {}, maxRecords = 300) {
    const allTransactions = [];
    let skip = 0;
    const limit = 100; // API maximum

    while (allTransactions.length < maxRecords) {
      try {
        const response = await this.getCreditsTransactions({
          ...params,
          limit,
          skip
        });

        const transactions = response.transactions || [];
        allTransactions.push(...transactions);

        // If we got less than limit, we've reached the end
        if (transactions.length < limit) {
          break;
        }

        skip += limit;
      } catch (error) {
        console.error('Error fetching paginated transactions:', error);
        break;
      }
    }

    return allTransactions.slice(0, maxRecords);
  }

  // Get current user's credit balance
  async getCreditBalance() {
    try {
      // Check if balance is already being fetched
      if (this.balancePromise) {
        console.log('Credit balance already being fetched, reusing existing request');
        return this.balancePromise;
      }

      // Create the request promise
      this.balancePromise = axiosInstance.get('/en/credit/balance')
        .then(response => response.data)
        .catch(error => {
          console.error('Error fetching credit balance:', error);
          throw error;
        });

      // Clean up after completion
      this.balancePromise.finally(() => {
        this.balancePromise = null;
      });

      return this.balancePromise;
    } catch (error) {
      console.error('Error in getCreditBalance:', error);
      throw error;
    }
  }

  // Get credits transactions
  async getCreditsTransactions(params = {}) {
    try {
      // Build query string manually to ensure proper encoding
      const queryParams = [];

      queryParams.push(`limit=${Math.min(params.limit || 50, 100)}`);
      queryParams.push(`skip=${params.skip || 0}`);

      if (params.userId) {
        queryParams.push(`userId=${params.userId}`);
      }

      if (params.type) {
        queryParams.push(`type=${params.type}`);
      }

      // Add date parameters with proper encoding
      if (params.startDate) {
        const startDate = new Date(params.startDate);
        startDate.setHours(0, 0, 0, 0);
        const encodedDate = startDate.toISOString().replace(/:/g, '%3A');
        queryParams.push(`startDate=${encodedDate}`);
      }

      if (params.endDate) {
        const endDate = new Date(params.endDate);
        endDate.setHours(23, 59, 59, 999);
        const encodedDate = endDate.toISOString().replace(/:/g, '%3A');
        queryParams.push(`endDate=${encodedDate}`);
      }

      const url = `/en/credit/transactions?${queryParams.join('&')}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Get all users' transactions for admin overview
  async getAllUsersTransactions(params = {}) {
    try {
      // For admin overview, we get all transactions (max 100 per request)
      const queryParams = {
        limit: Math.min(params.limit || 100, 100), // API max is 100
        skip: params.skip || 0
      };

      const response = await axiosInstance.get('/en/credit/transactions', { params: queryParams });
      return response.data;
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      throw error;
    }
  }

  // Get credits overview for admin dashboard
  async getCreditsOverview() {
    try {
      // Check if overview is already being fetched
      if (this.overviewPromise) {
        console.log('Credits overview already being fetched, reusing existing request');
        return this.overviewPromise;
      }

      // Create the overview promise
      this.overviewPromise = (async () => {
        // Get current balance and fetch more transactions for better overview
        const [balanceData, transactions] = await Promise.all([
          this.getCreditBalance(),
          this.fetchAllTransactions({}, 200) // Get up to 200 recent transactions
        ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Calculate metrics from transactions
      let totalCreditsUsed = 0;
      let creditsUsedToday = 0;
      let creditsUsedThisMonth = 0;
      const userCredits = {};

      transactions.forEach(tx => {
        const txDate = new Date(tx.createdAt);
        if (tx.type === 'deduction' && tx.amount < 0) {
          const amount = Math.abs(tx.amount);
          totalCreditsUsed += amount;

          if (txDate >= today) {
            creditsUsedToday += amount;
          }
          if (txDate >= thisMonth) {
            creditsUsedThisMonth += amount;
          }

          // Track per user
          if (!userCredits[tx.userId]) {
            userCredits[tx.userId] = 0;
          }
          userCredits[tx.userId] += amount;
        }
      });

      const totalUsers = Object.keys(userCredits).length;
      const averageCreditsPerUser = totalUsers > 0 ? Math.round(totalCreditsUsed / totalUsers) : 0;

        return {
          totalCreditsUsed,
          creditsUsedToday,
          creditsUsedThisMonth,
          totalUsers,
          averageCreditsPerUser,
          totalCreditsAvailable: balanceData.balance + totalCreditsUsed,
          currentBalance: balanceData.balance
        };
      })();

      // Clean up after completion
      this.overviewPromise.finally(() => {
        this.overviewPromise = null;
      });

      return this.overviewPromise;
    } catch (error) {
      console.error('Error fetching credits overview:', error);
      // Return default values on error
      return {
        totalCreditsUsed: 0,
        creditsUsedToday: 0,
        creditsUsedThisMonth: 0,
        totalUsers: 0,
        averageCreditsPerUser: 0,
        totalCreditsAvailable: 0,
        currentBalance: 0
      };
    }
  }

  // Get credits usage by date
  async getCreditsUsageByDate(startDate, endDate) {
    try {
      // Fetch all transactions within date range using pagination
      const allTransactions = await this.fetchAllTransactions({
        startDate,
        endDate
      }, 500); // Get up to 500 transactions for date range

      const usageByDate = {};

      allTransactions.forEach(tx => {
        if (tx.type === 'deduction' && tx.amount < 0) {
          const date = new Date(tx.createdAt).toISOString().split('T')[0];
          if (!usageByDate[date]) {
            usageByDate[date] = {
              date,
              creditsUsed: 0,
              transactionCount: 0
            };
          }
          usageByDate[date].creditsUsed += Math.abs(tx.amount);
          usageByDate[date].transactionCount++;
        }
      });

      // Convert to array and sort by date
      return Object.values(usageByDate).sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Error fetching usage by date:', error);
      return [];
    }
  }

  // Get top users by credit usage
  async getTopUsersByCredits(limit = 10) {
    try {
      // Fetch more transactions for better top users calculation
      const transactions = await this.fetchAllTransactions({}, 300);
      const userCredits = {};
      let totalCredits = 0;

      transactions.forEach(tx => {
        if (tx.type === 'deduction' && tx.amount < 0) {
          const amount = Math.abs(tx.amount);
          if (!userCredits[tx.userId]) {
            userCredits[tx.userId] = 0;
          }
          userCredits[tx.userId] += amount;
          totalCredits += amount;
        }
      });

      // Sort users by credits used and get top N
      const topUsers = Object.entries(userCredits)
        .map(([userId, creditsUsed]) => ({
          userId,
          userName: `User ${userId.substring(0, 6)}`, // Use partial ID as name since API doesn't provide names
          creditsUsed,
          percentage: totalCredits > 0 ? (creditsUsed / totalCredits) * 100 : 0
        }))
        .sort((a, b) => b.creditsUsed - a.creditsUsed)
        .slice(0, limit);

      return topUsers;
    } catch (error) {
      console.error('Error fetching top users:', error);
      return [];
    }
  }

  // Get credits by action type
  async getCreditsByAction() {
    try {
      // Fetch more transactions for better action categorization
      const transactions = await this.fetchAllTransactions({}, 300);
      const actionStats = {};
      let totalCredits = 0;

      transactions.forEach(tx => {
        if (tx.type === 'deduction' && tx.amount < 0) {
          const amount = Math.abs(tx.amount);
          let action = 'other';

          // Determine action type from description or metadata
          if (tx.description) {
            if (tx.description.includes('Brand message generation')) {
              action = 'brand_message_generation';
            } else if (tx.description.includes('Copy generation')) {
              action = 'copy_generation';
            } else if (tx.description.includes('Split testing')) {
              action = 'split_testing';
            } else if (tx.description.includes('Project version')) {
              action = 'project_enhancement';
            }
          }

          if (!actionStats[action]) {
            actionStats[action] = { action, credits: 0, count: 0 };
          }
          actionStats[action].credits += amount;
          actionStats[action].count++;
          totalCredits += amount;
        }
      });

      // Convert to array and calculate percentages
      return Object.values(actionStats).map(stat => ({
        ...stat,
        percentage: totalCredits > 0 ? (stat.credits / totalCredits) * 100 : 0
      })).sort((a, b) => b.credits - a.credits);
    } catch (error) {
      console.error('Error fetching credits by action:', error);
      return [];
    }
  }
}

const creditsService = new CreditsService();
export default creditsService;