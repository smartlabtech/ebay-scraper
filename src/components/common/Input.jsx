import React from 'react';
import { TextInput } from '@mantine/core';

const Input = ({ 
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  type = 'text',
  icon,
  size = 'md',
  ...props 
}) => {
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      error={error}
      required={required}
      disabled={disabled}
      type={type}
      leftSection={icon}
      size={size}
      {...props}
    />
  );
};

export default Input;