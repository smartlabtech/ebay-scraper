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
  MdCloudQueue
} from "react-icons/md"
import s3Service from "../../services/s3"

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
          <SimpleGrid cols={{base: 1, sm: 2, md: 5}} spacing="md">
            {/* Total Size GB */}
            <Paper p="md" radius="md" bg="cyan.0" withBorder>
              <Group gap="xs" align="flex-start">
                <ThemeIcon size="md" color="cyan" variant="light">
                  <MdStorage size={18} />
                </ThemeIcon>
                <Box style={{flex: 1}}>
                  <Text size="xs" c="dimmed" fw={600}>
                    Total Size
                  </Text>
                  <Text size="lg" fw={700} mt={4}>
                    {s3Storage.totalSizeGB?.toFixed(2)} GB
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    {s3Storage.totalSizeMB?.toFixed(2)} MB
                  </Text>
                </Box>
              </Group>
            </Paper>

            {/* File Count */}
            <Paper p="md" radius="md" bg="blue.0" withBorder>
              <Group gap="xs" align="flex-start">
                <ThemeIcon size="md" color="blue" variant="light">
                  <MdInventory size={18} />
                </ThemeIcon>
                <Box style={{flex: 1}}>
                  <Text size="xs" c="dimmed" fw={600}>
                    Files
                  </Text>
                  <Text size="lg" fw={700} mt={4}>
                    {s3Storage.fileCount?.toLocaleString()}
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    Total files
                  </Text>
                </Box>
              </Group>
            </Paper>

            {/* Monthly Cost */}
            <Paper p="md" radius="md" bg="green.0" withBorder>
              <Group gap="xs" align="flex-start">
                <ThemeIcon size="md" color="green" variant="light">
                  <MdAttachMoney size={18} />
                </ThemeIcon>
                <Box style={{flex: 1}}>
                  <Text size="xs" c="dimmed" fw={600}>
                    Est. Monthly Cost
                  </Text>
                  <Text size="lg" fw={700} mt={4}>
                    ${s3Storage.estimatedMonthlyCost?.toFixed(2)}
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    {s3Storage.currency || "USD"}
                  </Text>
                </Box>
              </Group>
            </Paper>

            {/* Folder Path */}
            <Paper p="md" radius="md" bg="violet.0" withBorder>
              <Group gap="xs" align="flex-start">
                <ThemeIcon size="md" color="violet" variant="light">
                  <MdCloudQueue size={18} />
                </ThemeIcon>
                <Box style={{flex: 1}}>
                  <Text size="xs" c="dimmed" fw={600}>
                    Folder
                  </Text>
                  <Text size="sm" fw={600} mt={4} lineClamp={1}>
                    {s3Storage.folderPath}
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    S3 path
                  </Text>
                </Box>
              </Group>
            </Paper>

            {/* Last Calculated */}
            <Paper p="md" radius="md" bg="gray.0" withBorder>
              <Group gap="xs" align="flex-start">
                <ThemeIcon size="md" color="gray" variant="light">
                  <MdSchedule size={18} />
                </ThemeIcon>
                <Box style={{flex: 1}}>
                  <Text size="xs" c="dimmed" fw={600}>
                    Last Updated
                  </Text>
                  <Text size="xs" fw={600} mt={4}>
                    {s3Storage.calculatedAt
                      ? new Date(s3Storage.calculatedAt).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          }
                        )
                      : "N/A"}
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    Calculated at
                  </Text>
                </Box>
              </Group>
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
