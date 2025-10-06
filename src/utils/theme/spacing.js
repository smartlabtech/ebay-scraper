// Spacing system utilities
export const spacing = {
  // Base spacing scale (in pixels)
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384
};

// Mantine spacing values
export const mantineSpacing = {
  xs: spacing[2],   // 8px
  sm: spacing[3],   // 12px
  md: spacing[4],   // 16px
  lg: spacing[6],   // 24px
  xl: spacing[8]    // 32px
};

// Convert spacing value to pixels
export const toPixels = (value) => {
  if (typeof value === 'number') return `${value}px`;
  if (spacing[value] !== undefined) return `${spacing[value]}px`;
  return value;
};

// Convert spacing value to rem
export const toRem = (value, base = 16) => {
  if (typeof value === 'number') return `${value / base}rem`;
  if (spacing[value] !== undefined) return `${spacing[value] / base}rem`;
  return value;
};

// Padding utilities
export const padding = {
  p: (value) => ({ padding: toPixels(value) }),
  px: (value) => ({ paddingLeft: toPixels(value), paddingRight: toPixels(value) }),
  py: (value) => ({ paddingTop: toPixels(value), paddingBottom: toPixels(value) }),
  pt: (value) => ({ paddingTop: toPixels(value) }),
  pr: (value) => ({ paddingRight: toPixels(value) }),
  pb: (value) => ({ paddingBottom: toPixels(value) }),
  pl: (value) => ({ paddingLeft: toPixels(value) })
};

// Margin utilities
export const margin = {
  m: (value) => ({ margin: toPixels(value) }),
  mx: (value) => ({ marginLeft: toPixels(value), marginRight: toPixels(value) }),
  my: (value) => ({ marginTop: toPixels(value), marginBottom: toPixels(value) }),
  mt: (value) => ({ marginTop: toPixels(value) }),
  mr: (value) => ({ marginRight: toPixels(value) }),
  mb: (value) => ({ marginBottom: toPixels(value) }),
  ml: (value) => ({ marginLeft: toPixels(value) })
};

// Gap utilities for flex/grid
export const gap = {
  gap: (value) => ({ gap: toPixels(value) }),
  gapX: (value) => ({ columnGap: toPixels(value) }),
  gapY: (value) => ({ rowGap: toPixels(value) })
};

// Space utilities for consistent spacing between elements
export const space = {
  between: (value) => `& > * + *`,
  x: (value) => ({
    '& > * + *': {
      marginLeft: toPixels(value)
    }
  }),
  y: (value) => ({
    '& > * + *': {
      marginTop: toPixels(value)
    }
  })
};

// Responsive spacing utilities
export const responsiveSpacing = {
  sm: (property, value) => ({
    [`@media (min-width: 640px)`]: {
      [property]: toPixels(value)
    }
  }),
  md: (property, value) => ({
    [`@media (min-width: 768px)`]: {
      [property]: toPixels(value)
    }
  }),
  lg: (property, value) => ({
    [`@media (min-width: 1024px)`]: {
      [property]: toPixels(value)
    }
  }),
  xl: (property, value) => ({
    [`@media (min-width: 1280px)`]: {
      [property]: toPixels(value)
    }
  })
};

// Container padding based on screen size
export const containerPadding = {
  base: spacing[4],  // 16px
  sm: spacing[6],    // 24px
  md: spacing[8],    // 32px
  lg: spacing[10],   // 40px
  xl: spacing[12]    // 48px
};

// Section spacing for consistent vertical rhythm
export const sectionSpacing = {
  xs: spacing[8],    // 32px
  sm: spacing[12],   // 48px
  md: spacing[16],   // 64px
  lg: spacing[20],   // 80px
  xl: spacing[24]    // 96px
};

// Stack spacing presets
export const stackSpacing = {
  tight: spacing[2],    // 8px
  normal: spacing[4],   // 16px
  loose: spacing[6]     // 24px
};

// Grid gutter presets
export const gridGutter = {
  xs: spacing[2],    // 8px
  sm: spacing[3],    // 12px
  md: spacing[4],    // 16px
  lg: spacing[6],    // 24px
  xl: spacing[8]     // 32px
};

export default {
  spacing,
  mantineSpacing,
  toPixels,
  toRem,
  padding,
  margin,
  gap,
  space,
  responsiveSpacing,
  containerPadding,
  sectionSpacing,
  stackSpacing,
  gridGutter
};