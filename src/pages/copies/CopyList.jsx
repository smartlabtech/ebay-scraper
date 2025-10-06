import {useState, useEffect} from "react"
import {Link} from "react-router-dom"
import { safeEventHandler } from "../../utils/domHelpers"
import { useSelector } from 'react-redux'
import {
  Title,
  Text,
  Stack,
  Group,
  Button,
  TextInput,
  Select,
  Badge,
  ActionIcon,
  Box,
  Center,
  ThemeIcon,
  SimpleGrid,
  Modal,
  Alert,
  Paper,
  Drawer,
  Chip,
  Divider,
  ScrollArea
} from "@mantine/core"
import {
  MdAdd as IconPlus,
  MdDelete as IconDelete,
  MdContentCopy as IconCopy,
  MdFolder as IconFolder,
  MdAutoAwesome as IconAI,
  MdBusiness as IconBusiness,
  MdLocalOffer as IconTag,
  MdCheck as IconCheck,
  MdEmail as IconEmail,
  MdArticle as IconBlog,
  MdFilterList as IconFilter,
  MdClear as IconClear,
  MdExpandMore as IconExpand,
  MdExpandLess as IconCollapse
} from "react-icons/md"
import {
  FaFacebookF as IconFacebook,
  FaInstagram as IconInstagram,
  FaLinkedinIn as IconLinkedin,
  FaTwitter as IconTwitter,
  FaTiktok as IconTiktok,
  FaYoutube as IconYoutube,
  FaWhatsapp as IconWhatsapp,
  FaPinterestP as IconPinterest,
  FaSnapchatGhost as IconSnapchat,
  FaRedditAlien as IconReddit,
  FaDiscord as IconDiscord,
  FaTelegramPlane as IconTelegram
} from "react-icons/fa"
import {useCopies} from "../../hooks/useCopies"
import {useBrandMessages} from "../../hooks/useBrandMessages"
import {useProjects} from "../../hooks/useProjects"
import {useNotifications} from "../../hooks/useNotifications"
import {PageTransition} from "../../components/ui/AnimatedElements"
import {PLATFORMS, PLATFORM_GROUPS, COPY_TYPES, formatPlatformName, getPlatformIcon} from "../../services/copyService"
import ListCard from "../../components/common/ListCard"
import FloatingActionButton from "../../components/common/FloatingActionButton"
import ProjectSelectionModal from "../../components/common/ProjectSelectionModal"

