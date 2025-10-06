import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Title,
  Text,
  Group,
  Button,
  Stack,
  Box,
  Badge,
  ActionIcon,
  Tabs,
  Card,
  ThemeIcon,
  Divider,
  CopyButton,
  Center,
  SimpleGrid,
  Skeleton,
  Paper,
  Collapse,
  Tooltip,
  Popover
} from '@mantine/core';
import {
  MdDelete as IconDelete,
  MdContentCopy as IconCopy,
  MdCheck as IconCheck,
  MdAutoAwesome as IconAI,
  MdExpandMore as IconExpandMore,
  MdExpandLess as IconExpandLess,
  MdLightbulbOutline as IconInsights
} from 'react-icons/md';
import { useCopies } from '../../hooks/useCopies';
import { useProjects } from '../../hooks/useProjects';
import { useBrandMessages } from '../../hooks/useBrandMessages';
import { useNotifications } from '../../hooks/useNotifications';
import { useLoading } from '../../contexts/LoadingContext';
import { format } from 'date-fns';
import { PageTransition } from '../../components/ui/AnimatedElements';
import { formatPlatformName } from '../../services/copyService';
import copyService from '../../services/copyService';
import brandMessagesApi from '../../services/brandMessages';

const CopyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { copies, loading, loadCopies, removeCopy } = useCopies();
  const { projects, loadProjects } = useProjects();
  const { messages, loadMessages } = useBrandMessages();
  const { toast } = useNotifications();
  const { showLoading, hideLoading } = useLoading();

  const [activeVariation, setActiveVariation] = useState(0);
  const [currentCopy, setCurrentCopy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [specificBrandMessage, setSpecificBrandMessage] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [insightsOpened, setInsightsOpened] = useState(false);
  const loadingRef = useRef(false);

  // Find the current copy from state or local state
  const copyFromState = copies.find(c => c._id === id);
  const copy = copyFromState || currentCopy;
  const project = copy ? projects.find(p => p.id === copy.projectId) : null;
  const brandMessage = copy ? (messages.find(m => m._id === copy.brandMessageId) || specificBrandMessage) : null;

  useEffect(() => {
    const loadData = async () => {
      // Prevent multiple simultaneous loads
      if (loadingRef.current) return;
      loadingRef.current = true;
      
      setIsLoading(true);
      showLoading('copy-detail', 'Loading copy details...');
      try {
        // Always try to load copies if not already loaded
        if (copies.length === 0) {
          await loadCopies();
        }
        
        // If copy not in state after loading, fetch it directly
        const existingCopy = copies.find(c => c._id === id);
        if (!existingCopy && !copyFromState) {
          const response = await copyService.getById(id);
          setCurrentCopy(response);
          
          // Load related data
          if (response) {
            // Projects are loaded by Navigation component
            // Load specific brand message if needed
            if (response.brandMessageId) {
              // First check if message is already in state
              const existingMessage = messages.find(m => m._id === response.brandMessageId);
              if (!existingMessage) {
                try {
                  const messageData = await brandMessagesApi.getById(response.brandMessageId);
                  setSpecificBrandMessage(messageData);
                } catch (error) {
                  console.error('Failed to load brand message:', error);
                }
              }
            }
          }
        } else if (existingCopy) {
          // Projects are loaded by Navigation component
          // Load specific brand message if needed
          if (existingCopy.brandMessageId) {
            const existingMessage = messages.find(m => m._id === existingCopy.brandMessageId);
            if (!existingMessage) {
              try {
                const messageData = await brandMessagesApi.getById(existingCopy.brandMessageId);
                setSpecificBrandMessage(messageData);
              } catch (error) {
                console.error('Failed to load brand message:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to load copy:', error);
        toast('Failed to load copy details', 'error');
        // Navigate back to list on error
        setTimeout(() => navigate('/copies'), 2000);
      } finally {
        setIsLoading(false);
        hideLoading('copy-detail');
        loadingRef.current = false;
      }
    };

    if (id) {
      loadData();
    }
    
    // Cleanup function
    return () => {
      loadingRef.current = false;
    };
  }, [id]); // Only depend on id to avoid re-fetching

  // Load related data when copy becomes available
  useEffect(() => {
    const loadRelatedData = async () => {
      if (copy && !isLoading) {
        // Projects are loaded by Navigation component
        // Load specific brand message if needed  
        if (copy.brandMessageId && !brandMessage) {
          try {
            const messageData = await brandMessagesApi.getById(copy.brandMessageId);
            setSpecificBrandMessage(messageData);
          } catch (error) {
            console.error('Failed to load brand message:', error);
          }
        }
      }
    };
    
    loadRelatedData();
  }, [copy?.brandMessageId, brandMessage]); // Load when copy data changes or message not found

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this copy?')) {
      try {
        await removeCopy(id);
        toast('Copy deleted successfully', 'success');
        navigate('/copies');
      } catch (error) {
        toast('Failed to delete copy', 'error');
      }
    }
  };

  const handleDeleteVariation = async (variationId, variationIndex) => {
    // Check if this is the last variation
    const isLastVariation = copy.generatedCopies.length === 1;
    const confirmMessage = isLastVariation 
      ? 'This is the last variation. Deleting it will remove this copy. Continue?'
      : 'Are you sure you want to delete this variation?';
    
    if (window.confirm(confirmMessage)) {
      try {
        await copyService.deleteVariation(variationId);
        
        // If this was the last variation, redirect immediately
        if (isLastVariation) {
          toast('Last variation deleted. Returning to list.', 'success');
          navigate('/copies');
          return;
        }
        
        // Update the local state to remove the variation
        const updatedCopy = {
          ...copy,
          generatedCopies: copy.generatedCopies.filter((_, index) => index !== variationIndex)
        };
        
        // Update the current copy in state
        if (copyFromState) {
          // Reload copies to get updated data
          await loadCopies();
        } else {
          setCurrentCopy(updatedCopy);
        }
        
        // If we deleted the active variation, switch to the first one
        if (activeVariation === variationIndex && updatedCopy.generatedCopies.length > 0) {
          setActiveVariation(0);
        } else if (activeVariation > variationIndex) {
          setActiveVariation(activeVariation - 1);
        }
        
        toast('Variation deleted successfully', 'success');
      } catch (error) {
        toast('Failed to delete variation', 'error');
      }
    }
  };

  const handleCopyContent = (content) => {
    navigator.clipboard.writeText(content);
    toast('Content copied to clipboard', 'success');
  };

  if (isLoading) {
    return (
      <PageTransition>
        <Stack gap="xl">
          {/* Header skeleton */}
          <Box>
            <Skeleton height={30} width={300} radius="md" mb="xs" />
            <Group gap="xs">
              <Skeleton height={22} width={100} radius="xl" />
              <Skeleton height={22} width={80} radius="xl" />
            </Group>
          </Box>
          
          {/* Info bar skeleton */}
          <Skeleton height={60} radius="md" />
          
          {/* Content skeleton */}
          <Card shadow="sm" p="lg" radius="lg" withBorder>
            <Stack gap="lg">
              <Box>
                <Skeleton height={20} width={60} mb="xs" />
                <Skeleton height={100} radius="md" />
              </Box>
              <Box>
                <Skeleton height={20} width={120} mb="xs" />
                <Skeleton height={150} radius="md" />
              </Box>
              <Box>
                <Skeleton height={20} width={100} mb="xs" />
                <Skeleton height={120} radius="md" />
              </Box>
            </Stack>
          </Card>
        </Stack>
      </PageTransition>
    );
  }

  if (!copy) {
    return (
      <Center py={100}>
        <Stack align="center" gap="md">
          <ThemeIcon size={60} color="gray" variant="light" radius="xl">
            <IconAI size={30} />
          </ThemeIcon>
          <Title order={3}>Copy not found</Title>
          <Text c="dimmed">The copy you're looking for doesn't exist or has been deleted.</Text>
          <Button
            component={Link}
            to="/copies"
            variant="light"
          >
            View All Copies
          </Button>
        </Stack>
      </Center>
    );
  }

  const currentVariation = copy.generatedCopies?.[activeVariation];

  // Get language info
  const languageInfo = copy.languageInfo || currentVariation?.languageInfo;
  const formatLanguageName = (lang) => {
    if (!lang) return ''
    // Handle special cases with underscores
    if (lang.includes('_')) {
      return lang.split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ')
    }
    return lang.charAt(0) + lang.slice(1).toLowerCase()
  };

  return (
    <PageTransition>
      <Stack gap="xl">
        {/* Header */}
        <Box>
          <Group justify="space-between" align="center">
            <Box style={{ flex: 1 }}>
              {copy.productId?.shortName && (
                <Title order={3}>
                  {copy.productId.shortName}
                </Title>
              )}
              {copy.productId?.product && 
               copy.productId?.shortName && 
               copy.productId.product !== copy.productId.shortName && (
                <Box mt={4} mb="xs">
                  {/* Show truncated or full description based on state */}
                  <Text 
                    size="sm" 
                    c="dimmed"
                    component="span"
                  >
                    {!isDescriptionExpanded && copy.productId.product.length > 200 ? (
                      <>
                        {copy.productId.product.slice(0, 200)}...
                        <Text
                          component="span"
                          size="sm"
                          c="violet"
                          fw={500}
                          style={{ 
                            cursor: 'pointer',
                            marginLeft: 4,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 2
                          }}
                          onClick={() => setIsDescriptionExpanded(true)}
                        >
                          Show More
                          <IconExpandMore size={14} />
                        </Text>
                      </>
                    ) : (
                      <>
                        {copy.productId.product}
                        {copy.productId.product.length > 200 && (
                          <Text
                            component="span"
                            size="sm"
                            c="violet"
                            fw={500}
                            style={{ 
                              cursor: 'pointer',
                              marginLeft: 4,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 2
                            }}
                            onClick={() => setIsDescriptionExpanded(false)}
                          >
                            Show Less
                            <IconExpandLess size={14} />
                          </Text>
                        )}
                      </>
                    )}
                  </Text>
                </Box>
              )}
            </Box>
          </Group>
        </Box>

        {/* Content */}
        {copy.generatedCopies && copy.generatedCopies.length > 0 ? (
          <Card shadow="sm" p="lg" radius="lg" withBorder>
            {/* Metadata badges */}
            <Group gap="xs" mb="lg">
              <Badge size="sm" color="violet" variant="light">
                {formatPlatformName(copy.platform)}
              </Badge>
              <Badge size="sm" color="grape" variant="light">
                {copy.copyType}
              </Badge>
              {languageInfo && (
                <Badge size="sm" color="blue" variant="dot">
                  <Text span size="sm">{languageInfo.flag}</Text>
                  <Text span size="sm" ml={4}>{formatLanguageName(languageInfo.language)}</Text>
                </Badge>
              )}
              <Text size="sm" c="dimmed">
                • Created {format(new Date(copy.createdAt), 'MMM d, yyyy')}
              </Text>
            </Group>

            {/* Don't show variation header for single variation - language already shown in metadata */}
            {copy.generatedCopies.length > 1 && (
              <Box style={{ position: 'relative', marginBottom: 'var(--mantine-spacing-lg)' }}>
                {/* Left shadow indicator */}
                <Box
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '20px',
                    background: 'linear-gradient(90deg, white 0%, transparent 100%)',
                    zIndex: 2,
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    display: 'block'
                  }}
                  className="scroll-indicator-left"
                />
                
                {/* Right shadow indicator */}
                <Box
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '20px',
                    background: 'linear-gradient(270deg, white 0%, transparent 100%)',
                    zIndex: 2,
                    pointerEvents: 'none',
                    transition: 'opacity 0.3s'
                  }}
                  className="scroll-indicator-right"
                />
                
                <Tabs value={activeVariation.toString()} onChange={(value) => setActiveVariation(parseInt(value))}>
                  <Tabs.List 
                    style={{ 
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      flexWrap: 'nowrap',
                      WebkitOverflowScrolling: 'touch',
                      scrollbarWidth: 'thin',
                      paddingBottom: '2px'
                    }}
                    onScroll={(e) => {
                      const element = e.currentTarget;
                      const leftIndicator = element.parentElement.querySelector('.scroll-indicator-left');
                      const rightIndicator = element.parentElement.querySelector('.scroll-indicator-right');
                      
                      const isScrolled = element.scrollLeft > 5;
                      const isScrolledToEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 5;
                      
                      if (leftIndicator) {
                        leftIndicator.style.opacity = isScrolled ? '1' : '0';
                      }
                      if (rightIndicator) {
                        rightIndicator.style.opacity = isScrolledToEnd ? '0' : '1';
                      }
                    }}
                  >
                    {copy.generatedCopies.map((variation, index) => (
                      <Tabs.Tab
                        key={index}
                        value={index.toString()}
                        style={{ flexShrink: 0 }}
                      >
                        <Group gap="xs">
                          <Text size="sm">Variation {index + 1}</Text>
                          <ActionIcon
                            size="xs"
                            variant="subtle"
                            color="red"
                            component="div"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteVariation(variation._id, index);
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <IconDelete size={14} />
                          </ActionIcon>
                        </Group>
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                </Tabs>
              </Box>
            )}

            {/* Copy Content */}
            <Box style={{ position: 'relative' }}>
              <style>
                {`
                  @keyframes pulse {
                    0%, 100% { 
                      transform: scale(1);
                      box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
                    }
                    50% { 
                      transform: scale(1.05);
                      box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
                    }
                  }
                  
                  @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-3px); }
                  }
                  
                  @keyframes success {
                    0% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.2) rotate(-10deg); }
                    50% { transform: scale(1.1) rotate(10deg); }
                    75% { transform: scale(1.15) rotate(-5deg); }
                    100% { transform: scale(1) rotate(0deg); }
                  }
                  
                  .copy-btn {
                    animation: float 3s ease-in-out infinite;
                  }
                  
                  .copy-btn:not(.copied):hover {
                    animation: pulse 1.5s infinite;
                  }
                  
                  .copy-btn.copied {
                    animation: success 0.6s ease-out;
                  }
                `}
              </style>
              <CopyButton value={currentVariation?.content?.fullCopy || ''}>
                {({ copied, copy }) => (
                  <Tooltip 
                    label={copied ? 'Copied!' : 'Copy to clipboard'} 
                    position="left"
                    withArrow
                  >
                    <ActionIcon
                      className={`copy-btn ${copied ? 'copied' : ''}`}
                      style={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        zIndex: 1,
                        opacity: copied ? 1 : 0.75,
                        backgroundColor: copied ? 'rgba(16, 185, 129, 0.95)' : 'rgba(139, 92, 246, 0.9)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: copied 
                          ? '0 4px 20px rgba(16, 185, 129, 0.3)' 
                          : '0 4px 15px rgba(139, 92, 246, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                      variant="filled"
                      onClick={copy}
                      color={copied ? 'green' : 'violet'}
                      size="lg"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.boxShadow = '0 6px 25px rgba(139, 92, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = copied ? '1' : '0.75';
                        e.currentTarget.style.boxShadow = copied 
                          ? '0 4px 20px rgba(16, 185, 129, 0.3)' 
                          : '0 4px 15px rgba(139, 92, 246, 0.25)';
                      }}
                    >
                      {copied ? <IconCheck size={20} /> : <IconCopy size={20} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
              <Text style={{
                whiteSpace: 'pre-wrap',
                direction: languageInfo?.isRTL ? 'rtl' : 'ltr',
                textAlign: languageInfo?.isRTL ? 'right' : 'left'
              }}>
                {currentVariation?.content?.fullCopy}
              </Text>
            </Box>
            
            {/* Simplified Footer */}
            {(currentVariation?.metadata || copy.callToActionType) && (
              <Group justify="space-between" align="center" mt="lg" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Group gap="lg">
                  {currentVariation?.metadata?.characterCount && (
                    <Text size="xs" c="dimmed">
                      {currentVariation.metadata.characterCount} characters
                    </Text>
                  )}
                  {currentVariation?.metadata?.tokensUsed && (
                    <Text size="xs" c="dimmed">
                      {currentVariation.metadata.tokensUsed.toLocaleString()} tokens
                    </Text>
                  )}
                  {/* Insights Popover (Mobile-friendly) */}
                  {currentVariation?.metadata && (currentVariation.metadata.primaryEmotion || currentVariation.metadata.readabilityScore || currentVariation.metadata.psychologicalTriggers?.length > 0) && (
                    <Popover 
                      width={280} 
                      position="top" 
                      withArrow 
                      shadow="md"
                      opened={insightsOpened}
                      onChange={setInsightsOpened}
                    >
                      <Popover.Target>
                        <ActionIcon 
                          size="sm" 
                          variant="subtle" 
                          color="yellow"
                          component="div"
                          onClick={() => setInsightsOpened((o) => !o)}
                        >
                          <IconInsights size={16} />
                        </ActionIcon>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Stack gap={8}>
                          {currentVariation.metadata.readabilityScore && (
                            <Group gap={4}>
                              <Text size="xs" fw={500}>Readability:</Text>
                              <Badge size="xs" variant="light" color="green">
                                {currentVariation.metadata.readabilityScore}
                              </Badge>
                            </Group>
                          )}
                          {currentVariation.metadata.primaryEmotion && (
                            <Group gap={4}>
                              <Text size="xs" fw={500}>Emotion:</Text>
                              <Badge size="xs" variant="light" color="violet">
                                {currentVariation.metadata.primaryEmotion}
                              </Badge>
                            </Group>
                          )}
                          {currentVariation.metadata.psychologicalTriggers?.length > 0 && (
                            <Group gap={4}>
                              <Text size="xs" fw={500}>Triggers:</Text>
                              {currentVariation.metadata.psychologicalTriggers.map((trigger, index) => (
                                <Badge key={index} size="xs" variant="light" color="grape">
                                  {trigger}
                                </Badge>
                              ))}
                            </Group>
                          )}
                        </Stack>
                      </Popover.Dropdown>
                    </Popover>
                  )}
                </Group>
                {copy.callToActionType && (
                  <Badge size="sm" color="blue" variant="light">
                    {copy.callToActionType}
                  </Badge>
                )}
              </Group>
            )}
          </Card>
        ) : (
          /* Empty state */
          <Card shadow="sm" p="xl" radius="lg" withBorder>
            <Center py="xl">
              <Stack align="center" gap="md">
                <ThemeIcon size={60} color="gray" variant="light" radius="xl">
                  <IconAI size={30} />
                </ThemeIcon>
                <Text fw={500} size="lg">No Variations Generated</Text>
                <Text size="sm" c="dimmed" ta="center">
                  This copy doesn't have any generated variations yet.
                </Text>
              </Stack>
            </Center>
          </Card>
        )}


        
      </Stack>
    </PageTransition>
  );
};

export default CopyDetail;