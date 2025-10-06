import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Title,
  TextInput,
  Select,
  Button,
  Stack,
  Group,
  Alert,
  LoadingOverlay,
  Grid,
  Switch,
  Box,
  Text,
  Card
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { MdError, MdSave, MdCancel, MdArrowBack, MdLanguage as IconDomain } from 'react-icons/md';
import { useProjects } from '../../hooks/useProjects';
import { useNotifications } from '../../hooks/useNotifications';

const EditProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { loadProject, updateExistingProject, loading } = useProjects();
  const { notifySuccess, notifyError } = useNotifications();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const form = useForm({
    initialValues: {
      businessName: '',
      priceRange: 'affordable',
      businessGoal: 'grow-revenue',
      location: '',
      businessStage: 'just-starting',
      domainName: '',
      public: false
    },
    validate: {
      businessName: (value) => (!value ? 'Business name is required' : null),
      location: (value) => (!value ? 'Location is required' : null),
      domainName: (value) => {
        if (!value) return null; // Optional field
        // Basic domain validation
        const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        return !domainRegex.test(value) ? 'Please enter a valid domain name (e.g., example.com)' : null;
      }
    }
  });

  // Load project data
  useEffect(() => {
    let isMounted = true;
    
    const fetchProject = async () => {
      try {
        const projectData = await loadProject(projectId);
        
        if (isMounted) {
          setProject(projectData);
          
          // Set form values from project data
          if (projectData) {
            form.setValues({
              businessName: projectData.businessName || '',
              priceRange: projectData.priceRange || 'affordable',
              businessGoal: projectData.businessGoal || 'grow-revenue',
              location: projectData.location || '',
              businessStage: projectData.businessStage || 'just-starting',
              domainName: projectData.domainName || '',
              public: projectData.privacy === 'public'
            });
          }
        }
      } catch (error) {
        if (isMounted) {
          setLoadError('Failed to load project');
          notifyError('Failed to load project');
        }
      }
    };

    if (projectId) {
      fetchProject();
    }
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]); // Remove unstable dependencies

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      // Format update data
      const updateData = {
        details: {
          businessName: values.businessName,
          priceRange: values.priceRange,
          businessGoal: values.businessGoal,
          location: values.location,
          businessStage: values.businessStage,
          domainName: values.domainName
        },
        public: values.public
      };

      await updateExistingProject(projectId, updateData);
      notifySuccess('Project updated successfully');
      navigate('/projects');
    } catch (error) {
      notifyError('Failed to update project');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loadError) {
    return (
      <Stack gap="xl" py="xl">
        <Alert icon={<MdError size={16} />} title="Error" color="red">
          {loadError}
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <LoadingOverlay visible={loading || submitLoading} overlayProps={{ radius: "sm", blur: 2 }} />
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xl">
          {/* Business Information */}
            <Card shadow="sm" p="xl" radius="lg" withBorder>
              <Title order={4} mb="lg">Business Information</Title>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Business Name"
                    placeholder="Enter your business name"
                    required
                    size="md"
                    styles={{
                      input: {
                        '&:focus': {
                          borderColor: 'var(--mantine-color-violet-5)'
                        }
                      }
                    }}
                    {...form.getInputProps('businessName')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Location"
                    placeholder="e.g., New York, USA"
                    required
                    size="md"
                    styles={{
                      input: {
                        '&:focus': {
                          borderColor: 'var(--mantine-color-violet-5)'
                        }
                      }
                    }}
                    {...form.getInputProps('location')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12 }}>
                  <TextInput
                    label="Domain Name"
                    placeholder="example.com (optional)"
                    description="Your business website domain"
                    size="md"
                    leftSection={<IconDomain size={16} />}
                    styles={{
                      input: {
                        '&:focus': {
                          borderColor: 'var(--mantine-color-violet-5)'
                        }
                      }
                    }}
                    {...form.getInputProps('domainName')}
                  />
                </Grid.Col>
              </Grid>
            </Card>

            {/* Business Attributes */}
            <Card shadow="sm" p="xl" radius="lg" withBorder>
              <Title order={4} mb="lg">Business Attributes</Title>
              <Grid gutter="md">
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Select
                      label="Price Range"
                      placeholder="Select price range"
                      size="md"
                      data={[
                        { value: 'budget', label: 'Budget-friendly' },
                        { value: 'affordable', label: 'Affordable' },
                        { value: 'premium', label: 'Premium' },
                        { value: 'luxury', label: 'Luxury' }
                      ]}
                      styles={{
                        input: {
                          '&:focus': {
                            borderColor: 'var(--mantine-color-violet-5)'
                          }
                        }
                      }}
                      {...form.getInputProps('priceRange')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Select
                      label="Business Goal"
                      placeholder="Select your primary goal"
                      size="md"
                      data={[
                        { value: 'grow-revenue', label: 'Grow Revenue' },
                        { value: 'increase-awareness', label: 'Increase Brand Awareness' },
                        { value: 'improve-retention', label: 'Improve Customer Retention' },
                        { value: 'expand-market', label: 'Expand to New Markets' }
                      ]}
                      styles={{
                        input: {
                          '&:focus': {
                            borderColor: 'var(--mantine-color-violet-5)'
                          }
                        }
                      }}
                      {...form.getInputProps('businessGoal')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Select
                      label="Business Stage"
                      placeholder="Select business stage"
                      size="md"
                      data={[
                        { value: 'just-starting', label: 'Just Starting' },
                        { value: 'early-stage', label: 'Early Stage' },
                        { value: 'growth-stage', label: 'Growth Stage' },
                        { value: 'established', label: 'Established' }
                      ]}
                      styles={{
                        input: {
                          '&:focus': {
                            borderColor: 'var(--mantine-color-violet-5)'
                          }
                        }
                      }}
                      {...form.getInputProps('businessStage')}
                    />
                  </Grid.Col>
              </Grid>
            </Card>

            {/* Project Settings */}
            <Card shadow="sm" p="xl" radius="lg" withBorder>
              <Title order={4} mb="lg">Project Settings</Title>
              <Switch
                label="Make this project public"
                description="Public projects can be viewed by anyone with the link"
                size="md"
                {...form.getInputProps('public', { type: 'checkbox' })}
              />
            </Card>

            {/* Action Buttons */}
            <Group justify="flex-end">
              <Button
                variant="subtle"
                size="md"
                leftSection={<MdCancel size={18} />}
                onClick={() => navigate('/projects')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="md"
                variant="gradient"
                gradient={{ from: 'violet', to: 'grape', deg: 135 }}
                leftSection={<MdSave size={18} />}
                loading={submitLoading}
                styles={{
                  root: {
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'translateY(-1px)' }
                  }
                }}
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
    </Stack>
  );
};

export default EditProject;