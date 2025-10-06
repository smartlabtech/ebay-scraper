import {useState, useEffect} from "react"
import {Link} from "react-router-dom"
import SiteMetaTags from "../../components/SEO/SiteMetaTags"
import SubscriptionCard from "../../components/billing/SubscriptionCard"
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Button,
  Badge,
  Table,
  Progress,
  Alert,
  SimpleGrid,
  ThemeIcon,
  Box,
  Divider,
  Tabs,
  ActionIcon,
  Modal,
  NumberInput,
  Select,
  Grid,
  ScrollArea,
  List,
  rem,
  SegmentedControl,
  Skeleton,
  Tooltip,
  Drawer,
  Notification
} from "@mantine/core"
import {notifications} from "@mantine/notifications"
import {useMediaQuery} from "@mantine/hooks"
import {DatePickerInput} from "@mantine/dates"
import {
  MdCreditCard as IconCreditCard,
  MdHistory as IconHistory,
  MdUpgrade as IconUpgrade,
  MdWarning as IconWarning,
  MdCheck as IconCheck,
  MdDownload as IconDownload,
  MdCancel as IconCancel,
  MdToken as IconToken,
  MdTrendingUp as IconTrendingUp,
  MdInfo as IconInfo,
  MdCalendarToday as IconCalendar,
  MdAutoAwesome
} from "react-icons/md"
import {useAuth} from "../../hooks/useAuth"
import {useSubscription} from "../../hooks/useSubscription"
import {usePlans} from "../../hooks/usePlans"
import {useOrders} from "../../hooks/useOrders"
import {useInvoices} from "../../hooks/useInvoices"
import {useCreditUsage} from "../../hooks/useCreditUsage"
import {useDispatch} from "react-redux"
import {
  changeSubscriptionPlan
} from "../../store/slices/subscriptionSlice"
import {initiateCreditPackageOrder} from "../../store/slices/creditPackagesSlice"
import {
  TOKEN_COSTS,
  SUBSCRIPTION_PLAN_DETAILS,
  PLAN_LIMITS,
  CREDIT_CONFIG
} from "../../types"
import {format} from "date-fns"

