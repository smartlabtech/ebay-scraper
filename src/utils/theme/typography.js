// Typography system utilities
export const fontFamily = {
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    '"Noto Sans"',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"'
  ].join(', '),
  serif: [
    'ui-serif',
    'Georgia',
    'Cambria',
    '"Times New Roman"',
    'Times',
    'serif'
  ].join(', '),
  mono: [
    'ui-monospace',
    'SFMono-Regular',
    '"SF Mono"',
    'Consolas',
    '"Liberation Mono"',
    'Menlo',
    'Courier',
    'monospace'
  ].join(', ')
};

// Font sizes with line heights
export const fontSize = {
  xs: { size: 12, lineHeight: 1.5 },      // 12px / 18px
  sm: { size: 14, lineHeight: 1.5 },      // 14px / 21px
  base: { size: 16, lineHeight: 1.5 },    // 16px / 24px
  lg: { size: 18, lineHeight: 1.5 },      // 18px / 27px
  xl: { size: 20, lineHeight: 1.5 },      // 20px / 30px
  '2xl': { size: 24, lineHeight: 1.333 }, // 24px / 32px
  '3xl': { size: 30, lineHeight: 1.2 },   // 30px / 36px
  '4xl': { size: 36, lineHeight: 1.111 }, // 36px / 40px
  '5xl': { size: 48, lineHeight: 1 },     // 48px / 48px
  '6xl': { size: 60, lineHeight: 1 },     // 60px / 60px
  '7xl': { size: 72, lineHeight: 1 },     // 72px / 72px
  '8xl': { size: 96, lineHeight: 1 },     // 96px / 96px
  '9xl': { size: 128, lineHeight: 1 }     // 128px / 128px
};

// Font weights
export const fontWeight = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900
};

// Letter spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em'
};

// Line heights
export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
  3: 0.75,
  4: 1,
  5: 1.25,
  6: 1.5,
  7: 1.75,
  8: 2,
  9: 2.25,
  10: 2.5
};

// Text transforms
export const textTransform = {
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
  normal: 'none'
};

// Text decoration
export const textDecoration = {
  underline: 'underline',
  overline: 'overline',
  'line-through': 'line-through',
  none: 'none'
};

// Mantine typography configuration
export const mantineTypography = {
  fontFamily: fontFamily.sans,
  fontFamilyMonospace: fontFamily.mono,
  fontSizes: {
    xs: fontSize.xs.size,
    sm: fontSize.sm.size,
    md: fontSize.base.size,
    lg: fontSize.lg.size,
    xl: fontSize.xl.size
  },
  headings: {
    fontFamily: fontFamily.sans,
    fontWeight: fontWeight.bold,
    sizes: {
      h1: { fontSize: fontSize['4xl'].size, lineHeight: fontSize['4xl'].lineHeight },
      h2: { fontSize: fontSize['3xl'].size, lineHeight: fontSize['3xl'].lineHeight },
      h3: { fontSize: fontSize['2xl'].size, lineHeight: fontSize['2xl'].lineHeight },
      h4: { fontSize: fontSize.xl.size, lineHeight: fontSize.xl.lineHeight },
      h5: { fontSize: fontSize.lg.size, lineHeight: fontSize.lg.lineHeight },
      h6: { fontSize: fontSize.base.size, lineHeight: fontSize.base.lineHeight }
    }
  }
};

// Typography utilities
export const typography = {
  // Heading styles
  h1: {
    fontSize: fontSize['4xl'].size,
    lineHeight: fontSize['4xl'].lineHeight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight
  },
  h2: {
    fontSize: fontSize['3xl'].size,
    lineHeight: fontSize['3xl'].lineHeight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight
  },
  h3: {
    fontSize: fontSize['2xl'].size,
    lineHeight: fontSize['2xl'].lineHeight,
    fontWeight: fontWeight.semibold
  },
  h4: {
    fontSize: fontSize.xl.size,
    lineHeight: fontSize.xl.lineHeight,
    fontWeight: fontWeight.semibold
  },
  h5: {
    fontSize: fontSize.lg.size,
    lineHeight: fontSize.lg.lineHeight,
    fontWeight: fontWeight.medium
  },
  h6: {
    fontSize: fontSize.base.size,
    lineHeight: fontSize.base.lineHeight,
    fontWeight: fontWeight.medium
  },

  // Body text styles
  body: {
    fontSize: fontSize.base.size,
    lineHeight: fontSize.base.lineHeight,
    fontWeight: fontWeight.normal
  },
  bodyLarge: {
    fontSize: fontSize.lg.size,
    lineHeight: fontSize.lg.lineHeight,
    fontWeight: fontWeight.normal
  },
  bodySmall: {
    fontSize: fontSize.sm.size,
    lineHeight: fontSize.sm.lineHeight,
    fontWeight: fontWeight.normal
  },

  // Special text styles
  lead: {
    fontSize: fontSize.xl.size,
    lineHeight: fontSize.xl.lineHeight,
    fontWeight: fontWeight.light
  },
  caption: {
    fontSize: fontSize.xs.size,
    lineHeight: fontSize.xs.lineHeight,
    fontWeight: fontWeight.normal,
    letterSpacing: letterSpacing.wide
  },
  overline: {
    fontSize: fontSize.xs.size,
    lineHeight: fontSize.xs.lineHeight,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.widest,
    textTransform: textTransform.uppercase
  },
  code: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm.size,
    lineHeight: fontSize.sm.lineHeight,
    fontWeight: fontWeight.normal
  }
};

// Text alignment utilities
export const textAlign = {
  left: 'left',
  center: 'center',
  right: 'right',
  justify: 'justify'
};

// Text color utilities (semantic)
export const textColor = {
  primary: 'var(--mantine-color-text)',
  secondary: 'var(--mantine-color-dimmed)',
  muted: 'var(--mantine-color-gray-6)',
  success: 'var(--mantine-color-green-6)',
  danger: 'var(--mantine-color-red-6)',
  warning: 'var(--mantine-color-yellow-6)',
  info: 'var(--mantine-color-blue-6)',
  white: '#ffffff',
  black: '#000000'
};

// Responsive typography utilities
export const responsiveText = {
  sm: (styles) => ({
    '@media (min-width: 640px)': styles
  }),
  md: (styles) => ({
    '@media (min-width: 768px)': styles
  }),
  lg: (styles) => ({
    '@media (min-width: 1024px)': styles
  }),
  xl: (styles) => ({
    '@media (min-width: 1280px)': styles
  })
};

// Typography helper functions
export const getTextStyle = (variant) => typography[variant] || {};

export const truncate = (lines = 1) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical'
});

export default {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  textTransform,
  textDecoration,
  mantineTypography,
  typography,
  textAlign,
  textColor,
  responsiveText,
  getTextStyle,
  truncate
};