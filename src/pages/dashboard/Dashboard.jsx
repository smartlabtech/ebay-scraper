import {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import SiteMetaTags from "../../components/SEO/SiteMetaTags"
import SubscriptionCard from "../../components/billing/SubscriptionCard"
import {
  Title,
  Grid,
  Card,
  Text,
  Stack,
  Group,
  ThemeIcon,
  Progress,
  Box,
  Button,
  Badge,
  Paper,
  RingProgress,
  Center,
  Anchor,
  ActionIcon,
  Select,
  Modal,
  Alert,
  Divider,
  List,
  rem
} from "@mantine/core"
import {
  MdContentCopy as IconCopy,
  MdBarChart as IconChartBar,
  MdFolder as IconFolder,
  MdAdd as IconPlus,
  MdTrendingUp as IconTrendingUp,
  MdAccessTime as IconClock,
  MdArrowUpward as IconArrowUpRight,
  MdMoreHoriz as IconDots,
  MdToken as IconToken,
  MdCheck as IconCheck,
  MdInfo as IconInfo,
  MdWarning as IconWarning,
  MdCreditCard as IconCreditCard
} from "react-icons/md"
import {HiSparkles as IconSparkles, HiFire as IconFlame} from "react-icons/hi"
import {useAuth} from "../../hooks/useAuth"
import {useAnalytics} from "../../hooks/useAnalytics"
import {useSubscription} from "../../hooks/useSubscription"
import {useOrders} from "../../hooks/useOrders"
import {useDispatch} from "react-redux"
import {initiateCreditPackageOrder} from "../../store/slices/creditPackagesSlice"
import {format} from "date-fns"
import {TOKEN_COSTS, PLAN_LIMITS, SUBSCRIPTION_PLANS} from "../../types"
import {notifications} from "@mantine/notifications"
import {useMediaQuery} from "@mantine/hooks"

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user} = useAuth()
  const {overview, loadOverview} = useAnalytics()
  const {
    currentSubscription,
    planName,
    creditsRemaining,
    creditsRenewAt,
    planFeatures,
    getFeatureDisplay,
    isUnlimited,
    loading: subscriptionLoading
  } = useSubscription()

  const {
    initiateSubscriptionOrder,
    createCheckout,
    getPendingOrders
  } = useOrders()

  const isMobile = useMediaQuery('(max-width: 48em)')

  // Callback handlers for SubscriptionCard
  const handlePlanChange = (planData) => {
    console.log('Plan changed:', planData)
    // Analytics endpoints not available - refresh disabled
    // loadOverview()
  }

  const handleCreditPurchase = (creditData) => {
    console.log('Credits purchased:', creditData)
    // Analytics endpoints not available - refresh disabled
    // loadOverview()
  }
  
  // Debug log
  console.log('Subscription data:', {
    currentSubscription,
    planName,
    creditsRemaining,
    creditsRenewAt,
    planFeatures,
    loading: subscriptionLoading,
    maxProjects: planFeatures?.maxProjects,
    maxBrandMessages: planFeatures?.maxBrandMessages,
    maxProductVersions: planFeatures?.maxProductVersions
  })

  // Format renewal date
  const formatRenewalDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return format(date, 'MMM dd, yyyy')
  }

  useEffect(() => {
    // Analytics endpoints not available - commented out
    // loadOverview()
  }, []) // Initial load only

  const stats = overview
    ? {
        totalProjects: overview.totalProjects || 0,
        totalMessages: overview.totalMessages || 0,
        totalCopies: overview.totalCopies || 0,
        engagementRate: overview.avgEngagementRate || 0,
        projectsGrowth: overview.growth?.projects || 0,
        messagesGrowth: overview.growth?.messages || 0,
        copiesGrowth: overview.growth?.copies || 0,
        engagementGrowth: overview.growth?.engagement || 0
      }
    : {
        totalProjects: 0,
        totalMessages: 0,
        totalCopies: 0,
        engagementRate: 0,
        projectsGrowth: 0,
        messagesGrowth: 0,
        copiesGrowth: 0,
        engagementGrowth: 0
      }

  // Remove recent activity since we don't load individual items
  const recentActivity = []

  const quickActions = [
    {
      title: "Create Project",
      description: "Start a new brand project",
      icon: IconFolder,
      color: "violet",
      href: "/projects",
      count: stats.totalProjects,
      label: "Projects",
      limit: getFeatureDisplay('maxProjects'),
      unlimited: isUnlimited('maxProjects')
    },
    {
      title: "Generate Message",
      description: "Create AI-powered content",
      icon: IconSparkles,
      color: "blue",
      href: "/brand-messages",
      count: stats.totalMessages,
      label: "Messages",
      limit: getFeatureDisplay('maxBrandMessages'),
      unlimited: isUnlimited('maxBrandMessages')
    },
    {
      title: "Create Copy",
      description: "Platform-specific content",
      icon: IconCopy,
      color: "green",
      href: "/copies",
      count: stats.totalCopies,
      label: "Copies",
      limit: getFeatureDisplay('maxBrandMessages'),
      unlimited: isUnlimited('maxBrandMessages')
    }
  ]

  // Top projects removed - not needed for dashboard overview

  return (
    <>
      <SiteMetaTags
        title="Dashboard"
        description="Manage your brand content, analytics, and AI-powered tools"
        noIndex={true}
      />
      <Stack gap="xl">
      {/* Subscription Card */}
      <SubscriptionCard
        variant="dashboard"
        onPlanChange={handlePlanChange}
        onCreditPurchase={handleCreditPurchase}
      />


      {/* Quick Actions */}
      <Box>
        <Group justify="space-between" align="center" mb="md">
          <Title order={3}>Quick Actions</Title>
          <Badge variant="light" color="gray" size="sm">
            {stats.totalProjects + stats.totalMessages + stats.totalCopies} total items
          </Badge>
        </Group>
        <Grid gutter={{base: "sm", sm: "md", lg: "lg"}}>
          {quickActions.map((action) => (
            <Grid.Col
              key={action.title}
              span={{base: 12, xs: 6, sm: 6, md: 4, lg: 4}}
            >
              <Card
                component={Link}
                to={action.href}
                shadow="sm"
                p={{base: "md", sm: "lg"}}
                radius="lg"
                withBorder
                h="100%"
                style={{
                  borderColor: "transparent",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden"
                }}
                sx={(theme) => ({
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: theme.colors[action.color][3],
                    boxShadow: `0 20px 40px -15px ${
                      theme.colors[action.color][2]
                    }40`,
                    "&::before": {
                      opacity: 1
                    }
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${
                      theme.colors[action.color][0]
                    }50 0%, transparent 100%)`,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none"
                  }
                })}
              >
                <Stack gap="md" style={{position: "relative", zIndex: 1}}>
                  <Group justify="space-between" align="flex-start">
                    <ThemeIcon
                      color={action.color}
                      size="xl"
                      radius="xl"
                      variant="light"
                      style={{
                        background: `linear-gradient(135deg, ${
                          action.color === "violet"
                            ? "#7c3aed"
                            : action.color === "blue"
                            ? "#3b82f6"
                            : "#10b981"
                        }20, transparent)`
                      }}
                    >
                      <action.icon size={24} />
                    </ThemeIcon>
                    <Box ta="right">
                      <Text size="xl" fw={700} style={{lineHeight: 1}}>
                        {action.count}
                        {!subscriptionLoading && currentSubscription && (
                          <Text component="span" size="sm" c="dimmed" fw={400}>
                            /{action.limit}
                          </Text>
                        )}
                      </Text>
                      <Text size="xs" c="dimmed" mt={2}>
                        {action.label}
                      </Text>
                    </Box>
                  </Group>

                  <Box>
                    <Text fw={600} size="md" mb={4}>
                      {action.title}
                    </Text>
                    <Text size="sm" c="dimmed" style={{lineHeight: 1.4}}>
                      {action.description}
                    </Text>
                  </Box>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Box>
    </Stack>
    </>
  )
}

function formatDistanceToNow(date) {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return "Just now"
}

export default Dashboard
