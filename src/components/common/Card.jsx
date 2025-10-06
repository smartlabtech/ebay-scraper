import React from 'react';
import { Card as MantineCard, Group, Text, Badge, ActionIcon, Box } from '@mantine/core';
import { motion } from 'framer-motion';

// Enhanced Card component with sections and hover effects
const Card = ({ 
  children, 
  className,
  shadow = 'sm',
  padding = 'lg',
  radius = 'md',
  withBorder = false,
  hoverable = false,
  onClick,
  gradient,
  style,
  ...props 
}) => {
  const cardContent = (
    <MantineCard
      shadow={shadow}
      padding={padding}
      radius={radius}
      withBorder={withBorder}
      className={className}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        background: gradient ? `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)` : undefined,
        ...style
      }}
      {...props}
    >
      {children}
    </MantineCard>
  );

  if (!hoverable) {
    return cardContent;
  }

  return (
    <motion.div
      whileHover={{ 
        y: -4,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.2 }}
    >
      {cardContent}
    </motion.div>
  );
};

// Card Section component
export const CardSection = ({ 
  children, 
  inheritPadding = false,
  withBorder = false,
  borderPosition = 'bottom',
  first = false,
  last = false,
  ...props 
}) => {
  const borderStyles = withBorder ? {
    [`border${borderPosition.charAt(0).toUpperCase() + borderPosition.slice(1)}`]: '1px solid var(--mantine-color-gray-3)'
  } : {};

  return (
    <MantineCard.Section
      inheritPadding={inheritPadding}
      mt={!first && inheritPadding ? 'md' : 0}
      mb={!last && inheritPadding ? 'md' : 0}
      style={borderStyles}
      {...props}
    >
      {children}
    </MantineCard.Section>
  );
};

// Stats Card variant
export const StatsCard = ({
  title,
  value,
  description,
  icon,
  color = 'blue',
  trend,
  trendValue,
  shadow = 'sm',
  ...props
}) => {
  return (
    <Card shadow={shadow} hoverable {...props}>
      <Group justify="space-between">
        <Box>
          <Text size="xs" tt="uppercase" fw={700} c="dimmed">
            {title}
          </Text>
          <Text size="xl" fw={700} mt="xs">
            {value}
          </Text>
          {description && (
            <Text size="xs" c="dimmed" mt={4}>
              {description}
            </Text>
          )}
          {trend && (
            <Badge
              color={trend === 'up' ? 'green' : 'red'}
              variant="light"
              size="sm"
              mt="xs"
            >
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </Badge>
          )}
        </Box>
        {icon && (
          <Box
            p="md"
            bg={`${color}.0`}
            style={{
              borderRadius: 'var(--mantine-radius-md)',
              color: `var(--mantine-color-${color}-6)`
            }}
          >
            {icon}
          </Box>
        )}
      </Group>
    </Card>
  );
};

// Feature Card variant
export const FeatureCard = ({
  title,
  description,
  icon,
  iconColor = 'blue',
  action,
  ...props
}) => {
  return (
    <Card hoverable h="100%" {...props}>
      <Box ta="center">
        {icon && (
          <Box
            mx="auto"
            w={64}
            h={64}
            bg={`${iconColor}.0`}
            style={{
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: `var(--mantine-color-${iconColor}-6)`,
              marginBottom: 'var(--mantine-spacing-md)'
            }}
          >
            {icon}
          </Box>
        )}
        <Text size="lg" fw={600} mt="md">
          {title}
        </Text>
        <Text size="sm" c="dimmed" mt="xs">
          {description}
        </Text>
        {action && (
          <Box mt="md">
            {action}
          </Box>
        )}
      </Box>
    </Card>
  );
};

// Image Card variant
export const ImageCard = ({
  image,
  imageHeight = 180,
  imageAlt,
  title,
  description,
  category,
  author,
  badges,
  footer,
  ...props
}) => {
  return (
    <Card padding={0} hoverable {...props}>
      <CardSection>
        <Box
          h={imageHeight}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </CardSection>

      <CardSection inheritPadding>
        {category && (
          <Badge color="violet" variant="light" size="sm" mb="xs">
            {category}
          </Badge>
        )}
        
        <Text size="lg" fw={600}>
          {title}
        </Text>
        
        {description && (
          <Text size="sm" c="dimmed" mt="xs">
            {description}
          </Text>
        )}
        
        {badges && (
          <Group gap="xs" mt="md">
            {badges.map((badge, index) => (
              <Badge key={index} size="sm" variant="dot" color={badge.color}>
                {badge.label}
              </Badge>
            ))}
          </Group>
        )}
        
        {author && (
          <Group mt="md">
            <Text size="sm" c="dimmed">
              By {author.name}
            </Text>
          </Group>
        )}
      </CardSection>

      {footer && (
        <CardSection inheritPadding withBorder borderPosition="top">
          {footer}
        </CardSection>
      )}
    </Card>
  );
};

export default Card;