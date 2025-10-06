import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { motion } from 'framer-motion';
import { 
  Container, 
  Title, 
  Text, 
  PasswordInput,
  Button,
  Stack,
  Box,
  Center,
  Paper,
  Alert,
  Progress,
  List
} from '@mantine/core';
import { HiSparkles as IconSparkles } from 'react-icons/hi';
import { 
  MdLock as IconLock,
  MdCheckCircle as IconCheck,
  MdError as IconError 
} from 'react-icons/md';
import authService from '../../services/auth';
import { FadeIn } from '../../components/ui/AnimatedElements';
import { useLoading } from '../../contexts/LoadingContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const token = searchParams.get('token');

  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validate: {
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value) return 'Please confirm your password';
        if (value !== values.password) return 'Passwords do not match';
        return null;
      }
    }
  });

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  useEffect(() => {
    const password = form.values.password;
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    setPasswordStrength(strength);
  }, [form.values.password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'red';
    if (passwordStrength < 70) return 'orange';
    return 'green';
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Fair';
    return 'Strong';
  };

  const handleSubmit = async (values) => {
    if (!token) {
      setError('No reset token provided');
      return;
    }

    showLoading('reset-password', 'Resetting password...');
    setError('');

    try {
      await authService.resetPassword(token, values.password);
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      hideLoading('reset-password');
    }
  };

  if (success) {
    return (
      <Center h="100vh">
        <Container size="xs">
          <FadeIn>
            <Paper p="xl" radius="md" withBorder>
              <Stack align="center" gap="md">
                <Box 
                  style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    backgroundColor: 'var(--mantine-color-green-1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconCheck size={40} color="var(--mantine-color-green-6)" />
                </Box>
                
                <Title order={2} ta="center">
                  Password Reset Successfully!
                </Title>
                
                <Text c="dimmed" ta="center">
                  Your password has been reset. You can now login with your new password.
                </Text>
                
                <Text size="sm" c="dimmed" ta="center">
                  Redirecting to login page...
                </Text>
                
                <Button 
                  component={Link} 
                  to="/login"
                  fullWidth
                  mt="md"
                >
                  Go to Login
                </Button>
              </Stack>
            </Paper>
          </FadeIn>
        </Container>
      </Center>
    );
  }

  return (
    <Center h="100vh">
      <Container size="xs">
        <FadeIn>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} mb="xl">
              <IconSparkles size={32} color="var(--mantine-color-violet-6)" />
              <Title order={2} ml="xs" c="dark">BrandBanda</Title>
            </Box>
          </Link>

          <Paper p="xl" radius="md" withBorder>
            {!token ? (
              <Stack align="center" gap="md">
                <Box 
                  style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    backgroundColor: 'var(--mantine-color-red-1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconError size={40} color="var(--mantine-color-red-6)" />
                </Box>
                
                <Title order={3} ta="center">
                  Invalid Reset Link
                </Title>
                
                <Alert color="red" variant="light" w="100%">
                  {error}
                </Alert>
                
                <Button 
                  component={Link} 
                  to="/forgot-password"
                  fullWidth
                >
                  Request New Reset Link
                </Button>
                
                <Button 
                  component={Link} 
                  to="/login"
                  variant="subtle"
                  fullWidth
                >
                  Back to Login
                </Button>
              </Stack>
            ) : (
              <>
                <Title order={2} ta="center" mb="xs">
                  Reset Your Password
                </Title>
                
                <Text c="dimmed" size="sm" ta="center" mb="xl">
                  Please enter your new password below.
                </Text>

                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={form.onSubmit(handleSubmit)}
                >
                  <Stack gap="md">
                    {error && (
                      <Alert color="red" variant="light">
                        {error}
                      </Alert>
                    )}

                    <Box>
                      <PasswordInput
                        label="New Password"
                        placeholder="Enter your new password"
                        leftSection={<IconLock size={18} />}
                        {...form.getInputProps('password')}
                      />
                      
                      {form.values.password && (
                        <Box mt="xs">
                          <Text size="xs" c="dimmed" mb={4}>
                            Password strength: {getPasswordStrengthLabel()}
                          </Text>
                          <Progress 
                            value={passwordStrength} 
                            color={getPasswordStrengthColor()}
                            size="xs"
                          />
                        </Box>
                      )}
                    </Box>

                    <PasswordInput
                      label="Confirm Password"
                      placeholder="Confirm your new password"
                      leftSection={<IconLock size={18} />}
                      {...form.getInputProps('confirmPassword')}
                    />

                    <Box>
                      <Text size="xs" c="dimmed" mb="xs">
                        Password must contain:
                      </Text>
                      <List size="xs" spacing="xs">
                        <List.Item
                          icon={
                            <IconCheck 
                              size={16} 
                              color={form.values.password.length >= 8 ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-gray-5)'}
                            />
                          }
                        >
                          At least 8 characters
                        </List.Item>
                        <List.Item
                          icon={
                            <IconCheck 
                              size={16} 
                              color={/[A-Z]/.test(form.values.password) ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-gray-5)'}
                            />
                          }
                        >
                          One uppercase letter
                        </List.Item>
                        <List.Item
                          icon={
                            <IconCheck 
                              size={16} 
                              color={/[a-z]/.test(form.values.password) ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-gray-5)'}
                            />
                          }
                        >
                          One lowercase letter
                        </List.Item>
                        <List.Item
                          icon={
                            <IconCheck 
                              size={16} 
                              color={/[0-9]/.test(form.values.password) ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-gray-5)'}
                            />
                          }
                        >
                          One number
                        </List.Item>
                      </List>
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      size="md"
                    >
                      Reset Password
                    </Button>

                    <Text ta="center" size="sm" c="dimmed">
                      Remember your password?{' '}
                      <Button 
                        component={Link} 
                        to="/login" 
                        variant="subtle"
                        size="xs"
                        p={0}
                      >
                        Back to login
                      </Button>
                    </Text>
                  </Stack>
                </motion.form>
              </>
            )}
          </Paper>
        </FadeIn>
      </Container>
    </Center>
  );
};

export default ResetPassword;