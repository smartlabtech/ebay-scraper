export const routeConfig = {
  '/': {
    title: 'eBay Store Manager',
    breadcrumb: null // Redirects to control panel
  },
  '/login': {
    title: 'Login',
    breadcrumb: 'Login'
  },
  '/forgot-password': {
    title: 'Forgot Password',
    breadcrumb: 'Forgot Password'
  },
  '/verify-email': {
    title: 'Verify Email',
    breadcrumb: 'Verify Email'
  },
  '/reset-password': {
    title: 'Reset Password',
    breadcrumb: 'Reset Password'
  },
  '/control': {
    title: 'Dashboard',
    breadcrumb: 'Dashboard'
  },
  '/control/stores': {
    title: 'Stores',
    breadcrumb: 'Stores',
    parent: '/control'
  },
  '/control/stores/new': {
    title: 'Add New Store',
    breadcrumb: 'New Store',
    parent: '/control/stores'
  },
  '/control/stores/:id': {
    title: (params, data) => data?.store?.name || 'Store Details',
    breadcrumb: (params, data) => data?.store?.name || 'Loading...',
    parent: '/control/stores',
    dataLoader: 'store'
  },
  '/control/stores/edit/:id': {
    title: 'Edit Store',
    breadcrumb: 'Edit',
    parent: '/control/stores/:id'
  },
  '/control/stores/import': {
    title: 'Import Stores',
    breadcrumb: 'Import',
    parent: '/control/stores'
  },
  '/control/stores/analytics': {
    title: 'Store Analytics',
    breadcrumb: 'Analytics',
    parent: '/control/stores'
  }
};

// Helper function to match a pathname to a route pattern
export const matchRoute = (pathname, pattern) => {
  // Convert route pattern to regex
  const regexPattern = pattern
    .replace(/:[^/]+/g, '([^/]+)') // Replace :param with regex group
    .replace(/\//g, '\\/'); // Escape forward slashes

  const regex = new RegExp(`^${regexPattern}$`);
  const match = pathname.match(regex);

  if (!match) return null;

  // Extract params
  const paramNames = (pattern.match(/:[^/]+/g) || []).map(p => p.slice(1));
  const params = {};

  paramNames.forEach((name, index) => {
    params[name] = match[index + 1];
  });

  return params;
};

// Find the best matching route for a pathname
export const findRoute = (pathname) => {
  // Try exact match first
  if (routeConfig[pathname]) {
    return { pattern: pathname, config: routeConfig[pathname], params: {} };
  }

  // Try pattern matching
  for (const [pattern, config] of Object.entries(routeConfig)) {
    const params = matchRoute(pathname, pattern);
    if (params) {
      return { pattern, config, params };
    }
  }

  return null;
};