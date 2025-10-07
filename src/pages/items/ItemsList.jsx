import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Stack,
  TextInput,
  Select,
  NumberInput,
  Button,
  Grid,
  Badge,
  Pagination,
  Loader,
  Alert,
  Paper,
  Anchor,
  Collapse,
  ActionIcon,
  Tooltip,
  Flex
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import {
  HiSearch,
  HiFilter,
  HiRefresh,
  HiExternalLink,
  HiChevronDown,
  HiChevronUp,
  HiCalendar,
  HiShoppingCart,
  HiStar,
  HiCurrencyDollar
} from 'react-icons/hi';
import {
  fetchItems,
  setFilters,
  resetFilters,
  setPage,
  setSortProperty,
  setSortType,
  selectItems,
  selectPagination,
  selectFilters,
  selectLoading,
  selectError
} from '../../store/slices/itemsSlice';

const ItemsList = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Fetch items on mount and when filters change
  useEffect(() => {
    dispatch(fetchItems({ ...filters, page: pagination.page, limit: pagination.limit }));
  }, [dispatch, filters, pagination.page, pagination.limit]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters));
    dispatch(setPage(1)); // Reset to first page when applying filters
  };

  // Reset all filters
  const handleResetFilters = () => {
    const resetState = {
      link: '',
      title: '',
      keywordId: '',
      storeLink: '',
      category: '',
      stage: '',
      locatedIn: '',
      createdAt: '',
      priceMin: '',
      priceMax: '',
      reviewMin: '',
      reviewMax: '',
      availableMin: '',
      availableMax: '',
      itemSoldMin: '',
      itemSoldMax: '',
      search: '',
      sortProperty: 'createdAt',
      sortType: 'DESCENDING'
    };
    setLocalFilters(resetState);
    dispatch(resetFilters());
    dispatch(setPage(1));
  };

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  // Handle sort change
  const handleSortChange = (property) => {
    if (filters.sortProperty === property) {
      // Toggle sort direction if same property
      dispatch(setSortType(filters.sortType === 'ASCENDING' ? 'DESCENDING' : 'ASCENDING'));
    } else {
      // Set new property and default to descending
      dispatch(setSortProperty(property));
      dispatch(setSortType('DESCENDING'));
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchItems({ ...filters, page: pagination.page, limit: pagination.limit }));
    notifications.show({
      title: 'Refreshed',
      message: 'Items list has been refreshed',
      color: 'blue'
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return num.toLocaleString();
  };

  // Format price
  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return `$${price.toFixed(2)}`;
  };

  // Get stage badge color
  const getStageBadgeColor = (stage) => {
    switch (stage?.toUpperCase()) {
      case 'SCRAPED':
        return 'green';
      case 'PROCESSING':
        return 'blue';
      case 'PENDING':
        return 'yellow';
      case 'FAILED':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>eBay Items</Title>
            <Text c="dimmed" size="sm">
              Browse and filter {formatNumber(pagination.totalRecords)} items
            </Text>
          </div>
          <Group>
            <Tooltip label="Refresh">
              <ActionIcon variant="light" size="lg" onClick={handleRefresh}>
                <HiRefresh size={20} />
              </ActionIcon>
            </Tooltip>
            <Button
              leftSection={<HiFilter />}
              variant={showFilters ? 'filled' : 'light'}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters {showFilters ? <HiChevronUp /> : <HiChevronDown />}
            </Button>
          </Group>
        </Group>

        {/* Error Alert */}
        {error && (
          <Alert color="red" title="Error">
            {error}
          </Alert>
        )}

        {/* Filters Section */}
        <Collapse in={showFilters}>
          <Paper shadow="sm" p="md" radius="md">
            <Stack gap="md">
              <Title order={4}>Filter Items</Title>

              <Grid>
                {/* Search */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Search"
                    placeholder="Search in title, link, or category"
                    leftSection={<HiSearch />}
                    value={localFilters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </Grid.Col>

                {/* Stage */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Stage"
                    placeholder="e.g., SCRAPED, PROCESSING"
                    value={localFilters.stage}
                    onChange={(e) => handleFilterChange('stage', e.target.value)}
                  />
                </Grid.Col>

                {/* Category */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Category"
                    placeholder="Item category"
                    value={localFilters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  />
                </Grid.Col>

                {/* Located In */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Located In"
                    placeholder="e.g., San Bernardino, CA"
                    value={localFilters.locatedIn}
                    onChange={(e) => handleFilterChange('locatedIn', e.target.value)}
                  />
                </Grid.Col>

                {/* Keyword ID */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Keyword ID"
                    placeholder="MongoDB ObjectId"
                    value={localFilters.keywordId}
                    onChange={(e) => handleFilterChange('keywordId', e.target.value)}
                  />
                </Grid.Col>

                {/* Store Link */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Store Link"
                    placeholder="eBay store URL"
                    value={localFilters.storeLink}
                    onChange={(e) => handleFilterChange('storeLink', e.target.value)}
                  />
                </Grid.Col>

                {/* Created At */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <DateInput
                    label="Created After"
                    placeholder="Select date"
                    leftSection={<HiCalendar />}
                    value={localFilters.createdAt && localFilters.createdAt !== '' ? new Date(localFilters.createdAt) : null}
                    onChange={(date) => {
                      if (date && date instanceof Date && !isNaN(date.getTime())) {
                        handleFilterChange('createdAt', date.toISOString().split('T')[0]);
                      } else {
                        handleFilterChange('createdAt', '');
                      }
                    }}
                    clearable
                  />
                </Grid.Col>

                {/* Price Range */}
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Min Price"
                    placeholder="0"
                    min={0}
                    step={0.01}
                    value={localFilters.priceMin === '' ? '' : Number(localFilters.priceMin)}
                    onChange={(value) => handleFilterChange('priceMin', value === '' ? '' : value)}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Max Price"
                    placeholder="9999"
                    min={0}
                    step={0.01}
                    value={localFilters.priceMax === '' ? '' : Number(localFilters.priceMax)}
                    onChange={(value) => handleFilterChange('priceMax', value === '' ? '' : value)}
                  />
                </Grid.Col>

                {/* Review Range */}
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Min Reviews"
                    placeholder="0"
                    min={0}
                    value={localFilters.reviewMin === '' ? '' : Number(localFilters.reviewMin)}
                    onChange={(value) => handleFilterChange('reviewMin', value === '' ? '' : value)}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Max Reviews"
                    placeholder="9999"
                    min={0}
                    value={localFilters.reviewMax === '' ? '' : Number(localFilters.reviewMax)}
                    onChange={(value) => handleFilterChange('reviewMax', value === '' ? '' : value)}
                  />
                </Grid.Col>

                {/* Available Range */}
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Min Available"
                    placeholder="0"
                    min={0}
                    value={localFilters.availableMin === '' ? '' : Number(localFilters.availableMin)}
                    onChange={(value) => handleFilterChange('availableMin', value === '' ? '' : value)}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Max Available"
                    placeholder="9999"
                    min={0}
                    value={localFilters.availableMax === '' ? '' : Number(localFilters.availableMax)}
                    onChange={(value) => handleFilterChange('availableMax', value === '' ? '' : value)}
                  />
                </Grid.Col>

                {/* Items Sold Range */}
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Min Items Sold"
                    placeholder="0"
                    min={0}
                    value={localFilters.itemSoldMin === '' ? '' : Number(localFilters.itemSoldMin)}
                    onChange={(value) => handleFilterChange('itemSoldMin', value === '' ? '' : value)}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Max Items Sold"
                    placeholder="9999"
                    min={0}
                    value={localFilters.itemSoldMax === '' ? '' : Number(localFilters.itemSoldMax)}
                    onChange={(value) => handleFilterChange('itemSoldMax', value === '' ? '' : value)}
                  />
                </Grid.Col>

                {/* Sort Property */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Sort By"
                    value={localFilters.sortProperty}
                    onChange={(value) => handleFilterChange('sortProperty', value)}
                    data={[
                      { value: 'title', label: 'Title' },
                      { value: 'price', label: 'Price' },
                      { value: 'review', label: 'Review Count' },
                      { value: 'available', label: 'Available Quantity' },
                      { value: 'itemSold', label: 'Items Sold' },
                      { value: 'category', label: 'Category' },
                      { value: 'stage', label: 'Stage' },
                      { value: 'createdAt', label: 'Date Created' }
                    ]}
                  />
                </Grid.Col>

                {/* Sort Direction */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Sort Direction"
                    value={localFilters.sortType}
                    onChange={(value) => handleFilterChange('sortType', value)}
                    data={[
                      { value: 'ASCENDING', label: 'Ascending (A-Z, Low-High)' },
                      { value: 'DESCENDING', label: 'Descending (Z-A, High-Low)' }
                    ]}
                  />
                </Grid.Col>
              </Grid>

              <Group justify="flex-end">
                <Button variant="subtle" onClick={handleResetFilters}>
                  Reset
                </Button>
                <Button onClick={handleApplyFilters} leftSection={<HiSearch />}>
                  Apply Filters
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Collapse>

        {/* Loading State */}
        {loading ? (
          <Paper shadow="sm" p="xl" radius="md">
            <Stack align="center" gap="md">
              <Loader size="lg" color="violet" />
              <Text c="dimmed">Loading items...</Text>
            </Stack>
          </Paper>
        ) : (
          <>
            {/* Items Grid */}
            {items.length === 0 ? (
              <Paper shadow="sm" p="xl" radius="md">
                <Stack align="center" gap="md">
                  <Text size="lg" c="dimmed">No items found</Text>
                  <Text size="sm" c="dimmed">Try adjusting your filters</Text>
                  <Button variant="light" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                </Stack>
              </Paper>
            ) : (
              <Grid>
                {items.map((item) => (
                  <Grid.Col key={item._id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <Card shadow="sm" radius="md" withBorder h="100%">
                      <Stack gap="sm">
                        {/* Title and Stage */}
                        <Group justify="space-between" align="flex-start">
                          <div style={{ flex: 1 }}>
                            <Text fw={600} size="md" lineClamp={2}>
                              {item.title}
                            </Text>
                            <Group gap={4} mt={4}>
                              <Badge
                                variant="light"
                                color={getStageBadgeColor(item.stage)}
                                size="sm"
                              >
                                {item.stage || 'Unknown'}
                              </Badge>
                            </Group>
                          </div>
                          <Tooltip label="View on eBay">
                            <ActionIcon
                              component="a"
                              href={item.link}
                              target="_blank"
                              variant="light"
                              size="sm"
                            >
                              <HiExternalLink />
                            </ActionIcon>
                          </Tooltip>
                        </Group>

                        {/* Price and Reviews */}
                        <Group gap="xs">
                          <Badge
                            leftSection={<HiCurrencyDollar size={12} />}
                            variant="light"
                            color="green"
                          >
                            {formatPrice(item.price)}
                          </Badge>
                          {item.review !== undefined && (
                            <Badge
                              leftSection={<HiStar size={12} />}
                              variant="light"
                              color="yellow"
                            >
                              {formatNumber(item.review)} reviews
                            </Badge>
                          )}
                        </Group>

                        {/* Additional Info */}
                        <Stack gap={4}>
                          {item.locatedIn && (
                            <Text size="xs" c="dimmed" lineClamp={1}>
                              📍 {item.locatedIn}
                            </Text>
                          )}
                          {item.category && (
                            <Text size="xs" c="dimmed" lineClamp={1}>
                              🏷️ {item.category}
                            </Text>
                          )}
                          {item.shipping && (
                            <Text size="xs" c="dimmed">
                              🚚 {item.shipping}
                            </Text>
                          )}
                        </Stack>

                        {/* Store Link */}
                        {item.storeLink && (
                          <Anchor
                            href={item.storeLink}
                            target="_blank"
                            size="xs"
                            c="blue"
                            lineClamp={1}
                          >
                            View store →
                          </Anchor>
                        )}

                        {/* Date */}
                        <Text size="xs" c="dimmed">
                          Added: {formatDate(item.createdAt)}
                        </Text>
                      </Stack>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Flex justify="center">
                <Pagination
                  value={pagination.page}
                  onChange={handlePageChange}
                  total={pagination.totalPages}
                  color="violet"
                  size="md"
                  withEdges
                />
              </Flex>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
};

export default ItemsList;
