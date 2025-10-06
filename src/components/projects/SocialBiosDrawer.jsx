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
  Textarea,
  LoadingOverlay,
  Alert,
  Badge,
  Box,
  Tooltip
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  MdContentCopy,
  MdEdit,
  MdCheck,
  MdAutoAwesome,
  MdSave,
  MdCancel,
  MdFacebook,
  MdLink
} from 'react-icons/md';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { updateSocialBios } from '../../store/slices/projectsSlice';
import { useNotifications } from '../../hooks/useNotifications';

const SocialBiosDrawer = ({ opened, onClose, project, brandMessageId }) => {
  const dispatch = useDispatch();
  const { notifySuccess, notifyError } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const form = useForm({
    initialValues: {
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  });

  // Update form when drawer opens with a project
  React.useEffect(() => {
    if (opened && project?.socialBios) {
      form.setValues({
        facebook: project.socialBios.facebook || '',
        instagram: project.socialBios.instagram || '',
        linkedin: project.socialBios.linkedin || ''
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
      await dispatch(updateSocialBios({ 
        projectId: project.id, 
        socialBios: values 
      })).unwrap();
      notifySuccess('Social bios updated successfully');
      setEditMode(false);
    } catch (error) {
      notifyError('Failed to update social bios');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (platform, text) => {
    navigator.clipboard.writeText(text);
    setCopiedField(platform);
    notifySuccess(`${platform} bio copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook':
        return <MdFacebook size={20} />;
      case 'instagram':
        return <FaInstagram size={18} />;
      case 'linkedin':
        return <FaLinkedin size={18} />;
      default:
        return <MdLink size={20} />;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'facebook':
        return 'blue';
      case 'instagram':
        return 'pink';
      case 'linkedin':
        return 'indigo';
      default:
        return 'gray';
    }
  };

  const hasBios = project?.socialBios && (
    project.socialBios.facebook ||
    project.socialBios.instagram ||
    project.socialBios.linkedin
  );

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group justify="space-between" style={{ width: '100%' }}>
          <Title order={3}>Social Media Bios</Title>
          {hasBios && !editMode && (
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
        {!hasBios ? (
          <Stack align="center" gap="lg" py="xl">
            <Box ta="center">
              <MdAutoAwesome size={48} style={{ color: 'var(--mantine-color-gray-5)' }} />
              <Title order={4} mt="md">No Social Bios Yet</Title>
              <Text size="sm" c="dimmed" mt="xs">
                Social media bios can be generated from the Brand Messages page
              </Text>
            </Box>
          </Stack>
        ) : editMode ? (
          <form onSubmit={form.onSubmit(handleSave)}>
            <Stack gap="md">
              {['facebook', 'instagram', 'linkedin'].map((platform) => (
                <Paper key={platform} p="md" withBorder radius="md">
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Group gap="xs">
                        {getPlatformIcon(platform)}
                        <Text fw={500} tt="capitalize">{platform}</Text>
                      </Group>
                      <Badge color={getPlatformColor(platform)} variant="light">
                        {platform === 'twitter' ? '280' : platform === 'instagram' ? '150' : '2000'} chars
                      </Badge>
                    </Group>
                    <Textarea
                      placeholder={`Enter ${platform} bio...`}
                      minRows={3}
                      maxRows={6}
                      {...form.getInputProps(platform)}
                    />
                  </Stack>
                </Paper>
              ))}
              
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
            {project?.socialBios?.generatedAt && (
              <Alert color="blue" variant="light">
                <Group gap="xs">
                  <Text size="sm">
                    Generated from brand message on{' '}
                    {new Date(project.socialBios.generatedAt).toLocaleDateString()}
                  </Text>
                </Group>
              </Alert>
            )}
            
            {['facebook', 'instagram', 'linkedin', 'twitter'].map((platform) => {
              const bioText = project?.socialBios?.[platform];
              if (!bioText) return null;
              
              return (
                <Paper key={platform} p="md" withBorder radius="md">
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Group gap="xs">
                        {getPlatformIcon(platform)}
                        <Text fw={500} tt="capitalize">{platform}</Text>
                      </Group>
                      <Tooltip label={copiedField === platform ? 'Copied!' : 'Copy to clipboard'}>
                        <ActionIcon
                          variant="subtle"
                          onClick={() => handleCopy(platform, bioText)}
                          color={copiedField === platform ? 'green' : 'gray'}
                        >
                          {copiedField === platform ? <MdCheck size={18} /> : <MdContentCopy size={18} />}
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                    <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                      {bioText}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {bioText.length} characters
                    </Text>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Drawer>
  );
};

export default SocialBiosDrawer;