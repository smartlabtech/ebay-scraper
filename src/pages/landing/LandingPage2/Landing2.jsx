import React, {useEffect, useState, useRef} from "react"
import {useSelector} from "react-redux"
import SiteMetaTags from "../../../components/SEO/SiteMetaTags"
import trackingService from "../../../services/trackingService"
import {
  Container,
  Text,
  Title,
  Button,
  Group,
  Stack,
  Box,
  Grid,
  Card,
  Badge,
  List,
  ThemeIcon,
  SimpleGrid,
  Accordion,
  Divider,
  Image,
  Anchor,
  Center,
  Flex,
  Paper,
  Alert,
  Tabs,
  Timeline,
  Progress,
  Avatar,
  Rating,
  Overlay,
  BackgroundImage,
  Affix,
  Transition,
  rem
} from "@mantine/core"
import {useWindowScroll, useInterval} from "@mantine/hooks"
import {
  MdCheck,
  MdClose,
  MdPsychology,
  MdRocket,
  MdBolt,
  MdTrendingUp,
  MdVerifiedUser,
  MdHeadphones,
  MdLock,
  MdCardGiftcard,
  MdStar,
  MdArrowForward,
  MdAccessTime,
  MdGroups,
  MdGpsFixed,
  MdAutoAwesome,
  MdWorkspacePremium,
  MdPublic,
  MdSchool,
  MdViewModule,
  MdViewList,
  MdDomain,
  MdDashboardCustomize,
  MdShowChart
} from "react-icons/md"
import {useNavigate} from "react-router-dom"
import PageSEO from "../../../components/SEO/PageSEO"
import {getSEOData} from "../../../config/seo"
import plansService from "../../../services/plans"
import SignupWithPlanModal from "../../../components/modals/SignupWithPlanModal"

