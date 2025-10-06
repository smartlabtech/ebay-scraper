export const routeConfig = {
  '/': {
    title: 'Home',
    breadcrumb: null // No breadcrumbs on landing page
  },
  '/dashboard': {
    title: 'Dashboard',
    breadcrumb: 'Dashboard'
  },
  '/projects': {
    title: 'Projects',
    breadcrumb: 'Projects'
  },
  '/projects/create': {
    title: 'Create Project',
    breadcrumb: 'Create',
    parent: '/projects'
  },
  '/projects/:projectId': {
    title: (params, data) => data?.project?.name || 'Project Details',
    breadcrumb: (params, data) => data?.project?.name || 'Loading...',
    parent: '/projects',
    dataLoader: 'project' // Indicates this route needs project data
  },
  '/projects/:projectId/edit': {
    title: 'Edit Project',
    breadcrumb: 'Edit',
    parent: '/projects'
  },
  '/projects/:projectId/versions/new': {
    title: 'New Version',
    breadcrumb: 'New Version',
    parent: '/projects/:projectId'
  },
  '/projects/:projectId/versions/:versionId': {
    title: (params, data) => data?.version?.product || 'Version Details',
    breadcrumb: (params, data) => `v${data?.version?.version || '...'}`,
    parent: '/projects/:projectId',
    dataLoader: 'version'
  },
  '/projects/:projectId/versions/:versionId/edit': {
    title: 'Edit Version',
    breadcrumb: 'Edit',
    parent: '/projects/:projectId/versions/:versionId'
  },
  '/brand-messages': {
    title: 'Brand Messages',
    breadcrumb: 'Brand Messages'
  },
  '/brand-messages/new': {
    title: 'Create Brand Message',
    breadcrumb: 'Create',
    parent: '/brand-messages'
  },
  '/brand-messages/:id': {
    title: (params, data) => data?.message?.title || 'Message Details',
    breadcrumb: (params) => params.id,
    parent: '/brand-messages',
    dataLoader: 'message'
  },
  '/brand-messages/:id/edit': {
    title: 'Edit Brand Message',
    breadcrumb: 'Edit',
    parent: '/brand-messages/:id'
  },
  '/copies': {
    title: 'Copies',
    breadcrumb: 'Copies'
  },
  '/copies/new': {
    title: 'Generate Copy',
    breadcrumb: 'Generate',
    parent: '/copies'
  },
  '/copies/:copyId': {
    title: (params, data) => data?.copy?.title || 'Copy Details',
    breadcrumb: (params) => params.copyId,
    parent: '/copies',
    dataLoader: 'copy'
  },
  '/copies/:copyId/edit': {
    title: 'Edit Copy',
    breadcrumb: 'Edit',
    parent: '/copies/:copyId'
  },
  '/products': {
    title: 'Products',
    breadcrumb: 'Products'
  },
  '/products/new': {
    title: 'Create Product',
    breadcrumb: 'Create',
    parent: '/products'
  },
  '/products/:id': {
    title: (params, data) => data?.product?.shortName || 'Product Details',
    breadcrumb: (params) => params.id,
    parent: '/products',
    dataLoader: 'product'
  },
  '/products/:id/edit': {
    title: 'Edit Product',
    breadcrumb: 'Edit',
    parent: '/products/:id'
  },
  '/settings': {
    title: 'Settings',
    breadcrumb: 'Settings'
  },
  '/settings/account': {
    title: 'Account Settings',
    breadcrumb: 'Account',
    parent: '/settings'
  },
  '/settings/billing': {
    title: 'Billing',
    breadcrumb: 'Billing',
    parent: '/settings'
  },
  '/settings/preferences': {
    title: 'Preferences',
    breadcrumb: 'Preferences',
    parent: '/settings'
  },
  '/settings/team': {
    title: 'Team',
    breadcrumb: 'Team',
    parent: '/settings'
  },
  '/pricing': {
    title: 'Pricing',
    breadcrumb: 'Pricing'
  },
  '/auth/login': {
    title: 'Login',
    breadcrumb: 'Login'
  },
  '/auth/forgot-password': {
    title: 'Forgot Password',
    breadcrumb: 'Forgot Password'
  },
  '/analytics': {
    title: 'Analytics',
    breadcrumb: 'Analytics'
  },
  '/analytics/performance': {
    title: 'Performance Analytics',
    breadcrumb: 'Performance',
    parent: '/analytics'
  },
  '/analytics/engagement': {
    title: 'Engagement Analytics',
    breadcrumb: 'Engagement',
    parent: '/analytics'
  },
  '/payment/success': {
    title: 'Payment Successful',
    breadcrumb: 'Payment Success'
  },
  '/payment/cancel': {
    title: 'Payment Cancelled',
    breadcrumb: 'Payment Cancelled'
  },
  '/payment/failure': {
    title: 'Payment Failed',
    breadcrumb: 'Payment Failed'
  },
  
  // Legal Pages
  '/terms': {
    title: 'Terms of Service',
    breadcrumb: 'Terms'
  },
  '/privacy': {
    title: 'Privacy Policy',
    breadcrumb: 'Privacy'
  },
  '/cookies': {
    title: 'Cookie Policy',
    breadcrumb: 'Cookies'
  },
  '/legal': {
    title: 'Legal',
    breadcrumb: 'Legal'
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