/**
 * Unified Theme Configuration
 * Single source of truth for all theme values across the application
 * Combines Mantine configuration with custom 2zpoint design system
 */

import { mantineColors, colors, gradients } from './colors'
import { theme2zpoint } from './2zpointTheme'

// Export the unified theme configuration
export const unifiedTheme = {
  // Core brand colors
  colors: {
    primary: {
      main: '#1e40af',    // 2zpoint blue
      dark: '#1e3a8a',
      light: '#3b82f6'
    },
    secondary: {
      main: '#059669',    // 2zpoint green
      dark: '#047857',
      light: '#10b981'
    },
    // Full color palette
    palette: colors,
    // Mantine-formatted colors
    mantine: mantineColors
  },

  // Typography from 2zpoint theme
  typography: theme2zpoint.typography,

  // Spacing from 2zpoint theme
  spacing: theme2zpoint.spacing,

  // Border radius from 2zpoint theme
  borderRadius: theme2zpoint.borderRadius,

  // Shadows from 2zpoint theme
  shadows: theme2zpoint.shadows,

  // Transitions from 2zpoint theme
  transitions: theme2zpoint.transitions,

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #1e40af, #059669)',
    blue: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    green: 'linear-gradient(135deg, #10b981, #059669)',
    hero: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)',
    ...gradients
  },

  // Mantine-specific configuration
  mantine: {
    colors: mantineColors,
    primaryColor: 'blue',
    primaryShade: 8,
    defaultRadius: 'md',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    headings: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 800
    }
  },

  // Breakpoints (matching Mantine's defaults)
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em'
  }
}

// Helper functions
export const getColor = (colorPath) => {
  const paths = colorPath.split('.')
  let value = unifiedTheme.colors
  for (const path of paths) {
    value = value[path]
  }
  return value
}

export const getSpacing = (size) => {
  return unifiedTheme.spacing[size] || size
}

export const getShadow = (type) => {
  return unifiedTheme.shadows[type] || unifiedTheme.shadows.md
}

// Export everything for convenience
export default unifiedTheme