const Landing2 = () => {
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const [plans, setPlans] = useState([])
  const [plansLoading, setPlansLoading] = useState(false)
  const [viewMode, setViewMode] = useState("cards") // 'cards' or 'table' - default to table
  const [signupModalOpened, setSignupModalOpened] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const seoData = getSEOData("/")
  const [scroll, scrollTo] = useWindowScroll()
  // Removed fake urgency states

  // Handle plan selection and open signup modal
  const handlePlanSelection = (plan) => {
    // Track plan selection (add to cart event)
    // trackingService.trackAddToCart(plan._id, plan.name, plan.price)

    setSelectedPlan(plan)
    setSignupModalOpened(true)
  }

  // Fetch plans from API using existing service
  useEffect(() => {
    const fetchPlans = async () => {
      setPlansLoading(true)
      try {
        const data = await plansService.getPublicPlans()
        setPlans(data)

        // Track pricing view when plans are loaded
        if (data && data.length > 0) {
          // trackingService.trackPricingView(data)
          // Track view content for each plan
          // data.forEach((plan) => {
          //   trackingService.trackViewContent(
          //     plan._id,
          //     plan.name,
          //     plan.price,
          //     "subscription_plan"
          //   )
          // })
        }
      } catch (error) {
        console.error("Error fetching plans:", error)
        // Fallback to empty array if API fails
        setPlans([])
      } finally {
        setPlansLoading(false)
      }
    }

    fetchPlans()
  }, [])

  // Track landing page view and user interactions
  useEffect(() => {
    // Track initial page view
    // trackingService.trackPageView("Landing Page")

    // Track time on page every 30 seconds
    let timeOnPage = 0
    const timeInterval = setInterval(() => {
      timeOnPage += 30
      trackingService.trackTimeOnPage(timeOnPage, "Landing Page")
    }, 30000)

    // Track scroll depth
    // let maxScroll = 0
    // const handleScroll = () => {
    //   const scrollPercentage = Math.round(
    //     (window.scrollY /
    //       (document.documentElement.scrollHeight - window.innerHeight)) *
    //       100
    //   )
    //   if (scrollPercentage > maxScroll) {
    //     maxScroll = scrollPercentage
    //     sessionStorage.setItem("maxScrollDepth", maxScroll.toString())

    //     // Track at 25%, 50%, 75%, and 100%
    //     if (
    //       maxScroll === 25 ||
    //       maxScroll === 50 ||
    //       maxScroll === 75 ||
    //       maxScroll === 100
    //     ) {
    //       trackingService.trackScrollDepth(maxScroll)
    //     }
    //   }
    // }

    // window.addEventListener("scroll", handleScroll)

    // Cleanup
    return () => {
      clearInterval(timeInterval)
      // window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Create neural network animation
  const bgAnimationRef = useRef(null)

  useEffect(() => {
    createNeuralNetwork()
  }, [])

  const createNeuralNetwork = () => {
    if (!bgAnimationRef.current) return
    const container = bgAnimationRef.current
    const nodeCount = 20
    const colors = ["#ffd700", "#7c3aed", "#00ffff", "#ff69b4"]

    for (let i = 0; i < nodeCount; i++) {
      const node = document.createElement("div")
      const color = colors[Math.floor(Math.random() * colors.length)]
      node.style.position = "absolute"
      node.style.width = Math.random() * 4 + 2 + "px"
      node.style.height = node.style.width
      node.style.background = color
      node.style.borderRadius = "50%"
      node.style.left = Math.random() * 100 + "%"
      node.style.top = Math.random() * 100 + "%"
      node.style.boxShadow = `0 0 10px ${color}`
      node.style.animation = `pulse 2s ${
        Math.random() * 2
      }s infinite ease-in-out`
      container.appendChild(node)

      if (i % 3 === 0) {
        const connection = document.createElement("div")
        connection.style.position = "absolute"
        connection.style.height = "1px"
        connection.style.background = `linear-gradient(90deg, transparent, ${color}, transparent)`
        connection.style.left = Math.random() * 100 + "%"
        connection.style.top = Math.random() * 100 + "%"
        connection.style.width = Math.random() * 200 + 50 + "px"
        connection.style.transform = `rotate(${Math.random() * 360}deg)`
        connection.style.animation = `flow 3s ${Math.random() * 3}s infinite`
        connection.style.opacity = "0.3"
        container.appendChild(connection)
      }
    }
  }

  // Removed countdown timer logic

  // Text style variants for DRY code
  const textStyles = {
    // Main section titles
    sectionTitle: {
      order: 2,
      size: rem(30),
      fw: 800,
      c: "rgb(239, 204, 126)",
      mb: 50,
      ta: "center"
    },
    // Subtitle variant (AI-POWERED BRANDING)
    subtitle: {
      fontSize: "1.4rem",
      color: "#cccccc",
      fontWeight: 400
    },
    // Description variant
    description: {
      size: "lg",
      c: "#aaaaaa",
      lh: 1.6,
      fw: 500
    },
    // Gold accent text
    goldAccent: {
      c: "#ffd700",
      fw: 600
    },
    // Gold bold numbers
    goldNumber: {
      size: rem(32),
      fw: 800,
      c: "#ffd700"
    },
    // Success text
    success: {
      c: "#86efac",
      fw: 600
    },
    // Error text
    error: {
      c: "#fca5a5",
      fw: 600
    },
    // Danger bullet
    dangerBullet: {
      c: "#ff6b6b",
      fw: 700
    },
    // Light danger text
    lightDanger: {
      c: "#ffcccc",
      size: "lg",
      fs: "italic"
    },
    // List styles for bullet points
    goldList: {
      px: "24px",
      spacing: "lg",
      icon: (
        <Text
          c="rgb(239, 204, 126)"
          fw={700}
          style={{fontSize: "1.2rem", marginRight: "6px"}}
        >
          •
        </Text>
      ),
      styles: {
        root: {padding: 0},
        item: {paddingLeft: 0},
        itemWrapper: {alignItems: "flex-start"},
        itemIcon: {marginTop: 0, marginRight: 12}
      }
    },
    // List item text style
    listItemText: {
      c: "#cccccc",
      style: {
        fontSize: "1.1rem",
        lineHeight: 1.6
      }
    },
    // Checkmark list styles
    checkList: {
      spacing: "md",
      icon: (
        <Text
          c="rgb(239, 204, 126)"
          fw={700}
          style={{fontSize: "1.2rem", marginRight: "12px"}}
        >
          ✓
        </Text>
      ),
      styles: {
        root: {width: "100%", textAlign: "left"},
        itemWrapper: {alignItems: "flex-start"},
        itemIcon: {marginTop: 0},
        item: {textAlign: "left"}
      }
    },
    // Danger list styles
    dangerList: {
      spacing: "md",
      icon: (
        <Text
          c="#ff6b6b"
          fw={700}
          style={{fontSize: "1.2rem", marginRight: "6px"}}
        >
          •
        </Text>
      ),
      styles: {
        root: {padding: 0},
        item: {paddingLeft: 0},
        itemWrapper: {alignItems: "flex-start"},
        itemIcon: {marginTop: 0, marginRight: 12}
      }
    },
    // Danger list item text style
    dangerListItemText: {
      // align: 'left',
      c: "#ffffff",
      fw: 500,
      style: {
        fontSize: "1.1rem",
        lineHeight: 1.5
      }
    },
    // Credentials list styles - properly structured for Mantine
    credentialsList: {
      spacing: 15,
      icon: <></>, // Empty fragment as placeholder
      styles: {
        root: {padding: 0},
        item: {paddingLeft: 0, display: "flex", alignItems: "flex-start"},
        itemWrapper: {width: "100%", alignItems: "flex-start"},
        itemIcon: {display: "none"} // Hide the default icon space
      }
    },
    // Credentials list item text style
    credentialsItemText: {
      c: "#ffffff",
      style: {
        fontSize: "1.1rem",
        lineHeight: 1.6,
        display: "inline"
      }
    },
    // Section description text (paragraphs under titles)
    sectionDescription: {
      c: "#cccccc",
      mb: 50,
      maw: 800,
      ta: "center",
      style: {
        fontSize: "1.3rem",
        lineHeight: 1.6
      }
    },
    // Product Features Card styles
    featureEmoji: {
      style: {
        fontSize: "clamp(2rem, 4vw, 2.5rem)"
      }
    },
    featureTitle: {
      order: 3,
      c: "rgb(239, 204, 126)",
      fw: 700,
      style: {
        fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
        lineHeight: 1.2
      }
    },
    featureDescription: {
      c: "#cccccc",
      style: {
        fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
        lineHeight: 1.6
      }
    }
  }

  // Helper function to get text props
  const getTextProps = (variant, additionalProps = {}) => {
    const baseProps = textStyles[variant] || {}
    return {...baseProps, ...additionalProps}
  }

  const styles = {
    wrapper: {
      background:
        "linear-gradient(135deg, #0a0a14 0%, #1a1a2e 40%, #0f172a 100%)",
      color: "#ffffff",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden"
    },
    bgAnimation: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 0
    },
    logo: {
      fontSize: "28px",
      fontWeight: 800,
      color: "rgb(239, 204, 126)"
    },
    heroTitle: {
      fontSize: "clamp(2.5rem, 8vw, 6rem)",
      fontWeight: 900,
      lineHeight: 1.1,
      color: "rgb(239, 204, 126)"
      // animation: 'neonGlow 2s ease-in-out infinite alternate'
    },
    ctaButton: {
      background:
        "linear-gradient(180deg, rgb(207, 157, 79), rgb(239, 202, 126))",
      color: "#000",
      fontWeight: 600,
      border: "none",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 10px 25px rgba(255, 215, 0, 0.3)"
      }
    },
    featureCard: {
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "16px",
      padding: "30px 20px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-10px)",
        boxShadow: "0 20px 40px rgba(255, 215, 0, 0.2)"
      }
    },
    counterBox: {
      background: "rgba(255, 215, 0, 0.1)",
      border: "1px solid #ffd700",
      borderRadius: "8px",
      padding: "10px 15px",
      minWidth: "80px"
    }
  }

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); }
      }

      @keyframes flow {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
      }

      @keyframes neonGlow {
        from {
          text-shadow:
            0 0 5px rgb(211, 162, 81),
            0 0 10px rgb(211, 162, 81),
            0 0 15px rgb(211, 162, 81),
            0 0 20px rgb(211, 162, 81),
            0 0 35px rgb(211, 162, 81);
        }
        to {
          text-shadow:
            0 0 10px rgb(211, 162, 81),
            0 0 20px rgb(211, 162, 81),
            0 0 30px rgb(211, 162, 81),
            0 0 40px rgb(211, 162, 81),
            0 0 70px rgb(211, 162, 81);
        }
      }

      // /* Smooth scrolling for the entire page */
      // html {
      //   scroll-behavior: smooth;
      // }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  return (
    <>
      <SiteMetaTags
        title="AI-Powered Brand Psychology Platform"
        description="Transform your brand with AI-driven psychological insights. Create compelling content that resonates with your audience."
        keywords="brand psychology, AI marketing, brand messaging, content creation"
      />
      <PageSEO {...seoData} url="/" />
      <Box style={styles.wrapper}>
        {/* Animated Background */}
        <div ref={bgAnimationRef} style={styles.bgAnimation} />

        {/* Single Navigation Header with Dynamic Styling */}
        <Box
          component="header"
          py={20}
          pos="fixed"
          top={0}
          left={0}
          right={0}
          style={{
            zIndex: 1000,
            background:
              scroll.y > 100
                ? "linear-gradient(135deg, rgba(239, 204, 126, 0.08), rgba(207, 157, 79, 0.12))"
                : "transparent",
            backdropFilter: scroll.y > 100 ? "blur(15px)" : "none",
            borderBottom:
              scroll.y > 100
                ? "1px solid rgba(239, 204, 126, 0.2)"
                : "1px solid transparent",
            boxShadow:
              scroll.y > 100 ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "none",
            transition: "all 0.3s ease"
          }}
          visibleFrom="md"
        >
          <Container size="xl" px="20px">
            <Group justify="space-between">
              <Group gap={8} align="center">
                <Box
                  style={{
                    width: "40px",
                    height: "40px",
                    background:
                      "linear-gradient(135deg, rgb(239, 204, 126), rgb(255, 215, 0))",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "24px",
                    color: "#0a0a14",
                    boxShadow: "0 4px 20px rgba(239, 204, 126, 0.3)",
                    transform: "perspective(20px) rotateY(-5deg)"
                  }}
                >
                  B
                </Box>
                <Text style={styles.logo}>Brand Banda </Text>
              </Group>

              <Group gap={30}>
                <Anchor
                  href="#benefits"
                  c="white"
                  fw={500}
                  onClick={(e) => {
                    e.preventDefault()
                    const section = document.getElementById("benefits")
                    if (section) {
                      section.scrollIntoView({behavior: "smooth"})
                    }
                  }}
                  styles={{
                    root: {
                      transition: "color 0.3s ease",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      "&:hover": {
                        color: "rgb(0, 255, 255)"
                      }
                    }
                  }}
                >
                  BENEFITS
                </Anchor>
                <Anchor
                  href="#testimonials"
                  c="white"
                  fw={500}
                  onClick={(e) => {
                    e.preventDefault()
                    const section = document.getElementById("testimonials")
                    if (section) {
                      section.scrollIntoView({behavior: "smooth"})
                    }
                  }}
                  styles={{
                    root: {
                      transition: "color 0.3s ease",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      "&:hover": {
                        color: "rgb(0, 255, 255)"
                      }
                    }
                  }}
                >
                  TESTIMONIALS
                </Anchor>
                <Anchor
                  href="#pricing"
                  c="white"
                  fw={500}
                  onClick={(e) => {
                    e.preventDefault()
                    const section = document.getElementById("pricing")
                    if (section) {
                      section.scrollIntoView({behavior: "smooth"})
                    }
                  }}
                  styles={{
                    root: {
                      transition: "color 0.3s ease",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      "&:hover": {
                        color: "rgb(0, 255, 255)"
                      }
                    }
                  }}
                >
                  PRICING
                </Anchor>
                <Anchor
                  href="#faq"
                  c="white"
                  fw={500}
                  onClick={(e) => {
                    e.preventDefault()
                    const section = document.getElementById("faq")
                    if (section) {
                      section.scrollIntoView({behavior: "smooth"})
                    }
                  }}
                  styles={{
                    root: {
                      transition: "color 0.3s ease",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      "&:hover": {
                        color: "rgb(0, 255, 255)"
                      }
                    }
                  }}
                >
                  FAQ
                </Anchor>
              </Group>

              <Button
                onClick={() => {
                  const pricingSection = document.getElementById("pricing")
                  if (pricingSection) {
                    pricingSection.scrollIntoView({behavior: "smooth"})
                  }
                }}
                styles={{
                  root: {
                    background:
                      "linear-gradient(180deg, rgb(207, 157, 79), rgb(239, 202, 126))",
                    color: "#000",
                    padding: "12px 24px",
                    fontWeight: 600,
                    height: "auto",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 25px rgba(255, 215, 0, 0.3)",
                      background:
                        "linear-gradient(180deg, rgb(207, 157, 79), rgb(239, 202, 126))"
                    }
                  }
                }}
              >
                Start Building
              </Button>
            </Group>
          </Container>
        </Box>

        {/* Hero Section */}
        <Box
          component="section"
          py={{base: 60, sm: 80, md: 100}}
          pt={{md: 120}}
        >
          <Box
            style={{maxWidth: "1400px", margin: "0 auto", padding: "0 20px"}}
          >
            <Center>
              <Stack
                maw={800}
                align="center"
                ta="center"
                gap={0}
                style={{width: "100%"}}
              >
                {/* <Text
                  style={{
                    fontSize: "1.4rem",
                    color: "rgb(0, 255, 255)",
                    fontWeight: 700,
                    letterSpacing: "3px",
                    marginBottom: "30px",
                    textShadow: "0 0 20px rgba(0, 255, 255, 0.5)"
                  }}
                >
                  SKIP THE GUESSWORK
                </Text> */}

                <Title
                  order={1}
                  style={{
                    fontSize: "clamp(2.5rem, 8vw, 6rem)",
                    fontWeight: 900,
                    lineHeight: 1,
                    marginBottom: "20px",
                    background:
                      "linear-gradient(180deg, rgb(207, 157, 79), rgb(239, 202, 126))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textShadow: "0 0 40px rgba(239, 204, 126, 0.3)",
                    whiteSpace: "nowrap"
                  }}
                >
                  AI-POWERED
                </Title>

                <Title
                  order={2}
                  style={{
                    fontSize: "clamp(2rem, 7vw, 5rem)",
                    fontWeight: 900,
                    lineHeight: 1,
                    marginBottom: "30px",
                    background:
                      "linear-gradient(180deg, rgb(124, 58, 237), rgb(167, 139, 250))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    whiteSpace: "nowrap"
                  }}
                >
                  PSYCHOLOGY
                </Title>

                <Text
                  style={{
                    fontSize: "1.2rem",
                    marginBottom: "50px",
                    color: "#aaaaaa",
                    lineHeight: 1.4,
                    maxWidth: "600px"
                  }}
                >
                  Transform your brand with AI that understands human
                  psychology.
                </Text>

                <Button
                  onClick={() => {
                    const pricingSection = document.getElementById("pricing")
                    if (pricingSection) {
                      pricingSection.scrollIntoView({behavior: "smooth"})
                    }
                  }}
                  size="xl"
                  radius="md"
                  styles={{
                    root: {
                      background:
                        "linear-gradient(180deg, rgb(207, 157, 79), rgb(239, 202, 126))",
                      color: "#000",
                      padding: "16px 32px",
                      fontSize: "1rem",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 30px rgba(124, 58, 237, 0.4)",
                        background:
                          "linear-gradient(180deg, rgb(124, 58, 237), rgb(167, 139, 250))"
                      }
                    }
                  }}
                >
                  Get Your Custom Brand Message Now
                </Button>

                {/* Success Points */}
                <Stack
                  mt={50}
                  align="flex-start"
                  maw={600}
                  w="100%"
                  style={{textAlign: "left"}}
                >
                  <List {...textStyles.checkList}>
                    <List.Item>
                      <Text {...textStyles.listItemText} fw={400}>
                        Generate personalized brand messaging in under{" "}
                        <Text
                          component="span"
                          c="rgb(0, 255, 255)"
                          fw={700}
                          tt="uppercase"
                        >
                          60 seconds
                        </Text>
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text {...textStyles.listItemText} fw={400}>
                        Harness AI combined with{" "}
                        <Text
                          component="span"
                          c="rgb(0, 255, 255)"
                          fw={700}
                          tt="uppercase"
                        >
                          marketing psychology
                        </Text>{" "}
                        for superior engagement
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text {...textStyles.listItemText} fw={400}>
                        Save{" "}
                        <Text
                          component="span"
                          c="rgb(0, 255, 255)"
                          fw={700}
                          tt="uppercase"
                        >
                          time
                        </Text>{" "}
                        and reduce branding{" "}
                        <Text
                          component="span"
                          c="rgb(0, 255, 255)"
                          fw={700}
                          tt="uppercase"
                        >
                          costs
                        </Text>{" "}
                        without compromising{" "}
                        <Text
                          component="span"
                          c="rgb(0, 255, 255)"
                          fw={700}
                          tt="uppercase"
                        >
                          quality
                        </Text>
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text {...textStyles.listItemText} fw={400}>
                        Stand out{" "}
                        <Text
                          component="span"
                          c="rgb(0, 255, 255)"
                          fw={700}
                          tt="uppercase"
                        >
                          authentically
                        </Text>{" "}
                        in MENA's{" "}
                        <Text
                          component="span"
                          c="rgb(0, 255, 255)"
                          fw={700}
                          tt="uppercase"
                        >
                          competitive premium
                        </Text>{" "}
                        market
                      </Text>
                    </List.Item>
                  </List>
                </Stack>
              </Stack>
            </Center>
          </Box>
        </Box>

        {/* Problem Agitation Section */}
        <Box
          component="section"
          py={{base: 60, sm: 80, md: 100}}
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 0, 0, 0.05), rgba(139, 0, 0, 0.08))",
            borderRadius: "20px",
            margin: "80px 0"
          }}
        >
          <Container size="xl" px="40px">
            <Center>
              <Stack maw={900} align="center">
                <Title
                  order={2}
                  c="rgb(239, 204, 126)"
                  mb={30}
                  ta="center"
                  fw={700}
                  size={rem(35)}
                  style={{
                    textShadow: "0 0 20px rgba(239, 204, 126, 0.3)"
                  }}
                >
                  Struggling with Ineffective Branding That Wastes Time and
                  Money?
                </Title>

                <Box mb={25} maw={900}>
                  <List {...textStyles.dangerList}>
                    <List.Item>
                      <Text {...textStyles.dangerListItemText}>
                        Spending excessive hours crafting generic brand messages
                        that don't connect
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text {...textStyles.dangerListItemText}>
                        Investing heavily in branding efforts with little
                        customer engagement or retention
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text {...textStyles.dangerListItemText}>
                        Failing to differentiate your premium business in a
                        saturated MENA market
                      </Text>
                    </List.Item>
                  </List>
                </Box>

                <Box
                  mt={20}
                  p={20}
                  maw={900}
                  w="100%"
                  style={{
                    background: "rgba(139, 0, 0, 0.2)",
                    borderRadius: "12px",
                    borderLeft: "4px solid #ff6b6b"
                  }}
                >
                  <Text
                    {...textStyles.lightDanger}
                    style={{
                      fontSize: "1.1rem",
                      lineHeight: 1.5,
                      fontWeight: 500
                    }}
                  >
                    Without a precise, psychology-driven branding strategy, your
                    premium business risks blending in, losing valuable
                    customers, and draining resources on trial-and-error
                    marketing campaigns. This inefficiency stalls growth and
                    diminishes your professional pride.
                  </Text>
                </Box>
              </Stack>
            </Center>
          </Container>
        </Box>

        {/* Value Proposition */}
        <Box id="benefits" component="section" py={{base: 60, sm: 80, md: 100}}>
          <Container size="xl" px="20px">
            <Center>
              <Stack maw={900} align="center">
                <Title {...textStyles.sectionTitle}>
                  Why Brand Banda is the Game-Changer Your Premium Brand Needs
                </Title>

                <Box maw={900}>
                  <List {...textStyles.goldList}>
                    <List.Item>
                      <Text {...textStyles.listItemText}>
                        Advanced AI algorithms tailored to your unique language,
                        tone, and style
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text {...textStyles.listItemText}>
                        Integration of proven marketing psychology principles
                        for authentic emotional connection
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text {...textStyles.listItemText}>
                        Rapid, daily generation of targeted social media copy
                        and brand messaging
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text {...textStyles.listItemText}>
                        Exclusive focus on MENA's premium entrepreneurial market
                        segment
                      </Text>
                    </List.Item>
                  </List>
                </Box>
              </Stack>
            </Center>
          </Container>
        </Box>

        {/* Solution Overview */}
        <Box
          component="section"
          py={{base: 60, sm: 80, md: 100}}
          style={{
            background:
              "linear-gradient(135deg, rgba(239, 204, 126, 0.1), rgba(207, 157, 79, 0.15))",
            borderRadius: "20px",
            margin: "80px 0"
          }}
        >
          <Container size="xl" px="40px">
            <Center>
              <Stack maw={900} align="center">
                <Title {...textStyles.sectionTitle} mb={30}>
                  How Brand Banda Transforms Your Branding Journey
                </Title>

                <Text {...textStyles.sectionDescription}>
                  Brand Banda delivers a seamless, AI-powered platform that
                  crafts scientifically grounded, individualized brand messages
                  and compelling social media content—empowering you to engage
                  your premium audience authentically and efficiently.
                </Text>

                <Box maw={900}>
                  <List {...textStyles.goldList}>
                    <List.Item>
                      <Text
                        c="white"
                        style={{fontSize: "1.1rem", lineHeight: 1.6}}
                      >
                        Achieve consistent, high-impact brand messaging
                        customized to your business identity
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text
                        c="white"
                        style={{fontSize: "1.1rem", lineHeight: 1.6}}
                      >
                        Significantly reduce time and financial investment in
                        branding initiatives
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text
                        c="white"
                        style={{fontSize: "1.1rem", lineHeight: 1.6}}
                      >
                        Enhance customer engagement and retention through
                        psychologically informed content
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text
                        c="white"
                        style={{fontSize: "1.1rem", lineHeight: 1.6}}
                      >
                        Gain confidence and market differentiation with
                        data-driven branding strategies
                      </Text>
                    </List.Item>
                  </List>
                </Box>
              </Stack>
            </Center>
          </Container>
        </Box>

        {/* Psychology Section */}
        <Box
          component="section"
          py={{base: 60, sm: 80, md: 100}}
          style={{
            background:
              "linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(0, 255, 255, 0.05), rgba(124, 58, 237, 0.12))",
            margin: "80px 0",
            borderRadius: "20px",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            boxShadow: "0 0 40px rgba(0, 255, 255, 0.1)"
          }}
        >
          <Container size="xl" px="20px">
            <Center>
              <Stack maw={900} align="center">
                <Title
                  order={2}
                  size={rem(35)}
                  fw={800}
                  mb={30}
                  style={{
                    textAlign: "center",
                    color: "rgb(251, 246, 205)",
                    textShadow: "0 0 15px rgb(211, 162, 81)"
                  }}
                >
                  The Psychology Behind The Power
                </Title>

                <Text {...textStyles.sectionDescription} mb={40}>
                  Our AI doesn't just write copy—it understands human
                  psychology. Using principles of persuasion, cognitive bias,
                  and emotional triggers, Brand Banda creates messages that move
                  minds and drive action. Every word is strategically chosen to
                  maximize impact.
                </Text>

                <SimpleGrid cols={{base: 1, sm: 2, md: 4}} spacing={30} mt={50}>
                  <Box ta="left" p={20}>
                    <Text {...getTextProps("goldAccent", {mb: 10})}>
                      Scarcity Principle
                    </Text>
                    <Text c="#aaaaaa">
                      Creates urgency and desire through limited availability
                      messaging
                    </Text>
                  </Box>
                  <Box ta="left" p={20}>
                    <Text {...getTextProps("goldAccent", {mb: 10})}>
                      Social Proof
                    </Text>
                    <Text c="#aaaaaa">
                      Leverages testimonials and success stories for credibility
                    </Text>
                  </Box>
                  <Box ta="left" p={20}>
                    <Text {...getTextProps("goldAccent", {mb: 10})}>
                      Emotional Triggers
                    </Text>
                    <Text c="#aaaaaa">
                      Activates specific emotions that drive purchasing
                      decisions
                    </Text>
                  </Box>
                  <Box ta="left" p={20}>
                    <Text {...getTextProps("goldAccent", {mb: 10})}>
                      Authority Positioning
                    </Text>
                    <Text c="#aaaaaa">
                      Establishes your brand as the trusted expert in your field
                    </Text>
                  </Box>
                </SimpleGrid>
              </Stack>
            </Center>
          </Container>
        </Box>

        {/* Product Features */}
        <Box component="section" py={{base: 60, sm: 80, md: 100}}>
          <Container size="xl" px="20px">
            <Center>
              <Stack maw={1000} align="center" w="100%">
                <Title {...textStyles.sectionTitle} mb={60}>
                  Platform Features Designed for Premium Success
                </Title>

                <SimpleGrid
                  cols={{base: 1, md: 2}}
                  spacing={40}
                  mb={60}
                  w="100%"
                >
                  <Card
                    p={30}
                    radius="lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(239, 204, 126, 0.2)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        background: "rgba(124, 58, 237, 0.1)",
                        border: "1px solid rgba(124, 58, 237, 0.5)",
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 30px rgba(124, 58, 237, 0.25)"
                      }
                    }}
                  >
                    <Group mb={20} align="center" gap={15} wrap="nowrap">
                      <Text
                        {...textStyles.featureEmoji}
                        style={{
                          ...textStyles.featureEmoji.style,
                          flexShrink: 0
                        }}
                      >
                        🧠
                      </Text>
                      <Title
                        {...textStyles.featureTitle}
                        style={{...textStyles.featureTitle.style, flex: 1}}
                      >
                        AI-Driven Personalization
                      </Title>
                    </Group>
                    <Text {...textStyles.featureDescription}>
                      Generates bespoke brand messaging aligned with your unique
                      voice and style.
                    </Text>
                  </Card>

                  <Card
                    p={30}
                    radius="lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(239, 204, 126, 0.2)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        background: "rgba(124, 58, 237, 0.1)",
                        border: "1px solid rgba(124, 58, 237, 0.5)",
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 30px rgba(124, 58, 237, 0.25)"
                      }
                    }}
                  >
                    <Group mb={20} align="center" gap={15} wrap="nowrap">
                      <Text
                        {...textStyles.featureEmoji}
                        style={{
                          ...textStyles.featureEmoji.style,
                          flexShrink: 0
                        }}
                      >
                        🧭
                      </Text>
                      <Title
                        {...textStyles.featureTitle}
                        style={{...textStyles.featureTitle.style, flex: 1}}
                      >
                        Marketing Psychology Integration
                      </Title>
                    </Group>
                    <Text {...textStyles.featureDescription}>
                      Leverages cognitive triggers proven to boost customer
                      engagement.
                    </Text>
                  </Card>

                  <Card
                    p={30}
                    radius="lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(239, 204, 126, 0.2)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        background: "rgba(124, 58, 237, 0.1)",
                        border: "1px solid rgba(124, 58, 237, 0.5)",
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 30px rgba(124, 58, 237, 0.25)"
                      }
                    }}
                  >
                    <Group mb={20} align="center" gap={15} wrap="nowrap">
                      <Text
                        {...textStyles.featureEmoji}
                        style={{
                          ...textStyles.featureEmoji.style,
                          flexShrink: 0
                        }}
                      >
                        ⚡
                      </Text>
                      <Title
                        {...textStyles.featureTitle}
                        style={{...textStyles.featureTitle.style, flex: 1}}
                      >
                        Rapid Output
                      </Title>
                    </Group>
                    <Text {...textStyles.featureDescription}>
                      Produces precise brand and social media copy in under one
                      minute, daily.
                    </Text>
                  </Card>

                  <Card
                    p={30}
                    radius="lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(239, 204, 126, 0.2)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        background: "rgba(124, 58, 237, 0.1)",
                        border: "1px solid rgba(124, 58, 237, 0.5)",
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 30px rgba(124, 58, 237, 0.25)"
                      }
                    }}
                  >
                    <Group mb={20} align="center" gap={15} wrap="nowrap">
                      <Text
                        {...textStyles.featureEmoji}
                        style={{
                          ...textStyles.featureEmoji.style,
                          flexShrink: 0
                        }}
                      >
                        📊
                      </Text>
                      <Title
                        {...textStyles.featureTitle}
                        style={{...textStyles.featureTitle.style, flex: 1}}
                      >
                        Data-Backed Insights
                      </Title>
                    </Group>
                    <Text {...textStyles.featureDescription}>
                      Continuously refines messaging through performance
                      analytics and client feedback.
                    </Text>
                  </Card>
                </SimpleGrid>
              </Stack>
            </Center>
          </Container>
        </Box>

        {/* Social Proof */}
        <Box
          id="testimonials"
          component="section"
          py={{base: 60, sm: 80, md: 100}}
          style={{
            background:
              "linear-gradient(135deg, rgba(239, 204, 126, 0.05), rgba(207, 157, 79, 0.1))",
            margin: "80px 0",
            borderRadius: "20px"
          }}
        >
          <Container size="xl" px="28px">
            <Center>
              <Stack maw={1200} align="center" w="100%">
                <Title {...textStyles.sectionTitle} mb={60}>
                  Trusted by MENA's Premium Entrepreneurs
                </Title>

                {/* Testimonials Grid */}
                <SimpleGrid
                  cols={{base: 1, sm: 2, md: 3}}
                  spacing={30}
                  mb={60}
                  w="100%"
                >
                  <Card
                    p={30}
                    radius="lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(239, 204, 126, 0.2)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        background: "rgba(124, 58, 237, 0.1)",
                        border: "1px solid rgba(124, 58, 237, 0.5)",
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 30px rgba(124, 58, 237, 0.25)"
                      }
                    }}
                  >
                    <Group mb={15}>
                      <Rating defaultValue={5} color="violet" />
                    </Group>
                    <Text c="white" size="lg" fs="italic" mb={20}>
                      "Brand Banda transformed our branding approach—our
                      customer engagement soared by 40%, and we saved countless
                      hours. The AI-generated messages resonate deeply with our
                      audience."
                    </Text>
                    <Text c="rgb(239, 204, 126)" fw={600}>
                      - Layla A., Dubai Startup Founder
                    </Text>
                  </Card>

                  <Card
                    p={30}
                    radius="lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(239, 204, 126, 0.2)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        background: "rgba(124, 58, 237, 0.1)",
                        border: "1px solid rgba(124, 58, 237, 0.5)",
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 30px rgba(124, 58, 237, 0.25)"
                      }
                    }}
                  >
                    <Group mb={15}>
                      <Rating defaultValue={5} color="violet" />
                    </Group>
                    <Text c="white" size="lg" fs="italic" mb={20}>
                      "The integration of psychology with AI is a game-changer.
                      Brand Banda 's service helped us differentiate in a
                      crowded market and confidently launch our new product
                      line."
                    </Text>
                    <Text c="rgb(239, 204, 126)" fw={600}>
                      - Omar K., Riyadh Business Owner
                    </Text>
                  </Card>

                  <Card
                    p={30}
                    radius="lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(239, 204, 126, 0.2)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        background: "rgba(124, 58, 237, 0.1)",
                        border: "1px solid rgba(124, 58, 237, 0.5)",
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 30px rgba(124, 58, 237, 0.25)"
                      }
                    }}
                  >
                    <Group mb={15}>
                      <Rating defaultValue={5} color="violet" />
                    </Group>
                    <Text c="white" size="lg" fs="italic" mb={20}>
                      "Fast, reliable, and tailored perfectly to our brand's
                      voice. Brand Banda is the premium branding partner every
                      serious entrepreneur needs."
                    </Text>
                    <Text c="rgb(239, 204, 126)" fw={600}>
                      - Nour H., Cairo Entrepreneur
                    </Text>
                  </Card>
                </SimpleGrid>

                {/* Featured Expert Testimonial */}
                <Card
                  p={40}
                  radius="lg"
                  mb={50}
                  w="100%"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(239, 204, 126, 0.1), rgba(207, 157, 79, 0.15))",
                    border: "2px solid rgba(239, 204, 126, 0.3)"
                  }}
                >
                  <Grid align="center">
                    <Grid.Col span={{base: 12, sm: 8}}>
                      <Title order={3} c="rgb(239, 204, 126)" fw={700} mb={10}>
                        Sarah Al-Mansouri
                      </Title>
                      <Text c="#cccccc" size="md" mb={20}>
                        Marketing Strategist & Author
                      </Text>
                      <Text c="white" size="xl" fs="italic">
                        "Brand Banda sets a new standard by combining AI with
                        deep marketing psychology—perfect for premium brands
                        aiming for authentic connection and growth."
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, sm: 4}}>
                      <Box
                        h={200}
                        style={{
                          background:
                            "linear-gradient(45deg, #1a1a2e, #16213e)",
                          borderRadius: "12px",
                          border: "2px solid rgba(239, 204, 126, 0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          overflow: "hidden",
                          cursor: "pointer"
                        }}
                      >
                        {/* Video Play Button Overlay */}
                        <Box
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: "rgba(239, 204, 126, 0.9)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition:
                              "transform 0.3s ease, background 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.1)",
                              background: "rgba(239, 204, 126, 1)"
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "24px",
                              color: "#000",
                              marginLeft: "4px"
                            }}
                          >
                            ▶
                          </Text>
                        </Box>

                        {/* Bottom label */}
                        <Box
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "rgba(0, 0, 0, 0.7)",
                            padding: "8px",
                            borderBottomLeftRadius: "12px",
                            borderBottomRightRadius: "12px"
                          }}
                        >
                          <Text
                            c="rgb(239, 204, 126)"
                            size="xs"
                            ta="center"
                            fw={600}
                          >
                            Watch Sarah's Story
                          </Text>
                        </Box>
                      </Box>
                    </Grid.Col>
                  </Grid>
                </Card>
              </Stack>
            </Center>
          </Container>
        </Box>

        {/* Success vs Failure - Hidden */}
        {/* <Box
          component="section"
          py={40}
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 128, 0, 0.1), rgba(255, 0, 0, 0.1))",
            margin: "60px 0",
            borderRadius: "20px"
          }}
        >
          <Container size="xl" px="20px">
            <Stack align="center" w="100%">
              <Grid align="stretch" w="100%" maw={1000}>
                <Grid.Col span={{base: 12, sm: 6}}>
                  <Card
                    h="100%"
                    p={40}
                    radius="lg"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.15))",
                      border: "2px solid rgba(34, 197, 94, 0.3)"
                    }}
                  >
                    <Group mb={25}>
                      <Text size={rem(40)}>✅</Text>
                      <Title order={3} c="#22c55e" fw={800}>
                        SUCCESS
                      </Title>
                    </Group>
                    <Text c="white" size="xl" mb={20}>
                      With Brand Banda , you confidently launch compelling brands
                      that resonate deeply, securing loyal customers and premium
                      market positioning.
                    </Text>
                    <Alert
                      styles={{
                        root: {
                          background: "rgba(34, 197, 94, 0.1)",
                          border: "none",
                          borderLeft: "4px solid #22c55e"
                        }
                      }}
                    >
                      <Text {...textStyles.success}>
                        → Loyal Customers → Premium Positioning → Market
                        Leadership
                      </Text>
                    </Alert>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{base: 12, sm: 6}}>
                  <Card
                    h="100%"
                    p={40}
                    radius="lg"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.15))",
                      border: "2px solid rgba(239, 68, 68, 0.3)"
                    }}
                  >
                    <Group mb={25}>
                      <Text size={rem(40)}>❌</Text>
                      <Title order={3} c="#ef4444" fw={800}>
                        FAILURE
                      </Title>
                    </Group>
                    <Text c="white" size="xl" mb={20}>
                      Without Brand Banda , continued reliance on generic branding
                      risks wasted resources, weak engagement, and lost
                      opportunities in a competitive premium market.
                    </Text>
                    <Alert
                      styles={{
                        root: {
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "none",
                          borderLeft: "4px solid #ef4444"
                        }
                      }}
                    >
                      <Text {...textStyles.error}>
                        → Wasted Resources → Weak Engagement → Lost
                        Opportunities
                      </Text>
                    </Alert>
                  </Card>
                </Grid.Col>
              </Grid>
            </Stack>
          </Container>
        </Box> */}

        {/* Pricing Section with Real Plans */}
        <Box
          id="pricing"
          component="section"
          py={{base: 60, sm: 80, md: 100}}
          my={{base: 60, sm: 80, md: 100}}
          style={{
            background:
              "linear-gradient(135deg, rgba(239, 204, 126, 0.1), rgba(207, 157, 79, 0.15))",
            borderRadius: "20px"
          }}
        >
          <Container size="xl" px="20px">
            <Center>
              <Stack maw={1200} align="center" w="100%">
                <Title {...textStyles.sectionTitle} mb={20}>
                  Choose Your Perfect Plan
                </Title>

                {/* Special Offer Banner */}
                <Card
                  p={0}
                  radius="lg"
                  pos="relative"
                  mb={5}
                  w="100%"
                  maw={600}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(239, 204, 126, 0.2), rgba(207, 157, 79, 0.25))",
                    border: "2px solid rgba(239, 204, 126, 0.4)",
                    overflow: "visible"
                  }}
                >
                  {/* Badge positioned half in/half out like MOST POPULAR */}
                  <Center>
                    <Badge
                      size="lg"
                      radius="xl"
                      style={{
                        background: "rgb(239, 204, 126)",
                        color: "#000",
                        fontWeight: 700,
                        padding: "8px 20px",
                        marginTop: "-15px",
                        marginBottom: "20px",
                        zIndex: 10,
                        fontSize: "0.9rem"
                      }}
                    >
                      LIMITED TIME OFFER
                    </Badge>
                  </Center>

                  <Box p={30} pt={10}>
                    <Title
                      order={3}
                      fw={700}
                      mb={15}
                      ta="center"
                      style={{color: "rgb(239, 204, 126)", fontSize: "1.6rem"}}
                    >
                      🎁 Special Launch Bonus
                    </Title>
                    <Text
                      c="white"
                      ta="center"
                      style={{fontSize: "1.2rem", lineHeight: 1.6}}
                    >
                      Sign up today and receive{" "}
                      <Text component="span" c="rgb(239, 204, 126)" fw={700}>
                        DOUBLE CREDITS
                      </Text>{" "}
                      on your first purchase
                    </Text>
                  </Box>
                </Card>

                {/* View Toggle Button - Separate Line */}
                <Group justify="flex-end" w="100%" mb={20}>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setViewMode(viewMode === "cards" ? "table" : "cards")
                    }
                    leftSection={
                      viewMode === "cards" ? (
                        <MdViewList size={18} />
                      ) : (
                        <MdViewModule size={18} />
                      )
                    }
                    styles={{
                      root: {
                        borderColor: "rgb(239, 204, 126)",
                        color: "rgb(239, 204, 126)",
                        fontWeight: 600,
                        "&:hover": {
                          background: "rgba(239, 204, 126, 0.1)",
                          borderColor: "rgb(239, 204, 126)"
                        }
                      }
                    }}
                  >
                    {viewMode === "cards" ? "Compare Plans" : "Card View"}
                  </Button>
                </Group>

                {/* Comparison Table View */}
                {viewMode === "table" && (
                  <Box
                    mb={60}
                    w="100%"
                    style={{
                      overflowX: "auto",
                      background: "rgba(255, 255, 255, 0.02)",
                      borderRadius: "16px",
                      border: "1px solid rgba(239, 204, 126, 0.2)",
                      padding: "20px"
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        minWidth: "800px"
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "20px",
                              borderBottom:
                                "2px solid rgba(239, 204, 126, 0.3)",
                              color: "rgb(239, 204, 126)",
                              fontSize: "1.1rem",
                              fontWeight: 700,
                              minWidth: "200px"
                            }}
                          >
                            Features
                          </th>
                          {plans
                            .filter((p) => p.price > 0)
                            .map((plan) => (
                              <th
                                key={plan._id}
                                style={{
                                  textAlign: "center",
                                  padding: "20px",
                                  borderBottom:
                                    "2px solid rgba(239, 204, 126, 0.3)",
                                  position: "relative"
                                }}
                              >
                                {plan.isPopular && (
                                  <Badge
                                    size="sm"
                                    style={{
                                      position: "absolute",
                                      top: "-10px",
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                      background: "rgb(124, 58, 237)",
                                      color: "#fff",
                                      fontWeight: 700,
                                      boxShadow:
                                        "0 4px 15px rgba(124, 58, 237, 0.3)"
                                    }}
                                  >
                                    MOST POPULAR
                                  </Badge>
                                )}
                                <Stack align="center" gap={8}>
                                  <Box>
                                    {plan.icon === "starter" && (
                                      <MdRocket
                                        size={30}
                                        color="rgb(239, 204, 126)"
                                      />
                                    )}
                                    {plan.icon === "professional" && (
                                      <MdWorkspacePremium
                                        size={30}
                                        color="rgb(239, 204, 126)"
                                      />
                                    )}
                                    {plan.icon === "business" && (
                                      <MdGroups
                                        size={30}
                                        color="rgb(239, 204, 126)"
                                      />
                                    )}
                                    {plan.icon === "enterprise" && (
                                      <MdDomain
                                        size={30}
                                        color="rgb(239, 204, 126)"
                                      />
                                    )}
                                    {plan.icon === "custom" && (
                                      <MdDashboardCustomize
                                        size={30}
                                        color="rgb(239, 204, 126)"
                                      />
                                    )}
                                  </Box>
                                  <Text
                                    c="rgb(239, 204, 126)"
                                    fw={700}
                                    size="xl"
                                  >
                                    {plan.name}
                                  </Text>
                                  <Text c="#cccccc" size="sm">
                                    {plan.description}
                                  </Text>
                                </Stack>
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {/* Pricing Row */}
                        <tr>
                          <td
                            style={{
                              padding: "20px",
                              borderBottom:
                                "1px solid rgba(239, 204, 126, 0.1)",
                              color: "#ffffff",
                              fontWeight: 600
                            }}
                          >
                            Package Price
                          </td>
                          {plans
                            .filter((p) => p.price > 0)
                            .map((plan) => (
                              <td
                                key={plan._id}
                                style={{
                                  textAlign: "center",
                                  padding: "20px",
                                  borderBottom:
                                    "1px solid rgba(239, 204, 126, 0.1)"
                                }}
                              >
                                <Stack align="center" gap={5}>
                                  <Text
                                    style={{
                                      fontSize: "2rem",
                                      fontWeight: 800,
                                      color: "rgb(239, 204, 126)"
                                    }}
                                  >
                                    {plan.price > 0 ? `$${plan.price}` : "Free"}
                                  </Text>
                                  {plan.savings && (
                                    <Badge
                                      size="sm"
                                      variant="filled"
                                      color="green"
                                    >
                                      {plan.savings}
                                    </Badge>
                                  )}
                                </Stack>
                              </td>
                            ))}
                        </tr>

                        {/* Credits Row */}
                        <tr>
                          <td
                            style={{
                              padding: "20px",
                              borderBottom:
                                "1px solid rgba(239, 204, 126, 0.1)",
                              color: "#ffffff",
                              fontWeight: 600
                            }}
                          >
                            Credits Included
                          </td>
                          {plans
                            .filter((p) => p.price > 0)
                            .map((plan) => (
                              <td
                                key={plan._id}
                                style={{
                                  textAlign: "center",
                                  padding: "20px",
                                  borderBottom:
                                    "1px solid rgba(239, 204, 126, 0.1)"
                                }}
                              >
                                <Text c="rgb(239, 204, 126)" fw={600}>
                                  {plan.credits.toLocaleString()}
                                </Text>
                              </td>
                            ))}
                        </tr>

                        {/* Credit Validity Period Row */}
                        <tr>
                          <td
                            style={{
                              padding: "20px",
                              borderBottom:
                                "1px solid rgba(239, 204, 126, 0.1)",
                              color: "#ffffff",
                              fontWeight: 600
                            }}
                          >
                            Credit Validity
                          </td>
                          {plans
                            .filter((p) => p.price > 0)
                            .map((plan) => (
                              <td
                                key={plan._id}
                                style={{
                                  textAlign: "center",
                                  padding: "20px",
                                  borderBottom:
                                    "1px solid rgba(239, 204, 126, 0.1)"
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: "1.2rem",
                                    fontWeight: 600,
                                    color: "rgb(239, 204, 126)"
                                  }}
                                >
                                  {plan.creditValidityDays} days
                                </Text>
                                <Text c="#86efac" size="xs" mt={5}>
                                  Credits roll over if renewed on time
                                </Text>
                              </td>
                            ))}
                        </tr>

                        {/* Feature Rows */}
                        {[
                          {
                            feature: "Projects",
                            values: ["1 Project", "Unlimited", "Unlimited"]
                          },
                          {
                            feature: "Brand Messaging",
                            values: ["Basic", "Advanced AI", "Advanced AI"]
                          },
                          {
                            feature: "Support",
                            values: ["Email", "Priority", "Dedicated Manager"]
                          },
                          {
                            feature: "Templates",
                            values: ["Standard", "Custom", "Custom"]
                          },
                          {
                            feature: "Analytics",
                            values: [
                              <MdClose color="#ff6b6b" />,
                              <MdCheck color="#86efac" />,
                              <MdCheck color="#86efac" />
                            ]
                          },
                          {
                            feature: "Team Collaboration",
                            values: [
                              <MdClose color="#ff6b6b" />,
                              <MdClose color="#ff6b6b" />,
                              <MdCheck color="#86efac" />
                            ]
                          },
                          {
                            feature: "API Access",
                            values: [
                              <MdClose color="#ff6b6b" />,
                              <MdClose color="#ff6b6b" />,
                              <MdCheck color="#86efac" />
                            ]
                          }
                        ].map((row, idx) => (
                          <tr key={idx}>
                            <td
                              style={{
                                padding: "20px",
                                borderBottom:
                                  "1px solid rgba(239, 204, 126, 0.1)",
                                color: "#ffffff",
                                fontWeight: 600
                              }}
                            >
                              {row.feature}
                            </td>
                            {row.values.map((value, planIdx) => (
                              <td
                                key={planIdx}
                                style={{
                                  textAlign: "center",
                                  padding: "20px",
                                  borderBottom:
                                    "1px solid rgba(239, 204, 126, 0.1)",
                                  color: "#cccccc"
                                }}
                              >
                                {typeof value === "string" ? value : value}
                              </td>
                            ))}
                          </tr>
                        ))}

                        {/* Credit Packages Row */}
                        <tr>
                          <td
                            style={{
                              padding: "20px",
                              borderBottom:
                                "1px solid rgba(239, 204, 126, 0.1)",
                              color: "#ffffff",
                              fontWeight: 600
                            }}
                          >
                            Credit Packages
                          </td>
                          {plans
                            .filter((p) => p.price > 0)
                            .map((plan) => (
                              <td
                                key={plan._id}
                                style={{
                                  textAlign: "center",
                                  padding: "20px",
                                  borderBottom:
                                    "1px solid rgba(239, 204, 126, 0.1)",
                                  color: "#cccccc",
                                  fontSize: "0.85rem"
                                }}
                              >
                                {plan.creditPackages &&
                                plan.creditPackages.length > 0 ? (
                                  <Stack gap={5}>
                                    {plan.creditPackages
                                      .slice(0, 2)
                                      .map((pkg, idx) => (
                                        <Text key={idx} size="xs" c="#aaa">
                                          {pkg.credits} for ${pkg.price}
                                        </Text>
                                      ))}
                                    {plan.creditPackages.length > 2 && (
                                      <Text
                                        size="xs"
                                        c="rgb(239, 204, 126)"
                                        fs="italic"
                                      >
                                        +{plan.creditPackages.length - 2} more
                                      </Text>
                                    )}
                                  </Stack>
                                ) : (
                                  <MdClose color="#ff6b6b" />
                                )}
                              </td>
                            ))}
                        </tr>

                        {/* CTA Row */}
                        <tr>
                          <td style={{padding: "20px", border: "none"}}></td>
                          {plans
                            .filter((p) => p.price > 0)
                            .map((plan) => (
                              <td
                                key={plan._id}
                                style={{
                                  textAlign: "center",
                                  padding: "20px",
                                  border: "none"
                                }}
                              >
                                <Button
                                  onClick={() => handlePlanSelection(plan)}
                                  size="sm"
                                  styles={{
                                    root: {
                                      background: plan.isPopular
                                        ? "linear-gradient(180deg, rgb(239, 204, 126), rgb(207, 157, 79))"
                                        : "transparent",
                                      color: plan.isPopular
                                        ? "#000"
                                        : "rgb(239, 204, 126)",
                                      border: plan.isPopular
                                        ? "none"
                                        : "2px solid rgb(239, 204, 126)",
                                      fontWeight: 700,
                                      padding: "8px 16px",
                                      fontSize: "0.875rem",
                                      whiteSpace: "nowrap",
                                      "&:hover": {
                                        background:
                                          "linear-gradient(180deg, rgb(239, 204, 126), rgb(207, 157, 79))",
                                        color: "#000",
                                        transform: "translateY(-2px)",
                                        boxShadow:
                                          "0 10px 25px rgba(239, 204, 126, 0.3)"
                                      }
                                    }
                                  }}
                                >
                                  {plan.price === 0
                                    ? "Try Free"
                                    : "Get Started"}
                                </Button>
                              </td>
                            ))}
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                )}

                {/* Pricing Cards Grid */}
                {viewMode === "cards" && (
                  <SimpleGrid
                    cols={{base: 1, sm: 3, lg: 3}}
                    spacing={{base: 50, sm: 30, lg: 30}}
                    w="100%"
                    style={{paddingTop: "40px", paddingBottom: "20px"}}
                  >
                    {!plansLoading &&
                      plans
                        ?.filter((plan) => plan.price > 0)
                        .map((plan) => {
                          const isPopular = plan.isPopular
                          const isBusiness =
                            plan.name === "Content Creator Plan"

                          return (
                            <Card
                              key={plan._id}
                              p={0}
                              radius="lg"
                              pos="relative"
                              style={{
                                background: isPopular
                                  ? "linear-gradient(135deg, rgba(239, 204, 126, 0.15), rgba(207, 157, 79, 0.2))"
                                  : "rgba(255, 255, 255, 0.05)",
                                border: isPopular
                                  ? "2px solid rgba(239, 204, 126, 0.5)"
                                  : "1px solid rgba(239, 204, 126, 0.2)",
                                transform: isPopular
                                  ? "scale(1.05)"
                                  : "scale(1)",
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                overflow: "visible",
                                "&:hover": {
                                  transform: isPopular
                                    ? "scale(1.08) translateY(-5px)"
                                    : "scale(1.02) translateY(-5px)",
                                  boxShadow:
                                    "0 20px 40px rgba(239, 204, 126, 0.3)"
                                }
                              }}
                              onClick={() => handlePlanSelection(plan)}
                            >
                              {/* Popular Badge at the top */}
                              {isPopular && (
                                <Center>
                                  <Badge
                                    size="lg"
                                    radius="xl"
                                    style={{
                                      background: "rgb(124, 58, 237)",
                                      color: "#fff",
                                      fontWeight: 700,
                                      padding: "8px 20px",
                                      marginTop: "-15px",
                                      marginBottom: "20px",
                                      zIndex: 10,
                                      boxShadow:
                                        "0 4px 15px rgba(124, 58, 237, 0.3)"
                                    }}
                                  >
                                    MOST POPULAR
                                  </Badge>
                                </Center>
                              )}

                              {/* Card Content */}
                              <Box p={40} pt={isPopular ? 20 : 40}>
                                {/* Plan Icon */}
                                <Center mb={20}>
                                  <Box
                                    w={60}
                                    h={60}
                                    style={{
                                      background:
                                        "linear-gradient(135deg, rgb(239, 204, 126), rgb(207, 157, 79))",
                                      borderRadius: "50%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center"
                                    }}
                                  >
                                    {plan.icon === "starter" && (
                                      <MdRocket size={30} color="#000" />
                                    )}
                                    {plan.icon === "professional" && (
                                      <MdWorkspacePremium
                                        size={30}
                                        color="#000"
                                      />
                                    )}
                                    {plan.icon === "business" && (
                                      <MdGroups size={30} color="#000" />
                                    )}
                                    {plan.icon === "enterprise" && (
                                      <MdDomain size={30} color="#000" />
                                    )}
                                    {plan.icon === "custom" && (
                                      <MdDashboardCustomize
                                        size={30}
                                        color="#000"
                                      />
                                    )}
                                  </Box>
                                </Center>

                                {/* Plan Name */}
                                <Title
                                  order={3}
                                  ta="center"
                                  mb={10}
                                  style={{
                                    color: "rgb(239, 204, 126)",
                                    fontSize: "1.8rem",
                                    fontWeight: 700
                                  }}
                                >
                                  {plan.name}
                                </Title>

                                {/* Plan Description */}
                                <Text
                                  c="#cccccc"
                                  ta="center"
                                  mb={30}
                                  style={{fontSize: "1rem", minHeight: "48px"}}
                                >
                                  {plan.name === "Starter" &&
                                    "Perfect for trying out Brand Banda "}
                                  {plan.isPopular &&
                                    "Ideal for growing businesses"}
                                  {plan.name === "Business" &&
                                    "For teams and agencies"}
                                </Text>

                                {/* Price */}
                                <Box ta="center" mb={30}>
                                  {plan.price > 0 ? (
                                    <>
                                      <Group
                                        justify="center"
                                        align="baseline"
                                        gap={5}
                                      >
                                        <Text
                                          style={{
                                            fontSize: "3rem",
                                            fontWeight: 800,
                                            color: "rgb(239, 204, 126)",
                                            lineHeight: 1
                                          }}
                                        >
                                          ${plan.price}
                                        </Text>
                                      </Group>
                                      <Text c="#86efac" size="sm" mt={5}>
                                        Valid for {plan.creditValidityDays} days
                                      </Text>
                                    </>
                                  ) : (
                                    <Text
                                      style={{
                                        fontSize: "3rem",
                                        fontWeight: 800,
                                        color: "rgb(239, 204, 126)",
                                        lineHeight: 1
                                      }}
                                    >
                                      Pay as you go
                                    </Text>
                                  )}
                                </Box>

                                {/* Credits Info */}
                                <Box
                                  mb={30}
                                  p={15}
                                  style={{
                                    background: "rgba(239, 204, 126, 0.1)",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(239, 204, 126, 0.2)"
                                  }}
                                >
                                  <Text
                                    ta="center"
                                    c="rgb(239, 204, 126)"
                                    fw={600}
                                    size="lg"
                                  >
                                    {plan.credits > 0
                                      ? `${plan.credits.toLocaleString()} Credits`
                                      : "Buy credits as needed"}
                                  </Text>
                                  <Text
                                    ta="center"
                                    c="#cccccc"
                                    size="xs"
                                    mt={5}
                                  >
                                    {plan.credits > 0
                                      ? `Valid for ${plan.creditValidityDays} days • Credits roll over if renewed on time`
                                      : "Starting at $0.10 per credit"}
                                  </Text>
                                </Box>

                                {/* Features List */}
                                <Stack gap={15} mb={30}>
                                  {(Array.isArray(plan.features)
                                    ? plan.features
                                    : []
                                  )
                                    .slice(0, 5)
                                    .map((feature, index) => (
                                      <Group
                                        key={index}
                                        gap={10}
                                        align="flex-start"
                                        wrap="nowrap"
                                      >
                                        <ThemeIcon
                                          size={20}
                                          radius="xl"
                                          style={{
                                            background: "transparent",
                                            color:
                                              plan.highlightedFeatures?.includes(
                                                feature
                                              )
                                                ? "rgb(239, 204, 126)"
                                                : "#86efac"
                                          }}
                                        >
                                          <MdCheck size={16} />
                                        </ThemeIcon>
                                        <Text
                                          c={
                                            plan.highlightedFeatures?.includes(
                                              feature
                                            )
                                              ? "rgb(239, 204, 126)"
                                              : "white"
                                          }
                                          size="sm"
                                          fw={
                                            plan.highlightedFeatures?.includes(
                                              feature
                                            )
                                              ? 600
                                              : 400
                                          }
                                          style={{flex: 1}}
                                        >
                                          {feature}
                                        </Text>
                                      </Group>
                                    ))}

                                  {/* Credit Packages Feature */}
                                  {plan.creditPackages &&
                                    plan.creditPackages.length > 0 && (
                                      <Group
                                        gap={10}
                                        align="flex-start"
                                        wrap="nowrap"
                                      >
                                        <ThemeIcon
                                          size={20}
                                          radius="xl"
                                          style={{
                                            background: "transparent",
                                            color: "rgb(239, 204, 126)"
                                          }}
                                        >
                                          <MdCardGiftcard size={16} />
                                        </ThemeIcon>
                                        <Box style={{flex: 1}}>
                                          <Text c="white" size="sm" mb={5}>
                                            Buy credit packages anytime:
                                          </Text>
                                          <Text c="#cccccc" size="xs">
                                            {plan.creditPackages
                                              .map(
                                                (pkg) =>
                                                  `${
                                                    pkg.credits
                                                  } credits for $${pkg.price}${
                                                    pkg.discount > 0
                                                      ? ` (${pkg.discount}% off)`
                                                      : ""
                                                  }`
                                              )
                                              .join(" • ")}
                                          </Text>
                                        </Box>
                                      </Group>
                                    )}
                                </Stack>

                                {/* CTA Button */}
                                <Button
                                  fullWidth
                                  size="lg"
                                  styles={{
                                    root: {
                                      background: isPopular
                                        ? "linear-gradient(180deg, rgb(239, 204, 126), rgb(207, 157, 79))"
                                        : "transparent",
                                      color: isPopular
                                        ? "#000"
                                        : "rgb(239, 204, 126)",
                                      border: isPopular
                                        ? "none"
                                        : "2px solid rgb(239, 204, 126)",
                                      fontWeight: 700,
                                      fontSize: "1.1rem",
                                      height: "50px",
                                      transition: "all 0.3s ease",
                                      "&:hover": {
                                        background:
                                          "linear-gradient(180deg, rgb(239, 204, 126), rgb(207, 157, 79))",
                                        color: "#000",
                                        transform: "translateY(-2px)",
                                        boxShadow:
                                          "0 10px 25px rgba(239, 204, 126, 0.3)"
                                      }
                                    }
                                  }}
                                >
                                  {plan.price === 0
                                    ? "Start Free Trial"
                                    : "🚀 Get Started"}
                                </Button>
                              </Box>
                            </Card>
                          )
                        })}
                  </SimpleGrid>
                )}

                {/* Free Trial Box - Alternative Option - Only show if free trial plan exists */}
                {plans.some((plan) => plan.price === 0) && (
                  <Center mt={60} mb={60}>
                    <Box
                      p={25}
                      w="100%"
                      maw={600}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.15))",
                        border: "2px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "12px"
                      }}
                    >
                      <Group align="center" justify="center">
                        <MdCardGiftcard size={24} color="#10b981" />
                        <Title order={4} c="#10b981">
                          OR Try Free First
                        </Title>
                      </Group>
                      {(() => {
                        const freeTrial = plans.find((plan) => plan.price === 0)
                        return freeTrial ? (
                          <>
                            <Text
                              c="white"
                              ta="center"
                              mt={10}
                              style={{fontSize: "1.1rem"}}
                            >
                              Get{" "}
                              <Text component="span" c="#10b981" fw={700}>
                                {freeTrial.credits} AI Credits FREE
                              </Text>{" "}
                              - Valid for{" "}
                              {freeTrial.billingPeriod === "weekly"
                                ? "1 week"
                                : freeTrial.billingPeriod}
                            </Text>
                            <Text c="#aaa" ta="center" size="sm" mt={5}>
                              {freeTrial.features && freeTrial.features[2]
                                ? freeTrial.features[2]
                                : "1 Project limit"}{" "}
                              • Test all features • No credit card required
                            </Text>
                          </>
                        ) : null
                      })()}
                      <Center mt={15}>
                        <Button
                          size="md"
                          radius="xl"
                          onClick={() => {
                            const freeTrial = plans.find(
                              (plan) => plan.price === 0
                            )
                            if (freeTrial) {
                              handlePlanSelection(freeTrial)
                            }
                          }}
                          styles={{
                            root: {
                              background:
                                "linear-gradient(135deg, #10b981, #34d399)",
                              color: "#fff",
                              fontWeight: 700,
                              padding: "10px 30px",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #059669, #10b981)"
                              }
                            }
                          }}
                        >
                          Start Free Trial
                        </Button>
                      </Center>
                    </Box>
                  </Center>
                )}

                {/* Money Back Guarantee */}
                {/* <Box
                  mt={60}
                  p={30}
                  maw={600}
                  w="100%"
                  style={{
                    background: "rgba(34, 197, 94, 0.1)",
                    borderRadius: "16px",
                    border: "2px solid rgba(34, 197, 94, 0.3)"
                  }}
                >
                  <Group justify="center" mb={15}>
                    <ThemeIcon
                      size={60}
                      radius="xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))",
                        color: "#fff"
                      }}
                    >
                      <MdVerifiedUser size={30} />
                    </ThemeIcon>
                  </Group>
                  <Title order={3} ta="center" c="#22c55e" mb={10}>
                    30-Day Money Back Guarantee
                  </Title>
                  <Text ta="center" c="white">
                    Try Brand Banda risk-free. If you're not completely satisfied
                    within 30 days, we'll refund your purchase. No questions
                    asked.
                  </Text>
                </Box> */}
              </Stack>
            </Center>
          </Container>
        </Box>

        {/* FAQ */}
        <Box id="faq" component="section" py={{base: 60, sm: 80, md: 100}}>
          <Container size="xl" px="20px">
            <Center>
              <Stack maw={800} align="center" w="100%">
                <Title {...textStyles.sectionTitle}>
                  Frequently Asked Questions
                </Title>

                <Box ta="left">
                  <Box
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(239, 204, 126, 0.2)",
                      borderRadius: "16px",
                      padding: "30px",
                      marginBottom: "20px"
                    }}
                  >
                    <Title
                      order={3}
                      style={{
                        color: "rgb(239, 204, 126)",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <Text
                        component="span"
                        style={{
                          marginRight: "10px",
                          color: "rgb(0, 255, 255)",
                          fontWeight: 800
                        }}
                      >
                        Q:
                      </Text>
                      How does Brand Banda ensure my brand message is unique?
                    </Title>
                    <Text
                      style={{
                        color: "#cccccc",
                        fontSize: "1.1rem",
                        lineHeight: 1.6,
                        margin: 0,
                        paddingLeft: "25px"
                      }}
                    >
                      <Text
                        component="span"
                        style={{color: "rgb(239, 204, 126)", fontWeight: 600}}
                      >
                        A:
                      </Text>{" "}
                      Our AI combines your input with deep marketing psychology
                      to craft messaging tailored exclusively to your brand's
                      identity and audience.
                    </Text>
                  </Box>

                  <Box
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(239, 204, 126, 0.2)",
                      borderRadius: "16px",
                      padding: "30px",
                      marginBottom: "20px"
                    }}
                  >
                    <Title
                      order={3}
                      style={{
                        color: "rgb(239, 204, 126)",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <Text
                        component="span"
                        style={{
                          marginRight: "10px",
                          color: "rgb(0, 255, 255)",
                          fontWeight: 800
                        }}
                      >
                        Q:
                      </Text>
                      Can the platform adapt as my business grows?
                    </Title>
                    <Text
                      style={{
                        color: "#cccccc",
                        fontSize: "1.1rem",
                        lineHeight: 1.6,
                        margin: 0,
                        paddingLeft: "25px"
                      }}
                    >
                      <Text
                        component="span"
                        style={{color: "rgb(239, 204, 126)", fontWeight: 600}}
                      >
                        A:
                      </Text>{" "}
                      Yes, Brand Banda continuously refines your messaging based
                      on performance data and your evolving brand profile.
                    </Text>
                  </Box>

                  <Box
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(239, 204, 126, 0.2)",
                      borderRadius: "16px",
                      padding: "30px",
                      marginBottom: "20px"
                    }}
                  >
                    <Title
                      order={3}
                      style={{
                        color: "rgb(239, 204, 126)",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <Text
                        component="span"
                        style={{
                          marginRight: "10px",
                          color: "rgb(0, 255, 255)",
                          fontWeight: 800
                        }}
                      >
                        Q:
                      </Text>
                      Is this service suitable for startups with limited
                      branding experience?
                    </Title>
                    <Text
                      style={{
                        color: "#cccccc",
                        fontSize: "1.1rem",
                        lineHeight: 1.6,
                        margin: 0,
                        paddingLeft: "25px"
                      }}
                    >
                      <Text
                        component="span"
                        style={{color: "rgb(239, 204, 126)", fontWeight: 600}}
                      >
                        A:
                      </Text>{" "}
                      Absolutely. Brand Banda is designed to empower
                      entrepreneurs at all stages with expert-level brand
                      messaging instantly.
                    </Text>
                  </Box>

                  <Box
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(239, 204, 126, 0.2)",
                      borderRadius: "16px",
                      padding: "30px",
                      marginBottom: "20px"
                    }}
                  >
                    <Title
                      order={3}
                      style={{
                        color: "rgb(239, 204, 126)",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <Text
                        component="span"
                        style={{
                          marginRight: "10px",
                          color: "rgb(0, 255, 255)",
                          fontWeight: 800
                        }}
                      >
                        Q:
                      </Text>
                      What support is available if I need help?
                    </Title>
                    <Text
                      style={{
                        color: "#cccccc",
                        fontSize: "1.1rem",
                        lineHeight: 1.6,
                        margin: 0,
                        paddingLeft: "25px"
                      }}
                    >
                      <Text
                        component="span"
                        style={{color: "rgb(239, 204, 126)", fontWeight: 600}}
                      >
                        A:
                      </Text>{" "}
                      Our dedicated support team and branding experts are
                      available via chat, email, and scheduled consultations.
                    </Text>
                  </Box>
                </Box>
              </Stack>
            </Center>
          </Container>
        </Box>

        {/* Final CTA */}
        <Box
          component="section"
          py={{base: 60, sm: 80, md: 100}}
          mx={{base: 10, sm: 20, md: 0}}
          style={{
            background:
              "linear-gradient(135deg, rgba(239, 204, 126, 0.15), rgba(207, 157, 79, 0.2))",
            marginTop: "80px",
            marginBottom: "80px",
            borderRadius: "20px",
            border: "2px solid rgba(239, 204, 126, 0.3)"
          }}
        >
          <Container size="xl" px={{base: 20, sm: 30, md: 20}}>
            <Center>
              <Stack maw={700} align="center">
                <Title
                  order={2}
                  fw={900}
                  mb={30}
                  ta="center"
                  style={{
                    fontSize: "2.1rem",
                    color: "rgb(239, 204, 126)",
                    lineHeight: 1.2
                  }}
                >
                  Elevate Your Premium Brand With Brand Banda Today
                </Title>

                <Button
                  size="xl"
                  radius="12px"
                  mb={40}
                  onClick={() => {
                    const pricingSection = document.getElementById("pricing")
                    if (pricingSection) {
                      pricingSection.scrollIntoView({behavior: "smooth"})
                    }
                  }}
                  styles={{
                    root: {
                      background:
                        "linear-gradient(180deg, rgb(207, 157, 79), rgb(239, 202, 126))",
                      color: "#000",
                      padding: "16px 24px",
                      fontSize: "1rem",
                      fontWeight: 800,
                      border: "none",
                      boxShadow: "0 8px 25px rgba(239, 204, 126, 0.3)",
                      whiteSpace: "nowrap",
                      "@media (minWidth: 768px)": {
                        padding: "20px 60px",
                        fontSize: "1.3rem"
                      },
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 30px rgba(239, 204, 126, 0.4)"
                      }
                    },
                    label: {
                      color: "#000",
                      fontWeight: 800
                    }
                  }}
                >
                  Transform Your Brand Today
                </Button>

                <SimpleGrid
                  cols={{base: 1, sm: 2}}
                  spacing={{base: 15, md: 20}}
                >
                  <Group gap={10} align="center" wrap="nowrap">
                    <MdLock
                      size={20}
                      style={{color: "rgb(239, 204, 126)", flexShrink: 0}}
                    />
                    <Text
                      c="white"
                      size="sm"
                      fw={600}
                      style={{whiteSpace: "nowrap"}}
                    >
                      Secure Payment Processing
                    </Text>
                  </Group>

                  <Group gap={10} align="center" wrap="nowrap">
                    <MdCheck
                      size={20}
                      style={{color: "rgb(239, 204, 126)", flexShrink: 0}}
                    />
                    <Text c="white" size="sm" fw={600}>
                      Trusted by 500+ MENA Entrepreneurs
                    </Text>
                  </Group>

                  <Group gap={10} align="center" wrap="nowrap">
                    <MdHeadphones
                      size={20}
                      style={{color: "rgb(239, 204, 126)", flexShrink: 0}}
                    />
                    <Text
                      c="white"
                      size="sm"
                      fw={600}
                      style={{whiteSpace: "nowrap"}}
                    >
                      24/7 Dedicated Customer Support
                    </Text>
                  </Group>

                  <Group gap={10} align="center" wrap="nowrap">
                    <MdVerifiedUser
                      size={20}
                      style={{color: "rgb(239, 204, 126)", flexShrink: 0}}
                    />
                    <Text
                      c="white"
                      size="sm"
                      fw={600}
                      style={{whiteSpace: "nowrap"}}
                    >
                      Data Privacy Compliance
                    </Text>
                  </Group>
                </SimpleGrid>

                <Box
                  mt={30}
                  p={20}
                  style={{
                    background: "rgba(239, 204, 126, 0.1)",
                    borderRadius: "12px",
                    border: "1px solid rgba(239, 204, 126, 0.3)"
                  }}
                >
                  <Text
                    c="white"
                    fs="italic"
                    ta="center"
                    style={{fontSize: "1.1rem", margin: 0}}
                  >
                    Join the exclusive community of premium entrepreneurs who've
                    transformed their branding with AI-powered psychology
                  </Text>
                </Box>
              </Stack>
            </Center>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          py={{base: 60, sm: 80, md: 100}}
          ta="center"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            marginTop: "100px"
          }}
        >
          <Container size="xl" px="20px">
            <Text>
              &copy; 2025 Brand Banda . Revolutionizing Brand Psychology with
              AI.
            </Text>
          </Container>
        </Box>
      </Box>

      {/* Sticky Sign In Button - Below nav on md+, top corner on small */}
      <Box>
        {/* For small screens - top corner */}
        <Affix position={{top: 10, right: 10}} zIndex={1001} hiddenFrom="md">
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
            size="lg"
            radius="xl"
            styles={{
              root: {
                background: isAuthenticated
                  ? "rgba(239, 204, 126, 0.1)"
                  : "rgba(124, 58, 237, 0.1)",
                backdropFilter: "blur(10px)",
                border: isAuthenticated
                  ? "2px solid rgba(239, 204, 126, 0.5)"
                  : "2px solid rgba(124, 58, 237, 0.5)",
                width: "50px",
                height: "50px",
                padding: "4px",
                boxShadow: isAuthenticated
                  ? "0 8px 32px rgba(239, 204, 126, 0.3)"
                  : "0 8px 32px rgba(124, 58, 237, 0.3)",
                transition: "all 0.3s ease",
                color: "rgb(239, 204, 126)",
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: "0 12px 40px rgba(239, 204, 126, 0.5)",
                  background: "rgba(239, 204, 126, 0.15)",
                  borderColor: "rgba(239, 204, 126, 0.6)"
                }
              },
              label: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0",
                height: "100%",
                padding: 0
              }
            }}
          >
            {isAuthenticated ? (
              <MdDashboardCustomize size={18} />
            ) : (
              <MdLock size={18} />
            )}
            <Text size="9px" fw={700} style={{lineHeight: 1, marginTop: "1px"}}>
              {isAuthenticated ? "DASH" : "LOGIN"}
            </Text>
          </Button>
        </Affix>

        {/* For medium+ screens - below navigation */}
        <Affix position={{top: 90, right: 30}} zIndex={999} visibleFrom="md">
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
            size="lg"
            radius="xl"
            styles={{
              root: {
                background: isAuthenticated
                  ? "rgba(239, 204, 126, 0.1)"
                  : "rgba(124, 58, 237, 0.1)",
                backdropFilter: "blur(10px)",
                border: isAuthenticated
                  ? "2px solid rgba(239, 204, 126, 0.5)"
                  : "2px solid rgba(124, 58, 237, 0.5)",
                width: "50px",
                height: "50px",
                padding: "4px",
                boxShadow: isAuthenticated
                  ? "0 8px 32px rgba(239, 204, 126, 0.3)"
                  : "0 8px 32px rgba(124, 58, 237, 0.3)",
                transition: "all 0.3s ease",
                color: "rgb(239, 204, 126)",
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: "0 12px 40px rgba(239, 204, 126, 0.5)",
                  background: "rgba(239, 204, 126, 0.15)",
                  borderColor: "rgba(239, 204, 126, 0.6)"
                }
              },
              label: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0",
                height: "100%",
                padding: 0
              }
            }}
          >
            {isAuthenticated ? (
              <MdDashboardCustomize size={18} />
            ) : (
              <MdLock size={18} />
            )}
            <Text size="9px" fw={700} style={{lineHeight: 1, marginTop: "1px"}}>
              {isAuthenticated ? "DASH" : "LOGIN"}
            </Text>
          </Button>
        </Affix>
      </Box>

      {/* Signup Modal */}
      <SignupWithPlanModal
        opened={signupModalOpened}
        onClose={() => {
          setSignupModalOpened(false)
          setSelectedPlan(null)
        }}
        selectedPlan={selectedPlan}
      />
    </>
  )
}

export default Landing2
