import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  AppShell,
  Text,
  Burger,
  useMantineTheme,
  Group,
  Box,
  UnstyledButton,
  ThemeIcon,
  Badge,
  Divider,
  Stack,
  rem
} from '@mantine/core';
import {
  MdDashboard,
  MdAttachMoney,
  MdCardGiftcard,
  MdShoppingCart,
  MdPeople,
  MdInsights,
  MdSettings,
  MdLogout
} from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    {
      label: 'Dashboard',
      icon: MdDashboard,
      link: '/control',
      color: 'blue'
    },
    {
      label: 'Plans',
      icon: MdAttachMoney,
      link: '/control/plans',
      color: 'violet'
    },
    {
      label: 'Credit Packages',
      icon: MdCardGiftcard,
      link: '/control/credit-packages',
      color: 'green'
    },
    {
      label: 'Credits Monitoring',
      icon: MdInsights,
      link: '/control/credits',
      color: 'purple'
    },
    {
      label: 'Orders',
      icon: MdShoppingCart,
      link: '/control/orders',
      color: 'orange'
    },
    {
      label: 'Users',
      icon: MdPeople,
      link: '/control/users',
      color: 'cyan'
    },
    {
      label: 'Analytics',
      icon: MdInsights,
      link: '/control/analytics',
      color: 'pink'
    },
    {
      label: 'Settings',
      icon: MdSettings,
      link: '/control/settings',
      color: 'gray'
    }
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.link ||
                    (item.link !== '/control' && location.pathname.startsWith(item.link));

    return (
      <UnstyledButton
        component={NavLink}
        to={item.link}
        style={{
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.md,
          backgroundColor: isActive ? theme.colors.violet[0] : 'transparent',
          color: isActive ? theme.colors.violet[9] : theme.colors.gray[7],
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: theme.colors.gray[0]
          }
        }}
      >
        <Group>
          <ThemeIcon
            size="lg"
            variant={isActive ? 'filled' : 'light'}
            color={item.color}
          >
            <item.icon size={20} />
          </ThemeIcon>
          <Text size="sm" fw={isActive ? 600 : 400}>
            {item.label}
          </Text>
        </Group>
      </UnstyledButton>
    );
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            hiddenFrom="sm"
            size="sm"
          />
          <Text
            size="xl"
            fw={700}
            variant="gradient"
            gradient={{ from: 'violet', to: 'grape', deg: 135 }}
          >
            Admin Dashboard
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          <Box mb="md">
            <Group justify="space-between" mb="xs">
              <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                Admin Control Panel
              </Text>
              <Badge size="xs" variant="filled" color="violet">
                Admin
              </Badge>
            </Group>
            <Divider />
          </Box>

          <Stack gap="xs">
            {navItems.map((item) => (
              <NavItem key={item.link} item={item} />
            ))}
          </Stack>
        </AppShell.Section>

        <AppShell.Section>
          <Divider mb="md" />

          <Box mb="md">
            <Text size="xs" c="dimmed" mb="xs">
              Logged in as
            </Text>
            <Text size="sm" fw={600}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text size="xs" c="dimmed">
              {user?.email}
            </Text>
          </Box>

          <UnstyledButton
            onClick={logout}
            style={{
              display: 'block',
              width: '100%',
              padding: theme.spacing.xs,
              borderRadius: theme.radius.md,
              color: theme.colors.red[6],
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: theme.colors.red[0]
              }
            }}
          >
            <Group>
              <ThemeIcon size="lg" variant="light" color="red">
                <MdLogout size={20} />
              </ThemeIcon>
              <Text size="sm">Logout</Text>
            </Group>
          </UnstyledButton>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default AdminLayout;