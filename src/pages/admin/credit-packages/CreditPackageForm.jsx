import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Group,
  Stack,
  Title,
  Text,
  Box,
  Grid,
  Skeleton,
  Alert,
  Select
} from '@mantine/core';
import {
  MdSave,
  MdCancel
} from 'react-icons/md';
import creditPackagesService from '../../../services/creditPackagesService';
import plansService from '../../../services/plansService';
import { useNotifications } from '../../../hooks/useNotifications';

const CreditPackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useNotifications();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    credits: 1000,
    price: 0,
    planId: '',
    metadata: {}
  });

  useEffect(() => {
    loadPlans();
    if (isEditing) {
      loadPackage();
    }
  }, [id]);

  const loadPlans = async () => {
    try {
      const data = await plansService.getPlans(false); // Only active plans
      setPlans(data);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const loadPackage = async () => {
    try {
      setLoading(true);
      const pkg = await creditPackagesService.getCreditPackage(id);
      // Only set the fields we can edit
      // Handle planId as either an object or string
      let planIdValue = '';
      if (pkg.planId) {
        planIdValue = typeof pkg.planId === 'object' ? pkg.planId._id : pkg.planId;
      }

      setFormData({
        name: pkg.name || '',
        description: pkg.description || '',
        credits: pkg.credits || 1000,
        price: pkg.price || 0,
        planId: planIdValue,
        metadata: pkg.metadata || {}
      });
    } catch (error) {
      toast('Failed to load credit package', 'error');
      navigate('/control/credit-packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Only send the fields that the API accepts
      const submitData = {
        name: formData.name,
        description: formData.description,
        credits: formData.credits,
        price: formData.price,
        planId: formData.planId || "",  // Send empty string to de-assign
        metadata: formData.metadata || {}
      };

      if (isEditing) {
        await creditPackagesService.updateCreditPackage(id, submitData);
        toast('Credit package updated successfully', 'success');
      } else {
        await creditPackagesService.createCreditPackage(submitData);
        toast('Credit package created successfully', 'success');
      }
      navigate('/control/credit-packages');
    } catch (error) {
      toast(error.response?.data?.message || 'Failed to save credit package', 'error');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <Stack gap="lg">
        <Skeleton height={60} />
        <Skeleton height={600} />
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between">
          <Box>
            <Title order={2} mb={4}>
              {isEditing ? 'Edit Credit Package' : 'Create Credit Package'}
            </Title>
            <Text c="dimmed" size="sm">
              {isEditing ? 'Update credit package details' : 'Set up a new credit package offer'}
            </Text>
          </Box>
          <Group>
            <Button
              variant="subtle"
              onClick={() => navigate('/control/credit-packages')}
            >
              <MdCancel size={16} style={{ marginRight: 8 }} />
              Cancel
            </Button>
            <Button
              type="submit"
              loading={saving}
              variant="gradient"
              gradient={{ from: 'green', to: 'teal' }}
            >
              <MdSave size={16} style={{ marginRight: 8 }} />
              {isEditing ? 'Update Package' : 'Create Package'}
            </Button>
          </Group>
        </Group>

        {/* Basic Information */}
        <Card shadow="sm" radius="md" withBorder>
          <Title order={4} mb="md">Package Details</Title>
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Package Name"
                placeholder="e.g., Starter Pack - 1000 Credits"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Description"
                placeholder="Describe what this package offers"
                required
                minRows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Select
                label="Associated Plan (Optional)"
                placeholder="Select a plan to associate with this package"
                clearable
                searchable
                value={formData.planId}
                onChange={(value) => setFormData({ ...formData, planId: value || "" })}
                data={plans.map(plan => ({
                  value: plan._id,
                  label: `${plan.name} - ${plan.billingCycle} (${plan.currency} ${plan.price})`
                }))}
                description="Link this credit package to a subscription plan. Clear to make it unassigned."
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Credits"
                placeholder="Number of credits"
                required
                min={1}
                value={formData.credits}
                onChange={(value) => setFormData({ ...formData, credits: value })}
                thousandSeparator=","
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Price"
                precision={2}
                min={0}
                required
                value={formData.price}
                onChange={(value) => setFormData({ ...formData, price: value })}
                thousandSeparator=","
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Info Alert */}
        <Alert color="blue">
          <Text size="sm">
            Credit packages allow customers to purchase credits in bulk.
            The system automatically manages package status, discounts, and display order.
          </Text>
        </Alert>
      </Stack>
    </form>
  );
};

export default CreditPackageForm;