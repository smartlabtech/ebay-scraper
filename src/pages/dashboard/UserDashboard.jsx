import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
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
  SimpleGrid,
  Loader
} from "@mantine/core"
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
  MdNotifications,
  MdStorage,
  MdCloudQueue,
  MdSearch,
  MdDescription,
  MdPlaylistAddCheck,
  MdHourglassEmpty,
  MdAutorenew
} from "react-icons/md"
import s3Service from "../../services/s3"
import analyticsService from "../../services/analytics"

const UserDashboard = () => {
  const navigate = useNavigate()

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
    lastSyncTime: "5 minutes ago"
  })

  const [recentActivity] = useState([
    {
      id: 1,
      type: "sync",
      status: "success",
      message: "Electronics Hub synced successfully",
      time: "2 minutes ago",
      icon: MdCheckCircle,
      color: "green"
    },
    {
      id: 2,
      type: "sale",
      status: "success",
      message: "New sale: $45.99 from Fashion Store",
      time: "15 minutes ago",
      icon: MdAttachMoney,
      color: "blue"
    },
    {
      id: 3,
      type: "sync",
      status: "warning",
      message: "Sports Equipment sync delayed",
      time: "1 hour ago",
      icon: MdWarning,
      color: "yellow"
    },
    {
      id: 4,
      type: "update",
      status: "success",
      message: "23 new items added to Home & Garden",
      time: "3 hours ago",
      icon: MdInventory,
      color: "violet"
    }
  ])

  const [performanceData] = useState({
    daily: [
      {day: "Mon", sales: 234},
      {day: "Tue", sales: 345},
      {day: "Wed", sales: 456},
      {day: "Thu", sales: 367},
      {day: "Fri", sales: 478},
      {day: "Sat", sales: 589},
      {day: "Sun", sales: 423}
    ]
  })

  const [s3Storage, setS3Storage] = useState(null)
  const [s3Loading, setS3Loading] = useState(true)

  const [analytics, setAnalytics] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  // Fetch S3 storage information
  useEffect(() => {
    const fetchS3Storage = async () => {
      try {
        setS3Loading(true)
        const data = await s3Service.getFolderSize("web-scraper/")
        setS3Storage(data)
      } catch (error) {
        console.error("Failed to fetch S3 storage info:", error)
        setS3Storage(null)
      } finally {
        setS3Loading(false)
      }
    }

    fetchS3Storage()
  }, [])

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setAnalyticsLoading(true)
        const data = await analyticsService.getAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
        setAnalytics(null)
      } finally {
        setAnalyticsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const StatCard = ({title, value, icon: Icon, color, subtitle, trend}) => (
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
            <Text size="xs" c={trend > 0 ? "green" : "red"} fw={600}>
              {Math.abs(trend)}%
            </Text>
          </Group>
        )}
      </Group>
    </Card>
  )

  return (
    <Stack gap="xl">
      {/* Analytics Information */}
      <Card shadow="sm" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <ThemeIcon size="md" color="indigo" variant="light">
              <MdTrendingUp size={20} />
            </ThemeIcon>
            <Title order={4}>Scraper Analytics</Title>
          </Group>
          {analyticsLoading && <Loader size="sm" />}
        </Group>

        {analytics ? (
          <Stack gap="lg">
            {/* Row 1: Created (Need to generate manifest) */}
            <Box>
              <Group gap="xs" mb="md">
                <ThemeIcon size="md" color="blue" variant="light">
                  <MdPlaylistAddCheck size={20} />
                </ThemeIcon>
                <Box>
                  <Text size="sm" fw={700}>
                    Created (Need to generate manifest)
                  </Text>
                  <Text size="xs" c="dimmed">
                    Items ready for manifest generation
                  </Text>
                </Box>
              </Group>
              <SimpleGrid cols={4} spacing="xs">
                {/* Keywords - CREATED */}
                <Paper p="sm" radius="md" bg="blue.0" withBorder>
                  <Stack gap={4} align="center">
                    <ThemeIcon size="sm" color="blue" variant="light">
                      <MdSearch size={16} />
                    </ThemeIcon>
                    <Box style={{textAlign: "center"}}>
                      <Text size="xs" c="dimmed" fw={600}>
                        Keywords
                      </Text>
                      <Text size="md" fw={700} mt={2}>
                        {(
                          analytics.ebayModules.keywords.find(
                            (s) => s.status === "CREATED"
                          )?.count || 0
                        ).toLocaleString()}
                      </Text>
                    </Box>
                  </Stack>
                </Paper>

                {/* Keyword Pages - CREATED */}
                <Paper p="sm" radius="md" bg="violet.0" withBorder>
                  <Stack gap={4} align="center">
                    <ThemeIcon size="sm" color="violet" variant="light">
                      <MdDescription size={16} />
                    </ThemeIcon>
                    <Box style={{textAlign: "center"}}>
                      <Text size="xs" c="dimmed" fw={600}>
                        Pages
                      </Text>
                      <Text size="md" fw={700} mt={2}>
                        {(
                          analytics.ebayModules.keywordPages.find(
                            (s) => s.status === "CREATED"
                          )?.count || 0
                        ).toLocaleString()}
                      </Text>
                    </Box>
                  </Stack>
                </Paper>

                {/* Items - CREATED */}
                <Paper p="sm" radius="md" bg="green.0" withBorder>
                  <Stack gap={4} align="center">
                    <ThemeIcon size="sm" color="green" variant="light">
                      <MdInventory size={16} />
                    </ThemeIcon>
                    <Box style={{textAlign: "center"}}>
                      <Text size="xs" c="dimmed" fw={600}>
                        Items
                      </Text>
                      <Text size="md" fw={700} mt={2}>
                        {(
                          analytics.ebayModules.items.find(
                            (s) => s.status === "CREATED"
                          )?.count || 0
                        ).toLocaleString()}
                      </Text>
                    </Box>
                  </Stack>
                </Paper>

                {/* Stores - CREATED */}
                <Paper p="sm" radius="md" bg="orange.0" withBorder>
                  <Stack gap={4} align="center">
                    <ThemeIcon size="sm" color="orange" variant="light">
                      <MdStore size={16} />
                    </ThemeIcon>
                    <Box style={{textAlign: "center"}}>
                      <Text size="xs" c="dimmed" fw={600}>
                        Stores
                      </Text>
                      <Text size="md" fw={700} mt={2}>
                        {(
                          analytics.ebayModules.stores.find(
                            (s) => s.status === "CREATED"
                          )?.count || 0
                        ).toLocaleString()}
                      </Text>
                    </Box>
                  </Stack>
                </Paper>
              </SimpleGrid>
            </Box>

            {/* Row 2: Manifest PENDING */}
            <Box>
              <Group gap="xs" mb="md">
                <ThemeIcon size="md" color="yellow" variant="light">
                  <MdHourglassEmpty size={20} />
                </ThemeIcon>
                <Box>
                  <Text size="sm" fw={700}>
                    Manifest Queue - PENDING
                  </Text>
                  <Text size="xs" c="dimmed">
                    Manifests waiting to be processed
                  </Text>
                </Box>
              </Group>
              <SimpleGrid cols={4} spacing="xs">
                {analytics.manifestModule.manifests
                  .find((m) => m.status === "PENDING")
                  ?.types.map((type, idx) => (
                    <Paper
                      key={idx}
                      p="sm"
                      radius="md"
                      bg="yellow.0"
                      withBorder
                    >
                      <Stack gap={4} align="center">
                        <ThemeIcon size="sm" color="yellow" variant="light">
                          {type.type === "keyword" && <MdSearch size={16} />}
                          {type.type === "keywordPage" && (
                            <MdDescription size={16} />
                          )}
                          {type.type === "item" && <MdInventory size={16} />}
                          {type.type === "store" && <MdStore size={16} />}
                        </ThemeIcon>
                        <Box style={{textAlign: "center"}}>
                          <Text size="xs" c="dimmed" fw={600} tt="capitalize">
                            {type.type === "keywordPage" ? "Pages" : type.type}
                          </Text>
                          <Text size="md" fw={700} mt={2}>
                            {type.count.toLocaleString()}
                          </Text>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
              </SimpleGrid>
            </Box>

            {/* Row 3: Manifest PROCESSING */}
            <Box>
              <Group gap="xs" mb="md">
                <ThemeIcon size="md" color="teal" variant="light">
                  <MdAutorenew size={20} />
                </ThemeIcon>
                <Box>
                  <Text size="sm" fw={700}>
                    Manifest Queue - PROCESSING
                  </Text>
                  <Text size="xs" c="dimmed">
                    Manifests currently being processed
                  </Text>
                </Box>
              </Group>
              <SimpleGrid cols={4} spacing="xs">
                {analytics.manifestModule.manifests
                  .find((m) => m.status === "PROCESSING")
                  ?.types.map((type, idx) => (
                    <Paper key={idx} p="sm" radius="md" bg="teal.0" withBorder>
                      <Stack gap={4} align="center">
                        <ThemeIcon size="sm" color="teal" variant="light">
                          {type.type === "keyword" && <MdSearch size={16} />}
                          {type.type === "keywordPage" && (
                            <MdDescription size={16} />
                          )}
                          {type.type === "item" && <MdInventory size={16} />}
                          {type.type === "store" && <MdStore size={16} />}
                        </ThemeIcon>
                        <Box style={{textAlign: "center"}}>
                          <Text size="xs" c="dimmed" fw={600} tt="capitalize">
                            {type.type === "keywordPage" ? "Pages" : type.type}
                          </Text>
                          <Text size="md" fw={700} mt={2}>
                            {type.count.toLocaleString()}
                          </Text>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
              </SimpleGrid>
            </Box>

            {/* Row 4: TO Scrap (waiting webscraper) */}
            <Box>
              <Group gap="xs" mb="md">
                <ThemeIcon size="md" color="indigo" variant="light">
                  <MdSync size={20} />
                </ThemeIcon>
                <Box>
                  <Text size="sm" fw={700}>
                    TO Scrap (waiting webscraper to change our status to
                    SCRAPED)
                  </Text>
                  <Text size="xs" c="dimmed">
                    Items queued for web scraping
                  </Text>
                </Box>
              </Group>
              <SimpleGrid cols={4} spacing="xs">
                {/* Keywords - TOSCRAP */}
                <Paper p="sm" radius="md" bg="blue.0" withBorder>
                  <Stack gap={4} align="center">
                    <ThemeIcon size="sm" color="blue" variant="light">
                      <MdSearch size={16} />
                    </ThemeIcon>
                    <Box style={{textAlign: "center"}}>
                      <Text size="xs" c="dimmed" fw={600}>
                        Keywords
                      </Text>
                      <Text size="md" fw={700} mt={2}>
                        {(
                          analytics.ebayModules.keywords.find(
                            (s) => s.status === "TOSCRAP"
                          )?.count || 0
                        ).toLocaleString()}
                      </Text>
                    </Box>
                  </Stack>
                </Paper>

                {/* Keyword Pages - TOSCRAP */}
                <Paper p="sm" radius="md" bg="violet.0" withBorder>
                  <Stack gap={4} align="center">
                    <ThemeIcon size="sm" color="violet" variant="light">
                      <MdDescription size={16} />
                    </ThemeIcon>
                    <Box style={{textAlign: "center"}}>
                      <Text size="xs" c="dimmed" fw={600}>
                        Pages
                      </Text>
                      <Text size="md" fw={700} mt={2}>
                        {(
                          analytics.ebayModules.keywordPages.find(
                            (s) => s.status === "TOSCRAP"
                          )?.count || 0
                        ).toLocaleString()}
                      </Text>
                    </Box>
                  </Stack>
                </Paper>

                {/* Items - TOSCRAP */}
                <Paper p="sm" radius="md" bg="green.0" withBorder>
                  <Stack gap={4} align="center">
                    <ThemeIcon size="sm" color="green" variant="light">
                      <MdInventory size={16} />
                    </ThemeIcon>
                    <Box style={{textAlign: "center"}}>
                      <Text size="xs" c="dimmed" fw={600}>
                        Items
                      </Text>
                      <Text size="md" fw={700} mt={2}>
                        {(
                          analytics.ebayModules.items.find(
                            (s) => s.status === "TOSCRAP"
                          )?.count || 0
                        ).toLocaleString()}
                      </Text>
                    </Box>
                  </Stack>
                </Paper>

                {/* Stores - TOSCRAP */}
                <Paper p="sm" radius="md" bg="orange.0" withBorder>
                  <Stack gap={4} align="center">
                    <ThemeIcon size="sm" color="orange" variant="light">
                      <MdStore size={16} />
                    </ThemeIcon>
                    <Box style={{textAlign: "center"}}>
                      <Text size="xs" c="dimmed" fw={600}>
                        Stores
                      </Text>
                      <Text size="md" fw={700} mt={2}>
                        {(
                          analytics.ebayModules.stores.find(
                            (s) => s.status === "TOSCRAP"
                          )?.count || 0
                        ).toLocaleString()}
                      </Text>
                    </Box>
                  </Stack>
                </Paper>
              </SimpleGrid>
            </Box>
          </Stack>
        ) : (
          !analyticsLoading && (
            <Paper p="md" radius="md" bg="red.0" withBorder>
              <Group gap="xs">
                <ThemeIcon size="md" color="red" variant="light">
                  <MdWarning size={18} />
                </ThemeIcon>
                <Box>
                  <Text size="sm" fw={600}>
                    Unable to fetch analytics data
                  </Text>
                  <Text size="xs" c="dimmed">
                    Please check your connection or try again later
                  </Text>
                </Box>
              </Group>
            </Paper>
          )
        )}
      </Card>

      {/* S3 Storage Information */}
      <Card shadow="sm" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <ThemeIcon size="md" color="cyan" variant="light">
              <MdCloudQueue size={20} />
            </ThemeIcon>
            <Title order={4}>S3 Storage (Web Scraper)</Title>
          </Group>
          {s3Loading && <Loader size="sm" />}
        </Group>

        {s3Storage ? (
          <SimpleGrid cols={3} spacing="xs">
            {/* Total Size GB */}
            <Paper p="sm" radius="md" bg="cyan.0" withBorder>
              <Stack gap={4} align="center">
                <ThemeIcon size="sm" color="cyan" variant="light">
                  <MdStorage size={16} />
                </ThemeIcon>
                <Box style={{textAlign: "center"}}>
                  <Text size="xs" c="dimmed" fw={600}>
                    Total Size
                  </Text>
                  <Text size="md" fw={700} mt={2}>
                    {s3Storage.totalSizeGB?.toFixed(2)} GB
                  </Text>
                </Box>
              </Stack>
            </Paper>

            {/* File Count */}
            <Paper p="sm" radius="md" bg="blue.0" withBorder>
              <Stack gap={4} align="center">
                <ThemeIcon size="sm" color="blue" variant="light">
                  <MdInventory size={16} />
                </ThemeIcon>
                <Box style={{textAlign: "center"}}>
                  <Text size="xs" c="dimmed" fw={600}>
                    Files
                  </Text>
                  <Text size="md" fw={700} mt={2}>
                    {s3Storage.fileCount?.toLocaleString()}
                  </Text>
                </Box>
              </Stack>
            </Paper>

            {/* Monthly Cost */}
            <Paper p="sm" radius="md" bg="green.0" withBorder>
              <Stack gap={4} align="center">
                <ThemeIcon size="sm" color="green" variant="light">
                  <MdAttachMoney size={16} />
                </ThemeIcon>
                <Box style={{textAlign: "center"}}>
                  <Text size="xs" c="dimmed" fw={600}>
                    Est. Cost
                  </Text>
                  <Text size="md" fw={700} mt={2}>
                    ${s3Storage.estimatedMonthlyCost?.toFixed(2)}
                  </Text>
                </Box>
              </Stack>
            </Paper>
          </SimpleGrid>
        ) : (
          !s3Loading && (
            <Paper p="md" radius="md" bg="red.0" withBorder>
              <Group gap="xs">
                <ThemeIcon size="md" color="red" variant="light">
                  <MdWarning size={18} />
                </ThemeIcon>
                <Box>
                  <Text size="sm" fw={600}>
                    Unable to fetch S3 storage information
                  </Text>
                  <Text size="xs" c="dimmed">
                    Please check your connection or try again later
                  </Text>
                </Box>
              </Group>
            </Paper>
          )
        )}
      </Card>
      {/* Page Header */}
      {/* <Box>
        <Title order={2} mb={4}>
          Control Panel Overview
        </Title>
        <Text c="dimmed" size="sm">
          Welcome back! Here's what's happening with your stores today.
        </Text>
      </Box> */}

      {/* Quick Stats Grid */}
      {/* <Grid>
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
            color={stats.failedSyncs > 0 ? "orange" : "teal"}
            subtitle={`${stats.pendingSyncs} pending`}
          />
        </Grid.Col>
      </Grid> */}

      {/* Main Content Grid */}
      {/* <Grid>
        <Grid.Col span={{base: 12, md: 8}}>
          <Card shadow="sm" radius="md" withBorder>
            <Title order={4} mb="md">
              Performance Overview
            </Title>

            <Stack gap="md">
              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>
                    Monthly Revenue Goal
                  </Text>
                  <Text size="sm" c="dimmed">
                    $3,457 / $5,000
                  </Text>
                </Group>
                <Progress value={69} size="lg" radius="md" color="blue" />
                <Text size="xs" c="dimmed" mt="xs">
                  69% of monthly target achieved
                </Text>
              </Box>

              <SimpleGrid cols={2} spacing="md">
                <Paper p="md" radius="md" withBorder>
                  <Group>
                    <RingProgress
                      size={60}
                      thickness={6}
                      sections={[
                        {value: 60, color: "green"},
                        {value: 20, color: "yellow"},
                        {value: 20, color: "gray"}
                      ]}
                    />
                    <Box>
                      <Text size="sm" fw={600}>
                        Store Health
                      </Text>
                      <Text size="xs" c="dimmed">
                        3 active, 1 paused, 1 inactive
                      </Text>
                    </Box>
                  </Group>
                </Paper>

                <Paper p="md" radius="md" withBorder>
                  <Group>
                    <RingProgress
                      size={60}
                      thickness={6}
                      sections={[
                        {value: stats.weeklyGrowth * 4, color: "teal"}
                      ]}
                      label={
                        <Text size="xs" ta="center" fw={700}>
                          {stats.weeklyGrowth}%
                        </Text>
                      }
                    />
                    <Box>
                      <Text size="sm" fw={600}>
                        Weekly Growth
                      </Text>
                      <Text size="xs" c="dimmed">
                        vs last week
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              </SimpleGrid>

              <Group mt="md">
                <Button
                  variant="light"
                  leftSection={<MdStore size={16} />}
                  onClick={() => navigate("/control/stores")}
                >
                  Manage Stores
                </Button>
                <Button
                  variant="light"
                  color="violet"
                  leftSection={<MdSync size={16} />}
                  onClick={() => navigate("/control/stores")}
                >
                  Sync All Stores
                </Button>
                <Button
                  variant="light"
                  color="teal"
                  leftSection={<MdTrendingUp size={16} />}
                  onClick={() => navigate("/control/stores/analytics")}
                >
                  View Analytics
                </Button>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{base: 12, md: 4}}>
          <Card shadow="sm" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Recent Activity</Title>
              <Badge variant="light" color="blue" size="sm">
                Live
              </Badge>
            </Group>

            <Timeline bulletSize={24} lineWidth={2}>
              {recentActivity.map((activity) => (
                <Timeline.Item
                  key={activity.id}
                  bullet={
                    <ThemeIcon
                      size={24}
                      variant="light"
                      color={activity.color}
                      radius="xl"
                    >
                      <activity.icon size={12} />
                    </ThemeIcon>
                  }
                >
                  <Text size="sm" fw={500}>
                    {activity.message}
                  </Text>
                  <Text size="xs" c="dimmed" mt={4}>
                    {activity.time}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline>

            <Button
              fullWidth
              variant="subtle"
              mt="md"
              onClick={() => navigate("/control/activity")}
            >
              View All Activity
            </Button>
          </Card>
        </Grid.Col>
      </Grid> */}

      {/* System Status */}
      {/* <Card shadow="sm" radius="md" withBorder>
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
      </Card> */}
    </Stack>
  )
}

export default UserDashboard
