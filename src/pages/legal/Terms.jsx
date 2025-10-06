import { Container, Title, Text, Stack, Paper, List, Divider, Button, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import { HiArrowLeft as IconArrowLeft } from 'react-icons/hi';
import PageSEO from '../../components/SEO/PageSEO';
import SiteMetaTags from '../../components/SEO/SiteMetaTags';
import { getSEOData } from '../../config/seo';

const Terms = () => {
  const seoData = getSEOData('/terms');
  
  return (
    <>
      <SiteMetaTags
        title="Terms of Service"
        description="BrandBanda terms of service and user agreement. Learn about your rights and responsibilities when using our AI-powered platform"
        keywords="terms of service, user agreement, legal terms, BrandBanda terms"
        canonicalUrl="https://www.brandbanda.com/terms"
      />
      <PageSEO {...seoData} url="/terms" />
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
            <Title order={1} mb="md">Terms and Conditions</Title>
            <Text c="dimmed">Last updated: {new Date().toLocaleDateString()}</Text>
          </div>

          <Divider />

          <section>
            <Title order={2} mb="md">1. Acceptance of Terms</Title>
            <Text mb="md">
              By accessing and using BrandBanda ("the Service"), you agree to be bound by these Terms and Conditions. 
              If you do not agree to these terms, please do not use our Service.
            </Text>
          </section>

          <section>
            <Title order={2} mb="md">2. Service Description</Title>
            <Text mb="md">
              BrandBanda provides AI-powered brand messaging and content creation services. Our platform enables users to:
            </Text>
            <List mb="md">
              <List.Item>Generate brand messages using artificial intelligence</List.Item>
              <List.Item>Create platform-specific marketing content</List.Item>
              <List.Item>Conduct A/B testing on messaging</List.Item>
              <List.Item>Access analytics and performance metrics</List.Item>
              <List.Item>Collaborate with team members on projects</List.Item>
            </List>
          </section>

          <section>
            <Title order={2} mb="md">3. User Accounts</Title>
            <Text mb="md">
              To use our Service, you must create an account. You are responsible for:
            </Text>
            <List mb="md">
              <List.Item>Providing accurate and complete information</List.Item>
              <List.Item>Maintaining the security of your account credentials</List.Item>
              <List.Item>All activities that occur under your account</List.Item>
              <List.Item>Notifying us immediately of any unauthorized use</List.Item>
            </List>
          </section>

          <section>
            <Title order={2} mb="md">4. Acceptable Use</Title>
            <Text mb="md">You agree not to use BrandBanda to:</Text>
            <List mb="md">
              <List.Item>Violate any laws or regulations</List.Item>
              <List.Item>Infringe on intellectual property rights</List.Item>
              <List.Item>Generate harmful, offensive, or misleading content</List.Item>
              <List.Item>Attempt to gain unauthorized access to our systems</List.Item>
              <List.Item>Interfere with the proper functioning of the Service</List.Item>
            </List>
          </section>

          <section>
            <Title order={2} mb="md">5. Intellectual Property</Title>
            <Text mb="md">
              Content generated using BrandBanda remains your property. However, you grant us a license to:
            </Text>
            <List mb="md">
              <List.Item>Store and process your content to provide the Service</List.Item>
              <List.Item>Use anonymized data to improve our AI models</List.Item>
              <List.Item>Display your content within your account</List.Item>
            </List>
          </section>

          <section>
            <Title order={2} mb="md">6. Payment and Billing</Title>
            <Text mb="md">
              Subscription fees are billed in advance on a monthly or annual basis. By subscribing, you agree to:
            </Text>
            <List mb="md">
              <List.Item>Pay all fees according to your selected plan</List.Item>
              <List.Item>Provide valid payment information</List.Item>
              <List.Item>Accept automatic renewal unless cancelled</List.Item>
            </List>
          </section>

          <section>
            <Title order={2} mb="md">7. Cancellation and Refunds</Title>
            <Text mb="md">
              You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period. 
              We do not provide refunds for partial months or unused services.
            </Text>
          </section>

          <section>
            <Title order={2} mb="md">8. Limitation of Liability</Title>
            <Text mb="md">
              BrandBanda is provided "as is" without warranties of any kind. We are not liable for:
            </Text>
            <List mb="md">
              <List.Item>Any indirect, incidental, or consequential damages</List.Item>
              <List.Item>Loss of profits or business opportunities</List.Item>
              <List.Item>Content generated by our AI systems</List.Item>
              <List.Item>Third-party actions or content</List.Item>
            </List>
          </section>

          <section>
            <Title order={2} mb="md">9. Privacy and Data Protection</Title>
            <Text mb="md">
              Your use of BrandBanda is also governed by our Privacy Policy. We are committed to protecting your personal 
              information and complying with applicable data protection laws.
            </Text>
          </section>

          <section>
            <Title order={2} mb="md">10. Changes to Terms</Title>
            <Text mb="md">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes via email 
              or through the Service. Continued use after changes constitutes acceptance of the new terms.
            </Text>
          </section>

          <section>
            <Title order={2} mb="md">11. Governing Law</Title>
            <Text mb="md">
              These Terms are governed by the laws of the United States. Any disputes shall be resolved in the courts of 
              Delaware.
            </Text>
          </section>

          <section>
            <Title order={2} mb="md">12. Contact Information</Title>
            <Text>
              If you have questions about these Terms, please contact us at:
            </Text>
            <Text mt="sm">
              Email: legal@BrandBanda.com<br />
              Address: 123 Innovation Drive, Suite 100, San Francisco, CA 94105
            </Text>
          </section>
        </Stack>
      </Paper>
      </Container>
    </>
  );
};

export default Terms;