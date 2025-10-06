import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  Select,
  Textarea,
  Button,
  Group,
  Stack,
  Box,
  NumberInput,
  Alert,
  Stepper,
  Modal,
  ThemeIcon,
  Badge,
  Card,
  Divider,
  SimpleGrid,
  Transition,
  Progress,
  List,
  ActionIcon,
  Tooltip,
  Skeleton,
  useMantineTheme,
  rem
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import {
  MdAutoAwesome as IconSparkles,
  MdCheck as IconCheck,
  MdBusiness as IconBusiness,
  MdFolder as IconFolder,
  MdArrowBack as IconBack,
  MdArrowForward as IconNext,
  MdSend as IconSend,
  MdInfo as IconInfo,
  MdEdit as IconEdit,
  MdFoundation as IconFoundation,
  MdPsychology as IconStrategy,
  MdBrush as IconCustomize,
  MdCallToAction as IconAction,
  MdRateReview as IconReview,
  MdCheckCircle as IconComplete
} from 'react-icons/md';
import { useCopies } from '../../hooks/useCopies';
import { useBrandMessages } from '../../hooks/useBrandMessages';
import { useProjects } from '../../hooks/useProjects';
import { useNotifications } from '../../hooks/useNotifications';
import { PageTransition } from '../../components/ui/AnimatedElements';
import {
  PLATFORMS,
  PLATFORM_GROUPS,
  COPY_TYPES,
  CALL_TO_ACTION_TYPES,
  LANGUAGES,
  getCopyTypeDetails,
  formatPlatformName,
  getCTAInstructions
} from '../../services/copyService';
import WritingStyleSelector from '../../components/copies/WritingStyleSelector';
import CTASelector from '../../components/copies/CTASelector';
import CopyTypeSelector from '../../components/copies/CopyTypeSelector';
import PlatformSelector from '../../components/copies/PlatformSelector';
import LanguageSelector from '../../components/copies/LanguageSelector';

