import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Switch,
  Button,
  Group,
  Stack,
  Title,
  Text,
  Box,
  Grid,
  Divider,
  Skeleton,
  Alert
} from '@mantine/core';
import {
  MdSave,
  MdCancel,
  MdInfo
} from 'react-icons/md';
import plansService from '../../../services/plansService';
import { useNotifications } from '../../../hooks/useNotifications';

const PlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useNotifications();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    icon: 'starter',
    creditValidityDays: 30,
    credits: 1000,
    maxProjects: 5,
    maxBrandMessages: 50,
    maxProductVersions: 10,
    supportLevel: 'basic',
    apiAccess: false,
    customBranding: false,
    teamMembers: 1,
    features: [],
    highlightedFeatures: [],
    trialDays: 0,
    noticePeriod: 7,
    isActive: true,
    isDefault: false,
    sortOrder: 0,
    showInLandingPage: true,
    showInUserAccount: true,
    metadata: {
      isPopular: false
    }
  });

  useEffect(() => {
    if (isEditing) {
      loadPlan();
    }
  }, [id]);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const plan = await plansService.getPlan(id);
      setFormData(plan);
    } catch (error) {
      toast('Failed to load plan', 'error');
      navigate('/control/plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the form data to debug
    console.log('Form data before submit:', formData);

    try {
      setSaving(true);
      if (isEditing) {
        // For updates, only send the editable fields
        // Note: currency and billingCycle cannot be changed after creation
        const updateData = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          icon: formData.icon,
          creditValidityDays: formData.creditValidityDays,
          credits: formData.credits,
          maxProjects: formData.maxProjects,
          maxBrandMessages: formData.maxBrandMessages,
          maxProductVersions: formData.maxProductVersions,
          supportLevel: formData.supportLevel,
          apiAccess: formData.apiAccess,
          customBranding: formData.customBranding,
          teamMembers: formData.teamMembers,
          features: formData.features,
          highlightedFeatures: formData.highlightedFeatures,
          trialDays: formData.trialDays,
          noticePeriod: formData.noticePeriod,
          isActive: formData.isActive,
          isDefault: formData.isDefault,
          sortOrder: formData.sortOrder,
          showInLandingPage: formData.showInLandingPage,
          showInUserAccount: formData.showInUserAccount,
          metadata: formData.metadata
        };
        await plansService.updatePlan(id, updateData);
        toast('Plan updated successfully', 'success');
      } else {
        await plansService.createPlan(formData);
        toast('Plan created successfully', 'success');
      }
      navigate('/control/plans');
    } catch (error) {
      toast(error.response?.data?.message || 'Failed to save plan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addFeature = (feature) => {
    if (feature && !formData.features.includes(feature)) {
      setFormData({
        ...formData,
        features: [...formData.features, feature]
      });
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const addHighlightedFeature = (feature) => {
    if (feature && !formData.highlightedFeatures.includes(feature)) {
      setFormData({
        ...formData,
        highlightedFeatures: [...formData.highlightedFeatures, feature]
      });
    }
  };

  const removeHighlightedFeature = (index) => {
    setFormData({
      ...formData,
      highlightedFeatures: formData.highlightedFeatures.filter((_, i) => i !== index)
    });
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
              {isEditing ? 'Edit Plan' : 'Create New Plan'}
            </Title>
            <Text c="dimmed" size="sm">
              {isEditing ? 'Update subscription plan details' : 'Set up a new subscription plan'}
            </Text>
          </Box>
          <Group>
            <Button
              variant="subtle"
              leftSection={<MdCancel size={16} />}
              onClick={() => navigate('/control/plans')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={saving}
              leftSection={<MdSave size={16} />}
              variant="gradient"
              gradient={{ from: 'violet', to: 'grape' }}
            >
              {isEditing ? 'Update Plan' : 'Create Plan'}
            </Button>
          </Group>
        </Group>

        {/* Basic Information */}
        <Card shadow="sm" radius="md" withBorder>
          <Title order={4} mb="md">Basic Information</Title>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Plan Name"
                placeholder="e.g., Professional"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Billing Cycle"
                required
                value={formData.billingCycle}
                onChange={(value) => setFormData({ ...formData, billingCycle: value })}
                disabled={isEditing}
                description={isEditing ? "Billing cycle cannot be changed after creation" : undefined}
                data={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' },
                  { value: 'lifetime', label: 'Lifetime' }
                ]}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Plan Icon"
                required
                value={formData.icon}
                onChange={(value) => setFormData({ ...formData, icon: value })}
                data={[
                  { value: 'starter', label: 'Starter' },
                  { value: 'professional', label: 'Professional' },
                  { value: 'business', label: 'Business' },
                  { value: 'enterprise', label: 'Enterprise' },
                  { value: 'custom', label: 'Custom' }
                ]}
                description="Select an icon to represent this plan"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Credit Validity Days"
                min={1}
                max={365}
                required
                value={formData.creditValidityDays}
                onChange={(value) => setFormData({ ...formData, creditValidityDays: value })}
                description="How many days credits remain valid after purchase"
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Description"
                placeholder="Describe what this plan offers"
                required
                minRows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Pricing */}
        <Card shadow="sm" radius="md" withBorder>
          <Title order={4} mb="md">Pricing</Title>
          <Grid>
            <Grid.Col span={4}>
              <NumberInput
                label="Price"
                precision={2}
                min={0}
                required
                value={formData.price}
                onChange={(value) => setFormData({ ...formData, price: value })}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Currency"
                required
                value={formData.currency}
                onChange={(value) => setFormData({ ...formData, currency: value })}
                disabled={isEditing}
                description={isEditing ? "Currency cannot be changed after creation" : undefined}
                data={[
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                  { value: 'GBP', label: 'GBP (£)' },
                  { value: 'AED', label: 'AED (د.إ)' }
                ]}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Trial Days"
                min={0}
                max={90}
                value={formData.trialDays}
                onChange={(value) => setFormData({ ...formData, trialDays: value })}
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Features */}
        <Card shadow="sm" radius="md" withBorder>
          <Title order={4} mb="md">Features & Limits</Title>
          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Credits"
                description="Set to -1 for unlimited"
                min={-1}
                required
                value={formData.credits}
                onChange={(value) => setFormData({ ...formData, credits: value })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Max Projects"
                description="Set to -1 for unlimited"
                min={-1}
                required
                value={formData.maxProjects}
                onChange={(value) => setFormData({ ...formData, maxProjects: value })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Max Brand Messages"
                description="Set to -1 for unlimited"
                min={-1}
                required
                value={formData.maxBrandMessages}
                onChange={(value) => setFormData({ ...formData, maxBrandMessages: value })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Max Product Versions"
                description="Set to -1 for unlimited"
                min={-1}
                required
                value={formData.maxProductVersions}
                onChange={(value) => setFormData({ ...formData, maxProductVersions: value })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Support Level"
                required
                value={formData.supportLevel}
                onChange={(value) => setFormData({ ...formData, supportLevel: value })}
                data={[
                  { value: 'basic', label: 'Basic' },
                  { value: 'priority', label: 'Priority' },
                  { value: 'dedicated', label: 'Dedicated' }
                ]}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Team Members"
                description="Set to -1 for unlimited"
                min={-1}
                required
                value={formData.teamMembers}
                onChange={(value) => setFormData({ ...formData, teamMembers: value })}
              />
            </Grid.Col>
          </Grid>

          <Divider my="md" />

          <Group>
            <Switch
              label="API Access"
              checked={formData.apiAccess}
              onChange={(e) => setFormData({ ...formData, apiAccess: e.currentTarget.checked })}
            />
            <Switch
              label="Custom Branding"
              checked={formData.customBranding}
              onChange={(e) => setFormData({ ...formData, customBranding: e.currentTarget.checked })}
            />
          </Group>
        </Card>

        {/* Features List */}
        <Card shadow="sm" radius="md" withBorder>
          <Title order={4} mb="md">Features List</Title>
          <Text size="sm" c="dimmed" mb="md">
            Add features that will be displayed to users
          </Text>
          <Stack gap="sm">
            {formData.features.map((feature, index) => (
              <Group key={index}>
                <TextInput
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...formData.features];
                    newFeatures[index] = e.target.value;
                    setFormData({ ...formData, features: newFeatures });
                  }}
                  style={{ flex: 1 }}
                />
                <Button
                  color="red"
                  variant="light"
                  onClick={() => removeFeature(index)}
                >
                  Remove
                </Button>
              </Group>
            ))}
            <Group>
              <TextInput
                placeholder="Add new feature"
                style={{ flex: 1 }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    addFeature(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <Button
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  if (input && input.value) {
                    addFeature(input.value);
                    input.value = '';
                  }
                }}
              >
                Add Feature
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Highlighted Features */}
        <Card shadow="sm" radius="md" withBorder>
          <Title order={4} mb="md">Highlighted Features</Title>
          <Text size="sm" c="dimmed" mb="md">
            These features will be emphasized in the UI
          </Text>
          <Stack gap="sm">
            {formData.highlightedFeatures.map((feature, index) => (
              <Group key={index}>
                <TextInput
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...formData.highlightedFeatures];
                    newFeatures[index] = e.target.value;
                    setFormData({ ...formData, highlightedFeatures: newFeatures });
                  }}
                  style={{ flex: 1 }}
                />
                <Button
                  color="red"
                  variant="light"
                  onClick={() => removeHighlightedFeature(index)}
                >
                  Remove
                </Button>
              </Group>
            ))}
            <Group>
              <TextInput
                placeholder="Add highlighted feature"
                style={{ flex: 1 }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    addHighlightedFeature(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <Button
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  if (input && input.value) {
                    addHighlightedFeature(input.value);
                    input.value = '';
                  }
                }}
              >
                Add Highlighted Feature
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Settings */}
        <Card shadow="sm" radius="md" withBorder>
          <Title order={4} mb="md">Settings</Title>
          <Grid>
            <Grid.Col span={4}>
              <NumberInput
                label="Notice Period (days)"
                min={0}
                max={90}
                value={formData.noticePeriod}
                onChange={(value) => setFormData({ ...formData, noticePeriod: value })}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Sort Order"
                description="Lower numbers appear first"
                min={0}
                value={formData.sortOrder}
                onChange={(value) => setFormData({ ...formData, sortOrder: value })}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Group>
                <Switch
                  label="Active"
                  description="Plan is available for purchase"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.currentTarget.checked })}
                />
                <Switch
                  label="Default Plan"
                  description="Automatically assigned to new users"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.currentTarget.checked })}
                />
                <Switch
                  label="Popular Plan"
                  description="Highlight as most popular option"
                  checked={formData.metadata?.isPopular || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      isPopular: e.currentTarget.checked
                    }
                  })}
                />
                <Switch
                  label="Show in Landing Page"
                  description="Display this plan on the public landing page"
                  checked={formData.showInLandingPage}
                  onChange={(e) => setFormData({ ...formData, showInLandingPage: e.currentTarget.checked })}
                />
                <Switch
                  label="Show in User Account"
                  description="Display this plan in user billing/subscription area"
                  checked={formData.showInUserAccount}
                  onChange={(e) => setFormData({ ...formData, showInUserAccount: e.currentTarget.checked })}
                />
              </Group>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Info Alert */}
        <Alert icon={<MdInfo size={16} />} color="blue">
          <Text size="sm">
            Plans with lower sort order values will appear first. Set features to -1 for unlimited access.
            Only one plan can be marked as default at a time.
          </Text>
        </Alert>
      </Stack>
    </form>
  );
};

export default PlanForm;