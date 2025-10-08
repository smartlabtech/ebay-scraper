import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppShell,
  Box,
  NavLink,
  Text,
  Group,
  Title,
  ThemeIcon,
  UnstyledButton,
  Avatar,
  Menu,
  rem,
  Divider,
  Burger,
  ScrollArea
} from '@mantine/core';
import {
  MdDashboard,
  MdStore,
  MdSettings,
  MdLogout,
  MdPerson,
  MdKeyboardArrowDown,
  MdAnalytics,
  MdInventory,
  MdNotifications,
  MdHelp,
  MdPlayCircleOutline
} from 'react-icons/md';
import { HiTag, HiCog, HiDocumentText, HiShoppingCart } from 'react-icons/hi';
import { selectUser, logout } from '../../store/slices/authSlice';
import ToastContainer from '../common/Toast';

const ControlPanelLayout = () => {
  const [mobileOpened, setMobileOpened] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // Navigation items - easily expandable
  const navigationItems = [
    {
      label: 'Dashboard',
      icon: MdDashboard,
      path: '/control',
      color: 'blue'
    },
    {
      label: 'Stores',
      icon: MdStore,
      path: '/control/stores',
      color: 'violet',
      children: [
        { label: 'All Stores', path: '/control/stores' },
        { label: 'Add Store', path: '/control/stores/new' },
        { label: 'Import Stores', path: '/control/stores/import' },
        { label: 'Store Analytics', path: '/control/stores/analytics' }
      ]
    },
    {
      label: 'Keywords',
      icon: HiTag,
      path: '/control/keywords',
      color: 'teal'
    },
    {
      label: 'Items',
      icon: HiShoppingCart,
      path: '/control/items',
      color: 'indigo'
    },
    {
      type: 'section',
      label: 'Middle Work',
      children: [
        { label: 'Keyword Pages', path: '/control/keyword-pages', icon: HiDocumentText, color: 'cyan' },
        { label: 'Manifests', path: '/control/manifests', icon: HiDocumentText, color: 'pink' }
      ]
    },
    {
      label: 'Webscraper',
      icon: HiCog,
      path: '/control/webscraper',
      color: 'orange'
    },
    {
      label: 'Flow Actions',
      icon: MdPlayCircleOutline,
      path: '/control/flow-actions',
      color: 'grape'
    },
    // Future sections can be added here
    // {
    //   label: 'Inventory',
    //   icon: MdInventory,
    //   path: '/control/inventory',
    //   color: 'green'
    // },
    // {
    //   label: 'Analytics',
    //   icon: MdAnalytics,
    //   path: '/control/analytics',
    //   color: 'orange'
    // },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/control' && location.pathname === '/control') return true;
    if (path !== '/control' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const renderNavItem = (item, index) => {
    // Render section divider with children
    if (item.type === 'section') {
      return (
        <Box key={`section-${index}`} my="md">
          <Divider
            label={
              <Text size="xs" c="dimmed" fw={600}>
                {item.label}
              </Text>
            }
            labelPosition="center"
            mb="xs"
          />
          {item.children && item.children.map(child => (
            <NavLink
              key={child.path}
              label={child.label}
              leftSection={
                child.icon && child.color ? (
                  <ThemeIcon size="sm" variant="light" color={child.color}>
                    <child.icon size={16} />
                  </ThemeIcon>
                ) : undefined
              }
              active={location.pathname === child.path}
              onClick={() => navigate(child.path)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      );
    }

    // Render nav item with children
    if (item.children) {
      return (
        <NavLink
          key={item.path}
          label={item.label}
          leftSection={
            <ThemeIcon size="sm" variant="light" color={item.color}>
              <item.icon size={16} />
            </ThemeIcon>
          }
          childrenOffset={28}
          defaultOpened={location.pathname.startsWith(item.path)}
        >
          {item.children.map(child => (
            <NavLink
              key={child.path}
              label={child.label}
              active={location.pathname === child.path}
              onClick={() => navigate(child.path)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </NavLink>
      );
    }

    // Render regular nav item
    return (
      <NavLink
        key={item.path}
        label={item.label}
        leftSection={
          <ThemeIcon size="sm" variant="light" color={item.color}>
            <item.icon size={16} />
          </ThemeIcon>
        }
        active={isActive(item.path)}
        onClick={() => navigate(item.path)}
        style={{ cursor: 'pointer' }}
      />
    );
  };

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 250,
          breakpoint: 'sm',
          collapsed: { mobile: !mobileOpened }
        }}
        padding="md"
      >
        {/* Header */}
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Burger
                opened={mobileOpened}
                onClick={() => setMobileOpened(!mobileOpened)}
                hiddenFrom="sm"
                size="sm"
              />
              <Title order={3}>Control Panel</Title>
            </Group>

            {/* User Menu */}
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap={7}>
                    <Avatar
                      src={user?.avatar}
                      alt={user?.name}
                      radius="xl"
                      size={30}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Text fw={500} size="sm">
                      {user?.name || 'User'}
                    </Text>
                    <MdKeyboardArrowDown size={16} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item
                  leftSection={<MdPerson size={16} />}
                  onClick={() => navigate('/control/profile')}
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  leftSection={<MdSettings size={16} />}
                  onClick={() => navigate('/control/settings')}
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  leftSection={<MdNotifications size={16} />}
                  onClick={() => navigate('/control/notifications')}
                >
                  Notifications
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                  leftSection={<MdHelp size={16} />}
                  onClick={() => navigate('/control/help')}
                >
                  Help & Support
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                  color="red"
                  leftSection={<MdLogout size={16} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </AppShell.Header>

        {/* Sidebar Navigation */}
        <AppShell.Navbar p="md">
          <AppShell.Section grow component={ScrollArea}>
            {/* Logo/Brand Area */}
            <Box mb="md">
              <Group>
                <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
                  <MdStore size={20} />
                </ThemeIcon>
                <Box>
                  <Text fw={600} size="sm">eBay Manager</Text>
                  <Text size="xs" c="dimmed">Store Management</Text>
                </Box>
              </Group>
            </Box>

            <Divider mb="md" />

            {/* Navigation Items */}
            {navigationItems.map((item, index) => renderNavItem(item, index))}
          </AppShell.Section>

          {/* Footer Section - Optional */}
          <AppShell.Section>
            <Divider mb="md" />
            <Box>
              <Text size="xs" c="dimmed" ta="center">
                Version 1.0.0
              </Text>
            </Box>
          </AppShell.Section>
        </AppShell.Navbar>

        {/* Main Content Area */}
        <AppShell.Main>
          {/* Page Content with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AppShell.Main>
      </AppShell>

      {/* Toast notifications */}
      <ToastContainer />
    </>
  );
};

export default ControlPanelLayout;