const Billing = () => {
  const {user} = useAuth()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [cancellingOrderId, setCancellingOrderId] = useState(null)
  const [retryingOrderId, setRetryingOrderId] = useState(null)
  const [creatingCheckoutId, setCreatingCheckoutId] = useState(null)
  const isMobile = useMediaQuery("(max-width: 48em)")
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)
  const [customDateRange, setCustomDateRange] = useState([null, null])
  const [showUsageDetailsModal, setShowUsageDetailsModal] = useState(false)
  const [selectedModuleData, setSelectedModuleData] = useState(null)
  const [showPendingOrdersDrawer, setShowPendingOrdersDrawer] = useState(false)

  // Get real subscription and plans data
  const {
    currentSubscription,
    planName,
    creditsRemaining,
    planFeatures,
    loading: subscriptionLoading,
    refreshSubscription
  } = useSubscription()

  const {
    plans,
    loading: plansLoading,
    getPlanFeatures,
    getCreditPackagesForPlan
  } = usePlans()

  // Get credit usage data
  const {
    usageData,
    loading: usageLoading,
    error: usageError,
    dateRange,
    totalCreditsUsed,
    usageByModule,
    setLast30Days,
    setLast7Days,
    setCurrentMonth,
    setPreviousMonth,
    setCustomRange,
    formatModuleName,
    getModuleColor
  } = useCreditUsage()

  // Get invoices data
  const {
    invoices,
    loading: invoicesLoading,
    downloading,
    downloadInvoice
  } = useInvoices()

  // Get orders data
  const {
    pendingOrders,
    currentOrder,
    loading: ordersLoading,
    error: ordersError,
    hasPendingOrders,
    isInitiatingOrder,
    ordersExpiringSoon,
    expiredOrders,
    initiateSubscriptionOrder,
    getPendingOrders,
    cancelPendingOrder,
    retryOrderPayment,
    createCheckout,
    getTimeRemaining,
    isOrderExpired,
    isOrderExpiringSoon,
    clearErrors,
    removeOrder
  } = useOrders()

  // Fetch pending orders when component mounts
  useEffect(() => {
    getPendingOrders().catch(console.error)
  }, []) // Empty dependency array to run only once on mount

  // Check for free plan activations and refresh subscription
  useEffect(() => {
    const freePlanOrders = pendingOrders.filter(
      order => !order.orderId && order.paymentRequired === false && order.subscriptionId
    );

    if (freePlanOrders.length > 0) {
      // Free plan was activated, refresh subscription data
      console.log('Free plan detected, refreshing subscription data');
      refreshSubscription();

      // Show success notification
      freePlanOrders.forEach(order => {
        notifications.show({
          title: "Plan Activated Successfully",
          message: `Your ${order.plan?.name || 'Free'} plan has been activated! No payment required.`,
          color: "green",
          icon: <IconCheck />
        });
      });

      // Remove free plan "orders" from pending orders after showing notification
      setTimeout(() => {
        freePlanOrders.forEach(order => {
          if (order.subscriptionId) {
            removeOrder(order.subscriptionId); // Use subscriptionId as identifier for free plans
          }
        });
      }, 2000);
    }
  }, [pendingOrders]) // Run when pendingOrders changes

  // Get credit monitoring dates from user data
  const lastRechargeDate = currentSubscription?.userId?.lastRechargeDate
    ? new Date(currentSubscription.userId.lastRechargeDate)
    : new Date()
  const creditExpiryDate = currentSubscription?.userId?.creditExpiryDate
    ? new Date(currentSubscription.userId.creditExpiryDate)
    : new Date()
  const currentDate = new Date()

  // Calculate credits usage from subscription data
  const totalCredits =
    currentSubscription?.planId?.credits || 0
  const availableCredits = creditsRemaining || 0

  // Note: monthlyUsagePercentage removed - not applicable for credit-based system

  // For display purposes in the progress bar text
  const creditsUsedFromMonthlyAllocation =
    availableCredits > totalCredits ? 0 : totalCredits - availableCredits

  // For display purposes, show actual credits used in the period (from API)
  const creditsUsedInPeriod =
    totalCreditsUsed || creditsUsedFromMonthlyAllocation

  // Calculate days progress for credits validity period
  const totalDays = (creditExpiryDate - lastRechargeDate) / (1000 * 60 * 60 * 24)
  const daysElapsed = (currentDate - lastRechargeDate) / (1000 * 60 * 60 * 24)
  const periodProgress = (daysElapsed / totalDays) * 100

  // Get payment status from subscription
  const paymentStatus =
    currentSubscription?.status === "active"
      ? "paid"
      : currentSubscription?.status === "past_due"
      ? "overdue"
      : "pending"

  // Invoice status badge colors
  const getInvoiceStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "green"
      case "pending":
        return "blue"
      case "draft":
        return "gray"
      case "overdue":
        return "red"
      case "void":
        return "dark"
      default:
        return "gray"
    }
  }


  const handleCreateCheckout = async (order) => {
    // Safety check for free plans or invalid orders
    if (!order.orderId) {
      notifications.show({
        title: "Invalid Order",
        message: "This order cannot be processed. It may be a free plan that doesn't require payment.",
        color: "yellow",
        icon: <IconInfo />
      });
      return;
    }

    setCreatingCheckoutId(order.orderId)
    try {
      const result = await createCheckout(order.orderId)

      notifications.show({
        title: "Checkout Created",
        message:
          "Payment checkout has been created. Redirecting to payment page...",
        color: "green",
        icon: <IconCheck />
      })

      // Refresh orders to show updated payment details
      await getPendingOrders()

      // Open payment URL in new tab if available
      if (result.paymentUrl) {
        setTimeout(() => {
          window.open(result.paymentUrl, "_blank")
        }, 500) // Small delay to ensure UI updates first
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error.message || "Failed to create checkout. Please try again.",
        color: "red",
        icon: <IconWarning />
      })
    } finally {
      setCreatingCheckoutId(null)
    }
  }


  // Get credit packages from current subscription only (no separate API call)
  const displayPackages =
    currentSubscription?.creditPackages?.filter((pkg) => pkg.isActive) || []

  // Check if credits are near expiration or expired
  const daysRemaining = Math.ceil((creditExpiryDate - currentDate) / (1000 * 60 * 60 * 24))
  const isNearExpiration =
    daysRemaining <= 7 &&
    daysRemaining > 0 &&
    currentSubscription?.hasSubscription !== false
  const isOverdue =
    daysRemaining <= 0 && currentSubscription?.hasSubscription !== false

  // Filter out free plan "orders" that don't have orderId (they're already activated)
  const displayablePendingOrders = pendingOrders.filter(
    order => order.orderId && order.paymentRequired !== false
  );
  const hasDisplayablePendingOrders = displayablePendingOrders.length > 0;

  return (
    <>
      <SiteMetaTags
        title="Billing & Subscription"
        description="Manage your BrandBanda subscription, credits, and payment methods"
        keywords="billing, subscription, credits, payment, pricing plans"
        canonicalUrl="https://www.brandbanda.com/settings/billing"
      />
      <Stack gap="xl">
      {/* Fixed notification for subscription expiration warning */}
      {(isNearExpiration || isOverdue) && (
        <Alert
          color={isOverdue ? "red" : "yellow"}
          variant="light"
          icon={<IconWarning size={20} />}
          styles={{
            root: {
              position: "sticky",
              top: 100, // Position below the header (header height is 100px)
              zIndex: 50,
              backgroundColor: isOverdue
                ? "rgba(255, 59, 48, 0.05)"
                : "rgba(255, 193, 7, 0.05)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${
                isOverdue
                  ? "var(--mantine-color-red-2)"
                  : "var(--mantine-color-yellow-2)"
              }`
            }
          }}
          withCloseButton={false}
        >
          <Group justify="space-between" align="center">
            <Box>
              <Text fw={600} size="sm">
                {isOverdue
                  ? `Your credits have expired`
                  : `Your credits are expiring in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                Purchase new credits or pay any invoice to reset the expiry timer.
              </Text>
            </Box>
            {displayPackages.length > 0 && (
              <Button
                size="xs"
                variant="filled"
                color={isOverdue ? "red" : "yellow"}
                onClick={() => {
                  // This would need to trigger the SubscriptionCard's drawer
                  // For now, just scroll to the subscription card
                  document.querySelector('[data-subscription-card]')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Buy Credits Now
              </Button>
            )}
          </Group>
        </Alert>
      )}

      {/* <Box>
          <Title order={2}>Billing & Subscription</Title>
          <Text c="dimmed" mt="xs">
            Manage your subscription, credits, and billing information
          </Text>
        </Box> */}

      {/* Duplicate Credit Expiry Alert removed - already shown in warning banner above */}

      {/* Credit Usage Alert removed - monthlyUsagePercentage not applicable for credit-based system */}

      {/* Pending Orders Notification */}
      {hasDisplayablePendingOrders && (
        <Notification
          color="orange"
          icon={<IconWarning />}
          withCloseButton={false}
          styles={{
            root: {
              position: "sticky",
              top: isNearExpiration || isOverdue ? 180 : 100, // Position below subscription warning if it exists with less gap
              zIndex: 49,
              backgroundColor: "rgba(255, 152, 0, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--mantine-color-orange-2)",
              cursor: "pointer"
            }
          }}
          onClick={() => setShowPendingOrdersDrawer(true)}
        >
          <Group justify="space-between" align="center">
            <Box>
              <Text fw={600} size="sm">
                You have {displayablePendingOrders.length} pending order
                {displayablePendingOrders.length > 1 ? "s" : ""}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                Click to view and manage your pending orders
              </Text>
            </Box>
            <Badge color="orange" variant="light">
              {displayablePendingOrders.length} pending
            </Badge>
          </Group>
        </Notification>
      )}

      {/* Pending Orders Drawer */}
      <Drawer
        opened={showPendingOrdersDrawer}
        onClose={() => setShowPendingOrdersDrawer(false)}
        title={
          <Group justify="space-between">
            <Title order={4}>Pending Orders</Title>
            <Badge color="orange" variant="light">
              {displayablePendingOrders.length} pending
            </Badge>
          </Group>
        }
        position="right"
        size="xl"
        padding="lg"
      >
        <Stack>
          {ordersExpiringSoon.filter((order) => order.orderId && order.paymentIntentId).length >
            0 && (
            <Alert
              icon={<IconWarning />}
              title="Orders Expiring Soon"
              color="orange"
              variant="light"
            >
              You have{" "}
              {
                ordersExpiringSoon.filter((order) => order.orderId && order.paymentIntentId)
                  .length
              }{" "}
              order(s) expiring within the next hour. Complete payment soon to
              avoid cancellation.
            </Alert>
          )}

          {expiredOrders.filter((order) => order.orderId && order.paymentIntentId).length >
            0 && (
            <Alert
              icon={<IconCancel />}
              title="Expired Orders"
              color="red"
              variant="light"
            >
              You have{" "}
              {expiredOrders.filter((order) => order.orderId && order.paymentIntentId).length}{" "}
              expired order(s). These orders have been automatically cancelled.
            </Alert>
          )}

          <Stack gap="md">
            {/* Show free plan activation success if any */}
            {pendingOrders
              .filter(order => !order.orderId && order.paymentRequired === false && order.subscriptionId)
              .map((order) => (
                <Alert
                  key={order.subscriptionId || 'free-plan'}
                  icon={<IconCheck />}
                  title="Free Plan Activated"
                  color="green"
                  variant="light"
                >
                  Your {order.plan?.name || 'Free'} plan has been activated successfully!
                  No payment required.
                </Alert>
              ))}

            {/* Show regular pending orders that require payment */}
            {displayablePendingOrders.map((order) => {
              const timeRemaining = getTimeRemaining(order)
              const expired = order.paymentIntentId
                ? isOrderExpired(order)
                : false
              const expiringSoon = order.paymentIntentId
                ? isOrderExpiringSoon(order)
                : false

              // Get order plan details
              const orderPlan = plans.find((p) => p._id === order.planId)
              const currentPlanPrice = currentSubscription?.planId?.price || 0
              const orderPlanPrice = orderPlan?.price || 0
              const orderPlanCredits = orderPlan?.credits || 0

              // Determine what happens when user completes this order
              const hasActiveSubscription =
                currentSubscription &&
                currentSubscription.hasSubscription !== false
              const isUpgrade = orderPlanPrice > currentPlanPrice
              const isDowngrade = orderPlanPrice < currentPlanPrice

              // Check if this is a credit package order
              const isCreditPackageOrder =
                (order.package && order.package.credits) ||
                order.type === "credit_recharge" ||
                order.metadata?.type === "credit_recharge" ||
                (order.items && order.items[0]?.type === "credits")

              return (
                <Card
                  key={order.orderId}
                  p="md"
                  withBorder
                  radius="md"
                  style={{
                    backgroundColor: expired
                      ? "#ffeaea"
                      : expiringSoon
                      ? "#fff4e6"
                      : undefined
                  }}
                >
                  <Grid>
                    <Grid.Col span={{base: 12, md: 6}}>
                      <Stack gap="xs">
                        <Group>
                          <Text fw={600}>
                            {isCreditPackageOrder
                              ? order.package?.name ||
                                order.items?.[0]?.description ||
                                order.metadata?.packageName ||
                                "Credit Package"
                              : order.planName || "Subscription"}
                          </Text>
                          <Badge
                            color={
                              expired
                                ? "red"
                                : expiringSoon
                                ? "orange"
                                : order.status === "pending"
                                ? "blue"
                                : "green"
                            }
                            variant="light"
                          >
                            {expired ? "Expired" : order.status}
                          </Badge>
                          {isCreditPackageOrder && (
                            <Badge color="violet" variant="light">
                              Credit Package
                            </Badge>
                          )}
                        </Group>
                        <Text size="sm" c="dimmed">
                          Order ID: {order.orderId}
                        </Text>
                        <Text size="sm">
                          Amount: {order.currency} {order.amount}
                        </Text>
                        {timeRemaining && !expired && order.paymentIntentId && (
                          <Text
                            size="sm"
                            c={expiringSoon ? "orange" : "dimmed"}
                          >
                            Expires in: {timeRemaining.hours}h{" "}
                            {timeRemaining.minutes}m
                          </Text>
                        )}

                        {/* Show what happens when completing this order */}
                        {isCreditPackageOrder ? (
                          <Alert
                            icon={<IconInfo size={16} />}
                            color="violet"
                            variant="light"
                            mt="xs"
                            p="xs"
                          >
                            <Text size="xs">
                              <strong>Credit Purchase:</strong> You'll receive{" "}
                              {(
                                order.package?.credits ||
                                order.items?.[0]?.metadata?.credits ||
                                order.metadata?.credits ||
                                0
                              ).toLocaleString()}{" "}
                              credits that will be added to your account balance
                              immediately after payment.
                            </Text>
                          </Alert>
                        ) : (
                          <Alert
                            icon={<IconInfo size={16} />}
                            color="blue"
                            variant="light"
                            mt="xs"
                            p="xs"
                          >
                            <Text size="xs">
                              {isUpgrade ? (
                                <>
                                  <strong>Upgrade:</strong> You'll receive{" "}
                                  {orderPlanCredits.toLocaleString()} credits
                                  and access to {order.planName} features
                                  immediately.
                                </>
                              ) : isDowngrade ? (
                                <>
                                  <strong>Plan Change:</strong> You'll switch to{" "}
                                  {order.planName} plan with{" "}
                                  {orderPlanCredits.toLocaleString()} credits.
                                </>
                              ) : (
                                <>
                                  <strong>Purchase Credits:</strong> You'll receive{" "}
                                  {orderPlanCredits.toLocaleString()}{" "}
                                  additional credits.
                                </>
                              )}
                            </Text>
                          </Alert>
                        )}
                      </Stack>
                    </Grid.Col>

                    <Grid.Col span={{base: 12, md: 6}}>
                      <Group gap="xs" justify="flex-end">
                        {!expired && !order.paymentIntentId && (
                          <Button
                            size="xs"
                            onClick={() => handleCreateCheckout(order)}
                            loading={creatingCheckoutId === order.orderId}
                            disabled={creatingCheckoutId !== null}
                            color="blue"
                          >
                            Checkout
                          </Button>
                        )}

                        {!expired && order.paymentIntentId && (
                          <Button
                            size="xs"
                            onClick={() => {
                              if (order.paymentUrl) {
                                window.open(order.paymentUrl, "_blank")
                              } else {
                                notifications.show({
                                  title: "Payment",
                                  message:
                                    "Payment URL not available. Please try again.",
                                  color: "yellow"
                                })
                              }
                            }}
                            color="green"
                            variant="filled"
                            disabled={false}
                          >
                            Complete Payment
                          </Button>
                        )}

                        {expired && (
                          <Button
                            size="xs"
                            variant="light"
                            onClick={async () => {
                              setRetryingOrderId(order.orderId)
                              try {
                                await retryOrderPayment(order.orderId)
                                // Refresh pending orders after retry
                                await getPendingOrders()
                              } catch (error) {
                                notifications.show({
                                  title: "Error",
                                  message:
                                    error.message || "Failed to retry payment.",
                                  color: "red"
                                })
                              } finally {
                                setRetryingOrderId(null)
                              }
                            }}
                            loading={retryingOrderId === order.orderId}
                            disabled={retryingOrderId !== null}
                          >
                            Retry Payment
                          </Button>
                        )}

                        {/* Only show cancel button if order doesn't have paymentIntentId */}
                        {!order.paymentIntentId && (
                          <Button
                            size="xs"
                            variant="outline"
                            color="red"
                            onClick={async () => {
                              setCancellingOrderId(order.orderId)
                              try {
                                await cancelPendingOrder(order.orderId)
                                // Remove the order from the list immediately
                                removeOrder(order.orderId)
                                notifications.show({
                                  title: "Order Cancelled",
                                  message:
                                    "Order has been cancelled successfully.",
                                  color: "green"
                                })
                              } catch (error) {
                                notifications.show({
                                  title: "Error",
                                  message:
                                    error.message || "Failed to cancel order.",
                                  color: "red"
                                })
                              } finally {
                                setCancellingOrderId(null)
                              }
                            }}
                            loading={cancellingOrderId === order.orderId}
                            disabled={cancellingOrderId !== null}
                          >
                            Cancel
                          </Button>
                        )}
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Card>
              )
            })}
          </Stack>
        </Stack>
      </Drawer>

      {/* Current Plan Card */}
      <Box data-subscription-card>
        <SubscriptionCard
          variant="billing"
          onPlanChange={(planData) => {
            console.log('Plan changed:', planData)
            // Refresh data when subscription changes
            refreshSubscription()
          }}
          onCreditPurchase={(creditData) => {
            console.log('Credits purchased:', creditData)
            // Refresh data when credits are added
            refreshSubscription()
          }}
        />
      </Box>

      <Tabs defaultValue="usage">
        <Tabs.List>
          <Tabs.Tab value="usage" leftSection={<IconTrendingUp size={16} />}>
            Usage Breakdown
          </Tabs.Tab>
          <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
            Billing History
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="usage" pt="xl">
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Stack gap="lg">
              {/* Date Range Selector */}
              <Box>
                <Stack gap="md">
                  <Group justify="space-between" align="center">
                    <Title order={5}>Usage Breakdown</Title>
                    {dateRange && (
                      <Badge variant="light" color="gray" size={isMobile ? "sm" : "md"}>
                        {new Date(dateRange.start).toLocaleDateString()} -{" "}
                        {new Date(dateRange.end).toLocaleDateString()}
                      </Badge>
                    )}
                  </Group>
                  <SegmentedControl
                    size={isMobile ? "xs" : "sm"}
                    fullWidth={isMobile}
                    data={[
                      {
                        label: isMobile ? "7d" : "Last 7 days",
                        value: "7days"
                      },
                      {
                        label: isMobile ? "30d" : "Last 30 days",
                        value: "30days"
                      },
                      {
                        label: isMobile ? "Month" : "This month",
                        value: "month"
                      },
                      {
                        label: isMobile ? "Prev" : "Previous month",
                        value: "prevMonth"
                      },
                      {label: "Custom", value: "custom"}
                    ]}
                    defaultValue="month"
                    onChange={(value) => {
                      switch (value) {
                        case "7days":
                          setLast7Days()
                          break
                        case "30days":
                          setLast30Days()
                          break
                        case "month":
                          setCurrentMonth()
                          break
                        case "prevMonth":
                          setPreviousMonth()
                          break
                        case "custom":
                          setShowCustomDatePicker(true)
                          break
                      }
                    }}
                  />
                </Stack>

                {/* Custom Date Picker Modal */}
                <Modal
                  opened={showCustomDatePicker}
                  onClose={() => setShowCustomDatePicker(false)}
                  title="Select Date Range"
                  size="md"
                >
                  <Stack>
                    <DatePickerInput
                      type="range"
                      label="Select date range"
                      placeholder="Pick dates range"
                      value={customDateRange}
                      onChange={(value) => {
                        setCustomDateRange(value)
                        if (value[0] && value[1]) {
                          setCustomRange(value[0], value[1])
                          setShowCustomDatePicker(false)
                        }
                      }}
                      leftSection={<IconCalendar size={16} />}
                      clearable
                    />
                  </Stack>
                </Modal>
              </Box>

              {/* Credit Summary */}
              <Box>
                <SimpleGrid cols={{base: 1, xs: 2}} spacing={{base: "md", sm: "lg"}}>
                  <Card p={{base: "sm", sm: "md"}} radius="md" withBorder>
                    <Stack gap="xs">
                      <Group justify="space-between" align="flex-start">
                        <Text size="sm" c="dimmed" fw={500}>
                          Credits Used
                        </Text>
                        {!usageLoading && usageData && (
                          <Badge size="sm" variant="light" color="gray">
                            {usageData.totals?.transactionCount || 0} operations
                          </Badge>
                        )}
                      </Group>
                      {usageLoading ? (
                        <Skeleton height={32} width={120} />
                      ) : (
                        <Tooltip label="Credits used in the selected date range">
                          <Text
                            size={{base: "lg", sm: "xl"}}
                            fw={700}
                            c={totalCreditsUsed > totalCredits * 0.8 ? "red" : "dark"}
                            style={{cursor: "help"}}
                          >
                            {totalCreditsUsed.toLocaleString()}
                          </Text>
                        </Tooltip>
                      )}
                    </Stack>
                  </Card>

                  <Card p={{base: "sm", sm: "md"}} radius="md" withBorder>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed" fw={500}>
                        Available Credits
                      </Text>
                      <Text
                        size={{base: "lg", sm: "xl"}}
                        fw={700}
                        c={availableCredits < 500 ? "orange" : "green"}
                      >
                        {availableCredits.toLocaleString()}
                      </Text>
                      {/* Show credit expiry date */}
                      {currentSubscription?.userId?.creditExpiryDate && (() => {
                        const expiryDate = new Date(currentSubscription.userId.creditExpiryDate);
                        const now = new Date();
                        const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

                        return (
                          <Badge
                            color={daysRemaining <= 2 ? "red" : daysRemaining <= 3 ? "orange" : "yellow"}
                            variant="light"
                            size="sm"
                            leftSection={<IconWarning size={12} />}
                            fullWidth
                          >
                            Expires in {daysRemaining > 0 ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}` : 'today'}
                          </Badge>
                        );
                      })()}
                    </Stack>
                  </Card>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Usage Data */}
              {usageLoading ? (
                <Stack gap="md">
                  <Skeleton height={60} radius="md" />
                  <Skeleton height={60} radius="md" />
                  <Skeleton height={60} radius="md" />
                </Stack>
              ) : usageError ? (
                <Alert icon={<IconWarning />} color="red" variant="light">
                  <Text size="sm">{usageError}</Text>
                </Alert>
              ) : usageByModule.length === 0 ? (
                <Alert icon={<IconInfo />} color="blue" variant="light">
                  <Text size="sm">
                    No credit usage found for the selected date range.
                  </Text>
                </Alert>
              ) : (
                <Stack gap="md">
                  {usageByModule.map((moduleData, index) => (
                    <div key={moduleData.module}>
                      <Group
                        justify="space-between"
                        wrap={isMobile ? "wrap" : "nowrap"}
                        style={{
                          cursor: "pointer",
                          padding: "8px",
                          borderRadius: "8px",
                          transition: "background-color 0.2s ease",
                          "&:hover": {backgroundColor: "rgba(0, 0, 0, 0.03)"}
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "rgba(0, 0, 0, 0.03)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                        onClick={() => {
                          setSelectedModuleData(moduleData)
                          setShowUsageDetailsModal(true)
                        }}
                      >
                        <Group gap={isMobile ? "xs" : "sm"}>
                          <ThemeIcon
                            color={getModuleColor(moduleData.module)}
                            size={isMobile ? "sm" : "md"}
                            radius="md"
                            variant="light"
                          >
                            <IconToken size={isMobile ? 16 : 20} />
                          </ThemeIcon>
                          <Box>
                            <Text fw={500} size={isMobile ? "sm" : "md"}>
                              {formatModuleName(moduleData.module)}
                            </Text>
                            <Text size={isMobile ? "xs" : "sm"} c="dimmed">
                              {moduleData.transactionCount} operation
                              {moduleData.transactionCount !== 1 ? "s" : ""}
                            </Text>
                          </Box>
                        </Group>
                        <Box
                          ta={isMobile ? "left" : "right"}
                          mt={isMobile ? "xs" : 0}
                        >
                          <Text fw={600} size={isMobile ? "sm" : "md"}>
                            {moduleData.totalCredits.toLocaleString()} credits
                          </Text>
                          <Tooltip
                            label={`${moduleData.totalTokens.toLocaleString()} tokens used`}
                            disabled={isMobile}
                          >
                            <Text
                              size="xs"
                              c="dimmed"
                              style={{cursor: isMobile ? "default" : "help"}}
                            >
                              {moduleData.totalTokens.toLocaleString()} tokens
                            </Text>
                          </Tooltip>
                        </Box>
                      </Group>
                      {index < usageByModule.length - 1 && <Divider mt="md" />}
                    </div>
                  ))}

                  <Divider />

                  <Group
                    justify="space-between"
                    wrap={isMobile ? "wrap" : "nowrap"}
                  >
                    <Text fw={600} size={isMobile ? "sm" : "md"}>
                      Total Usage
                    </Text>
                    <Box
                      ta={isMobile ? "left" : "right"}
                      mt={isMobile ? "xs" : 0}
                    >
                      <Text size={isMobile ? "md" : "lg"} fw={700} c="violet">
                        {totalCreditsUsed.toLocaleString()} credits
                      </Text>
                      {usageData?.totals && (
                        <Text size="xs" c="dimmed">
                          {usageData.totals.totalTokens.toLocaleString()} tokens
                          total
                        </Text>
                      )}
                    </Box>
                  </Group>

                  {usageData?.tokenToCreditRate && (
                    <Alert
                      icon={<IconInfo size={16} />}
                      color="gray"
                      variant="light"
                    >
                      <Text size="xs">
                        Token to credit rate:{" "}
                        {usageData.tokenToCreditRate === 1
                          ? "1 token = 1 credit"
                          : `${usageData.tokenToCreditRate.toLocaleString()} tokens = 1 credit`}
                      </Text>
                    </Alert>
                  )}
                </Stack>
              )}
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="history" pt="xl">
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Title order={5} mb="lg">
              Billing History
            </Title>
            {invoicesLoading ? (
              <Text ta="center" py="xl" c="dimmed">
                Loading invoices...
              </Text>
            ) : invoices.length === 0 ? (
              <Text ta="center" py="xl" c="dimmed">
                No invoices found
              </Text>
            ) : (
              <ScrollArea>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Invoice #</Table.Th>
                      <Table.Th>Description</Table.Th>
                      <Table.Th>Credits</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {invoices.map((invoice) => (
                      <Table.Tr key={invoice.id}>
                        <Table.Td>
                          <Stack gap={0}>
                            <Text size="sm">
                              {invoice.date.toLocaleDateString()}
                            </Text>
                            {invoice.paidAt && (
                              <Text size="xs" c="dimmed">
                                Paid: {invoice.paidAt.toLocaleDateString()}
                              </Text>
                            )}
                          </Stack>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={500}>
                            {invoice.invoiceNumber}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Stack gap={0}>
                            <Text size="sm">{invoice.description}</Text>
                            {invoice.type === "credit_recharge" && (
                              <Badge size="xs" color="violet" variant="light">
                                Credit Purchase
                              </Badge>
                            )}
                          </Stack>
                        </Table.Td>
                        <Table.Td>
                          {invoice.credits > 0 ? (
                            <Text size="sm">
                              {invoice.credits.toLocaleString()}
                            </Text>
                          ) : (
                            <Text size="sm" c="dimmed">
                              -
                            </Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Stack gap={0}>
                            <Text size="sm" fw={500}>
                              {invoice.currency} {invoice.amount.toFixed(2)}
                            </Text>
                            {invoice.tax > 0 && (
                              <Text size="xs" c="dimmed">
                                Tax: {invoice.currency} {invoice.tax.toFixed(2)}
                              </Text>
                            )}
                          </Stack>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={getInvoiceStatusColor(invoice.status)}
                            variant="light"
                            size="sm"
                          >
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            onClick={() => downloadInvoice(invoice)}
                            loading={downloading[invoice.id]}
                            disabled={
                              downloading[invoice.id] ||
                              invoice.status === "draft"
                            }
                            title={
                              invoice.status === "draft"
                                ? "Draft invoices cannot be downloaded"
                                : "Download invoice"
                            }
                          >
                            <IconDownload size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            )}
          </Card>
        </Tabs.Panel>
      </Tabs>



      {/* Usage Details Modal */}
      <Modal
        opened={showUsageDetailsModal}
        onClose={() => {
          setShowUsageDetailsModal(false)
          setSelectedModuleData(null)
        }}
        title={
          selectedModuleData
            ? `${formatModuleName(selectedModuleData.module)} Usage Details`
            : "Usage Details"
        }
        size="lg"
        fullScreen={isMobile}
      >
        {selectedModuleData && selectedModuleData.operations && (
          <Stack gap="lg">
            {/* Summary */}
            <Card p="md" withBorder>
              <Group justify="space-between">
                <Box>
                  <Text size="sm" c="dimmed">
                    Total Operations
                  </Text>
                  <Text size="xl" fw={600}>
                    {selectedModuleData.transactionCount}
                  </Text>
                </Box>
                <Box ta="center">
                  <Text size="sm" c="dimmed">
                    Total Credits Used
                  </Text>
                  <Text size="xl" fw={600} c="violet">
                    {selectedModuleData.totalCredits.toLocaleString()}
                  </Text>
                </Box>
                <Box ta="right">
                  <Text size="sm" c="dimmed">
                    Average per Operation
                  </Text>
                  <Text size="xl" fw={600}>
                    {Math.round(
                      selectedModuleData.averageTokensPerOperation
                    ).toLocaleString()}{" "}
                    tokens
                  </Text>
                </Box>
              </Group>
            </Card>

            {/* Operations List */}
            <Box>
              <Text fw={600} mb="md">
                Individual Operations
              </Text>
              <Stack gap="sm">
                {selectedModuleData.operations.map((operation) => (
                  <Card key={operation.transactionId} p="md" withBorder>
                    <Stack gap="xs">
                      <Group justify="space-between" wrap="wrap">
                        <Box style={{flex: 1}}>
                          <Text size="sm" fw={500}>
                            {operation.description}
                          </Text>
                          <Group gap="xs" mt={4}>
                            <Badge size="xs" variant="light" color="gray">
                              ID: {operation.transactionId.slice(-8)}
                            </Badge>
                            <Badge size="xs" variant="light" color="blue">
                              {new Date(
                                operation.createdAt
                              ).toLocaleDateString()}
                            </Badge>
                            <Badge size="xs" variant="light" color="blue">
                              {new Date(
                                operation.createdAt
                              ).toLocaleTimeString()}
                            </Badge>
                          </Group>
                        </Box>
                        <Box
                          ta={isMobile ? "left" : "right"}
                          mt={isMobile ? "xs" : 0}
                        >
                          <Group gap="lg">
                            <Box>
                              <Text size="xs" c="dimmed">
                                Tokens
                              </Text>
                              <Text fw={500}>
                                {operation.tokensUsed.toLocaleString()}
                              </Text>
                            </Box>
                            <Box>
                              <Text size="xs" c="dimmed">
                                Credits
                              </Text>
                              <Text fw={600} c="violet">
                                {operation.creditsDeducted.toLocaleString()}
                              </Text>
                            </Box>
                          </Group>
                        </Box>
                      </Group>
                      {operation.projectId &&
                        typeof operation.projectId === "string" && (
                          <Text size="xs" c="dimmed">
                            Project ID: {operation.projectId}
                          </Text>
                        )}
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Box>

            {/* Token to Credit Rate Info */}
            {usageData?.tokenToCreditRate && (
              <Alert icon={<IconInfo size={16} />} color="gray" variant="light">
                <Text size="xs">
                  Conversion rate:{" "}
                  {usageData.tokenToCreditRate === 1
                    ? "1 token = 1 credit"
                    : `${usageData.tokenToCreditRate.toLocaleString()} tokens = 1 credit`}
                </Text>
              </Alert>
            )}
          </Stack>
        )}
      </Modal>
    </Stack>
    </>
  )
}

export default Billing
