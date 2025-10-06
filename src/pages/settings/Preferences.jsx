import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Switch,
  Select,
  Button,
  Group,
  Divider,
  Box
} from '@mantine/core';
import {
  MdNotifications as IconBell,
  MdEmail as IconMail,
  MdLanguage as IconGlobe,
  MdSave as IconDeviceFloppy
} from 'react-icons/md';
import { motion } from 'framer-motion';
import { FadeIn } from '../../components/ui/AnimatedElements';
import { useNotifications } from '../../hooks/useNotifications';
import { useLoading } from '../../contexts/LoadingContext';
import { useState } from 'react';
import SiteMetaTags from '../../components/SEO/SiteMetaTags';

const Preferences = () => {
  const { toast } = useNotifications();
  const { showLoading, hideLoading } = useLoading();
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    weeklyReport: true,
    language: 'en',
    autoSave: true,
    soundEffects: false
  });

  const handleSave = async () => {
    showLoading('preferences', 'Saving preferences...');
    try {
      // Mock save - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast('Preferences saved successfully', 'success');
    } catch (error) {
      toast('Failed to save preferences', 'error');
    } finally {
      hideLoading('preferences');
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <SiteMetaTags
        title="Preferences"
        description="Manage your BrandBanda notification settings and application preferences"
        keywords="preferences, notifications, settings, language, privacy"
        canonicalUrl="https://www.brandbanda.com/settings/preferences"
      />
      <Container size="lg" py="xl">
        <FadeIn>
        <Title order={1} mb="md">Preferences</Title>
        <Text c="dimmed" mb="xl">
          Manage your notification settings and application preferences
        </Text>
      </FadeIn>

      <Stack gap="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Paper p="lg" withBorder>
            <Group mb="md">
              <IconBell size={24} />
              <Title order={3}>Notifications</Title>
            </Group>
            
            <Stack gap="md">
              <Group justify="space-between">
                <Box>
                  <Text fw={500}>Email Notifications</Text>
                  <Text size="sm" c="dimmed">
                    Receive email updates about your projects
                  </Text>
                </Box>
                <Switch
                  checked={preferences.emailNotifications}
                  onChange={(event) => handlePreferenceChange('emailNotifications', event.currentTarget.checked)}
                />
              </Group>

              <Group justify="space-between">
                <Box>
                  <Text fw={500}>Push Notifications</Text>
                  <Text size="sm" c="dimmed">
                    Get browser notifications for important updates
                  </Text>
                </Box>
                <Switch
                  checked={preferences.pushNotifications}
                  onChange={(event) => handlePreferenceChange('pushNotifications', event.currentTarget.checked)}
                />
              </Group>

              <Group justify="space-between">
                <Box>
                  <Text fw={500}>Marketing Emails</Text>
                  <Text size="sm" c="dimmed">
                    Receive news and special offers
                  </Text>
                </Box>
                <Switch
                  checked={preferences.marketingEmails}
                  onChange={(event) => handlePreferenceChange('marketingEmails', event.currentTarget.checked)}
                />
              </Group>

              <Group justify="space-between">
                <Box>
                  <Text fw={500}>Weekly Report</Text>
                  <Text size="sm" c="dimmed">
                    Get a weekly summary of your activity
                  </Text>
                </Box>
                <Switch
                  checked={preferences.weeklyReport}
                  onChange={(event) => handlePreferenceChange('weeklyReport', event.currentTarget.checked)}
                />
              </Group>
            </Stack>
          </Paper>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Paper p="lg" withBorder>
            <Group mb="md">
              <IconGlobe size={24} />
              <Title order={3}>Application</Title>
            </Group>
            
            <Stack gap="md">
              <Group justify="space-between">
                <Box>
                  <Text fw={500}>Language</Text>
                  <Text size="sm" c="dimmed">
                    Choose your preferred language
                  </Text>
                </Box>
                <Select
                  value={preferences.language}
                  onChange={(value) => handlePreferenceChange('language', value)}
                  data={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                    { value: 'de', label: 'German' }
                  ]}
                  style={{ width: 150 }}
                />
              </Group>

              <Divider my="sm" />

              <Group justify="space-between">
                <Box>
                  <Text fw={500}>Auto-save</Text>
                  <Text size="sm" c="dimmed">
                    Automatically save your work
                  </Text>
                </Box>
                <Switch
                  checked={preferences.autoSave}
                  onChange={(event) => handlePreferenceChange('autoSave', event.currentTarget.checked)}
                />
              </Group>

              <Group justify="space-between">
                <Box>
                  <Text fw={500}>Sound Effects</Text>
                  <Text size="sm" c="dimmed">
                    Play sounds for actions
                  </Text>
                </Box>
                <Switch
                  checked={preferences.soundEffects}
                  onChange={(event) => handlePreferenceChange('soundEffects', event.currentTarget.checked)}
                />
              </Group>
            </Stack>
          </Paper>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Group justify="flex-end">
            <Button
              onClick={handleSave}
              leftSection={<IconDeviceFloppy size={18} />}
              size="md"
            >
              Save Preferences
            </Button>
          </Group>
        </motion.div>
      </Stack>
    </Container>
    </>
  );
};

export default Preferences;