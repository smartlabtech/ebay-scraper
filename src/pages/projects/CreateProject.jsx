import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Group,
  TextInput,
  Textarea,
  Select,
  Text,
  Title,
  Box,
  Stack,
  Grid,
  Radio,
  Progress,
  Card,
  Tooltip,
  ActionIcon,
  Badge,
  Stepper,
  Alert,
  useMantineTheme
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  MdArrowBack as IconArrowLeft,
  MdCheck as IconCheck,
  MdHelp as IconHelp,
  MdInfo as IconInfo,
  MdRocket as IconRocket,
  MdTrendingUp as IconChart,
  MdBusiness as IconBuilding,
  MdNature as IconSeedling,
  MdStarBorder as IconStar,
  MdLightbulb as IconBulb,
  MdLocationOn as IconLocation,
  MdClose as IconClose,
  MdLanguage as IconDomain
} from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useProjects } from '../../hooks/useProjects';
import { PageTransition } from '../../components/ui/AnimatedElements';

const CreateProject = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { addProject } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showExamples, setShowExamples] = useState({});
  const [showHelp, setShowHelp] = useState({});

  // Get saved data from localStorage
  const savedData = localStorage.getItem('brand-message-draft');
  const parsedSavedData = savedData ? JSON.parse(savedData) : null;

  // Initialize form with saved data or empty values
  const initialValues = parsedSavedData || {
    // Core Business Information
    whatYouSell: '',
    whoYouSellTo: '',
    problemYouSolve: '',
    businessName: '',

    // What Makes You Special
    uniqueValue: '',
    priceRange: '',

    // Business Details
    businessGoal: '',
    location: '',
    businessStage: '',
    domainName: '',
  };

  // Check if we have saved data and notify user
  useEffect(() => {
    if (parsedSavedData && Object.values(parsedSavedData).some(value =>
      value && value.toString().trim() !== ''
    )) {
      notifications.show({
        title: 'Draft Restored',
        message: 'Your previous work has been restored',
        color: 'blue',
        icon: <IconInfo />,
        autoClose: 3000,
      });
    }
  }, []);

  const form = useForm({
    initialValues: initialValues,

    validate: {
      whatYouSell: (value) => !value.trim() ? 'Please describe what you sell' : null,
      whoYouSellTo: (value) => !value.trim() ? 'Please describe your target audience' : null,
      problemYouSolve: (value) => !value.trim() ? 'Please describe the problem you solve' : null,
      businessName: (value) => !value.trim() ? 'Business name is required' : null,
      uniqueValue: (value) => !value.trim() ? 'Please describe what makes you unique' : null,
      priceRange: (value) => !value ? 'Please select a price range' : null,
      businessGoal: (value) => !value ? 'Please select your business goal' : null,
      location: (value) => !value.trim() ? 'Location is required' : null,
      businessStage: (value) => !value ? 'Please select your business stage' : null,
      domainName: (value) => {
        if (!value) return null; // Optional field
        // Basic domain validation
        const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        return !domainRegex.test(value) ? 'Please enter a valid domain name (e.g., example.com)' : null;
      },
    },
  });

  // Auto-save on every change
  useEffect(() => {
    // Don't save if form is empty
    const hasContent = Object.values(form.values).some(value =>
      value && value.toString().trim() !== ''
    );

    if (hasContent) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('brand-message-draft', JSON.stringify(form.values));
      }, 500); // Debounce for 500ms to avoid too frequent saves

      return () => clearTimeout(timeoutId);
    }
  }, [form.values]);

  // Calculate progress
  const calculateProgress = () => {
    const fields = Object.keys(form.values);

    const filledFields = fields.filter(field => {
      const value = form.values[field];
      return value && value.toString().trim() !== '';
    });

    return (filledFields.length / fields.length) * 100;
  };

  const progress = calculateProgress();

  // Field helpers and examples
  const fieldHelpers = {
    whatYouSell: {
      placeholder: "E.g., Handmade jewelry, Web design services, Organic skincare products...",
      example: "I create custom WordPress websites for small businesses that need a professional online presence.",
      template: "I [create/provide/sell] [product/service] for [specific audience] that [specific benefit]."
    },
    whoYouSellTo: {
      placeholder: "E.g., Busy professionals, New parents, Small business owners...",
      example: "Small business owners in the service industry who need an affordable way to attract customers online.",
      template: "[Demographics] who [have this need] and [value this benefit]."
    },
    problemYouSolve: {
      placeholder: "E.g., Save time, reduce stress, increase revenue...",
      example: "Many small businesses struggle to create a professional website without breaking the bank or spending months learning web design.",
      template: "Many [target audience] struggle with [specific problem] which leads to [negative consequence]."
    },
    uniqueValue: {
      placeholder: "What sets you apart from competitors?",
      example: "Unlike generic templates or expensive agencies, I provide personalized designs at freelancer prices with ongoing support.",
      template: "Unlike [competitors], I [unique approach] which means [specific benefit for customer]."
    }
  };

  // Business stage options
  const businessStages = [
    {
      value: 'just-starting',
      label: 'Just Starting',
      description: '0-6 months',
      icon: <IconSeedling size={32} />,
      color: 'green'
    },
    {
      value: 'building-momentum',
      label: 'Building Momentum',
      description: '6-12 months',
      icon: <IconRocket size={32} />,
      color: 'blue'
    },
    {
      value: 'growing-steadily',
      label: 'Growing Steadily',
      description: '1-3 years',
      icon: <IconChart size={32} />,
      color: 'violet'
    },
    {
      value: 'established',
      label: 'Established',
      description: '3+ years',
      icon: <IconBuilding size={32} />,
      color: 'gray'
    }
  ];


  const handleSubmit = async (values) => {
    if (form.validate().hasErrors) {
      return;
    }
    setIsSubmitting(true);

    try {
      const projectData = {
        name: values.businessName,
        description: `${values.whatYouSell} for ${values.whoYouSellTo}`,
        ...values,
        timestamp: new Date().toISOString(),
        formVersion: '1.0',
        status: 'active',
        privacy: 'private',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Log the complete form data and project data to console
      console.log('=== FORM DATA SUBMITTED ===');
      console.log('Form Values:', JSON.stringify(values, null, 2));
      console.log('Complete Project Data:', JSON.stringify(projectData, null, 2));
      console.log('=========================');

      await addProject(projectData);

      // Clear saved draft from localStorage
      localStorage.removeItem('brand-message-draft');

      // Show success
      setShowConfetti(true);
      notifications.show({
        title: 'Success!',
        message: 'Your brand message has been created',
        color: 'green',
        icon: <IconCheck />,
      });

      setTimeout(() => {
        navigate('/projects');
      }, 3000);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save. Please try again.',
        color: 'red'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleClearForm = () => {
    const emptyValues = {
      whatYouSell: '',
      whoYouSellTo: '',
      problemYouSolve: '',
      businessName: '',
      uniqueValue: '',
      priceRange: '',
      businessGoal: '',
      location: '',
      businessStage: '',
      domainName: '',
    };

    form.setValues(emptyValues);
    localStorage.removeItem('brand-message-draft');
    notifications.show({
      title: 'Form Cleared',
      message: 'All fields have been reset',
      color: 'gray',
      icon: <IconClose />
    });
  };


  const renderFieldWithHelpers = (fieldName, component) => (
    <Box>
      {component}
      <Group justify="space-between" mt={5}>
        <Text size="xs" c="dimmed">
          {form.values[fieldName]?.length || 0} characters
        </Text>
        <Group gap={5}>
          <Tooltip label="Show example">
            <ActionIcon
              size="xs"
              variant="subtle"
              onClick={() => setShowExamples(prev => ({ ...prev, [fieldName]: !prev[fieldName] }))}
            >
              <IconBulb size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Need help?">
            <ActionIcon
              size="xs"
              variant="subtle"
              onClick={() => setShowHelp(prev => ({ ...prev, [fieldName]: !prev[fieldName] }))}
            >
              <IconHelp size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <AnimatePresence>
        {showExamples[fieldName] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert mt="xs" color="blue" variant="light" icon={<IconBulb />}>
              <Text size="sm" fw={500}>Example:</Text>
              <Text size="sm">{fieldHelpers[fieldName]?.example}</Text>
            </Alert>
          </motion.div>
        )}

        {showHelp[fieldName] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert mt="xs" color="violet" variant="light" icon={<IconInfo />}>
              <Text size="sm" fw={500}>Template:</Text>
              <Text size="sm">{fieldHelpers[fieldName]?.template}</Text>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );

  const steps = [
    {
      label: 'Core Business',
      description: 'Tell us about your business',
      icon: <IconInfo />,
    },
    {
      label: 'What Makes You Special',
      description: 'Your unique value proposition',
      icon: <IconStar />,
    },
    {
      label: 'Business Details',
      description: 'Additional information',
      icon: <IconBuilding />,
    }
  ];

  return (
    <PageTransition>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <Stack gap="xl">
        {/* Header */}
        <Box
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.03) 0%, rgba(109, 40, 217, 0.03) 100%)',
            borderBottom: '1px solid var(--mantine-color-gray-2)',
            marginLeft: '-var(--mantine-spacing-md)',
            marginRight: '-var(--mantine-spacing-md)',
            marginTop: '-var(--mantine-spacing-md)',
            padding: 'var(--mantine-spacing-xl) var(--mantine-spacing-md)'
          }}
        >
          <Stack gap="md" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <Box>
              <Title order={2} fw={700} mb={4}>
                Build Your Brand Message
              </Title>
              <Text c="dimmed" size="sm">
                Tell us about your business and we'll help craft your unique brand message
              </Text>
            </Box>
          </Stack>
        </Box>

        <Stack gap="xl">

          {/* Progress Bar */}
          <Card shadow="sm" p="xl" radius="lg" withBorder>
          <Group justify="space-between" mb="xs">
            <Group>
              <Text size="sm" fw={500}>Progress</Text>
              {Object.values(form.values).some(v => v && v.toString().trim()) && (
                <Text size="xs" c="dimmed">
                  (Auto-saving enabled)
                </Text>
              )}
            </Group>
            <Badge color={progress === 100 ? 'green' : 'blue'} variant="light">
              {Math.round(progress)}% Complete
            </Badge>
          </Group>
          <Progress value={progress} size="lg" radius="md" color={progress === 100 ? 'green' : 'blue'} />
          <Text size="xs" c="dimmed" mt="md" ta="center">
            Join 1,000+ entrepreneurs who've built their brand message
          </Text>
        </Card>

        {/* Form */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stepper
            active={activeStep}
            onStepClick={setActiveStep}
            size="sm"
            mb="xl"
          >
            {steps.map((step, index) => (
              <Stepper.Step
                key={index}
                label={step.label}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </Stepper>

          <Stack gap="xl">
            {/* Section 1: Core Business Information */}
            {activeStep === 0 && (
              <Card shadow="sm" p="xl" radius="lg" withBorder>
                <Title order={4} mb="lg">
                  <Group gap="xs">
                    <IconInfo size={20} />
                    Core Business Information
                  </Group>
                </Title>

                <Stack gap="lg">
                  {renderFieldWithHelpers('whatYouSell',
                    <Textarea
                      label="What You Sell"
                      placeholder={fieldHelpers.whatYouSell.placeholder}
                      required
                      minRows={5}
                      maxRows={10}
                      autosize
                      {...form.getInputProps('whatYouSell')}
                    />
                  )}

                  {renderFieldWithHelpers('whoYouSellTo',
                    <Textarea
                      label="Who You Sell To"
                      placeholder={fieldHelpers.whoYouSellTo.placeholder}
                      required
                      minRows={5}
                      maxRows={10}
                      autosize
                      {...form.getInputProps('whoYouSellTo')}
                    />
                  )}

                  {renderFieldWithHelpers('problemYouSolve',
                    <Textarea
                      label="Problem You Solve"
                      placeholder={fieldHelpers.problemYouSolve.placeholder}
                      required
                      minRows={5}
                      maxRows={10}
                      autosize
                      {...form.getInputProps('problemYouSolve')}
                    />
                  )}

                  <TextInput
                    label="Business Name"
                    placeholder="Enter your business name"
                    required
                    rightSection={form.values.businessName && <IconCheck size={16} color="green" />}
                    {...form.getInputProps('businessName')}
                  />
                </Stack>

                <Group justify="flex-end" mt="xl">
                  <Button
                    rightSection={<IconArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />}
                    onClick={() => setActiveStep(1)}
                  >
                    Next Section
                  </Button>
                </Group>
              </Card>
            )}

            {/* Section 2: What Makes You Special */}
            {activeStep === 1 && (
              <Card shadow="sm" p="xl" radius="lg" withBorder>
                <Title order={4} mb="lg">
                  <Group gap="xs">
                    <IconStar size={20} />
                    What Makes You Special
                  </Group>
                </Title>

                <Stack gap="lg">
                  {renderFieldWithHelpers('uniqueValue',
                    <Textarea
                      label="Unique Value"
                      placeholder={fieldHelpers.uniqueValue.placeholder}
                      required
                      minRows={5}
                      maxRows={10}
                      autosize
                      {...form.getInputProps('uniqueValue')}
                    />
                  )}

                  <Select
                    label="Price Range"
                    placeholder="Select your pricing tier"
                    required
                    data={[
                      { value: 'budget-friendly', label: 'Budget-Friendly' },
                      { value: 'mid-range', label: 'Mid-Range' },
                      { value: 'premium', label: 'Premium' },
                      { value: 'custom', label: 'Custom Pricing' }
                    ]}
                    {...form.getInputProps('priceRange')}
                  />
                </Stack>

                <Group justify="space-between" mt="xl">
                  <Button
                    variant="default"
                    leftSection={<IconArrowLeft size={16} />}
                    onClick={() => setActiveStep(0)}
                  >
                    Previous
                  </Button>
                  <Button
                    rightSection={<IconArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />}
                    onClick={() => setActiveStep(2)}
                  >
                    Next Section
                  </Button>
                </Group>
              </Card>
            )}

            {/* Section 3: Business Details */}
            {activeStep === 2 && (
              <Card shadow="sm" p="xl" radius="lg" withBorder>
                <Title order={4} mb="lg">
                  <Group gap="xs">
                    <IconBuilding size={20} />
                    Business Details
                  </Group>
                </Title>

                <Stack gap="lg">
                  <Radio.Group
                    label="Business Goal"
                    required
                    {...form.getInputProps('businessGoal')}
                  >
                    <Stack mt="xs">
                      <Radio value="grow-revenue" label="Grow Revenue" />
                      <Radio value="build-awareness" label="Build Brand Awareness" />
                      <Radio value="launch-product" label="Launch New Product/Service" />
                      <Radio value="establish-authority" label="Establish Industry Authority" />
                    </Stack>
                  </Radio.Group>

                  <TextInput
                    label="Location"
                    placeholder="City, State or Country"
                    required
                    leftSection={<IconLocation size={16} />}
                    {...form.getInputProps('location')}
                  />

                  <TextInput
                    label="Domain Name"
                    placeholder="example.com (optional)"
                    description="Your business website domain"
                    leftSection={<IconDomain size={16} />}
                    {...form.getInputProps('domainName')}
                  />

                  <Box>
                    <Text size="sm" fw={500} mb="sm">Business Stage</Text>
                    <Grid>
                      {businessStages.map((stage) => (
                        <Grid.Col key={stage.value} span={{ base: 12, xs: 6, sm: 3 }}>
                          <Card
                            p="md"
                            radius="lg"
                            shadow="sm"
                            withBorder
                            style={{
                              cursor: 'pointer',
                              borderColor: form.values.businessStage === stage.value
                                ? theme.colors[stage.color][4]
                                : 'transparent',
                              background: form.values.businessStage === stage.value
                                ? `linear-gradient(135deg, ${theme.colors[stage.color][0]}50, ${theme.colors[stage.color][1]}30)`
                                : 'transparent',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            sx={(theme) => ({
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                borderColor: theme.colors[stage.color][3],
                                boxShadow: `0 10px 30px -10px ${theme.colors[stage.color][2]}40`
                              }
                            })}
                            onClick={() => form.setFieldValue('businessStage', stage.value)}
                          >
                            <Stack align="center" gap="xs">
                              <Box c={stage.color}>{stage.icon}</Box>
                              <Text size="sm" fw={600}>{stage.label}</Text>
                              <Text size="xs" c="dimmed">{stage.description}</Text>
                            </Stack>
                          </Card>
                        </Grid.Col>
                      ))}
                    </Grid>
                  </Box>
                </Stack>

                <Group justify="flex-start" mt="xl">
                  <Button
                    variant="default"
                    leftSection={<IconArrowLeft size={16} />}
                    onClick={() => setActiveStep(1)}
                  >
                    Previous
                  </Button>
                </Group>
              </Card>
            )}

            {/* Action Buttons */}
            <Group justify="space-between">
              <Group>
                {Object.values(form.values).some(v => v && v.toString().trim()) && (
                  <Button
                    variant="subtle"
                    color="red"
                    leftSection={<IconClose size={16} />}
                    onClick={handleClearForm}
                  >
                    Clear Form
                  </Button>
                )}
              </Group>

              <Group>
                <Button
                  variant="default"
                  onClick={() => navigate('/projects')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  rightSection={<IconCheck size={16} />}
                  disabled={progress < 100}
                >
                  Create Project
                </Button>
              </Group>
            </Group>
          </Stack>
        </form>
        </Stack>
      </Stack>
    </PageTransition>
  );
};

export default CreateProject;