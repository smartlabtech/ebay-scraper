/**
 * Custom Hooks for Theme Styles
 * Integrate 2zpoint theme with Mantine components
 */

import { useMemo } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { theme2zpoint } from '../theme/2zpointTheme'
import { componentStylesKit } from '../theme/componentStyles'
import { responsiveUtils } from '../responsiveHelpers'
import { animationUtils } from '../animationHelpers'

// Main theme hook
export const use2zpointTheme = () => {
  return theme2zpoint
}

// Responsive hook
export const useResponsive = () => {
  const isMobile = useMediaQuery(`(max-width: ${theme2zpoint.breakpoints.md})`)
  const isTablet = useMediaQuery(`(min-width: ${theme2zpoint.breakpoints.md}) and (max-width: ${theme2zpoint.breakpoints.lg})`)
  const isDesktop = useMediaQuery(`(min-width: ${theme2zpoint.breakpoints.lg})`)
  const isSmallMobile = useMediaQuery(`(max-width: ${theme2zpoint.breakpoints.xs})`)

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    // Helper functions
    getValue: (mobileValue, desktopValue) => isMobile ? mobileValue : desktopValue,
    getResponsiveValue: (values) => responsiveUtils.getResponsiveValue(values,
      isSmallMobile ? 'xs' : isMobile ? 'sm' : isTablet ? 'md' : 'lg'
    )
  }
}

// Button styles hook
export const useButtonStyles = (variant = 'primary', size = 'md') => {
  const { isMobile } = useResponsive()
  const variantStyles = componentStylesKit.buttons[variant]

  // Handle cases where variant might not exist or have sizes
  if (!variantStyles) {
    return { root: {} }
  }

  const sizeStyles = variantStyles.sizes?.[size] || componentStylesKit.buttons.primary.sizes[size] || {}

  return useMemo(() => ({
    root: {
      ...variantStyles.base,
      ...sizeStyles,
      padding: isMobile && size === 'lg' ? '14px 32px' : sizeStyles.padding,
      fontSize: isMobile && size === 'lg' ? '1rem' : sizeStyles.fontSize,
      width: isMobile ? '100%' : 'auto',
      '&:hover': variantStyles.hover
    }
  }), [variantStyles, sizeStyles, size, isMobile])
}

// Card styles hook
export const useCardStyles = (type = 'default') => {
  const cardStyle = componentStylesKit.cards[type]

  return useMemo(() => {
    if (type === 'interactive' || type === 'feature' || type === 'testimonial') {
      return {
        root: {
          ...cardStyle.base,
          '&:hover': cardStyle.hover
        }
      }
    }
    return { root: cardStyle }
  }, [cardStyle, type])
}

// Text styles hook
export const useTextStyles = (variant = 'body') => {
  const { isMobile } = useResponsive()
  const textStyle = componentStylesKit.text[variant]

  return useMemo(() => ({
    ...textStyle,
    fontSize: isMobile && variant === 'heroTitle'
      ? responsiveUtils.getResponsiveFontSize('hero', true)
      : textStyle.fontSize
  }), [textStyle, variant, isMobile])
}

// Section styles hook
export const useSectionStyles = (type = 'default') => {
  const { isMobile } = useResponsive()
  const sectionStyle = componentStylesKit.sections[type]

  return useMemo(() => ({
    ...sectionStyle,
    paddingTop: isMobile ? '60px' : sectionStyle.paddingTop,
    paddingBottom: isMobile ? '60px' : sectionStyle.paddingBottom,
    padding: isMobile && type === 'problem' ? '30px 20px' : sectionStyle.padding
  }), [sectionStyle, type, isMobile])
}

// Animation hook
export const useAnimation = (type = 'fadeInUp', options = {}) => {
  const { delay = 0, duration, once = true } = options

  return useMemo(() => ({
    className: `animate-on-scroll`,
    style: {
      ...animationUtils.animationClasses[type],
      animationDelay: delay ? `${delay}s` : undefined,
      animationDuration: duration ? `${duration}s` : undefined
    },
    'data-animation': type,
    'data-animation-once': once
  }), [type, delay, duration, once])
}

// Hover effect hook
export const useHoverEffect = (effect = 'lift') => {
  const hoverStyle = animationUtils.hoverEffects[effect]

  return useMemo(() => ({
    style: typeof hoverStyle === 'function'
      ? hoverStyle(theme2zpoint.colors.primary.main)
      : hoverStyle
  }), [hoverStyle])
}

// Container styles hook
export const useContainerStyles = (size = 'xl') => {
  const { isMobile } = useResponsive()

  return useMemo(() => ({
    size,
    px: isMobile ? '16px' : '20px',
    style: {
      maxWidth: responsiveUtils.getContainerWidth(size)
    }
  }), [size, isMobile])
}

// Grid styles hook
export const useGridStyles = (cols = { base: 1, md: 2, lg: 3 }) => {
  const { isMobile, isTablet } = useResponsive()

  return useMemo(() => ({
    gutter: isMobile ? 20 : 30,
    cols: responsiveUtils.getResponsiveColumns(
      cols.lg || cols.md || cols.base,
      isMobile,
      isTablet
    )
  }), [cols, isMobile, isTablet])
}

// Stack styles hook
export const useStackStyles = (spacing = 'md') => {
  const { isMobile } = useResponsive()

  return useMemo(() => ({
    gap: responsiveUtils.getResponsiveSpacing(spacing, isMobile),
    align: 'stretch'
  }), [spacing, isMobile])
}

// Badge styles hook
export const useBadgeStyles = (type = 'trust') => {
  const badgeStyle = componentStylesKit.badges[type]

  return useMemo(() => ({
    root: badgeStyle
  }), [badgeStyle])
}

// List styles hook
export const useListStyles = (type = 'checkList') => {
  const listStyle = componentStylesKit.lists[type]

  return useMemo(() => ({
    root: listStyle
  }), [listStyle])
}

// Form input styles hook
export const useInputStyles = () => {
  const formStyles = componentStylesKit.forms

  return useMemo(() => ({
    input: formStyles.input.base,
    label: formStyles.label,
    wrapper: {
      marginBottom: theme2zpoint.spacing.md
    }
  }), [formStyles])
}

// Countdown/Stat styles hook
export const useStatStyles = () => {
  const { isMobile } = useResponsive()
  const statStyle = componentStylesKit.stats

  return useMemo(() => ({
    container: statStyle.container,
    number: {
      ...statStyle.number,
      fontSize: isMobile ? '1.5rem' : statStyle.number.fontSize
    },
    label: {
      ...statStyle.label,
      fontSize: isMobile ? '0.75rem' : statStyle.label.fontSize
    }
  }), [statStyle, isMobile])
}

// Scroll animation observer hook
export const useScrollAnimation = (options = {}) => {
  const observer = useMemo(
    () => animationUtils.createScrollAnimationObserver(options),
    [options]
  )

  return observer
}

// Combined styles hook for complete component styling
export const use2zpointStyles = () => {
  return {
    theme: use2zpointTheme(),
    responsive: useResponsive(),
    buttons: useButtonStyles,
    cards: useCardStyles,
    text: useTextStyles,
    sections: useSectionStyles,
    animations: useAnimation,
    hover: useHoverEffect,
    container: useContainerStyles,
    grid: useGridStyles,
    stack: useStackStyles,
    badges: useBadgeStyles,
    lists: useListStyles,
    inputs: useInputStyles,
    stats: useStatStyles
  }
}

export default use2zpointStyles