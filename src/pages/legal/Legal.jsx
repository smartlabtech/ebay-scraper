import { Container, Title, Text, Stack, Paper, Button, Group, Grid, Card, ThemeIcon } from '@mantine/core';
import { Link } from 'react-router-dom';
import { 
  HiArrowLeft as IconArrowLeft,
  HiDocumentText as IconDocument,
  HiShieldCheck as IconShield,
  HiFingerPrint as IconCookie
} from 'react-icons/hi';
import PageSEO from '../../components/SEO/PageSEO';
import { getSEOData } from '../../config/seo';

const Legal = () => {
  const seoData = getSEOData('/legal');
  
  const legalPages = [
    {
      title: 'Terms of Service',
      description: 'Our terms and conditions for using BrandBanda services',
      icon: IconDocument,
      link: '/terms',
      updated: '2024-01-15'
    },
    {
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your personal information',
      icon: IconShield,
      link: '/privacy',
      updated: '2024-01-15'
    },
    {
      title: 'Cookie Policy',
      description: 'Information about cookies and tracking technologies we use',
      icon: IconCookie,
      link: '/cookies',
      updated: '2024-01-15'
    }
  ];

  return (
    <>
      <PageSEO {...seoData} url="/legal" />
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

        <Stack gap="xl">
          <div>
            <Title order={1} mb="md">Legal Information</Title>
            <Text c="dimmed" size="lg">
              Access all our legal documents and policies in one place
            </Text>
          </div>

          <Grid gutter="lg">
            {legalPages.map((page) => (
              <Grid.Col key={page.link} span={{ base: 12, sm: 6, md: 4 }}>
                <Card
                  component={Link}
                  to={page.link}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{ 
                    textDecoration: 'none',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
                  }}
                >
                  <Stack gap="md">
                    <ThemeIcon size="xl" radius="md" variant="light" color="violet">
                      <page.icon size={28} />
                    </ThemeIcon>
                    <div>
                      <Text fw={600} size="lg" mb="xs" c="dark">
                        {page.title}
                      </Text>
                      <Text size="sm" c="dimmed" mb="xs">
                        {page.description}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Last updated: {page.updated}
                      </Text>
                    </div>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>

          <Paper p="xl" radius="md" bg="gray.0">
            <Stack gap="md">
              <Title order={3}>Compliance & Certifications</Title>
              <Text>
                BrandBanda is committed to maintaining the highest standards of data protection and privacy:
              </Text>
              <Stack gap="xs">
                <Text size="sm">• GDPR Compliant (General Data Protection Regulation)</Text>
                <Text size="sm">• CCPA Compliant (California Consumer Privacy Act)</Text>
                <Text size="sm">• SOC 2 Type II Certified (in progress)</Text>
                <Text size="sm">• SSL/TLS Encryption for all data transfers</Text>
                <Text size="sm">• Regular security audits and penetration testing</Text>
              </Stack>
            </Stack>
          </Paper>

          <Paper p="xl" radius="md" bg="blue.0">
            <Stack gap="md">
              <Title order={3}>Contact Our Legal Team</Title>
              <Text>
                For legal inquiries, DMCA requests, or compliance questions:
              </Text>
              <Stack gap="xs">
                <Text size="sm">Email: legal@brandbanda.com</Text>
                <Text size="sm">Phone: 1-800-BRAND-AI</Text>
                <Text size="sm">
                  Mailing Address: BrandBanda Legal Department, 
                  123 AI Street, San Francisco, CA 94105
                </Text>
              </Stack>
            </Stack>
          </Paper>

          <Paper p="xl" radius="md" withBorder>
            <Stack gap="md">
              <Title order={3}>Important Notice</Title>
              <Text size="sm" c="dimmed">
                By using BrandBanda's services, you agree to be bound by our Terms of Service and 
                Privacy Policy. Please review these documents carefully. If you do not agree with 
                any part of these terms, please do not use our services.
              </Text>
              <Text size="sm" c="dimmed">
                We reserve the right to update these policies from time to time. Continued use of 
                our services after any changes constitutes acceptance of the updated terms.
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
};

export default Legal;