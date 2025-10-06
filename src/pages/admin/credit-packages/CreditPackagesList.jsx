import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Group,
  Text,
  Badge,
  ActionIcon,
  Button,
  Title,
  Stack,
  Box,
  Switch,
  Skeleton,
  Alert,
  TextInput,
  Menu,
  SimpleGrid,
  ThemeIcon,
  Divider,
  Tooltip,
  Chip
} from '@mantine/core';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdMoreVert,
  MdCardGiftcard,
  MdStar,
  MdLocalOffer,
  MdCalendarToday,
  MdContentCopy,
  MdCheck,
  MdTrendingUp,
  MdAttachMoney
} from 'react-icons/md';
import creditPackagesService from '../../../services/creditPackagesService';
import plansService from '../../../services/plansService';
import { useNotifications } from '../../../hooks/useNotifications';

const CreditPackagesList = () => {
  const navigate = useNavigate();
  const { toast } = useNotifications();

  const [packages, setPackages] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('all');

  useEffect(() => {
    loadPackages();
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await plansService.getPlans(true); // Include inactive plans too
      setPlans(data);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const loadPackages = async () => {
    try {
      setLoading(true);
      const response = await creditPackagesService.getCreditPackages({});

      // Handle both array response and paginated response
      if (Array.isArray(response)) {
        setPackages(response);
      } else if (response.data && Array.isArray(response.data)) {
        setPackages(response.data);
      } else if (response.packages && Array.isArray(response.packages)) {
        setPackages(response.packages);
      } else {
        console.error('Unexpected response format:', response);
        setPackages([]);
      }
    } catch (error) {
      toast('Failed to load credit packages', 'error');
      console.error(error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (packageId, currentStatus) => {
    try {
      await creditPackagesService.togglePackageStatus(packageId, !currentStatus);
      toast(`Package ${!currentStatus ? 'activated' : 'deactivated'} successfully`, 'success');
      loadPackages();
    } catch (error) {
      toast('Failed to update package status', 'error');
    }
  };

  const handleDelete = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this credit package?')) {
      try {
        await creditPackagesService.deleteCreditPackage(packageId);
        toast('Credit package deleted successfully', 'success');
        loadPackages();
      } catch (error) {
        toast('Failed to delete credit package', 'error');
      }
    }
  };

  const handleCopyId = (packageId) => {
    navigator.clipboard.writeText(packageId);
    toast('Package ID copied to clipboard', 'success');
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const calculateDiscountPercentage = (originalPrice, price) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const isExpired = (validUntil) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  const getPlanName = (planData) => {
    if (!planData) return null;
    // Handle both populated object and plain ID
    if (typeof planData === 'object' && planData.name) {
      return planData.name;
    }
    // Fallback to finding by ID if it's just a string
    if (typeof planData === 'string') {
      const plan = plans.find(p => p._id === planData);
      return plan ? plan.name : null;
    }
    return null;
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPlanFilter = selectedPlanFilter === 'all';
    if (selectedPlanFilter === 'unassigned') {
      matchesPlanFilter = !pkg.planId || pkg.planId === '';
    } else if (selectedPlanFilter !== 'all') {
      if (pkg.planId && typeof pkg.planId === 'object' && pkg.planId._id) {
        matchesPlanFilter = pkg.planId._id === selectedPlanFilter;
      } else if (pkg.planId && typeof pkg.planId === 'string' && pkg.planId !== '') {
        matchesPlanFilter = pkg.planId === selectedPlanFilter;
      }
    }

    return matchesSearch && matchesPlanFilter;
  });

  // Sort packages by credits (ascending) for proper comparison
  const sortedPackages = [...filteredPackages].sort((a, b) => a.credits - b.credits);

  // Calculate savings compared to previous package
  const calculateSavingsVsPrevious = (currentPkg, previousPkg) => {
    if (!previousPkg || !currentPkg.credits || !previousPkg.credits) return null;

    const currentPricePerCredit = currentPkg.price / currentPkg.credits;
    const previousPricePerCredit = previousPkg.price / previousPkg.credits;

    // Calculate percentage savings (positive means better deal)
    const savingsPercent = ((previousPricePerCredit - currentPricePerCredit) / previousPricePerCredit) * 100;

    return {
      percent: Math.round(savingsPercent),
      pricePerCredit: currentPricePerCredit,
      previousPricePerCredit: previousPricePerCredit
    };
  };

  // Calculate profit margin based on $5 per 1M credits cost
  const calculateProfitMargin = (pkg) => {
    if (!pkg.credits || !pkg.price) return null;

    // Cost: $5 per 1,000,000 credits = $0.000005 per credit
    const costPerCredit = 5 / 1000000;
    const totalCost = pkg.credits * costPerCredit;
    const profit = pkg.price - totalCost;
    const profitMargin = (profit / pkg.price) * 100;

    return {
      cost: totalCost,
      profit: profit,
      margin: Math.round(profitMargin * 10) / 10 // Round to 1 decimal
    };
  };

  // Get unique plans from packages for filter chips
  const availablePlans = [];
  const planMap = new Map();

  packages.forEach(pkg => {
    if (pkg.planId) {
      if (typeof pkg.planId === 'object' && pkg.planId !== null && pkg.planId._id) {
        if (!planMap.has(pkg.planId._id)) {
          planMap.set(pkg.planId._id, pkg.planId.name);
        }
      } else if (typeof pkg.planId === 'string' && pkg.planId !== '') {
        const plan = plans.find(p => p._id === pkg.planId);
        if (plan && !planMap.has(pkg.planId)) {
          planMap.set(pkg.planId, plan.name);
        }
      }
    }
  });

  planMap.forEach((name, id) => {
    availablePlans.push({ id, name });
  });

  // Check if there are unassigned packages
  const hasUnassignedPackages = packages.some(pkg => !pkg.planId || pkg.planId === '');

  if (loading) {
    return (
      <Stack gap="lg">
        <Skeleton height={60} />
        <Skeleton height={400} />
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      {/* Header */}
      <Group justify="space-between">
        <Box>
          <Title order={2} mb={4}>
            Credit Packages
          </Title>
          <Text c="dimmed" size="sm">
            Manage credit packages and special offers
          </Text>
        </Box>
        <Button
          variant="gradient"
          gradient={{ from: 'green', to: 'teal' }}
          onClick={() => navigate('/control/credit-packages/new')}
        >
          Create Package
        </Button>
      </Group>

      {/* Search and Filters */}
      <Stack gap="md">
        <TextInput
          placeholder="Search packages by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: 400 }}
        />

        {/* Plan Filter Chips */}
        <Group gap="xs">
          <Text size="sm" fw={500}>Filter by plan:</Text>
          <Chip
            checked={selectedPlanFilter === 'all'}
            onChange={() => setSelectedPlanFilter('all')}
            variant="filled"
            size="sm"
          >
            All ({packages.length})
          </Chip>
          {hasUnassignedPackages && (
            <Chip
              checked={selectedPlanFilter === 'unassigned'}
              onChange={() => setSelectedPlanFilter('unassigned')}
              variant="filled"
              size="sm"
              color="gray"
            >
              Unassigned ({packages.filter(p => !p.planId || p.planId === '').length})
            </Chip>
          )}
          {availablePlans.map(plan => {
            const count = packages.filter(pkg => {
              if (pkg.planId && typeof pkg.planId === 'object' && pkg.planId._id) {
                return pkg.planId._id === plan.id;
              }
              return pkg.planId === plan.id;
            }).length;

            return (
              <Chip
                key={plan.id}
                checked={selectedPlanFilter === plan.id}
                onChange={() => setSelectedPlanFilter(plan.id)}
                variant="filled"
                size="sm"
                color="violet"
              >
                {plan.name} ({count})
              </Chip>
            );
          })}
        </Group>
      </Stack>

      {/* Packages Grid */}
      {filteredPackages.length === 0 ? (
        <Alert
          title="No packages found"
          color="blue"
        >
          {searchQuery || selectedPlanFilter !== 'all'
            ? 'No packages match your filters. Try adjusting your search or filter criteria.'
            : 'No credit packages available. Create your first package to get started.'}
        </Alert>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="lg">
          {sortedPackages.map((pkg, index) => {
            const discountPercent = calculateDiscountPercentage(pkg.originalPrice, pkg.price);
            const expired = isExpired(pkg.validUntil);
            const savingsVsPrevious = index > 0 ? calculateSavingsVsPrevious(pkg, sortedPackages[index - 1]) : null;
            const profitMargin = calculateProfitMargin(pkg);

            return (
              <Card
                key={pkg._id}
                shadow="md"
                radius="md"
                withBorder
                padding={0}
                style={{
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  overflow: 'hidden',
                  borderColor: pkg.isPopular ? 'var(--mantine-color-orange-4)' : undefined,
                  borderWidth: pkg.isPopular ? 2 : 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Header Section with colored background */}
                <Box
                  p="md"
                  style={{
                    background: pkg.isPopular
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)'
                  }}
                >
                  {/* Top badges row */}
                  <Group justify="space-between" mb="sm">
                    <Group gap={6}>
                      {pkg.isPopular && (
                        <Badge size="sm" color="orange" variant="filled" leftSection={<MdStar size={12} />}>
                          POPULAR
                        </Badge>
                      )}
                      {expired && (
                        <Badge size="sm" color="red" variant="filled">
                          EXPIRED
                        </Badge>
                      )}
                      {savingsVsPrevious && savingsVsPrevious.percent > 0 && (
                        <Badge
                          size="sm"
                          color="teal"
                          variant="filled"
                        >
                          {savingsVsPrevious.percent}% BETTER VALUE
                        </Badge>
                      )}
                    </Group>
                    <Menu position="bottom-end" withinPortal>
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          style={{ color: pkg.isPopular ? 'white' : undefined }}
                        >
                          <MdMoreVert size={18} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<MdEdit size={14} />}
                          onClick={() => navigate(`/control/credit-packages/edit/${pkg._id}`)}
                        >
                          Edit Package
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          leftSection={<MdDelete size={14} />}
                          color="red"
                          onClick={() => handleDelete(pkg._id)}
                        >
                          Delete Package
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>

                  {/* Package name */}
                  <Title order={4} c={pkg.isPopular ? 'white' : 'dark'} mb={4}>
                    {pkg.name}
                  </Title>

                  {/* Description */}
                  <Text
                    size="sm"
                    c={pkg.isPopular ? 'rgba(255,255,255,0.9)' : 'dimmed'}
                    lineClamp={2}
                    style={{ minHeight: '2.5em' }}
                  >
                    {pkg.description}
                  </Text>
                </Box>

                {/* Main content */}
                <Box p="lg">
                  {/* Pricing Section - Most prominent */}
                  <Box mb="lg" ta="center">
                    {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                      <Text size="sm" c="dimmed" td="line-through" mb={4}>
                        {formatCurrency(pkg.originalPrice, pkg.currency)}
                      </Text>
                    )}
                    <Text size="2.5rem" fw={800} lh={1} c="violet.6" mb="xs">
                      {formatCurrency(pkg.price, pkg.currency)}
                    </Text>
                    <Group gap={8} justify="center">
                      <ThemeIcon size="md" variant="light" color="violet" radius="xl">
                        <MdCardGiftcard size={18} />
                      </ThemeIcon>
                      <Text size="lg" fw={600} c="dark">
                        {pkg.credits.toLocaleString()} credits
                      </Text>
                    </Group>
                    {discountPercent > 0 && (
                      <Badge
                        size="lg"
                        color="green"
                        variant="filled"
                        leftSection={<MdLocalOffer size={14} />}
                        mt="md"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        SAVE {discountPercent}%
                      </Badge>
                    )}
                  </Box>

                  {/* Profit Metrics Grid */}
                  {profitMargin && (
                    <SimpleGrid cols={3} spacing="xs" mb="lg">
                      <Box ta="center">
                        <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={4}>
                          Cost
                        </Text>
                        <Text size="sm" fw={700}>
                          {formatCurrency(profitMargin.cost, pkg.currency)}
                        </Text>
                      </Box>
                      <Box ta="center">
                        <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={4}>
                          Profit
                        </Text>
                        <Text size="sm" fw={700} c="green">
                          {formatCurrency(profitMargin.profit, pkg.currency)}
                        </Text>
                      </Box>
                      <Box ta="center">
                        <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={4}>
                          Margin
                        </Text>
                        <Badge
                          size="md"
                          color={profitMargin.margin > 95 ? 'teal' : profitMargin.margin > 90 ? 'green' : profitMargin.margin > 85 ? 'yellow' : 'orange'}
                          variant="light"
                          style={{ width: '100%' }}
                        >
                          {profitMargin.margin}%
                        </Badge>
                      </Box>
                    </SimpleGrid>
                  )}

                  {/* Additional Info */}
                  {(pkg.validFrom || pkg.validUntil) && (
                    <>
                      <Divider mb="md" />
                      <Stack gap="xs" mb="md">
                        {pkg.validFrom && (
                          <Group gap={8} wrap="nowrap">
                            <MdCalendarToday size={14} style={{ color: 'var(--mantine-color-blue-5)', flexShrink: 0 }} />
                            <Text size="xs" c="dimmed">
                              Valid from: {new Date(pkg.validFrom).toLocaleDateString()}
                            </Text>
                          </Group>
                        )}
                        {pkg.validUntil && (
                          <Group gap={8} wrap="nowrap">
                            <MdCalendarToday size={14} style={{ color: expired ? 'var(--mantine-color-red-5)' : 'var(--mantine-color-blue-5)', flexShrink: 0 }} />
                            <Text size="xs" c={expired ? 'red' : 'dimmed'}>
                              {expired ? 'Expired on' : 'Valid until'}: {new Date(pkg.validUntil).toLocaleDateString()}
                            </Text>
                          </Group>
                        )}
                      </Stack>
                    </>
                  )}
                </Box>

                {/* Footer Section */}
                <Box
                  px="lg"
                  py="sm"
                  style={{
                    backgroundColor: 'var(--mantine-color-gray-0)',
                    borderTop: '1px solid var(--mantine-color-gray-2)'
                  }}
                >
                  <Group justify="space-between" align="center">
                    <Tooltip label="Click to copy package ID">
                      <Group
                        gap={6}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleCopyId(pkg._id)}
                      >
                        <MdContentCopy size={12} style={{ color: 'var(--mantine-color-gray-6)' }} />
                        <Text
                          size="xs"
                          c="dimmed"
                          style={{ fontFamily: 'monospace' }}
                        >
                          {pkg._id.substring(0, 8)}...
                        </Text>
                      </Group>
                    </Tooltip>
                    <Box onClick={(e) => e.stopPropagation()}>
                      <Switch
                        size="sm"
                        color="green"
                        checked={pkg.isActive}
                        onChange={() => handleToggleStatus(pkg._id, pkg.isActive)}
                        label={
                          <Text size="sm" fw={500}>
                            {pkg.isActive ? 'Active' : 'Inactive'}
                          </Text>
                        }
                      />
                    </Box>
                  </Group>
                </Box>
              </Card>
            );
          })}
        </SimpleGrid>
      )}

    </Stack>
  );
};

export default CreditPackagesList;