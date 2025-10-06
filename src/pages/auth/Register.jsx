import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PageSEO from '../../components/SEO/PageSEO';
import SiteMetaTags from '../../components/SEO/SiteMetaTags';
import { getSEOData } from '../../config/seo';
import { Container, Grid, Title, Text, Stack, List, ThemeIcon, Box, Center, Progress, Paper, Badge, Group, Loader } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { HiSparkles as IconSparkles, HiCheck as IconCheck } from 'react-icons/hi';
import RegisterForm from '../../components/forms/RegisterForm';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isChecking, setIsChecking] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 992px)');
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const seoData = getSEOData('/auth/register');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, navigate]);

  const handleRegisterSuccess = () => {
    setCurrentStep(2);
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  const benefits = [
    'Generate unlimited brand messages',
    'Access to all AI models',
    'Multi-platform content creation',
    'Advanced analytics dashboard',
    'Priority customer support',
    'Team collaboration features'
  ];

  const stats = [
    { value: '10K+', label: 'Active Brands' },
    { value: '500K+', label: 'Messages Created' },
    { value: '98%', label: 'Satisfaction Rate' }
  ];

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
        title="Sign Up"
        description="Join BrandBanda to transform your brand with AI-driven psychological insights and content creation"
        keywords="sign up, register, create account, brand psychology, AI marketing"
        noIndex={true}
      />
      <PageSEO {...seoData} url="/auth/register" />
      <Box mih="100vh" bg={isMobile ? 'gray.0' : 'white'}>
      <Grid m={0} gutter={0} h="100vh">
        {/* Left side - Benefits/Graphics */}
        {!isTablet && (
          <Grid.Col span={6}>
            <Box
              h="100%"
              style={{
                background: 'linear-gradient(135deg, #40c057 0%, #339af0 50%, #7950f2 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Container size="sm" p="xl">
                <Stack gap="xl">
                  <Box>
                    <Title order={2} mb="md" c="white">
                      Start Your Free Trial Today
                    </Title>
                    <Text size="lg" c="white" opacity={0.9}>
                      Join thousands of successful brands and transform your marketing with AI-powered content.
                    </Text>
                  </Box>

                  {/* Benefits list */}
                  <Stack gap="sm">
                    {benefits.map((benefit) => (
                      <Group key={benefit} wrap="nowrap">
                        <ThemeIcon color="white" variant="light" radius="xl" size="md">
                          <IconCheck size={16} />
                        </ThemeIcon>
                        <Text size="sm" c="white">{benefit}</Text>
                      </Group>
                    ))}
                  </Stack>

                  {/* Stats */}
                  <Group pt="xl" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                    {stats.map((stat) => (
                      <Box key={stat.label} ta="center" style={{ flex: 1 }}>
                        <Text size="xl" fw={700} c="white">{stat.value}</Text>
                        <Text size="xs" c="white" opacity={0.8}>{stat.label}</Text>
                      </Box>
                    ))}
                  </Group>
                </Stack>
              </Container>
            </Box>
          </Grid.Col>
        )}

        {/* Right side - Form */}
        <Grid.Col span={isTablet ? 12 : 6}>
          <Box
            h="100%"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflowY: 'auto'
            }}
          >
            <Container size={420} w="100%" px={isMobile ? 'md' : 'xl'} py="xl">
              {currentStep === 1 ? (
                <>
                  {/* Mobile Benefits - Show on mobile only */}
                  {isMobile && (
                    <Paper bg="violet.0" p="md" mb="xl" radius="md">
                      <Group gap="xs" mb="xs">
                        <IconSparkles size={20} color="var(--mantine-color-violet-6)" />
                        <Text size="sm" fw={600} c="violet.7">Why Choose BrandBanda?</Text>
                      </Group>
                      <Group gap={4}>
                        {['AI-Powered', 'Split Testing', 'Analytics'].map((item) => (
                          <Badge key={item} size="sm" variant="light" color="violet">
                            {item}
                          </Badge>
                        ))}
                      </Group>
                    </Paper>
                  )}

                  <Group mb="xl" justify={isMobile ? 'center' : 'flex-start'}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                      <ThemeIcon size={isMobile ? 'md' : 'lg'} variant="light" color="violet">
                        <IconSparkles size={isMobile ? 20 : 24} />
                      </ThemeIcon>
                      <Text size={isMobile ? 'lg' : 'xl'} fw={700} ml="xs" c="dark">BrandBanda</Text>
                    </Link>
                  </Group>
                  
                  <Title order={isMobile ? 3 : 2} mb="sm" ta={isMobile ? 'center' : 'left'}>
                    Create your account
                  </Title>
                  <Text c="dimmed" size="sm" mb="xl" ta={isMobile ? 'center' : 'left'}>
                    Already have an account?{' '}
                    <Text component={Link} to="/login" c="violet" fw={500} td="none">
                      Sign in
                    </Text>
                  </Text>

                  <RegisterForm onSuccess={handleRegisterSuccess} />

                  <Paper bg="violet.0" p="md" mt="xl" radius="md">
                    <Text size="sm" c="violet.7" ta="center">
                      <Text component="span" fw={600}>Special Offer:</Text> Get 20% off your first month with code WELCOME20
                    </Text>
                  </Paper>

                  {/* Mobile Stats - Show on mobile only */}
                  {isMobile && (
                    <Group mt="xl" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
                      {stats.map((stat) => (
                        <Box key={stat.label} ta="center" style={{ flex: 1 }}>
                          <Text size="lg" fw={700} c="violet">{stat.value}</Text>
                          <Text size="xs" c="dimmed">{stat.label}</Text>
                        </Box>
                      ))}
                    </Group>
                  )}
                </>
              ) : (
                <Center>
                  <Stack align="center" gap="md">
                    <ThemeIcon size={isMobile ? 60 : 80} radius="xl" color="green" variant="light">
                      <IconCheck size={isMobile ? 30 : 40} />
                    </ThemeIcon>
                    <Title order={isMobile ? 3 : 2} ta="center">
                      Welcome to BrandBanda!
                    </Title>
                    <Text c="dimmed" ta="center" size={isMobile ? 'sm' : 'md'}>
                      Your account has been created successfully.
                    </Text>
                    <Stack gap="xs" w="100%">
                      <Text size="sm" c="dimmed" ta="center">Redirecting to dashboard...</Text>
                      <Progress value={100} color="violet" animate />
                    </Stack>
                  </Stack>
                </Center>
              )}
            </Container>
          </Box>
        </Grid.Col>
      </Grid>
      </Box>
    </>
  );
};

export default Register;