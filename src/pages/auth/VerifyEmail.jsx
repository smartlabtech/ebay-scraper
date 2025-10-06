import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Container, 
  Title, 
  Text, 
  Button,
  Stack,
  Box,
  Center,
  Paper,
  Loader,
  Alert
} from '@mantine/core';
import { HiSparkles as IconSparkles } from 'react-icons/hi';
import { 
  MdCheckCircle as IconCheck, 
  MdError as IconError,
  MdRefresh as IconRefresh 
} from 'react-icons/md';
import authService from '../../services/auth';
import { FadeIn } from '../../components/ui/AnimatedElements';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. Please check your email for the correct link.');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    setStatus('verifying');
    try {
      const response = await authService.verifyEmail(token);
      setStatus('success');
      setMessage(response.message || 'Your email has been verified successfully!');
      
      // Clear auth data to force re-login with updated status
      localStorage.removeItem('AUTH_TOKEN');
      localStorage.removeItem('USER_DATA');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Verification failed. The link may be invalid or expired.');
    }
  };

  const handleResendVerification = async () => {
    setStatus('verifying');
    try {
      await authService.resendVerificationEmail();
      setStatus('success');
      setMessage('A new verification email has been sent. Please check your inbox.');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to resend verification email.');
    }
  };

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
            {status === 'verifying' && (
              <Stack align="center" gap="md">
                <Loader size="lg" color="violet" />
                <Title order={3}>Verifying your email...</Title>
                <Text c="dimmed" ta="center">
                  Please wait while we verify your email address.
                </Text>
              </Stack>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
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
                  
                  <Title order={3} ta="center">
                    Email Verified!
                  </Title>
                  
                  <Text c="dimmed" ta="center">
                    {message}
                  </Text>
                  
                  <Text size="sm" c="dimmed" ta="center">
                    Please log in again to access your account with verified status.
                  </Text>
                  
                  <Text size="xs" c="dimmed" ta="center" mt="xs">
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
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
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
                    Verification Failed
                  </Title>
                  
                  <Alert color="red" variant="light" w="100%">
                    {message}
                  </Alert>
                  
                  <Stack w="100%" gap="sm">
                    {token && (
                      <Button 
                        onClick={verifyEmail}
                        leftSection={<IconRefresh size={18} />}
                        fullWidth
                        variant="light"
                      >
                        Try Again
                      </Button>
                    )}
                    
                    <Button 
                      onClick={handleResendVerification}
                      fullWidth
                      variant="subtle"
                    >
                      Resend Verification Email
                    </Button>
                    
                    <Button 
                      component={Link} 
                      to="/login"
                      fullWidth
                      variant="outline"
                    >
                      Back to Login
                    </Button>
                  </Stack>
                </Stack>
              </motion.div>
            )}
          </Paper>
        </FadeIn>
      </Container>
    </Center>
  );
};

export default VerifyEmail;