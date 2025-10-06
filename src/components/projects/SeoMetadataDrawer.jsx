import React, { useState } from 'react';
import {
  Drawer,
  Stack,
  Title,
  Text,
  Button,
  Group,
  Paper,
  ActionIcon,
  TextInput,
  Textarea,
  LoadingOverlay,
  Alert,
  Badge,
  Box,
  Tooltip,
  TagsInput,
  Code
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  MdContentCopy,
  MdEdit,
  MdCheck,
  MdAutoAwesome,
  MdSave,
  MdCancel,
  MdSearch,
  MdTitle,
  MdDescription,
  MdTag
} from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { updateSeoMetadata } from '../../store/slices/projectsSlice';
import { useNotifications } from '../../hooks/useNotifications';

const SeoMetadataDrawer = ({ opened, onClose, project, brandMessageId }) => {
  const dispatch = useDispatch();
  const { notifySuccess, notifyError } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      keywords: []
    },
    validate: {
      title: (value) => {
        if (editMode && !value) return 'Title is required';
        if (editMode && value.length > 60) return 'Title should be under 60 characters';
        return null;
      },
      description: (value) => {
        if (editMode && !value) return 'Description is required';
        if (editMode && value.length > 160) return 'Description should be under 160 characters';
        return null;
      },
      keywords: (value) => {
        if (editMode && (!value || value.length === 0)) return 'At least one keyword is required';
        if (editMode && value.length > 10) return 'Maximum 10 keywords allowed';
        return null;
      }
    }
  });

  // Update form when drawer opens with a project
  React.useEffect(() => {
    if (opened && project?.seoMetadata) {
      form.setValues({
        title: project.seoMetadata.title || '',
        description: project.seoMetadata.description || '',
        keywords: project.seoMetadata.keywords || []
      });
    } else if (!opened) {
      form.reset();
      setEditMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, project?.id]);


  const handleSave = async (values) => {
    setLoading(true);
    try {
      await dispatch(updateSeoMetadata({ 
        projectId: project.id, 
        seoMetadata: values 
      })).unwrap();
      notifySuccess('SEO metadata updated successfully');
      setEditMode(false);
    } catch (error) {
      notifyError('Failed to update SEO metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (field, text) => {
    const textToCopy = Array.isArray(text) ? text.join(', ') : text;
    navigator.clipboard.writeText(textToCopy);
    setCopiedField(field);
    notifySuccess(`${field} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAsHtml = () => {
    const htmlMeta = `<title>${form.values.title}</title>
<meta name="description" content="${form.values.description}" />
<meta name="keywords" content="${form.values.keywords.join(', ')}" />`;
    
    navigator.clipboard.writeText(htmlMeta);
    notifySuccess('HTML meta tags copied to clipboard');
  };

  const hasSeoMetadata = project?.seoMetadata && (
    project.seoMetadata.title ||
    project.seoMetadata.description ||
    (project.seoMetadata.keywords && project.seoMetadata.keywords.length > 0)
  );

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group justify="space-between" style={{ width: '100%' }}>
          <Title order={3}>SEO Metadata</Title>
          {hasSeoMetadata && !editMode && (
            <ActionIcon
              variant="subtle"
              onClick={() => setEditMode(true)}
            >
              <MdEdit size={20} />
            </ActionIcon>
          )}
        </Group>
      }
      position="right"
      size="lg"
      padding="lg"
    >
      <LoadingOverlay visible={loading} />
      
      <Stack gap="lg">
        {!hasSeoMetadata ? (
          <Stack align="center" gap="lg" py="xl">
            <Box ta="center">
              <MdSearch size={48} style={{ color: 'var(--mantine-color-gray-5)' }} />
              <Title order={4} mt="md">No SEO Metadata Yet</Title>
              <Text size="sm" c="dimmed" mt="xs">
                SEO metadata can be generated from the Brand Messages page
              </Text>
            </Box>
          </Stack>
        ) : editMode ? (
          <form onSubmit={form.onSubmit(handleSave)}>
            <Stack gap="md">
              <Paper p="md" withBorder radius="md">
                <Stack gap="sm">
                  <Group gap="xs">
                    <MdTitle size={20} />
                    <Text fw={500}>Title Tag</Text>
                    <Badge color="blue" variant="light" size="sm">
                      {form.values.title.length}/60
                    </Badge>
                  </Group>
                  <TextInput
                    placeholder="Enter SEO title..."
                    {...form.getInputProps('title')}
                  />
                  <Text size="xs" c="dimmed">
                    Appears in search results and browser tabs
                  </Text>
                </Stack>
              </Paper>

              <Paper p="md" withBorder radius="md">
                <Stack gap="sm">
                  <Group gap="xs">
                    <MdDescription size={20} />
                    <Text fw={500}>Meta Description</Text>
                    <Badge color="green" variant="light" size="sm">
                      {form.values.description.length}/160
                    </Badge>
                  </Group>
                  <Textarea
                    placeholder="Enter meta description..."
                    minRows={3}
                    {...form.getInputProps('description')}
                  />
                  <Text size="xs" c="dimmed">
                    Appears below the title in search results
                  </Text>
                </Stack>
              </Paper>

              <Paper p="md" withBorder radius="md">
                <Stack gap="sm">
                  <Group gap="xs">
                    <MdTag size={20} />
                    <Text fw={500}>Keywords</Text>
                    <Badge color="violet" variant="light" size="sm">
                      {form.values.keywords.length}/10
                    </Badge>
                  </Group>
                  <TagsInput
                    placeholder="Enter keywords and press Enter"
                    {...form.getInputProps('keywords')}
                  />
                  <Text size="xs" c="dimmed">
                    Important terms for search engines
                  </Text>
                </Stack>
              </Paper>
              
              <Group justify="flex-end" mt="md">
                <Button
                  variant="subtle"
                  leftSection={<MdCancel size={18} />}
                  onClick={() => {
                    setEditMode(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  leftSection={<MdSave size={18} />}
                  variant="gradient"
                  gradient={{ from: 'violet', to: 'grape', deg: 135 }}
                >
                  Save Changes
                </Button>
              </Group>
            </Stack>
          </form>
        ) : (
          <Stack gap="md">
            {project?.seoMetadata?.generatedAt && (
              <Alert color="blue" variant="light">
                <Group gap="xs">
                  <Text size="sm">
                    Generated from brand message on{' '}
                    {new Date(project.seoMetadata.generatedAt).toLocaleDateString()}
                  </Text>
                </Group>
              </Alert>
            )}
            
            <Paper p="md" withBorder radius="md">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Group gap="xs">
                    <MdTitle size={20} />
                    <Text fw={500}>Title Tag</Text>
                  </Group>
                  <Tooltip label={copiedField === 'title' ? 'Copied!' : 'Copy to clipboard'}>
                    <ActionIcon
                      variant="subtle"
                      onClick={() => handleCopy('title', project?.seoMetadata?.title)}
                      color={copiedField === 'title' ? 'green' : 'gray'}
                    >
                      {copiedField === 'title' ? <MdCheck size={18} /> : <MdContentCopy size={18} />}
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <Text size="sm">{project?.seoMetadata?.title}</Text>
                <Badge color="blue" variant="light" size="sm">
                  {project?.seoMetadata?.title?.length || 0}/60 characters
                </Badge>
              </Stack>
            </Paper>

            <Paper p="md" withBorder radius="md">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Group gap="xs">
                    <MdDescription size={20} />
                    <Text fw={500}>Meta Description</Text>
                  </Group>
                  <Tooltip label={copiedField === 'description' ? 'Copied!' : 'Copy to clipboard'}>
                    <ActionIcon
                      variant="subtle"
                      onClick={() => handleCopy('description', project?.seoMetadata?.description)}
                      color={copiedField === 'description' ? 'green' : 'gray'}
                    >
                      {copiedField === 'description' ? <MdCheck size={18} /> : <MdContentCopy size={18} />}
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <Text size="sm">{project?.seoMetadata?.description}</Text>
                <Badge color="green" variant="light" size="sm">
                  {project?.seoMetadata?.description?.length || 0}/160 characters
                </Badge>
              </Stack>
            </Paper>

            <Paper p="md" withBorder radius="md">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Group gap="xs">
                    <MdTag size={20} />
                    <Text fw={500}>Keywords</Text>
                  </Group>
                  <Tooltip label={copiedField === 'keywords' ? 'Copied!' : 'Copy to clipboard'}>
                    <ActionIcon
                      variant="subtle"
                      onClick={() => handleCopy('keywords', project?.seoMetadata?.keywords)}
                      color={copiedField === 'keywords' ? 'green' : 'gray'}
                    >
                      {copiedField === 'keywords' ? <MdCheck size={18} /> : <MdContentCopy size={18} />}
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <Group gap="xs" wrap="wrap">
                  {project?.seoMetadata?.keywords?.map((keyword, index) => (
                    <Badge key={index} variant="light" color="violet">
                      {keyword}
                    </Badge>
                  ))}
                </Group>
                <Text size="xs" c="dimmed">
                  {project?.seoMetadata?.keywords?.length || 0} keywords
                </Text>
              </Stack>
            </Paper>

            <Paper p="md" withBorder radius="md" bg="gray.0">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={500}>HTML Meta Tags</Text>
                  <Button
                    size="xs"
                    variant="light"
                    leftSection={<MdContentCopy size={14} />}
                    onClick={handleCopyAsHtml}
                  >
                    Copy HTML
                  </Button>
                </Group>
                <Code block>
{`<title>${project?.seoMetadata?.title || ''}</title>
<meta name="description" content="${project?.seoMetadata?.description || ''}" />
<meta name="keywords" content="${project?.seoMetadata?.keywords?.join(', ') || ''}" />`}
                </Code>
              </Stack>
            </Paper>
          </Stack>
        )}
      </Stack>
    </Drawer>
  );
};

export default SeoMetadataDrawer;