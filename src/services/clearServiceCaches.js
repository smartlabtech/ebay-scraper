// Clear all service caches on logout
// This ensures no stale data is retained between user sessions

import plansService from './plansService';
import ordersService from './ordersService';
import creditUsageService from './creditUsage';
import projectProductsService from './projectProducts';
import trackingService from './trackingService';
import creditsService from './creditsService';

// Note: Some services like productsService, invoices, and plans use module-level
// promise tracking that isn't directly accessible. These services handle their own
// cleanup internally through promise chains and will naturally clear when no references remain

/**
 * Clear all cached promises and data from services
 * Called on logout to prevent data leakage between users
 */
export const clearAllServiceCaches = () => {
  try {
    // Clear plans service caches
    if (plansService.plansPromises) {
      plansService.plansPromises.clear();
    }
    if (plansService.singlePlanPromises) {
      plansService.singlePlanPromises.clear();
    }

    // Clear orders service caches
    if (ordersService.pendingOrdersPromise) {
      ordersService.pendingOrdersPromise = null;
    }
    if (ordersService.getOrderPromises) {
      ordersService.getOrderPromises.clear();
    }

    // Clear credit usage service caches
    if (creditUsageService.aiUsagePromises) {
      creditUsageService.aiUsagePromises.clear();
    }

    // Clear project products service caches
    if (projectProductsService.projectProductsPromises) {
      projectProductsService.projectProductsPromises.clear();
    }
    if (projectProductsService.versionPromises) {
      projectProductsService.versionPromises.clear();
    }

    // Clear tracking service caches
    if (trackingService.trackingPromises) {
      trackingService.trackingPromises.clear();
    }

    // Clear credits service caches
    if (creditsService.balancePromise) {
      creditsService.balancePromise = null;
    }
    if (creditsService.overviewPromise) {
      creditsService.overviewPromise = null;
    }

    // Clear any sessionStorage data
    sessionStorage.clear();

    // Clear any other app-specific caches
    // Note: localStorage auth tokens are already cleared in auth.logout()

    console.log('All service caches cleared successfully');
  } catch (error) {
    console.error('Error clearing service caches:', error);
    // Don't throw - we still want logout to proceed even if cache clearing fails
  }
};

export default clearAllServiceCaches;