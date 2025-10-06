/**
 * Reusable Button Components for Landing Pages
 * Based on Landing1 design patterns
 */

import React from 'react'
import { Button } from '@mantine/core'
import { useButtonStyles, use2zpointTheme, useResponsive } from '../../utils/hooks/useThemeStyles'
import trackingService from '../../services/trackingService'

// Primary CTA Button
export const CTAButton = ({
  children,
  onClick,
  size = 'lg',
  fullWidth,
  variant = 'primary',
  trackingName,
  trackingLocation,
  scrollToId,
  navigateTo,
  style = {},
  ...props
}) => {
  const buttonStyles = useButtonStyles(variant, size)
  const { isMobile } = useResponsive()
  const theme = use2zpointTheme()

  const handleClick = (e) => {
    // Track click if tracking enabled
    if (trackingName && trackingLocation) {
      trackingService.trackCtaClick(trackingName, trackingLocation)
    }

    // Scroll to section if ID provided
    if (scrollToId) {
      e.preventDefault()
      document.getElementById(scrollToId)?.scrollIntoView({ behavior: 'smooth' })
    }

    // Call custom onClick if provided
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <Button
      size={size}
      fullWidth={fullWidth || (isMobile && size === 'lg')}
      onClick={handleClick}
      styles={buttonStyles}
      style={style}
      {...props}
    >
      {children}
    </Button>
  )
}

// Secondary/Outline Button
export const SecondaryButton = ({
  children,
  onClick,
  size = 'lg',
  fullWidth,
  trackingName,
  trackingLocation,
  scrollToId,
  style = {},
  ...props
}) => {
  return (
    <CTAButton
      variant="secondary"
      size={size}
      fullWidth={fullWidth}
      onClick={onClick}
      trackingName={trackingName}
      trackingLocation={trackingLocation}
      scrollToId={scrollToId}
      style={style}
      {...props}
    >
      {children}
    </CTAButton>
  )
}

// Button Group Component
export const ButtonGroup = ({
  children,
  gap = 16,
  mt = 32,
  align = 'flex-start',
  wrap = 'wrap'
}) => {
  const { isMobile } = useResponsive()

  return (
    <div
      style={{
        display: 'flex',
        gap: `${gap}px`,
        marginTop: `${mt}px`,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : align,
        flexWrap: wrap,
        animation: 'fadeInUp 0.8s ease 0.5s both'
      }}
    >
      {children}
    </div>
  )
}

// Header Navigation Button
export const HeaderButton = ({ children, onClick, scrollToId }) => {
  const theme = use2zpointTheme()

  const handleClick = () => {
    if (scrollToId) {
      document.getElementById(scrollToId)?.scrollIntoView({ behavior: 'smooth' })
    }
    if (onClick) {
      onClick()
    }
  }

  return (
    <Button
      size="md"
      onClick={handleClick}
      style={{
        background: theme.colors.primary.main,
        color: 'white',
        transition: theme.transitions.all
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = theme.colors.primary.dark
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = theme.colors.primary.main
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {children}
    </Button>
  )
}

// Trust Badge Component
export const TrustBadge = ({ icon, text, mb = 20 }) => {
  const theme = use2zpointTheme()

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'white',
        border: `1px solid ${theme.colors.neutral[200]}`,
        padding: '6px 14px',
        borderRadius: '20px',
        marginBottom: `${mb}px`,
        fontSize: '13px',
        fontWeight: 600,
        color: theme.colors.neutral[600],
        boxShadow: theme.shadows.sm,
        animation: 'fadeInUp 0.8s ease 0.2s both'
      }}
    >
      <span
        style={{
          color: theme.colors.secondary.main,
          animation: 'pulse 2s infinite',
          marginRight: '8px'
        }}
      >
        {icon || '✔'}
      </span>
      <span style={{ color: theme.colors.neutral[900] }}>{text}</span>
    </div>
  )
}

// Floating Action Button
export const FloatingCTA = ({ show = false, onClick, text = "Get Started" }) => {
  const theme = use2zpointTheme()

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        animation: 'fadeInUp 0.5s ease'
      }}
    >
      <Button
        size="lg"
        onClick={onClick}
        style={{
          background: theme.colors.primary.main,
          color: 'white',
          padding: '16px 32px',
          fontSize: '1.1rem',
          fontWeight: 700,
          boxShadow: theme.shadows.xl,
          transition: theme.transitions.all
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = theme.shadows['2xl']
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = theme.shadows.xl
        }}
      >
        {text}
      </Button>
    </div>
  )
}