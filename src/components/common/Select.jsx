import React from 'react';
import { Select as MantineSelect } from '@mantine/core';

const Select = ({ 
  label,
  placeholder,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  searchable = false,
  clearable = false,
  size = 'md',
  ...props 
}) => {
  // Convert options format if needed
  const data = options.map(option => {
    if (typeof option === 'string') {
      return { value: option, label: option };
    }
    return {
      value: option.value,
      label: option.label || option.name || option.value
    };
  });

  return (
    <MantineSelect
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      data={data}
      error={error}
      required={required}
      disabled={disabled}
      searchable={searchable}
      clearable={clearable}
      size={size}
      {...props}
    />
  );
};

export default Select;