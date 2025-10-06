import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Button,
  Box,
  ThemeIcon,
  Loader,
  Center,
  Badge,
  Divider,
  Paper
} from '@mantine/core';
import {
  MdCheckCircle as IconCheck,
  MdDashboard as IconDashboard,
  MdRocket as IconRocket,
  MdEmail as IconEmail
} from 'react-icons/md';
import { updateProject } from '../../store/slices/projectsSlice';
import { updateUserSubscription } from '../../store/slices/authSlice';
import * as projectsService from '../../services/projects';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const processPaymentSuccess = async () => {
      if (!orderId) {
        navigate('/dashboard');
        return;
      }

      try {
        // Get order details from localStorage or make API call
        const storedOrder = localStorage.getItem(`order_${orderId}`);
        if (storedOrder) {
          const order = JSON.parse(storedOrder);
          setOrderDetails(order);

          // Update project with active version
          if (order.projectId && order.versionId) {
            const updatedProject = await projectsService.updateProjectActiveVersion(
              order.projectId,
              order.versionId
            );
            dispatch(updateProject({
              projectId: order.projectId,
              updates: { activeVersionId: order.versionId }
            }));
          }

          // Update user subscription
          const subscriptionData = {
            plan: 'pro',
            status: 'active',
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          };
          dispatch(updateUserSubscription(subscriptionData));

          // Clean up localStorage
          localStorage.removeItem(`order_${orderId}`);
        }
      } catch (error) {
        console.error('Error processing payment success:', error);
      } finally {
        setLoading(false);
      }
    };

    processPaymentSuccess();
  }, [orderId, navigate, dispatch]);

  const handleContinue = () => {
    if (orderDetails?.projectId) {
      navigate(`/projects/${orderDetails.projectId}`);
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <Container size="sm" py="xl">
        <Center style={{ minHeight: '400px' }}>
          <Stack align="center">
            <Loader size="lg" variant="bars" color="violet" />
            <Text size="sm" c="dimmed">Processing your payment...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl" align="center">
        <Card shadow="lg" p="xl" radius="md" withBorder style={{ width: '100%', maxWidth: '500px' }}>
          <Stack align="center" gap="lg">
            {/* Success Icon */}
            <ThemeIcon
              size={80}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'green', to: 'teal', deg: 45 }}
            >
              <IconCheck size={40} />
            </ThemeIcon>

            {/* Success Title */}
            <Box ta="center">
              <Title order={2} mb="xs">Payment Successful!</Title>
              <Text c="dimmed" size="sm">
                Your payment has been processed successfully
              </Text>
            </Box>

            {/* Order Details */}
            {orderDetails && (
              <Paper p="md" radius="md" withBorder style={{ width: '100%' }} bg="gray.0">
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Group>
                      <ThemeIcon size="sm" radius="md" variant="light" color="violet">
                        <IconRocket size={16} />
                      </ThemeIcon>
                      <Text fw={600} size="sm">Order Details</Text>
                    </Group>
                    <Badge color="green" variant="light" size="sm">
                      COMPLETED
                    </Badge>
                  </Group>

                  <Divider />

                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Order ID:</Text>
                      <Text size="sm" fw={500}>{orderId?.slice(0, 8)}...</Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Amount:</Text>
                      <Text size="sm" fw={600} c="violet">
                        ${orderDetails.amount ? (orderDetails.amount / 100).toFixed(2) : '0.00'}
                      </Text>
                    </Group>

                    {orderDetails.projectName && (
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Project:</Text>
                        <Text size="sm" fw={500}>{orderDetails.projectName}</Text>
                      </Group>
                    )}
                  </Stack>
                </Stack>
              </Paper>
            )}

            {/* Action Button */}
            <Button
              fullWidth
              size="lg"
              onClick={handleContinue}
              leftSection={<IconDashboard size={20} />}
              variant="gradient"
              gradient={{ from: 'violet', to: 'grape', deg: 45 }}
            >
              Continue to {orderDetails?.projectId ? 'Project' : 'Dashboard'}
            </Button>

            {/* Email Notification */}
            <Group gap="xs" opacity={0.7}>
              <IconEmail size={16} />
              <Text size="xs" c="dimmed">
                A confirmation email has been sent to your registered email address
              </Text>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}