/**
 * Landing1 Page - DRY Version
 * Preserves all original styling and animations while making code reusable
 */

import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
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
  List,
  Accordion,
  Anchor,
  Alert,
  Affix,
  Transition,
  rem
} from "@mantine/core"
import {useWindowScroll, useMediaQuery} from "@mantine/hooks"
import {
  MdCheck,
  MdWarning,
  MdArrowForward,
  MdAccessTime,
  MdGroups,
  MdTrendingUp,
  MdRocket,
  MdSchool,
  MdAutoAwesome,
  MdShowChart
} from "react-icons/md"

// SEO components
import SiteMetaTags from "../../../components/SEO/SiteMetaTags"
import PageSEO from "../../../components/SEO/PageSEO"
import trackingService from "../../../services/trackingService"

// Theme utilities (we'll use these where appropriate but keep original styles)
import {theme2zpoint} from "../../../utils/theme/2zpointTheme"

// Landing Data
import {landingData} from "./landingData"

const Landing1_DRY = () => {
  const navigate = useNavigate()
  const [scroll, scrollTo] = useWindowScroll()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)
  const [spotsLeft, setSpotsLeft] = useState(12)
  const [countdown, setCountdown] = useState({
    days: 5,
    hours: 14,
    minutes: 32
  })

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallMobile = useMediaQuery("(max-width: 480px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")

  // Reusable styles object - keeping all original styles
  const styles = getStyles(isMobile, isSmallMobile, scroll)

  // Countdown timer effect
  useEffect(() => {
    let endTime = localStorage.getItem("countdownEndTime")

    if (!endTime || new Date(endTime) < new Date()) {
      endTime = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem("countdownEndTime", endTime)
      localStorage.setItem("spotsLeft", "12")
    }

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = new Date(endTime).getTime() - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

        setCountdown({days, hours, minutes})

        const spots = localStorage.getItem("spotsLeft") || "12"
        setSpotsLeft(parseInt(spots))
      } else {
        localStorage.removeItem("countdownEndTime")
        localStorage.removeItem("spotsLeft")
      }
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 60000)

    const spotsTimer = setInterval(() => {
      let spots = parseInt(localStorage.getItem("spotsLeft") || "12")
      if (spots > 3 && Math.random() < 0.3) {
        spots--
        localStorage.setItem("spotsLeft", spots.toString())
        setSpotsLeft(spots)
      }
    }, 300000)

    return () => {
      clearInterval(timer)
      clearInterval(spotsTimer)
    }
  }, [])

  // Track landing page view and user interactions
  useEffect(() => {
    // Track initial page view
    trackingService.trackPageView("2zpoint Landing Page")

    let timeOnPage = 0
    const timeInterval = setInterval(() => {
      timeOnPage += 30
      trackingService.trackTimeOnPage(timeOnPage, "2zpoint Landing Page")
    }, 30000)

    // Track scroll depth - commented out like in Landing2
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
    //
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

  // Add CSS animations - preserving all original animations
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = getAnimationCSS()
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  // Scroll animations observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    }, observerOptions)

    setTimeout(() => {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.observe(el)
      })
    }, 100)

    return () => observer.disconnect()
  }, [])

  return (
    <Box style={{overflow: "hidden", maxWidth: "100%"}}>
      {/* SEO Meta Tags */}
      <SiteMetaTags {...landingData.seo} />
      <PageSEO {...landingData.seo} url="/" />

      {/* Background with all original effects */}
      <HeroBackground isMobile={isMobile} styles={styles} />

      {/* Header */}
      <Header scroll={scroll} styles={styles} isMobile={isMobile} />

      {/* Hero Section */}
      <HeroSection
        isMobile={isMobile}
        isSmallMobile={isSmallMobile}
        styles={styles}
      />

      {/* Social Proof Bar */}
      <SocialProofBar />

      {/* Problem Section */}
      <ProblemSection
        isMobile={isMobile}
        styles={styles}
        data={landingData.problemSection}
      />

      {/* Features Section */}
      <FeaturesSection
        isMobile={isMobile}
        isSmallMobile={isSmallMobile}
        features={landingData.features}
      />

      {/* Testimonials Section */}
      <TestimonialsSection
        isMobile={isMobile}
        isSmallMobile={isSmallMobile}
        testimonials={landingData.testimonials.items}
      />

      {/* FAQ Section */}
      <FAQSection
        isMobile={isMobile}
        isSmallMobile={isSmallMobile}
        faqData={landingData.faq}
        activeFaq={activeFaq}
        setActiveFaq={setActiveFaq}
      />

      {/* Countdown Section */}
      <CountdownSection
        isMobile={isMobile}
        isSmallMobile={isSmallMobile}
        countdown={countdown}
        spotsLeft={spotsLeft}
        styles={styles}
      />

      {/* Final CTA Section */}
      <FinalCTASection isMobile={isMobile} isSmallMobile={isSmallMobile} />

      {/* Footer */}
      <Footer isMobile={isMobile} styles={styles} />
    </Box>
  )
}