const CopyList = () => {
  const showProjectModalGlobal = useSelector(state => state.ui.modals.projectSelection)

  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    return localStorage.getItem('selectedProjectId') || null
  })
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [hasCheckedProjects, setHasCheckedProjects] = useState(false)
  const [filterProduct, setFilterProduct] = useState(null)
  const [filterCopyTypes, setFilterCopyTypes] = useState([]) // Array for multi-select
  const [filterPlatforms, setFilterPlatforms] = useState([]) // Array for multi-select
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const {copies, loading, loadCopies, removeCopy, deleting} = useCopies()
  const {messages, loadMessages} = useBrandMessages()
  const {projects, loadProjects} = useProjects()
  const {toast} = useNotifications()

  // Projects are loaded by Navigation component, no need to load here

  useEffect(() => {
    // Listen for localStorage changes (from Navigation header)
    const handleStorageChange = () => {
      const newProjectId = localStorage.getItem('selectedProjectId')
      if (newProjectId !== selectedProjectId) {
        setSelectedProjectId(newProjectId)
        setFilterProduct(null) // Reset filters when project changes
        setFilterCopyTypes([])
        setFilterPlatforms([])
      }
    }

    // Check for changes periodically (storage event doesn't fire in same tab)
    const interval = setInterval(handleStorageChange, 500)
    
    return () => clearInterval(interval)
  }, [selectedProjectId])

  useEffect(() => {
    // Show modal if no project is selected and projects are loaded
    if (projects.length > 0 && !hasCheckedProjects) {
      setHasCheckedProjects(true)
      if (!selectedProjectId) {
        setShowProjectModal(true)
      } else {
        // Verify the selected project still exists
        const projectExists = projects.some(p => p.id === selectedProjectId)
        if (!projectExists) {
          localStorage.removeItem('selectedProjectId')
          setSelectedProjectId(null)
          setShowProjectModal(true)
        }
      }
    }
  }, [projects, selectedProjectId, hasCheckedProjects])

  useEffect(() => {
    // Load copies and messages when project is selected
    if (selectedProjectId) {
      loadCopies({ projectId: selectedProjectId })
      loadMessages({ projectId: selectedProjectId })
    }
  }, [selectedProjectId]) // Remove hook functions from dependencies to avoid re-runs

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId)
    localStorage.setItem('selectedProjectId', projectId)
    setShowProjectModal(false)
    setFilterProduct(null) // Reset filter when project changes
    setFilterCopyTypes([])
    setFilterPlatforms([])
    toast('Project selected successfully', 'success')
  }

  // Get unique products from copies
  const uniqueProducts = copies.reduce((acc, copy) => {
    if (copy.productId && copy.productId._id) {
      const productId = copy.productId._id
      if (!acc.find(p => p._id === productId)) {
        acc.push({
          _id: productId,
          shortName: copy.productId.shortName || copy.productId.product || 'Unknown Product',
          majorVersion: copy.productId.majorVersion,
          minorVersion: copy.productId.minorVersion
        })
      }
    }
    return acc
  }, [])

  // Apply filters - copies are already filtered by projectId from API
  const filteredCopies = copies
    .filter((copy) => {
      const matchesProduct =
        !filterProduct || copy.productId?._id === filterProduct
      const matchesCopyType =
        filterCopyTypes.length === 0 || filterCopyTypes.includes(copy.copyType)
      const matchesPlatform =
        filterPlatforms.length === 0 || filterPlatforms.includes(copy.platform)
      return matchesProduct && matchesCopyType && matchesPlatform
    })

  const handleDeleteCopy = async (copyId) => {
    if (window.confirm("Are you sure you want to delete this copy?")) {
      try {
        await removeCopy(copyId)
        toast("Copy deleted successfully", "success")
        // No need to reload - removeCopy should update the state
      } catch (error) {
        toast("Failed to delete copy", "error")
      }
    }
  }

  const handleCopyContent = (content) => {
    navigator.clipboard.writeText(content)
    toast("Content copied to clipboard", "success")
  }

  // Count active filters
  const activeFilterCount = [
    filterProduct !== null,
    filterCopyTypes.length > 0,
    filterPlatforms.length > 0
  ].filter(Boolean).length

  // Clear all filters
  const clearAllFilters = () => {
    setFilterProduct(null)
    setFilterCopyTypes([])
    setFilterPlatforms([])
  }

  // Apply filters and close drawer
  const applyFilters = () => {
    setFilterDrawerOpen(false)
  }

  // Toggle copy type filter (for multi-select)
  const toggleCopyType = (type) => {
    setFilterCopyTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  // Toggle platform filter (for multi-select)
  const togglePlatform = (platform) => {
    setFilterPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  // Get platform icon based on platform type
  const getPlatformIconComponent = (platform) => {
    if (platform?.startsWith('FACEBOOK')) return <IconFacebook />;
    if (platform?.startsWith('INSTAGRAM')) return <IconInstagram />;
    if (platform?.startsWith('LINKEDIN')) return <IconLinkedin />;
    if (platform?.startsWith('X_')) return <IconTwitter />;
    if (platform?.startsWith('TIKTOK')) return <IconTiktok />;
    if (platform?.startsWith('EMAIL')) return <IconEmail />;
    if (platform?.startsWith('BLOG')) return <IconBlog />;
    if (platform?.startsWith('YOUTUBE')) return <IconYoutube />;
    if (platform?.startsWith('WHATSAPP')) return <IconWhatsapp />;
    if (platform?.startsWith('PINTEREST')) return <IconPinterest />;
    if (platform?.startsWith('SNAPCHAT')) return <IconSnapchat />;
    if (platform?.startsWith('REDDIT')) return <IconReddit />;
    if (platform?.startsWith('DISCORD')) return <IconDiscord />;
    if (platform?.startsWith('TELEGRAM')) return <IconTelegram />;
    return <IconFolder />;
  }
  
  // Get platform color based on platform type
  const getPlatformColor = (platform) => {
    if (platform?.startsWith('FACEBOOK')) return "blue";
    if (platform?.startsWith('INSTAGRAM')) return "pink";
    if (platform?.startsWith('LINKEDIN')) return "indigo";
    if (platform?.startsWith('X_')) return "dark";
    if (platform?.startsWith('TIKTOK')) return "grape";
    if (platform?.startsWith('EMAIL')) return "teal";
    if (platform?.startsWith('BLOG')) return "orange";
    if (platform?.startsWith('YOUTUBE')) return "red";
    if (platform?.startsWith('WHATSAPP')) return "green";
    if (platform?.startsWith('PINTEREST')) return "red";
    if (platform?.startsWith('SNAPCHAT')) return "yellow";
    if (platform?.startsWith('REDDIT')) return "orange";
    if (platform?.startsWith('DISCORD')) return "indigo";
    if (platform?.startsWith('TELEGRAM')) return "cyan";
    return "violet";
  }

  const CopyCard = ({copy}) => {
    const content = copy.generatedCopies?.[0]?.content
    const productName = copy.productId?.shortName || copy.productId?.product || 'Unknown Product'
    const displayProductName = productName.length > 40 ? productName.substring(0, 37) + '...' : productName
    const productVersion = copy.productId?.majorVersion !== undefined && copy.productId?.minorVersion !== undefined
      ? `v${copy.productId.majorVersion}.${copy.productId.minorVersion}`
      : null

    // Use fullCopy as primary content
    const contentPreview = content?.fullCopy || content?.body || content?.hook || 'No content available'

    // Check for multiple variations
    const variationCount = copy.generatedCopies?.length || 0
    const hasMultipleVariations = variationCount > 1

    // Get language info
    const languageInfo = copy.languageInfo || copy.generatedCopies?.[0]?.languageInfo
    const formatLanguageName = (lang) => {
      if (!lang) return ''
      // Handle special cases with underscores
      if (lang.includes('_')) {
        return lang.split('_')
          .map(word => word.charAt(0) + word.slice(1).toLowerCase())
          .join(' ')
      }
      return lang.charAt(0) + lang.slice(1).toLowerCase()
    }

    const header = (
      <Group gap="xs" justify="space-between" wrap="nowrap">
        <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <ThemeIcon
            size="sm"
            variant="light"
            color={getPlatformColor(copy.platform)}
            radius="xl"
          >
            {getPlatformIconComponent(copy.platform)}
          </ThemeIcon>
          <Text fw={600} size="sm" lineClamp={1} style={{ flex: 1 }}>
            {displayProductName} {productVersion && (
              <Text span c="dimmed" size="xs">
                {' '}({productVersion})
              </Text>
            )}
          </Text>
        </Group>
        <Group gap="xs">
          {languageInfo && (
            <Badge
              size="xs"
              variant="dot"
              color="blue"
            >
              <Text span size="xs">{languageInfo.flag}</Text>
              <Text span size="xs" ml={4}>{formatLanguageName(languageInfo.language)}</Text>
            </Badge>
          )}
          <Badge
            size="xs"
            variant="light"
            color="grape"
          >
            {copy.copyType.replace(/_/g, ' ').toLowerCase()}
          </Badge>
        </Group>
      </Group>
    );

    const contentSection = (
      <Stack gap="xs">
        {/* Content preview - using fullCopy with lineClamp */}
        <Text
          size="sm"
          c="dimmed"
          lineClamp={3}
          style={{
            direction: languageInfo?.isRTL ? 'rtl' : 'ltr',
            textAlign: languageInfo?.isRTL ? 'right' : 'left'
          }}
        >
          {contentPreview}
        </Text>
        
        {/* Platform indicator and variations */}
        <Group gap="xs" justify="space-between">
          <Badge 
            size="sm" 
            variant="dot"
            color={getPlatformColor(copy.platform)}
          >
            {formatPlatformName(copy.platform)}
          </Badge>
          {hasMultipleVariations && (
            <Badge 
              size="sm" 
              variant="light"
              color="violet"
            >
              +{variationCount - 1} more
            </Badge>
          )}
        </Group>
      </Stack>
    );

    const menuItems = [
      {
        icon: <IconDelete size={16} />,
        label: 'Delete',
        color: 'red',
        onClick: () => handleDeleteCopy(copy._id)
      }
    ];

    return (
      <ListCard
        navigateTo={`/copies/${copy._id}`}
        header={header}
        content={contentSection}
        date={copy.createdAt}
        menuItems={menuItems}
      />
    )
  }

  return (
    <PageTransition>
      <>
      {/* Project Selection Modal */}
      <ProjectSelectionModal
        opened={showProjectModal}
        onClose={() => {
          if (selectedProjectId) {
            setShowProjectModal(false)
          }
        }}
        onSelect={handleProjectSelect}
        projects={projects}
        selectedProjectId={selectedProjectId}
        description="Please select a project to view and manage copies"
        noProjectsMessage="You need to create a project first before managing copies."
        createButtonPath="/projects/new"
      />

      <Stack gap="xl">
        {/* Header */}
        {/* <Box
          style={{
            background:
              "linear-gradient(135deg, rgba(124, 58, 237, 0.03) 0%, rgba(109, 40, 217, 0.03) 100%)",
            borderBottom: "1px solid var(--mantine-color-gray-2)",
            marginLeft: "-var(--mantine-spacing-md)",
            marginRight: "-var(--mantine-spacing-md)",
            marginTop: "-var(--mantine-spacing-md)",
            padding: "var(--mantine-spacing-xl) var(--mantine-spacing-md)"
          }}
        >
          <Stack
            gap="md"
            style={{maxWidth: "1200px", margin: "0 auto", width: "100%"}}
          >
            <Box>
              <Title order={2} fw={700} mb={4}>
                Marketing Copies
              </Title>
              <Text c="dimmed" size="sm">
                AI-generated marketing copies for your campaigns
              </Text>
            </Box>
          </Stack>
        </Box> */}

        {/* Filter Drawer */}
        <Drawer
          opened={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          title="Filter Copies"
          position="right"
          size="lg"
          padding="md"
          styles={{
            drawer: {
              display: 'flex',
              flexDirection: 'column'
            },
            body: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <Stack gap="lg" style={{ flex: 1 }}>
            {/* Current Filters Summary */}
            {activeFilterCount > 0 && (
              <Paper p="sm" radius="md" withBorder>
                <Group justify="space-between">
                  <Text size="sm" fw={500}>
                    {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                  </Text>
                  <Button
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </Button>
                </Group>
              </Paper>
            )}

            <ScrollArea style={{ flex: 1 }} scrollbarSize={8}>
              <Stack gap="lg">
                {/* Product Filter - Single Select */}
                <Paper p="md" radius="md" withBorder>
                  <Stack gap="sm">
                    <Group gap="xs" align="center">
                      <ThemeIcon size="sm" variant="light" color="violet" radius="xl">
                        <IconBusiness size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} tt="uppercase" c="violet">Product</Text>
                      <Badge size="xs" variant="light" color="gray">Single Select</Badge>
                    </Group>
                    <Chip.Group value={filterProduct} onChange={setFilterProduct}>
                      <Group gap="xs">
                        {uniqueProducts.map((product) => (
                          <Chip
                            key={product._id}
                            value={product._id}
                            variant="filled"
                            color="violet"
                            size="md"
                            radius="xl"
                          >
                            <Group gap={4} align="center">
                              <Text span size="sm">{product.shortName}</Text>
                              {product.majorVersion !== undefined && product.minorVersion !== undefined && (
                                <Badge size="xs" variant="light" color="gray">
                                  v{product.majorVersion}.{product.minorVersion}
                                </Badge>
                              )}
                            </Group>
                          </Chip>
                        ))}
                      </Group>
                    </Chip.Group>
                  </Stack>
                </Paper>

                {/* Copy Type Filter - Multi Select */}
                <Paper p="md" radius="md" withBorder>
                  <Stack gap="sm">
                    <Group gap="xs" align="center">
                      <ThemeIcon size="sm" variant="light" color="grape" radius="xl">
                        <IconTag size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} tt="uppercase" c="grape">Copy Type</Text>
                      <Badge size="xs" variant="light" color="green">Multi Select</Badge>
                    </Group>
                    <Chip.Group value={filterCopyTypes} onChange={setFilterCopyTypes} multiple>
                      <Group gap="xs">
                        {Object.entries(COPY_TYPES).map(([key, value]) => (
                          <Chip
                            key={value}
                            value={value}
                            variant="filled"
                            color="grape"
                            size="md"
                            radius="xl"
                          >
                            {key.charAt(0) + key.slice(1).toLowerCase()}
                          </Chip>
                        ))}
                      </Group>
                    </Chip.Group>
                  </Stack>
                </Paper>

                {/* Platform Filter - Multi Select */}
                <Paper p="md" radius="md" withBorder>
                  <Stack gap="sm">
                    <Group gap="xs" align="center">
                      <ThemeIcon size="sm" variant="light" color="blue" radius="xl">
                        <IconFolder size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} tt="uppercase" c="blue">Platforms</Text>
                      <Badge size="xs" variant="light" color="green">Multi Select</Badge>
                    </Group>
                    <Chip.Group value={filterPlatforms} onChange={setFilterPlatforms} multiple>
                      <Stack gap="md">
                        {Object.entries(PLATFORM_GROUPS).map(([group, items], index) => (
                          <Stack key={group} gap="xs">
                            {index > 0 && <Divider size="xs" />}
                            <Text size="xs" c="dimmed" fw={500}>{group}</Text>
                            <Group gap="xs">
                              {items.map(item => {
                                // Get icon for each platform
                                const getIcon = () => {
                                  if (item.value.startsWith('FACEBOOK')) return <IconFacebook size={12} />;
                                  if (item.value.startsWith('INSTAGRAM')) return <IconInstagram size={12} />;
                                  if (item.value.startsWith('LINKEDIN')) return <IconLinkedin size={12} />;
                                  if (item.value.startsWith('X_')) return <IconTwitter size={12} />;
                                  if (item.value.startsWith('TIKTOK')) return <IconTiktok size={12} />;
                                  if (item.value.startsWith('EMAIL')) return <IconEmail size={12} />;
                                  if (item.value.startsWith('BLOG')) return <IconBlog size={12} />;
                                  if (item.value.startsWith('YOUTUBE')) return <IconYoutube size={12} />;
                                  if (item.value.startsWith('WHATSAPP')) return <IconWhatsapp size={12} />;
                                  if (item.value.startsWith('PINTEREST')) return <IconPinterest size={12} />;
                                  if (item.value.startsWith('SNAPCHAT')) return <IconSnapchat size={12} />;
                                  if (item.value.startsWith('REDDIT')) return <IconReddit size={12} />;
                                  if (item.value.startsWith('DISCORD')) return <IconDiscord size={12} />;
                                  if (item.value.startsWith('TELEGRAM')) return <IconTelegram size={12} />;
                                  return null;
                                };
                                
                                return (
                                  <Chip
                                    key={item.value}
                                    value={item.value}
                                    variant="filled"
                                    color="blue"
                                    size="sm"
                                    radius="xl"
                                    icon={getIcon()}
                                  >
                                    {item.label}
                                  </Chip>
                                );
                              })}
                            </Group>
                          </Stack>
                        ))}
                      </Stack>
                    </Chip.Group>
                  </Stack>
                </Paper>
              </Stack>
            </ScrollArea>

            {/* Footer Actions */}
            <Group grow>
              <Button
                variant="default"
                onClick={() => setFilterDrawerOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                color="violet"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </Group>
          </Stack>
        </Drawer>

        <Stack gap="xl">
          {/* Filter Bar */}
          <Group justify="space-between">
            <Group gap="xs">
              <Button
                variant="light"
                color="violet"
                size="sm"
                leftSection={<IconFilter size={16} />}
                onClick={() => setFilterDrawerOpen(true)}
                rightSection={
                  activeFilterCount > 0 && (
                    <Badge color="violet" variant="filled" size="sm" circle>
                      {activeFilterCount}
                    </Badge>
                  )
                }
              >
                Filters
              </Button>

              {/* Active Filters Display */}
              {activeFilterCount > 0 && (
                <>
                  <Divider orientation="vertical" />
                  <Group gap="xs">
                    {filterProduct && (
                      <Badge
                        size="md"
                        variant="light"
                        color="violet"
                        rightSection={
                          <ActionIcon
                            size="xs"
                            color="violet"
                            variant="transparent"
                            onClick={() => setFilterProduct(null)}
                          >
                            <IconClear size={12} />
                          </ActionIcon>
                        }
                        pr={3}
                      >
                        {uniqueProducts.find(p => p._id === filterProduct)?.shortName || 'Product'}
                      </Badge>
                    )}
                    {filterCopyTypes.map((type) => (
                      <Badge
                        key={type}
                        size="md"
                        variant="light"
                        color="violet"
                        rightSection={
                          <ActionIcon
                            size="xs"
                            color="violet"
                            variant="transparent"
                            onClick={() => toggleCopyType(type)}
                          >
                            <IconClear size={12} />
                          </ActionIcon>
                        }
                        pr={3}
                      >
                        {Object.entries(COPY_TYPES).find(([_, v]) => v === type)?.[0] || 'Type'}
                      </Badge>
                    ))}
                    {filterPlatforms.map((platform) => (
                      <Badge
                        key={platform}
                        size="md"
                        variant="light"
                        color="violet"
                        rightSection={
                          <ActionIcon
                            size="xs"
                            color="violet"
                            variant="transparent"
                            onClick={() => togglePlatform(platform)}
                          >
                            <IconClear size={12} />
                          </ActionIcon>
                        }
                        pr={3}
                      >
                        {formatPlatformName(platform)}
                      </Badge>
                    ))}
                  </Group>
                </>
              )}
            </Group>

            {/* Results count */}
            <Text size="sm" c="dimmed">
              {filteredCopies.length} {filteredCopies.length === 1 ? 'result' : 'results'}
            </Text>
          </Group>

          {/* Copies Grid */}
          {!selectedProjectId ? (
            <Center py={100}>
              <Stack align="center" gap="md">
                <Box
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(109, 40, 217, 0.1) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <IconFolder
                    size={48}
                    style={{color: "var(--mantine-color-violet-5)"}}
                  />
                </Box>
                <Box ta="center">
                  <Text size="lg" fw={600} mb={8}>
                    No Project Selected
                  </Text>
                  <Text c="dimmed" size="sm" maw={400}>
                    Please select a project to view and manage your copies
                  </Text>
                </Box>
                <Button
                  onClick={() => setShowProjectModal(true)}
                  leftSection={<IconFolder size={18} />}
                  size="md"
                  variant="gradient"
                  gradient={{from: "violet", to: "grape", deg: 135}}
                >
                  Select Project
                </Button>
              </Stack>
            </Center>
          ) : filteredCopies.length === 0 ? (
            <Center py={100}>
              <Stack align="center" gap="md">
                <Box
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(109, 40, 217, 0.1) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <IconAI
                    size={48}
                    style={{color: "var(--mantine-color-violet-5)"}}
                  />
                </Box>
                <Box ta="center">
                  <Text size="lg" fw={600} mb={8}>
                    No copies found
                  </Text>
                  <Text c="dimmed" size="sm" maw={400}>
                    {filterProduct ||
                    filterCopyTypes.length > 0 ||
                    filterPlatforms.length > 0
                      ? "Try adjusting your filters"
                      : "Generate your first AI-powered marketing copy to get started"}
                  </Text>
                </Box>
                {!filterProduct &&
                  filterCopyTypes.length === 0 &&
                  filterPlatforms.length === 0 && (
                    <Button
                      component={Link}
                      to="/copies/new"
                      leftSection={<IconAI size={18} />}
                      size="md"
                      variant="gradient"
                      gradient={{from: "violet", to: "grape", deg: 135}}
                    >
                      Generate Your First Copy
                    </Button>
                  )}
              </Stack>
            </Center>
          ) : (
            <SimpleGrid cols={{base: 1, sm: 2, lg: 3}} spacing="lg">
              {filteredCopies.map((copy) => (
                <CopyCard key={copy._id} copy={copy} />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Stack>

      {/* Floating Action Button */}
      <FloatingActionButton
        to="/copies/new"
        icon={IconAI}
        label="Generate Copy"
        hidden={showProjectModal || showProjectModalGlobal}
      />
      </>
    </PageTransition>
  )
}

export default CopyList
