/**
 * Reusable Card Components for Landing Pages
 * Based on Landing1 design patterns
 */

import React from 'react'
import { Card, Box, Title, Text, Group, Rating, Stack } from '@mantine/core'
import { useCardStyles, use2zpointTheme, useHoverEffect } from '../../utils/hooks/useThemeStyles'
import { theme2zpoint } from '../../utils/theme/2zpointTheme'

// Feature Card Component
export const FeatureCard = ({ icon, title, description, index = 0 }) => {
  const cardStyles = useCardStyles('feature')
  const theme = use2zpointTheme()
  const hoverEffect = useHoverEffect('lift')

  return (
    <Card
      p="xl"
      radius="lg"
      style={{
        ...cardStyles.root,
        ...hoverEffect.style,
        animationDelay: `${index * 0.1}s`
      }}
      className="animate-on-scroll"
    >
      {/* Icon */}
      <Box
        style={{
          width: '48px',
          height: '48px',
          background: theme.colors.gradients.blue,
          borderRadius: theme.borderRadius.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          marginBottom: theme.spacing.md
        }}
      >
        <Text size="xl">{icon}</Text>
      </Box>

      {/* Title */}
      <Title order={4} mb="xs" c={theme.colors.neutral[900]}>
        {title}
      </Title>

      {/* Description */}
      <Text c={theme.colors.neutral[600]} style={{ lineHeight: 1.6 }}>
        {description}
      </Text>
    </Card>
  )
}

// Testimonial Card Component
export const TestimonialCard = ({
  text,
  author,
  title,
  initials,
  rating = 5,
  verified = true,
  index = 0
}) => {
  const cardStyles = useCardStyles('testimonial')
  const theme = use2zpointTheme()
  const hoverEffect = useHoverEffect('lift')

  return (
    <Box
      className="animate-on-scroll"
      style={{
        ...cardStyles.root,
        ...hoverEffect.style,
        animationDelay: `${index * 0.1}s`
      }}
    >
      {/* Rating */}
      <div
        style={{
          color: '#fbbf24',
          fontSize: '1.25rem',
          marginBottom: '16px'
        }}
      >
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </div>

      {/* Quote */}
      <p
        style={{
          color: theme.colors.neutral[900],
          fontSize: '1.1rem',
          lineHeight: 1.6,
          marginBottom: '24px',
          fontStyle: 'italic'
        }}
      >
        "{text}"
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Avatar */}
        <div
          style={{
            width: '56px',
            height: '56px',
            background: theme.colors.gradients.primary,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '20px'
          }}
        >
          {initials}
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontWeight: 700, color: theme.colors.neutral[900] }}>
            {author}
          </div>
          <div style={{ color: theme.colors.neutral[500], fontSize: '0.875rem' }}>
            {title}
          </div>
          {verified && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: theme.colors.secondary.main,
                fontSize: '0.75rem',
                marginTop: '4px',
                fontWeight: 600
              }}
            >
              ✓ Verified Member Since 2024
            </div>
          )}
        </div>
      </div>
    </Box>
  )
}

// Stat Card Component
export const StatCard = ({ number, label, highlight = false }) => {
  const theme = use2zpointTheme()

  return (
    <Box
      style={{
        background: highlight ? theme.colors.primary[50] : 'transparent',
        padding: highlight ? theme.spacing.lg : 0,
        borderRadius: theme.borderRadius.base,
        textAlign: 'center'
      }}
    >
      <Text
        style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: theme.colors.primary.main,
          lineHeight: 1
        }}
      >
        {number}
      </Text>
      <Text
        style={{
          fontSize: '0.875rem',
          color: theme.colors.neutral[500],
          marginTop: '4px'
        }}
      >
        {label}
      </Text>
    </Box>
  )
}

// Achievement Card Component
export const AchievementCard = ({ metric, value, subtitle, hover = true }) => {
  const theme = use2zpointTheme()
  const hoverEffect = useHoverEffect('lift')

  return (
    <Box
      style={{
        background: theme.colors.neutral[50],
        padding: '20px',
        borderRadius: theme.borderRadius.base,
        border: `1px solid ${theme.colors.neutral[200]}`,
        transition: theme.transitions.all,
        cursor: hover ? 'pointer' : 'default',
        ...(hover ? hoverEffect.style : {})
      }}
    >
      <Text
        size="xs"
        c={theme.colors.neutral[500]}
        style={{ fontSize: '0.875rem', marginBottom: '8px' }}
      >
        {metric}
      </Text>
      <Text
        style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: theme.colors.neutral[900]
        }}
      >
        {value}
      </Text>
      <Text
        size="xs"
        c={theme.colors.secondary.main}
        fw={600}
        style={{ fontSize: '0.75rem' }}
      >
        {subtitle}
      </Text>
    </Box>
  )
}

// Countdown Card Component
export const CountdownCard = ({ value, label }) => {
  const theme = use2zpointTheme()

  return (
    <Box
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: theme.borderRadius.lg,
        padding: '20px 24px',
        minWidth: '100px',
        transition: theme.transitions.transform,
        '&:hover': {
          transform: 'scale(1.05)',
          background: 'rgba(255, 255, 255, 0.15)'
        }
      }}
    >
      <Text
        size="2rem"
        fw={800}
        style={{ color: 'white', textAlign: 'center' }}
      >
        {value}
      </Text>
      <Text
        size="xs"
        tt="uppercase"
        style={{
          letterSpacing: '1px',
          opacity: 0.9,
          color: 'white',
          textAlign: 'center'
        }}
      >
        {label}
      </Text>
    </Box>
  )
}