// Hero Background Component
const HeroBackground = ({isMobile, styles}) => (
  <>
    <Box style={styles.heroBackground}>
      <Box style={styles.patternOverlay} />
      {!isMobile && (
        <>
          <Box
            style={{
              ...styles.floatingShape,
              width: "300px",
              height: "300px",
              top: "10%",
              right: "-150px",
              opacity: 0.5
            }}
          />
          <Box
            style={{
              ...styles.floatingShape,
              width: "200px",
              height: "200px",
              bottom: "10%",
              left: "-100px",
              opacity: 0.5,
              animationDelay: "5s"
            }}
          />
        </>
      )}
    </Box>
  </>
)

// Header Component
const Header = ({scroll, styles, isMobile}) => (
  <Box
    component="header"
    style={{
      background:
        scroll.y > 50
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      padding: scroll.y > 50 ? "15px 0" : "20px 0",
      position: "fixed",
      width: "100%",
      top: 0,
      zIndex: 1000,
      boxShadow:
        scroll.y > 50
          ? "0 4px 6px rgba(0, 0, 0, 0.1)"
          : "0 1px 3px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease"
    }}
  >
    <Container size="xl" px="20px">
      <Group justify="space-between">
        <Box
          style={styles.logoWrapper}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"
          }}
        >
          <Box style={styles.logoSquare} />
          <Text style={styles.logo}>2zpoint</Text>
        </Box>

        <Group gap={40} visibleFrom="md">
          {landingData.navigation.map((item) => (
            <Anchor
              key={item.href}
              href={item.href}
              c="gray.6"
              fw={500}
              onClick={(e) => {
                e.preventDefault()
                document
                  .querySelector(item.href)
                  ?.scrollIntoView({behavior: "smooth"})
              }}
            >
              {item.label}
            </Anchor>
          ))}
        </Group>

        <Button
          size="md"
          style={{
            background: "#1e40af",
            color: "white"
          }}
          onClick={() => {
            // trackingService.trackCtaClick("Join Free Round", "Header")
            document
              .getElementById("get-started")
              ?.scrollIntoView({behavior: "smooth"})
          }}
        >
          Join Free Round
        </Button>
      </Group>
    </Container>
  </Box>
)

