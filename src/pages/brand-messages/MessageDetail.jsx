import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Group,
  Button,
  Stack,
  Box,
  Badge,
  ActionIcon,
  Tabs,
  Grid,
  Card,
  ThemeIcon,
  Divider,
  Menu,
  List,
  Alert,
  CopyButton,
  Center,
  Loader,
  SimpleGrid,
  Accordion,
  Skeleton,
  Code,
  ScrollArea,
  Collapse,
  Anchor,
  Paper,
  Tooltip,
  Select,
  Timeline
} from '@mantine/core';
import {
  MdArrowBack as IconArrowLeft,
  MdDelete as IconDelete,
  MdShare as IconShare,
  MdContentCopy as IconCopy,
  MdMoreVert as IconDots,
  MdRemoveRedEye as IconEye,
  MdThumbUp as IconThumbUp,
  MdCalendarToday as IconCalendar,
  MdPerson as IconUser,
  MdFolder as IconFolder,
  MdLocalOffer as IconTag,
  MdEmail as IconEmail,
  MdPhone as IconPhone,
  MdLanguage as IconWeb,
  MdCheck as IconCheck,
  MdBusiness as IconBusiness,
  MdStore as IconStore,
  MdPeople as IconPeople,
  MdMonetizationOn as IconMoney,
  MdAutoAwesome as IconAI,
  MdCampaign as IconCampaign,
  MdInsights as IconInsights,
  MdRocket as IconRocket,
  MdArticle as IconArticle,
  MdExpandMore as IconExpand,
  MdExpandLess as IconCollapse,
  MdStar as IconStar,
  MdStarBorder as IconStarOutline,
  MdQuestionAnswer as IconQuestion,
  MdTrendingUp as IconTrending,
  MdGroup as IconGroup,
  MdSchool as IconSchool,
  MdPlayCircle as IconPlay,
  MdWarning as IconWarning,
  MdCheckCircle as IconSuccess
} from 'react-icons/md';
import { HiSparkles as IconSparkles } from 'react-icons/hi';
import { useBrandMessages } from '../../hooks/useBrandMessages';
import { useProjects } from '../../hooks/useProjects';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import { PageTransition } from '../../components/ui/AnimatedElements';

const MessageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentMessage, loading, loadMessageById, removeMessage, clearCurrent } = useBrandMessages();
  const { projects } = useProjects();
  const { toast } = useNotifications();
  const { user } = useAuth();

  const [expandedSections, setExpandedSections] = useState({});

  const project = currentMessage ? projects.find(p => p.id === currentMessage.projectId) : null;

  // Helper function to safely format dates
  const formatDate = (dateValue) => {
    if (!dateValue) return 'Date not available';
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return 'Invalid date';
    return format(date, 'MMM d, yyyy h:mm a');
  };

  useEffect(() => {
    if (id) {
      loadMessageById(id);
    }
    return () => clearCurrent();
  }, [id, loadMessageById, clearCurrent]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <Stack gap="lg">
        <Skeleton height={60} radius="md" />
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Skeleton height={600} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="lg">
              <Skeleton height={200} radius="md" />
              <Skeleton height={300} radius="md" />
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    );
  }

  if (!currentMessage) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Text>Brand message not found</Text>
          <Button onClick={() => navigate('/brand-messages')}>Back to Messages</Button>
        </Stack>
      </Center>
    );
  }

  const brandMessage = currentMessage.details?.generatedContent?.brandMessage;
  const actionableInsights = currentMessage.details?.generatedContent?.actionableInsights;
  const contentTemplates = currentMessage.details?.generatedContent?.contentTemplates;
  const enhancedInfo = currentMessage.details?.generatedContent?.enhancedInfo || currentMessage.details?.processingData?.enhancedInfo;
  const inputPayload = currentMessage.details?.inputPayload || {};

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this brand message?')) {
      try {
        await removeMessage(id);
        toast('Brand message deleted successfully', 'success');
        navigate('/brand-messages');
      } catch (error) {
        toast('Failed to delete brand message', 'error');
      }
    }
  };

  const handleCopyContent = (content, label) => {
    navigator.clipboard.writeText(content);
    toast(`${label} copied to clipboard`, 'success');
  };

  // Helper to format section content for copying
  const formatSectionForCopy = (title, data) => {
    if (!data) return null;
    
    let content = `${title.toUpperCase()}\n\n`;
    
    // Handle different data structures
    Object.entries(data).forEach(([key, value]) => {
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      if (Array.isArray(value)) {
        if (value.length > 0) {
          if (typeof value[0] === 'object') {
            // Array of objects (like features, testimonials)
            content += `${formattedKey}:\n`;
            value.forEach((item, i) => {
              if (item.description) {
                content += `${i + 1}. ${item.icon || ''} ${item.description}\n`;
              } else if (item.review) {
                content += `${i + 1}. "${item.review}" - ${item.customer || 'Customer'}\n`;
              } else if (item.question && item.answer) {
                content += `Q: ${item.question}\nA: ${item.answer}\n\n`;
              } else if (typeof item === 'string') {
                content += `• ${item}\n`;
              }
            });
            content += '\n';
          } else {
            // Array of strings
            content += `${formattedKey}:\n${value.map(v => `• ${v}`).join('\n')}\n\n`;
          }
        }
      } else if (typeof value === 'string' && value) {
        content += `${formattedKey}: ${value}\n\n`;
      } else if (typeof value === 'object' && value) {
        // Nested object
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (typeof subValue === 'string' && subValue) {
            const formattedSubKey = subKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            content += `${formattedSubKey}: ${subValue}\n`;
          }
        });
        content += '\n';
      }
    });
    
    return content.trim();
  };

  const handleCopyAll = () => {
    let content = '';
    
    if (copyType === 'all' || copyType === 'landing') {
      const landing = brandMessage?.landing_page;
      if (landing) {
        content += `HERO SECTION\n`;
        content += `Headline: ${landing.hero_section?.headline || ''}\n`;
        content += `Subheadline: ${landing.hero_section?.subheadline || ''}\n\n`;
        
        content += `PROBLEM AGITATION\n${landing.problem_agitation_section?.content || ''}\n\n`;
        
        content += `VALUE PROPOSITION\n${landing.value_proposition?.main_statement || ''}\n\n`;
        
        if (landing.value_proposition?.supporting_points?.length > 0) {
          content += `Supporting Points:\n`;
          landing.value_proposition.supporting_points.forEach(point => {
            content += `- ${point}\n`;
          });
          content += '\n';
        }
      }
    }
    
    if (copyType === 'all' || copyType === 'templates') {
      if (contentTemplates) {
        content += `\nCONTENT TEMPLATES\n\n`;
        
        if (contentTemplates.social_media_posts?.length > 0) {
          content += `Social Media Posts:\n`;
          contentTemplates.social_media_posts.forEach((post, i) => {
            content += `${i + 1}. ${post}\n`;
          });
          content += '\n';
        }
        
        if (contentTemplates.email_subject_lines?.length > 0) {
          content += `Email Subject Lines:\n`;
          contentTemplates.email_subject_lines.forEach((line, i) => {
            content += `${i + 1}. ${line}\n`;
          });
          content += '\n';
        }
      }
    }
    
    if (content) {
      navigator.clipboard.writeText(content);
      toast('Content copied to clipboard', 'success');
    }
  };

  // Content Sections Component
  const ContentSection = ({ title, icon, children, section, copyContent }) => {
    const isExpanded = expandedSections[section] !== false;
    
    return (
      <Card shadow="sm" p="lg" radius="lg" withBorder>
        <Group 
          justify="space-between" 
          mb={isExpanded ? "md" : 0}
        >
          <Group 
            gap="xs" 
            style={{ cursor: 'pointer', flex: 1 }}
            onClick={() => toggleSection(section)}
          >
            <ThemeIcon size="md" variant="light" color="violet">
              {icon}
            </ThemeIcon>
            <Text fw={600}>{title}</Text>
          </Group>
          <Group gap="xs">
            {copyContent && isExpanded && (
              <ActionIcon
                variant="light"
                color="violet"
                onClick={() => {
                  navigator.clipboard.writeText(copyContent);
                  toast('Section content copied to clipboard', 'success');
                }}
                title="Copy section content"
              >
                <IconCopy size={16} />
              </ActionIcon>
            )}
            <ActionIcon 
              variant="subtle"
              onClick={() => toggleSection(section)}
            >
              {isExpanded ? <IconCollapse size={18} /> : <IconExpand size={18} />}
            </ActionIcon>
          </Group>
        </Group>
        <Collapse in={isExpanded}>
          <Box>{children}</Box>
        </Collapse>
      </Card>
    );
  };

  // Get product and version information
  const productShortName = currentMessage?.productDetails?.productShortName || currentMessage?.details?.inputPayload?.businessName || 'Unknown Business';
  const productVersion = currentMessage?.productDetails?.majorVersion !== undefined && currentMessage?.productDetails?.minorVersion !== undefined
    ? `${currentMessage.productDetails.majorVersion}.${currentMessage.productDetails.minorVersion}`
    : null;
  const bmVersion = currentMessage?.version;

  return (
    <PageTransition>
      <Stack gap="lg">
        {/* Header with Title and Actions Menu */}
        <Box>
          <Group justify="space-between" align="center">
            <Text fw={600} size="lg" lineClamp={1}>
              BM({bmVersion}) - {productShortName} {productVersion ? `(${productVersion})` : ''}
            </Text>
            <Menu withinPortal position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="light" size="lg">
                  <IconDots size={20} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  color="red"
                  onClick={handleDelete}
                  leftSection={<IconDelete size={16} />}
                  disabled={currentMessage.status === 'DELETED'}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Box>

          {/* Status Alert */}
          {currentMessage.status === 'DELETED' && (
            <Alert icon={<IconDelete />} color="red">
              This brand message has been deleted and is no longer active.
            </Alert>
          )}

          {/* Main Content */}
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Stack gap="lg">
                        {/* Hero Section */}
                        <ContentSection 
                          title="Hero Section" 
                          icon={<IconRocket size={20} />} 
                          section="hero"
                          copyContent={brandMessage?.landing_page?.hero_section ? 
                            `HERO SECTION\n\nHeadline: ${brandMessage.landing_page.hero_section.headline || ''}\n\nSubheadline: ${brandMessage.landing_page.hero_section.subheadline || ''}\n\nCall to Action: ${brandMessage.landing_page.hero_section.cta || ''}\n\nSuccess Points:\n${brandMessage.landing_page.hero_section.success_points?.map(point => `• ${point}`).join('\n') || ''}` 
                            : null
                          }
                        >
                          <Stack gap="md">
                            <Box>
                              <Text size="sm" fw={500} c="dimmed" mb="xs">Headline</Text>
                              <Text size="lg" fw={600}>
                                {brandMessage?.landing_page?.hero_section?.headline}
                              </Text>
                            </Box>
                            <Box>
                              <Text size="sm" fw={500} c="dimmed" mb="xs">Subheadline</Text>
                              <Text>{brandMessage?.landing_page?.hero_section?.subheadline}</Text>
                            </Box>
                            
                            {/* Hero Image */}
                            {brandMessage?.landing_page?.hero_section?.hero_image && (
                              <Box>
                                <Text size="sm" fw={500} c="dimmed" mb="xs">Hero Image URL</Text>
                                <Code block>{brandMessage.landing_page.hero_section.hero_image}</Code>
                              </Box>
                            )}
                            
                            {/* Call to Action */}
                            <Box>
                              <Text size="sm" fw={500} c="dimmed" mb="xs">Call to Action</Text>
                              <Badge 
                                size="lg"
                                styles={{
                                  root: {
                                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                                    border: 'none',
                                    color: 'white'
                                  }
                                }}
                              >
                                {brandMessage?.landing_page?.hero_section?.cta || 'Get Started'}
                              </Badge>
                            </Box>
                            
                            {/* Success Points */}
                            {brandMessage?.landing_page?.hero_section?.success_points?.length > 0 && (
                              <Box>
                                <Text size="sm" fw={500} c="dimmed" mb="xs">Success Points</Text>
                                <List spacing="sm" icon={
                                  <ThemeIcon size="xs" color="green" variant="light" radius="xl">
                                    <IconCheck size={12} />
                                  </ThemeIcon>
                                }>
                                  {brandMessage.landing_page.hero_section.success_points.map((point, i) => (
                                    <List.Item key={i}><Text size="sm">{point}</Text></List.Item>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </Stack>
                        </ContentSection>

                        {/* Problem Agitation */}
                        {brandMessage?.landing_page?.problem_agitation && (
                          <ContentSection 
                            title="Problem Agitation" 
                            icon={<IconWarning size={20} />} 
                            section="problem"
                            copyContent={`PROBLEM AGITATION\n\nTitle: ${brandMessage.landing_page.problem_agitation.title || ''}\n\nProblems:\n${brandMessage.landing_page.problem_agitation.problems?.map(p => `• ${p}`).join('\n') || ''}\n\nAgitation: ${brandMessage.landing_page.problem_agitation.agitation || ''}`}
                          >
                            <Stack gap="md">
                              {brandMessage.landing_page.problem_agitation.title && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Title</Text>
                                  <Text fw={600}>{brandMessage.landing_page.problem_agitation.title}</Text>
                                </Box>
                              )}
                              
                              {brandMessage.landing_page.problem_agitation.problems?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Problems</Text>
                                  <List spacing="sm" icon={
                                    <ThemeIcon size="xs" color="red" variant="light" radius="xl">
                                      <IconWarning size={12} />
                                    </ThemeIcon>
                                  }>
                                    {brandMessage.landing_page.problem_agitation.problems.map((problem, i) => (
                                      <List.Item key={i}><Text size="sm">{problem}</Text></List.Item>
                                    ))}
                                  </List>
                                </Box>
                              )}
                              
                              {brandMessage.landing_page.problem_agitation.agitation && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Agitation</Text>
                                  <Paper p="md" withBorder>
                                    <Text size="sm">{brandMessage.landing_page.problem_agitation.agitation}</Text>
                                  </Paper>
                                </Box>
                              )}
                            </Stack>
                          </ContentSection>
                        )}
                        
                        {/* Legacy Problem Agitation */}
                        {brandMessage?.landing_page?.problem_agitation_section?.content && (
                          <ContentSection 
                            title="Problem Agitation" 
                            icon={<IconThumbUp size={20} />} 
                            section="problem_legacy"
                          >
                            <Text>{brandMessage.landing_page.problem_agitation_section.content}</Text>
                          </ContentSection>
                        )}

                        {/* Value Proposition */}
                        <ContentSection 
                          title="Value Proposition" 
                          icon={<IconSparkles size={20} />} 
                          section="value"
                          copyContent={formatSectionForCopy('Value Proposition', brandMessage?.landing_page?.value_proposition)}
                        >
                          <Stack gap="md">
                            {brandMessage?.landing_page?.value_proposition?.title && (
                              <Box>
                                <Text size="sm" fw={500} c="dimmed" mb="xs">Title</Text>
                                <Text fw={600} size="lg">{brandMessage.landing_page.value_proposition.title}</Text>
                              </Box>
                            )}
                            {brandMessage?.landing_page?.value_proposition?.main_statement && (
                              <Box>
                                <Text size="sm" fw={500} c="dimmed" mb="xs">Main Statement</Text>
                                <Text fw={500}>{brandMessage.landing_page.value_proposition.main_statement}</Text>
                              </Box>
                            )}
                            {brandMessage?.landing_page?.value_proposition?.clarity_and_direction?.length > 0 && (
                              <Box>
                                <Text size="sm" fw={500} c="dimmed" mb="xs">Key Value Points</Text>
                                <List 
                                  spacing="sm"
                                  icon={
                                    <ThemeIcon size="xs" color="violet" variant="light" radius="xl">
                                      <IconCheck size={12} />
                                    </ThemeIcon>
                                  }
                                >
                                  {brandMessage.landing_page.value_proposition.clarity_and_direction.map((point, i) => (
                                    <List.Item key={i}>
                                      <Text size="sm">{point}</Text>
                                    </List.Item>
                                  ))}
                                </List>
                              </Box>
                            )}
                            {brandMessage?.landing_page?.value_proposition?.supporting_points?.length > 0 && (
                              <Box>
                                <Text size="sm" fw={500} c="dimmed" mb="xs">Supporting Points</Text>
                                <List spacing="sm">
                                  {brandMessage.landing_page.value_proposition.supporting_points.map((point, i) => (
                                    <List.Item key={i}>{point}</List.Item>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </Stack>
                        </ContentSection>

                        {/* Benefits Section */}
                        {brandMessage?.landing_page?.benefits_section?.benefits?.length > 0 && (
                          <ContentSection 
                            title="Key Benefits" 
                            icon={<IconCheck size={20} />} 
                            section="benefits"
                          >
                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                              {brandMessage.landing_page.benefits_section.benefits.map((benefit, i) => (
                                <Card key={i} p="md" withBorder>
                                  <Text fw={600} size="sm" mb="xs">{benefit.title}</Text>
                                  <Text size="sm" c="dimmed">{benefit.description}</Text>
                                </Card>
                              ))}
                            </SimpleGrid>
                          </ContentSection>
                        )}

                        {/* Testimonials */}
                        {brandMessage?.landing_page?.testimonials_section?.testimonials?.length > 0 && (
                          <ContentSection 
                            title="Testimonials" 
                            icon={<IconUser size={20} />} 
                            section="testimonials"
                          >
                            <Stack gap="md">
                              {brandMessage.landing_page.testimonials_section.testimonials.map((testimonial, i) => (
                                <Card key={i} p="md" withBorder>
                                  <Text size="sm" fs="italic" mb="xs">"{testimonial.quote}"</Text>
                                  <Text size="sm" fw={500}>- {testimonial.author}</Text>
                                </Card>
                              ))}
                            </Stack>
                          </ContentSection>
                        )}

                        {/* Solution Overview */}
                        {brandMessage?.landing_page?.solution_overview && (
                          <ContentSection 
                            title="Solution Overview" 
                            icon={<IconSuccess size={20} />} 
                            section="solution"
                            copyContent={formatSectionForCopy('Solution Overview', brandMessage.landing_page.solution_overview)}
                          >
                            <Stack gap="md">
                              {brandMessage.landing_page.solution_overview.title && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Title</Text>
                                  <Text fw={600}>{brandMessage.landing_page.solution_overview.title}</Text>
                                </Box>
                              )}
                              {brandMessage.landing_page.solution_overview.introduction && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Introduction</Text>
                                  <Text>{brandMessage.landing_page.solution_overview.introduction}</Text>
                                </Box>
                              )}
                              {brandMessage.landing_page.solution_overview.key_benefits?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Key Benefits</Text>
                                  <List spacing="sm" icon={
                                    <ThemeIcon size="xs" color="blue" variant="light" radius="xl">
                                      <IconCheck size={12} />
                                    </ThemeIcon>
                                  }>
                                    {brandMessage.landing_page.solution_overview.key_benefits.map((benefit, i) => (
                                      <List.Item key={i}><Text size="sm">{benefit}</Text></List.Item>
                                    ))}
                                  </List>
                                </Box>
                              )}
                            </Stack>
                          </ContentSection>
                        )}

                        {/* Product Features */}
                        {brandMessage?.landing_page?.product_features && (
                          <ContentSection 
                            title="Product Features" 
                            icon={<IconAI size={20} />} 
                            section="features"
                            copyContent={formatSectionForCopy('Product Features', brandMessage.landing_page.product_features)}
                          >
                            <Stack gap="md">
                              {brandMessage.landing_page.product_features.title && (
                                <Text fw={600} mb="xs">{brandMessage.landing_page.product_features.title}</Text>
                              )}
                              {brandMessage.landing_page.product_features.features?.length > 0 && (
                                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                  {brandMessage.landing_page.product_features.features.map((feature, i) => (
                                    <Card key={i} p="md" withBorder>
                                      <Group gap="sm" align="flex-start">
                                        <Text size="xl">{feature.icon}</Text>
                                        <Text size="sm" style={{ flex: 1 }}>{feature.description}</Text>
                                      </Group>
                                    </Card>
                                  ))}
                                </SimpleGrid>
                              )}
                              {brandMessage.landing_page.product_features.supporting_images?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Supporting Images</Text>
                                  <Stack gap="xs">
                                    {brandMessage.landing_page.product_features.supporting_images.map((img, i) => (
                                      <Code key={i} block>{img}</Code>
                                    ))}
                                  </Stack>
                                </Box>
                              )}
                            </Stack>
                          </ContentSection>
                        )}

                        {/* Social Proof */}
                        {brandMessage?.landing_page?.social_proof && (
                          <ContentSection
                            title="Social Proof"
                            icon={<IconStar size={20} />}
                            section="social_proof"
                            copyContent={formatSectionForCopy('Social Proof', brandMessage?.landing_page?.social_proof)}
                          >
                            <Stack gap="md">
                              {brandMessage.landing_page.social_proof.title && (
                                <Text fw={600} mb="xs">{brandMessage.landing_page.social_proof.title}</Text>
                              )}
                              
                              {/* Customer Testimonials */}
                              {brandMessage.landing_page.social_proof.testimonials?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Customer Reviews</Text>
                                  <Stack gap="sm">
                                    {brandMessage.landing_page.social_proof.testimonials.map((testimonial, i) => (
                                      <Card key={i} p="md" withBorder>
                                        <Group justify="space-between" mb="xs">
                                          <Text fw={500} size="sm">{testimonial.customer}</Text>
                                          <Group gap={2}>
                                            {[...Array(5)].map((_, idx) => (
                                              idx < testimonial.rating ? 
                                                <IconStar key={idx} size={14} style={{ fill: 'var(--mantine-color-yellow-5)' }} /> :
                                                <IconStarOutline key={idx} size={14} />
                                            ))}
                                          </Group>
                                        </Group>
                                        <Text size="sm" fs="italic">"{testimonial.review}"</Text>
                                      </Card>
                                    ))}
                                  </Stack>
                                </Box>
                              )}
                              
                              {/* Influencer Review */}
                              {brandMessage.landing_page.social_proof.influencer_review && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Influencer Endorsement</Text>
                                  <Card p="md" withBorder>
                                    <Text fw={500} mb="xs">{brandMessage.landing_page.social_proof.influencer_review.name}</Text>
                                    <Text size="sm" fs="italic">"{brandMessage.landing_page.social_proof.influencer_review.quote}"</Text>
                                    {brandMessage.landing_page.social_proof.influencer_review.video_url && (
                                      <Code block mt="xs">{brandMessage.landing_page.social_proof.influencer_review.video_url}</Code>
                                    )}
                                  </Card>
                                </Box>
                              )}
                              
                              {/* Featured Media */}
                              {brandMessage.landing_page.social_proof.featured_media?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Featured In</Text>
                                  <Stack gap="xs">
                                    {brandMessage.landing_page.social_proof.featured_media.map((media, i) => (
                                      <Code key={i} block>{media}</Code>
                                    ))}
                                  </Stack>
                                </Box>
                              )}
                            </Stack>
                          </ContentSection>
                        )}

                        {/* Meet the Guide */}
                        {brandMessage?.landing_page?.meet_the_guide && (
                          <ContentSection
                            title="Meet the Guide"
                            icon={<IconGroup size={20} />}
                            section="meet_guide"
                            copyContent={formatSectionForCopy('Meet the Guide', brandMessage?.landing_page?.meet_the_guide)}
                          >
                            <Stack gap="md">
                              {brandMessage.landing_page.meet_the_guide.title && (
                                <Text fw={600} mb="xs">{brandMessage.landing_page.meet_the_guide.title}</Text>
                              )}
                              {brandMessage.landing_page.meet_the_guide.introduction && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Introduction</Text>
                                  <Text size="sm">{brandMessage.landing_page.meet_the_guide.introduction}</Text>
                                </Box>
                              )}
                              {brandMessage.landing_page.meet_the_guide.credentials && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Credentials</Text>
                                  <Card p="md" withBorder>
                                    <Text size="sm">{brandMessage.landing_page.meet_the_guide.credentials}</Text>
                                  </Card>
                                </Box>
                              )}
                              {brandMessage.landing_page.meet_the_guide.image && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Team Image</Text>
                                  <Code block>{brandMessage.landing_page.meet_the_guide.image}</Code>
                                </Box>
                              )}
                              {brandMessage.landing_page.meet_the_guide.video && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Introduction Video</Text>
                                  <Code block>{brandMessage.landing_page.meet_the_guide.video}</Code>
                                </Box>
                              )}
                            </Stack>
                          </ContentSection>
                        )}

                        {/* How It Works */}
                        {brandMessage?.landing_page?.how_it_works && (
                          <ContentSection
                            title="How It Works"
                            icon={<IconTrending size={20} />}
                            section="how_it_works"
                            copyContent={formatSectionForCopy('How It Works', brandMessage?.landing_page?.how_it_works)}
                          >
                            <Stack gap="md">
                              {brandMessage.landing_page.how_it_works.title && (
                                <Text fw={600} mb="xs">{brandMessage.landing_page.how_it_works.title}</Text>
                              )}
                              {brandMessage.landing_page.how_it_works.steps?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Steps</Text>
                                  <Stack gap="sm">
                                    {brandMessage.landing_page.how_it_works.steps.map((step, i) => (
                                      <Group key={i} gap="md" align="flex-start">
                                        <Badge size="lg" circle>{i + 1}</Badge>
                                        <Text size="sm" style={{ flex: 1 }}>{step}</Text>
                                      </Group>
                                    ))}
                                  </Stack>
                                </Box>
                              )}
                              {brandMessage.landing_page.how_it_works.cta && (
                                <Button 
                                  fullWidth
                                  styles={{
                                    root: {
                                      background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                                      border: 'none',
                                      '&:hover': {
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                                      }
                                    }
                                  }}
                                >
                                  {brandMessage.landing_page.how_it_works.cta}
                                </Button>
                              )}
                            </Stack>
                          </ContentSection>
                        )}

                        {/* Success and Failure */}
                        {brandMessage?.landing_page?.success_and_failure && (
                          <ContentSection 
                            title="Success vs Failure" 
                            icon={<IconInsights size={20} />} 
                            section="success_failure"
                            copyContent={formatSectionForCopy('Success vs Failure', brandMessage.landing_page.success_and_failure)}
                          >
                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                              {brandMessage.landing_page.success_and_failure.success && (
                                <Card p="md" withBorder style={{ borderColor: 'var(--mantine-color-green-3)' }}>
                                  <Group gap="xs" mb="sm">
                                    <ThemeIcon color="green" variant="light">
                                      <IconSuccess size={20} />
                                    </ThemeIcon>
                                    <Text fw={600} c="green">With Our Solution</Text>
                                  </Group>
                                  <List
                                    spacing="xs"
                                    size="sm"
                                    icon={
                                      <ThemeIcon size="xs" color="green" variant="light" radius="xl">
                                        <IconCheck size={10} />
                                      </ThemeIcon>
                                    }
                                  >
                                    {Array.isArray(brandMessage.landing_page.success_and_failure.success) ? 
                                      brandMessage.landing_page.success_and_failure.success.map((item, i) => (
                                        <List.Item key={i}><Text size="sm">{item}</Text></List.Item>
                                      )) : 
                                      <List.Item><Text size="sm">{brandMessage.landing_page.success_and_failure.success}</Text></List.Item>
                                    }
                                  </List>
                                </Card>
                              )}
                              {brandMessage.landing_page.success_and_failure.failure && (
                                <Card p="md" withBorder style={{ borderColor: 'var(--mantine-color-red-3)' }}>
                                  <Group gap="xs" mb="sm">
                                    <ThemeIcon color="red" variant="light">
                                      <IconWarning size={20} />
                                    </ThemeIcon>
                                    <Text fw={600} c="red">Without It</Text>
                                  </Group>
                                  <List
                                    spacing="xs"
                                    size="sm"
                                    icon={
                                      <ThemeIcon size="xs" color="red" variant="light" radius="xl">
                                        <IconWarning size={10} />
                                      </ThemeIcon>
                                    }
                                  >
                                    {Array.isArray(brandMessage.landing_page.success_and_failure.failure) ? 
                                      brandMessage.landing_page.success_and_failure.failure.map((item, i) => (
                                        <List.Item key={i}><Text size="sm">{item}</Text></List.Item>
                                      )) : 
                                      <List.Item><Text size="sm">{brandMessage.landing_page.success_and_failure.failure}</Text></List.Item>
                                    }
                                  </List>
                                </Card>
                              )}
                            </SimpleGrid>
                          </ContentSection>
                        )}

                        {/* Pricing */}
                        {brandMessage?.landing_page?.pricing_offers && (
                          <ContentSection
                            title="Pricing & Offers"
                            icon={<IconMoney size={20} />}
                            section="pricing"
                            copyContent={formatSectionForCopy('Pricing & Offers', brandMessage?.landing_page?.pricing_offers)}
                          >
                            <Stack gap="md">
                              {brandMessage.landing_page.pricing_offers.title && (
                                <Text fw={600} mb="xs">{brandMessage.landing_page.pricing_offers.title}</Text>
                              )}
                              
                              {/* Pricing Table */}
                              {brandMessage.landing_page.pricing_offers.pricing_table?.length > 0 && (
                                <SimpleGrid cols={{ base: 1, sm: brandMessage.landing_page.pricing_offers.pricing_table.length }} spacing="md">
                                  {brandMessage.landing_page.pricing_offers.pricing_table.map((plan, i) => (
                                    <Card key={i} p="lg" withBorder>
                                      <Stack gap="sm" align="center">
                                        <Text fw={600}>{plan.model}</Text>
                                        <Text size="xl" fw={700} c="violet">{plan.price}</Text>
                                      </Stack>
                                    </Card>
                                  ))}
                                </SimpleGrid>
                              )}
                              
                              {/* Special Offer */}
                              {brandMessage.landing_page.pricing_offers.special_offer && (
                                <Alert icon={<IconTag />} color="violet">
                                  {brandMessage.landing_page.pricing_offers.special_offer}
                                </Alert>
                              )}
                              
                              {/* CTA */}
                              {brandMessage.landing_page.pricing_offers.cta && (
                                <Button 
                                  size="lg" 
                                  fullWidth
                                  styles={{
                                    root: {
                                      background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                                      border: 'none',
                                      '&:hover': {
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                                      }
                                    }
                                  }}
                                >
                                  {brandMessage.landing_page.pricing_offers.cta}
                                </Button>
                              )}
                            </Stack>
                          </ContentSection>
                        )}

                        {/* FAQ Section */}
                        {brandMessage?.landing_page?.faq_section?.faqs?.length > 0 && (
                          <ContentSection
                            title="Frequently Asked Questions"
                            icon={<IconQuestion size={20} />}
                            section="faq"
                            copyContent={formatSectionForCopy('FAQ', brandMessage?.landing_page?.faq_section)}
                          >
                            <Accordion>
                              {brandMessage.landing_page.faq_section.faqs.map((faq, i) => (
                                <Accordion.Item key={i} value={`faq-${i}`}>
                                  <Accordion.Control>
                                    <Text fw={500}>{faq.question}</Text>
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Text size="sm">{faq.answer}</Text>
                                  </Accordion.Panel>
                                </Accordion.Item>
                              ))}
                            </Accordion>
                          </ContentSection>
                        )}

                        {/* Final CTA */}
                        {brandMessage?.landing_page?.final_cta && (
                          <ContentSection
                            title="Final Call to Action"
                            icon={<IconRocket size={20} />}
                            section="final_cta"
                            copyContent={formatSectionForCopy('Final Call to Action', brandMessage?.landing_page?.final_cta)}
                          >
                            <Stack gap="md" align="center">
                              {brandMessage.landing_page.final_cta.title && (
                                <Text size="lg" fw={600} ta="center">{brandMessage.landing_page.final_cta.title}</Text>
                              )}
                              {brandMessage.landing_page.final_cta.cta_button && (
                                <Button 
                                  size="xl"
                                  styles={{
                                    root: {
                                      background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                                      border: 'none',
                                      '&:hover': {
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                                      }
                                    }
                                  }}
                                >
                                  {brandMessage.landing_page.final_cta.cta_button}
                                </Button>
                              )}
                              {brandMessage.landing_page.final_cta.trust_signals?.length > 0 && (
                                <Group gap="xl" mt="md">
                                  {brandMessage.landing_page.final_cta.trust_signals.map((signal, i) => (
                                    <Group key={i} gap="xs">
                                      <IconCheck size={16} style={{ color: 'var(--mantine-color-green-6)' }} />
                                      <Text size="sm">{signal}</Text>
                                    </Group>
                                  ))}
                                </Group>
                              )}
                            </Stack>
                          </ContentSection>
                        )}

                        {/* Footer */}
                        {brandMessage?.landing_page?.footer && (
                          <ContentSection
                            title="Footer Information"
                            icon={<IconWeb size={20} />}
                            section="footer"
                            copyContent={formatSectionForCopy('Footer Information', brandMessage?.landing_page?.footer)}
                          >
                            <Stack gap="md">
                              {/* Quick Links */}
                              {brandMessage.landing_page.footer.quick_links?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Quick Links</Text>
                                  <Group gap="md">
                                    {brandMessage.landing_page.footer.quick_links.map((link, i) => (
                                      <Badge key={i} variant="light">{link}</Badge>
                                    ))}
                                  </Group>
                                </Box>
                              )}
                              
                              {/* Contact Info */}
                              {brandMessage.landing_page.footer.contact_info && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Contact Information</Text>
                                  <Group gap="lg">
                                    {brandMessage.landing_page.footer.contact_info.email && (
                                      <Group gap="xs">
                                        <IconEmail size={16} />
                                        <Text size="sm">{brandMessage.landing_page.footer.contact_info.email}</Text>
                                      </Group>
                                    )}
                                    {brandMessage.landing_page.footer.contact_info.phone && (
                                      <Group gap="xs">
                                        <IconPhone size={16} />
                                        <Text size="sm">{brandMessage.landing_page.footer.contact_info.phone}</Text>
                                      </Group>
                                    )}
                                  </Group>
                                </Box>
                              )}
                              
                              {/* Social Media */}
                              {brandMessage.landing_page.footer.social_media?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Social Media</Text>
                                  <Stack gap="xs">
                                    {brandMessage.landing_page.footer.social_media.map((social, i) => (
                                      <Code key={i} block>{social}</Code>
                                    ))}
                                  </Stack>
                                </Box>
                              )}
                              
                              {/* Trust Badges */}
                              {brandMessage.landing_page.footer.trust_badges?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={500} c="dimmed" mb="xs">Trust Badges</Text>
                                  <Group gap="sm">
                                    {brandMessage.landing_page.footer.trust_badges.map((badge, i) => (
                                      <Badge key={i} color="green" variant="light">{badge}</Badge>
                                    ))}
                                  </Group>
                                </Box>
                              )}
                            </Stack>
                          </ContentSection>
                        )}

                        {/* Actionable Insights */}
                        {actionableInsights && (
                          <ContentSection 
                            title="Actionable Insights" 
                            icon={<IconInsights size={20} />} 
                            section="insights"
                          >
                            <Stack gap="md">
                              {/* Key Messaging Points */}
                              {actionableInsights.keyMessagingPoints?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={600} mb="sm">Key Messaging Points</Text>
                                  <Stack gap="xs">
                                    {actionableInsights.keyMessagingPoints.map((point, i) => (
                                      <Card key={i} p="sm" radius="md" withBorder bg="violet.0">
                                        <Group gap="sm" align="flex-start">
                                          <ThemeIcon size="sm" color="violet" variant="light" radius="xl">
                                            <IconCheck size={12} />
                                          </ThemeIcon>
                                          <Text size="sm" style={{ flex: 1 }}>{point}</Text>
                                        </Group>
                                      </Card>
                                    ))}
                                  </Stack>
                                </Box>
                              )}

                              {/* Marketing Channels */}
                              {actionableInsights.suggestedMarketingChannels?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={600} mb="sm">Suggested Marketing Channels</Text>
                                  <Group gap="xs">
                                    {actionableInsights.suggestedMarketingChannels.map((channel, i) => (
                                      <Badge key={i} variant="light" color="grape" size="md">
                                        {channel}
                                      </Badge>
                                    ))}
                                  </Group>
                                </Box>
                              )}

                              {/* Competitor Analysis */}
                              {actionableInsights.competitorAnalysis?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={600} mb="sm">Competitor Analysis</Text>
                                  <List size="sm" spacing="xs">
                                    {actionableInsights.competitorAnalysis.map((item, i) => (
                                      <List.Item key={i}>
                                        <Text size="sm" c="dimmed">{item}</Text>
                                      </List.Item>
                                    ))}
                                  </List>
                                </Box>
                              )}

                              {/* Pricing Recommendations */}
                              {actionableInsights.pricingRecommendations && (
                                <Box>
                                  <Text size="sm" fw={600} mb="xs">Pricing Recommendations</Text>
                                  <Card p="sm" radius="md" bg="blue.0">
                                    <Text size="sm">{actionableInsights.pricingRecommendations}</Text>
                                  </Card>
                                </Box>
                              )}

                              {/* Next Steps */}
                              {actionableInsights.nextSteps?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={600} mb="sm">Next Steps</Text>
                                  <Timeline active={-1} bulletSize={20} lineWidth={2} color="violet">
                                    {actionableInsights.nextSteps.map((step, i) => (
                                      <Timeline.Item key={i} bullet={<Text size="xs">{i + 1}</Text>}>
                                        <Text size="sm">{step}</Text>
                                      </Timeline.Item>
                                    ))}
                                  </Timeline>
                                </Box>
                              )}
                            </Stack>
                          </ContentSection>
                        )}

                        {/* Content Templates */}
                        {contentTemplates && (
                          <ContentSection 
                            title="Content Templates" 
                            icon={<IconArticle size={20} />} 
                            section="templates"
                          >
                            <Stack gap="lg">
                              {/* Social Media Posts */}
                              {contentTemplates.socialMediaPosts?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={600} mb="sm">Social Media Posts</Text>
                                  <Stack gap="sm">
                                    {contentTemplates.socialMediaPosts.map((post, i) => (
                                      <Card key={i} p="sm" radius="md" withBorder>
                                        <Group justify="space-between" mb="xs">
                                          <Badge variant="light" color="blue" size="sm">Post {i + 1}</Badge>
                                          <ActionIcon 
                                            variant="light" 
                                            color="violet"
                                            onClick={() => handleCopy('social', post)}
                                            title="Copy post"
                                          >
                                            <IconCopy size={16} />
                                          </ActionIcon>
                                        </Group>
                                        <Text size="sm" style={{ whiteSpace: 'pre-wrap' }} lineClamp={3}>
                                          {post}
                                        </Text>
                                      </Card>
                                    ))}
                                  </Stack>
                                </Box>
                              )}

                              {/* Email Subject Lines */}
                              {contentTemplates.emailSubjectLines?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={600} mb="sm">Email Subject Lines</Text>
                                  <Stack gap="xs">
                                    {contentTemplates.emailSubjectLines.map((subject, i) => (
                                      <Card key={i} p="xs" radius="md" bg="green.0">
                                        <Group justify="space-between">
                                          <Text size="sm" style={{ flex: 1 }}>
                                            <IconEmail size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                            {subject}
                                          </Text>
                                          <ActionIcon 
                                            size="sm"
                                            variant="subtle"
                                            onClick={() => handleCopy('email', subject)}
                                          >
                                            <IconCopy size={14} />
                                          </ActionIcon>
                                        </Group>
                                      </Card>
                                    ))}
                                  </Stack>
                                </Box>
                              )}

                              {/* Ad Copy */}
                              {contentTemplates.adCopy?.length > 0 && (
                                <Box>
                                  <Text size="sm" fw={600} mb="sm">Ad Copy</Text>
                                  <Stack gap="sm">
                                    {contentTemplates.adCopy.map((ad, i) => (
                                      <Card key={i} p="sm" radius="md" withBorder bg="orange.0">
                                        <Group justify="space-between" mb="xs">
                                          <Badge variant="light" color="orange" size="sm">Ad {i + 1}</Badge>
                                          <ActionIcon 
                                            variant="light" 
                                            color="violet"
                                            onClick={() => handleCopy('ad', ad)}
                                            title="Copy ad"
                                          >
                                            <IconCopy size={16} />
                                          </ActionIcon>
                                        </Group>
                                        <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                                          {ad}
                                        </Text>
                                      </Card>
                                    ))}
                                  </Stack>
                                </Box>
                              )}
                            </Stack>
                          </ContentSection>
                        )}
              </Stack>
            </Grid.Col>

            {/* Sidebar */}
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Stack gap="lg">
                {/* AI Analysis */}
                {enhancedInfo && (
                  <Card shadow="sm" p="lg" radius="lg" withBorder>
                    <Group mb="md">
                      <ThemeIcon size="md" variant="light" color="violet">
                        <IconAI size={20} />
                      </ThemeIcon>
                      <Text fw={600}>AI Analysis</Text>
                    </Group>
                    <Stack gap="md">
                      {(enhancedInfo.whatYouSell || enhancedInfo.product) && (
                        <Box>
                          <Text size="sm" fw={500} mb="xs">What You Sell</Text>
                          <Text size="sm" c="dimmed">{enhancedInfo.whatYouSell || enhancedInfo.product}</Text>
                        </Box>
                      )}
                      {(enhancedInfo.whoYouSellTo || enhancedInfo.targetAudience) && (
                        <Box>
                          <Text size="sm" fw={500} mb="xs">Target Audience</Text>
                          <Text size="sm" c="dimmed">{enhancedInfo.whoYouSellTo || enhancedInfo.targetAudience}</Text>
                        </Box>
                      )}
                      {enhancedInfo.problemYouSolve && (
                        <Box>
                          <Text size="sm" fw={500} mb="xs">Problem You Solve</Text>
                          <Text size="sm" c="dimmed">{enhancedInfo.problemYouSolve}</Text>
                        </Box>
                      )}
                      {enhancedInfo.uniqueValue && (
                        <Box>
                          <Text size="sm" fw={500} mb="xs">Unique Value</Text>
                          <Text size="sm" c="dimmed">{enhancedInfo.uniqueValue}</Text>
                        </Box>
                      )}
                      {enhancedInfo.painPoints?.length > 0 && (
                        <Box>
                          <Text size="sm" fw={500} mb="xs">Pain Points</Text>
                          <List size="sm" spacing="xs">
                            {enhancedInfo.painPoints.slice(0, 3).map((point, i) => (
                              <List.Item key={i}>
                                <Text size="sm" c="dimmed">{point}</Text>
                              </List.Item>
                            ))}
                          </List>
                        </Box>
                      )}
                      {enhancedInfo.mainBenefits?.length > 0 && (
                        <Box>
                          <Text size="sm" fw={500} mb="xs">Main Benefits</Text>
                          <Stack gap="xs">
                            {enhancedInfo.mainBenefits.slice(0, 3).map((benefit, i) => (
                              <Badge key={i} variant="light" size="sm">
                                {benefit}
                              </Badge>
                            ))}
                          </Stack>
                        </Box>
                      )}
                      {enhancedInfo.benefits?.length > 0 && (
                        <Box>
                          <Text size="sm" fw={500} mb="xs">Benefits</Text>
                          <List size="sm" spacing="xs">
                            {enhancedInfo.benefits.slice(0, 3).map((benefit, i) => (
                              <List.Item key={i}>
                                <Text size="sm" c="dimmed">{benefit}</Text>
                              </List.Item>
                            ))}
                          </List>
                        </Box>
                      )}
                      {enhancedInfo.emotions?.length > 0 && (
                        <Box>
                          <Text size="sm" fw={500} mb="xs">Emotions</Text>
                          <Group gap="xs">
                            {enhancedInfo.emotions.slice(0, 4).map((emotion, i) => (
                              <Badge key={i} variant="light" color="grape" size="sm">
                                {emotion}
                              </Badge>
                            ))}
                          </Group>
                        </Box>
                      )}
                    </Stack>
                  </Card>
                )}

                {/* Message Stats */}
                <Card shadow="sm" p="lg" radius="lg" withBorder>
                  <Text fw={600} mb="md">Message Information</Text>
                  <Stack gap="sm">
                    <Box>
                      <Text size="xs" c="dimmed">Tokens Used</Text>
                      <Text size="sm" fw={500}>{currentMessage.totalTokensUsed?.toLocaleString() || '0'} tokens</Text>
                    </Box>
                    <Box>
                      <Text size="xs" c="dimmed">Created</Text>
                      <Text size="sm">{formatDate(currentMessage.createdAt)}</Text>
                    </Box>
                    {project && (
                      <Box>
                        <Text size="xs" c="dimmed">Project</Text>
                        <Group gap="xs" mt={4}>
                          <IconFolder size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                          <Text size="sm">{project.name}</Text>
                        </Group>
                      </Box>
                    )}
                  </Stack>
                </Card>

                {/* Copy Landing Page Button - Admin Only */}
                {user?.role === 'admin' && brandMessage?.landing_page && (
                  <Card shadow="sm" p="lg" radius="lg" withBorder>
                    <Text fw={600} mb="md">Landing Page Data</Text>
                    <Button
                      fullWidth
                      leftSection={<IconCopy size={16} />}
                      onClick={() => {
                        const landingPageJson = JSON.stringify(brandMessage.landing_page, null, 2);
                        navigator.clipboard.writeText(landingPageJson);
                        toast('Landing page JSON copied to clipboard', 'success');
                      }}
                    >
                      Copy Landing Page JSON
                    </Button>
                  </Card>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
      </Stack>
    </PageTransition>
  );
};

export default MessageDetail;