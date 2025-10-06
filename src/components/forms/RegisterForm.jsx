import { useState } from 'react';
import { useForm } from '@mantine/form';
import { Link } from 'react-router-dom';
import { 
  TextInput, 
  PasswordInput, 
  Checkbox, 
  Button, 
  Group, 
  Stack, 
  Text, 
  Progress,
  Divider,
  Paper
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { 
  MdPerson as IconUser, 
  MdEmail as IconMail, 
  MdLock as IconLock
} from 'react-icons/md';
import {
  FaGoogle as IconBrandGoogle
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

const RegisterForm = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const { signUp, loading } = useAuth();
  const { toast } = useNotifications();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      agreeToTerms: false
    },

    validate: {
      firstName: (value) => {
        if (!value) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        return null;
      },
      lastName: (value) => {
        if (!value) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        return null;
      },
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
          return 'Password must contain uppercase, lowercase, number and special character';
        }
        return null;
      },
      agreeToTerms: (value) => 
        !value ? 'You must agree to the terms and conditions' : null
    }
  });

  const passwordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength();
    if (strength === 0) return 'gray';
    if (strength === 1) return 'red';
    if (strength === 2) return 'yellow';
    if (strength === 3) return 'blue';
    return 'green';
  };

  const getPasswordStrengthText = () => {
    const strength = passwordStrength();
    if (strength === 0) return '';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (values) => {
    try {
      const { agreeToTerms, ...registerData } = values;
      await signUp(registerData);
      toast('Your account has been successfully created. Welcome aboard!', 'success');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (error.message.includes('already exists')) {
        form.setFieldError('email', 'This email is already registered');
      } else {
        toast(error.message || 'An error occurred during registration', 'error');
      }
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Group grow>
          <TextInput
            label="First Name"
            placeholder="Enter your first name"
            leftSection={<IconUser size={16} />}
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label="Last Name"
            placeholder="Enter your last name"
            {...form.getInputProps('lastName')}
          />
        </Group>

        <TextInput
          label="Email address"
          placeholder="Enter your email"
          leftSection={<IconMail size={16} />}
          {...form.getInputProps('email')}
        />

        <div>
          <PasswordInput
            label="Password"
            placeholder="Create a strong password"
            leftSection={<IconLock size={16} />}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              form.setFieldValue('password', e.target.value);
            }}
            error={form.errors.password}
          />
          {password && (
            <Stack gap={4} mt="xs">
              <Group justify="space-between">
                <Text size="xs" c="dimmed">Password strength:</Text>
                <Text size="xs" c={getPasswordStrengthColor()} fw={500}>
                  {getPasswordStrengthText()}
                </Text>
              </Group>
              <Progress
                value={(passwordStrength() / 4) * 100}
                color={getPasswordStrengthColor()}
                size="sm"
                radius="xl"
              />
            </Stack>
          )}
        </div>

        <Checkbox
          label={
            <Text size="sm">
              I agree to the{' '}
              <Text component={Link} to="/terms" c="violet" td="underline">
                Terms and Conditions
              </Text>{' '}
              and{' '}
              <Text component={Link} to="/privacy" c="violet" td="underline">
                Privacy Policy
              </Text>
            </Text>
          }
          {...form.getInputProps('agreeToTerms', { type: 'checkbox' })}
        />

        <Button
          type="submit"
          fullWidth
          size={isMobile ? "md" : "lg"}
          loading={loading}
          disabled={loading}
        >
          Create Account
        </Button>

        <Divider label="Or sign up with" labelPosition="center" my="lg" />

        <Button
          variant="default"
          leftSection={<IconBrandGoogle size={20} />}
          onClick={() => toast('Social registration will be available soon', 'info')}
          fullWidth
        >
          Continue with Google
        </Button>

        <Text ta="center" size="sm">
          Already have an account?{' '}
          <Text component={Link} to="/login" c="violet" fw={500} td="none">
            Sign in
          </Text>
        </Text>
      </Stack>
    </form>
  );
};

export default RegisterForm;