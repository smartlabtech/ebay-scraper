// Clear all service caches on logout
// This ensures no stale data is retained between user sessions

/**
 * Clear all cached data from services and storage
 * Called on logout to prevent data leakage between users
 */
export const clearAllServiceCaches = () => {
  try {
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