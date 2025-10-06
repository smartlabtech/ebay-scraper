import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { routeConfig, findRoute } from '../config/routes';

// Empty array constant to avoid creating new references
const EMPTY_ARRAY = [];

export const useBreadcrumbs = () => {
  const location = useLocation();
  const params = useParams();
  
  // Get data from Redux store that might be needed for dynamic breadcrumbs
  const currentProject = useSelector(state => state.projects?.currentProject);
  const messages = useSelector(state => state.messages?.messages ?? EMPTY_ARRAY);
  const copies = useSelector(state => state.copy?.copies ?? EMPTY_ARRAY);
  const products = useSelector(state => state.products?.products ?? EMPTY_ARRAY);
  const currentProduct = useSelector(state => state.products?.currentProduct);
  
  const breadcrumbs = useMemo(() => {
    const pathname = location.pathname;
    
    // Special case for landing page
    if (pathname === '/') {
      return { title: 'Home', breadcrumbs: [] };
    }
    
    // Find the route configuration
    const routeMatch = findRoute(pathname);
    if (!routeMatch) {
      return { title: '', breadcrumbs: [] };
    }
    
    const { config, params: routeParams } = routeMatch;
    
    // Prepare data object for dynamic titles/breadcrumbs
    // Ensure arrays exist before calling find
    const data = {
      project: currentProject,
      message: messages?.find?.(m => m.id === (routeParams.messageId || routeParams.id)),
      copy: copies?.find?.(c => c.id === (routeParams.copyId || routeParams.id)),
      product: currentProduct || products?.find?.(p => p._id === (routeParams.id)),
      version: currentProject?.versions?.find(v => v._id === routeParams.versionId)
    };
    
    // Build breadcrumb trail
    const trail = [];
    let currentRoute = routeMatch;
    
    while (currentRoute) {
      const { pattern, config, params: currentParams } = currentRoute;
      
      // Get title and breadcrumb text
      const title = typeof config.title === 'function' 
        ? config.title(currentParams, data) 
        : config.title;
        
      const breadcrumbText = typeof config.breadcrumb === 'function'
        ? config.breadcrumb(currentParams, data)
        : config.breadcrumb;
      
      if (breadcrumbText) {
        // Replace params in pattern to create actual path
        let href = pattern;
        Object.entries(currentParams).forEach(([key, value]) => {
          href = href.replace(`:${key}`, value);
        });
        
        trail.unshift({
          label: breadcrumbText,
          href: trail.length === 0 ? null : href // Last item is not clickable
        });
      }
      
      // Move to parent route
      if (config.parent) {
        const parentPattern = config.parent;
        const parentConfig = routeConfig[parentPattern];
        
        if (parentConfig) {
          // Try to match parent pattern with current params
          let parentPath = parentPattern;
          Object.entries(currentParams).forEach(([key, value]) => {
            parentPath = parentPath.replace(`:${key}`, value);
          });
          
          currentRoute = {
            pattern: parentPattern,
            config: parentConfig,
            params: currentParams
          };
        } else {
          currentRoute = null;
        }
      } else {
        currentRoute = null;
      }
    }
    
    // Get page title
    const pageTitle = typeof config.title === 'function'
      ? config.title(routeParams, data)
      : config.title;
    
    return { title: pageTitle, breadcrumbs: trail };
  }, [location.pathname, params, currentProject, messages, copies, products, currentProduct]);
  
  return breadcrumbs;
};