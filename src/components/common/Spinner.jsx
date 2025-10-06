import React, { useEffect } from 'react';
import { useLoading } from '../../contexts/LoadingContext';

// Legacy Spinner component - redirects to global loading
// This component is kept for backward compatibility but uses the global loading system
const Spinner = ({ 
  size = 'md', 
  color = 'violet',
  fullScreen = false,
  centered = false,
  className = '',
  message = 'Loading...'
}) => {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    // Show global loading when Spinner is mounted
    if (fullScreen) {
      showLoading('spinner', message);
    }
    
    // Hide loading when Spinner is unmounted
    return () => {
      if (fullScreen) {
        hideLoading('spinner');
      }
    };
  }, [fullScreen, message, showLoading, hideLoading]);

  // For fullScreen, the global loading overlay handles it
  if (fullScreen) {
    return null; // Global overlay will be shown
  }
  
  // For inline/centered loading, we can't use global overlay
  // So just return null - components should use loading states instead
  return null;
};

export default Spinner;