// Hero Section Component
const HeroSection = ({isMobile, isSmallMobile, styles}) => (
  <Box
    component="section"
    style={{
      padding: isMobile ? "100px 0 60px" : "120px 0 80px",
      position: "relative",
      minHeight: isMobile ? "auto" : "90vh",
      display: "flex",
      alignItems: "center"
    }}
  >
    <Container size="xl" px={isMobile ? "16px" : "20px"}>
      <Grid gutter={isMobile ? 40 : 60} align="center">
        <Grid.Col span={{base: 12, md: 6}}>
          <Box
            style={{
              ...styles.trustBadge,
              animation: "fadeInUp 0.8s ease 0.2s both"
            }}
          >
            <span
              style={{
                color: "#059669",
                animation: "pulse 2s infinite",
                marginRight: "8px"
              }}
            >
              ✔
            </span>
            <span style={{color: "#111827"}}>
              {landingData.hero.trustBadge}
            </span>
          </Box>

          <h1
            style={{
              fontSize: isSmallMobile ? "1.75rem" : isMobile ? "2rem" : "3rem",
              lineHeight: isMobile ? 1.2 : 1.1,
              fontWeight: 800,
              color: "#111827",
              animation: "fadeInUp 0.8s ease 0.3s both",
              marginBottom: "20px"
            }}
          >
            {landingData.hero.title.prefix}{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #1e40af, #059669)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              {landingData.hero.title.highlight}
            </span>
          </h1>

          <Text
            size={isMobile ? "md" : "xl"}
            c="gray.6"
            mb={30}
            style={{
              fontSize: isSmallMobile
                ? "1rem"
                : isMobile
                ? "1.1rem"
                : "1.25rem",
              lineHeight: 1.6,
              animation: "fadeInUp 0.8s ease 0.4s both"
            }}
          >
            {landingData.hero.subtitle}
          </Text>

          <HeroButtons isMobile={isMobile} />
          <HeroStats isMobile={isMobile} styles={styles} />
        </Grid.Col>

        <Grid.Col span={{base: 12, md: 6}} visibleFrom="md">
          <AchievementDashboard />
        </Grid.Col>
      </Grid>
    </Container>
  </Box>
)

// Hero Buttons Component
const HeroButtons = ({isMobile}) => (
  <Group
    gap={16}
    mt={32}
    style={{
      animation: "fadeInUp 0.8s ease 0.5s both",
      display: "flex",
      flexDirection: isMobile ? "column" : "row"
    }}
  >
    <Button
      size="lg"
      style={{
        background: "#1e40af",
        padding: isMobile ? "14px 32px" : "14px 32px",
        fontSize: "16px",
        fontWeight: 600,
        width: isMobile ? "100%" : "auto",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden"
      }}
      onClick={() => {
        // trackingService.trackCtaClick("Join Free Round", "Hero Section")
        document
          .getElementById("get-started")
          ?.scrollIntoView({behavior: "smooth"})
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1e3a8a"
        e.currentTarget.style.transform = "translateY(-1px)"
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(30, 64, 175, 0.2)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#1e40af"
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "none"
      }}
    >
      Join Our Next Free Round
    </Button>

    <Button
      size="lg"
      variant="outline"
      style={{
        color: "#1e40af",
        borderColor: "#1e40af",
        borderWidth: "2px",
        padding: isMobile ? "14px 32px" : "14px 32px",
        fontSize: "16px",
        fontWeight: 600,
        width: isMobile ? "100%" : "auto",
        transition: "all 0.3s ease",
        background: "white"
      }}
      onClick={() =>
        document
          .getElementById("testimonials")
          ?.scrollIntoView({behavior: "smooth"})
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1e40af"
        e.currentTarget.style.color = "white"
        e.currentTarget.style.transform = "translateY(-1px)"
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(30, 64, 175, 0.2)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "white"
        e.currentTarget.style.color = "#1e40af"
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "none"
      }}
    >
      Watch Success Stories
    </Button>
  </Group>
)

// Hero Stats Component
const HeroStats = ({isMobile, styles}) => (
  <Group
    gap={isMobile ? 20 : 40}
    justify={isMobile ? "space-between" : "flex-start"}
    style={{
      paddingTop: isMobile ? "30px" : "40px",
      marginTop: isMobile ? "30px" : "0",
      borderTop: "1px solid #e5e7eb",
      animation: "fadeInUp 0.8s ease 0.6s both"
    }}
  >
    {landingData.hero.stats.map((stat, index) => (
      <Box
        key={index}
        style={{
          flex: isMobile ? 1 : "initial",
          textAlign: isMobile ? "center" : "left",
          position: "relative",
          paddingLeft: !isMobile && index > 0 ? "40px" : 0,
          borderLeft: !isMobile && index > 0 ? "2px solid #e5e7eb" : "none"
        }}
      >
        <Text
          style={{
            fontSize: isMobile ? "1.5rem" : "2rem",
            fontWeight: 800,
            color: "#1e40af"
          }}
        >
          {stat.number}
        </Text>
        <Text
          style={{
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            color: "#6b7280",
            marginTop: "4px"
          }}
        >
          {stat.label}
        </Text>
      </Box>
    ))}
  </Group>
)

