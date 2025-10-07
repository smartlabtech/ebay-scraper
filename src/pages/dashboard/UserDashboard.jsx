import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  Text,
  Title,
  Stack,
  Group,
  Badge,
  Button,
  ThemeIcon,
  Box,
  Progress,
  RingProgress,
  Timeline,
  Paper,
  SimpleGrid
} from '@mantine/core';
import {
  MdStore,
  MdTrendingUp,
  MdInventory,
  MdAttachMoney,
  MdWarning,
  MdCheckCircle,
  MdSchedule,
  MdArrowUpward,
  MdArrowDownward,
  MdSync,
  MdNotifications
} from 'react-icons/md';

const UserDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStores: 5,
    activeStores: 3,
    totalItems: 1469,
    totalSales: 8393.96,
    todaySales: 234.56,
    weeklyGrowth: 12.5,
    monthlyRevenue: 3456.78,
    pendingSyncs: 2,
    failedSyncs: 1,
    lastSyncTime: '5 minutes ago'
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'sync',
      status: 'success',
      message: 'Electronics Hub synced successfully',
      time: '2 minutes ago',
      icon: MdCheckCircle,
      color: 'green'
    },
    {
      id: 2,
      type: 'sale',
      status: 'success',
      message: 'New sale: $45.99 from Fashion Store',
      time: '15 minutes ago',
      icon: MdAttachMoney,
      color: 'blue'
    },
    {
      id: 3,
      type: 'sync',
      status: 'warning',
      message: 'Sports Equipment sync delayed',
      time: '1 hour ago',
      icon: MdWarning,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'update',
      status: 'success',
      message: '23 new items added to Home & Garden',
      time: '3 hours ago',
      icon: MdInventory,
      color: 'violet'
    }
  ]);

  const [performanceData] = useState({
    daily: [
      { day: 'Mon', sales: 234 },
      { day: 'Tue', sales: 345 },
      { day: 'Wed', sales: 456 },
      { day: 'Thu', sales: 367 },
      { day: 'Fri', sales: 478 },
      { day: 'Sat', sales: 589 },
      { day: 'Sun', sales: 423 }
    ]
  });

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <Card shadow="sm" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
          {title}
        </Text>
        <ThemeIcon size="sm" radius="md" variant="light" color={color}>
          <Icon size={16} />
        </ThemeIcon>
      </Group>
      <Group justify="space-between" align="flex-end">
        <Box>
          <Text size="xl" fw={700}>
            {value}
          </Text>
          {subtitle && (
            <Text size="xs" c="dimmed" mt={4}>
              {subtitle}
            </Text>
          )}
        </Box>
        {trend && (
          <Group gap={4}>
            {trend > 0 ? (
              <MdArrowUpward size={14} color="green" />
            ) : (
              <MdArrowDownward size={14} color="red" />
            )}
            <Text size="xs" c={trend > 0 ? 'green' : 'red'} fw={600}>
              {Math.abs(trend)}%
            </Text>
          </Group>
        )}
      </Group>
    </Card>
  );

  return (
    <Stack gap="xl">
      {/* Page Header */}
      <Box>
        <Title order={2} mb={4}>
          Control Panel Overview
        </Title>
        <Text c="dimmed" size="sm">
          Welcome back! Here's what's happening with your stores today.
        </Text>
      </Box>

      {/* Quick Stats Grid */}
      <Grid>
        <Grid.Col span={{base: 12, sm: 6, md: 3}}>
          <StatCard
            title="Active Stores"
            value={`${stats.activeStores}/${stats.totalStores}`}
            icon={MdStore}
            color="blue"
            subtitle="Currently active"
            trend={0}
          />
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6, md: 3}}>
          <StatCard
            title="Today's Sales"
            value={`$${stats.todaySales}`}
            icon={MdAttachMoney}
            color="green"
            subtitle="Revenue today"
            trend={stats.weeklyGrowth}
          />
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6, md: 3}}>
          <StatCard
            title="Total Items"
            value={stats.totalItems.toLocaleString()}
            icon={MdInventory}
            color="violet"
            subtitle="Across all stores"
            trend={8.2}
          />
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6, md: 3}}>
          <StatCard
            title="Sync Status"
            value={stats.lastSyncTime}
            icon={MdSync}
            color={stats.failedSyncs > 0 ? 'orange' : 'teal'}
            subtitle={`${stats.pendingSyncs} pending`}
          />
        </Grid.Col>
      </Grid>

      {/* Main Content Grid */}
      <Grid>
        {/* Performance Overview */}
        <Grid.Col span={{base: 12, md: 8}}>
          <Card shadow="sm" radius="md" withBorder>
            <Title order={4} mb="md">Performance Overview</Title>

            <Stack gap="md">
              {/* Revenue Progress */}
              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>Monthly Revenue Goal</Text>
                  <Text size="sm" c="dimmed">$3,457 / $5,000</Text>
                </Group>
                <Progress value={69} size="lg" radius="md" color="blue" />
                <Text size="xs" c="dimmed" mt="xs">69% of monthly target achieved</Text>
              </Box>

              {/* Store Performance */}
              <SimpleGrid cols={2} spacing="md">
                <Paper p="md" radius="md" withBorder>
                  <Group>
                    <RingProgress
                      size={60}
                      thickness={6}
                      sections={[
                        { value: 60, color: 'green' },
                        { value: 20, color: 'yellow' },
                        { value: 20, color: 'gray' }
                      ]}
                    />
                    <Box>
                      <Text size="sm" fw={600}>Store Health</Text>
                      <Text size="xs" c="dimmed">3 active, 1 paused, 1 inactive</Text>
                    </Box>
                  </Group>
                </Paper>

                <Paper p="md" radius="md" withBorder>
                  <Group>
                    <RingProgress
                      size={60}
                      thickness={6}
                      sections={[{ value: stats.weeklyGrowth * 4, color: 'teal' }]}
                      label={
                        <Text size="xs" ta="center" fw={700}>
                          {stats.weeklyGrowth}%
                        </Text>
                      }
                    />
                    <Box>
                      <Text size="sm" fw={600}>Weekly Growth</Text>
                      <Text size="xs" c="dimmed">vs last week</Text>
                    </Box>
                  </Group>
                </Paper>
              </SimpleGrid>

              {/* Quick Actions */}
              <Group mt="md">
                <Button
                  variant="light"
                  leftSection={<MdStore size={16} />}
                  onClick={() => navigate('/control/stores')}
                >
                  Manage Stores
                </Button>
                <Button
                  variant="light"
                  color="violet"
                  leftSection={<MdSync size={16} />}
                  onClick={() => navigate('/control/stores')}
                >
                  Sync All Stores
                </Button>
                <Button
                  variant="light"
                  color="teal"
                  leftSection={<MdTrendingUp size={16} />}
                  onClick={() => navigate('/control/stores/analytics')}
                >
                  View Analytics
                </Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Recent Activity */}
        <Grid.Col span={{base: 12, md: 4}}>
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Recent Activity</Title>
              <Badge variant="light" color="blue" size="sm">Live</Badge>
            </Group>

            <Timeline bulletSize={24} lineWidth={2}>
              {recentActivity.map((activity) => (
                <Timeline.Item
                  key={activity.id}
                  bullet={
                    <ThemeIcon size={24} variant="light" color={activity.color} radius="xl">
                      <activity.icon size={12} />
                    </ThemeIcon>
                  }
                >
                  <Text size="sm" fw={500}>{activity.message}</Text>
                  <Text size="xs" c="dimmed" mt={4}>{activity.time}</Text>
                </Timeline.Item>
              ))}
            </Timeline>

            <Button
              fullWidth
              variant="subtle"
              mt="md"
              onClick={() => navigate('/control/activity')}
            >
              View All Activity
            </Button>
          </Card>
        </Grid.Col>
      </Grid>

      {/* System Status */}
      <Card shadow="sm" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={4}>System Status</Title>
          <Badge
            leftSection={<MdCheckCircle size={12} />}
            variant="light"
            color="green"
          >
            All Systems Operational
          </Badge>
        </Group>

        <SimpleGrid cols={{base: 1, sm: 2, md: 4}} spacing="md">
          <Paper p="sm" radius="md" bg="green.0" withBorder>
            <Group gap="xs">
              <ThemeIcon size="sm" color="green" variant="light">
                <MdCheckCircle size={14} />
              </ThemeIcon>
              <Box>
                <Text size="xs" fw={600}>API Connection</Text>
                <Text size="xs" c="dimmed">Connected</Text>
              </Box>
            </Group>
          </Paper>

          <Paper p="sm" radius="md" bg="green.0" withBorder>
            <Group gap="xs">
              <ThemeIcon size="sm" color="green" variant="light">
                <MdSync size={14} />
              </ThemeIcon>
              <Box>
                <Text size="xs" fw={600}>Auto Sync</Text>
                <Text size="xs" c="dimmed">Enabled</Text>
              </Box>
            </Group>
          </Paper>

          <Paper p="sm" radius="md" bg="yellow.0" withBorder>
            <Group gap="xs">
              <ThemeIcon size="sm" color="yellow" variant="light">
                <MdSchedule size={14} />
              </ThemeIcon>
              <Box>
                <Text size="xs" fw={600}>Scheduled Tasks</Text>
                <Text size="xs" c="dimmed">2 pending</Text>
              </Box>
            </Group>
          </Paper>

          <Paper p="sm" radius="md" bg="blue.0" withBorder>
            <Group gap="xs">
              <ThemeIcon size="sm" color="blue" variant="light">
                <MdNotifications size={14} />
              </ThemeIcon>
              <Box>
                <Text size="xs" fw={600}>Notifications</Text>
                <Text size="xs" c="dimmed">3 unread</Text>
              </Box>
            </Group>
          </Paper>
        </SimpleGrid>
      </Card>
    </Stack>
  );
};

export default UserDashboard;