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
  HiCog,
  HiDocumentText
} from 'react-icons/hi';
import { MdRestartAlt } from 'react-icons/md';
import {
  fetchWebscraperJobs,
  setFilters,
  resetFilters,
  setPage,
  setSortProperty,
  setSortType,
  selectWebscraperJobs,
  selectPagination,
  selectFilters,
  selectLoading,
  selectError
} from '../../store/slices/webscraperSlice';
import webscraperService from '../../services/webscraper';

const WebscraperList = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectWebscraperJobs);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [resettingJobs, setResettingJobs] = useState({});

  // Fetch jobs on mount and when filters change
  useEffect(() => {
    dispatch(fetchWebscraperJobs({ ...filters, page: pagination.page, limit: pagination.limit }));
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
      scrapingjob_id: '',
      custom_id: '',
      sitemap_id: '',
      sitemap_name: '',
      status: '',
      excludeStatus: ['closed', 'stopped'],
      scrapingResultMin: '',
      scrapingResultMax: '',
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
    dispatch(fetchWebscraperJobs({ ...filters, page: pagination.page, limit: pagination.limit }));
    notifications.show({
      title: 'Refreshed',
      message: 'Webscraper jobs list has been refreshed',
      color: 'blue'
    });
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

  // Check if job is stuck (lastModify > 1 hour ago)
  const isJobStuck = (job) => {
    if (!job.lastModify) return false;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const lastModifyDate = new Date(job.lastModify);
    return lastModifyDate < oneHourAgo && job.status === 'processing';
  };

  // Handle reset stuck job
  const handleResetStuckJob = async (event, job) => {
    event.preventDefault();
    event.stopPropagation();

    setResettingJobs(prev => ({ ...prev, [job._id]: true }));

    try {
      const response = await webscraperService.resetStuckJob(job._id);

      notifications.show({
        title: 'Success',
        message: response.message || `Job #${job.scrapingjob_id} has been reset. Refresh to see updated status.`,
        color: 'green',
        icon: <MdRestartAlt />
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to reset stuck job',
        color: 'red'
      });
    } finally {
      setResettingJobs(prev => ({ ...prev, [job._id]: false }));
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'closed':
        return 'green';
      case 'running':
        return 'blue';
      case 'pending':
        return 'yellow';
      case 'failed':
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
            <Title order={2}>Webscraper Jobs</Title>
            <Text c="dimmed" size="sm">
              Browse and filter {formatNumber(pagination.totalRecords)} scraping jobs
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
              <Title order={4}>Filter Scraping Jobs</Title>

              <Grid>
                {/* Scraping Job ID */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Scraping Job ID"
                    placeholder="e.g., 24308945"
                    value={localFilters.scrapingjob_id}
                    onChange={(e) => handleFilterChange('scrapingjob_id', e.target.value)}
                  />
                </Grid.Col>

                {/* Custom ID */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Custom ID"
                    placeholder="e.g., store"
                    value={localFilters.custom_id}
                    onChange={(e) => handleFilterChange('custom_id', e.target.value)}
                  />
                </Grid.Col>

                {/* Sitemap ID */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Sitemap ID"
                    placeholder="e.g., 1150227"
                    value={localFilters.sitemap_id}
                    onChange={(e) => handleFilterChange('sitemap_id', e.target.value)}
                  />
                </Grid.Col>

                {/* Sitemap Name */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Sitemap Name"
                    placeholder="e.g., getStoreLocationAndSoldOrders"
                    value={localFilters.sitemap_name}
                    onChange={(e) => handleFilterChange('sitemap_name', e.target.value)}
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
                      { value: 'closed', label: 'Closed' },
                      { value: 'processing', label: 'Processing' },
                      { value: 'stopped', label: 'Stopped' },
                      { value: 'finished', label: 'Finished' },
                      { value: 'failed', label: 'Failed' }
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
                      { value: 'closed', label: 'Closed' },
                      { value: 'processing', label: 'Processing' },
                      { value: 'stopped', label: 'Stopped' },
                      { value: 'finished', label: 'Finished' },
                      { value: 'failed', label: 'Failed' }
                    ]}
                    clearable
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

                {/* Scraping Result Min */}
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Min Results"
                    placeholder="0"
                    min={0}
                    value={localFilters.scrapingResultMin === '' ? '' : Number(localFilters.scrapingResultMin)}
                    onChange={(value) => handleFilterChange('scrapingResultMin', value === '' ? '' : value)}
                  />
                </Grid.Col>

                {/* Scraping Result Max */}
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Max Results"
                    placeholder="999999"
                    min={0}
                    value={localFilters.scrapingResultMax === '' ? '' : Number(localFilters.scrapingResultMax)}
                    onChange={(value) => handleFilterChange('scrapingResultMax', value === '' ? '' : value)}
                  />
                </Grid.Col>

                {/* Sort Property */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Sort By"
                    value={localFilters.sortProperty}
                    onChange={(value) => handleFilterChange('sortProperty', value)}
                    data={[
                      { value: 'scrapingjob_id', label: 'Job ID' },
                      { value: 'custom_id', label: 'Custom ID' },
                      { value: 'sitemap_id', label: 'Sitemap ID' },
                      { value: 'sitemap_name', label: 'Sitemap Name' },
                      { value: 'status', label: 'Status' },
                      { value: 'scrapingResult', label: 'Result Count' },
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
              <Text c="dimmed">Loading jobs...</Text>
            </Stack>
          </Paper>
        ) : (
          <>
            {/* Jobs Grid */}
            {jobs.length === 0 ? (
              <Paper shadow="sm" p="xl" radius="md">
                <Stack align="center" gap="md">
                  <Text size="lg" c="dimmed">No jobs found</Text>
                  <Text size="sm" c="dimmed">Try adjusting your filters</Text>
                  <Button variant="light" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                </Stack>
              </Paper>
            ) : (
              <Grid>
                {jobs.map((job) => (
                  <Grid.Col key={job._id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <Card shadow="sm" radius="md" withBorder h="100%">
                      <Stack gap="sm">
                        {/* Job ID and Status */}
                        <Group justify="space-between" align="flex-start">
                          <div style={{ flex: 1 }}>
                            <Text fw={600} size="lg">
                              Job #{job.scrapingjob_id}
                            </Text>
                            <Group gap={4} mt={4}>
                              <Badge
                                variant="light"
                                color={getStatusBadgeColor(job.status)}
                              >
                                {job.status || 'Unknown'}
                              </Badge>
                              {job.scrapingResult !== undefined && (
                                <Badge variant="light" color="blue">
                                  {formatNumber(job.scrapingResult)} results
                                </Badge>
                              )}
                              {isJobStuck(job) && (
                                <Badge variant="light" color="orange">
                                  Stuck
                                </Badge>
                              )}
                            </Group>
                          </div>
                          {isJobStuck(job) && (
                            <Tooltip label="Reset stuck job">
                              <ActionIcon
                                variant="light"
                                color="orange"
                                loading={resettingJobs[job._id]}
                                onClick={(e) => handleResetStuckJob(e, job)}
                              >
                                <MdRestartAlt size={18} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </Group>

                        {/* Custom ID */}
                        {job.custom_id && (
                          <Group gap="xs">
                            <Text size="xs" c="dimmed">Custom ID:</Text>
                            <Code size="xs">{job.custom_id}</Code>
                          </Group>
                        )}

                        {/* Sitemap Info */}
                        <Stack gap={4}>
                          <Group gap={4}>
                            <HiDocumentText size={14} />
                            <Text size="xs" c="dimmed">Sitemap:</Text>
                          </Group>
                          <Text size="xs" fw={500} lineClamp={2}>
                            {job.sitemap_name || 'N/A'}
                          </Text>
                          {job.sitemap_id && (
                            <Text size="xs" c="dimmed">
                              ID: {job.sitemap_id}
                            </Text>
                          )}
                        </Stack>

                        {/* Dates */}
                        <Group gap="xs" justify="space-between">
                          <Group gap={4}>
                            <Text size="xs" c="dimmed">Updated:</Text>
                            <Text size="xs" fw={500}>
                              {formatDate(job.lastModify)}
                            </Text>
                          </Group>
                          <Group gap={4}>
                            <Text size="xs" c="dimmed">Created:</Text>
                            <Text size="xs" fw={500}>
                              {formatDate(job.createdAt)}
                            </Text>
                          </Group>
                        </Group>

                        {/* Trials count if exists */}
                        {job.trials !== undefined && job.trials > 0 && (
                          <Group gap={4}>
                            <Text size="xs" c="dimmed">Retry attempts:</Text>
                            <Badge size="xs" color="orange" variant="light">
                              {job.trials}
                            </Badge>
                          </Group>
                        )}

                        {/* Error Alert for failed jobs */}
                        {job.error && (
                          <Alert color="red" variant="light" p="xs">
                            <Text size="xs" fw={500} mb={4}>Error:</Text>
                            <Text size="xs">{job.error}</Text>
                          </Alert>
                        )}
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

export default WebscraperList;
