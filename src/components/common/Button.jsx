import React from 'react';
import { Button as MantineButton, Group } from '@mantine/core';
import { motion } from 'framer-motion';

// Enhanced Button component with Tailwind-style variant mapping
const Button = React.forwardRef(({ 
  children, 
  variant = 'filled',
  size = 'md',
  color = 'violet',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
  leftSection,
  rightSection,
  animate = true,
  compact = false,
  uppercase = false,
  gradient,
  ...props 
}, ref) => {
  // Map custom variants to Mantine variants
  const getVariant = () => {
    const variantMap = {
      'primary': 'filled',
      'secondary': 'light',
      'outline': 'outline',
      'ghost': 'subtle',
      'link': 'transparent',
      'danger': 'filled',
      'success': 'filled',
      'warning': 'filled',
      'white': 'white',
      'default': 'default',
      'gradient': 'gradient'
    };
    return variantMap[variant] || variant;
  };

  // Map custom colors based on variant
  const getColor = () => {
    const colorMap = {
      'danger': 'red',
      'success': 'green',
      'warning': 'yellow',
      'primary': 'violet',
      'secondary': 'gray'
    };
    return colorMap[variant] || color;
  };

  // Size mapping for consistency
  const getSizeStyles = () => {
    const sizeMap = {
      'xs': { paddingX: 12, height: 30, fontSize: 12 },
      'sm': { paddingX: 16, height: 36, fontSize: 14 },
      'md': { paddingX: 20, height: 42, fontSize: 16 },
      'lg': { paddingX: 24, height: 50, fontSize: 18 },
      'xl': { paddingX: 32, height: 60, fontSize: 20 }
    };
    return compact ? {} : sizeMap[size] || {};
  };

  const ButtonComponent = (
    <MantineButton
      ref={ref}
      variant={getVariant()}
      size={size}
      color={getColor()}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
      loaderProps={{ type: 'dots' }}
      leftSection={leftSection}
      rightSection={rightSection}
      tt={uppercase ? 'uppercase' : undefined}
      gradient={gradient}
      styles={{
        root: getSizeStyles()
      }}
      {...props}
    >
      {children}
    </MantineButton>
  );

  // Add subtle animation if enabled and not loading/disabled
  if (!animate || loading || disabled) {
    return ButtonComponent;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      style={{ display: fullWidth ? 'block' : 'inline-block', width: fullWidth ? '100%' : 'auto' }}
    >
      {ButtonComponent}
    </motion.div>
  );
});

Button.displayName = 'Button';

// Button Group component for grouped buttons
export const ButtonGroup = ({ children, orientation = 'horizontal', ...props }) => {
  return (
    <MantineButton.Group orientation={orientation} {...props}>
      {children}
    </MantineButton.Group>
  );
};

export default Button;