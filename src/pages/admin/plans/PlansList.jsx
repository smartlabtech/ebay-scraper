import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {
  Card,
  Table,
  Group,
  Text,
  Badge,
  ActionIcon,
  Button,
  Title,
  Stack,
  Box,
  Switch,
  Skeleton,
  Alert,
  TextInput,
  Select,
  Menu,
  SimpleGrid,
  List,
  ThemeIcon,
  Divider,
  Tooltip,
  Drawer,
  NumberInput,
  Textarea,
  ScrollArea,
  Collapse
} from "@mantine/core"
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdMoreVert,
  MdSearch,
  MdFilterList,
  MdInfo,
  MdContentCopy,
  MdCheck,
  MdStar,
  MdCardGiftcard,
  MdRocket,
  MdFolder,
  MdCode,
  MdPeople,
  MdBrush,
  MdSupport,
  MdWorkspacePremium,
  MdBusiness,
  MdDomain,
  MdDashboardCustomize,
  MdSchedule,
  MdPublic,
  MdAccountCircle
} from "react-icons/md"
import plansService from "../../../services/plansService"
import creditPackagesService from "../../../services/creditPackagesService"
import {useNotifications} from "../../../hooks/useNotifications"

const PlansList = () => {
  const navigate = useNavigate()
  const {toast} = useNotifications()

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCycle, setFilterCycle] = useState("all")
  const [includeInactive, setIncludeInactive] = useState(false)

  // Drawer states
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [drawerOpened, setDrawerOpened] = useState(false)
  const [packages, setPackages] = useState([])
  const [loadingPackages, setLoadingPackages] = useState(false)
  const [showCreatePackageForm, setShowCreatePackageForm] = useState(false)
  const [newPackage, setNewPackage] = useState({
    name: "",
    description: "",
    credits: 1000,
    price: 0
  })

  useEffect(() => {
    loadPlans()
  }, [includeInactive])

  const loadPlans = async () => {
    try {
      setLoading(true)
      const data = await plansService.getPlans(includeInactive)
      setPlans(data)
    } catch (error) {
      toast("Failed to load plans", "error")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (planId, currentStatus) => {
    try {
      await plansService.togglePlanStatus(planId, !currentStatus)
      toast(
        `Plan ${!currentStatus ? "activated" : "deactivated"} successfully`,
        "success"
      )
      loadPlans()
    } catch (error) {
      toast("Failed to update plan status", "error")
    }
  }

  const handleDelete = async (planId) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await plansService.deletePlan(planId)
        toast("Plan deleted successfully", "success")
        loadPlans()
      } catch (error) {
        toast("Failed to delete plan", "error")
      }
    }
  }

  const handleCopyId = (planId) => {
    navigator.clipboard.writeText(planId)
    toast("Plan ID copied to clipboard", "success")
  }

  const getPlanIcon = (iconType) => {
    const iconMap = {
      starter: MdRocket,
      professional: MdWorkspacePremium,
      business: MdBusiness,
      enterprise: MdDomain,
      custom: MdDashboardCustomize
    }
    const IconComponent = iconMap[iconType] || MdRocket
    return <IconComponent size={24} />
  }

  const handleCardClick = async (plan) => {
    setSelectedPlan(plan)
    setDrawerOpened(true)
    await loadPackagesForPlan(plan._id)
  }

  const loadPackagesForPlan = async (planId) => {
    try {
      setLoadingPackages(true)
      const response = await creditPackagesService.getCreditPackages({})

      // Filter packages for this plan
      let allPackages = []
      if (Array.isArray(response)) {
        allPackages = response
      } else if (response.data && Array.isArray(response.data)) {
        allPackages = response.data
      } else if (response.packages && Array.isArray(response.packages)) {
        allPackages = response.packages
      }

      // Filter packages that belong to this plan
      const planPackages = allPackages.filter((pkg) => {
        if (typeof pkg.planId === "object" && pkg.planId._id) {
          return pkg.planId._id === planId
        }
        return pkg.planId === planId
      })

      setPackages(planPackages)
    } catch (error) {
      console.error("Failed to load packages:", error)
      toast("Failed to load credit packages", "error")
    } finally {
      setLoadingPackages(false)
    }
  }

  const handleCreatePackage = async () => {
    if (!selectedPlan) return

    try {
      const packageData = {
        ...newPackage,
        planId: selectedPlan._id,
        currency: selectedPlan.currency
      }

      await creditPackagesService.createCreditPackage(packageData)
      toast("Credit package created successfully", "success")

      // Reload packages
      await loadPackagesForPlan(selectedPlan._id)

      // Reset form
      setShowCreatePackageForm(false)
      setNewPackage({
        name: "",
        description: "",
        credits: 1000,
        price: 0
      })

      // Reload plans to update package count
      loadPlans()
    } catch (error) {
      toast("Failed to create credit package", "error")
    }
  }

  const handleDeletePackage = async (packageId) => {
    if (
      window.confirm("Are you sure you want to delete this credit package?")
    ) {
      try {
        await creditPackagesService.deleteCreditPackage(packageId)
        toast("Credit package deleted successfully", "success")

        // Reload packages
        if (selectedPlan) {
          await loadPackagesForPlan(selectedPlan._id)
        }

        // Reload plans to update package count
        loadPlans()
      } catch (error) {
        toast("Failed to delete credit package", "error")
      }
    }
  }

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD"
    }).format(amount)
  }

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCycle =
      filterCycle === "all" || plan.billingCycle === filterCycle
    return matchesSearch && matchesCycle
  })

  if (loading) {
    return (
      <Stack gap="lg">
        <Skeleton height={60} />
        <Skeleton height={400} />
      </Stack>
    )
  }

  return (
    <Stack gap="xl">
      {/* Header */}
      <Group justify="space-between">
        <Box>
          <Title order={2} mb={4}>
            Subscription Plans
          </Title>
          <Text c="dimmed" size="sm">
            Manage subscription plans and pricing
          </Text>
        </Box>
        <Button
          leftSection={<MdAdd size={20} />}
          variant="gradient"
          gradient={{from: "violet", to: "grape"}}
          onClick={() => navigate("/control/plans/new")}
        >
          Create Plan
        </Button>
      </Group>

      {/* Filters */}
      <Card shadow="sm" radius="md" withBorder>
        <Group>
          <TextInput
            placeholder="Search plans..."
            leftSection={<MdSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{flex: 1, maxWidth: 300}}
          />
          <Select
            placeholder="Billing Cycle"
            leftSection={<MdFilterList size={16} />}
            value={filterCycle}
            onChange={setFilterCycle}
            data={[
              {value: "all", label: "All Cycles"},
              {value: "monthly", label: "Monthly"},
              {value: "yearly", label: "Yearly"},
              {value: "lifetime", label: "Lifetime"}
            ]}
            style={{width: 150}}
          />
          <Switch
            label="Show Inactive"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.currentTarget.checked)}
          />
        </Group>
      </Card>

      {/* Plans Grid */}
      {filteredPlans.length === 0 ? (
        <Alert
          leftSection={<MdInfo size={16} />}
          title="No plans found"
          color="blue"
        >
          {searchQuery || filterCycle !== "all"
            ? "No plans match your filters. Try adjusting your search criteria."
            : "No plans available. Create your first plan to get started."}
        </Alert>
      ) : (
        <SimpleGrid cols={{base: 1, sm: 2, lg: 3, xl: 4}} spacing="lg">
          {filteredPlans.map((plan) => (
            <Card
              key={plan._id}
              shadow="sm"
              radius="lg"
              withBorder
              padding="lg"
              style={{
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer"
              }}
              onClick={() => handleCardClick(plan)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = ""
              }}
            >
              {/* Plan Name with Actions */}
              <Group justify="space-between" mb="xs">
                <Group gap="xs">
                  {plan.icon && (
                    <ThemeIcon size="lg" variant="light" radius="md">
                      {getPlanIcon(plan.icon)}
                    </ThemeIcon>
                  )}
                  <Text size="lg" fw={700}>
                    {plan.name}
                  </Text>
                </Group>
                <Menu position="bottom-end" withinPortal>
                  <Menu.Target>
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MdMoreVert size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<MdEdit size={14} />}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/control/plans/edit/${plan._id}`)
                      }}
                    >
                      Edit Plan
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={<MdDelete size={14} />}
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(plan._id)
                      }}
                    >
                      Delete Plan
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>

              {/* Badges and Description */}
              <Box mb="md">
                <Group gap="xs" mb="xs">
                  {plan.isDefault && (
                    <Badge size="sm" color="blue" variant="filled">
                      Default
                    </Badge>
                  )}
                  {plan.metadata?.isPopular && (
                    <Badge
                      size="sm"
                      color="orange"
                      variant="filled"
                      leftSection={<MdStar size={12} />}
                    >
                      Popular
                    </Badge>
                  )}
                  {plan.showInLandingPage && (
                    <Tooltip label="Shown on landing page">
                      <Badge
                        size="sm"
                        color="blue"
                        variant="light"
                        leftSection={<MdPublic size={12} />}
                      >
                        Landing
                      </Badge>
                    </Tooltip>
                  )}
                  {plan.showInUserAccount && (
                    <Tooltip label="Shown in user account">
                      <Badge
                        size="sm"
                        color="teal"
                        variant="light"
                        leftSection={<MdAccountCircle size={12} />}
                      >
                        Account
                      </Badge>
                    </Tooltip>
                  )}
                  <Badge
                    size="sm"
                    radius="xl"
                    color={
                      plan.creditPackages && plan.creditPackages.length > 0
                        ? "green"
                        : "gray"
                    }
                    variant={
                      plan.creditPackages && plan.creditPackages.length > 0
                        ? "filled"
                        : "light"
                    }
                    leftSection={<MdCardGiftcard size={14} />}
                  >
                    {plan.creditPackages ? plan.creditPackages.length : 0}{" "}
                    packages
                  </Badge>
                  {plan.creditValidityDays && (
                    <Badge
                      size="sm"
                      radius="xl"
                      color="violet"
                      variant="light"
                      leftSection={<MdSchedule size={14} />}
                    >
                      {plan.creditValidityDays} days validity
                    </Badge>
                  )}
                </Group>
                <Text size="sm" c="dimmed" lineClamp={2}>
                  {plan.description}
                </Text>
              </Box>

              {/* Pricing */}
              <Box mb="lg">
                <Group align="end" gap="xs">
                  <Text size="xl" fw={700} style={{fontSize: "2rem"}}>
                    {formatCurrency(plan.price, plan.currency)}
                  </Text>
                  <Text size="sm" c="dimmed" mb={6}>
                    /
                    {plan.billingCycle === "monthly"
                      ? "mo"
                      : plan.billingCycle === "yearly"
                      ? "yr"
                      : "lifetime"}
                  </Text>
                </Group>
                {plan.trialDays > 0 && (
                  <Badge size="sm" color="green" variant="light" mt="xs">
                    {plan.trialDays} day free trial
                  </Badge>
                )}
              </Box>

              <Divider mb="md" />

              {/* Key Features */}
              <Stack gap="sm" mb="lg">
                <Group gap="xs">
                  <ThemeIcon size="sm" variant="light" color="violet">
                    <MdCardGiftcard size={14} />
                  </ThemeIcon>
                  <Text size="sm">
                    {plan.credits === -1
                      ? "Unlimited credits"
                      : `${plan.credits.toLocaleString()} credits`}
                  </Text>
                </Group>

                {plan.maxProjects !== 0 && (
                  <Group gap="xs">
                    <ThemeIcon size="sm" variant="light" color="blue">
                      <MdFolder size={14} />
                    </ThemeIcon>
                    <Text size="sm">
                      {plan.maxProjects === -1
                        ? "Unlimited projects"
                        : `${plan.maxProjects} projects`}
                    </Text>
                  </Group>
                )}

                {plan.teamMembers !== 0 && (
                  <Group gap="xs">
                    <ThemeIcon size="sm" variant="light" color="green">
                      <MdPeople size={14} />
                    </ThemeIcon>
                    <Text size="sm">
                      {plan.teamMembers === -1
                        ? "Unlimited team members"
                        : `${plan.teamMembers} team members`}
                    </Text>
                  </Group>
                )}

                {plan.apiAccess && (
                  <Group gap="xs">
                    <ThemeIcon size="sm" variant="light" color="cyan">
                      <MdCode size={14} />
                    </ThemeIcon>
                    <Text size="sm">API Access</Text>
                  </Group>
                )}

                {plan.customBranding && (
                  <Group gap="xs">
                    <ThemeIcon size="sm" variant="light" color="pink">
                      <MdBrush size={14} />
                    </ThemeIcon>
                    <Text size="sm">Custom Branding</Text>
                  </Group>
                )}

                <Group gap="xs">
                  <ThemeIcon size="sm" variant="light" color="orange">
                    <MdSupport size={14} />
                  </ThemeIcon>
                  <Text size="sm" tt="capitalize">
                    {plan.supportLevel} support
                  </Text>
                </Group>
              </Stack>

              {/* Features List (if available) */}
              {plan.highlightedFeatures &&
                plan.highlightedFeatures.length > 0 && (
                  <>
                    <Divider mb="sm" />
                    <Box mb="md">
                      <Text size="xs" fw={600} c="dimmed" mb="xs">
                        Key Features:
                      </Text>
                      <Stack gap={4}>
                        {plan.highlightedFeatures
                          .slice(0, 3)
                          .map((feature, index) => (
                            <Group key={index} gap={6}>
                              <Text size="xs" c="yellow">
                                •
                              </Text>
                              <Text size="xs" lineClamp={1}>
                                {feature}
                              </Text>
                            </Group>
                          ))}
                      </Stack>
                    </Box>
                  </>
                )}

              <Divider mb="md" />

              {/* Footer Info with Toggle */}
              <Group justify="space-between" align="center">
                <Tooltip label="Click to copy ID">
                  <Text
                    size="xs"
                    c="dimmed"
                    style={{
                      fontFamily: "monospace",
                      cursor: "pointer"
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyId(plan._id)
                    }}
                  >
                    ID: {plan._id.substring(0, 8)}...
                  </Text>
                </Tooltip>
                <Box onClick={(e) => e.stopPropagation()}>
                  <Switch
                    size="sm"
                    color="green"
                    checked={plan.isActive}
                    onChange={() => handleToggleStatus(plan._id, plan.isActive)}
                    label={plan.isActive ? "Active" : "Inactive"}
                  />
                </Box>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Credit Packages Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={() => {
          setDrawerOpened(false)
          setShowCreatePackageForm(false)
          setNewPackage({
            name: "",
            description: "",
            credits: 1000,
            price: 0
          })
        }}
        title={
          <Box>
            <Title order={3}>Credit Packages</Title>
            {selectedPlan && (
              <Stack gap={4}>
                <Group gap="xs">
                  {selectedPlan.icon && (
                    <ThemeIcon size="sm" variant="light" radius="md">
                      {getPlanIcon(selectedPlan.icon)}
                    </ThemeIcon>
                  )}
                  <Text size="sm" c="dimmed">
                    {selectedPlan.name} -{" "}
                    {formatCurrency(selectedPlan.price, selectedPlan.currency)}/
                    {selectedPlan.billingCycle}
                  </Text>
                </Group>
                {selectedPlan.creditValidityDays && (
                  <Text size="xs" c="dimmed">
                    Credits valid for {selectedPlan.creditValidityDays} days
                  </Text>
                )}
              </Stack>
            )}
          </Box>
        }
        position="right"
        size="xl"
        padding="lg"
      >
        <ScrollArea h="calc(100vh - 120px)">
          <Stack gap="lg">
            {/* Add Package Button */}
            <Group justify="space-between">
              <Text fw={600}>
                {packages.length} Package{packages.length !== 1 ? "s" : ""}
              </Text>
              <Button
                leftSection={<MdAdd size={16} />}
                variant="light"
                onClick={() => setShowCreatePackageForm(!showCreatePackageForm)}
              >
                {showCreatePackageForm ? "Cancel" : "Add Package"}
              </Button>
            </Group>

            {/* Create Package Form */}
            <Collapse in={showCreatePackageForm}>
              <Card shadow="sm" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={5}>Create New Package</Title>
                  <TextInput
                    label="Package Name"
                    placeholder="e.g., Starter Pack"
                    value={newPackage.name}
                    onChange={(e) =>
                      setNewPackage({...newPackage, name: e.target.value})
                    }
                    required
                  />
                  <Textarea
                    label="Description"
                    placeholder="Describe this package..."
                    value={newPackage.description}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        description: e.target.value
                      })
                    }
                    required
                  />
                  <Group grow>
                    <NumberInput
                      label="Credits"
                      placeholder="1000"
                      min={1}
                      value={newPackage.credits}
                      onChange={(val) =>
                        setNewPackage({...newPackage, credits: val})
                      }
                      thousandSeparator=","
                      required
                    />
                    <NumberInput
                      label="Price"
                      placeholder="0.00"
                      min={0}
                      precision={2}
                      value={newPackage.price}
                      onChange={(val) =>
                        setNewPackage({...newPackage, price: val})
                      }
                      thousandSeparator=","
                      required
                    />
                  </Group>
                  <Group justify="flex-end">
                    <Button
                      variant="subtle"
                      onClick={() => {
                        setShowCreatePackageForm(false)
                        setNewPackage({
                          name: "",
                          description: "",
                          credits: 1000,
                          price: 0
                        })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePackage}
                      disabled={!newPackage.name || !newPackage.description}
                      leftSection={<MdAdd size={16} />}
                    >
                      Create Package
                    </Button>
                  </Group>
                </Stack>
              </Card>
            </Collapse>

            {/* Packages List */}
            {loadingPackages ? (
              <Stack gap="md">
                <Skeleton height={120} radius="md" />
                <Skeleton height={120} radius="md" />
              </Stack>
            ) : packages.length === 0 ? (
              <Alert
                icon={<MdCardGiftcard size={16} />}
                title="No packages yet"
                color="blue"
              >
                This plan doesn't have any credit packages. Create one to offer
                additional credits to your customers.
              </Alert>
            ) : (
              <Stack gap="md">
                {packages.map((pkg) => (
                  <Card key={pkg._id} shadow="sm" radius="md" withBorder>
                    <Group justify="space-between" mb="sm">
                      <Box>
                        <Group gap="xs">
                          <Text fw={600}>{pkg.name}</Text>
                          {pkg.isPopular && (
                            <Badge size="sm" color="orange">
                              Popular
                            </Badge>
                          )}
                          {!pkg.isActive && (
                            <Badge size="sm" color="red" variant="light">
                              Inactive
                            </Badge>
                          )}
                        </Group>
                        <Text size="sm" c="dimmed">
                          {pkg.description}
                        </Text>
                      </Box>
                      <Menu position="bottom-end" withinPortal>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <MdMoreVert size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<MdEdit size={14} />}
                            onClick={() =>
                              navigate(
                                `/control/credit-packages/edit/${pkg._id}`
                              )
                            }
                          >
                            Edit Package
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<MdDelete size={14} />}
                            color="red"
                            onClick={() => handleDeletePackage(pkg._id)}
                          >
                            Delete Package
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>

                    <Divider mb="sm" />

                    <Group justify="space-between">
                      <Group gap="xs">
                        <ThemeIcon size="sm" variant="light" color="green">
                          <MdCardGiftcard size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>
                          {pkg.credits.toLocaleString()} credits
                        </Text>
                      </Group>
                      <Text size="lg" fw={700} c="violet">
                        {formatCurrency(
                          pkg.price,
                          pkg.currency || selectedPlan?.currency
                        )}
                      </Text>
                    </Group>

                    {pkg.discount > 0 && (
                      <Badge color="green" variant="light" mt="sm">
                        {pkg.discount}% Discount
                      </Badge>
                    )}
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </ScrollArea>
      </Drawer>
    </Stack>
  )
}

export default PlansList
