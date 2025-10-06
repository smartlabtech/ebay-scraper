import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Group,
  Text,
  Alert,
  Divider,
  Box,
  Badge,
  Card,
  Progress,
  Checkbox,
  Anchor
} from "@mantine/core"
import {useForm} from "@mantine/form"
import {notifications} from "@mantine/notifications"
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdCheck,
  MdClose,
  MdInfo,
  MdRocket,
  MdWarning
} from "react-icons/md"
import {signupWithPlan, clearError} from "../../store/slices/authSlice"
import firstOrderService from "../../services/firstOrderService"
import {
  fbPixelCompleteRegistration,
  fbPixelLead,
  fbPixelInitiateCheckout,
  setFBUserData
  // fbPixelCustomEvent
} from "../../utils/fbPixel"
import {getCookie} from "../../utils/tracking"

// Helper functions for browser and OS detection
const getBrowserName = () => {
  const userAgent = navigator.userAgent
  if (userAgent.indexOf("Firefox") > -1) return "Firefox"
  if (userAgent.indexOf("SamsungBrowser") > -1) return "Samsung"
  if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1)
    return "Opera"
  if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1)
    return "Edge"
  if (userAgent.indexOf("Chrome") > -1) return "Chrome"
  if (userAgent.indexOf("Safari") > -1) return "Safari"
  return "Unknown"
}

const getOperatingSystem = () => {
  const userAgent = navigator.userAgent
  if (userAgent.indexOf("Win") > -1) return "Windows"
  if (userAgent.indexOf("Mac") > -1) return "MacOS"
  if (userAgent.indexOf("Linux") > -1) return "Linux"
  if (userAgent.indexOf("Android") > -1) return "Android"
  if (userAgent.indexOf("iOS") > -1 || userAgent.indexOf("iPhone") > -1)
    return "iOS"
  return "Unknown"
}

