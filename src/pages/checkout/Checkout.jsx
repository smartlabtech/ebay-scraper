import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Button,
  Badge,
  Alert,
  Box,
  Divider,
  SimpleGrid,
  ThemeIcon,
  Loader,
  Center,
  Progress,
  Paper
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  MdCheckCircle as IconCheck,
  MdError as IconError,
  MdInfo as IconInfo,
  MdWarning as IconWarning,
  MdCreditCard as IconCreditCard,
  MdAccessTime as IconTime,
  MdShoppingCart as IconCart,
  MdRocket as IconRocket,
  MdDashboard as IconDashboard
} from 'react-icons/md';
import axiosInstance from '../../api/axios';
import ordersService from '../../services/ordersService';

const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Use the deduplicated service method instead of direct API call
        const orderData = await ordersService.getOrderById(orderId);
        setOrder(orderData);

        // Calculate time remaining if order has expiration
        if (orderData.expiresAt) {
          const expiresAt = new Date(orderData.expiresAt);
          const now = new Date();
          const diff = expiresAt - now;

          if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeRemaining({ hours, minutes, seconds });
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(error.response?.data?.message || 'Failed to load order details');

        // If order not found, redirect to dashboard
        if (error.response?.status === 404) {
          notifications.show({
            title: 'Order Not Found',
            message: 'The order you are looking for does not exist.',
            color: 'red',
            icon: <IconError />
          });
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, navigate]);

  // Update countdown timer
  useEffect(() => {
    if (!order?.expiresAt) return;

    // Don't run timer for completed or failed orders
    if (order.status === 'completed' || order.status === 'failed') return;

    const interval = setInterval(() => {
      const expiresAt = new Date(order.expiresAt);
      const now = new Date();
      const diff = expiresAt - now;

      if (diff <= 0) {
        setTimeRemaining(null);
        clearInterval(interval);

        // Only show expiration notification if order is still pending
        if (order.status === 'pending') {
          // Show expiration notification
          notifications.show({
            title: 'Order Expired',
            message: 'This order has expired. Please create a new order.',
            color: 'red',
            icon: <IconWarning />
          });

          // Redirect to billing page
          setTimeout(() => navigate('/settings/billing'), 3000);
        }
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order, navigate]);

  // Handle checkout creation (generate payment link)
  const handleCreateCheckout = async () => {
    setCreatingCheckout(true);
    try {
      const response = await axiosInstance.post(`/en/payment/checkout/${orderId}`);

      if (response.data.paymentUrl) {
        notifications.show({
          title: 'Redirecting to Payment',
          message: 'You will be redirected to complete your payment.',
          color: 'blue',
          icon: <IconInfo />
        });

        // Redirect to payment URL
        setTimeout(() => {
          window.location.href = response.data.paymentUrl;
        }, 1500);
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      notifications.show({
        title: 'Checkout Error',
        message: error.response?.data?.message || 'Failed to create checkout. Please try again.',
        color: 'red',
        icon: <IconError />
      });
    } finally {
      setCreatingCheckout(false);
    }
  };

  // Handle payment completion (if order already has payment URL)
  const handleCompletePayment = () => {
    if (order?.paymentUrl) {
      window.location.href = order.paymentUrl;
    }
  };

  if (loading) {
    return (
      <Container size="sm" py="xl">
        <Center style={{ minHeight: '400px' }}>
          <Stack align="center">
            <Loader size="lg" variant="bars" color="violet" />
            <Text size="sm" c="dimmed">Loading order details...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (error && !order) {
    return (
      <Container size="sm" py="xl">
        <Alert icon={<IconError />} color="red" variant="filled" radius="md">
          <Text fw={500}>{error}</Text>
        </Alert>
      </Container>
    );
  }

  if (!order) {
    return null;
  }

  const isExpired = !timeRemaining && order.expiresAt && order.status !== 'completed';
  const isPlanOrder = order.items?.[0]?.type === 'plan';
  const isCreditOrder = order.items?.[0]?.type === 'credits';

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl" align="center">
        {/* Header */}
        <Box style={{ width: '100%', maxWidth: '500px' }}>
          <Group justify="space-between" align="flex-start" mb="md">
            <Box>
              <Title order={2} mb="xs">Complete Your Order</Title>
              <Text c="dimmed">Order #{order.orderNumber}</Text>
            </Box>
            <Badge
              size="lg"
              variant="filled"
              color={
                order.status === 'completed' ? 'green' :
                order.status === 'processing' ? 'blue' :
                order.status === 'failed' ? 'red' :
                isExpired ? 'gray' : 'orange'
              }
            >
              {isExpired ? 'EXPIRED' : order.status.toUpperCase()}
            </Badge>
          </Group>

          {/* Time remaining warning */}
          {timeRemaining && !isExpired && order.status !== 'completed' && (
            <Alert
              icon={<IconTime />}
              color={timeRemaining.hours === 0 && timeRemaining.minutes < 10 ? 'red' : 'yellow'}
              variant="light"
              radius="md"
            >
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  Time remaining to complete payment
                </Text>
                <Badge size="lg" color={timeRemaining.hours === 0 && timeRemaining.minutes < 10 ? 'red' : 'yellow'}>
                  {String(timeRemaining.hours).padStart(2, '0')}:
                  {String(timeRemaining.minutes).padStart(2, '0')}:
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </Badge>
              </Group>
              {timeRemaining.hours === 0 && timeRemaining.minutes < 10 && (
                <Progress
                  value={(timeRemaining.minutes * 60 + timeRemaining.seconds) / 600 * 100}
                  color="red"
                  size="xs"
                  mt="xs"
                  animated
                />
              )}
            </Alert>
          )}

          {/* Expired warning */}
          {isExpired && (
            <Alert
              icon={<IconWarning />}
              color="red"
              variant="filled"
              radius="md"
            >
              <Text fw={500}>This order has expired</Text>
              <Text size="sm" mt="xs">
                Please create a new order from the billing page.
              </Text>
            </Alert>
          )}
        </Box>

        {/* Order Details */}
        <Card shadow="lg" p="xl" radius="md" withBorder style={{ width: '100%', maxWidth: '500px' }}>
          <Stack gap="lg">
            <Group justify="space-between" align="center">
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="violet">
                  {isPlanOrder ? <IconRocket size={24} /> : <IconCart size={24} />}
                </ThemeIcon>
                <Box>
                  <Text fw={600} size="lg">Order Summary</Text>
                  <Text size="sm" c="dimmed">
                    {isPlanOrder ? 'Subscription Plan' : isCreditOrder ? 'Credit Package' : 'Order'}
                  </Text>
                </Box>
              </Group>
            </Group>

            <Divider />

            {/* Order Items */}
            <Box>
              {order.items?.map((item, index) => (
                <Paper key={index} p="md" radius="md" withBorder mb="sm">
                  <Group justify="space-between">
                    <Box>
                      <Text fw={500}>
                        {item.metadata?.planName || item.productName || item.name || 'Product'}
                      </Text>
                      {(order.metadata?.planCredits || item.metadata?.planCredits) && (
                        <Badge variant="light" color="violet" size="sm" mt="xs">
                          {(order.metadata?.planCredits || item.metadata?.planCredits).toLocaleString()} credits
                        </Badge>
                      )}
                    </Box>
                    <Text fw={600} size="lg">
                      ${item.totalPrice.toFixed(2)}
                    </Text>
                  </Group>
                </Paper>
              ))}
            </Box>

            {/* Action Buttons */}
            <Box mt="md">
              {!isExpired && order.status === 'pending' && (
                <>
                  {order.paymentUrl ? (
                    <Button
                      fullWidth
                      size="lg"
                      leftSection={<IconCreditCard size={20} />}
                      onClick={handleCompletePayment}
                      variant="gradient"
                      gradient={{ from: 'violet', to: 'grape', deg: 45 }}
                    >
                      Complete Payment
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      size="lg"
                      leftSection={<IconCreditCard size={20} />}
                      onClick={handleCreateCheckout}
                      loading={creatingCheckout}
                      disabled={creatingCheckout}
                      variant="gradient"
                      gradient={{ from: 'violet', to: 'grape', deg: 45 }}
                    >
                      {creatingCheckout ? 'Creating Checkout...' : 'Proceed to Payment'}
                    </Button>
                  )}
                </>
              )}

              {(isExpired || order.status === 'failed') && (
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => navigate('/settings/billing')}
                  variant="light"
                  color="violet"
                >
                  Return to Billing
                </Button>
              )}

              {order.status === 'completed' && (
                <>
                  <Alert icon={<IconCheck />} color="green" variant="light" radius="md" mb="md">
                    <Text fw={500}>Payment Successful!</Text>
                    <Text size="sm" mt="xs">
                      Your order has been completed successfully.
                    </Text>
                  </Alert>
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => navigate('/dashboard')}
                    leftSection={<IconDashboard size={20} />}
                    variant="gradient"
                    gradient={{ from: 'violet', to: 'grape', deg: 45 }}
                  >
                    Go to Dashboard
                  </Button>
                </>
              )}
            </Box>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default Checkout;