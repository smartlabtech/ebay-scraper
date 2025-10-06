import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"
import {usePlans} from "../../hooks/usePlans"
import PageSEO from "../../components/SEO/PageSEO"
import {getSEOData} from "../../config/seo"
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Grid,
  Card,
  Stack,
  Box,
  Paper,
  Badge,
  ThemeIcon,
  List,
  Accordion,
  Center,
  Avatar,
  Rating,
  Timeline,
  Anchor,
  BackgroundImage,
  Overlay,
  AppShell,
  Burger,
  Drawer,
  ScrollArea,
  Divider,
  Table,
  useMantineTheme,
  rem,
  Flex,
  ActionIcon,
  Menu
} from "@mantine/core"
import {useDisclosure, useMediaQuery} from "@mantine/hooks"
import {
  MdRocket as IconRocket,
  MdMessage as IconMessage,
  MdSplitscreen as IconSplitTest,
  MdCampaign as IconSocial,
  MdVideocam as IconVideo,
  MdCheck as IconCheck,
  MdStar as IconStar,
  MdArrowForward as IconArrowRight,
  MdPlayArrow as IconPlay,
  MdSecurity as IconShield,
  MdSupport as IconSupport,
  MdLoop as IconRefresh,
  MdTrendingUp as IconTrending,
  MdDashboard as IconDashboard,
  MdGroups as IconUsers,
  MdLightbulb as IconIdea,
  MdMenu as IconMenu,
  MdStarBorder as IconStarOutline,
  MdLogin as IconLogin,
  MdPersonAdd as IconSignUp,
  MdHelpOutline as IconHelp,
  MdAttachMoney as IconMoney,
  MdQuestionAnswer as IconFaq,
  MdFeaturedPlayList as IconFeatures,
  MdRateReview as IconTestimonials
} from "react-icons/md"
import {motion} from "framer-motion"
import {
  fadeIn,
  slideUp,
  staggerContainer,
  staggerItem
} from "../../utils/theme/animations"
import {SUBSCRIPTION_PLAN_DETAILS, TOKEN_COSTS} from "../../types"