const SignupWithPlanModal = ({opened, onClose, selectedPlan}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {loading, error} = useSelector((state) => state.auth)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [termsAccepted, setTermsAccepted] = useState(true)

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validate: {
      firstName: (value) => (!value ? "First name is required" : null),
      lastName: (value) => (!value ? "Last name is required" : null),
      email: (value) => {
        if (!value) return "Email is required"
        if (!firstOrderService.validateEmail(value))
          return "Invalid email address"
        return null
      },
      password: (value) => {
        if (!value) return "Password is required"
        const validation = firstOrderService.validatePassword(value)
        if (!validation.isValid) return validation.message
        return null
      },
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null
    }
  })

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    if (password.length >= 8) strength += 20
    if (password.length >= 12) strength += 10
    if (/[a-z]/.test(password)) strength += 20
    if (/[A-Z]/.test(password)) strength += 20
    if (/\d/.test(password)) strength += 20
    if (/[!@#$%^&*(),.?":{}|<>_]/.test(password)) strength += 10

    setPasswordStrength(strength)
  }

  const handlePasswordChange = (value) => {
    form.setFieldValue("password", value)
    calculatePasswordStrength(value)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "red"
    if (passwordStrength < 70) return "orange"
    return "green"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Weak"
    if (passwordStrength < 70) return "Medium"
    return "Strong"
  }

  const handleSubmit = async (values) => {
    if (!termsAccepted) {
      notifications.show({
        title: "Terms Required",
        message: "Please accept the terms and conditions to continue",
        color: "red",
        icon: <MdWarning />
      })
      return
    }

    if (!selectedPlan) {
      notifications.show({
        title: "Plan Required",
        message: "Please select a plan to continue",
        color: "red",
        icon: <MdWarning />
      })
      return
    }

    try {
      // Clear any previous errors
      dispatch(clearError())

      // Track Lead event when user starts signup
      // fbPixelLead({
      //   value: selectedPlan.price,
      //   currency: "USD",
      //   contentName: `Signup Started - ${selectedPlan.name}`,
      //   category: "Registration"
      // })

      // Get tracking data from session (collected in App.jsx)
      const trackingData = JSON.parse(
        sessionStorage.getItem("trackingData") || "{}"
      )

      // Generate or retrieve session ID for linking anonymous events
      let sessionId = sessionStorage.getItem("sessionId")
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 15)}`
        sessionStorage.setItem("sessionId", sessionId)
      }

      // Create the signup data with comprehensive tracking
      const signupData = {
        planId: selectedPlan._id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        sessionId: sessionId, // Link to anonymous tracking events
        // Add comprehensive tracking data for backend processing
        fbPixelData: {
          // Facebook cookies (use from tracking data or get fresh)
          fbp: trackingData.fbp_cookie || getCookie("_fbp"),
          fbc: trackingData.fbc_cookie || getCookie("_fbc"),

          // Location data from IP geolocation
          ip: trackingData.ip,
          city: trackingData.city,
          region: trackingData.region,
          country: trackingData.country_name,
          countryCode: trackingData.country_code,
          countryCallingCode: trackingData.country_calling_code,
          currency: trackingData.currency || "USD",
          timezone: trackingData.timezone,
          latitude: trackingData.latitude,
          longitude: trackingData.longitude,
          postal: trackingData.postal,

          // Browser and device info
          userAgent: trackingData.user_agent || navigator.userAgent,
          language: trackingData.language || navigator.language,
          screenResolution: trackingData.screen_resolution,
          viewportSize: trackingData.viewport_size,
          pixelDensity: trackingData.pixel_density,

          // Traffic source
          referrer: trackingData.referrer || document.referrer || "Direct",
          landingPage: trackingData.entry_page || window.location.href,
          currentPage: window.location.href,

          // UTM parameters
          utmSource: trackingData.utm_source,
          utmMedium: trackingData.utm_medium,
          utmCampaign: trackingData.utm_campaign,
          utmContent: trackingData.utm_content,
          utmTerm: trackingData.utm_term,

          // Google Analytics cookies
          gaCookie: trackingData.ga_cookie,
          gidCookie: trackingData.gid_cookie,

          // Session info
          trackedAt: trackingData.tracked_at,
          signupAt: new Date().toISOString(),

          // Site info
          siteName: trackingData.site_name,
          siteUrl: trackingData.site_url
        },
        // Additional metadata for analytics and debugging
        metadata: {
          planName: selectedPlan.name,
          planPrice: selectedPlan.price,
          planCredits: selectedPlan.credits,
          planCurrency: selectedPlan.currency || "USD",
          signupMethod: "modal",
          deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent)
            ? "mobile"
            : "desktop",
          browserName: getBrowserName(),
          operatingSystem: getOperatingSystem(),
          isReturningVisitor:
            localStorage.getItem("hasVisitedBefore") === "true",
          pageLoadTime: performance.timing
            ? performance.timing.loadEventEnd -
              performance.timing.navigationStart
            : null,
          sessionDuration:
            Date.now() -
            parseInt(sessionStorage.getItem("sessionStartTime") || Date.now()),
          touchPoints: sessionStorage.getItem("pageViewCount") || 1
        }
      }

      // Call the signup with plan API
      const result = await dispatch(signupWithPlan(signupData)).unwrap()

      // Set user data for advanced matching
      await setFBUserData({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone, // If you collect phone in the form
        country: trackingData.country_code,
        city: trackingData.city,
        state: trackingData.region,
        zip: trackingData.postal
      })

      // Track Complete Registration event
      // fbPixelCompleteRegistration({
      //   value: selectedPlan.price,
      //   currency: 'USD',
      //   contentName: selectedPlan.name,
      //   status: 'Completed',
      //   method: 'Website',
      //   custom: {
      //     planId: selectedPlan._id,
      //     credits: selectedPlan.credits,
      //     userId: result.userId
      //   }
      // });

      // If paid plan, track Initiate Checkout
      // if (result.orderId && selectedPlan.price > 0) {
      //   fbPixelInitiateCheckout({
      //     value: selectedPlan.price,
      //     currency: 'USD',
      //     contentIds: [selectedPlan._id],
      //     contentType: 'subscription',
      //     numItems: 1
      //   });

      //   // Track custom event for paid signup
      //   fbPixelCustomEvent('PaidSignup', {
      //     planName: selectedPlan.name,
      //     planPrice: selectedPlan.price,
      //     orderId: result.orderId,
      //     credits: selectedPlan.credits
      //   });
      // } else {
      //   // Track custom event for free signup
      //   fbPixelCustomEvent('FreeSignup', {
      //     planName: selectedPlan.name,
      //     credits: selectedPlan.credits
      //   });
      // }

      // Show success notification
      notifications.show({
        title: "Account Created Successfully!",
        message: result.message || "Welcome to BrandBanda!",
        color: "green",
        icon: <MdCheck />
      })

      // Close the modal
      onClose()

      // Navigate based on whether there's an order
      if (result.orderId) {
        // Paid plan - go to checkout
        navigate(`/checkout/${result.orderId}`)
      } else {
        // Free plan - go to dashboard
        navigate("/dashboard")
      }
    } catch (error) {
      // Error is handled by Redux, but we can show additional notification
      notifications.show({
        title: "Signup Failed",
        message: error.message || "Please check your information and try again",
        color: "red",
        icon: <MdClose />
      })
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <MdRocket size={24} color="var(--mantine-color-violet-6)" />
          <Text fw={600} size="lg">
            Get Started with
          </Text>
        </Group>
      }
      size="md"
      centered
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
    >
      <Stack>
        {/* Plan Summary */}
        {selectedPlan && (
          <Card p="md" withBorder bg="violet.0">
            <Group justify="space-between" align="center">
              <Box>
                <Text fw={600} size="lg" c="violet.9">
                  {selectedPlan.name} Plan
                </Text>
                <Text size="sm" c="dimmed">
                  {selectedPlan.credits?.toLocaleString()} credits
                </Text>
              </Box>
              <Box ta="right">
                <Text size="xl" fw={700} c="violet.6">
                  ${selectedPlan.price}
                </Text>
                {selectedPlan.creditValidityDays && (
                  <Text size="xs" c="dimmed">
                    {selectedPlan.creditValidityDays} days validity
                  </Text>
                )}
              </Box>
            </Group>
          </Card>
        )}

        <Divider label="Create Your Account" labelPosition="center" />

        {/* Signup Form */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Group grow>
              <TextInput
                label="First Name"
                placeholder="John"
                leftSection={<MdPerson size={16} />}
                required
                {...form.getInputProps("firstName")}
                disabled={loading}
              />
              <TextInput
                label="Last Name"
                placeholder="Doe"
                leftSection={<MdPerson size={16} />}
                required
                {...form.getInputProps("lastName")}
                disabled={loading}
              />
            </Group>

            <TextInput
              label="Email Address"
              placeholder="john@example.com"
              leftSection={<MdEmail size={16} />}
              required
              {...form.getInputProps("email")}
              disabled={loading}
            />

            <Box>
              <PasswordInput
                label="Password"
                placeholder="Create a strong password"
                leftSection={<MdLock size={16} />}
                required
                value={form.values.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                error={form.errors.password}
                disabled={loading}
              />
              {form.values.password && (
                <Box mt="xs">
                  <Text size="xs" c="dimmed" mb={4}>
                    Password strength: {getPasswordStrengthText()}
                  </Text>
                  <Progress
                    value={passwordStrength}
                    color={getPasswordStrengthColor()}
                    size="xs"
                  />
                </Box>
              )}
            </Box>

            <PasswordInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              leftSection={<MdLock size={16} />}
              required
              {...form.getInputProps("confirmPassword")}
              disabled={loading}
            />

            <Checkbox
              label={
                <Text size="sm">
                  I accept the{" "}
                  <Anchor href="/terms" target="_blank" size="sm">
                    Terms and Conditions
                  </Anchor>{" "}
                  and{" "}
                  <Anchor href="/privacy" target="_blank" size="sm">
                    Privacy Policy
                  </Anchor>
                </Text>
              }
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.currentTarget.checked)}
              disabled={loading}
            />

            {selectedPlan?.price === 0 && (
              <Alert icon={<MdInfo />} color="blue" variant="light">
                <Text size="sm">
                  No credit card required! You'll get instant access to{" "}
                  {selectedPlan.credits?.toLocaleString()} credits.
                </Text>
              </Alert>
            )}

            <Group justify="space-between" mt="md">
              <Button variant="subtle" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                leftSection={!loading && <MdRocket size={16} />}
                variant="gradient"
                gradient={{from: "violet", to: "grape"}}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </Group>

            {/* <Text size="xs" ta="center" c="dimmed">
              Already have an account?{" "}
              <Anchor href="/login" size="xs" fw={500}>
                Sign in instead
              </Anchor>
            </Text> */}
          </Stack>
        </form>
      </Stack>
    </Modal>
  )
}

export default SignupWithPlanModal
