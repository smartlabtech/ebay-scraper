import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageSEO from '../components/SEO/PageSEO';
import SiteMetaTags from '../components/SEO/SiteMetaTags';
import { getSEOData } from '../config/seo';
import {
  Container,
  Title,
  Text,
  Card,
  Grid,
  Stack,
  Button,
  List,
  ThemeIcon,
  Group,
  Badge,
  Box,
  Switch,
  Center,
  Paper,
  Tabs,
  Accordion,
  Anchor,
  Alert,
  Divider,
  Timeline,
  RingProgress,
  Progress,
  Modal,
  TextInput,
  Select,
  Table,
  Textarea
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  MdCheck as IconCheck,
  MdClose as IconX,
  MdRocket as IconRocket,
  MdWorkspacePremium as IconCrown,
  MdBusiness as IconBuilding,
  MdPeople as IconUsers,
  MdStorage as IconStorage,
  MdSpeed as IconSpeed,
  MdSupport as IconSupport,
  MdSecurity as IconShield,
  MdAnalytics as IconAnalytics,
  MdApi as IconApi,
  MdEmail as IconEmail,
  MdPhone as IconPhone,
  MdChat as IconChat,
  MdInfo as IconInfo,
  MdStar as IconStar,
  MdTrendingUp as IconTrending
} from 'react-icons/md';
import { HiSparkles as IconSparkles } from 'react-icons/hi';
import { PageTransition } from '../components/ui/AnimatedElements';
import { useAuth } from '../hooks/useAuth';
import { SUBSCRIPTION_PLAN_DETAILS, TOKEN_COSTS } from '../types';

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const seoData = getSEOData('/pricing');

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      message: ''
    },

    validate: {
      name: (value) => (!value ? 'Name is required' : null),
      email: (value) => (!value ? 'Email is required' : !/^\S+@\S+$/.test(value) ? 'Invalid email' : null),
      company: (value) => (!value ? 'Company is required' : null)
    }
  });

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for trying out our AI-powered platform',
      monthlyPrice: 0,
      yearlyPrice: 0,
      color: 'gray',
      icon: IconSparkles,
      credits: 500,
      features: [
        { text: `${SUBSCRIPTION_PLAN_DETAILS[0].credits.toLocaleString()} AI Credits/month`, included: true },
        { text: `~${Math.floor(500 / TOKEN_COSTS.BRAND_MESSAGE)} Brand Messages`, included: true },
        { text: `~${Math.floor(500 / TOKEN_COSTS.COPY_GENERATION)} Copy Generations`, included: true },
        { text: 'Up to 3 Projects', included: true },
        { text: 'Basic support', included: true },
        { text: 'No credit rollover', included: false },
        { text: 'Team collaboration', included: false },
        { text: 'API access', included: false },
        { text: 'Priority support', included: false }
      ],
      popular: false
    },
    {
      name: 'Starter',
      description: 'Great for small businesses with moderate AI usage',
      monthlyPrice: 19,
      yearlyPrice: 182,
      color: 'blue',
      icon: IconRocket,
      credits: 5000,
      features: [
        { text: `${SUBSCRIPTION_PLAN_DETAILS[1].credits.toLocaleString()} AI Credits/month`, included: true },
        { text: `~${Math.floor(5000 / TOKEN_COSTS.BRAND_MESSAGE)} Brand Messages`, included: true },
        { text: `~${Math.floor(5000 / TOKEN_COSTS.COPY_GENERATION)} Copy Generations`, included: true },
        { text: 'Up to 10 Projects', included: true },
        { text: 'Credit rollover (if paid on time)', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Split testing', included: true },
        { text: '3 Team members', included: true },
        { text: 'API access', included: false }
      ],
      popular: false
    },
    {
      name: 'Professional',
      description: 'Ideal for growing brands and agencies',
      monthlyPrice: 49,
      yearlyPrice: 470,
      color: 'violet',
      icon: IconCrown,
      credits: 20000,
      features: [
        { text: `${SUBSCRIPTION_PLAN_DETAILS[2].credits.toLocaleString()} AI Credits/month`, included: true },
        { text: `~${Math.floor(20000 / TOKEN_COSTS.BRAND_MESSAGE)} Brand Messages`, included: true },
        { text: `~${Math.floor(20000 / TOKEN_COSTS.COPY_GENERATION)} Copy Generations`, included: true },
        { text: 'Unlimited Projects', included: true },
        { text: 'Credit rollover (if paid on time)', included: true },
        { text: 'Priority support', included: true },
        { text: 'Advanced split testing', included: true },
        { text: '10 Team members', included: true },
        { text: 'API access', included: true },
        { text: 'Advanced analytics', included: true }
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large teams with high-volume AI needs',
      monthlyPrice: 149,
      yearlyPrice: 1430,
      color: 'green',
      icon: IconBuilding,
      credits: 100000,
      features: [
        { text: `${SUBSCRIPTION_PLAN_DETAILS[3].credits.toLocaleString()} AI Credits/month`, included: true },
        { text: `~${Math.floor(100000 / TOKEN_COSTS.BRAND_MESSAGE)} Brand Messages`, included: true },
        { text: 'Unlimited Projects', included: true },
        { text: 'Credit rollover (if paid on time)', included: true },
        { text: 'Unlimited Team members', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'SLA guarantee', included: true },
        { text: 'Advanced security features', included: true },
        { text: '24/7 Phone & chat support', included: true }
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      author: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechCorp',
      text: 'BrandTopia transformed how we manage our brand messaging. The AI-powered features save us hours every week.',
      rating: 5
    },
    {
      author: 'Michael Chen',
      role: 'CEO',
      company: 'StartupHub',
      text: 'The professional plan gives us everything we need to maintain consistent brand communication across all channels.',
      rating: 5
    },
    {
      author: 'Emily Rodriguez',
      role: 'Brand Manager',
      company: 'Creative Agency',
      text: 'Excellent value for money. The analytics features help us understand what messaging resonates with our audience.',
      rating: 5
    }
  ];

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'We offer a 14-day free trial for all plans. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay by invoice.'
    },
    {
      question: 'Can I cancel my subscription?',
      answer: 'You can cancel your subscription at any time. Your access will continue until the end of your current billing period.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact our support team for a full refund.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your data remains accessible for 30 days after cancellation. You can export all your data at any time.'
    }
  ];

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice;
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
  };

  const handleSelectPlan = (plan) => {
    if (user) {
      navigate('/settings/billing');
    } else {
      setSelectedPlan(plan);
      navigate('/login');
    }
  };

  const handleContactSales = async (values) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notifications.show({
        title: 'Success',
        message: 'We\'ll contact you within 24 hours',
        color: 'green',
        icon: <IconCheck />
      });
      
      setShowContactModal(false);
      form.reset();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to send message. Please try again.',
        color: 'red'
      });
    }
  };

  return (
    <>
      <SiteMetaTags
        title="Pricing Plans"
        description="Choose the perfect plan for your brand. Flexible pricing with AI-powered credits, no hidden fees, and instant access"
        keywords="pricing, subscription plans, AI credits, brand psychology pricing, content creation pricing"
        canonicalUrl="https://www.brandbanda.com/pricing"
      />
      <PageSEO {...seoData} url="/pricing" />
      <PageTransition>
        <Container size="xl">
        {/* Hero Section */}
        <Box ta="center" mb="xl">
          <Title order={1} size="h1" mb="md">
            Simple, Transparent Pricing
          </Title>
          <Text size="xl" c="dimmed" mb="xl">
            Choose the perfect plan for your brand
          </Text>
          
          {/* Billing Toggle */}
          <Center>
            <Paper shadow="sm" radius="xl" p="xs" withBorder>
              <Group gap="xs">
                <Button
                  variant={billingCycle === 'monthly' ? 'filled' : 'subtle'}
                  radius="xl"
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </Button>
                <Button
                  variant={billingCycle === 'yearly' ? 'filled' : 'subtle'}
                  radius="xl"
                  onClick={() => setBillingCycle('yearly')}
                  rightSection={
                    <Badge size="sm" variant="filled" color="green">
                      Save 20%
                    </Badge>
                  }
                >
                  Yearly
                </Button>
              </Group>
            </Paper>
          </Center>
        </Box>

        {/* Pricing Cards */}
        <Grid gutter="xl" mb="xl">
          {plans.map((plan) => (
            <Grid.Col key={plan.name} span={{ base: 12, sm: 6, lg: 4 }}>
              <Box style={{ position: 'relative', paddingTop: plan.popular ? 16 : 0 }}>
                {plan.popular && (
                  <Badge
                    color={plan.color}
                    variant="filled"
                    size="lg"
                    radius="sm"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 10
                    }}
                  >
                    <Group gap={4}>
                      <IconStar size={14} />
                      Most Popular
                    </Group>
                  </Badge>
                )}
                <Card
                  shadow="md"
                  radius="lg"
                  p="xl"
                  withBorder
                  style={{
                    borderColor: plan.popular ? `var(--mantine-color-${plan.color}-6)` : undefined,
                    borderWidth: plan.popular ? 2 : 1,
                    height: '100%',
                    marginTop: plan.popular ? 12 : 0
                  }}
                >
                  <Stack h="100%">
                  <Box ta="center">
                    <ThemeIcon size="xl" radius="xl" color={plan.color} mb="md">
                      <plan.icon size={28} />
                    </ThemeIcon>
                    <Title order={2} mb="xs">{plan.name}</Title>
                    <Text size="sm" c="dimmed" mb="xl">
                      {plan.description}
                    </Text>
                    
                    <Box mb="xl">
                      <Group justify="center" align="baseline" gap={4}>
                        <Text size="xl" fw={300}>$</Text>
                        <Text size="3xl" fw={700}>{getPrice(plan)}</Text>
                        <Text size="sm" c="dimmed">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </Text>
                      </Group>
                      {billingCycle === 'yearly' && (
                        <Badge color="green" variant="light" size="sm" mt="xs">
                          Save {getSavings(plan)}%
                        </Badge>
                      )}
                    </Box>
                  </Box>

                  <List
                    spacing="sm"
                    size="sm"
                    center
                    style={{ flex: 1 }}
                  >
                    {plan.features.map((feature, index) => (
                      <List.Item
                        key={index}
                        icon={
                          feature.included ? (
                            <ThemeIcon color={plan.color} size={20} radius="xl">
                              <IconCheck size={12} stroke={3} />
                            </ThemeIcon>
                          ) : (
                            <ThemeIcon color="gray" size={20} radius="xl">
                              <IconX size={12} stroke={3} />
                            </ThemeIcon>
                          )
                        }
                        style={{
                          textDecoration: feature.included ? 'none' : 'line-through',
                          opacity: feature.included ? 1 : 0.5
                        }}
                      >
                        {feature.text}
                      </List.Item>
                    ))}
                  </List>

                  <Button
                    fullWidth
                    size="lg"
                    radius="md"
                    color={plan.color}
                    variant={plan.popular ? 'filled' : 'light'}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {user ? 'Upgrade Now' : 'Start Free Trial'}
                  </Button>
                </Stack>
              </Card>
              </Box>
            </Grid.Col>
          ))}
        </Grid>

        {/* Credit System Explanation */}
        <Box mb="xl">
          <Card shadow="md" radius="lg" p="xl" withBorder>
            <Stack align="center" ta="center">
              <ThemeIcon size="xl" radius="xl" color="violet" variant="light">
                <IconSparkles size={32} />
              </ThemeIcon>
              <Title order={3}>How Our AI Credit System Works</Title>
              <Text size="lg" c="dimmed" maw={600}>
                Every AI-powered action consumes credits. Purchase a plan based on your expected usage.
              </Text>
              
              <Grid mt="xl" gutter="xl" grow>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Box>
                    <ThemeIcon size="lg" radius="md" color="blue" mb="sm">
                      <IconSparkles size={24} />
                    </ThemeIcon>
                    <Text fw={600} mb="xs">Brand Messages</Text>
                    <Text size="xl" fw={700} c="blue">{TOKEN_COSTS.BRAND_MESSAGE}</Text>
                    <Text size="sm" c="dimmed">credits each</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Box>
                    <ThemeIcon size="lg" radius="md" color="green" mb="sm">
                      <IconCopy size={24} />
                    </ThemeIcon>
                    <Text fw={600} mb="xs">Copy Generation</Text>
                    <Text size="xl" fw={700} c="green">{TOKEN_COSTS.COPY_GENERATION}</Text>
                    <Text size="sm" c="dimmed">credits each</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Box>
                    <ThemeIcon size="lg" radius="md" color="violet" mb="sm">
                      <IconAnalytics size={24} />
                    </ThemeIcon>
                    <Text fw={600} mb="xs">Split Testing</Text>
                    <Text size="xl" fw={700} c="violet">{TOKEN_COSTS.SPLIT_TEST}</Text>
                    <Text size="sm" c="dimmed">credits each</Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Box>
                    <ThemeIcon size="lg" radius="md" color="orange" mb="sm">
                      <IconRocket size={24} />
                    </ThemeIcon>
                    <Text fw={600} mb="xs">Video Scripts</Text>
                    <Text size="xl" fw={700} c="orange">{TOKEN_COSTS.VIDEO_SCRIPT}</Text>
                    <Text size="sm" c="dimmed">credits each</Text>
                  </Box>
                </Grid.Col>
              </Grid>

              <Alert icon={<IconInfo />} color="blue" variant="light" mt="xl" maw={800}>
                <Text size="sm">
                  <strong>Credit Rollover:</strong> Unused credits roll over to the next month for paid plans (up to 3 months) 
                  when you pay on time. Free plan credits don't roll over.
                </Text>
              </Alert>
            </Stack>
          </Card>
        </Box>

        {/* Enterprise CTA */}
        <Paper shadow="md" radius="lg" p="xl" mb="xl" withBorder>
          <Grid align="center">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Group mb={{ base: 'md', md: 0 }}>
                <ThemeIcon size="xl" radius="xl" color="dark">
                  <IconBuilding size={28} />
                </ThemeIcon>
                <Box>
                  <Title order={3}>Need a custom solution?</Title>
                  <Text c="dimmed">
                    Contact our sales team for custom pricing and features tailored to your organization.
                  </Text>
                </Box>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Button
                size="lg"
                variant="default"
                fullWidth
                onClick={() => setShowContactModal(true)}
              >
                Contact Sales
              </Button>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Features Comparison */}
        <Box mb="xl">
          <Title order={2} ta="center" mb="xl">
            Compare Features
          </Title>
          
          <Paper shadow="sm" radius="lg" withBorder style={{ overflowX: 'auto' }}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Features</Table.Th>
                  <Table.Th ta="center">Free</Table.Th>
                  <Table.Th ta="center">Starter</Table.Th>
                  <Table.Th ta="center">Professional</Table.Th>
                  <Table.Th ta="center">Enterprise</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td fw={500}>Projects</Table.Td>
                  <Table.Td ta="center">5</Table.Td>
                  <Table.Td ta="center">25</Table.Td>
                  <Table.Td ta="center">Unlimited</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={500}>Messages per month</Table.Td>
                  <Table.Td ta="center">1,000</Table.Td>
                  <Table.Td ta="center">5,000</Table.Td>
                  <Table.Td ta="center">Unlimited</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={500}>Team members</Table.Td>
                  <Table.Td ta="center">2</Table.Td>
                  <Table.Td ta="center">10</Table.Td>
                  <Table.Td ta="center">Unlimited</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={500}>Storage</Table.Td>
                  <Table.Td ta="center">10GB</Table.Td>
                  <Table.Td ta="center">50GB</Table.Td>
                  <Table.Td ta="center">500GB</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={500}>AI Message Generation</Table.Td>
                  <Table.Td ta="center">
                    <ThemeIcon color="green" size="sm" radius="xl">
                      <IconCheck size={14} stroke={3} />
                    </ThemeIcon>
                  </Table.Td>
                  <Table.Td ta="center">
                    <ThemeIcon color="green" size="sm" radius="xl">
                      <IconCheck size={14} stroke={3} />
                    </ThemeIcon>
                  </Table.Td>
                  <Table.Td ta="center">
                    <ThemeIcon color="green" size="sm" radius="xl">
                      <IconCheck size={14} stroke={3} />
                    </ThemeIcon>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={500}>Analytics Dashboard</Table.Td>
                  <Table.Td ta="center">Basic</Table.Td>
                  <Table.Td ta="center">Advanced</Table.Td>
                  <Table.Td ta="center">Advanced + Custom</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={500}>API Access</Table.Td>
                  <Table.Td ta="center">
                    <ThemeIcon color="gray" size="sm" radius="xl">
                      <IconX size={14} stroke={3} />
                    </ThemeIcon>
                  </Table.Td>
                  <Table.Td ta="center">
                    <ThemeIcon color="green" size="sm" radius="xl">
                      <IconCheck size={14} stroke={3} />
                    </ThemeIcon>
                  </Table.Td>
                  <Table.Td ta="center">
                    <ThemeIcon color="green" size="sm" radius="xl">
                      <IconCheck size={14} stroke={3} />
                    </ThemeIcon>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={500}>Support</Table.Td>
                  <Table.Td ta="center">Email</Table.Td>
                  <Table.Td ta="center">Priority Email</Table.Td>
                  <Table.Td ta="center">24/7 Dedicated</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Paper>
        </Box>

        {/* Testimonials */}
        <Box mb="xl">
          <Title order={2} ta="center" mb="xl">
            What Our Customers Say
          </Title>
          
          <Grid>
            {testimonials.map((testimonial, index) => (
              <Grid.Col key={index} span={{ base: 12, md: 4 }}>
                <Card shadow="sm" radius="lg" p="xl" h="100%" withBorder>
                  <Stack>
                    <Group gap="xs">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <IconStar key={i} size={16} fill="var(--mantine-color-yellow-6)" style={{ color: 'var(--mantine-color-yellow-6)' }} />
                      ))}
                    </Group>
                    <Text fs="italic">"{testimonial.text}"</Text>
                    <Box mt="auto">
                      <Text fw={600}>{testimonial.author}</Text>
                      <Text size="sm" c="dimmed">
                        {testimonial.role} at {testimonial.company}
                      </Text>
                    </Box>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Box>

        {/* FAQs */}
        <Box mb="xl">
          <Title order={2} ta="center" mb="xl">
            Frequently Asked Questions
          </Title>
          
          <Container size="md">
            <Accordion radius="lg" variant="separated">
              {faqs.map((faq, index) => (
                <Accordion.Item key={index} value={`faq-${index}`}>
                  <Accordion.Control icon={<IconInfo />}>
                    {faq.question}
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text c="dimmed">{faq.answer}</Text>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box ta="center" py="xl">
          <Title order={2} mb="md">
            Ready to Transform Your Brand Communication?
          </Title>
          <Text size="lg" c="dimmed" mb="xl">
            Start your free trial today. No credit card required.
          </Text>
          <Group justify="center">
            <Button
              size="lg"
              radius="md"
              leftSection={<IconSparkles size={20} />}
              onClick={() => navigate('/login')}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="default"
              radius="md"
              onClick={() => setShowContactModal(true)}
            >
              Talk to Sales
            </Button>
          </Group>
        </Box>

        {/* Contact Sales Modal */}
        <Modal
          opened={showContactModal}
          onClose={() => setShowContactModal(false)}
          title="Contact Sales"
          size="md"
        >
          <form onSubmit={form.onSubmit(handleContactSales)}>
            <Stack>
              <TextInput
                label="Name"
                placeholder="John Doe"
                required
                {...form.getInputProps('name')}
              />
              <TextInput
                label="Email"
                placeholder="john@company.com"
                required
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Company"
                placeholder="Acme Inc."
                required
                {...form.getInputProps('company')}
              />
              <TextInput
                label="Phone"
                placeholder="+1 (555) 123-4567"
                {...form.getInputProps('phone')}
              />
              <Select
                label="Company Size"
                placeholder="Select size"
                data={[
                  { value: '1-10', label: '1-10 employees' },
                  { value: '11-50', label: '11-50 employees' },
                  { value: '51-200', label: '51-200 employees' },
                  { value: '201-500', label: '201-500 employees' },
                  { value: '500+', label: '500+ employees' }
                ]}
              />
              <Textarea
                label="Message"
                placeholder="Tell us about your needs..."
                minRows={4}
                {...form.getInputProps('message')}
              />
              
              <Group justify="flex-end">
                <Button variant="default" onClick={() => setShowContactModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Send Message
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Container>
      </PageTransition>
    </>
  );
};

export default Pricing;