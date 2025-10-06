import { createContext, useContext, useState, useCallback } from 'react';
import { LoadingOverlay, Box, Text, Loader, Stack } from '@mantine/core';

// Unified loading overlay configuration
const LOADING_CONFIG = {
  overlayProps: {
    radius: "sm",
    blur: 2,
    style: {
      background: 'rgba(255, 255, 255, 0.85)'
    }
  },
  loaderProps: {
    color: 'violet',
    type: 'dots',
    size: 'xl'  // Bigger size for better visibility
  },
  styles: {
    root: { position: 'fixed', inset: 0 },
    overlay: { position: 'fixed', inset: 0 },
    loader: { position: 'fixed', top: '35%', left: '50%', transform: 'translateX(-50%)' }
  }
};

// Create the context
const LoadingContext = createContext({
  showLoading: () => {},
  hideLoading: () => {},
  isLoading: false,
  loadingMessage: ''
});

// Custom hook to use the loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

// Provider component
export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [loadingMessage, setLoadingMessage] = useState('');

  const showLoading = useCallback((key = 'default', message = 'BrandBanda...') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: true
    }));
    setLoadingMessage(message || 'BrandBanda...');  // Ensure message is never empty
  }, []);

  const hideLoading = useCallback((key = 'default') => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
    
    // Clear message if no more loading states
    setTimeout(() => {
      setLoadingStates(current => {
        if (Object.keys(current).length === 0) {
          setLoadingMessage('');
        }
        return current;
      });
    }, 100);
  }, []);

  const isLoading = Object.keys(loadingStates).length > 0;

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading, loadingMessage, loadingStates }}>
      <Box pos="relative" style={{ minHeight: '100vh' }}>
        <LoadingOverlay 
          visible={isLoading} 
          zIndex={9999} 
          overlayProps={LOADING_CONFIG.overlayProps}
          styles={LOADING_CONFIG.styles}
          loaderProps={{
            ...LOADING_CONFIG.loaderProps,
            children: (
              <Stack align="center" spacing="md">
                <Loader color="violet" type="dots" size="xl" />
                <Text size="lg" fw={600} c="gray.8">
                  {loadingMessage || 'BrandBanda...'}
                </Text>
              </Stack>
            )
          }}
        />
        {children}
      </Box>
    </LoadingContext.Provider>
  );
};

// Higher-order function to wrap async functions with loading
export const withLoading = (asyncFn, loadingKey = 'default', message = 'Processing...') => {
  return async (...args) => {
    const { showLoading, hideLoading } = useLoading();
    try {
      showLoading(loadingKey, message);
      const result = await asyncFn(...args);
      return result;
    } finally {
      hideLoading(loadingKey);
    }
  };
};

// Standalone loading component for initial app loading (before context is available)
// This is only used in App.jsx for the initial page loader
// Uses the same unified LOADING_CONFIG
export const AppLoadingOverlay = ({ visible = true, message = 'Loading BrandBanda...' }) => {
  if (!visible) return null;
  
  return (
    <LoadingOverlay 
      visible={true}
      zIndex={9999}
      overlayProps={LOADING_CONFIG.overlayProps}
      styles={LOADING_CONFIG.styles}
      loaderProps={{
        ...LOADING_CONFIG.loaderProps,
        children: (
          <Stack align="center" spacing="md">
            <Loader color="violet" type="dots" size="xl" />
            <Text size="xl" fw={600} c="gray.8">
              {message || 'BrandBanda...'}
            </Text>
          </Stack>
        )
      }}
    />
  );
};