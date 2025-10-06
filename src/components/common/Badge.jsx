import React from 'react';
import { Badge as MantineBadge } from '@mantine/core';

const Badge = ({ 
  children, 
  variant = 'filled',
  color = 'violet',
  size = 'md',
  radius = 'md',
  ...props 
}) => {
  // Map custom colors to Mantine colors
  const mantineColor = {
    success: 'green',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    default: 'gray'
  }[color] || color;

  return (
    <MantineBadge
      variant={variant}
      color={mantineColor}
      size={size}
      radius={radius}
      {...props}
    >
      {children}
    </MantineBadge>
  );
};

export default Badge;