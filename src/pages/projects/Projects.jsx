import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Title, 
  Grid, 
  Card, 
  Text, 
  Stack, 
  Group, 
  Button, 
  TextInput,
  Select,
  ActionIcon,
  Menu,
  Avatar,
  Box,
  Tabs,
  Table,
  ScrollArea,
  ThemeIcon,
  Center,
  SimpleGrid,
  Skeleton,
  Badge,
  Tooltip
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdMoreVert,
  MdEdit,
  MdDelete,
  MdFolder,
  MdViewModule,
  MdViewList,
  MdMessage,
  MdContentCopy,
  MdBarChart,
  MdCalendarToday,
  MdPeople,
  MdArchive,
  MdShare,
  MdInfo
} from 'react-icons/md';
import { FaHashtag } from 'react-icons/fa';
import { useProjects } from '../../hooks/useProjects';
import { useMessages } from '../../hooks/useMessages';
import { useCopies } from '../../hooks/useCopies';
import { useNotifications } from '../../hooks/useNotifications';
import { useProjectProducts } from '../../hooks/useProjectProducts';
import { format } from 'date-fns';
import ListCard from '../../components/common/ListCard';
import FloatingActionButton from '../../components/common/FloatingActionButton';
import SocialBiosDrawer from '../../components/projects/SocialBiosDrawer';
import SeoMetadataDrawer from '../../components/projects/SeoMetadataDrawer';

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewType, setViewType] = useState('grid');
  const [socialDrawer, setSocialDrawer] = useState({ opened: false, project: null });
  const [seoDrawer, setSeoDrawer] = useState({ opened: false, project: null });
  
  const { projects, loading, removeProject, updateExistingProject, addProject, error, loadProjects } = useProjects();
  const { messages } = useMessages();
  const { copies } = useCopies();
  const { toast } = useNotifications();
  
  // Projects are loaded by Navigation component
  // CRUD operations (add/update/delete) automatically update Redux state
  

  // Filter and sort projects
  const filteredProjects = (projects || [])
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'oldest':
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        default:
          return 0;
      }
    });

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await removeProject(projectId);
        toast('Project deleted successfully', 'success');
        // No need to reload - removeProject should update the state
      } catch (error) {
        toast('Failed to delete project', 'error');
      }
    }
  };

  const handleProjectClick = (projectId) => {
    // Update localStorage when a project is selected
    localStorage.setItem('selectedProjectId', projectId);
    // Navigate to products page
    navigate('/products');
  };


  const getProjectStats = (project) => {
    // Use statistics from backend if available
    if (project.statistics) {
      return {
        products: project.statistics.activeProducts || 0,
        messages: project.statistics.activeBrandMessages || 0,
        copies: project.statistics.activeCopies || 0
      };
    }
    
    // Fallback to stats if statistics not available
    if (project.stats) {
      return project.stats;
    }
    
    // Last resort: calculate from local data
    const projectMessages = messages.filter(m => m.projectId === project.id);
    const projectCopies = copies.filter(c => c.projectId === project.id);
    return {
      products: 0,
      messages: projectMessages.length,
      copies: projectCopies.length
    };
  };

  const ProjectCard = ({ project }) => {
    const stats = getProjectStats(project);
    const [showTooltip, setShowTooltip] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    const hasSocialBios = project?.socialBios && (
      project.socialBios.facebook ||
      project.socialBios.instagram ||
      project.socialBios.linkedin
    );
    const hasSeoMetadata = project?.seoMetadata && (
      project.seoMetadata.title ||
      project.seoMetadata.description ||
      (project.seoMetadata.keywords && project.seoMetadata.keywords.length > 0)
    );
    
    const header = (
      <Stack gap={12}>
        {/* Primary: Project Name with metadata status */}
        <Group justify="space-between" align="flex-start">
          <Text 
            fw={600} 
            size="lg"
            style={{ 
              color: 'var(--mantine-color-dark-7)',
              flex: 1
            }}
            truncate
          >
            {project.name}
          </Text>
          
          {/* Metadata Status - Top Right */}
          <Group gap={6}>
            {hasSocialBios && (
              <Tooltip label="View Social Bios" position="top" withArrow>
                <ActionIcon
                  variant="light"
                  color="violet"
                  size="sm"
                  radius="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSocialDrawer({ opened: true, project });
                  }}
                >
                  <MdShare size={14} />
                </ActionIcon>
              </Tooltip>
            )}
            {hasSeoMetadata && (
              <Tooltip label="View SEO Metadata" position="top" withArrow>
                <ActionIcon
                  variant="light"
                  color="grape"
                  size="sm"
                  radius="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSeoDrawer({ opened: true, project });
                  }}
                >
                  <FaHashtag size={12} />
                </ActionIcon>
              </Tooltip>
            )}
            {(!hasSocialBios && !hasSeoMetadata) && (
              <Tooltip
                label={
                  <div style={{ maxWidth: 280 }}>
                    <Text size="xs" fw={500} mb={4}>📝 Setup Metadata</Text>
                    <Text size="xs" style={{ lineHeight: 1.4 }}>
                      {isMobile ? 'Tap' : 'Click'} to generate social media bios and SEO metadata from your brand messages.
                    </Text>
                  </div>
                }
                position="top"
                withArrow
                multiline
                opened={isMobile ? showTooltip : undefined}
                events={isMobile ? { hover: false, focus: false, touch: true } : { hover: true, focus: true, touch: false }}
              >
                <Badge 
                  size="sm" 
                  variant="light" 
                  color="amber"
                  radius="md"
                  style={{ cursor: 'pointer', userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isMobile && !showTooltip) {
                      // On first tap on mobile, show tooltip
                      setShowTooltip(true);
                      setTimeout(() => setShowTooltip(false), 3000); // Auto-hide after 3 seconds
                    } else {
                      // On second tap or desktop click, navigate
                      localStorage.setItem('selectedProjectId', project.id);
                      navigate('/brand-messages');
                      setShowTooltip(false);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isMobile) setShowTooltip(false);
                  }}
                >
                  📋 Setup Metadata
                </Badge>
              </Tooltip>
            )}
          </Group>
        </Group>

        {/* Secondary: Meta Information */}
        {(project.businessType || project.location || project.domainName) && (
          <Group gap={8} wrap="wrap">
            {project.businessType && (
              <Badge 
                size="xs" 
                variant="outline" 
                color="gray"
                radius="sm"
                style={{ 
                  textTransform: 'capitalize',
                  fontWeight: 400,
                  borderColor: 'var(--mantine-color-gray-3)'
                }}
              >
                {project.businessType}
              </Badge>
            )}
            {project.location && (
              <Text size="xs" c="dimmed" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Text span size="10px">📍</Text> {project.location}
              </Text>
            )}
            {project.domainName && (
              <Text size="xs" c="violet.6" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Text span size="10px">🌐</Text> {project.domainName}
              </Text>
            )}
          </Group>
        )}
      </Stack>
    );

    const content = (
      <Stack gap="md">
        {project.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {project.description}
          </Text>
        )}
        
        <Box 
          p="md" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.03) 0%, rgba(109, 40, 217, 0.03) 100%)',
            borderRadius: 'var(--mantine-radius-md)',
            border: '1px solid var(--mantine-color-gray-2)'
          }}
        >
          <Group justify="space-between">
            <Stack gap={4} align="center">
              <Text size="2xl" fw={700} lh={1} c="violet.6">
                {stats.products}
              </Text>
              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                Products
              </Text>
            </Stack>
            <Stack gap={4} align="center">
              <Text size="2xl" fw={700} lh={1} c="grape.6">
                {stats.messages}
              </Text>
              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                Messages
              </Text>
            </Stack>
            <Stack gap={4} align="center">
              <Text size="2xl" fw={700} lh={1} c="indigo.6">
                {stats.copies}
              </Text>
              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                Copies
              </Text>
            </Stack>
          </Group>
        </Box>

        {(project.priceRange || project.businessStage || project.businessGoal) && (
          <Group gap="xs" wrap="wrap">
            {project.priceRange && (
              <Badge 
                size="sm" 
                variant="light" 
                color="green"
                leftSection="💰"
                radius="md"
              >
                {project.priceRange}
              </Badge>
            )}
            {project.businessStage && (
              <Badge 
                size="sm" 
                variant="light" 
                color="indigo"
                leftSection="📈"
                radius="md"
                style={{ textTransform: 'capitalize' }}
              >
                {project.businessStage.replace(/-/g, ' ')}
              </Badge>
            )}
            {project.businessGoal && (
              <Badge 
                size="sm" 
                variant="light" 
                color="orange"
                leftSection="🎯"
                radius="md"
                style={{ textTransform: 'capitalize' }}
              >
                {project.businessGoal.replace(/-/g, ' ')}
              </Badge>
            )}
          </Group>
        )}
      </Stack>
    );

    const menuItems = [
      {
        icon: <MdEdit size={16} />,
        label: 'Edit',
        onClick: (e) => {
          e.stopPropagation();
          navigate(`/projects/${project.id}/edit`);
        }
      },
      'divider',
      {
        icon: <MdDelete size={16} />,
        label: 'Delete',
        color: 'red',
        onClick: () => handleDeleteProject(project.id)
      }
    ].filter(item => item !== 'divider'); // ListCard doesn't support dividers yet

    return (
      <ListCard
        header={header}
        content={content}
        date={project.updatedAt}
        menuItems={menuItems}
        onCardClick={() => handleProjectClick(project.id)}
        styles={{
          card: {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 40px rgba(124, 58, 237, 0.12)'
            }
          }
        }}
      />
    );
  };

  const ProjectRow = ({ project }) => {
    const stats = getProjectStats(project);

    return (
      <Table.Tr 
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          handleProjectClick(project.id);
        }}
      >
        <Table.Td>
          <Box>
            <Text fw={500}>{project.name}</Text>
            <Text size="xs" c="dimmed">{project.industry}</Text>
          </Box>
        </Table.Td>
        <Table.Td>{stats.products}</Table.Td>
        <Table.Td>{stats.messages}</Table.Td>
        <Table.Td>{stats.copies}</Table.Td>
        <Table.Td>
          <Text size="sm">{format(new Date(project.updatedAt), 'MMM d, yyyy')}</Text>
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            <Menu withinPortal position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle">
                  <MdMoreVert size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  to={`/projects/${project.id}/edit`}
                  leftSection={<MdEdit size={16} />}
                >
                  Edit
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  onClick={() => handleDeleteProject(project.id)}
                  leftSection={<MdDelete size={16} />}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  };

  return (
    <>
      <Stack gap="lg">
      {/* Header Section */}
      <Box>
        {/* Search and Filters */}
        <Group gap="sm" align="center">
          <TextInput
            placeholder="Search projects by name or description..."
            leftSection={<MdSearch size={18} />}
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
            <ActionIcon
              size="lg"
              variant="default"
              onClick={() => setViewType(viewType === 'grid' ? 'list' : 'grid')}
              title={viewType === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
            >
              {viewType === 'grid' ? <MdViewList size={20} /> : <MdViewModule size={20} />}
            </ActionIcon>
          </Group>
        </Group>
      </Box>
      {/* Projects Display */}
      {error && (
        <Box>
          <Text c="red">Error loading projects: {error}</Text>
        </Box>
      )}
      
      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height={250} />
          ))}
        </SimpleGrid>
      ) : filteredProjects.length === 0 ? (
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
              <MdFolder size={48} style={{ color: 'var(--mantine-color-violet-5)' }} />
            </Box>
            <Box ta="center">
              <Text size="lg" fw={600} mb={8}>No projects found</Text>
              <Text c="dimmed" size="sm" maw={400}>
                {searchTerm 
                  ? `No projects match "${searchTerm}". Try a different search term.` 
                  : 'Start building your brand by creating your first project.'}
              </Text>
            </Box>
            {!searchTerm && (
              <Button
                component={Link}
                to="/projects/create"
                leftSection={<MdAdd size={18} />}
                size="md"
                variant="gradient"
                gradient={{ from: 'violet', to: 'grape', deg: 135 }}
              >
                Create Your First Project
              </Button>
            )}
          </Stack>
        </Center>
      ) : viewType === 'grid' ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </SimpleGrid>
      ) : (
        <Box>
          <ScrollArea>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Products</Table.Th>
                  <Table.Th>Brand Messages</Table.Th>
                  <Table.Th>Copies</Table.Th>
                  <Table.Th>Last Updated</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredProjects.map((project) => (
                  <ProjectRow key={project.id} project={project} />
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Box>
      )}
      </Stack>

      {/* Floating Action Button */}
      <FloatingActionButton
        to="/projects/create"
        icon={MdAdd}
        label="Create Project"
      />

      {/* Social Bios Drawer */}
      <SocialBiosDrawer
        opened={socialDrawer.opened}
        onClose={() => setSocialDrawer({ opened: false, project: null })}
        project={socialDrawer.project}
        brandMessageId={socialDrawer.project?.brandMessageId}
      />

      {/* SEO Metadata Drawer */}
      <SeoMetadataDrawer
        opened={seoDrawer.opened}
        onClose={() => setSeoDrawer({ opened: false, project: null })}
        project={seoDrawer.project}
        brandMessageId={seoDrawer.project?.brandMessageId}
      />
    </>
  );
};

export default Projects;