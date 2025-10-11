import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
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
  Box,
  Flex
} from "@mantine/core"
import {DateInput} from "@mantine/dates"
import {notifications} from "@mantine/notifications"
import {
  HiSearch,
  HiFilter,
  HiRefresh,
  HiExternalLink,
  HiLocationMarker,
  HiCalendar,
  HiShoppingCart,
  HiCollection,
  HiChevronDown,
  HiChevronUp,
  HiTrendingUp,
  HiTrendingDown,
  HiClock
} from "react-icons/hi"
import {
  fetchStores,
  setFilters,
  resetFilters,
  setPage,
  setSortProperty,
  setSortType,
  selectStores,
  selectPagination,
  selectFilters,
  selectLoading,
  selectError
} from "../../store/slices/storesSlice"

const StoresList = () => {
  const dispatch = useDispatch()
  const stores = useSelector(selectStores)
  const pagination = useSelector(selectPagination)
  const filters = useSelector(selectFilters)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)

  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  // Fetch stores on mount and when filters change
  useEffect(() => {
    dispatch(
      fetchStores({...filters, page: pagination.page, limit: pagination.limit})
    )
  }, [dispatch, filters, pagination.page, pagination.limit])

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({...prev, [key]: value}))
  }

  // Apply filters
  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters))
    dispatch(setPage(1)) // Reset to first page when applying filters
  }

  // Reset all filters
  const handleResetFilters = () => {
    const resetState = {
      location: "",
      storeLink: "",
      stage: "",
      createdAt: "",
      memberSince: "",
      memberSinceBefore: "",
      soldMin: "",
      soldMax: "",
      searchAllMin: "",
      searchAllMax: "",
      soldDeltaMin: "",
      soldDeltaMax: "",
      searchAllDeltaMin: "",
      searchAllDeltaMax: "",
      lastScrapedAt: "",
      lastScrapedAtBefore: "",
      lastSoldDeltaAt: "",
      lastSoldDeltaAtBefore: "",
      search: "",
      sortProperty: "createdAt",
      sortType: "DESCENDING"
    }
    setLocalFilters(resetState)
    dispatch(resetFilters())
    dispatch(setPage(1))
  }

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setPage(page))
  }

  // Handle sort change
  const handleSortChange = (property) => {
    if (filters.sortProperty === property) {
      // Toggle sort direction if same property
      dispatch(
        setSortType(
          filters.sortType === "ASCENDING" ? "DESCENDING" : "ASCENDING"
        )
      )
    } else {
      // Set new property and default to descending
      dispatch(setSortProperty(property))
      dispatch(setSortType("DESCENDING"))
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    dispatch(
      fetchStores({...filters, page: pagination.page, limit: pagination.limit})
    )
    notifications.show({
      title: "Refreshed",
      message: "Stores list has been refreshed",
      color: "blue"
    })
  }


  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "N/A"
    return num.toLocaleString()
  }

  // Format delta with sign
  const formatDelta = (num) => {
    if (num === null || num === undefined) return null
    if (num === 0) return "0"
    return num > 0 ? `+${num.toLocaleString()}` : num.toLocaleString()
  }

  // Get delta color
  const getDeltaColor = (num) => {
    if (num === null || num === undefined || num === 0) return "gray"
    return num > 0 ? "green" : "red"
  }

  // Convert date string to Date object for DateInput
  const parseDateForInput = (dateStr) => {
    if (!dateStr || dateStr === '') return null
    try {
      // Parse as YYYY-MM-DD in local timezone
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(year, month - 1, day)
    } catch {
      return null
    }
  }

  // Convert Date object or string to YYYY-MM-DD string
  const formatDateForAPI = (date) => {
    if (!date) return ''

    // If already a string in YYYY-MM-DD format, return it
    if (typeof date === 'string') {
      return date
    }

    // If it's a Date object, format it
    if (date instanceof Date && !isNaN(date.getTime())) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    return ''
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>eBay Stores</Title>
            <Text c="dimmed" size="sm">
              Browse and filter {formatNumber(pagination.totalRecords)} stores
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
              variant={showFilters ? "filled" : "light"}
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
              <Title order={4}>Filter Stores</Title>

              <Grid>
                {/* Search */}
                <Grid.Col span={{base: 12, md: 6}}>
                  <TextInput
                    label="Search"
                    placeholder="Search in store link or location"
                    leftSection={<HiSearch />}
                    value={localFilters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                  />
                </Grid.Col>

                {/* Location */}
                <Grid.Col span={{base: 12, md: 6}}>
                  <TextInput
                    label="Location"
                    placeholder="e.g., United States, California"
                    leftSection={<HiLocationMarker />}
                    value={localFilters.location}
                    onChange={(e) =>
                      handleFilterChange("location", e.target.value)
                    }
                  />
                </Grid.Col>

                {/* Stage */}
                <Grid.Col span={{base: 12, md: 6}}>
                  <Select
                    label="Stage"
                    placeholder="Select workflow stage"
                    value={localFilters.stage}
                    onChange={(value) => handleFilterChange("stage", value)}
                    data={[
                      { value: "", label: "All Stages" },
                      { value: "CREATED", label: "Created" },
                      { value: "TOSCRAP", label: "To Scrap" },
                      { value: "SCRAPED", label: "Scraped" }
                    ]}
                    clearable
                  />
                </Grid.Col>

                {/* Member Since After */}
                <Grid.Col span={{base: 12, md: 6}}>
                  <DateInput
                    label="Member Since (After)"
                    placeholder="Select date"
                    value={parseDateForInput(localFilters.memberSince)}
                    onChange={(date) => handleFilterChange('memberSince', formatDateForAPI(date))}
                    valueFormat="YYYY-MM-DD"
                    clearable
                  />
                </Grid.Col>

                {/* Member Since Before */}
                <Grid.Col span={{base: 12, md: 6}}>
                  <DateInput
                    label="Member Since (Before)"
                    placeholder="Select date"
                    value={parseDateForInput(localFilters.memberSinceBefore)}
                    onChange={(date) => handleFilterChange('memberSinceBefore', formatDateForAPI(date))}
                    valueFormat="YYYY-MM-DD"
                    clearable
                  />
                </Grid.Col>

                {/* Sold Min */}
                <Grid.Col span={{base: 12, sm: 6, md: 3}}>
                  <NumberInput
                    label="Min Sold"
                    placeholder="0"
                    min={0}
                    value={
                      localFilters.soldMin === ""
                        ? ""
                        : Number(localFilters.soldMin)
                    }
                    onChange={(value) =>
                      handleFilterChange("soldMin", value === "" ? "" : value)
                    }
                  />
                </Grid.Col>

                {/* Sold Max */}
                <Grid.Col span={{base: 12, sm: 6, md: 3}}>
                  <NumberInput
                    label="Max Sold"
                    placeholder="999999"
                    min={0}
                    value={
                      localFilters.soldMax === ""
                        ? ""
                        : Number(localFilters.soldMax)
                    }
                    onChange={(value) =>
                      handleFilterChange("soldMax", value === "" ? "" : value)
                    }
                  />
                </Grid.Col>

                {/* Products Min */}
                <Grid.Col span={{base: 12, sm: 6, md: 3}}>
                  <NumberInput
                    label="Min Products"
                    placeholder="0"
                    min={0}
                    value={
                      localFilters.searchAllMin === ""
                        ? ""
                        : Number(localFilters.searchAllMin)
                    }
                    onChange={(value) =>
                      handleFilterChange(
                        "searchAllMin",
                        value === "" ? "" : value
                      )
                    }
                  />
                </Grid.Col>

                {/* Products Max */}
                <Grid.Col span={{base: 12, sm: 6, md: 3}}>
                  <NumberInput
                    label="Max Products"
                    placeholder="999999"
                    min={0}
                    value={
                      localFilters.searchAllMax === ""
                        ? ""
                        : Number(localFilters.searchAllMax)
                    }
                    onChange={(value) =>
                      handleFilterChange(
                        "searchAllMax",
                        value === "" ? "" : value
                      )
                    }
                  />
                </Grid.Col>

                {/* Sold Delta Min */}
                <Grid.Col span={{base: 12, sm: 6, md: 3}}>
                  <NumberInput
                    label="Min Sold Delta"
                    placeholder="Change in sold items"
                    value={
                      localFilters.soldDeltaMin === ""
                        ? ""
                        : Number(localFilters.soldDeltaMin)
                    }
                    onChange={(value) =>
                      handleFilterChange("soldDeltaMin", value === "" ? "" : value)
                    }
                  />
                </Grid.Col>

                {/* Sold Delta Max */}
                <Grid.Col span={{base: 12, sm: 6, md: 3}}>
                  <NumberInput
                    label="Max Sold Delta"
                    placeholder="Change in sold items"
                    value={
                      localFilters.soldDeltaMax === ""
                        ? ""
                        : Number(localFilters.soldDeltaMax)
                    }
                    onChange={(value) =>
                      handleFilterChange("soldDeltaMax", value === "" ? "" : value)
                    }
                  />
                </Grid.Col>

                {/* Inventory Delta Min */}
                <Grid.Col span={{base: 12, sm: 6, md: 3}}>
                  <NumberInput
                    label="Min Inventory Delta"
                    placeholder="Change in inventory"
                    value={
                      localFilters.searchAllDeltaMin === ""
                        ? ""
                        : Number(localFilters.searchAllDeltaMin)
                    }
                    onChange={(value) =>
                      handleFilterChange("searchAllDeltaMin", value === "" ? "" : value)
                    }
                  />
                </Grid.Col>

                {/* Inventory Delta Max */}
                <Grid.Col span={{base: 12, sm: 6, md: 3}}>
                  <NumberInput
                    label="Max Inventory Delta"
                    placeholder="Change in inventory"
                    value={
                      localFilters.searchAllDeltaMax === ""
                        ? ""
                        : Number(localFilters.searchAllDeltaMax)
                    }
                    onChange={(value) =>
                      handleFilterChange("searchAllDeltaMax", value === "" ? "" : value)
                    }
                  />
                </Grid.Col>

                {/* Last Scraped After */}
                <Grid.Col span={{base: 12, md: 6}}>
                  <DateInput
                    label="Last Scraped (After)"
                    placeholder="Select date"
                    value={parseDateForInput(localFilters.lastScrapedAt)}
                    onChange={(date) => handleFilterChange('lastScrapedAt', formatDateForAPI(date))}
                    valueFormat="YYYY-MM-DD"
                    clearable
                  />
                </Grid.Col>

                {/* Last Scraped Before */}
                <Grid.Col span={{base: 12, md: 6}}>
                  <DateInput
                    label="Last Scraped (Before)"
                    placeholder="Select date"
                    value={parseDateForInput(localFilters.lastScrapedAtBefore)}
                    onChange={(date) => handleFilterChange('lastScrapedAtBefore', formatDateForAPI(date))}
                    valueFormat="YYYY-MM-DD"
                    clearable
                  />
                </Grid.Col>

                {/* Last Sales Activity After */}
                <Grid.Col span={{base: 12, md: 6}}>
                  <DateInput
                    label="Last Sales Activity (After)"
                    placeholder="Select date"
                    description="When soldDelta was last non-zero"
                    value={parseDateForInput(localFilters.lastSoldDeltaAt)}
                    onChange={(date) => handleFilterChange('lastSoldDeltaAt', formatDateForAPI(date))}
                    valueFormat="YYYY-MM-DD"
                    clearable
                  />
                </Grid.Col>

                {/* Last Sales Activity Before */}
                <Grid.Col span={{base: 12, md: 6}}>
                  <DateInput
                    label="Last Sales Activity (Before)"
                    placeholder="Select date"
                    description="When soldDelta was last non-zero"
                    value={parseDateForInput(localFilters.lastSoldDeltaAtBefore)}
                    onChange={(date) => handleFilterChange('lastSoldDeltaAtBefore', formatDateForAPI(date))}
                    valueFormat="YYYY-MM-DD"
                    clearable
                  />
                </Grid.Col>

                {/* Sort Property */}
                <Grid.Col span={{base: 12, md: 6}}>
                  <Select
                    label="Sort By"
                    value={localFilters.sortProperty}
                    onChange={(value) =>
                      handleFilterChange("sortProperty", value)
                    }
                    data={[
                      {value: "memberSince", label: "Member Since"},
                      {value: "sold", label: "Items Sold"},
                      {value: "searchAll", label: "Total Products"},
                      {value: "soldDelta", label: "Sold Delta"},
                      {value: "searchAllDelta", label: "Inventory Delta"},
                      {value: "lastScrapedAt", label: "Last Scraped"},
                      {value: "lastSoldDeltaAt", label: "Last Sales Activity"},
                      {value: "location", label: "Location"},
                      {value: "stage", label: "Stage"},
                      {value: "createdAt", label: "Date Added"},
                      {value: "storeLink", label: "Store Name"}
                    ]}
                  />
                </Grid.Col>

                {/* Sort Direction */}
                <Grid.Col span={{base: 12, md: 6}}>
                  <Select
                    label="Sort Direction"
                    value={localFilters.sortType}
                    onChange={(value) => handleFilterChange("sortType", value)}
                    data={[
                      {value: "ASCENDING", label: "Ascending (A-Z, Low-High)"},
                      {value: "DESCENDING", label: "Descending (Z-A, High-Low)"}
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
              <Text c="dimmed">Loading stores...</Text>
            </Stack>
          </Paper>
        ) : (
          <>
            {/* Stores Grid */}
            {stores.length === 0 ? (
              <Paper shadow="sm" p="xl" radius="md">
                <Stack align="center" gap="md">
                  <Text size="lg" c="dimmed">
                    No stores found
                  </Text>
                  <Text size="sm" c="dimmed">
                    Try adjusting your filters
                  </Text>
                  <Button variant="light" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                </Stack>
              </Paper>
            ) : (
              <Grid>
                {stores.map((store) => (
                  <Grid.Col key={store._id} span={{base: 12, sm: 6, lg: 4}}>
                    <Card shadow="sm" radius="md" withBorder h="100%">
                      <Stack gap="sm">
                        {/* Store Name and Location */}
                        <Group justify="space-between" align="flex-start" wrap="nowrap">
                          <Stack gap={4} style={{flex: 1, minWidth: 0}}>
                            <Group gap="xs" wrap="nowrap" align="center">
                              <Text fw={600} size="lg" lineClamp={1} style={{flex: 1, minWidth: 0}}>
                                {store.storeLink.split("/").pop()}
                              </Text>
                              <Group gap={4} wrap="nowrap" style={{flexShrink: 0}}>
                                <HiLocationMarker size={14} style={{flexShrink: 0}} />
                                <Text size="xs" c="dimmed" lineClamp={1}>
                                  {store.location || store.locatedIn || "Unknown"}
                                </Text>
                              </Group>
                            </Group>
                            {store.location && store.locatedIn && store.location !== store.locatedIn && (
                              <Group gap={4}>
                                <Text size="xs" c="dimmed">
                                  eBay Address:
                                </Text>
                                <Text size="xs" c="dimmed" lineClamp={1}>
                                  {store.locatedIn}
                                </Text>
                              </Group>
                            )}
                          </Stack>
                          <Tooltip label="View on eBay">
                            <ActionIcon
                              component="a"
                              href={store.storeLink}
                              target="_blank"
                              variant="light"
                              size="sm"
                              style={{flexShrink: 0}}
                            >
                              <HiExternalLink />
                            </ActionIcon>
                          </Tooltip>
                        </Group>

                        {/* Stats */}
                        <Group gap="xs">
                          <Badge
                            leftSection={<HiShoppingCart size={12} />}
                            variant="light"
                            color="green"
                          >
                            {formatNumber(store.sold)} sold
                          </Badge>
                          <Badge
                            leftSection={<HiCollection size={12} />}
                            variant="light"
                            color="blue"
                          >
                            {formatNumber(store.searchAll)} items
                          </Badge>
                          {store.storeFeedback && (
                            <Badge variant="light" color="violet">
                              {store.storeFeedback} feedback
                            </Badge>
                          )}
                        </Group>

                        {/* Delta Stats */}
                        {(store.soldDelta !== null && store.soldDelta !== undefined) ||
                         (store.searchAllDelta !== null && store.searchAllDelta !== undefined) ? (
                          <Group gap="xs">
                            {store.soldDelta !== null && store.soldDelta !== undefined && (
                              <Badge
                                leftSection={store.soldDelta > 0 ? <HiTrendingUp size={12} /> : store.soldDelta < 0 ? <HiTrendingDown size={12} /> : null}
                                variant="light"
                                color={getDeltaColor(store.soldDelta)}
                              >
                                {formatDelta(store.soldDelta)} sold
                              </Badge>
                            )}
                            {store.searchAllDelta !== null && store.searchAllDelta !== undefined && (
                              <Badge
                                leftSection={store.searchAllDelta > 0 ? <HiTrendingUp size={12} /> : store.searchAllDelta < 0 ? <HiTrendingDown size={12} /> : null}
                                variant="light"
                                color={getDeltaColor(store.searchAllDelta)}
                              >
                                {formatDelta(store.searchAllDelta)} inv
                              </Badge>
                            )}
                          </Group>
                        ) : null}

                        {/* Additional Info */}
                        <Stack gap={4}>
                          <Group gap={4}>
                            <Text size="xs" c="dimmed">
                              Member since:
                            </Text>
                            <Text size="xs" fw={500}>
                              {formatDate(store.memberSince)}
                            </Text>
                          </Group>
                          {store.averageSold && (
                            <Group gap={4}>
                              <Text size="xs" c="dimmed">
                                Avg sold:
                              </Text>
                              <Text size="xs" fw={500}>
                                {store.averageSold} items/month
                              </Text>
                            </Group>
                          )}
                          {store.lastScrapedAt && (
                            <Group gap={4}>
                              <HiClock size={12} />
                              <Text size="xs" c="dimmed">
                                Last scraped:
                              </Text>
                              <Text size="xs" fw={500}>
                                {formatDate(store.lastScrapedAt)}
                              </Text>
                            </Group>
                          )}
                          {store.stage && (
                            <Group gap={4}>
                              <Text size="xs" c="dimmed">
                                Stage:
                              </Text>
                              <Badge size="xs" variant="dot">
                                {store.stage}
                              </Badge>
                            </Group>
                          )}
                          <Group gap="xs" justify="space-between">
                            <Group gap={4}>
                              <Text size="xs" c="dimmed">
                                Updated:
                              </Text>
                              <Text size="xs" fw={500}>
                                {formatDate(store.lastModify)}
                              </Text>
                            </Group>
                            <Text size="xs" c="dimmed"></Text>
                            <Group gap={4}>
                              <Text size="xs" c="dimmed">
                                Created:
                              </Text>
                              <Text size="xs" fw={500}>
                                {formatDate(store.createdAt)}
                              </Text>
                            </Group>
                          </Group>
                        </Stack>

                        {/* Notice if exists */}
                        {store.notice && (
                          <Alert variant="light" color="yellow" p="xs">
                            <Text size="xs">{store.notice}</Text>
                          </Alert>
                        )}

                        {/* Other Items Link */}
                        {store.storeOtherItems && (
                          <Anchor
                            href={store.storeOtherItems}
                            target="_blank"
                            size="xs"
                            c="blue"
                          >
                            View other items →
                          </Anchor>
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
  )
}

export default StoresList
