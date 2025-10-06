import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  Stack,
  Box,
  Card,
  Badge,
  ActionIcon,
  Grid,
  ThemeIcon,
  Divider,
  Alert,
  LoadingOverlay,
  Center,
  Loader,
  NumberInput,
  SimpleGrid,
  List,
  Paper,
  Progress,
  Tooltip,
  Skeleton,
  Modal
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  MdArrowBack as IconArrowLeft,
  MdAutoAwesome as IconSparkles,
  MdSend as IconSend,
  MdBusiness as IconBusiness,
  MdStore as IconStore,
  MdPeople as IconPeople,
  MdMonetizationOn as IconMoney,
  MdCheckCircle as IconCheck,
  MdInfo as IconInfo,
  MdLightbulb as IconBulb,
  MdRocket as IconRocket,
  MdInventory as IconProduct,
  MdTrendingUp as IconTrending
} from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import { format } from 'date-fns';
import { useBrandMessages } from '../../hooks/useBrandMessages';
import { useProjects } from '../../hooks/useProjects';
import { useProjectProducts } from '../../hooks/useProjectProducts';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { PageTransition, LoadingDots } from '../../components/ui/AnimatedElements';
import ProjectSelectionModal from '../../components/common/ProjectSelectionModal';

const BrandMessageForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const urlProjectId = searchParams.get('projectId');
  const urlProductId = searchParams.get('productId');
  
  const { user } = useAuth();
  const { generateMessage, creating, error, clearError } = useBrandMessages();
  const { projects, loadProjects, loading: loadingProjects } = useProjects();
  const { toast } = useNotifications();
  
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    return localStorage.getItem('selectedProjectId') || urlProjectId || '';
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState(null);
  
  // Use the hook with selected project
  const { versions, loading: loadingProducts, loadProducts } = useProjectProducts(selectedProjectId);

  // Projects are loaded by Navigation component, no need to load here

  // Check for project selection and load products
  useEffect(() => {
    const projectId = localStorage.getItem('selectedProjectId');
    if (!projectId && projects.length > 0) {
      setShowProjectModal(true);
    } else if (projectId) {
      setSelectedProjectId(projectId);
      loadProducts();
    }
  }, [projects, loadProducts]);

  // Load products when project changes
  useEffect(() => {
    if (selectedProjectId) {
      loadProducts();
    }
  }, [selectedProjectId, loadProducts]);

  // Listen for localStorage changes (from Navigation header)
  useEffect(() => {
    const handleStorageChange = () => {
      const newProjectId = localStorage.getItem('selectedProjectId');
      if (newProjectId !== selectedProjectId) {
        setSelectedProjectId(newProjectId);
        setSelectedProductId('');
        setSelectedProduct(null);
      }
    };

    // Check for changes periodically (storage event doesn't fire in same tab)
    const interval = setInterval(handleStorageChange, 500);
    
    return () => clearInterval(interval);
  }, [selectedProjectId]);

  // Debug: Log versions when they change
  useEffect(() => {
    console.log('Versions for project', selectedProjectId, ':', versions);
  }, [versions, selectedProjectId]);

  const [selectedProductId, setSelectedProductId] = useState(urlProductId || '');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Update selected product when selection changes
  useEffect(() => {
    if (selectedProductId && versions.length > 0) {
      const product = versions.find(v => v._id === selectedProductId);
      console.log('Selected product:', product);
      setSelectedProduct(product);
      
      // If coming from URL params, automatically show review modal
      if (urlProductId && selectedProductId === urlProductId && product) {
        setShowReviewModal(true);
      }
    }
  }, [selectedProductId, versions, urlProductId]);

  const handleProductSelect = (productId) => {
    setSelectedProductId(productId);
    const product = versions.find(v => v._id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowReviewModal(true);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProductId) {
      toast('Please select a product first', 'error');
      return;
    }

    try {
      const result = await generateMessage({ productId: selectedProductId });
      setGeneratedMessage(result.brandMessage);
      setShowReviewModal(false);
      toast('Brand message generated successfully!', 'success');
      // Navigate to brand messages list after successful generation
      navigate('/brand-messages');
    } catch (error) {
      console.error('Brand message generation error:', error);

      // Close the modal on error
      setShowReviewModal(false);

      // Check if it's an insufficient credits error
      const errorMessage = error.message || 'Failed to generate brand message';
      const isCreditsError = errorMessage.toLowerCase().includes('insufficient credits') ||
                            errorMessage.toLowerCase().includes('required:') ||
                            error.details?.action === 'recharge_credits';

      // Show error message
      toast(errorMessage, 'error');

      // Auto-redirect to billing for credit/subscription errors
      if (errorMessage.includes('subscription') || isCreditsError) {
        setTimeout(() => {
          navigate('/settings/billing');
        }, 1500);
      }
    }
  };

  const handleNewMessage = () => {
    setGeneratedMessage(null);
    setSelectedProductId('');
    setSelectedProduct(null);
    setShowReviewModal(false);
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    localStorage.setItem('selectedProjectId', projectId);
    setShowProjectModal(false);
    setSelectedProductId('');
    setSelectedProduct(null);
  };

  // Clear error on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  if (generatedMessage) {
    return (
      <PageTransition>
        <Stack gap="lg">
            {/* Success Header */}
            <Box
              style={{
                textAlign: 'center'
              }}
            >
              <ThemeIcon size={60} radius="xl" variant="light" color="green" mb="md">
                <IconCheck size={30} />
              </ThemeIcon>
              <Title order={2} mb="xs">Brand Message Generated!</Title>
              <Text c="dimmed">Your AI-powered brand message is ready to use</Text>
            </Box>

            {/* Generated Content */}
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <Stack gap="lg">
                  {/* Brand Message */}
                  <Card shadow="sm" p="lg" radius="lg" withBorder>
                    <Group mb="md">
                      <ThemeIcon size="md" variant="light" color="violet">
                        <IconSparkles size={20} />
                      </ThemeIcon>
                      <Title order={4}>Brand Message</Title>
                    </Group>
                    <Stack gap="md">
                      <Box>
                        <Text size="sm" fw={500} c="dimmed" mb="xs">Headline</Text>
                        <Text size="lg" fw={600}>
                          {generatedMessage.details?.generatedContent?.brandMessage?.landing_page?.hero_section?.headline}
                        </Text>
                      </Box>
                      <Box>
                        <Text size="sm" fw={500} c="dimmed" mb="xs">Subheadline</Text>
                        <Text>
                          {generatedMessage.details?.generatedContent?.brandMessage?.landing_page?.hero_section?.subheadline}
                        </Text>
                      </Box>
                    </Stack>
                  </Card>

                  {/* Value Proposition */}
                  <Card shadow="sm" p="lg" radius="lg" withBorder>
                    <Group mb="md">
                      <ThemeIcon size="md" variant="light" color="blue">
                        <IconBulb size={20} />
                      </ThemeIcon>
                      <Title order={4}>Value Proposition</Title>
                    </Group>
                    <Text>
                      {generatedMessage.details?.generatedContent?.brandMessage?.landing_page?.value_proposition?.main_statement}
                    </Text>
                  </Card>

                  {/* Actionable Insights */}
                  <Card shadow="sm" p="lg" radius="lg" withBorder>
                    <Group mb="md">
                      <ThemeIcon size="md" variant="light" color="orange">
                        <IconTrending size={20} />
                      </ThemeIcon>
                      <Title order={4}>Actionable Insights</Title>
                    </Group>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                      <Box>
                        <Text size="sm" fw={500} c="dimmed" mb="xs">Marketing Channels</Text>
                        <Stack gap="xs">
                          {generatedMessage.details?.generatedContent?.actionable_insights?.marketing_channels?.map((channel, i) => (
                            <Badge key={i} variant="light" size="lg">{channel}</Badge>
                          ))}
                        </Stack>
                      </Box>
                      <Box>
                        <Text size="sm" fw={500} c="dimmed" mb="xs">Key Messaging Points</Text>
                        <List size="sm" spacing="xs">
                          {generatedMessage.details?.generatedContent?.actionable_insights?.key_messaging_points?.slice(0, 3).map((point, i) => (
                            <List.Item key={i}>{point}</List.Item>
                          ))}
                        </List>
                      </Box>
                    </SimpleGrid>
                  </Card>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Stack gap="lg">
                  {/* Actions */}
                  <Card shadow="sm" p="lg" radius="lg" withBorder>
                    <Stack gap="sm">
                      <Button
                        component={Link}
                        to={`/brand-messages/${generatedMessage._id}`}
                        leftSection={<IconRocket size={18} />}
                        size="md"
                        variant="gradient"
                        gradient={{ from: 'violet', to: 'grape', deg: 135 }}
                        fullWidth
                      >
                        View Full Details
                      </Button>
                      <Button
                        leftSection={<IconSparkles size={18} />}
                        variant="light"
                        onClick={handleNewMessage}
                        fullWidth
                      >
                        Generate Another
                      </Button>
                      <Button
                        component={Link}
                        to="/brand-messages"
                        variant="subtle"
                        fullWidth
                      >
                        Back to Messages
                      </Button>
                    </Stack>
                  </Card>

                  {/* Product Info */}
                  <Card shadow="sm" p="lg" radius="lg" withBorder>
                    <Text fw={600} mb="md">Product Information</Text>
                    <Stack gap="sm">
                      <Box>
                        <Text size="xs" c="dimmed">Product Name</Text>
                        <Text size="sm">{selectedProduct?.shortName || 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text size="xs" c="dimmed">Product Description</Text>
                        <Text size="sm">{selectedProduct?.product || 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text size="xs" c="dimmed">Target Audience</Text>
                        <Text size="sm">{selectedProduct?.targetAudience || 'N/A'}</Text>
                      </Box>
                    </Stack>
                  </Card>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
      </PageTransition>
    );
  }

  // Review Modal Component
  const ReviewModal = () => (
    <Modal
      opened={showReviewModal}
      onClose={() => setShowReviewModal(false)}
      title={
        <Group>
          <ThemeIcon size="lg" variant="light" color="violet" radius="xl">
            <IconSparkles size={24} />
          </ThemeIcon>
          <Text fw={600} size="lg">Review Product Details</Text>
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          Confirm the information before generating your brand message
        </Text>

        {selectedProduct && (
          <>
            {/* Product Name */}
            <Box>
              <Group gap="xs" mb="xs">
                <IconBusiness size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
                <Text size="sm" fw={500} c="dimmed">Product Name</Text>
              </Group>
              <Card p="md" withBorder bg="gray.0">
                <Text>{selectedProduct.shortName || 'Not specified'}</Text>
              </Card>
            </Box>

            {/* Product Description */}
            <Box>
              <Group gap="xs" mb="xs">
                <IconStore size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
                <Text size="sm" fw={500} c="dimmed">Product Description</Text>
              </Group>
              <Card p="md" withBorder bg="gray.0">
                <Text>{selectedProduct.product || 'Not specified'}</Text>
              </Card>
            </Box>

            {/* Target Audience */}
            <Box>
              <Group gap="xs" mb="xs">
                <IconPeople size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
                <Text size="sm" fw={500} c="dimmed">Target Audience</Text>
              </Group>
              <Card p="md" withBorder bg="gray.0">
                <Text>{selectedProduct.targetAudience || 'Not specified'}</Text>
              </Card>
            </Box>

            {/* Problem You Solve */}
            <Box>
              <Group gap="xs" mb="xs">
                <IconBulb size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
                <Text size="sm" fw={500} c="dimmed">Problem You Solve</Text>
              </Group>
              <Card p="md" withBorder bg="gray.0">
                <Text>{selectedProduct.problemYouSolve || 'Not specified'}</Text>
              </Card>
            </Box>

            {/* Price Range */}
            <Box>
              <Group gap="xs" mb="xs">
                <IconMoney size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
                <Text size="sm" fw={500} c="dimmed">Price Range</Text>
              </Group>
              <Card p="md" withBorder bg="gray.0">
                <Badge size="lg" variant="light" color="violet">
                  {selectedProduct.priceRange || 'Not specified'}
                </Badge>
              </Card>
            </Box>

            {/* Version Info */}
            <Box>
              <Text size="sm" fw={500} c="dimmed" mb="xs">Version Information</Text>
              <Group gap="xl">
                <Box>
                  <Text size="xs" c="dimmed">Version</Text>
                  <Text size="sm">{selectedProduct.version || `${selectedProduct.majorVersion}.${selectedProduct.minorVersion}`}</Text>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">Status</Text>
                  <Badge variant="light" color="green">
                    {selectedProduct.status || 'Active'}
                  </Badge>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">Created</Text>
                  <Text size="sm">{selectedProduct.createdAt ? format(new Date(selectedProduct.createdAt), 'MMM d, yyyy') : 'N/A'}</Text>
                </Box>
              </Group>
            </Box>
          </>
        )}

        {error && (
          <Alert icon={<IconInfo />} color="red" onClose={() => clearError()}>
            {typeof error === 'string' ? error : error?.message || 'An error occurred'}
          </Alert>
        )}

        <Divider />

        <Group justify="flex-end">
          <Button
            variant="subtle"
            onClick={() => setShowReviewModal(false)}
          >
            Cancel
          </Button>
          <Button
            size="md"
            variant="gradient"
            gradient={{ from: 'violet', to: 'grape', deg: 135 }}
            leftSection={<IconSparkles size={18} />}
            onClick={handleSubmit}
            loading={creating}
          >
            Generate Brand Message
          </Button>
        </Group>
      </Stack>
    </Modal>
  );


  return (
    <PageTransition>
      <Stack gap="lg">
        {/* Header */}
        <Box mb="md">
          <Title order={2} fw={700} mb={4}>Generate Brand Message</Title>
          <Text c="dimmed" size="sm">
            Create AI-powered brand messaging tailored to your product
          </Text>
        </Box>

          {/* Review Modal */}
          <ReviewModal />

          {/* Project Selection Modal */}
          <ProjectSelectionModal
            opened={showProjectModal}
            onClose={() => {
              if (selectedProjectId) {
                setShowProjectModal(false);
              } else {
                // If no project is selected, navigate back
                navigate('/brand-messages');
              }
            }}
            onSelect={handleProjectSelect}
            projects={projects}
            selectedProjectId={selectedProjectId}
            description="Please select a project to generate brand messages for"
            noProjectsMessage="You need to create a project first before generating brand messages."
            allowClose={false}
          />

          {/* Select Project and Product */}
          <Grid gutter="lg">
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <Card shadow="sm" p="lg" radius="lg" withBorder>
                  <Stack gap="lg">
                      <Group mb="md">
                        <ThemeIcon size="lg" variant="light" color="blue" radius="xl">
                          <IconProduct size={24} />
                        </ThemeIcon>
                        <Box>
                          <Text fw={600}>Select Product Version</Text>
                          <Text size="sm" c="dimmed">Choose which product to create messaging for</Text>
                        </Box>
                      </Group>
                      {selectedProjectId ? (
                        loadingProducts ? (
                          <Stack gap="sm">
                            {[1, 2, 3].map((i) => (
                              <Skeleton key={i} height={80} radius="md" />
                            ))}
                          </Stack>
                        ) : versions.length === 0 ? (
                          <Alert icon={<IconInfo />} color="blue">
                            No products found in this project. Please create a product version first.
                          </Alert>
                        ) : (
                          <Stack gap="sm">
                            {versions.map((version) => {
                              console.log('Rendering version:', version);
                              return (
                                <Card
                                  key={version._id}
                                  p="md"
                                  radius="md"
                                  withBorder
                                  style={{
                                    cursor: 'pointer',
                                    borderColor: selectedProductId === version._id ? 'var(--mantine-color-violet-5)' : undefined,
                                    transition: 'all 0.2s ease'
                                  }}
                                  onClick={() => handleProductSelect(version._id)}
                                >
                                  <Group justify="space-between" align="flex-start">
                                    <Box style={{ flex: 1 }}>
                                      <Text fw={600}>{version.shortName || version.product || 'Untitled Product'}</Text>
                                      <Text size="sm" c="dimmed" lineClamp={2}>
                                        {version.product || version.description || 'No description available'}
                                      </Text>
                                      <Badge size="xs" variant="light" color="blue" mt={4}>
                                        v{version.version}
                                      </Badge>
                                    </Box>
                                    {selectedProductId === version._id && (
                                      <ThemeIcon size="sm" color="violet" radius="xl">
                                        <IconCheck size={16} />
                                      </ThemeIcon>
                                    )}
                                  </Group>
                                </Card>
                              );
                            })}
                          </Stack>
                        )
                      ) : (
                        <Alert icon={<IconInfo />} color="blue">
                          Please select a project from the header to view available products.
                        </Alert>
                      )}
                  </Stack>
                </Card>
              </Grid.Col>

              {/* Sidebar for Step 1 */}
              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Stack gap="lg">
                  <Card shadow="sm" p="lg" radius="lg" withBorder>
                    <Text fw={600} mb="md">What is a Brand Message?</Text>
                    <Text size="sm" c="dimmed" mb="md">
                      A brand message is a comprehensive AI-generated content package that includes:
                    </Text>
                    <List size="sm" spacing="sm" style={{ paddingRight: '8px' }}>
                      <List.Item>Landing page content with headlines and CTAs</List.Item>
                      <List.Item>Value propositions and benefit statements</List.Item>
                      <List.Item>Social media posts and ad copy</List.Item>
                      <List.Item>Email subject lines and content</List.Item>
                      <List.Item>Marketing insights and channel recommendations</List.Item>
                    </List>
                  </Card>

                  <Card shadow="sm" p="lg" radius="lg" withBorder>
                    <Group mb="md">
                      <ThemeIcon size="md" variant="light" color="violet">
                        <IconInfo size={20} />
                      </ThemeIcon>
                      <Text fw={600}>Quick Tip</Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      Select the product version that best represents your current offering. The AI will use this information to create targeted messaging.
                    </Text>
                  </Card>
                </Stack>
              </Grid.Col>
            </Grid>

      </Stack>
    </PageTransition>
  );
};

export default BrandMessageForm;