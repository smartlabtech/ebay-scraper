import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import PageSEO from '../../components/SEO/PageSEO';
import SiteMetaTags from '../../components/SEO/SiteMetaTags';
import { getSEOData } from '../../config/seo';
import { 
  Container, 
  Title, 
  Text, 
  Anchor, 
  Stack,
  Box,
  Center,
  ThemeIcon,
  List,
  Loader
} from '@mantine/core';
import { HiSparkles as IconSparkles, HiCheck as IconCheck } from 'react-icons/hi';
import LoginForm from '../../components/forms/LoginForm';
import { FadeIn, AnimatedGradient } from '../../components/ui/AnimatedElements';

const Login = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const seoData = getSEOData('/auth/login');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  if (isChecking) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="lg" color="violet" />
          <Text c="dimmed">Loading...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      <SiteMetaTags
        title="Login"
        description="Sign in to your BrandBanda account to access AI-powered brand psychology tools"
        noIndex={true}
      />
      <PageSEO {...seoData} url="/auth/login" />
      <Box style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left side - Form */}
      <Box style={{ flex: 1, display: 'flex', alignItems: 'center' }} p="xl">
        <Container size="xs" w="100%">
          <FadeIn>
            <Stack>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <IconSparkles size={32} color="var(--mantine-color-violet-6)" />
                  <Title order={2} ml="xs" c="dark">BrandBanda</Title>
                </Box>
              </Link>
              
              <Title order={1} mt="md">
                Welcome back
              </Title>
              
              <Text c="dimmed" size="sm">
                Sign in to access your account
              </Text>
            </Stack>
          </FadeIn>

          <Box mt="xl">
            <LoginForm onSuccess={handleLoginSuccess} />
          </Box>
        </Container>
      </Box>

      {/* Right side - Image/Graphics */}
      <Box 
        style={{ display: 'none', position: 'relative', flex: 1 }}
        sx={(theme) => ({
          [`@media (min-width: ${theme.breakpoints.lg})`]: {
            display: 'block'
          }
        })}
      >
        <AnimatedGradient
          colors={['#7c3aed', '#3b82f6', '#10b981']}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Center h="100%" p="xl">
            <Box maw={400} c="white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Title order={2} mb="md">
                  Create Amazing Brand Content
                </Title>
                <Text size="lg" mb="xl" opacity={0.9}>
                  Join thousands of brands using our AI-powered platform to create 
                  compelling messages that connect with their audience.
                </Text>
                
                <List
                  gap="md"
                  size="md"
                  icon={
                    <ThemeIcon color="white" size={32} radius="xl" variant="light">
                      <IconCheck size={18} />
                    </ThemeIcon>
                  }
                >
                  <List.Item>AI-powered content generation</List.Item>
                  <List.Item>Brand voice consistency</List.Item>
                  <List.Item>Performance analytics</List.Item>
                </List>
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  bottom: '-80px',
                  right: '-80px',
                  width: '160px',
                  height: '160px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(40px)'
                }}
              />
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  top: '-80px',
                  left: '-80px',
                  width: '240px',
                  height: '240px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(40px)'
                }}
              />
            </Box>
          </Center>
        </AnimatedGradient>
      </Box>
      </Box>
    </>
  );
};

export default Login;