// Achievement Dashboard Component
const AchievementDashboard = () => (
  <Box
    style={{
      position: "relative",
      animation: "fadeInUp 0.8s ease 0.8s both"
    }}
  >
    <Box
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        transform: "perspective(1000px) rotateY(-5deg)",
        transition: "transform 0.3s ease",
        position: "relative"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "perspective(1000px) rotateY(-5deg)"
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: "-10px",
          right: "20px",
          background: "#dc2626",
          color: "white",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "0.75rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          animation: "pulse 2s infinite"
        }}
      >
        <Box
          component="span"
          style={{
            width: "8px",
            height: "8px",
            background: "white",
            borderRadius: "50%",
            animation: "pulse 1s infinite"
          }}
        />
        LIVE SESSION
      </Box>

      <Box
        style={{
          textAlign: "center",
          marginBottom: "24px",
          fontWeight: 700,
          color: "#111827"
        }}
      >
        What Our Members Achieve
      </Box>

      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px"
        }}
      >
        {landingData.hero.achievements.map((achievement, index) => (
          <AchievementCard key={index} {...achievement} />
        ))}
      </Box>

      <Box
        mt="xl"
        p="md"
        style={{
          background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
          borderRadius: "8px"
        }}
      >
        <Text size="xs" c="#6b7280" mb="xs" style={{fontSize: "0.875rem"}}>
          Member Success Rate
        </Text>
        <Box
          style={{
            width: "100%",
            height: "10px",
            background: "rgba(255, 255, 255, 0.5)",
            borderRadius: "5px",
            overflow: "hidden"
          }}
        >
          <Box
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #1e40af, #059669)",
              width: "87%",
              animation: "slideIn 1s ease"
            }}
          />
        </Box>
      </Box>
    </Box>
  </Box>
)

// Achievement Card Component
const AchievementCard = ({metric, value, subtitle}) => (
  <Box
    style={{
      background: "#f9fafb",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      transition: "all 0.3s ease",
      cursor: "pointer"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)"
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)"
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)"
      e.currentTarget.style.boxShadow = "none"
    }}
  >
    <Text
      size="xs"
      c="#6b7280"
      style={{fontSize: "0.875rem", marginBottom: "8px"}}
    >
      {metric}
    </Text>
    <Text
      style={{
        fontSize: "1.75rem",
        fontWeight: 700,
        color: "#111827"
      }}
    >
      {value}
    </Text>
    <Text size="xs" c="#059669" fw={600} style={{fontSize: "0.75rem"}}>
      {subtitle}
    </Text>
  </Box>
)

// Social Proof Bar Component
const SocialProofBar = () => (
  <Box py={30} style={{background: "white", borderBottom: "1px solid #e5e7eb"}}>
    <Container size="xl" px="20px">
      <Text
        ta="center"
        size="sm"
        c="gray.6"
        mb="lg"
        tt="uppercase"
        style={{letterSpacing: "1px"}}
      >
        {landingData.socialProof.title}
      </Text>
      <Group justify="center" gap={50}>
        {landingData.socialProof.companies.map((company) => (
          <Text
            key={company}
            fw={700}
            size="xl"
            c="gray.6"
            style={{opacity: 0.6}}
          >
            {company}
          </Text>
        ))}
      </Group>
    </Container>
  </Box>
)

