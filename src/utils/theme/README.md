# 🎨 2zpoint Theme System

## Overview
Unified theme configuration for the entire 2zpoint application. This is the single source of truth for all design tokens.

## Theme Structure

### 📁 File Organization
```
/utils/theme/
├── unifiedTheme.js      # Main theme export (USE THIS)
├── colors.js            # Color palette configuration
├── 2zpointTheme.js      # Core design tokens
├── componentStyles.js   # Reusable component styles
└── index.js            # Barrel export
```

## 🎯 Usage Guide

### In React Components

```jsx
import { unifiedTheme } from '@/utils/theme/unifiedTheme'

// Access colors
const primaryColor = unifiedTheme.colors.primary.main // #1e40af

// Access spacing
const padding = unifiedTheme.spacing.xl // 32px

// Access typography
const fontSize = unifiedTheme.typography.fontSize.lg // 1.125rem
```

### With Mantine Components

```jsx
import { Button, Text } from '@mantine/core'

// Mantine components automatically use the theme
<Button color="primary">Click Me</Button> // Uses #1e40af
<Text c="green.7">Success!</Text> // Uses #059669
```

### In Styled Components

```jsx
const styles = {
  hero: {
    background: unifiedTheme.gradients.primary,
    padding: unifiedTheme.spacing['2xl'],
    borderRadius: unifiedTheme.borderRadius.lg
  }
}
```

## 🎨 Brand Colors

### Primary Colors
- **Primary Blue**: `#1e40af` - Main brand color
- **Primary Dark**: `#1e3a8a` - Hover states
- **Primary Light**: `#3b82f6` - Accents

### Secondary Colors
- **Secondary Green**: `#059669` - Success/positive actions
- **Secondary Dark**: `#047857` - Hover states
- **Secondary Light**: `#10b981` - Accents

## 📐 Design Tokens

### Typography Scale
```
xs: 0.75rem    (12px)
sm: 0.875rem   (14px)
base: 1rem     (16px)
lg: 1.125rem   (18px)
xl: 1.25rem    (20px)
2xl: 1.5rem    (24px)
3xl: 1.875rem  (30px)
4xl: 2.25rem   (36px)
5xl: 3rem      (48px)
```

### Spacing Scale
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
4xl: 80px
5xl: 96px
```

### Border Radius
```
sm: 4px
base: 6px
md: 8px
lg: 12px
xl: 16px
2xl: 24px
full: 9999px
```

## 🔄 Migration Guide

### Old Code
```jsx
import { mantineColors } from './utils/theme/colors'
primaryColor: "violet"
```

### New Code
```jsx
import { unifiedTheme } from './utils/theme/unifiedTheme'
primaryColor: "blue" // Now uses 2zpoint blue
```

## ⚠️ Important Notes

1. **Always use `unifiedTheme`** - Don't import individual theme files
2. **Primary color is now blue** (#1e40af) not violet
3. **Secondary color is green** (#059669)
4. **All components should reference this theme** for consistency

## 🎯 Best Practices

1. **Use semantic color names** when possible
   ```jsx
   // Good
   color: unifiedTheme.colors.primary.main

   // Avoid
   color: '#1e40af'
   ```

2. **Use spacing tokens** instead of arbitrary values
   ```jsx
   // Good
   padding: unifiedTheme.spacing.md

   // Avoid
   padding: '16px'
   ```

3. **Leverage the gradient presets**
   ```jsx
   background: unifiedTheme.gradients.primary
   ```

## 📚 Component Styles

Pre-built component styles are available in `componentStyles.js`:

- `buttonStyles` - Primary, secondary, success button variants
- `cardStyles` - Default, interactive, feature, testimonial cards
- `sectionStyles` - Hero, default, alternate sections
- `textStyles` - Headings, body, accents
- `badgeStyles` - Trust, success, popular badges

## 🚀 Future Enhancements

- [ ] Dark mode color mappings
- [ ] Animation presets
- [ ] Additional gradient combinations
- [ ] Component-specific theme overrides