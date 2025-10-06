import { Container, Title, Text, Stack, Paper, List, Divider, Button, Group, Table } from '@mantine/core';
import { Link } from 'react-router-dom';
import { HiArrowLeft as IconArrowLeft } from 'react-icons/hi';
import PageSEO from '../../components/SEO/PageSEO';
import { getSEOData } from '../../config/seo';

const Cookies = () => {
  const seoData = getSEOData('/cookies');
  
  const cookieTypes = [
    {
      type: 'Essential Cookies',
      purpose: 'Required for basic site functionality',
      examples: 'Session cookies, authentication tokens',
      canDisable: 'No'
    },
    {
      type: 'Analytics Cookies',
      purpose: 'Help us understand how visitors use our site',
      examples: 'Google Analytics, usage patterns',
      canDisable: 'Yes'
    },
    {
      type: 'Marketing Cookies',
      purpose: 'Track visitors across websites for advertising',
      examples: 'Facebook Pixel, Google Ads',
      canDisable: 'Yes'
    },
    {
      type: 'Preference Cookies',
      purpose: 'Remember your settings and preferences',
      examples: 'Language preference, theme settings',
      canDisable: 'Yes'
    }
  ];

  return (
    <>
      <PageSEO {...seoData} url="/cookies" />
      <Container size="md" py="xl">
        <Group mb="xl">
          <Button
            component={Link}
            to="/"
            variant="subtle"
            leftSection={<IconArrowLeft size={20} />}
          >
            Back to Home
          </Button>
        </Group>

        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="xl">
            <div>
              <Title order={1} mb="md">Cookie Policy</Title>
              <Text c="dimmed">Last updated: {new Date().toLocaleDateString()}</Text>
            </div>

            <Divider />

            <section>
              <Title order={2} mb="md">What Are Cookies?</Title>
              <Text mb="md">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                understanding how you use our platform.
              </Text>
            </section>

            <section>
              <Title order={2} mb="md">How We Use Cookies</Title>
              <Text mb="md">
                BrandBanda uses cookies and similar tracking technologies to:
              </Text>
              <List spacing="sm" mb="md">
                <List.Item>Keep you signed in to your account</List.Item>
                <List.Item>Remember your preferences and settings</List.Item>
                <List.Item>Analyze site traffic and usage patterns</List.Item>
                <List.Item>Improve our services and user experience</List.Item>
                <List.Item>Provide personalized content and recommendations</List.Item>
                <List.Item>Measure the effectiveness of our marketing campaigns</List.Item>
              </List>
            </section>

            <section>
              <Title order={2} mb="md">Types of Cookies We Use</Title>
              <Table mb="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Purpose</Table.Th>
                    <Table.Th>Examples</Table.Th>
                    <Table.Th>Can Disable?</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {cookieTypes.map((cookie) => (
                    <Table.Tr key={cookie.type}>
                      <Table.Td fw={500}>{cookie.type}</Table.Td>
                      <Table.Td>{cookie.purpose}</Table.Td>
                      <Table.Td>{cookie.examples}</Table.Td>
                      <Table.Td>{cookie.canDisable}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </section>

            <section>
              <Title order={2} mb="md">Third-Party Cookies</Title>
              <Text mb="md">
                We may allow third-party service providers to place cookies on your device for the 
                following purposes:
              </Text>
              <List spacing="sm" mb="md">
                <List.Item>
                  <strong>Google Analytics:</strong> To analyze website traffic and user behavior
                </List.Item>
                <List.Item>
                  <strong>Stripe:</strong> For secure payment processing
                </List.Item>
                <List.Item>
                  <strong>Customer Support Tools:</strong> To provide chat support and help desk services
                </List.Item>
              </List>
            </section>

            <section>
              <Title order={2} mb="md">Managing Cookies</Title>
              <Text mb="md">
                You can control and manage cookies in several ways:
              </Text>
              <List spacing="sm" mb="md">
                <List.Item>
                  <strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies. 
                  Check your browser's help section for instructions.
                </List.Item>
                <List.Item>
                  <strong>Cookie Preferences:</strong> When you first visit our site, you can choose 
                  which types of cookies to accept (except essential cookies).
                </List.Item>
                <List.Item>
                  <strong>Do Not Track:</strong> We respect Do Not Track signals and will not track you 
                  when this browser mechanism is enabled.
                </List.Item>
              </List>
              <Text c="dimmed" size="sm">
                Note: Disabling certain cookies may limit your ability to use some features of our platform.
              </Text>
            </section>

            <section>
              <Title order={2} mb="md">Cookie Duration</Title>
              <Text mb="md">
                We use both session and persistent cookies:
              </Text>
              <List spacing="sm" mb="md">
                <List.Item>
                  <strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser
                </List.Item>
                <List.Item>
                  <strong>Persistent Cookies:</strong> Remain on your device for a set period (typically 30 days to 2 years)
                </List.Item>
              </List>
            </section>

            <section>
              <Title order={2} mb="md">Updates to This Policy</Title>
              <Text mb="md">
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for legal, operational, or regulatory reasons. We will notify you of any material 
                changes by posting the new policy on this page with an updated revision date.
              </Text>
            </section>

            <section>
              <Title order={2} mb="md">Contact Us</Title>
              <Text>
                If you have questions about our use of cookies or this policy, please contact us at:
              </Text>
              <List spacing="sm" mt="md">
                <List.Item>Email: privacy@brandbanda.com</List.Item>
                <List.Item>Address: BrandBanda, Inc., Privacy Team</List.Item>
              </List>
            </section>

            <Divider my="xl" />

            <Group justify="center">
              <Button component={Link} to="/privacy" variant="subtle">
                Privacy Policy
              </Button>
              <Button component={Link} to="/terms" variant="subtle">
                Terms of Service
              </Button>
              <Button component={Link} to="/legal" variant="subtle">
                All Legal Documents
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    </>
  );
};

export default Cookies;