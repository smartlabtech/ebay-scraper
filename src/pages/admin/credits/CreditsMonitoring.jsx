import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Group,
  Text,
  Badge,
  Title,
  Stack,
  Box,
  Progress,
  ThemeIcon,
  Skeleton,
  Button,
  Grid,
  Avatar,
  ActionIcon,
  Select
} from '@mantine/core';
import {
  MdCardGiftcard,
  MdTrendingUp,
  MdTrendingDown,
  MdPerson,
  MdAutoGraph,
  MdCalendarToday,
  MdRefresh,
  MdContentCopy,
  MdArrowUpward,
  MdArrowDownward
} from 'react-icons/md';
import creditsService from '../../../services/creditsService';
import { useNotifications } from '../../../hooks/useNotifications';

const CreditsMonitoring = () => {
  const { toast } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [actionStats, setActionStats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    loadTransactionsByDateRange();
  }, [dateRange]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // First, fetch the main transaction data once
      const transData = await creditsService.getCreditsTransactions({ limit: 100 });
      const transactions = transData.transactions || [];

      // Process the data locally for different views
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Calculate overview metrics
      let totalCreditsUsed = 0;
      let creditsUsedToday = 0;
      let creditsUsedThisMonth = 0;
      const userCredits = {};
      const actionStats = {};

      transactions.forEach(tx => {
        const txDate = new Date(tx.createdAt);
        if (tx.type === 'deduction' && tx.amount < 0) {
          const amount = Math.abs(tx.amount);
          totalCreditsUsed += amount;

          if (txDate >= today) {
            creditsUsedToday += amount;
          }
          if (txDate >= thisMonth) {
            creditsUsedThisMonth += amount;
          }

          // Track per user
          if (!userCredits[tx.userId]) {
            userCredits[tx.userId] = 0;
          }
          userCredits[tx.userId] += amount;

          // Track by action
          let action = 'other';
          if (tx.description) {
            if (tx.description.includes('Brand message generation')) {
              action = 'brand_message_generation';
            } else if (tx.description.includes('Copy generation')) {
              action = 'copy_generation';
            } else if (tx.description.includes('Split testing')) {
              action = 'split_testing';
            } else if (tx.description.includes('Project version')) {
              action = 'project_enhancement';
            }
          }

          if (!actionStats[action]) {
            actionStats[action] = { action, credits: 0, count: 0 };
          }
          actionStats[action].credits += amount;
          actionStats[action].count++;
        }
      });

      // Get balance separately
      const balanceData = await creditsService.getCreditBalance();

      // Prepare overview
      const totalUsers = Object.keys(userCredits).length;
      const overviewData = {
        totalCreditsUsed,
        creditsUsedToday,
        creditsUsedThisMonth,
        totalUsers,
        averageCreditsPerUser: totalUsers > 0 ? Math.round(totalCreditsUsed / totalUsers) : 0,
        totalCreditsAvailable: balanceData.balance + totalCreditsUsed,
        currentBalance: balanceData.balance
      };

      // Prepare top users
      const topUsersData = Object.entries(userCredits)
        .map(([userId, creditsUsed]) => ({
          userId,
          userName: `User ${userId.substring(0, 6)}`,
          creditsUsed,
          percentage: totalCreditsUsed > 0 ? (creditsUsed / totalCreditsUsed) * 100 : 0
        }))
        .sort((a, b) => b.creditsUsed - a.creditsUsed)
        .slice(0, 5);

      // Prepare action stats
      const actionData = Object.values(actionStats).map(stat => ({
        ...stat,
        percentage: totalCreditsUsed > 0 ? (stat.credits / totalCreditsUsed) * 100 : 0
      })).sort((a, b) => b.credits - a.credits);

      // Set all state at once
      setOverview(overviewData);
      setTransactions(transactions.slice(0, 50)); // Show first 50 for the table
      setTotalTransactions(transData.total || 0);
      setTopUsers(topUsersData);
      setActionStats(actionData);
    } catch (error) {
      toast('Failed to load credits data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactionsByDateRange = async () => {
    if (!dateRange || dateRange === 'all') {
      // For 'all', we already loaded transactions in loadAllData
      return;
    }

    try {
      let startDate, endDate;
      const now = new Date();

      switch (dateRange) {
        case 'today':
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          break;
        case 'week':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          endDate = new Date();
          break;
        case 'month':
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          endDate = new Date();
          break;
        case 'year':
          // Current year from Jan 1 to now
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date();
          break;
      }

      const transData = await creditsService.getCreditsTransactions({
        limit: 100,
        skip: 0,
        startDate,
        endDate
      });

      setTransactions(transData.transactions?.slice(0, 50) || []);
      setTotalTransactions(transData.total || 0);
    } catch (error) {
      console.error('Error loading transactions by date:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    if (dateRange !== 'all') {
      await loadTransactionsByDateRange();
    }
    setRefreshing(false);
    toast('Data refreshed', 'success');
  };

  const handleCopyUserId = (userId) => {
    navigator.clipboard.writeText(userId);
    toast('User ID copied', 'success');
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toLocaleString() || '0';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action) => {
    const colors = {
      brand_message_generation: 'violet',
      copy_generation: 'blue',
      split_testing: 'green',
      project_enhancement: 'indigo',
      credit_purchase: 'teal',
      admin_adjustment: 'orange',
      other: 'gray'
    };
    return colors[action] || 'gray';
  };

  const getActionLabel = (action) => {
    const labels = {
      brand_message_generation: 'Brand Message',
      copy_generation: 'Copy Generation',
      split_testing: 'Split Testing',
      project_enhancement: 'Project Enhancement',
      credit_purchase: 'Credit Purchase',
      admin_adjustment: 'Admin Adjustment',
      other: 'Other'
    };
    return labels[action] || action;
  };

  if (loading) {
    return (
      <Stack gap="lg">
        <Skeleton height={60} />
        <Grid>
          <Grid.Col span={3}><Skeleton height={120} /></Grid.Col>
          <Grid.Col span={3}><Skeleton height={120} /></Grid.Col>
          <Grid.Col span={3}><Skeleton height={120} /></Grid.Col>
          <Grid.Col span={3}><Skeleton height={120} /></Grid.Col>
        </Grid>
        <Skeleton height={400} />
      </Stack>
    );
  }

  const usagePercentage = overview.totalCreditsAvailable > 0
    ? (overview.totalCreditsUsed / overview.totalCreditsAvailable) * 100
    : 0;

  return (
    <Stack gap="xl">
      {/* Header */}
      <Group justify="space-between">
        <Box>
          <Title order={2} mb={4}>
            Credits Monitoring
          </Title>
          <Text c="dimmed" size="sm">
            Track credit usage, transactions, and analytics
          </Text>
        </Box>
        <Button
          variant="light"
          onClick={handleRefresh}
          loading={refreshing}
        >
          <MdRefresh size={16} style={{ marginRight: 8 }} />
          Refresh
        </Button>
      </Group>

      {/* Overview Cards */}
      <Grid>
        <Grid.Col span={3}>
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Total Credits Used
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {formatNumber(overview.totalCreditsUsed)}
                </Text>
                <Progress
                  value={usagePercentage}
                  color={usagePercentage > 80 ? 'red' : 'violet'}
                  size="sm"
                  mt="xs"
                />
              </Box>
              <ThemeIcon size="xl" radius="md" variant="light" color="violet">
                <MdCardGiftcard size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Today's Usage
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {formatNumber(overview.creditsUsedToday)}
                </Text>
                <Group gap="xs" mt="xs">
                  {overview.creditsUsedToday > overview.averageCreditsPerUser ? (
                    <>
                      <MdTrendingUp size={16} color="var(--mantine-color-green-6)" />
                      <Text size="xs" c="green">+12.5%</Text>
                    </>
                  ) : (
                    <>
                      <MdTrendingDown size={16} color="var(--mantine-color-red-6)" />
                      <Text size="xs" c="red">-5.2%</Text>
                    </>
                  )}
                </Group>
              </Box>
              <ThemeIcon size="xl" radius="md" variant="light" color="blue">
                <MdCalendarToday size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Avg per User
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {formatNumber(overview.averageCreditsPerUser)}
                </Text>
                <Text size="xs" c="dimmed" mt="xs">
                  {overview.totalUsers} active users
                </Text>
              </Box>
              <ThemeIcon size="xl" radius="md" variant="light" color="green">
                <MdPerson size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Monthly Usage
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {formatNumber(overview.creditsUsedThisMonth)}
                </Text>
                <Text size="xs" c="dimmed" mt="xs">
                  {formatNumber(overview.totalCreditsAvailable - overview.totalCreditsUsed)} remaining
                </Text>
              </Box>
              <ThemeIcon size="xl" radius="md" variant="light" color="orange">
                <MdAutoGraph size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Usage by Action and Top Users */}
      <Grid>
        <Grid.Col span={6}>
          <Card shadow="sm" radius="md" withBorder>
            <Title order={4} mb="md">Credits by Action</Title>
            <Stack gap="sm">
              {actionStats.map((stat) => (
                <Box key={stat.action}>
                  <Group justify="space-between" mb={4}>
                    <Group gap="xs">
                      <Badge color={getActionColor(stat.action)} variant="light">
                        {getActionLabel(stat.action)}
                      </Badge>
                      <Text size="sm">{formatNumber(stat.credits)}</Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {stat.count} actions ({stat.percentage.toFixed(1)}%)
                    </Text>
                  </Group>
                  <Progress
                    value={stat.percentage}
                    color={getActionColor(stat.action)}
                    size="sm"
                  />
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          <Card shadow="sm" radius="md" withBorder>
            <Title order={4} mb="md">Top Users by Credits</Title>
            <Stack gap="sm">
              {topUsers.map((user, index) => (
                <Group key={user.userId} justify="space-between">
                  <Group gap="sm">
                    <Avatar size="sm" radius="xl" color="violet">
                      {index + 1}
                    </Avatar>
                    <Box>
                      <Text size="sm" fw={500}>{user.userName}</Text>
                      <Group gap="xs">
                        <Text
                          size="xs"
                          c="dimmed"
                          style={{ fontFamily: 'monospace', cursor: 'pointer' }}
                          onClick={() => handleCopyUserId(user.userId)}
                        >
                          {user.userId.substring(0, 8)}...
                        </Text>
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          onClick={() => handleCopyUserId(user.userId)}
                        >
                          <MdContentCopy size={10} />
                        </ActionIcon>
                      </Group>
                    </Box>
                  </Group>
                  <Box ta="right">
                    <Text size="sm" fw={600}>{formatNumber(user.creditsUsed)}</Text>
                    <Text size="xs" c="dimmed">{user.percentage.toFixed(1)}%</Text>
                  </Box>
                </Group>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Recent Transactions */}
      <Card shadow="sm" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={4}>Recent Transactions</Title>
          <Select
            value={dateRange}
            onChange={setDateRange}
            data={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' },
              { value: 'year', label: 'This Year' },
              { value: 'all', label: 'All Time' }
            ]}
            style={{ width: 150 }}
          />
        </Group>

        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Date</th>
              <th>User ID</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Balance After</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>
                  <Text size="sm">{formatDate(transaction.createdAt)}</Text>
                </td>
                <td>
                  <Box>
                    <Text
                      size="xs"
                      c="dimmed"
                      style={{ fontFamily: 'monospace', cursor: 'pointer' }}
                      onClick={() => handleCopyUserId(transaction.userId)}
                    >
                      {transaction.userId.substring(0, 12)}...
                    </Text>
                  </Box>
                </td>
                <td>
                  <Text size="sm" lineClamp={1}>
                    {transaction.description}
                  </Text>
                </td>
                <td>
                  <Group gap="xs">
                    {transaction.type === 'purchase' ? (
                      <MdArrowUpward size={14} color="var(--mantine-color-green-6)" />
                    ) : (
                      <MdArrowDownward size={14} color="var(--mantine-color-red-6)" />
                    )}
                    <Box>
                      <Text
                        size="sm"
                        fw={600}
                        c={transaction.type === 'purchase' ? 'green' : 'red'}
                      >
                        {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()}
                      </Text>
                      {transaction.metadata?.tokensUsed && (
                        <Text size="xs" c="dimmed">
                          {transaction.metadata.tokensUsed.toLocaleString()} tokens
                        </Text>
                      )}
                    </Box>
                  </Group>
                </td>
                <td>
                  <Text size="sm" fw={500}>
                    {transaction.balanceAfter.toLocaleString()}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {transactions.length === 0 && (
          <Box p="xl" ta="center">
            <Text c="dimmed">No transactions found</Text>
          </Box>
        )}

        {transactions.length > 0 && (
          <Box p="md" ta="center">
            <Text size="sm" c="dimmed">
              Showing {transactions.length} of {totalTransactions || transactions.length} transactions
            </Text>
            {totalTransactions > transactions.length && (
              <Button
                variant="subtle"
                size="sm"
                mt="xs"
                onClick={async () => {
                  try {
                    let params = {
                      limit: 50,
                      skip: transactions.length
                    };

                    // Add date filtering if not 'all'
                    if (dateRange !== 'all') {
                      let startDate, endDate;
                      const now = new Date();

                      switch (dateRange) {
                        case 'today':
                          startDate = new Date();
                          startDate.setHours(0, 0, 0, 0);
                          endDate = new Date();
                          break;
                        case 'week':
                          startDate = new Date();
                          startDate.setDate(startDate.getDate() - 7);
                          endDate = new Date();
                          break;
                        case 'month':
                          startDate = new Date();
                          startDate.setMonth(startDate.getMonth() - 1);
                          endDate = new Date();
                          break;
                        case 'year':
                          startDate = new Date(now.getFullYear(), 0, 1);
                          endDate = new Date();
                          break;
                      }

                      if (startDate) params.startDate = startDate;
                      if (endDate) params.endDate = endDate;
                    }

                    const nextData = await creditsService.getCreditsTransactions(params);
                    setTransactions([...transactions, ...(nextData.transactions || [])]);
                  } catch (error) {
                    toast('Failed to load more transactions', 'error');
                  }
                }}
              >
                Load More
              </Button>
            )}
          </Box>
        )}
      </Card>
    </Stack>
  );
};

export default CreditsMonitoring;