const Landing = () => {
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const [opened, {toggle}] = useDisclosure(false)
  const isMobile = useMediaQuery("(max-width: 48em)") // 768px
  const isTablet = useMediaQuery("(max-width: 62em)") // 992px
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const {plans, loading: plansLoading, getPlanFeatures} = usePlans()
  const seoData = getSEOData("/")

  const brandData = {
    hero: {
      headline: "Unleash Your Brand's Voice with Our Dashboard",
      subheadline: "Create, test, and launch your brand messages effortlessly.",
      cta: "Get Started Now",
      successPoints: [
        "Craft your brand message with minimal input",
        "Run multiple projects with split testing",
        "Create marketing copies for any platform",
        "Use our teleprompter for seamless video recording"
      ]
    },
    problems: [
      "Creating a cohesive brand message is overwhelming.",
      "Split testing different messages can be time-consuming.",
      "Writing marketing copies for social media is tricky without guidance.",
      "Managing multiple projects can lead to confusion."
    ],
    features: [
      {
        icon: <IconMessage size={28} />,
        title: "Brand Messages",
        description: "Craft unique brand messages with guided suggestions."
      },
      {
        icon: <IconSplitTest size={28} />,
        title: "Split Testing",
        description:
          "Run split tests to find out what resonates with your audience."
      },
      {
        icon: <IconSocial size={28} />,
        title: "Social Media Copies",
        description:
          "Generate appealing marketing copies for your social media needs."
      },
      {
        icon: <IconVideo size={28} />,
        title: "Teleprompter",
        description:
          "Read your scripts confidently with our teleprompter feature."
      }
    ],
    testimonials: [
      {
        name: "John Doe",
        review:
          "This dashboard transformed the way I market my business! It's incredibly easy to use.",
        rating: 5,
        role: "CEO, Tech Startup"
      },
      {
        name: "Jane Smith",
        review:
          "I love the split testing feature – it helped me understand what my audience really wants!",
        rating: 5,
        role: "Marketing Director"
      },
      {
        name: "Mike Johnson",
        review:
          "The teleprompter feature is a game-changer for creating professional video content.",
        rating: 5,
        role: "Content Creator"
      }
    ],
    faqs: [
      {
        question: "How do I get started?",
        answer:
          "It's simple! Sign up for a free account and get 500 credits instantly. Create a project and start generating AI-powered content right away."
      },
      {
        question: "What are AI credits and how do they work?",
        answer:
          "AI credits are our way of measuring usage. Each AI-powered action (like generating a brand message or copy) consumes credits. You get a monthly allocation based on your plan, and unused credits roll over for paid plans when you pay on time."
      },
      {
        question: "Can I purchase additional credits?",
        answer:
          "Yes! You can purchase additional credit packages anytime from your billing dashboard. These credits don't expire and are used after your monthly credits."
      },
      {
        question: "Do unused credits roll over to the next month?",
        answer:
          "For paid plans (Starter, Professional, Enterprise), unused credits roll over to the next month (up to 3 months) if you pay your invoice on time. Free plan credits don't roll over."
      },
      {
        question: "Can I change my plan anytime?",
        answer:
          "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll get access to more credits immediately. When downgrading, changes take effect at the next billing cycle."
      },
      {
        question: "What happens if I run out of credits?",
        answer:
          "You'll receive notifications when your credits are running low. You can either upgrade your plan or purchase additional credits to continue using the service without interruption."
      }
    ]
  }

  // Sticky navigation configuration
  const stickyNavConfig = {
    features: {
      visible: true,
      icon: <IconFeatures size={24} />,
      href: "#features",
      label: "Features"
    },
    howItWorks: {
      visible: true,
      icon: <IconHelp size={24} />,
      href: "#how-it-works",
      label: "How It Works"
    },
    pricing: {
      visible: true,
      icon: <IconMoney size={24} />,
      href: "#pricing",
      label: "Pricing"
    },
    testimonials: {
      visible: true,
      icon: <IconTestimonials size={24} />,
      href: "#testimonials",
      label: "Testimonials"
    },
    faq: {
      visible: true,
      icon: <IconFaq size={24} />,
      href: "#faq",
      label: "FAQ"
    }
  }

  // Filter visible items
  const visibleNavItems = Object.values(stickyNavConfig).filter(
    (item) => item.visible
  )

  return (
    <>
      <PageSEO {...seoData} url="/" />

      {/* Header */}
      <Box
        pos="fixed"
        top={0}
        left={0}
        right={0}
        py="md"
        style={{
          zIndex: 100,
          backgroundColor: "white",
          borderBottom: "1px solid var(--mantine-color-gray-3)"
        }}
      >
        <Container size="xl">
          {!isTablet ? (
            <Grid align="center" gutter={0}>
              <Grid.Col span={3}>
                <Group>
                  <IconDashboard size={28} color={theme.colors.violet[6]} />
                  <Title order={3}>BrandBanda</Title>
                </Group>
              </Grid.Col>
              <Grid.Col span={9}>
                <Group justify="flex-end">
                  {isAuthenticated ? (
                    <Button onClick={() => navigate("/dashboard")}>
                      Go to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="default"
                        onClick={() => navigate("/login")}
                      >
                        Login
                      </Button>
                      <Button onClick={() => navigate("/register")}>
                        Get Started
                      </Button>
                    </>
                  )}
                </Group>
              </Grid.Col>
            </Grid>
          ) : (
            <Group justify="space-between">
              <Group>
                <IconDashboard size={28} color={theme.colors.violet[6]} />
                <Title order={3}>BrandBanda</Title>
              </Group>
              <Menu
                opened={opened}
                onChange={toggle}
                position="bottom-end"
                offset={8}
                withinPortal
                transitionProps={{duration: 0}}
              >
                <Menu.Target>
                  <Box
                    style={{
                      border: opened
                        ? `2px solid ${theme.colors.violet[3]}`
                        : "1px solid #dee2e6",
                      borderRadius: "4px",
                      padding: "4px",
                      // transition: 'all 0.2s ease',
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer"
                    }}
                  >
                    <Burger opened={opened} onClick={toggle} size="sm" />
                  </Box>
                </Menu.Target>
                <Menu.Dropdown miw={200}>
                  {isAuthenticated ? (
                    <Menu.Item
                      leftSection={<IconDashboard size={20} />}
                      onClick={() => navigate("/dashboard")}
                      color="violet"
                    >
                      Go to Dashboard
                    </Menu.Item>
                  ) : (
                    <>
                      <Menu.Item
                        leftSection={<IconLogin size={20} />}
                        onClick={() => navigate("/login")}
                      >
                        Sign in
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconSignUp size={20} />}
                        onClick={() => navigate("/register")}
                        color="violet"
                      >
                        Sign up
                      </Menu.Item>
                    </>
                  )}
                </Menu.Dropdown>
              </Menu>
            </Group>
          )}
        </Container>
      </Box>

      {/* Sticky Navigation Icons */}
      {visibleNavItems.length > 0 && (
        <Box
          pos="fixed"
          right={0}
          top="50%"
          style={{
            transform: "translateY(-50%)",
            zIndex: 100
          }}
        >
          <Stack gap={0}>
            {visibleNavItems.map((item, index) => (
              <ActionIcon
                key={item.href}
                size="xl"
                variant="filled"
                color="violet"
                radius="xl"
                onClick={() =>
                  document
                    .querySelector(item.href)
                    ?.scrollIntoView({behavior: "smooth"})
                }
                title={item.label}
                style={{
                  borderRadius: 0,
                  backgroundColor: `${theme.colors.violet[6]}CC`, // 80% opacity
                  ...(index === 0 && {
                    borderTopLeftRadius: theme.radius.xl,
                    borderTopRightRadius: 0
                  }),
                  ...(index === visibleNavItems.length - 1 && {
                    borderBottomLeftRadius: theme.radius.xl,
                    borderBottomRightRadius: 0
                  })
                }}
              >
                {item.icon}
              </ActionIcon>
            ))}
          </Stack>
        </Box>
      )}

      <Box style={{paddingTop: 60}}>
        {/* Hero Section */}
        <Box
          pt={{base: 20, sm: 40, md: 60}}
          pb={{base: 40, sm: 60, md: 80}}
          style={{
            background: `linear-gradient(135deg, ${theme.colors.violet[0]} 0%, ${theme.colors.blue[0]} 100%)`
          }}
        >
          <Container size="xl">
            <Grid gutter={{base: "md", md: "xl"}} align="center">
              <Grid.Col span={{base: 12, sm: 12, md: 6}}>
                <motion.div
                  initial={{opacity: 0, x: -30}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.5}}
                >
                  <Stack gap="xl" align={isTablet ? "center" : "flex-start"}>
                    <Badge size="lg" variant="light" color="violet" radius="xl">
                      🚀 Launch Your Brand Today
                    </Badge>
                    <Title
                      size={isMobile ? "h2" : isTablet ? "h1" : "h1"}
                      fw={800}
                      ta={isTablet ? "center" : "left"}
                    >
                      {brandData.hero.headline}
                    </Title>
                    <Text
                      size="xl"
                      c="dimmed"
                      ta={isTablet ? "center" : "left"}
                    >
                      {brandData.hero.subheadline}
                    </Text>
                    <Group justify={isTablet ? "center" : "flex-start"}>
                      <Button
                        size="lg"
                        rightSection={<IconArrowRight />}
                        onClick={() => navigate("/register")}
                      >
                        {brandData.hero.cta}
                      </Button>
                      <Button
                        size="lg"
                        variant="default"
                        leftSection={<IconPlay />}
                      >
                        Watch Demo
                      </Button>
                    </Group>
                    <List
                      spacing="sm"
                      size="md"
                      icon={
                        <ThemeIcon color="green" size={24} radius="xl">
                          <IconCheck size={16} />
                        </ThemeIcon>
                      }
                      style={
                        isTablet
                          ? {
                              textAlign: "left",
                              margin: "0 auto",
                              maxWidth: "fit-content"
                            }
                          : {}
                      }
                    >
                      {brandData.hero.successPoints.map((point, index) => (
                        <List.Item key={index}>{point}</List.Item>
                      ))}
                    </List>
                  </Stack>
                </motion.div>
              </Grid.Col>
              <Grid.Col span={{base: 12, sm: 12, md: 6}}>
                <motion.div
                  initial={{opacity: 0, x: 30}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.5, delay: 0.2}}
                >
                  <Center>
                    <Box
                      w="100%"
                      h={400}
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors.violet[6]} 0%, ${theme.colors.blue[6]} 100%)`,
                        borderRadius: theme.radius.lg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: theme.shadows.xl
                      }}
                    >
                      <Stack align="center">
                        <IconDashboard size={80} color="white" />
                        <Text size="xl" c="white" fw={600}>
                          Dashboard Preview
                        </Text>
                      </Stack>
                    </Box>
                  </Center>
                </motion.div>
              </Grid.Col>
            </Grid>
          </Container>
        </Box>

        {/* Problem Section */}
        <Container size="xl" py={80}>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{once: true}}
            variants={staggerContainer}
          >
            <Center mb="xl">
              <Stack align="center" maw={600}>
                <Title order={2} ta="center">
                  Are You Struggling to Establish Your Brand?
                </Title>
                <Text size="lg" c="dimmed" ta="center">
                  Without a strong brand message, you're losing potential
                  customers, and every missed opportunity is money left on the
                  table.
                </Text>
              </Stack>
            </Center>

            <Grid gutter={{base: "md", sm: "lg"}}>
              {brandData.problems.map((problem, index) => (
                <Grid.Col key={index} span={{base: 12, sm: 12, md: 6}}>
                  <motion.div variants={staggerItem}>
                    <Paper p="lg" radius="md" withBorder>
                      <Group>
                        <ThemeIcon size="lg" color="red" variant="light">
                          <IconIdea size={20} />
                        </ThemeIcon>
                        <Text style={{flex: 1}}>{problem}</Text>
                      </Group>
                    </Paper>
                  </motion.div>
                </Grid.Col>
              ))}
            </Grid>
          </motion.div>
        </Container>

        {/* Features Section */}
        <Box py={80} bg="gray.0" id="features">
          <Container size="xl">
            <Center mb="xl">
              <Stack align="center" maw={600}>
                <Title order={2} ta="center">
                  Your All-in-One Branding Solution
                </Title>
                <Text size="lg" c="dimmed" ta="center">
                  Our user-friendly dashboard empowers you to craft brand
                  messages with ease and provides tools to launch effective
                  marketing campaigns.
                </Text>
              </Stack>
            </Center>

            <Grid gutter={{base: "md", sm: "lg", lg: "xl"}}>
              {brandData.features.map((feature, index) => (
                <Grid.Col key={index} span={{base: 12, sm: 6, md: 6, lg: 3}}>
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{delay: index * 0.1}}
                    viewport={{once: true}}
                  >
                    <Card
                      h="100%"
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                    >
                      <Stack align="center" ta="center">
                        <ThemeIcon
                          size={60}
                          radius="xl"
                          variant="light"
                          color="violet"
                        >
                          {feature.icon}
                        </ThemeIcon>
                        <Title order={4}>{feature.title}</Title>
                        <Text size="sm" c="dimmed">
                          {feature.description}
                        </Text>
                      </Stack>
                    </Card>
                  </motion.div>
                </Grid.Col>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* How It Works Section */}
        <Container size="xl" py={80} id="how-it-works">
          <Center mb="xl">
            <Stack align="center" maw={600}>
              <Title order={2} ta="center">
                How It Works
              </Title>
              <Text size="lg" c="dimmed" ta="center">
                Get started in just 5 simple steps
              </Text>
            </Stack>
          </Center>

          <Timeline active={-1} bulletSize={40} lineWidth={2}>
            <Timeline.Item
              bullet={<IconRocket size={20} />}
              title="Sign up for an account"
            >
              <Text c="dimmed" size="sm">
                Create your free account and access the intuitive dashboard
              </Text>
            </Timeline.Item>
            <Timeline.Item
              bullet={<IconDashboard size={20} />}
              title="Start a new project"
            >
              <Text c="dimmed" size="sm">
                Enter your brand details and project requirements
              </Text>
            </Timeline.Item>
            <Timeline.Item
              bullet={<IconMessage size={20} />}
              title="Create your brand message"
            >
              <Text c="dimmed" size="sm">
                Choose from templates or create your unique brand voice
              </Text>
            </Timeline.Item>
            <Timeline.Item
              bullet={<IconSplitTest size={20} />}
              title="Test and optimize"
            >
              <Text c="dimmed" size="sm">
                Use split testing to find what resonates with your audience
              </Text>
            </Timeline.Item>
            <Timeline.Item
              bullet={<IconVideo size={20} />}
              title="Launch your campaign"
            >
              <Text c="dimmed" size="sm">
                Use the teleprompter for videos and launch across platforms
              </Text>
            </Timeline.Item>
          </Timeline>

          <Center mt="xl">
            <Button size="lg" onClick={() => navigate("/register")}>
              Start Creating Your Brand Today!
            </Button>
          </Center>
        </Container>

        {/* Testimonials Section */}
        <Box py={80} style={{backgroundColor: "#e0e8ff"}} id="testimonials">
          <Container size="xl">
            <Center mb="xl">
              <Stack align="center" maw={600}>
                <Title order={2} ta="center">
                  What Our Users Say
                </Title>
                <Text size="lg" c="dimmed" ta="center">
                  Join thousands of satisfied customers
                </Text>
              </Stack>
            </Center>

            <Grid gutter={{base: "md", md: "xl"}}>
              {brandData.testimonials.map((testimonial, index) => (
                <Grid.Col key={index} span={{base: 12, sm: 12, md: 4}}>
                  <Card
                    h="100%"
                    shadow="sm"
                    padding="xl"
                    radius="md"
                    withBorder
                  >
                    <Stack>
                      <Rating value={testimonial.rating} readOnly />
                      <Text fs="italic">"{testimonial.review}"</Text>
                      <Group mt="auto">
                        <Avatar radius="xl" color="violet">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Avatar>
                        <Box>
                          <Text fw={600}>{testimonial.name}</Text>
                          <Text size="sm" c="dimmed">
                            {testimonial.role}
                          </Text>
                        </Box>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Pricing Section */}
        <Container size="xl" py={80} id="pricing">
          <Center mb="xl">
            <Stack align="center" maw={600}>
              <Title order={2} ta="center">
                AI-Powered Credit Plans
              </Title>
              <Text size="lg" c="dimmed" ta="center">
                Pay only for what you use with our transparent credit system.
              </Text>
              <Badge size="lg" variant="filled" color="violet">
                Start with 500 free credits!
              </Badge>
            </Stack>
          </Center>

          <Grid
            gutter={{base: "md", sm: "lg", md: "xl"}}
            align="stretch"
            justify="center"
          >
            {plans.map((plan, index) => {
              // Assign colors based on plan name or index
              const planColor =
                plan.name === "Free"
                  ? "gray"
                  : plan.name === "Starter"
                  ? "blue"
                  : plan.name === "Professional"
                  ? "violet"
                  : "green"
              // Use the isPopular flag from API
              const isPlanPopular = plan.isPopular

              // Dynamic column spans based on number of plans
              const planCount = plans.length
              const colSpan = {
                base: 12,
                sm: 12,
                md:
                  planCount === 1
                    ? 12
                    : planCount === 2
                    ? 6
                    : planCount === 3
                    ? 4
                    : 6,
                lg:
                  planCount === 1
                    ? 6
                    : planCount === 2
                    ? 6
                    : planCount === 3
                    ? 4
                    : 3
              }

              return (
                <Grid.Col key={plan._id} span={colSpan}>
                  <Box
                    style={{
                      position: "relative",
                      height: "100%"
                    }}
                  >
                    <Card
                      h="100%"
                      shadow={isPlanPopular ? "2xl" : "md"}
                      padding={isPlanPopular ? "xl" : "lg"}
                      radius="lg"
                      withBorder
                      style={{
                        borderColor: isPlanPopular
                          ? theme.colors[planColor][5]
                          : theme.colors.gray[3],
                        borderWidth: isPlanPopular ? 3 : 1,
                        background: isPlanPopular
                          ? `linear-gradient(to bottom, ${theme.colors[planColor][0]} 0%, white 50%)`
                          : "white",
                        position: "relative",
                        overflow: "visible"
                      }}
                    >
                      {isPlanPopular && (
                        <Box
                          style={{
                            position: "absolute",
                            top: -20,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 10,
                            backgroundColor: theme.colors[planColor][6],
                            color: "white",
                            padding: "8px 24px",
                            borderRadius: "24px",
                            boxShadow: theme.shadows.md,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            whiteSpace: "nowrap"
                          }}
                        >
                          <IconStar size={16} style={{flexShrink: 0}} />
                          <Text
                            fw={700}
                            size="sm"
                            style={{letterSpacing: "0.5px"}}
                          >
                            MOST POPULAR
                          </Text>
                        </Box>
                      )}
                      <Stack h="100%" justify="space-between">
                        <Box>
                          <Box
                            ta="center"
                            mb="xl"
                            pt={isPlanPopular ? "lg" : 0}
                          >
                            <Title
                              order={3}
                              fw={700}
                              size={isPlanPopular ? "h2" : "h3"}
                            >
                              {plan.name}
                            </Title>
                            <Group
                              justify="center"
                              align="baseline"
                              gap={4}
                              mt="md"
                            >
                              <Text size="xl" fw={400} c="dimmed">
                                $
                              </Text>
                              <Text
                                size={isPlanPopular ? rem(56) : rem(48)}
                                fw={800}
                                style={{lineHeight: 1}}
                              >
                                {plan.price}
                              </Text>
                              <Text size="sm" c="dimmed">
                                /{plan.billingCycle}
                              </Text>
                            </Group>
                            <Badge
                              color={planColor}
                              variant="light"
                              size="lg"
                              mt="sm"
                            >
                              {plan.features.creditsPerMonth.toLocaleString()}{" "}
                              credits/month
                            </Badge>
                            {plan.price > 0 && (
                              <Text size="xs" c={planColor} fw={600} mt="xs">
                                Credits roll over when paid on time
                              </Text>
                            )}
                          </Box>

                          <Divider mb="xl" />

                          <List
                            spacing="md"
                            size="sm"
                            center
                            icon={
                              <ThemeIcon
                                color={isPlanPopular ? planColor : "gray"}
                                size={24}
                                radius="xl"
                                variant={isPlanPopular ? "filled" : "light"}
                              >
                                <IconCheck size={14} stroke={3} />
                              </ThemeIcon>
                            }
                          >
                            {getPlanFeatures(plan).map((feature, idx) => (
                              <List.Item key={idx}>
                                <Text fw={isPlanPopular ? 600 : 400}>
                                  {feature}
                                </Text>
                              </List.Item>
                            ))}
                          </List>
                        </Box>

                        <Box mt="xl">
                          <Button
                            fullWidth
                            size={isPlanPopular ? "xl" : "lg"}
                            color={planColor}
                            variant={isPlanPopular ? "filled" : "outline"}
                            onClick={() => navigate("/register")}
                            style={{
                              fontWeight: isPlanPopular ? 700 : 600,
                              boxShadow: isPlanPopular
                                ? theme.shadows.lg
                                : "none"
                            }}
                          >
                            {isPlanPopular
                              ? "Get Started Now"
                              : plan.price === 0
                              ? "Start Free"
                              : "Start Free Trial"}
                          </Button>
                          {plan.name === "Free" && (
                            <Text size="xs" c="dimmed" ta="center" mt="sm">
                              No credit card required
                            </Text>
                          )}
                        </Box>
                      </Stack>
                    </Card>
                  </Box>
                </Grid.Col>
              )
            })}
          </Grid>
        </Container>

        {/* FAQ Section */}
        <Box py={80} bg="gray.0" id="faq">
          <Container size="md">
            <Center mb="xl">
              <Stack align="center" maw={600}>
                <Title order={2} ta="center">
                  Frequently Asked Questions
                </Title>
                <Text size="lg" c="dimmed" ta="center">
                  Got questions? We've got answers
                </Text>
              </Stack>
            </Center>

            <Accordion variant="separated" radius="lg">
              {brandData.faqs.map((faq, index) => (
                <Accordion.Item key={index} value={`faq-${index}`}>
                  <Accordion.Control icon={<IconIdea />}>
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

        {/* Final CTA Section */}
        <Box
          py={80}
          style={{
            background: `linear-gradient(135deg, ${theme.colors.violet[6]} 0%, ${theme.colors.blue[6]} 100%)`
          }}
        >
          <Container size="md">
            <Stack align="center" ta="center">
              <Title order={2} c="white">
                Ready to Elevate Your Brand?
              </Title>
              <Text size="xl" c="white" opacity={0.9}>
                Join over 1,000+ entrepreneurs and marketers who trust our
                platform
              </Text>
              <Button
                size="xl"
                variant="white"
                color="dark"
                rightSection={<IconArrowRight />}
                onClick={() => navigate("/register")}
              >
                Get Started Now
              </Button>
              <Group mt="xl">
                <Badge
                  size="lg"
                  variant="light"
                  color="white"
                  leftSection={<IconUsers size={16} />}
                >
                  Trusted by 1,000+ users
                </Badge>
                <Badge
                  size="lg"
                  variant="light"
                  color="white"
                  leftSection={<IconRefresh size={16} />}
                >
                  Money-back guarantee
                </Badge>
                <Badge
                  size="lg"
                  variant="light"
                  color="white"
                  leftSection={<IconSupport size={16} />}
                >
                  24/7 customer support
                </Badge>
              </Group>
            </Stack>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          py="xl"
          bg="white"
          style={{borderTop: "1px solid var(--mantine-color-gray-3)"}}
        >
          <Container size="xl">
            <Grid gutter={{base: "lg", md: "xl"}}>
              <Grid.Col span={{base: 12, sm: 6}}>
                <Stack>
                  <Group>
                    <IconDashboard size={28} color={theme.colors.violet[6]} />
                    <Title order={4}>BrandBanda</Title>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Your all-in-one solution for brand messaging and marketing.
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{base: 12, sm: 6}}>
                <Stack>
                  <Text fw={600}>Contact</Text>
                  <Text size="sm" c="dimmed">
                    support@brandbanda.com
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
            <Divider my="xl" />
            <Text ta="center" size="sm" c="dimmed">
              © 2024 BrandBanda. All rights reserved.
            </Text>
          </Container>
        </Box>
      </Box>
    </>
  )
}

export default Landing
