/**
 * Responsive Design Helpers
 * Utilities for consistent responsive behavior across the application
 */

import { theme2zpoint } from './theme/2zpointTheme'

const { breakpoints } = theme2zpoint

// Media query helpers
export const mediaQueries = {
  // Mobile first queries
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,

  // Max width queries (desktop first)
  xsDown: `@media (max-width: ${breakpoints.xs})`,
  smDown: `@media (max-width: ${breakpoints.sm})`,
  mdDown: `@media (max-width: ${breakpoints.md})`,
  lgDown: `@media (max-width: ${breakpoints.lg})`,
  xlDown: `@media (max-width: ${breakpoints.xl})`,

  // Range queries
  xsToSm: `@media (min-width: ${breakpoints.xs}) and (max-width: ${breakpoints.sm})`,
  smToMd: `@media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md})`,
  mdToLg: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  lgToXl: `@media (min-width: ${breakpoints.lg}) and (max-width: ${breakpoints.xl})`,

  // Common device queries
  mobile: `@media (max-width: ${breakpoints.md})`,
  tablet: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  desktop: `@media (min-width: ${breakpoints.lg})`,
  smallMobile: `@media (max-width: ${breakpoints.xs})`,

  // Orientation queries
  landscape: '@media (orientation: landscape)',
  portrait: '@media (orientation: portrait)',

  // High resolution screens
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',

  // Print
  print: '@media print'
}

// Responsive value helper
export const getResponsiveValue = (values, currentBreakpoint = 'base') => {
  // values can be an object like { base: '16px', md: '20px', lg: '24px' }
  if (typeof values !== 'object') return values

  const breakpointOrder = ['base', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint)

  // Find the value for current breakpoint or fall back to smaller ones
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i]
    if (values[bp] !== undefined) {
      return values[bp]
    }
  }

  return values.base || values
}

// Responsive padding helper
export const getResponsivePadding = (isMobile, isTablet) => {
  if (isMobile) {
    return {
      container: '16px',
      section: '40px 16px',
      card: '24px',
      button: '12px 24px'
    }
  }

  if (isTablet) {
    return {
      container: '24px',
      section: '60px 24px',
      card: '32px',
      button: '14px 32px'
    }
  }

  return {
    container: '20px',
    section: '80px 20px',
    card: '40px',
    button: '16px 40px'
  }
}

// Responsive font sizes
export const getResponsiveFontSize = (size, isMobile) => {
  const fontSizeMap = {
    hero: isMobile ? 'clamp(1.75rem, 4vw, 2rem)' : 'clamp(2.5rem, 5vw, 3.5rem)',
    title: isMobile ? 'clamp(1.5rem, 3.5vw, 1.75rem)' : 'clamp(2rem, 4vw, 2.5rem)',
    subtitle: isMobile ? '1rem' : '1.25rem',
    body: isMobile ? '0.9rem' : '1rem',
    small: isMobile ? '0.75rem' : '0.875rem'
  }

  return fontSizeMap[size] || size
}

// Responsive grid columns
export const getResponsiveColumns = (defaultCols, isMobile, isTablet) => {
  if (isMobile) return 1
  if (isTablet) return Math.min(2, defaultCols)
  return defaultCols
}

// Responsive spacing
export const getResponsiveSpacing = (size, isMobile) => {
  const spacingMap = {
    xs: isMobile ? '2px' : '4px',
    sm: isMobile ? '4px' : '8px',
    md: isMobile ? '12px' : '16px',
    lg: isMobile ? '20px' : '24px',
    xl: isMobile ? '28px' : '32px',
    '2xl': isMobile ? '36px' : '40px',
    '3xl': isMobile ? '40px' : '48px',
    '4xl': isMobile ? '48px' : '60px',
    '5xl': isMobile ? '60px' : '80px'
  }

  return spacingMap[size] || size
}

// Responsive styles generator
export const generateResponsiveStyles = (styles) => {
  // Takes an object with breakpoint keys and generates CSS
  let css = ''

  Object.entries(styles).forEach(([breakpoint, style]) => {
    if (breakpoint === 'base') {
      // Base styles (no media query)
      css += styleObjectToCSS(style)
    } else if (mediaQueries[breakpoint]) {
      // Wrap in media query
      css += `${mediaQueries[breakpoint]} { ${styleObjectToCSS(style)} }`
    }
  })

  return css
}

// Helper to convert style object to CSS string
const styleObjectToCSS = (styles) => {
  return Object.entries(styles)
    .map(([prop, value]) => {
      const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssProp}: ${value};`
    })
    .join(' ')
}

// Container width helper
export const getContainerWidth = (size = 'xl') => {
  const sizes = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%'
  }

  return sizes[size] || sizes.xl
}

// Responsive visibility helpers
export const visibilityHelpers = {
  // Hide on mobile
  hideOnMobile: {
    [`@media (max-width: ${breakpoints.md})`]: {
      display: 'none'
    }
  },

  // Show only on mobile
  showOnlyMobile: {
    [`@media (min-width: ${breakpoints.md})`]: {
      display: 'none'
    }
  },

  // Hide on desktop
  hideOnDesktop: {
    [`@media (min-width: ${breakpoints.lg})`]: {
      display: 'none'
    }
  },

  // Show only on desktop
  showOnlyDesktop: {
    [`@media (max-width: ${breakpoints.lg})`]: {
      display: 'none'
    }
  }
}

// Responsive flex/grid helpers
export const layoutHelpers = {
  // Stack on mobile, row on desktop
  stackOnMobile: {
    display: 'flex',
    flexDirection: 'column',
    [`@media (min-width: ${breakpoints.md})`]: {
      flexDirection: 'row'
    }
  },

  // Responsive grid
  responsiveGrid: (cols = { base: 1, md: 2, lg: 3 }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols.base || 1}, 1fr)`,
    [`@media (min-width: ${breakpoints.md})`]: cols.md && {
      gridTemplateColumns: `repeat(${cols.md}, 1fr)`
    },
    [`@media (min-width: ${breakpoints.lg})`]: cols.lg && {
      gridTemplateColumns: `repeat(${cols.lg}, 1fr)`
    }
  })
}

// Export all helpers
export const responsiveUtils = {
  mediaQueries,
  getResponsiveValue,
  getResponsivePadding,
  getResponsiveFontSize,
  getResponsiveColumns,
  getResponsiveSpacing,
  generateResponsiveStyles,
  getContainerWidth,
  visibilityHelpers,
  layoutHelpers
}

export default responsiveUtils