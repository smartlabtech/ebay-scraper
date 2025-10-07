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
  Flex,
  Code
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
  HiDocumentText
} from 'react-icons/hi';
import {
  fetchKeywordPages,
  setFilters,
  resetFilters,
  setPage,
  setSortProperty,
  setSortType,
  selectKeywordPages,
  selectPagination,
  selectFilters,
  selectLoading,
  selectError
} from '../../store/slices/keywordPagesSlice';

const KeywordPagesList = () => {
  const dispatch = useDispatch();
  const keywordPages = useSelector(selectKeywordPages);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Fetch keyword pages on mount and when filters change
  useEffect(() => {
    dispatch(fetchKeywordPages({ ...filters, page: pagination.page, limit: pagination.limit }));
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
      keywordId: '',
      originManifestId: '',
      manifestId: '',
      pageNumber: '',
      stage: '',
      createdAt: '',
      pageNumberMin: '',
      pageNumberMax: '',
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
    dispatch(fetchKeywordPages({ ...filters, page: pagination.page, limit: pagination.limit }));
    notifications.show({
      title: 'Refreshed',
      message: 'Keyword pages list has been refreshed',
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

  // Get stage badge color
  const getStageBadgeColor = (stage) => {
    switch (stage?.toUpperCase()) {
      case 'CREATED':
        return 'blue';
      case 'PROCESSING':
        return 'yellow';
      case 'COMPLETED':
        return 'green';
      case 'FAILED':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Extract keyword from link
  const extractKeyword = (link) => {
    try {
      const url = new URL(link);
      const keyword = url.searchParams.get('_nkw');
      return keyword ? decodeURIComponent(keyword) : 'N/A';
    } catch {
      return 'N/A';
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Keyword Pages</Title>
            <Text c="dimmed" size="sm">
              Browse and filter {formatNumber(pagination.totalRecords)} keyword pages
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
              <Title order={4}>Filter Keyword Pages</Title>

              <Grid>
                {/* Search */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Search in Link"
                    placeholder="Search in link URL"
                    leftSection={<HiSearch />}
                    value={localFilters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
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

                {/* Origin Manifest ID */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Origin Manifest ID"
                    placeholder="MongoDB ObjectId"
                    value={localFilters.originManifestId}
                    onChange={(e) => handleFilterChange('originManifestId', e.target.value)}
                  />
                </Grid.Col>

                {/* Manifest ID */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Manifest ID"
                    placeholder="MongoDB ObjectId"
                    value={localFilters.manifestId}
                    onChange={(e) => handleFilterChange('manifestId', e.target.value)}
                  />
                </Grid.Col>

                {/* Stage */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Stage"
                    placeholder="e.g., CREATED, PROCESSING, COMPLETED"
                    value={localFilters.stage}
                    onChange={(e) => handleFilterChange('stage', e.target.value)}
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

                {/* Page Number Min */}
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Min Page Number"
                    placeholder="1"
                    min={0}
                    value={localFilters.pageNumberMin === '' ? '' : Number(localFilters.pageNumberMin)}
                    onChange={(value) => handleFilterChange('pageNumberMin', value === '' ? '' : value)}
                  />
                </Grid.Col>

                {/* Page Number Max */}
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Max Page Number"
                    placeholder="100"
                    min={0}
                    value={localFilters.pageNumberMax === '' ? '' : Number(localFilters.pageNumberMax)}
                    onChange={(value) => handleFilterChange('pageNumberMax', value === '' ? '' : value)}
                  />
                </Grid.Col>

                {/* Sort Property */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Sort By"
                    value={localFilters.sortProperty}
                    onChange={(value) => handleFilterChange('sortProperty', value)}
                    data={[
                      { value: 'link', label: 'Link' },
                      { value: 'keywordId', label: 'Keyword ID' },
                      { value: 'pageNumber', label: 'Page Number' },
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
              <Text c="dimmed">Loading keyword pages...</Text>
            </Stack>
          </Paper>
        ) : (
          <>
            {/* Keyword Pages Grid */}
            {keywordPages.length === 0 ? (
              <Paper shadow="sm" p="xl" radius="md">
                <Stack align="center" gap="md">
                  <Text size="lg" c="dimmed">No keyword pages found</Text>
                  <Text size="sm" c="dimmed">Try adjusting your filters</Text>
                  <Button variant="light" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                </Stack>
              </Paper>
            ) : (
              <Grid>
                {keywordPages.map((keywordPage) => (
                  <Grid.Col key={keywordPage._id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <Card shadow="sm" radius="md" withBorder h="100%">
                      <Stack gap="sm">
                        {/* Page Number and Stage */}
                        <Group justify="space-between" align="flex-start">
                          <div>
                            <Text fw={600} size="lg">
                              Page {keywordPage.page || 'N/A'}
                            </Text>
                            <Group gap={4} mt={4}>
                              <Badge
                                variant="light"
                                color={getStageBadgeColor(keywordPage.stage)}
                              >
                                {keywordPage.stage || 'Unknown'}
                              </Badge>
                            </Group>
                          </div>
                          <Tooltip label="View on eBay">
                            <ActionIcon
                              component="a"
                              href={keywordPage.link}
                              target="_blank"
                              variant="light"
                              size="sm"
                            >
                              <HiExternalLink />
                            </ActionIcon>
                          </Tooltip>
                        </Group>

                        {/* Keyword */}
                        <Stack gap={4}>
                          <Text size="xs" c="dimmed">Keyword:</Text>
                          <Text size="sm" fw={500} lineClamp={2}>
                            {extractKeyword(keywordPage.link)}
                          </Text>
                        </Stack>

                        {/* IDs */}
                        <Stack gap={4}>
                          {keywordPage.keywordId && (
                            <Group gap={4}>
                              <Text size="xs" c="dimmed">Keyword ID:</Text>
                              <Code size="xs">{keywordPage.keywordId.slice(-8)}</Code>
                            </Group>
                          )}
                          {keywordPage.manifestId && (
                            <Group gap={4}>
                              <Text size="xs" c="dimmed">Manifest ID:</Text>
                              <Code size="xs">{keywordPage.manifestId.slice(-8)}</Code>
                            </Group>
                          )}
                          {keywordPage.originManifestId && (
                            <Group gap={4}>
                              <Text size="xs" c="dimmed">Origin:</Text>
                              <Code size="xs">{keywordPage.originManifestId.slice(-8)}</Code>
                            </Group>
                          )}
                        </Stack>

                        {/* Dates */}
                        <Stack gap={4}>
                          <Group gap={4}>
                            <Text size="xs" c="dimmed">Created:</Text>
                            <Text size="xs" fw={500}>
                              {formatDate(keywordPage.createdAt)}
                            </Text>
                          </Group>
                          <Group gap={4}>
                            <Text size="xs" c="dimmed">Last Modified:</Text>
                            <Text size="xs" fw={500}>
                              {formatDate(keywordPage.lastModify)}
                            </Text>
                          </Group>
                        </Stack>

                        {/* Link */}
                        <Anchor
                          href={keywordPage.link}
                          target="_blank"
                          size="xs"
                          c="blue"
                          lineClamp={1}
                        >
                          View page on eBay →
                        </Anchor>
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

export default KeywordPagesList;