// Problem Section Component
const ProblemSection = ({isMobile, styles, data}) => (
  <Container size="xl" px={isMobile ? "16px" : "20px"} my={isMobile ? 40 : 60}>
    <Box
      style={{
        ...styles.problemSection,
        padding: isMobile ? "30px 20px" : styles.problemSection.padding,
        margin: isMobile ? "40px 0" : styles.problemSection.margin
      }}
    >
      <Group
        mb="lg"
        align={isMobile ? "flex-start" : "center"}
        wrap={isMobile ? "wrap" : "nowrap"}
      >
        <Box style={styles.warningIcon}>!</Box>
        <Title order={3} c="red.7" size={isMobile ? "1.25rem" : "1.5rem"}>
          {data.title}
        </Title>
      </Group>

      <Stack gap="md">
        {data.problems.map((problem, index) => (
          <Group key={index} align="flex-start">
            <Text c="red.6" fw="bold">
              →
            </Text>
            <Text c="gray.6" style={{flex: 1, lineHeight: 1.6}}>
              {problem}
            </Text>
          </Group>
        ))}
      </Stack>

      <Alert
        mt="xl"
        color="red"
        variant="light"
        styles={{
          root: {
            background: "rgba(220, 38, 38, 0.05)",
            borderLeft: "4px solid #dc2626"
          }
        }}
      >
        <Text fw={600}>{data.alert.title}</Text> {data.alert.text}
      </Alert>
    </Box>
  </Container>
)

// Features Section Component
const FeaturesSection = ({isMobile, isSmallMobile, features}) => (
  <Box id="features" py={isMobile ? 60 : 80} style={{background: "white"}}>
    <Container size="xl" px={isMobile ? "16px" : "20px"}>
      <Box ta="center" mb={isMobile ? 40 : 60}>
        <Title
          order={2}
          size={isSmallMobile ? rem(24) : isMobile ? rem(28) : rem(40)}
          fw={800}
          mb={16}
        >
          {features.title}
        </Title>
        <Text size={isMobile ? "md" : "lg"} c="gray.6">
          {features.subtitle}
        </Text>
      </Box>

      <Grid gutter={isMobile ? 20 : 30}>
        {features.items.map((feature, index) => (
          <Grid.Col key={index} span={{base: 12, sm: 6, md: 4}}>
            <FeatureCard feature={feature} index={index} isMobile={isMobile} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  </Box>
)

// Feature Card Component
const FeatureCard = ({feature, index, isMobile}) => (
  <Card
    p="xl"
    radius="lg"
    style={{
      background: "white",
      border: "1px solid #e5e7eb",
      transition: "all 0.3s ease",
      height: "100%",
      cursor: "pointer"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)"
      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)"
      e.currentTarget.style.borderColor = "#1e40af"
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)"
      e.currentTarget.style.boxShadow = "none"
      e.currentTarget.style.borderColor = "#e5e7eb"
    }}
  >
    <Box
      style={{
        width: "48px",
        height: "48px",
        background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        marginBottom: "16px"
      }}
    >
      <Text size="xl">{feature.icon}</Text>
    </Box>
    <Title order={4} mb="xs">
      {feature.title}
    </Title>
    <Text c="gray.6" style={{lineHeight: 1.6}}>
      {feature.description}
    </Text>
  </Card>
)

