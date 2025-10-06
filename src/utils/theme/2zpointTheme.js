/**
 * 2zpoint Brand Theme Configuration
 * Core design system based on Landing1 page design
 */

// Brand Colors
export const brandColors = {
  // Primary colors (Blue theme)
  primary: {
    main: '#1e40af',    // Main blue
    dark: '#1e3a8a',    // Darker blue for hover
    light: '#3b82f6',   // Lighter blue
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },

  // Secondary colors (Green accent)
  secondary: {
    main: '#059669',
    light: '#10b981',
    dark: '#047857',
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b'
  },

  // Neutral colors
  neutral: {
    white: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    black: '#000000'
  },

  // Semantic colors
  semantic: {
    success: '#22c55e',
    successLight: '#86efac',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    danger: '#dc2626',
    dangerLight: '#fca5a5',
    info: '#0ea5e9',
    infoLight: '#7dd3fc'
  },

  // Background gradients
  gradients: {
    hero: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%)',
    primary: 'linear-gradient(135deg, #1e40af, #059669)',
    blue: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    success: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
    danger: 'linear-gradient(135deg, #fee2e2, #fecaca)'
  }
}

// Typography
export const typography = {
  // Font families
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
  },

  // Font sizes
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    md: '1.1rem',      // 17.6px
    lg: '1.25rem',     // 20px
    xl: '1.5rem',      // 24px
    '2xl': '1.75rem',  // 28px
    '3xl': '2rem',     // 32px
    '4xl': '2.5rem',   // 40px
    '5xl': '3rem',     // 48px
    '6xl': '3.5rem',   // 56px
    hero: 'clamp(2.5rem, 5vw, 3.5rem)',
    heroMobile: 'clamp(1.75rem, 4vw, 2rem)'
  },

  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  },

  // Line heights
  lineHeight: {
    tight: 1,
    snug: 1.1,
    normal: 1.2,
    relaxed: 1.6,
    loose: 1.8
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
}

// Spacing system
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px',
  '3xl': '48px',
  '4xl': '60px',
  '5xl': '80px',
  '6xl': '100px'
}

// Border radius
export const borderRadius = {
  none: '0',
  sm: '4px',
  base: '8px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px'
}

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 30px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 40px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
  primary: '0 10px 30px rgba(30, 64, 175, 0.2)',
  success: '0 10px 30px rgba(34, 197, 94, 0.2)',
  danger: '0 10px 30px rgba(220, 38, 38, 0.2)',
  glow: {
    primary: '0 0 20px rgba(30, 64, 175, 0.3)',
    secondary: '0 0 20px rgba(5, 150, 105, 0.3)'
  }
}

// Transitions
export const transitions = {
  fast: '0.15s ease',
  base: '0.3s ease',
  slow: '0.5s ease',
  slower: '0.8s ease',
  // Specific transitions
  transform: 'transform 0.3s ease',
  shadow: 'box-shadow 0.3s ease',
  all: 'all 0.3s ease',
  colors: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease'
}

// Breakpoints
export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

// Z-index layers
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  overlay: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  notification: 800,
  maximum: 9999
}

// Animation keyframes
export const animations = {
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      33% { transform: translateY(-30px) rotate(120deg); }
      66% { transform: translateY(20px) rotate(240deg); }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `,
  fadeInUp: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  slideIn: `
    @keyframes slideIn {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }
  `
}

// Default theme object
export const theme2zpoint = {
  colors: brandColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  animations
}

export default theme2zpoint