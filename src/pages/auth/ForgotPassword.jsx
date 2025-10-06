import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageSEO from '../../components/SEO/PageSEO';
import { getSEOData } from '../../config/seo';
import { useForm } from '@mantine/form';
import { motion } from 'framer-motion';
import { 
  Container, 
  Title, 
  Text, 
  TextInput,
  Button,
  Stack,
  Box,
  Center,
  Paper,
  Anchor,
  Alert
} from '@mantine/core';
import { HiSparkles as IconSparkles } from 'react-icons/hi';
import { MdEmail as IconMail, MdCheckCircle as IconCheck } from 'react-icons/md';
import authService from '../../services/auth';
import { FadeIn } from '../../components/ui/AnimatedElements';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const seoData = getSEOData('/auth/forgot-password');

  const form = useForm({
    initialValues: {
      email: ''
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email';
        return null;
      }
    }
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.forgotPassword(values.email);
      
      // Only show success if the API call was successful
      setSuccess(true);
      // No auto-redirect - user stays on success page
    } catch (error) {
      // Show the error message from the API (e.g., "E-mail is not true or not registered before, please check again")
      setError(error.message || 'Failed to send reset instructions');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setSuccess(false);
    setError('');
  };

  if (success) {
    return (
      <>
        <PageSEO {...seoData} url="/auth/forgot-password" />
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
                  Check your email
                </Title>
                
                <Text c="dimmed" ta="center" maw={350}>
                  We've sent password reset instructions to {form.values.email}
                </Text>
                
                <Text size="sm" c="dimmed" ta="center">
                  Didn't receive the email? Check your spam folder or{' '}
                  <Anchor onClick={handleTryAgain}>
                    try again
                  </Anchor>
                </Text>
                
                <Button 
                  component={Link} 
                  to="/login"
                  variant="subtle"
                  fullWidth
                  mt="md"
                >
                  Back to login
                </Button>
              </Stack>
            </Paper>
          </FadeIn>
        </Container>
        </Center>
      </>
    );
  }

  return (
    <>
      <PageSEO {...seoData} url="/auth/forgot-password" />
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
            <Title order={2} ta="center" mb="xs">
              Forgot password?
            </Title>
            
            <Text c="dimmed" size="sm" ta="center" mb="xl">
              Enter your email address and we'll send you instructions to reset your password.
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

                <TextInput
                  label="Email address"
                  placeholder="Enter your email"
                  leftSection={<IconMail size={18} />}
                  autoComplete="email"
                  {...form.getInputProps('email')}
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  size="md"
                >
                  Send reset instructions
                </Button>

                <Text ta="center" size="sm" c="dimmed">
                  Remember your password?{' '}
                  <Anchor component={Link} to="/login" fw={500}>
                    Back to login
                  </Anchor>
                </Text>
              </Stack>
            </motion.form>
          </Paper>
        </FadeIn>
      </Container>
      </Center>
    </>
  );
};

export default ForgotPassword;