// Testimonials Section Component
const TestimonialsSection = ({isMobile, isSmallMobile, testimonials}) => (
  <Box
    id="testimonials"
    py={isMobile ? 60 : 80}
    style={{background: "#f9fafb"}}
  >
    <Container size="xl" px={isMobile ? "16px" : "20px"}>
      <Box ta="center" mb={isMobile ? 40 : 60}>
        <Title
          order={2}
          size={isSmallMobile ? rem(24) : isMobile ? rem(28) : rem(40)}
          fw={800}
        >
          Success Stories from Professionals Like You
        </Title>
      </Box>

      <Grid gutter={isMobile ? 20 : 30}>
        {testimonials.map((testimonial, index) => (
          <Grid.Col key={index} span={{base: 12, md: 4}}>
            <TestimonialCard testimonial={testimonial} isMobile={isMobile} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  </Box>
)

// Testimonial Card Component
const TestimonialCard = ({testimonial, isMobile}) => (
  <Box
    className="animate-on-scroll"
    style={{
      background: "white",
      borderRadius: "12px",
      padding: isMobile ? "30px 24px" : "40px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
      height: "100%",
      transition: "transform 0.3s ease, box-shadow 0.3s ease"
    }}
    onMouseEnter={(e) => {
      if (!isMobile) {
        e.currentTarget.style.transform = "translateY(-5px)"
        e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.1)"
      }
    }}
    onMouseLeave={(e) => {
      if (!isMobile) {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.05)"
      }
    }}
  >
    <div
      style={{
        color: "#fbbf24",
        fontSize: "1.25rem",
        marginBottom: "16px"
      }}
    >
      ★★★★★
    </div>
    <p
      style={{
        color: "#111827",
        fontSize: isMobile ? "1rem" : "1.1rem",
        lineHeight: 1.6,
        marginBottom: "24px",
        fontStyle: "italic"
      }}
    >
      "{testimonial.text}"
    </p>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px"
      }}
    >
      <div
        style={{
          width: isMobile ? "48px" : "56px",
          height: isMobile ? "48px" : "56px",
          background: "linear-gradient(135deg, #1e40af, #059669)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: isMobile ? "18px" : "20px"
        }}
      >
        {testimonial.initials}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: "#111827"
          }}
        >
          {testimonial.name}
        </div>
        <div
          style={{
            color: "#6b7280",
            fontSize: "0.875rem"
          }}
        >
          {testimonial.title}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            color: "#059669",
            fontSize: "0.75rem",
            marginTop: "4px",
            fontWeight: 600
          }}
        >
          ✓ Verified Member Since 2024
        </div>
      </div>
    </div>
  </Box>
)

