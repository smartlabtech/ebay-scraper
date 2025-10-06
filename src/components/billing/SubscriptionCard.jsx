import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {
  Card,
  Stack,
  Title,
  Group,
  Badge,
  Box,
  Text,
  Button,
  Alert,
  Drawer,
  SegmentedControl,
  Grid,
  Divider,
  List,
  ThemeIcon,
  rem,
  Modal,
  Skeleton
} from "@mantine/core"
import {notifications} from "@mantine/notifications"
import {useMediaQuery} from "@mantine/hooks"
import {
  MdCreditCard as IconCreditCard,
  MdCheck as IconCheck,
  MdInfo as IconInfo,
  MdWarning as IconWarning,
  MdCancel as IconCancel,
  MdUpgrade as IconUpgrade,
  MdToken as IconToken
} from "react-icons/md"
import {useAuth} from "../../hooks/useAuth"
import {useSubscription} from "../../hooks/useSubscription"
import {usePlans} from "../../hooks/usePlans"
import {useOrders} from "../../hooks/useOrders"
import {useDispatch} from "react-redux"
import {changeSubscriptionPlan} from "../../store/slices/subscriptionSlice"
import {initiateCreditPackageOrder} from "../../store/slices/creditPackagesSlice"

const SubscriptionCard = ({
  variant = "dashboard", // "dashboard" or "billing"
  onPlanChange,
  onCreditPurchase,
  showFullFeatures = false
}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user} = useAuth()
  const isMobile = useMediaQuery("(max-width: 48em)")

  // State management
  const [showManageSubscriptionDrawer, setShowManageSubscriptionDrawer] =
    useState(false)
  const [subscriptionTab, setSubscriptionTab] = useState("plans")
  const [selectedPlanId, setSelectedPlanId] = useState(null)
  const [selectedCreditPackageId, setSelectedCreditPackageId] = useState(null)
  const [purchasingCredits, setPurchasingCredits] = useState(false)
  const [selectingPlanId, setSelectingPlanId] = useState(null)

  // Get subscription data
  const {
    currentSubscription,
    scheduledSubscription,
    planName,
    creditsRemaining,
    creditsRenewAt,
    planFeatures,
    loading: subscriptionLoading,
    refreshSubscription
  } = useSubscription()

  // Get plans data
  const {plans, loading: plansLoading, getPlanFeatures} = usePlans()

  // Get orders data
  const {
    pendingOrders,
    initiateSubscriptionOrder,
    getPendingOrders,
    isOrderExpired,
    clearErrors
  } = useOrders()

  // Get billing period dates from subscription
  const planStartDate = currentSubscription?.currentPeriodStart
    ? new Date(currentSubscription.currentPeriodStart)
    : new Date()
  const planEndDate = currentSubscription?.currentPeriodEnd
    ? new Date(currentSubscription.currentPeriodEnd)
    : new Date()

  // Get payment status from subscription
  const paymentStatus =
    currentSubscription?.status === "active"
      ? "paid"
      : currentSubscription?.status === "past_due"
      ? "overdue"
      : "pending"

  // Format renewal date
  const formatRenewalDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  // Handle plan upgrade/change
  const handleUpgrade = async (planId) => {
    const selectedPlan = plans.find((plan) => plan._id === planId)
    const planDisplayName = selectedPlan?.name || "selected"

    // If user has active subscription, use changePlan endpoint
    if (currentSubscription?.status === "active") {
      setSelectingPlanId(planId)

      try {
        const result = await dispatch(changeSubscriptionPlan(planId)).unwrap()

        // Determine the type of change
        const currentPlanPrice = currentSubscription?.planId?.price || 0
        const selectedPlanPrice = selectedPlan?.price || 0
        const isUpgrade = selectedPlanPrice > currentPlanPrice
        const isDowngrade = selectedPlanPrice < currentPlanPrice

        let message = ""
        if (isUpgrade) {
          message = `Your upgrade to ${planDisplayName} has been processed and is now active!`
        } else if (isDowngrade) {
          message = `Your switch to ${planDisplayName} has been processed.`
        } else {
          // Same plan - purchasing credits
          message = `Your credit purchase has been processed successfully!`
        }

        notifications.show({
          title: "Plan Change Successful",
          message,
          color: "green",
          icon: <IconCheck />
        })

        // Close the drawer
        setShowManageSubscriptionDrawer(false)

        // Refresh subscription data
        await refreshSubscription()

        // Call callback if provided
        if (onPlanChange) {
          onPlanChange({
            planId,
            planName: planDisplayName,
            type: isUpgrade ? "upgrade" : isDowngrade ? "downgrade" : "extend"
          })
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message:
            error || "Failed to change subscription plan. Please try again.",
          color: "red",
          icon: <IconWarning />
        })
      } finally {
        setSelectingPlanId(null)
      }
      return
    }

    // If no active subscription, create an order as before
    // Check if user already has a pending/processing order for this plan
    const existingOrder = pendingOrders.find((order) => {
      const isValidStatus =
        order.status === "pending" || order.status === "processing"
      const isValidOrder =
        !order.paymentIntentId ||
        (order.paymentIntentId && order.expiresAt && !isOrderExpired(order))
      return order.planId === planId && isValidStatus && isValidOrder
    })

    if (existingOrder) {
      notifications.show({
        title: "Order Already Exists",
        message: `You already have a ${existingOrder.status} order for this plan. Please complete or cancel it before creating a new one.`,
        color: "yellow",
        icon: <IconWarning />
      })
      setShowManageSubscriptionDrawer(false)
      return
    }

    setSelectingPlanId(planId)
    clearErrors()

    try {
      // Initiate subscription order
      const order = await initiateSubscriptionOrder(planId)

      // Check if this is a free plan that doesn't require payment
      if (order && order.paymentRequired === false && !order.orderId) {
        // Free plan activated immediately
        notifications.show({
          title: "Plan Activated Successfully!",
          message: `Your ${planDisplayName} plan has been activated. No payment required!`,
          color: "green",
          icon: <IconCheck />
        })

        // Refresh subscription to show the new active plan
        await refreshSubscription()

        // Close the drawer
        setShowManageSubscriptionDrawer(false)

        // Call callback if provided
        if (onPlanChange) {
          onPlanChange({
            planId,
            planName: planDisplayName,
            type: "free_activated",
            order
          })
        }
      } else {
        // Regular paid plan - needs payment
        notifications.show({
          title: "Order Created",
          message: `Your ${planDisplayName} subscription order has been created. Complete payment to activate your plan.`,
          color: "blue",
          icon: <IconCheck />
        })

        // Close the drawer first
        setShowManageSubscriptionDrawer(false)

        // Fetch pending orders to show the new order
        await getPendingOrders()

        // Call callback if provided
        if (onPlanChange) {
          onPlanChange({planId, planName: planDisplayName, type: "new", order})
        }
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error.message ||
          "Failed to create subscription order. Please try again.",
        color: "red",
        icon: <IconWarning />
      })
    } finally {
      setSelectingPlanId(null)
    }
  }

  // Handle credit purchase
  const handlePurchaseCredits = async (packageId) => {
    const creditPackageId = packageId || selectedCreditPackageId
    if (!creditPackageId) return

    // Get credit packages from current subscription
    const displayPackages =
      currentSubscription?.creditPackages?.filter((pkg) => pkg.isActive) || []
    const selectedPackage = displayPackages.find(
      (p) => p._id === creditPackageId
    )
    if (!selectedPackage) return

    setPurchasingCredits(true)

    try {
      // Create credit package order using Redux action
      const order = await dispatch(
        initiateCreditPackageOrder({
          packageId: creditPackageId,
          metadata: {}
        })
      ).unwrap()

      notifications.show({
        title: "Order Created",
        message: `Your order for ${selectedPackage.credits.toLocaleString()} credits has been created. Complete payment to add credits to your account.`,
        color: "blue",
        icon: <IconCheck />
      })

      setShowManageSubscriptionDrawer(false)
      setSelectedCreditPackageId(null)

      // Refresh pending orders to show the new credit package order
      await getPendingOrders()

      // Call callback if provided
      if (onCreditPurchase) {
        onCreditPurchase({
          packageId: creditPackageId,
          package: selectedPackage,
          order
        })
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error.message ||
          "Failed to create credit package order. Please try again.",
        color: "red",
        icon: <IconWarning />
      })
    } finally {
      setPurchasingCredits(false)
    }
  }

  // Get credit packages from current subscription
  const displayPackages =
    currentSubscription?.creditPackages?.filter((pkg) => pkg.isActive) || []
  const packagesLoading = subscriptionLoading

  // Dashboard variant - compact display
  if (variant === "dashboard") {
    return (
      <>
        <Card
          shadow="md"
          p={{base: "md", sm: "lg", md: "xl"}}
          radius="lg"
          withBorder
          style={{
            borderColor: "rgba(124, 58, 237, 0.1)",
            background:
              "linear-gradient(135deg, rgba(124, 58, 237, 0.03) 0%, rgba(109, 40, 217, 0.03) 100%)"
          }}
        >
          {subscriptionLoading ? (
            <Stack gap="md">
              <Skeleton height={30} width="40%" radius="md" />
              <Group gap="xs">
                <Skeleton height={40} width={120} radius="md" />
                <Skeleton height={20} width={100} radius="md" />
              </Group>
              <Skeleton height={40} width="100%" radius="md" />
            </Stack>
          ) : currentSubscription &&
            currentSubscription.hasSubscription !== false ? (
            <Group justify="space-between" align="center" wrap="wrap" gap="md">
              <Box style={{flex: "1 1 auto", minWidth: 0}}>
                <Group gap="xs" mb="xs">
                  <ThemeIcon
                    size="sm"
                    color="violet"
                    variant="light"
                    radius="xl"
                  >
                    <IconToken size={16} />
                  </ThemeIcon>
                  <Badge
                    size="sm"
                    color="violet"
                    variant="dot"
                    onClick={() => navigate("/settings/billing")}
                    styles={{
                      root: {
                        textTransform: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          opacity: 0.8,
                          transform: "scale(1.05)"
                        }
                      }
                    }}
                  >
                    {planName} Plan
                  </Badge>
                </Group>
                <Group gap="xs" align="baseline">
                  <Text size="2xl" fw={700} style={{lineHeight: 1}}>
                    {creditsRemaining.toLocaleString()}
                  </Text>
                  <Text size="sm" c="dimmed">
                    credits available
                  </Text>
                </Group>
                {/* Show credit validity for plans with limited validity */}
                {currentSubscription?.planId?.creditValidityDays &&
                  (() => {
                    const startDate = new Date(
                      currentSubscription.currentPeriodStart
                    )
                    const expiryDate = new Date(startDate)
                    expiryDate.setDate(
                      expiryDate.getDate() +
                        currentSubscription.planId.creditValidityDays
                    )
                    const now = new Date()
                    const daysRemaining = Math.ceil(
                      (expiryDate - now) / (1000 * 60 * 60 * 24)
                    )

                    return (
                      <Badge
                        color={
                          daysRemaining <= 2
                            ? "red"
                            : daysRemaining <= 3
                            ? "orange"
                            : "yellow"
                        }
                        variant="light"
                        size="sm"
                        mt="xs"
                        leftSection={<IconWarning size={14} />}
                      >
                        Credits expire{" "}
                        {daysRemaining > 0
                          ? `in ${daysRemaining} day${
                              daysRemaining !== 1 ? "s" : ""
                            }`
                          : "today"}{" "}
                        ({expiryDate.toLocaleDateString()})
                      </Badge>
                    )
                  })()}
                {creditsRenewAt && (
                  <Text size="xs" c="dimmed" mt="xs">
                    Renews on {formatRenewalDate(creditsRenewAt)}
                  </Text>
                )}
              </Box>
              <Group gap="sm" w={{base: "100%", sm: "auto"}}>
                <Button
                  onClick={() => {
                    setSubscriptionTab("credits")
                    setShowManageSubscriptionDrawer(true)
                  }}
                  variant="light"
                  color="violet"
                  leftSection={<IconUpgrade size={16} />}
                  size="md"
                  fullWidth={{base: true, sm: false}}
                >
                  Add Credits
                </Button>
              </Group>
            </Group>
          ) : (
            <Stack gap="md">
              <Alert icon={<IconInfo />} color="blue" variant="light">
                <Text size="sm">
                  You don't have an active subscription. Select a plan to get
                  started!
                </Text>
              </Alert>
              <Button
                fullWidth
                size="lg"
                leftSection={<IconCreditCard size={16} />}
                onClick={() => {
                  setSubscriptionTab("plans")
                  setShowManageSubscriptionDrawer(true)
                }}
                variant="gradient"
                gradient={{from: "violet", to: "grape", deg: 45}}
              >
                Get Started
              </Button>
            </Stack>
          )}
        </Card>

        {/* Manage Subscription Drawer */}
        {renderManageSubscriptionDrawer()}
      </>
    )
  }

  // Billing variant - full display
  return (
    <>
      <Box>
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack>
            <Title order={4}>Subscription Plan</Title>

            {subscriptionLoading ? (
              <Stack gap="md">
                <Skeleton height={40} width="30%" radius="md" />
                <Skeleton height={24} width="60%" radius="md" />
                <Skeleton height={24} width="50%" radius="md" />
                <Skeleton height={44} width="100%" radius="md" />
              </Stack>
            ) : currentSubscription &&
              currentSubscription.hasSubscription !== false ? (
              <>
                <Group gap="xs">
                  <Badge size="lg" variant="filled" color="violet">
                    {planName}
                  </Badge>
                  {paymentStatus === "overdue" && (
                    <Badge color="red" variant="light">
                      Payment Overdue
                    </Badge>
                  )}
                </Group>

                {/* Scheduled subscription feature has been removed from backend */}

                <Button
                  fullWidth
                  leftSection={<IconCreditCard size={16} />}
                  onClick={() => setShowManageSubscriptionDrawer(true)}
                  variant="gradient"
                  gradient={{from: "violet", to: "grape", deg: 45}}
                >
                  Manage Subscription
                </Button>
              </>
            ) : (
              <>
                <Alert icon={<IconInfo />} color="blue" variant="light">
                  <Text size="sm">
                    You don't have an active subscription. Select a plan to get
                    started!
                  </Text>
                </Alert>

                <Button
                  fullWidth
                  size="lg"
                  leftSection={<IconCreditCard size={16} />}
                  onClick={() => {
                    setSubscriptionTab("plans")
                    setShowManageSubscriptionDrawer(true)
                  }}
                  variant="gradient"
                  gradient={{from: "violet", to: "grape", deg: 45}}
                >
                  Get Started
                </Button>
              </>
            )}
          </Stack>
        </Card>
      </Box>

      {/* Manage Subscription Drawer */}
      {renderManageSubscriptionDrawer()}
    </>
  )

  // Render the manage subscription drawer (used by both variants)
  function renderManageSubscriptionDrawer() {
    return (
      <Drawer
        opened={showManageSubscriptionDrawer}
        onClose={() => {
          setShowManageSubscriptionDrawer(false)
          setSelectedPlanId(null)
          setSelectedCreditPackageId(null)
        }}
        title="Manage Subscription"
        position={isMobile ? "bottom" : "right"}
        size={isMobile ? "100%" : "xl"}
        padding="lg"
      >
        <Stack gap="lg">
          {/* Tabs for Plans and Credits */}
          <SegmentedControl
            value={subscriptionTab}
            onChange={setSubscriptionTab}
            fullWidth
            data={[
              {
                value: "plans",
                label: (
                  <Group gap="xs">
                    <IconUpgrade size={16} />
                    <Text size="sm">Change Plan</Text>
                  </Group>
                )
              },
              {
                value: "credits",
                label: (
                  <Group gap="xs">
                    <IconToken size={16} />
                    <Text size="sm">Buy Credits</Text>
                  </Group>
                ),
                disabled:
                  !currentSubscription ||
                  currentSubscription.hasSubscription === false
              }
            ]}
          />

          {/* Plans Tab Content */}
          {subscriptionTab === "plans" &&
            (plansLoading ? (
              <Text ta="center" py="xl">
                Loading plans...
              </Text>
            ) : (
              <Grid gutter="md">
                {plans
                  // Backend already filters plans based on showInUserAccount flag
                  // No need for frontend filtering
                  .map((plan) => {
                    const planFeatures = getPlanFeatures(plan)
                    // Backend already filters plans, so use all available plans
                    const planCount = plans.length

                    // Check if this is the current plan by comparing IDs
                    const isCurrentPlan =
                      currentSubscription?.status === "active" &&
                      currentSubscription?.planId?._id === plan._id

                    // Check if this plan has an existing order
                    const hasExistingOrder = pendingOrders.some((order) => {
                      const isValidStatus =
                        order.status === "pending" ||
                        order.status === "processing"
                      const isValidOrder =
                        !order.paymentIntentId ||
                        (order.paymentIntentId &&
                          order.expiresAt &&
                          !isOrderExpired(order))
                      return (
                        order.planId === plan._id &&
                        isValidStatus &&
                        isValidOrder
                      )
                    })

                    // Dynamic column spans based on number of available plans
                    const colSpan = {
                      base: 12,
                      sm: planCount === 1 ? 12 : 6,
                      md: planCount === 1 ? 12 : planCount === 2 ? 6 : 4
                    }

                    return (
                      <Grid.Col key={plan._id} span={colSpan}>
                        <Card
                          h="100%"
                          p="lg"
                          radius="md"
                          withBorder
                          style={{
                            borderColor: isCurrentPlan
                              ? "var(--mantine-color-green-5)"
                              : plan.isPopular
                              ? "var(--mantine-color-violet-5)"
                              : undefined,
                            borderWidth:
                              isCurrentPlan || plan.isPopular ? 2 : 1,
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: isCurrentPlan
                              ? "var(--mantine-color-green-0)"
                              : undefined
                          }}
                        >
                          {/* Plan Header */}
                          <Box ta="center" mb="md">
                            <Group justify="center" gap="xs" mb="xs">
                              <Title order={3}>{plan.name}</Title>
                              {isCurrentPlan && (
                                <Badge color="green" variant="filled" size="sm">
                                  Current Plan
                                </Badge>
                              )}
                              {!isCurrentPlan && plan.isPopular && (
                                <Badge
                                  color="violet"
                                  variant="filled"
                                  size="sm"
                                >
                                  Popular
                                </Badge>
                              )}
                            </Group>
                            <Text size="sm" c="dimmed" mb="md">
                              {plan.description}
                            </Text>
                            <Box>
                              <Group justify="center" align="baseline" gap={4}>
                                <Text size="lg" fw={400} c="dimmed">
                                  $
                                </Text>
                                <Text
                                  size={rem(40)}
                                  fw={700}
                                  style={{lineHeight: 1}}
                                >
                                  {plan.price}
                                </Text>
                                <Text size="sm" c="dimmed">
                                  /package
                                </Text>
                              </Group>
                              <Badge
                                color={plan.isPopular ? "violet" : "blue"}
                                variant="light"
                                size="lg"
                                mt="xs"
                                fullWidth
                              >
                                {plan.credits.toLocaleString()} credits
                              </Badge>
                              {/* Show credit validity if plan has limited validity */}
                              {plan.creditValidityDays && (
                                <Badge
                                  color="orange"
                                  variant="light"
                                  size="sm"
                                  mt="xs"
                                  fullWidth
                                  leftSection={<IconWarning size={12} />}
                                >
                                  Valid for {plan.creditValidityDays} days only
                                </Badge>
                              )}
                            </Box>
                          </Box>

                          <Divider my="md" />

                          {/* Features List */}
                          <Box style={{flex: 1}}>
                            <Text fw={600} size="sm" mb="xs">
                              Features included:
                            </Text>
                            <List
                              spacing="xs"
                              size="sm"
                              icon={
                                <ThemeIcon
                                  color={plan.isPopular ? "violet" : "blue"}
                                  size={20}
                                  radius="xl"
                                  variant="light"
                                >
                                  <IconCheck size={12} stroke={3} />
                                </ThemeIcon>
                              }
                            >
                              {planFeatures.map((feature, idx) => (
                                <List.Item key={idx}>
                                  <Text size="sm">{feature}</Text>
                                </List.Item>
                              ))}
                            </List>
                          </Box>

                          {/* Upgrade Button */}
                          <Button
                            fullWidth
                            mt="md"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleUpgrade(plan._id)
                            }}
                            loading={selectingPlanId === plan._id}
                            disabled={
                              selectingPlanId !== null ||
                              hasExistingOrder ||
                              isCurrentPlan
                            }
                            color={
                              hasExistingOrder || isCurrentPlan
                                ? "gray"
                                : plan.isPopular
                                ? "violet"
                                : "blue"
                            }
                            variant={
                              hasExistingOrder || isCurrentPlan
                                ? "outline"
                                : plan.isPopular
                                ? "filled"
                                : "light"
                            }
                            size="md"
                          >
                            {hasExistingOrder
                              ? "Order Already Exists"
                              : selectingPlanId === plan._id
                              ? currentSubscription?.status === "active"
                                ? "Processing..."
                                : "Creating Order..."
                              : currentSubscription?.status !== "active"
                              ? `Select ${plan.name}`
                              : isCurrentPlan
                              ? `Current Plan`
                              : plan.price >
                                (currentSubscription?.planId?.price || 0)
                              ? `Upgrade to ${plan.name}`
                              : `Downgrade to ${plan.name}`}
                          </Button>
                        </Card>
                      </Grid.Col>
                    )
                  })}
              </Grid>
            ))}

          {/* Credits Tab Content */}
          {subscriptionTab === "credits" &&
            (packagesLoading ? (
              <Text ta="center" py="xl">
                Loading credit packages...
              </Text>
            ) : (
              <Stack gap="lg">
                {displayPackages.length === 0 ? (
                  <Alert icon={<IconWarning />} color="yellow" variant="light">
                    <Text size="sm">
                      No credit packages are available at this time. Please
                      check back later.
                    </Text>
                  </Alert>
                ) : (
                  <Grid gutter="md">
                    {displayPackages.map((pkg) => {
                      const isSelected = selectedCreditPackageId === pkg._id
                      const creditsPerDollar = Math.round(
                        pkg.credits / pkg.price
                      )

                      return (
                        <Grid.Col
                          key={pkg._id}
                          span={{
                            base: 12,
                            sm: 6,
                            md: 6
                          }}
                        >
                          <Card
                            h="100%"
                            p="lg"
                            radius="md"
                            withBorder
                            style={{
                              borderColor: isSelected
                                ? "var(--mantine-color-violet-5)"
                                : pkg.isPopular
                                ? "var(--mantine-color-blue-5)"
                                : undefined,
                              borderWidth: isSelected || pkg.isPopular ? 2 : 1,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              backgroundColor: isSelected
                                ? "var(--mantine-color-violet-0)"
                                : undefined
                            }}
                            onClick={() =>
                              setSelectedCreditPackageId(
                                isSelected ? null : pkg._id
                              )
                            }
                          >
                            <Stack gap="sm">
                              <Group justify="space-between">
                                <Title order={4}>{pkg.name}</Title>
                                {pkg.isPopular && (
                                  <Badge
                                    color="blue"
                                    variant="filled"
                                    size="sm"
                                  >
                                    Popular
                                  </Badge>
                                )}
                              </Group>

                              <Box>
                                <Group align="baseline" gap={4}>
                                  <Text size="lg" fw={400} c="dimmed">
                                    $
                                  </Text>
                                  <Text
                                    size={rem(32)}
                                    fw={700}
                                    style={{lineHeight: 1}}
                                  >
                                    {pkg.price}
                                  </Text>
                                </Group>
                                <Text size="sm" c="dimmed">
                                  {pkg.credits.toLocaleString()} credits
                                </Text>
                                <Badge
                                  color="green"
                                  variant="light"
                                  size="sm"
                                  mt="xs"
                                >
                                  {creditsPerDollar} credits per dollar
                                </Badge>
                              </Box>

                              {pkg.description && (
                                <Text size="sm" c="dimmed">
                                  {pkg.description}
                                </Text>
                              )}

                              <Button
                                fullWidth
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePurchaseCredits(pkg._id)
                                }}
                                loading={purchasingCredits && isSelected}
                                disabled={purchasingCredits}
                                color={pkg.isPopular ? "blue" : "violet"}
                                variant={isSelected ? "filled" : "light"}
                              >
                                {purchasingCredits && isSelected
                                  ? "Processing..."
                                  : `Purchase ${pkg.credits.toLocaleString()} Credits`}
                              </Button>
                            </Stack>
                          </Card>
                        </Grid.Col>
                      )
                    })}
                  </Grid>
                )}
              </Stack>
            ))}
        </Stack>
      </Drawer>
    )
  }
}

export default SubscriptionCard
