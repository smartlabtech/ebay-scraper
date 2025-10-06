import React from 'react';
import {
  TextInput as MantineTextInput,
  PasswordInput as MantinePasswordInput,
  Textarea as MantineTextarea,
  NumberInput as MantineNumberInput,
  Select as MantineSelect,
  MultiSelect as MantineMultiSelect,
  Checkbox as MantineCheckbox,
  Radio as MantineRadio,
  Switch as MantineSwitch,
  DateInput,
  TimeInput,
  FileInput,
  ColorInput,
  Slider,
  RangeSlider,
  Rating,
  SegmentedControl,
  Chip,
  Stack,
  Group,
  Text,
  Box,
  Paper,
  Title,
  Divider,
  Grid,
  Badge,
  Progress,
  Alert
} from '@mantine/core';
import { useForm as useMantineForm } from '@mantine/form';
import {
  MdError as IconError,
  MdInfo as IconInfo,
  MdCheckCircle as IconCheck,
  MdUploadFile as IconUpload,
  MdCalendarToday as IconCalendar,
  MdAccessTime as IconClock,
  MdPalette as IconColor,
  MdExpandLess as IconChevronUp,
  MdExpandMore as IconChevronDown
} from 'react-icons/md';
import { ActionIcon } from '@mantine/core';

// Enhanced TextInput with error states and helper text
export const TextInput = ({
  label,
  description,
  error,
  required,
  icon,
  rightSection,
  ...props
}) => {
  return (
    <MantineTextInput
      label={label}
      description={description}
      error={error}
      required={required}
      leftSection={icon}
      rightSection={rightSection}
      styles={(theme) => ({
        input: {
          '&:focus': {
            borderColor: error ? theme.colors.red[6] : theme.colors.blue[6]
          }
        }
      })}
      {...props}
    />
  );
};

// Enhanced PasswordInput with strength indicator
export const PasswordInput = ({
  label = 'Password',
  description,
  error,
  required,
  showStrength = false,
  value,
  onChange,
  ...props
}) => {
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    return strength;
  };

  const strength = showStrength ? getPasswordStrength(value) : 0;
  const strengthColor = 
    strength < 25 ? 'red' :
    strength < 50 ? 'orange' :
    strength < 75 ? 'yellow' :
    'green';

  return (
    <Box>
      <MantinePasswordInput
        label={label}
        description={description}
        error={error}
        required={required}
        value={value}
        onChange={onChange}
        {...props}
      />
      {showStrength && value && (
        <Box mt="xs">
          <Group justify="space-between" mb={5}>
            <Text size="xs" c="dimmed">Password strength</Text>
            <Text size="xs" c={strengthColor} fw={500}>
              {strength < 25 ? 'Weak' :
               strength < 50 ? 'Fair' :
               strength < 75 ? 'Good' :
               'Strong'}
            </Text>
          </Group>
          <Progress value={strength} color={strengthColor} size="xs" />
        </Box>
      )}
    </Box>
  );
};

// Enhanced Select with search and create
export const Select = ({
  label,
  description,
  error,
  required,
  data,
  searchable = true,
  clearable = true,
  icon,
  ...props
}) => {
  return (
    <MantineSelect
      label={label}
      description={description}
      error={error}
      required={required}
      data={data}
      searchable={searchable}
      clearable={clearable}
      leftSection={icon}
      nothingFoundMessage="No options"
      {...props}
    />
  );
};

// Enhanced MultiSelect
export const MultiSelect = ({
  label,
  description,
  error,
  required,
  data,
  searchable = true,
  clearable = true,
  maxSelectedValues,
  ...props
}) => {
  return (
    <MantineMultiSelect
      label={label}
      description={description}
      error={error}
      required={required}
      data={data}
      searchable={searchable}
      clearable={clearable}
      maxValues={maxSelectedValues}
      nothingFoundMessage="No options"
      {...props}
    />
  );
};

// Enhanced Textarea with character count
export const Textarea = ({
  label,
  description,
  error,
  required,
  maxLength,
  showCount = false,
  value = '',
  onChange,
  ...props
}) => {
  return (
    <Box>
      <MantineTextarea
        label={label}
        description={description}
        error={error}
        required={required}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        {...props}
      />
      {showCount && maxLength && (
        <Text size="xs" c="dimmed" ta="right" mt={4}>
          {value.length} / {maxLength}
        </Text>
      )}
    </Box>
  );
};