const CopyFormWizard = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { loadCopies, generateNewCopy } = useCopies();
  const { messages, loadMessages, loading: messagesLoading } = useBrandMessages();
  const { projects, loadProjects, loading: projectsLoading } = useProjects();
  const { toast } = useNotifications();

  const [active, setActive] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    return localStorage.getItem('selectedProjectId') || '';
  });
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Filter messages by selected project
  const projectMessages = selectedProjectId 
    ? messages.filter(m => m.projectId === selectedProjectId)
    : [];

  const form = useForm({
    initialValues: {
      brandMessageId: '',
      copyType: '',
      platform: '',
      language: 'ENGLISH',
      numberOfPosts: 1,
      topicSample: '',
      writingStyleId: '',
      writingStyleSample: '',
      callToActionType: 'LEARN_MORE'
    },

    validate: (values) => {
      // Step-specific validation
      if (active === 0) {
        // Step 1: Foundation - Brand Message + Copy Type
        return {
          brandMessageId: !values.brandMessageId ? 'Please select a brand message' : null,
          copyType: !values.copyType ? 'Please select a copy type' : null
        };
      }
      if (active === 1) {
        // Step 2: Channel - Platform + Language
        return {
          platform: !values.platform ? 'Please select a platform' : null,
          language: !values.language ? 'Please select a language' : null
        };
      }
      if (active === 2) {
        // Step 3: Customize - Topic/Theme + Writing Style + Variations
        return {
          numberOfPosts: (!values.numberOfPosts || values.numberOfPosts < 1) 
            ? 'At least 1 variation is required' 
            : values.numberOfPosts > 10 
            ? 'Maximum 10 variations allowed' 
            : null
        };
      }
      if (active === 3) {
        // Step 4: Action - CTA Type
        return {
          callToActionType: !values.callToActionType ? 'Please select a call to action type' : null
        };
      }
      return {};
    }
  });

  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      try {
        // Don't load projects here - Navigation component handles that
        // The projects will be available from Redux state via useProjects hook

        // Only load messages if we have a selected project
        if (selectedProjectId) {
          await loadMessages({ projectId: selectedProjectId });
        }
      } finally {
        setInitialLoading(false);
      }
    };
    loadInitialData();
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    if (selectedProjectId && !initialLoading) {
      loadMessages({ projectId: selectedProjectId });
    }
  }, [selectedProjectId, initialLoading]); // loadMessages is stable from the hook

  // Auto-select brand message if only one exists
  useEffect(() => {
    if (projectMessages.length === 1) {
      // Small delay to ensure the form is ready
      const timer = setTimeout(() => {
        if (!form.values.brandMessageId || form.values.brandMessageId !== projectMessages[0]._id) {
          form.setFieldValue('brandMessageId', projectMessages[0]._id);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [projectMessages]); // Re-run when projectMessages changes

  // Monitor localStorage for project changes from header
  useEffect(() => {
    const handleStorageChange = () => {
      const newProjectId = localStorage.getItem('selectedProjectId');
      if (newProjectId !== selectedProjectId) {
        setSelectedProjectId(newProjectId || '');
      }
    };

    // Check for changes periodically (storage event doesn't fire in same tab)
    const interval = setInterval(handleStorageChange, 500);
    
    // Also listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [selectedProjectId]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const selectedMessage = messages.find(m => m._id === form.values.brandMessageId);
  
  // Memoized callbacks for form field setters to prevent unnecessary re-renders
  const handleCopyTypeChange = useCallback((value) => {
    form.setFieldValue('copyType', value);
  }, []);
  
  const handlePlatformChange = useCallback((value) => {
    form.setFieldValue('platform', value);
  }, []);
  
  const handleLanguageChange = useCallback((value) => {
    form.setFieldValue('language', value);
  }, []);

  const nextStep = () => {
    const validation = form.validate();
    if (!validation.hasErrors) {
      setCompletedSteps(prev => new Set([...prev, active]));
      setActive((current) => (current < 4 ? current + 1 : current));
    }
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const goToStep = (stepIndex) => {
    // Allow navigation to previous steps or if previous step is completed
    if (stepIndex <= active || (stepIndex > 0 && completedSteps.has(stepIndex - 1))) {
      setActive(stepIndex);
    }
  };

  const handleSubmit = async () => {
    try {
      // Use the hook's generateNewCopy which handles loading state centrally
      const response = await generateNewCopy({
        brandMessageId: form.values.brandMessageId,
        platform: form.values.platform,
        copyType: form.values.copyType,
        language: form.values.language,
        numberOfPosts: form.values.numberOfPosts,
        topicSample: form.values.topicSample || undefined,
        writingStyleId: form.values.writingStyleId || undefined,
        writingStyleSample: form.values.writingStyleSample || undefined,
        callToActionType: form.values.callToActionType
      });

      if (response) {
        await loadCopies();
        navigate('/copies');
      }
    } catch (error) {
      console.error('Failed to generate copy:', error);

      // Get the error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate copy';

      // Check if it's an insufficient credits error
      const isCreditsError = errorMessage.toLowerCase().includes('insufficient credits') ||
                            errorMessage.toLowerCase().includes('required:') ||
                            error.response?.data?.details?.action === 'recharge_credits';

      // Auto-redirect to billing for credit/subscription errors
      if (errorMessage.includes('subscription') || isCreditsError) {
        setTimeout(() => {
          navigate('/settings/billing');
        }, 1500);
      }
    }
  };

  // Step Components
  const Step1Foundation = () => (
    <Stack gap="lg">
      <Box>
        <Select
          label="Brand Message"
          description={
            projectMessages.length === 1 
              ? "Auto-selected the only available brand message" 
              : "Select the brand message that will be the foundation for your copy"
          }
          placeholder="Choose a brand message"
          required
          size="md"
          leftSection={<IconBusiness size={18} />}
          rightSection={projectMessages.length === 1 ? <IconCheck size={16} color="green" /> : null}
          data={(() => {
            // Group messages by product and version
            const grouped = projectMessages.reduce((acc, m) => {
              const productName = m.productDetails?.productShortName || m.details?.inputPayload?.businessName || 'Other';
              const productVersion = m.productDetails?.majorVersion !== undefined && m.productDetails?.minorVersion !== undefined
                ? `${m.productDetails.majorVersion}.${m.productDetails.minorVersion}`
                : null;
              // Create unique key for grouping by product and version
              const groupKey = productVersion ? `${productName}|${productVersion}` : productName;
              
              if (!acc[groupKey]) {
                acc[groupKey] = {
                  name: productName,
                  version: productVersion,
                  messages: []
                };
              }
              acc[groupKey].messages.push(m);
              return acc;
            }, {});

            // Convert to Mantine Select format with groups
            return Object.entries(grouped)
              .sort(([, a], [, b]) => a.name.localeCompare(b.name)) // Sort groups alphabetically by name
              .map(([key, { name, version, messages }]) => ({
              group: `Product: ${name}${version ? ` (v${version})` : ''}`,
              items: messages
                .sort((a, b) => {
                  // Sort by version in descending order (newest first)
                  const versionA = parseFloat(a.version) || 0;
                  const versionB = parseFloat(b.version) || 0;
                  return versionB - versionA;
                })
                .map(m => ({
                value: m._id,
                label: (() => {
                  const bmVersion = m.version; // Brand message version from main object
                  
                  if (bmVersion) {
                    return `BM v${bmVersion}`;
                  }
                  return 'Brand Message';
                })(),
                description: m.productDetails?.productName ? 
                  m.productDetails.productName.substring(0, 80) + '...' : 
                  undefined
              }))
            }));
          })()}
          {...form.getInputProps('brandMessageId')}
          disabled={projectMessages.length === 0}
        />
        {projectMessages.length === 1 && (
          <Text size="xs" c="green" mt={4}>
            ✓ Automatically selected for your convenience
          </Text>
        )}
      </Box>

      {projectMessages.length === 0 && selectedProjectId && (
        <Alert color="yellow" variant="light" icon={<IconInfo size={16} />}>
          <Stack gap="xs">
            <Text size="sm" fw={500}>No brand messages found</Text>
            <Text size="xs" c="dimmed">
              Please create a brand message first for the project "{selectedProject?.name}"
            </Text>
            <Button 
              size="xs" 
              variant="filled" 
              color="yellow"
              onClick={() => navigate('/brand-messages/new')}
            >
              Create Brand Message
            </Button>
          </Stack>
        </Alert>
      )}

      {!selectedProjectId && (
        <Alert color="blue" variant="light" icon={<IconFolder size={16} />}>
          <Text size="sm">
            Please select a project from the header to continue
          </Text>
        </Alert>
      )}

      {form.values.brandMessageId && selectedMessage && (
        <Card withBorder p="md" radius="md" bg="gray.0">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Selected Message</Text>
              <Group gap="xs">
                {projectMessages.length === 1 && (
                  <Badge size="sm" variant="filled" color="green">
                    Auto-selected
                  </Badge>
                )}
                <Badge size="sm" variant="light" color="violet">
                  {selectedProject?.name}
                </Badge>
              </Group>
            </Group>
            <Divider />
            <Box>
              <Stack gap={4}>
                <Group gap="xs">
                  {selectedMessage.version && (
                    <Badge size="sm" variant="filled" color="violet">
                      BM v{selectedMessage.version}
                    </Badge>
                  )}
                  {selectedMessage.productDetails?.majorVersion !== undefined && selectedMessage.productDetails?.minorVersion !== undefined && (
                    <Badge size="sm" variant="light" color="blue">
                      Product v{selectedMessage.productDetails.majorVersion}.{selectedMessage.productDetails.minorVersion}
                    </Badge>
                  )}
                </Group>
                <Text size="sm" fw={500}>
                  {selectedMessage.productDetails?.productShortName || selectedMessage.details?.inputPayload?.businessName || selectedMessage.businessName || 'Brand Message'}
                </Text>
                {selectedMessage.productDetails?.productName && (
                  <Text size="xs" c="dimmed" mt={4} lineClamp={2}>
                    {selectedMessage.productDetails.productName}
                  </Text>
                )}
              </Stack>
            </Box>
          </Stack>
        </Card>
      )}

      <CopyTypeSelector
        value={form.values.copyType}
        onChange={handleCopyTypeChange}
        platform={form.values.platform}
      />
    </Stack>
  );

  const Step2Channel = () => (
    <Stack gap="lg">
      <PlatformSelector
        value={form.values.platform}
        onChange={handlePlatformChange}
        copyType={form.values.copyType}
      />

      <LanguageSelector
        value={form.values.language}
        onChange={handleLanguageChange}
      />
    </Stack>
  );

  // Memoize the writing style onChange handler to prevent re-renders
  const handleWritingStyleChange = useCallback((styleId, styleSample) => {
    form.setFieldValue('writingStyleId', styleId);
    form.setFieldValue('writingStyleSample', styleSample || '');
  }, [form]);

  const Step3Customize = useMemo(() => (
    <Stack gap="lg">
      <Textarea
        label="Topic/Theme (Optional)"
        description="Specific direction for your copy"
        placeholder="e.g., Summer sale announcement with focus on limited time offers"
        rows={3}
        maxLength={1000}
        {...form.getInputProps('topicSample')}
      />

      <WritingStyleSelector
        value={form.values.writingStyleId}
        onChange={handleWritingStyleChange}
        projectId={selectedProjectId}
      />

      <Select
        label="Number of Variations"
        placeholder="Select variations"
        size="md"
        data={[
          { value: '1', label: '1 variation' },
          { value: '2', label: '2 variations' },
          { value: '3', label: '3 variations' },
          { value: '4', label: '4 variations' },
          { value: '5', label: '5 variations' },
          { value: '6', label: '6 variations' },
          { value: '7', label: '7 variations' },
          { value: '8', label: '8 variations' },
          { value: '9', label: '9 variations' },
          { value: '10', label: '10 variations' }
        ]}
        value={String(form.values.numberOfPosts)}
        onChange={(value) => form.setFieldValue('numberOfPosts', parseInt(value))}
      />
    </Stack>
  ), [form.values.writingStyleId, form.values.numberOfPosts, form.values.topicSample, handleWritingStyleChange, selectedProjectId]);

  const Step4Action = () => (
    <Stack gap="lg">
      <CTASelector
        value={form.values.callToActionType}
        onChange={(value) => form.setFieldValue('callToActionType', value)}
        copyType={form.values.copyType}
        platform={form.values.platform}
      />
    </Stack>
  );

  const Step5Review = () => {
    const copyTypeDetails = getCopyTypeDetails(form.values.copyType);
    const ctaDetails = getCTAInstructions(form.values.callToActionType);

    return (
      <Stack gap="lg">
        <Alert color="blue" variant="light" icon={<IconInfo size={16} />}>
          <Text size="sm">
            Review your configuration below. Click on any section to edit.
          </Text>
        </Alert>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Card withBorder p="md" radius="md" style={{ cursor: 'pointer' }} onClick={() => goToStep(0)}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Foundation</Text>
                <ActionIcon size="sm" variant="subtle">
                  <IconEdit size={14} />
                </ActionIcon>
              </Group>
              <Divider />
              <Box>
                <Text size="xs" c="dimmed">Project</Text>
                <Text size="sm" fw={500}>{selectedProject?.name}</Text>
              </Box>
              <Box>
                <Text size="xs" c="dimmed">Brand Message</Text>
                <Text size="sm" fw={500} lineClamp={1}>
                  {(() => {
                    const msg = messages.find(m => m._id === form.values.brandMessageId);
                    const name = msg?.productDetails?.productShortName || msg?.details?.inputPayload?.businessName || 'Selected';
                    const bmVersion = msg?.version;
                    
                    if (bmVersion) {
                      return `BM v${bmVersion} - ${name}`;
                    }
                    return name;
                  })()}
                </Text>
              </Box>
              <Box>
                <Text size="xs" c="dimmed">Copy Type</Text>
                <Group gap={4}>
                  <Text size="sm" fw={500}>
                    {copyTypeDetails?.icon} {copyTypeDetails?.title}
                  </Text>
                  <Badge size="xs" variant="dot" color={copyTypeDetails?.color}>
                    {copyTypeDetails?.funnelStage}
                  </Badge>
                </Group>
              </Box>
            </Stack>
          </Card>

          <Card withBorder p="md" radius="md" style={{ cursor: 'pointer' }} onClick={() => goToStep(1)}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Channel</Text>
                <ActionIcon size="sm" variant="subtle">
                  <IconEdit size={14} />
                </ActionIcon>
              </Group>
              <Divider />
              <Box>
                <Text size="xs" c="dimmed">Platform</Text>
                <Text size="sm" fw={500}>{formatPlatformName(form.values.platform)}</Text>
              </Box>
              <Box>
                <Text size="xs" c="dimmed">Language</Text>
                <Text size="sm" fw={500}>
                  {form.values.language.charAt(0) + form.values.language.slice(1).toLowerCase()}
                </Text>
              </Box>
            </Stack>
          </Card>

          <Card withBorder p="md" radius="md" style={{ cursor: 'pointer' }} onClick={() => goToStep(2)}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Customization</Text>
                <ActionIcon size="sm" variant="subtle">
                  <IconEdit size={14} />
                </ActionIcon>
              </Group>
              <Divider />
              {form.values.topicSample && (
                <Box>
                  <Text size="xs" c="dimmed">Topic</Text>
                  <Text size="sm" fw={500} lineClamp={1}>
                    {form.values.topicSample}
                  </Text>
                </Box>
              )}
              <Box>
                <Text size="xs" c="dimmed">Writing Style</Text>
                <Text size="sm" fw={500}>
                  {form.values.writingStyleId || 'Default'}
                </Text>
              </Box>
              <Box>
                <Text size="xs" c="dimmed">Variations</Text>
                <Text size="sm" fw={500}>{form.values.numberOfPosts}</Text>
              </Box>
            </Stack>
          </Card>

          <Card withBorder p="md" radius="md" style={{ cursor: 'pointer' }} onClick={() => goToStep(3)}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Call to Action</Text>
                <ActionIcon size="sm" variant="subtle">
                  <IconEdit size={14} />
                </ActionIcon>
              </Group>
              <Divider />
              <Box>
                <Text size="xs" c="dimmed">CTA Type</Text>
                <Group gap={4}>
                  <Text size="sm" fw={500}>
                    {ctaDetails?.icon} {form.values.callToActionType.replace(/_/g, ' ')}
                  </Text>
                  <Badge size="xs" variant="filled" color={ctaDetails?.color}>
                    {ctaDetails?.urgency} Urgency
                  </Badge>
                </Group>
              </Box>
            </Stack>
          </Card>
        </SimpleGrid>

        <Alert color="green" variant="light" icon={<IconSparkles size={16} />}>
          <Text size="sm">
            Ready to generate your {copyTypeDetails?.title?.toLowerCase()} copy 
            for {formatPlatformName(form.values.platform)} with 
            a {ctaDetails?.approach?.toLowerCase()} approach!
          </Text>
        </Alert>
      </Stack>
    );
  };

  const stepperItems = [
    {
      label: 'Foundation',
      description: 'Brand & Type',
      icon: <IconFoundation size={18} />,
      content: <Step1Foundation />
    },
    {
      label: 'Channel',
      description: 'Platform & Language',
      icon: <IconStrategy size={18} />,
      content: <Step2Channel />
    },
    {
      label: 'Customize',
      description: 'Style & Content',
      icon: <IconCustomize size={18} />,
      content: Step3Customize
    },
    {
      label: 'Action',
      description: 'Call to Action',
      icon: <IconAction size={18} />,
      content: <Step4Action />
    },
    {
      label: 'Review',
      description: 'Generate Copy',
      icon: <IconReview size={18} />,
      content: <Step5Review />
    }
  ];

  // Show loading skeleton during initial data fetch
  if (initialLoading) {
    return (
      <PageTransition>
        <Stack gap="xl">
          <Box>
            <Skeleton height={40} width="50%" mb="xs" />
            <Skeleton height={20} width="70%" />
          </Box>
          <Paper shadow="xs" p="lg" radius="md">
            <Skeleton height={80} />
          </Paper>
          <Paper shadow="sm" p={{ base: 'sm', sm: 'lg', md: 'xl' }} radius="md" withBorder>
            <Skeleton height={30} mb="md" />
            <Stack gap="lg">
              <Skeleton height={60} />
              <Skeleton height={200} />
              <Skeleton height={100} />
            </Stack>
          </Paper>
        </Stack>
      </PageTransition>
    );
  }

  return (
    <PageTransition>

      <Stack gap="lg">
        <Box mb={{ base: 'md', sm: 'xl' }}>
          <Title order={2}>Generate Marketing Copy</Title>
          <Text c="dimmed" size="sm" mt={4}>
            Create AI-powered marketing content in 5 simple steps
          </Text>
        </Box>

        {/* Desktop Stepper */}
        {!isMobile && (
          <Paper shadow="xs" p="lg" radius="md" mb="xl">
            <Stepper 
              active={active} 
              onStepClick={goToStep}
              size="sm"
              color="violet"
              completedIcon={<IconComplete size={18} />}
            >
              {stepperItems.map((step, index) => (
                <Stepper.Step
                  key={index}
                  label={step.label}
                  description={step.description}
                  icon={step.icon}
                  color={completedSteps.has(index) ? 'green' : undefined}
                  allowStepSelect={index <= active || completedSteps.has(index - 1)}
                />
              ))}
            </Stepper>
          </Paper>
        )}

        {/* Mobile Progress */}
        {isMobile && (
          <Box mb="md">
            <Progress 
              value={((active + 1) / stepperItems.length) * 100} 
              size="lg" 
              radius="xl"
              color="violet"
              animated
              label={`Step ${active + 1} of ${stepperItems.length}`}
              styles={{
                label: { fontSize: 12, fontWeight: 600 }
              }}
            />
          </Box>
        )}

        {/* Content Area */}
        <Paper shadow="sm" p={{ base: 'sm', sm: 'lg', md: 'xl' }} radius="md" withBorder>
          <Box mb="xl">
            <Group justify="space-between" mb="xs">
              <Title order={3}>{stepperItems[active].label}</Title>
              {completedSteps.has(active) && (
                <Badge color="green" variant="light" leftSection={<IconCheck size={12} />}>
                  Completed
                </Badge>
              )}
            </Group>
            <Text c="dimmed" size="sm">
              {stepperItems[active].description}
            </Text>
          </Box>

          <Transition
            mounted={true}
            transition="fade"
            duration={200}
            timingFunction="ease"
          >
            {(styles) => (
              <div style={styles}>
                {stepperItems[active].content}
              </div>
            )}
          </Transition>

          <Divider my="xl" />

          {/* Navigation */}
          <Group justify="space-between">
            <Button
              variant="default"
              onClick={active === 0 ? () => navigate('/copies') : prevStep}
              leftSection={<IconBack size={16} />}
            >
              {active === 0 ? 'Cancel' : 'Back'}
            </Button>

            <Group gap="xs">
              {!isMobile && (
                <Text size="sm" c="dimmed">
                  Step {active + 1} of {stepperItems.length}
                </Text>
              )}
              
              {active < stepperItems.length - 1 ? (
                <Button
                  onClick={nextStep}
                  rightSection={<IconNext size={16} />}
                  color="violet"
                  disabled={
                    (active === 0 && (!form.values.brandMessageId || !form.values.copyType)) ||
                    (active === 1 && (!form.values.platform || !form.values.language)) ||
                    (active === 3 && !form.values.callToActionType)
                  }
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  color="green"
                  size="md"
                  leftSection={<IconSend size={16} />}
                >
                  Generate Copy
                </Button>
              )}
            </Group>
          </Group>
        </Paper>
      </Stack>

    </PageTransition>
  );
};

export default CopyFormWizard;