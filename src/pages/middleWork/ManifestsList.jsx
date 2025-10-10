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
  MultiSelect,
  NumberInput,
  Button,
  Grid,
  Badge,
  Pagination,
  Loader,
  Alert,
  Paper,
  Collapse,
  ActionIcon,
  Tooltip,
  Flex,
  Code
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import {
  HiSearch,
  HiFilter,
  HiRefresh,
  HiChevronDown,
  HiChevronUp,
  HiCalendar,
  HiClock,
  HiPlay
} from 'react-icons/hi';
import {
  fetchManifests,
  setFilters,
  resetFilters,
  setPage,
  setSortProperty,
  setSortType,
  updateManifestStatus,
  selectManifests,
  selectPagination,
  selectFilters,
  selectLoading,
  selectError
} from '../../store/slices/manifestsSlice';
import manifestsService from '../../services/manifests';

const ManifestsList = () => {
  const dispatch = useDispatch();
  const manifests = useSelector(selectManifests);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Fetch manifests on mount and when filters change
  useEffect(() => {
    dispatch(fetchManifests({ ...filters, page: pagination.page, limit: pagination.limit }));
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
      type: '',
      status: '',
      excludeStatus: ['SUCCESS'],
      _id: '',
      scrapingjobId: '',
      scrapingjobStatus: '',
      trialsMin: '',
      trialsMax: '',
      createdAt: '',
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
    dispatch(fetchManifests({ ...filters, page: pagination.page, limit: pagination.limit }));
    notifications.show({
      title: 'Refreshed',
      message: 'Manifests list has been refreshed',
      color: 'blue'
    });
  };

  // Handle start scraping
  const handleStartScraping = async (manifestId) => {
    try {
      // Optimistically update the status to PROCESSING
      dispatch(updateManifestStatus({ manifestId, status: 'PROCESSING' }));

      const response = await manifestsService.sendManifestToScrap({ _id: manifestId });

      if (response.success) {
        notifications.show({
          title: 'Success',
          message: response.message || 'Scraping process started',
          color: 'green'
        });
      }
    } catch (error) {
      // Revert back to PENDING on error
      dispatch(updateManifestStatus({ manifestId, status: 'PENDING' }));

      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to start scraping process',
        color: 'red'
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return num.toLocaleString();
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'yellow';
      case 'PROCESSING':
        return 'blue';
      case 'SUCCESS':
        return 'green';
      case 'FAILED':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Get type badge color
  const getTypeBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'keyword':
        return 'teal';
      case 'store':
        return 'violet';
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
            <Title order={2}>Manifests</Title>
            <Text c="dimmed" size="sm">
              Browse and filter {formatNumber(pagination.totalRecords)} manifests
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
              <Title order={4}>Filter Manifests</Title>

              <Grid>
                {/* Type */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Type"
                    placeholder="e.g., keyword, store"
                    value={localFilters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  />
                </Grid.Col>

                {/* Status */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Status"
                    placeholder="Select status"
                    value={localFilters.status}
                    onChange={(value) => handleFilterChange('status', value)}
                    data={[
                      { value: '', label: 'All Statuses' },
                      { value: 'SUCCESS', label: 'Success' },
                      { value: 'PROCESSING', label: 'Processing' },
                      { value: 'PENDING', label: 'Pending' }
                    ]}
                    clearable
                  />
                </Grid.Col>

                {/* Exclude Status */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <MultiSelect
                    label="Exclude Statuses"
                    placeholder="Select statuses to exclude"
                    description="Select one or more statuses to exclude"
                    value={localFilters.excludeStatus}
                    onChange={(value) => handleFilterChange('excludeStatus', value)}
                    data={[
                      { value: 'SUCCESS', label: 'Success' },
                      { value: 'PROCESSING', label: 'Processing' },
                      { value: 'PENDING', label: 'Pending' }
                    ]}
                    clearable
                  />
                </Grid.Col>

                {/* Manifest ID */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Manifest ID"
                    placeholder="MongoDB ObjectId"
                    value={localFilters._id}
                    onChange={(e) => handleFilterChange('_id', e.target.value)}
                  />
                </Grid.Col>

                {/* Scraping Job ID */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Scraping Job ID"
                    placeholder="Scraping job ID"
                    value={localFilters.scrapingjobId}
                    onChange={(e) => handleFilterChange('scrapingjobId', e.target.value)}
                  />
                </Grid.Col>

                {/* Scraping Job Status */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Scraping Job Status"
                    placeholder="Scraping job status"
                    value={localFilters.scrapingjobStatus}
                    onChange={(e) => handleFilterChange('scrapingjobStatus', e.target.value)}
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

                {/* Trials Min */}
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Min Trials"
                    placeholder="0"
                    min={0}
                    value={localFilters.trialsMin === '' ? '' : Number(localFilters.trialsMin)}
                    onChange={(value) => handleFilterChange('trialsMin', value === '' ? '' : value)}
                  />
                </Grid.Col>

                {/* Trials Max */}
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Max Trials"
                    placeholder="100"
                    min={0}
                    value={localFilters.trialsMax === '' ? '' : Number(localFilters.trialsMax)}
                    onChange={(value) => handleFilterChange('trialsMax', value === '' ? '' : value)}
                  />
                </Grid.Col>

                {/* Sort Property */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Sort By"
                    value={localFilters.sortProperty}
                    onChange={(value) => handleFilterChange('sortProperty', value)}
                    data={[
                      { value: 'type', label: 'Type' },
                      { value: 'status', label: 'Status' },
                      { value: 'trials', label: 'Trials' },
                      { value: 'createdAt', label: 'Date Created' },
                      { value: 'scrapingjobId', label: 'Scraping Job ID' },
                      { value: 'scrapingjobStatus', label: 'Scraping Job Status' }
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
              <Text c="dimmed">Loading manifests...</Text>
            </Stack>
          </Paper>
        ) : (
          <>
            {/* Manifests Grid */}
            {manifests.length === 0 ? (
              <Paper shadow="sm" p="xl" radius="md">
                <Stack align="center" gap="md">
                  <Text size="lg" c="dimmed">No manifests found</Text>
                  <Text size="sm" c="dimmed">Try adjusting your filters</Text>
                  <Button variant="light" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                </Stack>
              </Paper>
            ) : (
              <Grid>
                {manifests.map((manifest) => (
                  <Grid.Col key={manifest._id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <Card shadow="sm" radius="md" withBorder h="100%">
                      <Stack gap="sm">
                        {/* Type and Status */}
                        <Group justify="space-between" align="flex-start">
                          <div style={{ flex: 1 }}>
                            <Text fw={600} size="lg">
                              Manifest
                            </Text>
                            <Group gap={4} mt={4}>
                              <Badge
                                variant="light"
                                color={getTypeBadgeColor(manifest.type)}
                              >
                                {manifest.type || 'Unknown'}
                              </Badge>
                              <Badge
                                variant="light"
                                color={getStatusBadgeColor(manifest.status)}
                              >
                                {manifest.status || 'Unknown'}
                              </Badge>
                            </Group>
                          </div>
                          {/* Start Scraping Button - Only for PENDING status */}
                          {manifest.status?.toUpperCase() === 'PENDING' && (
                            <Tooltip label="Start Scraping">
                              <ActionIcon
                                variant="filled"
                                color="green"
                                size="lg"
                                onClick={() => handleStartScraping(manifest._id)}
                              >
                                <HiPlay size={18} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </Group>

                        {/* Manifest ID */}
                        <Group gap="xs">
                          <Text size="xs" c="dimmed">ID:</Text>
                          <Code size="xs">{manifest._id.slice(-12)}</Code>
                        </Group>

                        {/* Trials */}
                        <Group gap="xs">
                          <HiClock size={14} />
                          <Text size="xs" c="dimmed">Trials:</Text>
                          <Badge size="sm" variant="light" color="blue">
                            {manifest.trials}
                          </Badge>
                        </Group>

                        {/* Scraping Job Info */}
                        {(manifest.scrapingjobId || manifest.scrapingjobStatus) && (
                          <Stack gap={4}>
                            {manifest.scrapingjobId && (
                              <Group gap={4}>
                                <Text size="xs" c="dimmed">Job ID:</Text>
                                <Code size="xs">{manifest.scrapingjobId}</Code>
                              </Group>
                            )}
                            {manifest.scrapingjobStatus && (
                              <Group gap={4}>
                                <Text size="xs" c="dimmed">Job Status:</Text>
                                <Text size="xs" fw={500}>{manifest.scrapingjobStatus}</Text>
                              </Group>
                            )}
                          </Stack>
                        )}

                        {/* Dates */}
                        <Stack gap={4}>
                          <Group gap={4}>
                            <Text size="xs" c="dimmed">Created:</Text>
                            <Text size="xs" fw={500}>
                              {formatDate(manifest.createdAt)}
                            </Text>
                          </Group>
                          <Group gap={4}>
                            <Text size="xs" c="dimmed">Last Modified:</Text>
                            <Text size="xs" fw={500}>
                              {formatDate(manifest.lastModify)}
                            </Text>
                          </Group>
                        </Stack>
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

export default ManifestsList;
