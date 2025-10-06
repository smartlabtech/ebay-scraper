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
  ThemeIcon,
  Skeleton,
  Button,
  Grid,
  Select,
  TextInput,
  ActionIcon,
  Pagination,
  Tooltip
} from '@mantine/core';
import {
  MdShoppingCart,
  MdSearch,
  MdRefresh,
  MdFilterList,
  MdClear,
  MdContentCopy,
  MdVisibility,
  MdCreditCard,
  MdCardGiftcard,
  MdRepeat,
  MdTrendingUp
} from 'react-icons/md';
import ordersService from '../../../services/ordersService';
import { useNotifications } from '../../../hooks/useNotifications';

const OrdersList = () => {
  const { toast } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [stats, setStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    searchTerm: '',
    dateRange: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    loadOrders();
  }, [currentPage, filters.status, filters.type, filters.dateRange, filters.sortBy, filters.sortOrder]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = {
        limit: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      // Add status filter
      if (filters.status) {
        params.status = filters.status;
      }

      // Add type filter
      if (filters.type) {
        params.type = filters.type;
      }

      // Add search (userId)
      if (filters.searchTerm) {
        params.userId = filters.searchTerm;
      }

      // Add date range
      if (filters.dateRange !== 'all') {
        const now = new Date();
        let startDate, endDate;

        switch (filters.dateRange) {
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
          case 'thisMonth':
            // First day of current month
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date();
            break;
          case 'lastMonth':
            // First day of last month
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            // Last day of last month
            endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            endDate.setHours(23, 59, 59, 999);
            break;
          case 'last30Days':
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
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

      const response = await ordersService.getAdminOrders(params);
      const ordersData = response.orders || [];
      setOrders(ordersData);
      setTotalOrders(response.total || 0);

      // Get all orders to calculate accurate stats (if backend includes pending in revenue)
      // We need to fetch all completed orders to calculate proper revenue
      let completedRevenue = response.stats?.totalRevenue || 0;
      let completedAverage = response.stats?.averageOrderValue || 0;

      // If we're not filtering by status, we need to get completed orders separately for accurate revenue
      if (!params.status || params.status !== 'completed') {
        // Fetch only completed orders to calculate revenue
        const completedParams = { ...params, status: 'completed', limit: 1, skip: 0 };
        try {
          const completedResponse = await ordersService.getAdminOrders(completedParams);
          completedRevenue = completedResponse.stats?.totalRevenue || 0;
          completedAverage = completedResponse.stats?.averageOrderValue || 0;
        } catch (error) {
          console.error('Error fetching completed orders stats:', error);
        }
      }

      setStats({
        ...response.stats,
        totalRevenue: completedRevenue,
        averageOrderValue: completedAverage
      });
    } catch (error) {
      toast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
    toast('Orders refreshed', 'success');
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadOrders();
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      type: '',
      searchTerm: '',
      dateRange: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setCurrentPage(1);
  };

  const handleCopyOrderNumber = (orderNumber) => {
    navigator.clipboard.writeText(orderNumber);
    toast('Order number copied', 'success');
  };

  const handleCopyUserId = (userId) => {
    navigator.clipboard.writeText(userId);
    toast('User ID copied', 'success');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'yellow',
      processing: 'blue',
      completed: 'green',
      failed: 'red',
      cancelled: 'gray',
      refunded: 'orange'
    };
    return colors[status] || 'gray';
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'subscription':
        return <MdRepeat size={16} />;
      case 'credit_recharge':
      case 'credit_package':
        return <MdCardGiftcard size={16} />;
      default:
        return <MdShoppingCart size={16} />;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      subscription: 'Subscription',
      credit_recharge: 'Credit Recharge',
      credit_package: 'Credit Package',
      one_time: 'One Time'
    };
    return labels[type] || type;
  };

  if (loading && orders.length === 0) {
    return (
      <Stack gap="lg">
        <Skeleton height={60} />
        <Grid>
          <Grid.Col span={3}><Skeleton height={100} /></Grid.Col>
          <Grid.Col span={3}><Skeleton height={100} /></Grid.Col>
          <Grid.Col span={3}><Skeleton height={100} /></Grid.Col>
          <Grid.Col span={3}><Skeleton height={100} /></Grid.Col>
        </Grid>
        <Skeleton height={400} />
      </Stack>
    );
  }

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  return (
    <Stack gap="xl">
      {/* Header */}
      <Group justify="space-between">
        <Box>
          <Title order={2} mb={4}>
            Orders Management
          </Title>
          <Text c="dimmed" size="sm">
            Manage and monitor all orders
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

      {/* Stats Cards */}
      <Grid>
        <Grid.Col span={3}>
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Total Revenue
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {formatCurrency(stats.totalRevenue || 0)}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  Completed orders only
                </Text>
              </Box>
              <ThemeIcon size="xl" radius="md" variant="light" color="green">
                <MdTrendingUp size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Total Orders
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {stats.orderCount || 0}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  All statuses
                </Text>
              </Box>
              <ThemeIcon size="xl" radius="md" variant="light" color="blue">
                <MdShoppingCart size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Average Order
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {formatCurrency(stats.averageOrderValue || 0)}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  Completed orders
                </Text>
              </Box>
              <ThemeIcon size="xl" radius="md" variant="light" color="violet">
                <MdCreditCard size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Completed
                </Text>
                <Text size="xl" fw={700} mt="xs">
                  {stats.statusCounts?.completed || 0}
                </Text>
              </Box>
              <ThemeIcon size="xl" radius="md" variant="light" color="green">
                <MdCardGiftcard size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Filters */}
      <Card shadow="sm" radius="md" withBorder>
        <Stack gap="md">
          <Group>
            <TextInput
              placeholder="Search by User ID..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              style={{ flex: 1, maxWidth: 300 }}
              rightSection={
                <ActionIcon onClick={handleSearch} variant="subtle">
                  <MdSearch size={20} />
                </ActionIcon>
              }
            />

            <Select
              placeholder="Status"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              data={[
                { value: '', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'processing', label: 'Processing' },
                { value: 'completed', label: 'Completed' },
                { value: 'failed', label: 'Failed' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'refunded', label: 'Refunded' }
              ]}
              style={{ width: 150 }}
              clearable
            />

            <Select
              placeholder="Type"
              value={filters.type}
              onChange={(value) => setFilters({ ...filters, type: value })}
              data={[
                { value: '', label: 'All Types' },
                { value: 'subscription', label: 'Subscription' },
                { value: 'credit_recharge', label: 'Credit Recharge' },
                { value: 'credit_package', label: 'Credit Package' },
                { value: 'one_time', label: 'One Time' }
              ]}
              style={{ width: 150 }}
              clearable
            />

            <Select
              value={filters.dateRange}
              onChange={(value) => setFilters({ ...filters, dateRange: value })}
              data={[
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'Last 7 Days' },
                { value: 'thisMonth', label: 'This Month' },
                { value: 'lastMonth', label: 'Last Month' },
                { value: 'last30Days', label: 'Last 30 Days' },
                { value: 'year', label: 'This Year' },
                { value: 'all', label: 'All Time' }
              ]}
              style={{ width: 150 }}
            />

            <Select
              value={filters.sortBy}
              onChange={(value) => setFilters({ ...filters, sortBy: value })}
              data={[
                { value: 'createdAt', label: 'Date' },
                { value: 'totalAmount', label: 'Amount' },
                { value: 'status', label: 'Status' }
              ]}
              style={{ width: 120 }}
            />

            <Select
              value={filters.sortOrder}
              onChange={(value) => setFilters({ ...filters, sortOrder: value })}
              data={[
                { value: 'desc', label: 'Desc' },
                { value: 'asc', label: 'Asc' }
              ]}
              style={{ width: 80 }}
            />

            <Button
              variant="subtle"
              onClick={handleClearFilters}
              leftSection={<MdClear size={16} />}
            >
              Clear
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* Orders Table */}
      <Card shadow="sm" radius="md" withBorder>
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <Group gap="xs">
                    <Text
                      size="sm"
                      fw={500}
                      style={{ fontFamily: 'monospace', cursor: 'pointer' }}
                      onClick={() => handleCopyOrderNumber(order.orderNumber)}
                    >
                      {order.orderNumber}
                    </Text>
                    <ActionIcon
                      size="xs"
                      variant="subtle"
                      onClick={() => handleCopyOrderNumber(order.orderNumber)}
                    >
                      <MdContentCopy size={12} />
                    </ActionIcon>
                  </Group>
                </td>
                <td>
                  <Text size="sm">{formatDate(order.createdAt)}</Text>
                </td>
                <td>
                  <Box>
                    <Text size="sm" fw={500}>
                      {order.userId?.firstName} {order.userId?.lastName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {order.userId?.email}
                    </Text>
                    <Text
                      size="xs"
                      c="dimmed"
                      style={{ fontFamily: 'monospace', cursor: 'pointer' }}
                      onClick={() => handleCopyUserId(order.userId?._id)}
                    >
                      {order.userId?._id?.substring(0, 8)}...
                    </Text>
                  </Box>
                </td>
                <td>
                  <Group gap="xs">
                    {getTypeIcon(order.type)}
                    <Text size="sm">{getTypeLabel(order.type)}</Text>
                  </Group>
                </td>
                <td>
                  <Box>
                    {order.items?.map((item, index) => (
                      <Text key={index} size="sm" lineClamp={1}>
                        {item.description}
                      </Text>
                    ))}
                  </Box>
                </td>
                <td>
                  <Box>
                    <Text size="sm" fw={600}>
                      {formatCurrency(order.total, order.currency)}
                    </Text>
                    {order.refundedAmount > 0 && (
                      <Text size="xs" c="red">
                        Refunded: {formatCurrency(order.refundedAmount, order.currency)}
                      </Text>
                    )}
                  </Box>
                </td>
                <td>
                  <Badge
                    color={getStatusColor(order.status)}
                    variant="light"
                    size="sm"
                  >
                    {order.status}
                  </Badge>
                </td>
                <td>
                  <Box>
                    <Badge
                      color={order.paymentStatus === 'succeeded' ? 'green' : 'yellow'}
                      variant="light"
                      size="sm"
                    >
                      {order.paymentStatus}
                    </Badge>
                    {order.paymentMethod && (
                      <Text size="xs" c="dimmed" mt={2}>
                        {order.paymentMethod.brand} ****{order.paymentMethod.last4}
                      </Text>
                    )}
                  </Box>
                </td>
                <td>
                  <Group gap="xs">
                    <Tooltip label="View Details">
                      <ActionIcon variant="subtle" size="sm">
                        <MdVisibility size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {orders.length === 0 && (
          <Box p="xl" ta="center">
            <Text c="dimmed">No orders found</Text>
          </Box>
        )}

        {totalPages > 1 && (
          <Box mt="md" pb="sm">
            <Group justify="center">
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
                size="sm"
              />
            </Group>
          </Box>
        )}
      </Card>
    </Stack>
  );
};

export default OrdersList;