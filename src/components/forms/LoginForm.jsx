import { useState, forwardRef, useImperativeHandle } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Link } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Stack,
  Group,
  Anchor
} from '@mantine/core';
import {
  MdEmail as IconMail,
  MdLock as IconLock,
  MdCheck as IconCheck,
  MdClose as IconClose
} from 'react-icons/md';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = forwardRef(({ onSuccess }, ref) => {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      remember: false
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      }
    }
  });

  useImperativeHandle(ref, () => ({
    setFieldValue: (field, value) => form.setFieldValue(field, value)
  }));

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await signIn(values.email, values.password, values.remember);
      notifications.show({
        title: 'Welcome back!',
        message: 'Successfully logged in to your account',
        color: 'green',
        icon: <IconCheck />
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (error.message && error.message.includes('credentials')) {
        form.setFieldError('email', 'Invalid email or password');
        form.setFieldError('password', 'Invalid email or password');
        notifications.show({
          title: 'Login Failed',
          message: 'Invalid email or password. Please check your credentials.',
          color: 'red',
          icon: <IconClose />
        });
      } else {
        notifications.show({
          title: 'Login Error',
          message: error.message || 'An error occurred during login. Please try again.',
          color: 'red',
          icon: <IconClose />
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <Stack gap="md">
        <TextInput
          label="Email address"
          placeholder="Enter your email"
          leftSection={<IconMail size={18} />}
          autoComplete="email"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          leftSection={<IconLock size={18} />}
          autoComplete="current-password"
          {...form.getInputProps('password')}
        />

        <Group justify="space-between">
          <Checkbox
            label="Remember me"
            {...form.getInputProps('remember', { type: 'checkbox' })}
          />
          <Anchor
            component={Link}
            to="/forgot-password"
            size="sm"
          >
            Forgot your password?
          </Anchor>
        </Group>

        <Button
          type="submit"
          fullWidth
          loading={loading}
          size="md"
        >
          Sign in
        </Button>
      </Stack>
    </motion.form>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;