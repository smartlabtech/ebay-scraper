import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Text,
  Title,
  Stack,
  Group,
  Badge,
  RingProgress,
  ThemeIcon,
  Box,
  Alert
} from '@mantine/core';
import {
  MdAttachMoney,
  MdPeople,
  MdShoppingCart,
  MdCardGiftcard,
  MdTrendingUp,
  MdInfo
} from 'react-icons/md';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 156,
    activeSubscriptions: 89,
    totalRevenue: 15234.50,
    pendingOrders: 12,
    totalPlans: 5,
    totalCreditsUsed: 458900,
    growthRate: 15.3
  });

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card shadow="sm" radius="md" withBorder>
      <Group justify="space-between">
        <Box>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Text size="xl" fw={700} mt="xs">
            {value}
          </Text>
          {subtitle && (
            <Text size="xs" c="dimmed" mt={4}>
              {subtitle}
            </Text>
          )}
        </Box>
        <ThemeIcon size="xl" radius="md" variant="light" color={color}>
          <Icon size={24} />
        </ThemeIcon>
      </Group>
    </Card>
  );

  return (
    <Stack gap="xl">
      {/* Header */}
      <Box>
        <Title order={2} mb={4}>
          Dashboard Overview
        </Title>
        <Text c="dimmed" size="sm">
          Welcome to the admin control panel
        </Text>
      </Box>

      {/* Alert */}
      <Alert icon={<MdInfo size={16} />} color="blue">
        <Text size="sm">
          System is running smoothly. All services are operational.
        </Text>
      </Alert>

      {/* Stats Grid */}
      <Grid>
        <Grid.Col span={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={MdPeople}
            color="blue"
            subtitle="+23 this week"
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions}
            icon={MdCardGiftcard}
            c="green"
            subtitle="57% of total users"
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={MdAttachMoney}
            color="violet"
            subtitle="This month"
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={MdShoppingCart}
            color="orange"
            subtitle="Requires attention"
          />
        </Grid.Col>
      </Grid>

      {/* Additional Stats */}
      <Grid>
        <Grid.Col span={4}>
          <Card shadow="sm" radius="md" withBorder>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="md">
              Growth Rate
            </Text>
            <Group>
              <RingProgress
                size={80}
                thickness={8}
                sections={[{ value: stats.growthRate, color: 'green' }]}
                label={
                  <Text size="xs" ta="center" fw={700}>
                    {stats.growthRate}%
                  </Text>
                }
              />
              <Box>
                <Text size="sm" fw={600}>Monthly Growth</Text>
                <Text size="xs" c="dimmed">Compared to last month</Text>
              </Box>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card shadow="sm" radius="md" withBorder>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="md">
              Plans Distribution
            </Text>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm">Free</Text>
                <Badge color="gray">32 users</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Starter</Text>
                <Badge color="blue">45 users</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Professional</Text>
                <Badge color="violet">67 users</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Enterprise</Text>
                <Badge c="green">12 users</Badge>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card shadow="sm" radius="md" withBorder>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="md">
              Credits Usage
            </Text>
            <Box>
              <Text size="xl" fw={700}>
                {(stats.totalCreditsUsed / 1000).toFixed(1)}K
              </Text>
              <Text size="xs" c="dimmed">Total credits used this month</Text>
              <Group mt="md">
                <ThemeIcon size="sm" c="green" variant="light">
                  <MdTrendingUp size={16} />
                </ThemeIcon>
                <Text size="xs" c="green" fw={600}>
                  +18.2% from last month
                </Text>
              </Group>
            </Box>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Quick Actions */}
      <Card shadow="sm" radius="md" withBorder>
        <Title order={4} mb="md">Quick Actions</Title>
        <Group>
          <Badge
            size="lg"
            variant="outline"
            color="violet"
            style={{ cursor: 'pointer' }}
            onClick={() => window.location.href = '/control/plans'}
          >
            Manage Plans
          </Badge>
          <Badge
            size="lg"
            variant="outline"
            color="blue"
            style={{ cursor: 'pointer' }}
            onClick={() => window.location.href = '/control/users'}
          >
            View Users
          </Badge>
          <Badge
            size="lg"
            variant="outline"
            c="green"
            style={{ cursor: 'pointer' }}
            onClick={() => window.location.href = '/control/credit-packages'}
          >
            Credit Packages
          </Badge>
          <Badge
            size="lg"
            variant="outline"
            color="orange"
            style={{ cursor: 'pointer' }}
            onClick={() => window.location.href = '/control/orders'}
          >
            Process Orders
          </Badge>
        </Group>
      </Card>
    </Stack>
  );
};

export default AdminDashboard;