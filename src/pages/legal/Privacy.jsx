import { Container, Title, Text, Stack, Paper, List, Divider, Button, Group, Table } from '@mantine/core';
import { Link } from 'react-router-dom';
import { HiArrowLeft as IconArrowLeft } from 'react-icons/hi';
import PageSEO from '../../components/SEO/PageSEO';
import SiteMetaTags from '../../components/SEO/SiteMetaTags';
import { getSEOData } from '../../config/seo';

const Privacy = () => {
  const seoData = getSEOData('/privacy');

  const dataTypes = [
    {
      type: 'Personal Information',
      data: 'Name, email address, company name',
      purpose: 'Account creation and management',
    },
    {
      type: 'Usage Data',
      data: 'Features used, content created, interaction patterns',
      purpose: 'Service improvement and analytics',
    },
    {
      type: 'Payment Information',
      data: 'Billing address, payment method (processed by Stripe)',
      purpose: 'Subscription management and billing',
    },
    {
      type: 'Content Data',
      data: 'Brand messages, copies, project information',
      purpose: 'Service delivery and AI model improvement',
    },
  ];

  return (
    <>
      <SiteMetaTags
        title="Privacy Policy"
        description="How BrandBanda protects your data and privacy. Learn about our data collection and security practices"
        keywords="privacy policy, data protection, security, BrandBanda privacy"
        canonicalUrl="https://www.brandbanda.com/privacy"
      />
      <PageSEO {...seoData} url="/privacy" />
      <Container size="md" py="xl">
      <Group mb="xl">
        <Button
          component={Link}
          to="/register"
          variant="subtle"
          leftSection={<IconArrowLeft size={20} />}
        >
          Back to Register
        </Button>
      </Group>

      <Paper shadow="sm" p="xl" radius="md">
        <Stack gap="xl">
          <div>
            <Title order={1} mb="md">Privacy Policy</Title>
            <Text c="dimmed">Last updated: {new Date().toLocaleDateString()}</Text>
          </div>

          <Divider />

          <section>
            <Title order={2} mb="md">1. Introduction</Title>
            <Text mb="md">
              BrandBanda ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how 
              we collect, use, disclose, and safeguard your information when you use our Service.
            </Text>
          </section>

          <section>
            <Title order={2} mb="md">2. Information We Collect</Title>
            <Text mb="md">We collect information you provide directly to us, including:</Text>
            
            <Table mb="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Data Type</Table.Th>
                  <Table.Th>Information Collected</Table.Th>
                  <Table.Th>Purpose</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {dataTypes.map((row) => (
                  <Table.Tr key={row.type}>
                    <Table.Td fw={500}>{row.type}</Table.Td>
                    <Table.Td>{row.data}</Table.Td>
                    <Table.Td>{row.purpose}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </section>

          <section>
            <Title order={2} mb="md">3. How We Use Your Information</Title>
            <Text mb="md">We use the information we collect to:</Text>
            <List mb="md">
              <List.Item>Provide, maintain, and improve our Service</List.Item>
              <List.Item>Process transactions and send related information</List.Item>
              <List.Item>Send you technical notices and support messages</List.Item>
              <List.Item>Respond to your comments and questions</List.Item>
              <List.Item>Analyze usage patterns to improve user experience</List.Item>
              <List.Item>Detect, prevent, and address technical issues</List.Item>
              <List.Item>Train and improve our AI models (using anonymized data)</List.Item>
            </List>
          </section>

          <section>
            <Title order={2} mb="md">4. Information Sharing</Title>
            <Text mb="md">We do not sell, trade, or rent your personal information. We may share your information with:</Text>
            <List mb="md">
              <List.Item>Service providers who assist in our operations</List.Item>
              <List.Item>Professional advisors (lawyers, accountants) when necessary</List.Item>
              <List.Item>Law enforcement when required by law</List.Item>
              <List.Item>Other parties with your consent</List.Item>
            </List>
          </section>

          <section>
            <Title order={2} mb="md">5. Data Security</Title>
            <Text mb="md">
              We implement appropriate technical and organizational measures to protect your information, including:
            </Text>
            <List mb="md">
              <List.Item>Encryption of data in transit and at rest</List.Item>
              <List.Item>Regular security assessments and updates</List.Item>
              <List.Item>Access controls and authentication measures</List.Item>
              <List.Item>Employee training on data protection</List.Item>
            </List>
          </section>

          <section>
            <Title order={2} mb="md">6. Your Rights</Title>
            <Text mb="md">You have the right to:</Text>
            <List mb="md">
              <List.Item>Access the personal information we hold about you</List.Item>
              <List.Item>Request correction of inaccurate information</List.Item>
              <List.Item>Request deletion of your personal information</List.Item>
              <List.Item>Object to processing of your information</List.Item>
              <List.Item>Request data portability</List.Item>
              <List.Item>Withdraw consent at any time</List.Item>
            </List>
            <Text mt="md">
              To exercise these rights, please contact us at privacy@BrandBanda.com.
            </Text>
          </section>

          <section>
            <Title order={2} mb="md">7. Cookies and Tracking</Title>
            <Text mb="md">
              We use cookies and similar tracking technologies to:
            </Text>
            <List mb="md">
              <List.Item>Maintain your session and preferences</List.Item>
              <List.Item>Analyze site traffic and usage</List.Item>
              <List.Item>Personalize your experience</List.Item>
            </List>
            <Text mt="md">
              You can control cookies through your browser settings, but disabling them may limit your ability to use certain features.
            </Text>
          </section>

          <section>
            <Title order={2} mb="md">8. Data Retention</Title>
            <Text mb="md">
              We retain your personal information for as long as necessary to provide our Service and comply with legal obligations. 
              When you delete your account, we will delete or anonymize your information within 30 days, except where retention is 
              required by law.
            </Text>
          </section>

          <section>
            <Title order={2} mb="md">9. International Data Transfers</Title>
            <Text mb="md">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
              safeguards are in place to protect your information in accordance with this Privacy Policy.
            </Text>
          </section>

          <section>
            <Title order={2} mb="md">10. Children's Privacy</Title>
            <Text mb="md">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information 
              from children under 13. If you believe we have collected information from a child under 13, please contact us 
              immediately.
            </Text>
          </section>

          <section>
            <Title order={2} mb="md">11. Updates to This Policy</Title>
            <Text mb="md">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy 
              Policy on this page and updating the "Last updated" date.
            </Text>
          </section>

          <section>
            <Title order={2} mb="md">12. Contact Us</Title>
            <Text>If you have questions about this Privacy Policy, please contact us at:</Text>
            <Stack gap="xs" mt="sm">
              <Text>Email: privacy@BrandBanda.com</Text>
              <Text>Phone: 1-800-BrandTopia</Text>
              <Text>Address: 123 Innovation Drive, Suite 100, San Francisco, CA 94105</Text>
            </Stack>
          </section>

          <section>
            <Title order={2} mb="md">13. California Privacy Rights</Title>
            <Text mb="md">
              California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right 
              to know what personal information we collect, the right to delete personal information, and the right to opt-out 
              of the sale of personal information (which we do not do).
            </Text>
          </section>
        </Stack>
      </Paper>
      </Container>
    </>
  );
};

export default Privacy;