import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openModal, closeModal } from '../../store/slices/uiSlice';
import {
  Title,
  Text,
  Stack,
  Group,
  Button,
  Badge,
  Box,
  Center,
  ThemeIcon,
  SimpleGrid,
  Modal,
  Alert,
  Paper,
  ActionIcon,
  Tooltip,
  TextInput,
  Select
} from '@mantine/core';
import {
  MdAdd as IconPlus,
  MdDelete as IconDelete,
  MdEdit as IconEdit,
  MdAutoAwesome as IconAI,
  MdFolder as IconFolder,
  MdCheck as IconCheck,
  MdContentCopy as IconCopy,
  MdBusiness as IconBusiness,
  MdSearch as IconSearch
} from 'react-icons/md';
import { useProducts } from '../../hooks/useProducts';
import { useProjects } from '../../hooks/useProjects';
import { useNotifications } from '../../hooks/useNotifications';
import { PageTransition } from '../../components/ui/AnimatedElements';
import ListCard from '../../components/common/ListCard';
import FloatingActionButton from '../../components/common/FloatingActionButton';
import ProjectSelectionModal from '../../components/common/ProjectSelectionModal';
import { format } from 'date-fns';

const ProductsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const dispatch = useDispatch();
  const showProjectModalGlobal = useSelector(state => state.ui.modals.projectSelection);

  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    return localStorage.getItem('selectedProjectId') || null;
  });
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [hasCheckedProjects, setHasCheckedProjects] = useState(false);

  const { products, loading, loadProducts, removeProduct, deleting } = useProducts();
  const { projects, loadProjects } = useProjects();
  const { toast } = useNotifications();
  const navigate = useNavigate();

  // Projects are loaded by Navigation component, no need to load here

  useEffect(() => {
    // Listen for localStorage changes (from Navigation header)
    const handleStorageChange = () => {
      const newProjectId = localStorage.getItem('selectedProjectId');
      if (newProjectId !== selectedProjectId) {
        setSelectedProjectId(newProjectId);
      }
    };

    // Check for changes periodically (storage event doesn't fire in same tab)
    const interval = setInterval(handleStorageChange, 500);
    
    return () => clearInterval(interval);
  }, [selectedProjectId]);

  useEffect(() => {
    // Show modal if no project is selected and projects are loaded
    if (projects.length > 0 && !hasCheckedProjects) {
      setHasCheckedProjects(true);
      if (!selectedProjectId) {
        setShowProjectModal(true);
      } else {
        // Verify the selected project still exists
        const projectExists = projects.some(p => p.id === selectedProjectId);
        if (!projectExists) {
          localStorage.removeItem('selectedProjectId');
          setSelectedProjectId(null);
          setShowProjectModal(true);
        }
      }
    }
  }, [projects, selectedProjectId, hasCheckedProjects]);

  useEffect(() => {
    // Load products when project is selected
    if (selectedProjectId) {
      loadProducts({ projectId: selectedProjectId });
    }
  }, [selectedProjectId]);

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    localStorage.setItem('selectedProjectId', projectId);
    setShowProjectModal(false);
    toast('Project selected successfully', 'success');
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await removeProduct(productId);
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const handleDuplicateProduct = (product) => {
    // Navigate to create form with pre-filled data
    navigate('/products/new', { 
      state: { 
        duplicateFrom: product 
      } 
    });
  };

  // Filter and sort products
  const filteredProducts = (products || [])
    .filter(product => {
      const matchesSearch = product.shortName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.targetAudience?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.shortName || '').localeCompare(b.shortName || '');
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

  const ProductCard = ({ product }) => {
    const truncateText = (text, maxLength = 150) => {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };

    const header = (
      <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
        <ThemeIcon 
          size="sm" 
          variant="light" 
          color="violet"
          radius="xl"
        >
          <IconBusiness size={16} />
        </ThemeIcon>
        <Text fw={600} size="sm" lineClamp={1} style={{ flex: 1 }}>
          {product.shortName}
          {product.majorVersion !== undefined && (
            <Text span c="dimmed" size="xs">
              {' '}v{product.majorVersion}.{product.minorVersion}
            </Text>
          )}
        </Text>
      </Group>
    );

    const contentSection = (
      <Stack gap="xs">
        {/* Product description */}
        <Text size="sm" c="dimmed" lineClamp={3}>
          {truncateText(product.product)}
        </Text>

        {/* Token usage */}
        {product.totalTokensUsed && (
          <Text size="xs" c="dimmed">
            {product.totalTokensUsed.toLocaleString()} tokens used
          </Text>
        )}
      </Stack>
    );

    const menuItems = [
      {
        icon: <IconEdit size={16} />,
        label: 'Edit',
        onClick: () => navigate(`/products/${product._id}/edit`)
      },
      {
        icon: <IconCopy size={16} />,
        label: 'Duplicate',
        onClick: () => handleDuplicateProduct(product)
      },
      {
        icon: <IconDelete size={16} />,
        label: 'Delete',
        color: 'red',
        onClick: () => handleDeleteProduct(product._id)
      }
    ];

    return (
      <ListCard
        navigateTo={`/products/${product._id}`}
        header={header}
        content={contentSection}
        date={product.createdAt}
        menuItems={menuItems}
      />
    );
  };

  return (
    <PageTransition>
      <>
        {/* Project Selection Modal */}
        <ProjectSelectionModal
          opened={showProjectModal}
          onClose={() => {
            if (selectedProjectId) {
              setShowProjectModal(false);
            }
          }}
          onSelect={handleProjectSelect}
          projects={projects}
          selectedProjectId={selectedProjectId}
          description="Please select a project to view and manage products"
          noProjectsMessage="You need to create a project first before managing products."
          createButtonPath="/projects/new"
        />

        <Stack gap="xl">
          {/* Search and Filters */}
          {selectedProjectId && (
            <Box>
              <Group gap="sm" align="center">
                <TextInput
                  placeholder="Search products by name or description..."
                  leftSection={<IconSearch size={18} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="md"
                  styles={{
                    root: { flex: 1 },
                    input: {
                      '&:focus': {
                        borderColor: 'var(--mantine-color-violet-5)'
                      }
                    }
                  }}
                />
                <Group gap="xs" visibleFrom="sm">
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    data={[
                      { value: 'recent', label: 'Most Recent' },
                      { value: 'oldest', label: 'Oldest First' },
                      { value: 'name', label: 'Name (A-Z)' }
                    ]}
                    size="md"
                    w={160}
                    styles={{
                      input: {
                        '&:focus': {
                          borderColor: 'var(--mantine-color-violet-5)'
                        }
                      }
                    }}
                  />
                </Group>
              </Group>
            </Box>
          )}

          {/* Products Grid */}
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
                    Please select a project to view and manage your products
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
          ) : filteredProducts.length === 0 ? (
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
                  <IconBusiness
                    size={48}
                    style={{color: "var(--mantine-color-violet-5)"}}
                  />
                </Box>
                <Box ta="center">
                  <Text size="lg" fw={600} mb={8}>
                    No products found
                  </Text>
                  <Text c="dimmed" size="sm" maw={400}>
                    {searchTerm 
                      ? `No products match "${searchTerm}". Try a different search term.`
                      : 'Create your first product to start defining your brand'}
                  </Text>
                </Box>
                {!searchTerm && (
                  <Button
                    component={Link}
                    to="/products/new"
                    leftSection={<IconAI size={18} />}
                    size="md"
                    variant="gradient"
                    gradient={{from: "violet", to: "grape", deg: 135}}
                  >
                    Create Your First Product
                  </Button>
                )}
              </Stack>
            </Center>
          ) : (
            <SimpleGrid cols={{base: 1, sm: 2, lg: 3}} spacing="lg">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </SimpleGrid>
          )}
        </Stack>

        {/* Floating Action Button */}
        <FloatingActionButton
          to="/products/new"
          icon={IconPlus}
          label="Create Product"
          hidden={showProjectModal || showProjectModalGlobal}
        />
      </>
    </PageTransition>
  );
};

export default ProductsList;