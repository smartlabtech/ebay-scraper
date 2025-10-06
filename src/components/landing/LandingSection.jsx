/**
 * Reusable Landing Page Section Components
 * Based on Landing1 design patterns
 */

import React from 'react'
import { Box, Container, Title, Text, Stack, Center } from '@mantine/core'
import { useSectionStyles, useTextStyles, useContainerStyles, use2zpointTheme } from '../../utils/hooks/useThemeStyles'
import { theme2zpoint } from '../../utils/theme/2zpointTheme'

// Base Section Component
export const Section = ({
  children,
  type = 'default',
  id,
  py,
  background,
  style = {},
  ...props
}) => {
  const sectionStyles = useSectionStyles(type)
  const containerProps = useContainerStyles('xl')

  return (
    <Box
      component="section"
      id={id}
      py={py}
      style={{
        ...sectionStyles,
        background: background || sectionStyles.background,
        ...style
      }}
      {...props}
    >
      <Container {...containerProps}>
        {children}
      </Container>
    </Box>
  )
}

// Section Header Component
export const SectionHeader = ({
  title,
  subtitle,
  align = 'center',
  titleSize = '4xl',
  mb = 60
}) => {
  const theme = use2zpointTheme()
  const titleStyles = useTextStyles('sectionTitle')
  const subtitleStyles = useTextStyles('subtitle')

  return (
    <Box ta={align} mb={mb}>
      {title && (
        <Title
          order={2}
          style={{
            ...titleStyles,
            fontSize: theme.typography.fontSize[titleSize] || titleSize,
            marginBottom: subtitle ? theme.spacing.md : 0
          }}
        >
          {title}
        </Title>
      )}
      {subtitle && (
        <Text
          style={{
            ...subtitleStyles,
            maxWidth: align === 'center' ? '800px' : '100%',
            margin: align === 'center' ? '0 auto' : '0'
          }}
        >
          {subtitle}
        </Text>
      )}
    </Box>
  )
}

// Hero Section Component
export const HeroSection = ({
  children,
  backgroundGradient,
  minHeight = '90vh',
  hasFloatingShapes = true
}) => {
  const theme = use2zpointTheme()

  return (
    <Box
      component="section"
      style={{
        position: 'relative',
        minHeight,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Background */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: backgroundGradient || theme.colors.gradients.hero,
          zIndex: -1
        }}
      >
        {/* Pattern Overlay */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: `repeating-linear-gradient(45deg, ${theme.colors.primary.main} 0, ${theme.colors.primary.main} 1px, transparent 1px, transparent 15px), repeating-linear-gradient(-45deg, ${theme.colors.primary.main} 0, ${theme.colors.primary.main} 1px, transparent 1px, transparent 15px)`
          }}
        />

        {/* Floating Shapes */}
        {hasFloatingShapes && (
          <>
            <FloatingShape
              size="300px"
              top="10%"
              right="-150px"
              delay="0s"
            />
            <FloatingShape
              size="200px"
              bottom="10%"
              left="-100px"
              delay="5s"
            />
          </>
        )}
      </Box>

      {children}
    </Box>
  )
}

// Floating Shape Component
export const FloatingShape = ({
  size = '200px',
  top,
  bottom,
  left,
  right,
  delay = '0s'
}) => {
  const theme = use2zpointTheme()

  return (
    <Box
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(5, 150, 105, 0.1))`,
        top,
        bottom,
        left,
        right,
        opacity: 0.5,
        animation: `float 20s ease-in-out infinite`,
        animationDelay: delay,
        pointerEvents: 'none'
      }}
    />
  )
}

// Problem Section Component
export const ProblemSection = ({ title, problems, alert }) => {
  const theme = use2zpointTheme()

  return (
    <Section>
      <Box
        style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing['2xl'],
          margin: `${theme.spacing['4xl']} 0`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Stack align="center" maw={900} style={{ margin: '0 auto' }}>
          <SectionHeader title={title} align="center" />

          {problems && (
            <Stack gap="md" w="100%">
              {problems.map((problem, index) => (
                <ProblemItem key={index} problem={problem} />
              ))}
            </Stack>
          )}

          {alert && (
            <AlertBox type="danger" mt="xl">
              {alert}
            </AlertBox>
          )}
        </Stack>
      </Box>
    </Section>
  )
}

// Problem Item Component
export const ProblemItem = ({ problem }) => {
  const theme = use2zpointTheme()

  return (
    <Box style={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing.sm }}>
      <Text c={theme.colors.semantic.danger} fw="bold">→</Text>
      <Text c={theme.colors.neutral[600]} style={{ flex: 1, lineHeight: 1.6 }}>
        {problem}
      </Text>
    </Box>
  )
}

// Alert Box Component
export const AlertBox = ({ children, type = 'info', mt }) => {
  const theme = use2zpointTheme()

  const colors = {
    danger: {
      background: 'rgba(220, 38, 38, 0.05)',
      border: theme.colors.semantic.danger
    },
    success: {
      background: 'rgba(34, 197, 94, 0.05)',
      border: theme.colors.semantic.success
    },
    info: {
      background: 'rgba(14, 165, 233, 0.05)',
      border: theme.colors.semantic.info
    }
  }

  return (
    <Box
      mt={mt}
      style={{
        background: colors[type].background,
        borderLeft: `4px solid ${colors[type].border}`,
        borderRadius: theme.borderRadius.base,
        padding: theme.spacing.lg,
        width: '100%'
      }}
    >
      {children}
    </Box>
  )
}