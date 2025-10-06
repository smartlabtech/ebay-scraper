import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Title,
  Text,
  Stack,
  Group,
  Button,
  TextInput,
  Select,
  Badge,
  ActionIcon,
  Box,
  Center,
  ThemeIcon,
  SimpleGrid,
  Modal,
  Paper,
  Alert
} from '@mantine/core';
import {
  MdAdd as IconPlus,
  MdSearch as IconSearch,
  MdDelete as IconDelete,
  MdFolder as IconFolder,
  MdAutoAwesome as IconAI,
  MdBusiness as IconBusiness,
  MdCheck as IconCheck,
  MdShare,
  MdTag
} from 'react-icons/md';
import { useBrandMessages } from '../../hooks/useBrandMessages';
import { useProjects } from '../../hooks/useProjects';
import { useNotifications } from '../../hooks/useNotifications';
import { useDispatch } from 'react-redux';
import { generateSocialBios, generateSeoMetadata } from '../../store/slices/projectsSlice';
import { PageTransition } from '../../components/ui/AnimatedElements';
import ListCard from '../../components/common/ListCard';
import FloatingActionButton from '../../components/common/FloatingActionButton';
import ProjectSelectionModal from '../../components/common/ProjectSelectionModal';

const MessageList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const showProjectModalGlobal = useSelector(state => state.ui.modals.projectSelection);

  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    return localStorage.getItem('selectedProjectId') || null;
  });
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [hasCheckedProjects, setHasCheckedProjects] = useState(false);
  const [generatingBios, setGeneratingBios] = useState(null);
  const [generatingSeo, setGeneratingSeo] = useState(null);

  const { messages, loading, loadMessages, removeMessage, deleting } = useBrandMessages();
  const { projects, loadProjects } = useProjects();
  const { toast, notifySuccess, notifyError } = useNotifications();
  const dispatch = useDispatch();

  // Projects are loaded by Navigation component, no need to load here

  useEffect(() => {
    // Listen for localStorage changes (from Navigation header)
    const handleStorageChange = () => {
      const newProjectId = localStorage.getItem('selectedProjectId');
      if (newProjectId !== selectedProjectId) {
        setSelectedProjectId(newProjectId);
        setSearchTerm(''); // Reset search when project changes
      }
    };

    // Check for changes periodically (storage event doesn't fire in same tab)
    const interval = setInterval(handleStorageChange, 500);
    
    return () => clearInterval(interval);
  }, [selectedProjectId]);

  useEffect(() => {
    // Show project selector if no project is selected and projects are loaded
    if (projects.length > 0 && !hasCheckedProjects) {
      setHasCheckedProjects(true);
      if (!selectedProjectId) {
        setShowProjectModal(true);
      } else {
        // Verify the selected project still exists
        const projectExists = projects.some(p => p.id === selectedProjectId);
        if (!projectExists) {
          localStorage.removeItem('selectedProjectId');
          setSelectedProjectId(null);
          setShowProjectModal(true);
        }
      }
    }
  }, [selectedProjectId, projects, hasCheckedProjects]);

  useEffect(() => {
    // Load messages when project is selected or changed
    if (selectedProjectId) {
      loadMessages({ projectId: selectedProjectId });
    }
  }, [selectedProjectId]); // Remove loadMessages from dependencies to avoid re-runs

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    localStorage.setItem('selectedProjectId', projectId);
    setShowProjectModal(false);
    setSearchTerm(''); // Reset search when changing project
  };

  // Apply filters and sort - messages are already filtered by projectId from API
  const filteredMessages = messages
    .filter(message => {
      const productShortName = message.productDetails?.productShortName || '';
      const businessName = message.details?.inputPayload?.businessName || '';
      const product = message.details?.inputPayload?.whatYouSell || '';
      const matchesSearch = productShortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const aName = a.productDetails?.productShortName || a.details?.inputPayload?.businessName || '';
          const bName = b.productDetails?.productShortName || b.details?.inputPayload?.businessName || '';
          return aName.localeCompare(bName);
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this brand message?')) {
      try {
        await removeMessage(messageId);
        toast('Brand message deleted successfully', 'success');
        // No need to reload - removeMessage should update the state
      } catch (error) {
        toast('Failed to delete brand message', 'error');
      }
    }
  };

  const handleGenerateSocialBios = async (messageId) => {
    setGeneratingBios(messageId);
    try {
      await dispatch(generateSocialBios(messageId)).unwrap();
      notifySuccess('Social bios generated successfully');
      loadProjects({}, true); // Force refresh to show new social bios
    } catch (error) {
      notifyError('Failed to generate social bios');
    } finally {
      setGeneratingBios(null);
    }
  };

  const handleGenerateSeoMetadata = async (messageId) => {
    setGeneratingSeo(messageId);
    try {
      await dispatch(generateSeoMetadata(messageId)).unwrap();
      notifySuccess('SEO metadata generated successfully');
      loadProjects({}, true); // Force refresh to show new SEO metadata
    } catch (error) {
      notifyError('Failed to generate SEO metadata');
    } finally {
      setGeneratingSeo(null);
    }
  };

  const getProjectInfo = (projectId) => {
    return projects.find(p => p.id === projectId);
  };

  const MessageCard = ({ message }) => {
    const project = getProjectInfo(message.projectId);
    const brandMessage = message.details?.generatedContent?.brandMessage;
    
    // Get product and version information
    const productShortName = message.productDetails?.productShortName || message.details?.inputPayload?.businessName || 'Unknown Business';
    const productVersion = message.productDetails?.majorVersion !== undefined && message.productDetails?.minorVersion !== undefined
      ? `${message.productDetails.majorVersion}.${message.productDetails.minorVersion}`
      : null;
    const bmVersion = message.version;
    
    const header = (
      <>
        <Group gap="xs" mb="xs">
          <ThemeIcon size="sm" color="violet" variant="light" radius="xl">
            <IconBusiness size={14} />
          </ThemeIcon>
          <Text fw={600} size="lg" lineClamp={1}>
          BM({bmVersion}) - {productShortName} {productVersion ? `(${productVersion})` : ''}
          </Text>
        </Group>

      </>
    );

    const content = (
      <Stack gap="sm">
        {brandMessage?.landing_page?.hero_section?.headline && (
          <Text size="sm" c="dimmed" lineClamp={3}>
            {brandMessage.landing_page.hero_section.headline}
          </Text>
        )}
        
        <Group gap="xs">
          <Button
            size="xs"
            variant="light"
            color="violet"
            leftSection={<MdShare size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              handleGenerateSocialBios(message._id);
            }}
            loading={generatingBios === message._id}
            disabled={generatingBios !== null && generatingBios !== message._id}
          >
            Generate Social Bios
          </Button>
          <Button
            size="xs"
            variant="light"
            color="grape"
            leftSection={<MdTag size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              handleGenerateSeoMetadata(message._id);
            }}
            loading={generatingSeo === message._id}
            disabled={generatingSeo !== null && generatingSeo !== message._id}
          >
            Generate SEO Meta
          </Button>
        </Group>
      </Stack>
    );

    const menuItems = [
      {
        icon: <IconDelete size={16} />,
        label: 'Delete',
        color: 'red',
        onClick: () => handleDeleteMessage(message._id)
      }
    ];

    return (
      <ListCard
        navigateTo={`/brand-messages/${message._id}`}
        header={header}
        content={content}
        date={message.createdAt}
        menuItems={menuItems}
      />
    );
  };

  return (
    <PageTransition>
      <>
        <Stack gap="xl">
        {/* Header */}
        {/* <Box
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
              <Title order={2} fw={700} mb={4}>Brand Messages</Title>
              <Text c="dimmed" size="sm">
                AI-powered brand messaging tailored to your business
              </Text>
            </Box>
          </Stack>
        </Box> */}

        <Stack gap="xl">
          {/* Search and Filters */}
          <Box>
            <Group gap="sm" align="center">
              <TextInput
                placeholder="Search by product name or business..."
                leftSection={<IconSearch size={18} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="md"
                styles={{
                  root: { flex: 1 },
                  input: {
                    '&:focus': {
                      borderColor: 'var(--mantine-color-violet-5)'
                    }
                  }
                }}
              />
              <Group gap="xs" visibleFrom="sm">
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  data={[
                    { value: 'recent', label: 'Most Recent' },
                    { value: 'oldest', label: 'Oldest First' },
                    { value: 'name', label: 'Name (A-Z)' }
                  ]}
                  size="md"
                  w={160}
                  styles={{
                    input: {
                      '&:focus': {
                        borderColor: 'var(--mantine-color-violet-5)'
                      }
                    }
                  }}
                />
              </Group>
            </Group>
          </Box>

          {/* Messages Grid */}
          {filteredMessages.length === 0 ? (
            <Center py={100}>
              <Stack align="center" gap="md">
                <Box
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(109, 40, 217, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconAI size={48} style={{ color: 'var(--mantine-color-violet-5)' }} />
                </Box>
                <Box ta="center">
                  <Text size="lg" fw={600} mb={8}>
                    {searchTerm ? 'No brand messages found' : 'No brand messages in this project'}
                  </Text>
                  <Text c="dimmed" size="sm" maw={400}>
                    {searchTerm
                      ? 'Try adjusting your search term'
                      : 'Generate your first AI-powered brand message for this project'}
                  </Text>
                </Box>
                {!searchTerm && (
                  <Button
                    component={Link}
                    to="/brand-messages/new"
                    leftSection={<IconAI size={18} />}
                    size="md"
                    variant="gradient"
                    gradient={{ from: 'violet', to: 'grape', deg: 135 }}
                  >
                    Generate Your First Message
                  </Button>
                )}
              </Stack>
            </Center>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {filteredMessages.map((message) => (
                <MessageCard key={message._id} message={message} />
              ))}
            </SimpleGrid>
          )}
          </Stack>
      </Stack>

      {/* Floating Action Button */}
      <FloatingActionButton
        to="/brand-messages/new"
        icon={IconAI}
        label="Generate Message"
        hidden={showProjectModal || showProjectModalGlobal}
      />

      {/* Project Selection Modal */}
      <ProjectSelectionModal
        opened={showProjectModal}
        onClose={() => {
          if (selectedProjectId) {
            setShowProjectModal(false);
          }
        }}
        onSelect={handleProjectSelect}
        projects={projects}
        selectedProjectId={selectedProjectId}
        description="Please select a project to view and manage brand messages"
        noProjectsMessage="You need to create a project first before managing brand messages."
        createButtonPath="/projects/new"
      />
      </>
    </PageTransition>
  );
};

export default MessageList;