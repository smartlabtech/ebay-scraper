import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setMobile } from '../store/slices/uiSlice';

export const useWindowSize = () => {
  const dispatch = useDispatch();
  
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [breakpoint, setBreakpoint] = useState('lg');

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setWindowSize({ width, height });

    // Tailwind CSS breakpoints
    let currentBreakpoint = 'xs';
    if (width >= 640) currentBreakpoint = 'sm';
    if (width >= 768) currentBreakpoint = 'md';
    if (width >= 1024) currentBreakpoint = 'lg';
    if (width >= 1280) currentBreakpoint = 'xl';
    if (width >= 1536) currentBreakpoint = '2xl';
    
    setBreakpoint(currentBreakpoint);

    // Update mobile state in Redux
    dispatch(setMobile(width < 768));
  }, [dispatch]);

  useEffect(() => {
    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Helper functions
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;
  const isLargeDesktop = windowSize.width >= 1280;

  const isBreakpoint = useCallback((bp) => {
    const breakpoints = {
      xs: windowSize.width < 640,
      sm: windowSize.width >= 640 && windowSize.width < 768,
      md: windowSize.width >= 768 && windowSize.width < 1024,
      lg: windowSize.width >= 1024 && windowSize.width < 1280,
      xl: windowSize.width >= 1280 && windowSize.width < 1536,
      '2xl': windowSize.width >= 1536
    };
    return breakpoints[bp] || false;
  }, [windowSize.width]);

  const isMinBreakpoint = useCallback((bp) => {
    const minBreakpoints = {
      xs: true,
      sm: windowSize.width >= 640,
      md: windowSize.width >= 768,
      lg: windowSize.width >= 1024,
      xl: windowSize.width >= 1280,
      '2xl': windowSize.width >= 1536
    };
    return minBreakpoints[bp] || false;
  }, [windowSize.width]);

  return {
    width: windowSize.width,
    height: windowSize.height,
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isBreakpoint,
    isMinBreakpoint
  };
};