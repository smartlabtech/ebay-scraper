import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Group,
  ActionIcon,
  Menu,
  Text,
  Divider,
  Title,
  Breadcrumbs,
  Anchor,
  Popover,
  Stack,
  Modal,
  Paper,
  Box,
  ThemeIcon,
  Alert,
  UnstyledButton,
  Badge,
  Tooltip
} from '@mantine/core';
import {
  MdPerson as IconUser,
  MdCreditCard as IconCreditCard,
  MdLogout as IconLogout,
  MdApps as IconApps,
  MdFolder as IconFolder,
  MdMessage as IconMessages,
  MdContentCopy as IconCopy,
  MdBusiness as IconBusiness,
  MdCheck as IconCheck,
  MdExpandMore as IconExpandMore,
  MdAdd as IconAdd
} from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';
import { useProjects } from '../../hooks/useProjects';
import { useSelector, useDispatch } from 'react-redux';
import { openModal, closeModal } from '../../store/slices/uiSlice';
import Button from '../common/Button';
import ProjectSelectionModal from '../common/ProjectSelectionModal';

// Component for rendering breadcrumb items with ID handling
const BreadcrumbItem = ({ label, href, navigate }) => {
  const [copied, setCopied] = useState(false);
  
  // Check if label looks like a MongoDB ObjectId (24 hex characters)
  const isObjectId = /^[a-f\d]{24}$/i.test(label);
  
  const handleCopyId = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(label);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (isObjectId) {
    const truncatedId = `${label.slice(0, 8)}...`;
    
    if (href) {
      return (
        <Tooltip 
          label={copied ? 'Copied!' : `Click to copy: ${label}`}
          position="top"
          withArrow
        >
          <Anchor
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey) {
                handleCopyId(e);
              } else {
                navigate(href);
              }
            }}
            c="dimmed"
            size="sm"
            style={{ 
              cursor: 'pointer',
              fontFamily: 'monospace',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onContextMenu={handleCopyId}
          >
            {truncatedId}
            {copied ? (
              <IconCheck size={14} style={{ color: '#40c057' }} />
            ) : (
              <IconCopy size={14} style={{ opacity: 0.5 }} />
            )}
          </Anchor>
        </Tooltip>
      );
    }
    
    return (
      <Tooltip 
        label={copied ? 'Copied!' : `Click to copy: ${label}`}
        position="top"
        withArrow
      >
        <Text
          size="sm"
          component="span"
          c="dimmed"
          style={{ 
            cursor: 'pointer',
            fontFamily: 'monospace',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
          onClick={handleCopyId}
        >
          {truncatedId}
          {copied ? (
            <IconCheck size={14} style={{ color: '#40c057' }} />
          ) : (
            <IconCopy size={14} style={{ opacity: 0.5 }} />
          )}
        </Text>
      </Tooltip>
    );
  }
  
  // Regular breadcrumb item
  if (href) {
    return (
      <Anchor 
        onClick={() => navigate(href)} 
        c="dimmed" 
        size="sm"
        style={{ cursor: 'pointer' }}
      >
        {label}
      </Anchor>
    );
  }
  
  return (
    <Text size="sm">
      {label}
    </Text>
  );
};

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated, signOut } = useAuth();
  const { breadcrumbs } = useBreadcrumbs();
  const { projects, loadProjects } = useProjects();
  const currentProject = useSelector(state => state.projects.currentProject);
  const showProjectModal = useSelector(state => state.ui.modals.projectSelection);

  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    return localStorage.getItem('selectedProjectId') || null;
  });
  const [popoverOpened, setPopoverOpened] = useState(false);
  
  // Helper function to check if current page is a detail page
  const isOnDetailPage = () => {
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    const secondLastPart = pathParts[pathParts.length - 2];
    
    // Check if the path contains an ID (24 character hex string for MongoDB ObjectId)
    const hasId = /^[a-f\d]{24}$/i.test(lastPart) || /^[a-f\d]{24}$/i.test(secondLastPart);
    
    // Check for edit pages
    const isEditPage = lastPart === 'edit' && /^[a-f\d]{24}$/i.test(secondLastPart);
    
    return hasId || isEditPage;
  };
  
  // Helper function to get list page for current detail page
  const getListPageForCurrentPath = () => {
    const currentPath = location.pathname;
    const detailPageRedirects = {
      '/copies/': '/copies',
      '/brand-messages/': '/brand-messages',
      '/products/': '/products',
      '/projects/': '/projects',
    };
    
    for (const [pattern, listPage] of Object.entries(detailPageRedirects)) {
      if (currentPath.startsWith(pattern)) {
        return listPage;
      }
    }
    return null;
  };
  
  // Check if we're on the landing page
  const isLandingPage = location.pathname === '/';

  // Check if we're on settings pages (hide project selector)
  const isSettingsPage = location.pathname.startsWith('/settings');

  // Check if we're on dashboard page
  const isDashboardPage = location.pathname.startsWith('/dashboard');

  // Check if we're on a page that needs project context
  const needsProjectContext = location.pathname.includes('/brand-messages') ||
                              location.pathname.includes('/copies') ||
                              location.pathname.includes('/products') ||
                              (location.pathname.includes('/projects/') && location.pathname.includes('/versions'));

  // Check if we're on a project detail page
  const isProjectDetailPage = /^\/projects\/[^/]+$/.test(location.pathname);

  useEffect(() => {
    // Only load projects if authenticated and not on settings or dashboard pages
    if (isAuthenticated && !isSettingsPage && !isDashboardPage) {
      // Pass forceReload=false and empty filters to prevent unnecessary API calls
      loadProjects({}, false);
    }
  }, [isAuthenticated, isSettingsPage, isDashboardPage, loadProjects]);

  useEffect(() => {
    // Listen for localStorage changes (from Projects page or other sources)
    const handleStorageChange = () => {
      const newProjectId = localStorage.getItem('selectedProjectId');
      if (newProjectId !== selectedProjectId) {
        setSelectedProjectId(newProjectId);
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
  
  const handleProjectSelect = (projectId) => {
    // Don't do anything if selecting the same project
    if (projectId === selectedProjectId) {
      dispatch(closeModal('projectSelection'));
      return;
    }

    setSelectedProjectId(projectId);
    localStorage.setItem('selectedProjectId', projectId);
    dispatch(closeModal('projectSelection'));

    // If we're on a detail page, redirect to the corresponding list page
    if (isOnDetailPage()) {
      const listPage = getListPageForCurrentPath();
      if (listPage) {
        navigate(listPage);
      }
    }
  };

  const handleOpenProjectModal = () => {
    dispatch(openModal('projectSelection'));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div style={{ height: '100%' }}>
      {/* Top row - Logo and User Menu with colored background */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.03) 0%, rgba(109, 40, 217, 0.03) 100%)',
          borderBottom: '1px solid var(--mantine-color-gray-2)',
          padding: '8px 16px'
        }}
      >
        <Group h={40} justify="space-between">
          {/* Left side - Logo and Navigation Menu */}
          <Group gap={0} align="center">
            {/* Logo - Always show */}
            <Title 
              order={4} 
              c="violet.6" 
              fw={700}
              style={{ cursor: 'pointer', paddingRight: '16px' }}
              onClick={() => navigate('/dashboard')}
            >
              BrandBanda
            </Title>

            {/* Vertical Divider */}
            {!isLandingPage && isAuthenticated && (
              <Divider orientation="vertical" />
            )}

            {/* 9-dot navigation menu */}
            {!isLandingPage && isAuthenticated && (
              <div style={{ paddingLeft: '16px' }}>
              <Popover 
                trapFocus 
                position="bottom-start" 
                // withArrow 
                shadow="xl"
                width={280}
                transitionProps={{ transition: 'pop' }}
                opened={popoverOpened}
                onChange={setPopoverOpened}
              >
                <Popover.Target>
                  <ActionIcon 
                    variant="subtle" 
                    color="gray"
                    size="xl"
                    onClick={() => setPopoverOpened((o) => !o)}
                    style={{
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <IconApps size={26} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <Stack gap={0}>
                    <UnstyledButton
                      onClick={() => {
                        navigate('/projects');
                        setPopoverOpened(false);
                      }}
                      p="md"
                      style={{
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                      }}
                      sx={(theme) => ({
                        '&:hover': {
                          backgroundColor: theme.fn?.lighten ? theme.fn.lighten(theme.colors.violet[0], 0.5) : 'rgba(124, 58, 237, 0.05)',
                        }
                      })}
                    >
                      <Group gap="md">
                        <ThemeIcon 
                          size={40} 
                          radius="md" 
                          variant="light" 
                          color="violet"
                          style={{
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                          }}
                        >
                          <IconFolder size={22} />
                        </ThemeIcon>
                        <Box style={{ flex: 1 }}>
                          <Text size="sm" fw={600} mb={2}>Projects</Text>
                          <Text size="xs" c="dimmed">Manage your brand projects</Text>
                        </Box>
                      </Group>
                    </UnstyledButton>

                    <UnstyledButton
                      onClick={() => {
                        navigate('/products');
                        setPopoverOpened(false);
                      }}
                      p="md"
                      style={{
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                      }}
                      sx={(theme) => ({
                        '&:hover': {
                          backgroundColor: theme.fn?.lighten ? theme.fn.lighten(theme.colors.violet[0], 0.5) : 'rgba(124, 58, 237, 0.05)',
                        }
                      })}
                    >
                      <Group gap="md">
                        <ThemeIcon 
                          size={40} 
                          radius="md" 
                          variant="light" 
                          color="violet"
                          style={{
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                          }}
                        >
                          <IconBusiness size={22} />
                        </ThemeIcon>
                        <Box style={{ flex: 1 }}>
                          <Text size="sm" fw={600} mb={2}>Products</Text>
                          <Text size="xs" c="dimmed">Product definitions</Text>
                        </Box>
                      </Group>
                    </UnstyledButton>

                    <UnstyledButton
                      onClick={() => {
                        navigate('/brand-messages');
                        setPopoverOpened(false);
                      }}
                      p="md"
                      style={{
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                      }}
                      sx={(theme) => ({
                        '&:hover': {
                          backgroundColor: theme.fn?.lighten ? theme.fn.lighten(theme.colors.blue[0], 0.5) : 'rgba(34, 139, 230, 0.05)',
                        }
                      })}
                    >
                      <Group gap="md">
                        <ThemeIcon 
                          size={40} 
                          radius="md" 
                          variant="light" 
                          color="blue"
                          style={{
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                          }}
                        >
                          <IconMessages size={22} />
                        </ThemeIcon>
                        <Box style={{ flex: 1 }}>
                          <Text size="sm" fw={600} mb={2}>Brand Messages</Text>
                          <Text size="xs" c="dimmed">AI-powered messaging</Text>
                        </Box>
                      </Group>
                    </UnstyledButton>

                    <UnstyledButton
                      onClick={() => {
                        navigate('/copies');
                        setPopoverOpened(false);
                      }}
                      p="md"
                      style={{
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                      }}
                      sx={(theme) => ({
                        '&:hover': {
                          backgroundColor: theme.fn?.lighten ? theme.fn.lighten(theme.colors.grape[0], 0.5) : 'rgba(190, 75, 219, 0.05)',
                        }
                      })}
                    >
                      <Group gap="md">
                        <ThemeIcon 
                          size={40} 
                          radius="md" 
                          variant="light" 
                          color="grape"
                          style={{
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                          }}
                        >
                          <IconCopy size={22} />
                        </ThemeIcon>
                        <Box style={{ flex: 1 }}>
                          <Text size="sm" fw={600} mb={2}>Copy Generator</Text>
                          <Text size="xs" c="dimmed">Create marketing copies</Text>
                        </Box>
                      </Group>
                    </UnstyledButton>
                  </Stack>
                </Popover.Dropdown>
              </Popover>
              </div>
            )}
          </Group>

          {/* User Menu - Always show for authenticated users */}
          {isAuthenticated ? (
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <Text 
                  size="sm" 
                  fw={500}
                  px="sm"
                  py="xs"
                  style={{ 
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    display: 'inline-block'
                  }}
                  className="user-menu-trigger"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.08)';
                    e.currentTarget.style.color = 'var(--mantine-color-violet-7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'inherit';
                  }}
                >
                  {(() => {
                    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
                    return fullName.length > 15 ? fullName.substring(0, 15) + '...' : fullName;
                  })()}
                </Text>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconUser size={14} />}
                  onClick={() => navigate('/settings/account')}
                >
                  Profile
                </Menu.Item>
                
                <Menu.Item
                  leftSection={<IconCreditCard size={14} />}
                  onClick={() => navigate('/settings/billing')}
                >
                  Billing
                </Menu.Item>
                
                <Divider my={5} />
                
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  color="red"
                  onClick={handleSignOut}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Group gap="sm">
              <Link to="/login">
                <Button variant="subtle" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="filled" size="sm">
                  Get Started
                </Button>
              </Link>
            </Group>
          )}
        </Group>
      </div>

      {/* Bottom row - Project selector and Breadcrumbs */}
      <Group h={40} px="md" justify="space-between" style={{ backgroundColor: 'white' }}>
        <Group gap="md">
          {/* Project Selector for pages that need it */}
          {needsProjectContext && isAuthenticated && (
            <>
              <Text
                size="sm"
                fw={500}
                style={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                  transition: 'color 0.2s ease',
                }}
                onClick={handleOpenProjectModal}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--mantine-color-violet-6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'inherit';
                }}
              >
                {selectedProject ? selectedProject.name : 'Select Project'}
              </Text>
              
              {breadcrumbs.length > 0 && (
                <Divider orientation="vertical" />
              )}
            </>
          )}
          
          {/* Project Name Display for Project Detail Page */}
          {isProjectDetailPage && isAuthenticated && currentProject && (
            <>
              <Group gap="xs">
                <Text
                  size="sm"
                  fw={600}
                  c="violet.6"
                >
                  {currentProject.name}
                </Text>
              </Group>
              
              {breadcrumbs.length > 0 && (
                <Divider orientation="vertical" />
              )}
            </>
          )}
          
          {/* Breadcrumbs */}
          {!isLandingPage && breadcrumbs.length > 0 && (
            <Breadcrumbs separator="→" mb={0}>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem 
                  key={index}
                  label={crumb.label}
                  href={crumb.href}
                  navigate={navigate}
                />
              ))}
            </Breadcrumbs>
          )}
        </Group>

        {/* Right side - Empty for now */}
        <div />
      </Group>
      
      {/* Project Selection Modal - don't show on settings pages */}
      {!isSettingsPage && (
        <ProjectSelectionModal
          opened={showProjectModal}
          onClose={() => {
            if (selectedProjectId || projects.length === 0) {
              dispatch(closeModal('projectSelection'));
            }
          }}
          onSelect={handleProjectSelect}
          projects={projects}
          selectedProjectId={selectedProjectId}
          description="Please select a project to continue"
          noProjectsMessage="You need to create a project first to get started."
          createButtonText={projects.length === 0 ? "Create Your First Project" : "Create New Project"}
          allowClose={projects.length === 0}
        />
      )}
    </div>
  );
};

export default Navigation;