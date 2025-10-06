import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Title,
  Text,
  Stack,
  Group,
  Button,
  Badge,
  Card,
  Box,
  Alert,
  ThemeIcon,
  ActionIcon
} from '@mantine/core';
import {
  MdEdit as IconEdit,
  MdDelete as IconDelete,
  MdContentCopy as IconCopy,
  MdMessage as IconMessage,
  MdBusiness as IconBusiness,
  MdReportProblem as IconPain,
  MdStar as IconBenefit
} from 'react-icons/md';
import { useProducts } from '../../hooks/useProducts';
import { useNotifications } from '../../hooks/useNotifications';
import { PageTransition } from '../../components/ui/AnimatedElements';
import { format } from 'date-fns';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, loadProduct, loading, removeProduct, deleting } = useProducts();

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id, loadProduct]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await removeProduct(id);
        navigate('/products');
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const handleDuplicate = () => {
    navigate('/products/new', { 
      state: { 
        duplicateFrom: currentProduct 
      } 
    });
  };

  if (loading) {
    return (
      <PageTransition>
        <Box p="xl">
          <Text>Loading product details...</Text>
        </Box>
      </PageTransition>
    );
  }

  if (!currentProduct) {
    return (
      <PageTransition>
        <Alert color="red" title="Product Not Found">
          The requested product could not be found.
        </Alert>
      </PageTransition>
    );
  }

  const product = currentProduct;

  return (
    <PageTransition>
      <Stack gap="xl">
        {/* Header */}
        <Box>
          <Group justify="space-between" align="flex-start">
            <Box>
              <Group gap="xs" mb="xs">
                <ThemeIcon size="lg" variant="light" color="violet" radius="xl">
                  <IconBusiness size={24} />
                </ThemeIcon>
                <Title order={3}>{product.shortName}</Title>
                {product.majorVersion !== undefined && (
                  <Badge size="lg" variant="light" color="gray">
                    v{product.majorVersion}.{product.minorVersion}
                  </Badge>
                )}
              </Group>
              <Text c="dimmed" size="sm">
                Created {format(new Date(product.createdAt), 'MMM d, yyyy')}
                {product.updatedAt && product.updatedAt !== product.createdAt && (
                  <> • Updated {format(new Date(product.updatedAt), 'MMM d, yyyy')}</>
                )}
                {product.totalTokensUsed && (
                  <> • {product.totalTokensUsed.toLocaleString()} tokens used</>
                )}
              </Text>
            </Box>
            <Group>
              <Button
                leftSection={<IconMessage size={18} />}
                component={Link}
                to="/brand-messages/new"
                state={{ productId: product._id }}
              >
                Create Message
              </Button>
              <Button
                leftSection={<IconCopy size={18} />}
                variant="light"
                onClick={handleDuplicate}
              >
                Duplicate
              </Button>
              <Button
                leftSection={<IconEdit size={18} />}
                variant="light"
                component={Link}
                to={`/products/${product._id}/edit`}
              >
                Edit
              </Button>
              <ActionIcon
                variant="light"
                color="red"
                size="lg"
                onClick={handleDelete}
                loading={deleting}
              >
                <IconDelete size={18} />
              </ActionIcon>
            </Group>
          </Group>
        </Box>

        {/* Product Details */}
        <Stack gap="lg">
          {/* Product Description */}
          <Card padding="lg" radius="md" withBorder>
            <Text fw={600} size="sm" mb="xs">Product Description</Text>
            <Text>{product.product || 'No description provided'}</Text>
          </Card>

          {/* Problem You Solve */}
          {product.problemYouSolve && (
            <Card padding="lg" radius="md" withBorder>
              <Text fw={600} size="sm" mb="xs">Problem You Solve</Text>
              <Text>{product.problemYouSolve}</Text>
            </Card>
          )}

          {/* Unique Value */}
          {product.uniqueValue && (
            <Card padding="lg" radius="md" withBorder>
              <Text fw={600} size="sm" mb="xs">Unique Value Proposition</Text>
              <Text>{product.uniqueValue}</Text>
            </Card>
          )}

          {/* Target Audience */}
          {product.targetAudience && (
            <Card padding="lg" radius="md" withBorder>
              <Text fw={600} size="sm" mb="xs">Target Audience</Text>
              <Text>{product.targetAudience}</Text>
            </Card>
          )}

          {/* Pain Points */}
          {product.painPoints && product.painPoints.length > 0 && (
            <Card padding="lg" radius="md" withBorder>
              <Text fw={600} size="sm" mb="md">Pain Points</Text>
              <Stack gap="sm">
                {product.painPoints.map((point, index) => (
                  <Group key={index} align="flex-start">
                    <ThemeIcon color="red" variant="light" radius="xl" size="sm">
                      <IconPain size={14} />
                    </ThemeIcon>
                    <Text size="sm" style={{ flex: 1 }}>{point}</Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          )}

          {/* Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <Card padding="lg" radius="md" withBorder>
              <Text fw={600} size="sm" mb="md">Benefits</Text>
              <Stack gap="sm">
                {product.benefits.map((benefit, index) => (
                  <Group key={index} align="flex-start">
                    <ThemeIcon color="green" variant="light" radius="xl" size="sm">
                      <IconBenefit size={14} />
                    </ThemeIcon>
                    <Text size="sm" style={{ flex: 1 }}>{benefit}</Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          )}

          {/* Emotions */}
          {product.emotions && product.emotions.length > 0 && (
            <Card padding="lg" radius="md" withBorder>
              <Text fw={600} size="sm" mb="md">Emotions</Text>
              <Stack gap="sm">
                {product.emotions.map((emotion, index) => (
                  <Group key={index} align="flex-start">
                    <ThemeIcon color="violet" variant="light" radius="xl" size="sm">
                      <IconBenefit size={14} />
                    </ThemeIcon>
                    <Text size="sm" style={{ flex: 1 }}>{emotion}</Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          )}

          {/* Additional Information */}
          {product.additionalInfo && (
            <Card padding="lg" radius="md" withBorder>
              <Text fw={600} size="sm" mb="xs">Additional Information</Text>
              <Text c="dimmed">{product.additionalInfo}</Text>
            </Card>
          )}
        </Stack>
      </Stack>
    </PageTransition>
  );
};

export default ProductDetail;