// Form Field wrapper component
export const FormField = ({
  label,
  description,
  error,
  required,
  children,
  helpText
}) => {
  return (
    <Box>
      {label && (
        <Text size="sm" fw={500} mb={4}>
          {label}
          {required && <Text span c="red"> *</Text>}
        </Text>
      )}
      {description && (
        <Text size="xs" c="dimmed" mb={8}>
          {description}
        </Text>
      )}
      {children}
      {error && (
        <Text size="xs" c="red" mt={4}>
          <Group gap={4}>
            <IconError size={14} />
            {error}
          </Group>
        </Text>
      )}
      {helpText && !error && (
        <Text size="xs" c="dimmed" mt={4}>
          <Group gap={4}>
            <IconInfo size={14} />
            {helpText}
          </Group>
        </Text>
      )}
    </Box>
  );
};

// Form Section component
export const FormSection = ({
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = true
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Paper p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Box>
          {title && <Title order={5}>{title}</Title>}
          {description && <Text size="sm" c="dimmed">{description}</Text>}
        </Box>
        {collapsible && (
          <ActionIcon onClick={() => setIsOpen(!isOpen)} variant="subtle">
            {isOpen ? <IconChevronUp /> : <IconChevronDown />}
          </ActionIcon>
        )}
      </Group>
      {(!collapsible || isOpen) && (
        <>
          <Divider mb="md" />
          {children}
        </>
      )}
    </Paper>
  );
};

// Form validation helper
export const useForm = (initialValues, validate) => {
  return useMantineForm({
    initialValues,
    validate,
    validateInputOnChange: true,
    validateInputOnBlur: true
  });
};

// Common validation rules
export const validators = {
  email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
  required: (value) => (value ? null : 'This field is required'),
  minLength: (min) => (value) => 
    value.length >= min ? null : `Must be at least ${min} characters`,
  maxLength: (max) => (value) =>
    value.length <= max ? null : `Must be no more than ${max} characters`,
  number: (value) => (!isNaN(value) ? null : 'Must be a number'),
  url: (value) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'Invalid URL';
    }
  },
  phone: (value) => 
    /^\+?[\d\s-()]+$/.test(value) ? null : 'Invalid phone number'
};

// File Upload component
export const FileUpload = ({
  label,
  description,
  error,
  required,
  accept,
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  icon = <IconUpload size={18} />,
  ...props
}) => {
  return (
    <FileInput
      label={label}
      description={description}
      error={error}
      required={required}
      accept={accept}
      multiple={multiple}
      icon={icon}
      placeholder="Click to upload files"
      {...props}
    />
  );
};

// Date picker component
export const DatePicker = ({
  label,
  description,
  error,
  required,
  minDate,
  maxDate,
  icon = <IconCalendar size={18} />,
  ...props
}) => {
  return (
    <DateInput
      label={label}
      description={description}
      error={error}
      required={required}
      minDate={minDate}
      maxDate={maxDate}
      leftSection={icon}
      placeholder="Select date"
      {...props}
    />
  );
};

// Time picker component
export const TimePicker = ({
  label,
  description,
  error,
  required,
  icon = <IconClock size={18} />,
  ...props
}) => {
  return (
    <TimeInput
      label={label}
      description={description}
      error={error}
      required={required}
      leftSection={icon}
      placeholder="Select time"
      {...props}
    />
  );
};

// Color picker component
export const ColorPicker = ({
  label,
  description,
  error,
  required,
  format = 'hex',
  swatches = [
    '#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb',
    '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886',
    '#40c057', '#82c91e', '#fab005', '#fd7e14'
  ],
  icon = <IconColor size={18} />,
  ...props
}) => {
  return (
    <ColorInput
      label={label}
      description={description}
      error={error}
      required={required}
      format={format}
      swatches={swatches}
      leftSection={icon}
      placeholder="Pick color"
      {...props}
    />
  );
};

// Radio Group component
export const RadioGroup = ({
  label,
  description,
  error,
  required,
  options = [],
  orientation = 'vertical',
  ...props
}) => {
  return (
    <Radio.Group
      label={label}
      description={description}
      error={error}
      required={required}
      orientation={orientation}
      {...props}
    >
      <Stack mt="xs" gap="xs">
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
          />
        ))}
      </Stack>
    </Radio.Group>
  );
};

// Checkbox Group component
export const CheckboxGroup = ({
  label,
  description,
  error,
  required,
  options = [],
  orientation = 'vertical',
  ...props
}) => {
  return (
    <Checkbox.Group
      label={label}
      description={description}
      error={error}
      required={required}
      orientation={orientation}
      {...props}
    >
      <Stack mt="xs" gap="xs">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
          />
        ))}
      </Stack>
    </Checkbox.Group>
  );
};

export default {
  TextInput,
  PasswordInput,
  Select,
  MultiSelect,
  Textarea,
  FormField,
  FormSection,
  useForm,
  validators,
  FileUpload,
  DatePicker,
  TimePicker,
  ColorPicker,
  RadioGroup,
  CheckboxGroup
};