// FAQ Section Component
const FAQSection = ({
  isMobile,
  isSmallMobile,
  faqData,
  activeFaq,
  setActiveFaq
}) => (
  <Box id="faq" py={isMobile ? 60 : 80} style={{background: "white"}}>
    <Container size="md" px={isMobile ? "16px" : "20px"}>
      <Box ta="center" mb={isMobile ? 40 : 60}>
        <Title
          order={2}
          size={isSmallMobile ? rem(24) : isMobile ? rem(28) : rem(40)}
          fw={800}
        >
          Frequently Asked Questions
        </Title>
      </Box>

      <Accordion
        value={activeFaq}
        onChange={(value) => {
          if (value) {
            const faqIndex = parseInt(value.split("-")[1])
            // trackingService.trackFaqInteraction(faqData[faqIndex]?.question, 'expand')
          } else if (activeFaq) {
            const faqIndex = parseInt(activeFaq.split("-")[1])
            // trackingService.trackFaqInteraction(faqData[faqIndex]?.question, 'collapse')
          }
          setActiveFaq(value)
        }}
      >
        {faqData.map((faq, index) => (
          <Accordion.Item key={index} value={`item-${index}`}>
            <Accordion.Control>
              <Text fw={600}>{faq.question}</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text c="gray.6">{faq.answer}</Text>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  </Box>
)

// Countdown Section Component
const CountdownSection = ({
  isMobile,
  isSmallMobile,
  countdown,
  spotsLeft,
  styles
}) => (
  <Container size="xl" px={isMobile ? "16px" : "20px"} my={isMobile ? 40 : 60}>
    <Box
      p={isMobile ? "40px 20px" : "60px"}
      style={{
        background: "linear-gradient(135deg, #1e40af, #1e3a8a)",
        color: "white",
        borderRadius: isMobile ? "0" : "16px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
        margin: isMobile ? "0 -16px" : "0"
      }}
    >
      <Title
        order={2}
        mb={16}
        c="white"
        size={isSmallMobile ? rem(24) : isMobile ? rem(28) : rem(32)}
      >
        {landingData.countdown.title}
      </Title>
      <Text size={isMobile ? "md" : "lg"} mb={40} style={{opacity: 0.9}}>
        {landingData.countdown.subtitle}
      </Text>

      <Group justify="center" gap={isMobile ? "md" : "xl"} mb={40}>
        <CountdownItem
          value={spotsLeft}
          label="Spots Left"
          isMobile={isMobile}
          styles={styles}
        />
        <CountdownItem
          value={countdown.days}
          label="Days"
          isMobile={isMobile}
          styles={styles}
        />
        <CountdownItem
          value={countdown.hours}
          label="Hours"
          isMobile={isMobile}
          styles={styles}
        />
        <CountdownItem
          value={countdown.minutes}
          label="Minutes"
          isMobile={isMobile}
          styles={styles}
        />
      </Group>

      <Button
        size={isMobile ? "lg" : "xl"}
        fullWidth={isMobile}
        style={{
          background: "white",
          color: "#1e40af"
        }}
        onClick={() => {
          // trackingService.trackCtaClick("Reserve Your Spot", "Countdown Section")
          navigate("/register")
        }}
      >
        Reserve Your Spot - Join Free Round
      </Button>
    </Box>
  </Container>
)

// Countdown Item Component
const CountdownItem = ({value, label, isMobile, styles}) => (
  <Box
    style={{
      ...styles.counterBox,
      padding: isMobile ? "16px" : "20px 24px",
      minWidth: isMobile ? "70px" : "100px"
    }}
  >
    <Text size={isMobile ? rem(32) : rem(40)} fw={800}>
      {value}
    </Text>
    <Text size="xs" tt="uppercase" style={{letterSpacing: "1px", opacity: 0.9}}>
      {label}
    </Text>
  </Box>
)

// Final CTA Section Component
const FinalCTASection = ({isMobile, isSmallMobile}) => (
  <Box id="get-started" py={isMobile ? 60 : 80} style={{background: "#f9fafb"}}>
    <Container size="xl" px={isMobile ? "16px" : "20px"}>
      <Box ta="center" mb={isMobile ? 40 : 60}>
        <Title
          order={2}
          size={isSmallMobile ? rem(24) : isMobile ? rem(28) : rem(40)}
          fw={800}
          mb={16}
        >
          {landingData.finalCTA.title}
        </Title>
        <Text size={isMobile ? "md" : "lg"} c="gray.6">
          {landingData.finalCTA.subtitle}
        </Text>
      </Box>

      <Box
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(300px, 1fr))",
          gap: isMobile ? "16px" : "24px",
          maxWidth: "900px",
          margin: "0 auto 60px auto"
        }}
      >
        {landingData.finalCTA.benefits.map((item, index) => (
          <Box
            key={index}
            className="animate-on-scroll"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <span
              style={{
                color: "#059669",
                fontSize: "1.5rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Arial, sans-serif",
                lineHeight: 1
              }}
            >
              ✔
            </span>
            <span
              style={{
                color: "#111827",
                fontWeight: 500
              }}
            >
              {item}
            </span>
          </Box>
        ))}
      </Box>

      <Box ta="center">
        <Button
          size={isMobile ? "lg" : "xl"}
          fullWidth={isMobile}
          style={{
            background: "#1e40af",
            fontSize: isMobile ? "1.1rem" : "1.25rem",
            padding: isMobile ? "16px 40px" : "18px 60px"
          }}
          onClick={() => {
            // trackingService.trackCtaClick("Join Next Free Round", "Final CTA Section")
            navigate("/register")
          }}
        >
          Join Our Next Free Round
        </Button>
        <Text mt="md" c="gray.6" size="sm">
          Limited spots available • Community-driven learning • 100% free to
          start
        </Text>
      </Box>
    </Container>
  </Box>
)

