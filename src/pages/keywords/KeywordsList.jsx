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
  HiTag,
  HiCalendar,
  HiPlus,
  HiClipboardCopy
} from 'react-icons/hi';
import { MdRefresh } from 'react-icons/md';
import {
  fetchKeywords,
  setFilters,
  resetFilters,
  setPage,
  setSortProperty,
  setSortType,
  selectKeywords,
  selectPagination,
  selectFilters,
  selectLoading,
  selectError
} from '../../store/slices/keywordsSlice';
import FloatingActionButton from '../../components/common/FloatingActionButton';
import AddKeywordModal from './AddKeywordModal';
import keywordsService from '../../services/keywords';

const KeywordsList = () => {
  const dispatch = useDispatch();
  const keywords = useSelector(selectKeywords);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [modalOpened, setModalOpened] = useState(false);

  // Fetch keywords on mount and when filters change
  useEffect(() => {
    dispatch(fetchKeywords({ ...filters, page: pagination.page, limit: pagination.limit }));
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
      keyword: '',
      keywordLink: '',
      createdAt: '',
      searchResultMin: '',
      searchResultMax: '',
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
      // Set new property and default to ascending
      dispatch(setSortProperty(property));
      dispatch(setSortType('ASCENDING'));
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchKeywords({ ...filters, page: pagination.page, limit: pagination.limit }));
    notifications.show({
      title: 'Refreshed',
      message: 'Keywords list has been refreshed',
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

  // Get stage badge color
  const getStageBadgeColor = (stage) => {
    switch (stage) {
      case 'TOSCRAP':
        return 'blue';
      case 'SCRAPING':
        return 'yellow';
      case 'COMPLETED':
        return 'green';
      case 'FAILED':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Handle copy keyword ID
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      notifications.show({
        title: 'Copied',
        message: 'Keyword ID copied to clipboard',
        color: 'green'
      });
    }).catch(() => {
      notifications.show({
        title: 'Error',
        message: 'Failed to copy ID',
        color: 'red'
      });
    });
  };

  // Handle rescrape keyword
  const handleRescrape = async (id) => {
    try {
      const response = await keywordsService.rescrapeKeyword(id);
      notifications.show({
        title: 'Success',
        message: response.message || 'Keyword rescraping started',
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to rescrape keyword',
        color: 'red'
      });
    }
  };

  return (
    <>
      <Container size="xl" py="xl">
        <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Keywords Manager</Title>
            <Text c="dimmed" size="sm">
              Browse and filter {formatNumber(pagination.totalRecords)} keywords
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
              <Title order={4}>Filter Keywords</Title>

              <Grid>
                {/* Search */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Search"
                    placeholder="Search in keyword or link"
                    leftSection={<HiSearch />}
                    value={localFilters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </Grid.Col>

                {/* Keyword */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Keyword"
                    placeholder="e.g., Binoculars"
                    leftSection={<HiTag />}
                    value={localFilters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
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

                {/* Search Result Min */}
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Min Search Results"
                    placeholder="0"
                    min={0}
                    value={localFilters.searchResultMin === '' ? '' : Number(localFilters.searchResultMin)}
                    onChange={(value) => handleFilterChange('searchResultMin', value === '' ? '' : value)}
                  />
                </Grid.Col>

                {/* Search Result Max */}
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <NumberInput
                    label="Max Search Results"
                    placeholder="999999"
                    min={0}
                    value={localFilters.searchResultMax === '' ? '' : Number(localFilters.searchResultMax)}
                    onChange={(value) => handleFilterChange('searchResultMax', value === '' ? '' : value)}
                  />
                </Grid.Col>

                {/* Sort Property */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Sort By"
                    value={localFilters.sortProperty}
                    onChange={(value) => handleFilterChange('sortProperty', value)}
                    data={[
                      { value: 'keyword', label: 'Keyword' },
                      { value: 'searchResult', label: 'Search Results' },
                      { value: 'createdAt', label: 'Date Created' },
                      { value: 'keywordLink', label: 'Keyword Link' }
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
              <Text c="dimmed">Loading keywords...</Text>
            </Stack>
          </Paper>
        ) : (
          <>
            {/* Keywords Grid */}
            {keywords.length === 0 ? (
              <Paper shadow="sm" p="xl" radius="md">
                <Stack align="center" gap="md">
                  <Text size="lg" c="dimmed">No keywords found</Text>
                  <Text size="sm" c="dimmed">Try adjusting your filters</Text>
                  <Button variant="light" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                </Stack>
              </Paper>
            ) : (
              <Grid>
                {keywords.map((keyword) => (
                  <Grid.Col key={keyword._id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <Card shadow="sm" radius="md" withBorder h="100%">
                      <Stack gap="sm">
                        {/* Keyword Name */}
                        <Group justify="space-between" align="flex-start">
                          <div style={{ flex: 1 }}>
                            <Text fw={600} size="lg" lineClamp={2}>
                              {keyword.keyword}
                            </Text>
                            <Group gap={4} mt={4}>
                              <Badge
                                variant="light"
                                color={getStageBadgeColor(keyword.stage)}
                              >
                                {keyword.stage}
                              </Badge>
                            </Group>
                          </div>
                          <Group gap={4}>
                            <Tooltip label="Rescrape">
                              <ActionIcon
                                variant="light"
                                size="sm"
                                color="blue"
                                onClick={() => handleRescrape(keyword._id)}
                              >
                                <MdRefresh size={16} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Copy ID">
                              <ActionIcon
                                variant="light"
                                size="sm"
                                color="teal"
                                onClick={() => handleCopyId(keyword._id)}
                              >
                                <HiClipboardCopy size={16} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="View on eBay">
                              <ActionIcon
                                component="a"
                                href={keyword.keywordLink}
                                target="_blank"
                                variant="light"
                                size="sm"
                              >
                                <HiExternalLink size={16} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Group>

                        {/* Stats */}
                        <Group gap="xs">
                          <Badge
                            leftSection={<HiSearch size={12} />}
                            variant="light"
                            color="blue"
                          >
                            {formatNumber(keyword.searchResult)} results
                          </Badge>
                        </Group>

                        {/* Additional Info */}
                        <Stack gap={4}>
                          <Group gap={4}>
                            <Text size="xs" c="dimmed">Created:</Text>
                            <Text size="xs" fw={500}>
                              {formatDate(keyword.createdAt)}
                            </Text>
                          </Group>
                          <Group gap={4}>
                            <Text size="xs" c="dimmed">Last Modified:</Text>
                            <Text size="xs" fw={500}>
                              {formatDate(keyword.lastModify)}
                            </Text>
                          </Group>
                          {keyword.manifestId && (
                            <Group gap={4}>
                              <Text size="xs" c="dimmed">Manifest ID:</Text>
                              <Text size="xs" fw={500} style={{ fontFamily: 'monospace' }}>
                                {keyword.manifestId.slice(-8)}
                              </Text>
                            </Group>
                          )}
                        </Stack>

                        {/* Keyword Link */}
                        <Anchor
                          href={keyword.keywordLink}
                          target="_blank"
                          size="xs"
                          c="blue"
                          lineClamp={1}
                        >
                          View search on eBay →
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

    {/* Floating Action Button */}
    <FloatingActionButton
      icon={HiPlus}
      label="Add Keyword"
      onClick={() => setModalOpened(true)}
    />

    {/* Add Keyword Modal */}
    <AddKeywordModal
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    />
  </>
  );
};

export default KeywordsList;