// Footer Component
const Footer = ({isMobile, styles}) => {
  const navigate = useNavigate()

  return (
    <Box
      component="footer"
      py={isMobile ? "40px 0 30px" : "60px 0"}
      style={{background: "#111827", color: "white"}}
    >
      <Container size="xl" px={isMobile ? "16px" : "20px"}>
        <Grid gutter={isMobile ? 30 : 40} mb={isMobile ? 30 : 40} columns={12}>
          <Grid.Col span={{base: 12, xs: 12, sm: 5, md: 5, lg: 4}}>
            <Box
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "center" : "flex-start",
                justifyContent: isMobile ? "center" : "flex-start",
                gap: "8px",
                marginBottom: "16px",
                textAlign: isMobile ? "center" : "left"
              }}
            >
              <Box
                style={{
                  ...styles.logoSquare,
                  margin: isMobile ? "0 auto 8px" : "0"
                }}
              />
              <Text style={{...styles.logo, color: "white"}}>2zpoint</Text>
            </Box>
            <Text
              c="#9ca3af"
              size="sm"
              style={{
                lineHeight: 1.6,
                maxWidth: "350px",
                textAlign: isMobile ? "center" : "left",
                margin: isMobile ? "0 auto" : "0"
              }}
            >
              {landingData.footer.brand.description}
            </Text>
          </Grid.Col>

          {landingData.footer.sections.map((section, index) => (
            <Grid.Col
              key={index}
              span={{base: 12, xs: 12, sm: 2.33, md: 2.33, lg: 2.66}}
            >
              <Text
                fw={600}
                size="sm"
                tt="uppercase"
                mb="md"
                style={{
                  letterSpacing: "1px",
                  color: "#d1d5db",
                  fontSize: "0.875rem",
                  textAlign: isMobile ? "center" : "center"
                }}
              >
                {section.title}
              </Text>
              <Stack gap="xs" align={isMobile ? "center" : "center"}>
                {section.links.map((link, linkIndex) => (
                  <Anchor
                    key={linkIndex}
                    href={link.href}
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.875rem",
                      textDecoration: "none",
                      transition: "color 0.3s ease"
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "white")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#9ca3af")
                    }
                  >
                    {link.label}
                  </Anchor>
                ))}
              </Stack>
            </Grid.Col>
          ))}
        </Grid>

        <Box pt={32} style={{borderTop: "1px solid #374151"}}>
          <Text ta="center" style={{color: "#9ca3af", fontSize: "0.875rem"}}>
            © {new Date().getFullYear()} 2zpoint. Designed for ambitious
            professionals ready to build their legacy.
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

// Styles function - keeping all original styles
const getStyles = (isMobile, isSmallMobile, scroll) => ({
  heroBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100vh",
    background:
      "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%)",
    zIndex: -1,
    overflow: "hidden"
  },
  patternOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    opacity: 0.03,
    backgroundImage:
      "repeating-linear-gradient(45deg, #1e40af 0, #1e40af 1px, transparent 1px, transparent 15px), repeating-linear-gradient(-45deg, #1e40af 0, #1e40af 1px, transparent 1px, transparent 15px)"
  },
  floatingShape: {
    position: "absolute",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(5, 150, 105, 0.1))",
    animation: "float 20s ease-in-out infinite",
    pointerEvents: "none"
  },
  logo: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1e40af"
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    transition: "transform 0.3s ease"
  },
  logoSquare: {
    width: "32px",
    height: "32px",
    background: "linear-gradient(135deg, #1e40af, #059669)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  trustBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "white",
    border: "1px solid #e5e7eb",
    padding: "6px 14px",
    borderRadius: "20px",
    marginBottom: "20px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#4b5563",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
  },
  problemSection: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "40px",
    margin: "60px 0",
    position: "relative",
    overflow: "hidden"
  },
  warningIcon: {
    width: "24px",
    height: "24px",
    background: "#dc2626",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },
  counterBox: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    padding: "20px 24px",
    minWidth: "100px",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      background: "rgba(255, 255, 255, 0.15)"
    }
  }
})

// Animation CSS - preserving all original animations
const getAnimationCSS = () => `
  html, body {
    overflow-x: hidden !important;
    max-width: 100% !important;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    33% { transform: translateY(-30px) rotate(120deg); }
    66% { transform: translateY(20px) rotate(240deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
  }
  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
`

export default Landing1_DRY
