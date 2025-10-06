import React, {lazy, Suspense, useEffect} from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {Provider} from "react-redux"
import {PersistGate} from "redux-persist/integration/react"
import {MantineProvider, createTheme} from "@mantine/core"
import {Notifications} from "@mantine/notifications"
import {store, persistor} from "./store"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import AdminRoute from "./components/auth/AdminRoute"
import DashboardLayout from "./components/layout/DashboardLayout"
import AdminLayout from "./components/admin/AdminLayout"
import {unifiedTheme} from "./utils/theme/unifiedTheme"
import {LoadingProvider, AppLoadingOverlay} from "./contexts/LoadingContext"
import {getCookie} from "./utils/tracking"
import {initFBPixel} from "./utils/fbPixel"
import {useFBPixelPageView} from "./hooks/useFBPixel"
import {Bubble} from "@typebot.io/react"

// Lazy load pages
const Landing = lazy(() => import("./pages/landing/Landing"))
const Landing1 = lazy(() => import("./pages/landing/landingPage1/Landing1_DRY"))
const Landing2 = lazy(() => import("./pages/landing/LandingPage2/Landing2"))
const Login = lazy(() => import("./pages/auth/Login"))
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"))
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"))
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"))
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"))
const Projects = lazy(() => import("./pages/projects/Projects"))
const CreateProject = lazy(() => import("./pages/projects/CreateProject"))
const EditProject = lazy(() => import("./pages/projects/EditProject"))
const MessageList = lazy(() => import("./pages/brand-messages/MessageList"))
const MessageDetail = lazy(() => import("./pages/brand-messages/MessageDetail"))
const BrandMessageForm = lazy(() =>
  import("./pages/brand-messages/BrandMessageForm")
)
const CopyList = lazy(() => import("./pages/copies/CopyList"))
const CopyDetail = lazy(() => import("./pages/copies/CopyDetail"))
const CopyFormWizard = lazy(() => import("./pages/copies/CopyFormWizard"))
const ProductsList = lazy(() => import("./pages/products/ProductsList"))
const ProductDetail = lazy(() => import("./pages/products/ProductDetail"))
const ProductForm = lazy(() => import("./pages/products/ProductForm"))
const Settings = lazy(() => import("./pages/settings/Settings"))
const Account = lazy(() => import("./pages/settings/Account"))
const Billing = lazy(() => import("./pages/settings/Billing"))
const Preferences = lazy(() => import("./pages/settings/Preferences"))
const Pricing = lazy(() => import("./pages/Pricing"))
const Terms = lazy(() => import("./pages/legal/Terms"))
const Privacy = lazy(() => import("./pages/legal/Privacy"))
const PaymentSuccess = lazy(() => import("./pages/payment/PaymentSuccess"))
const PaymentCancel = lazy(() => import("./pages/payment/PaymentCancel"))
const PaymentFailure = lazy(() => import("./pages/payment/PaymentFailure"))
const Checkout = lazy(() => import("./pages/checkout/Checkout"))
const StoresList = lazy(() => import("./pages/stores/StoresList"))

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"))
const PlansList = lazy(() => import("./pages/admin/plans/PlansList"))
const PlanForm = lazy(() => import("./pages/admin/plans/PlanForm"))
const CreditPackagesList = lazy(() =>
  import("./pages/admin/credit-packages/CreditPackagesList")
)
const CreditPackageForm = lazy(() =>
  import("./pages/admin/credit-packages/CreditPackageForm")
)
const UsersList = lazy(() => import("./pages/admin/users/UsersList"))
const CreditsMonitoring = lazy(() =>
  import("./pages/admin/credits/CreditsMonitoring")
)
const OrdersList = lazy(() => import("./pages/admin/orders/OrdersList"))

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000 // 10 minutes
    }
  }
})

// Create Mantine theme - Using unified 2zpoint theme
const theme = createTheme(unifiedTheme.mantine)

// Loading component - using centralized LoadingOverlay
const PageLoader = () => (
  <MantineProvider theme={theme} defaultColorScheme="light">
    <AppLoadingOverlay visible={true} message="Loading BrandBanda..." />
  </MantineProvider>
)

function App() {
  // Set default document meta tags
  useEffect(() => {
    // Set page title
    document.title = "eBay Store Manager"

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.content = "Manage and analyze eBay stores"
    } else {
      const meta = document.createElement("meta")
      meta.name = "description"
      meta.content = "Manage and analyze eBay stores"
      document.head.appendChild(meta)
    }

    // Set theme color
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.content = "#7c3aed"
    } else {
      const meta = document.createElement("meta")
      meta.name = "theme-color"
      meta.content = "#7c3aed"
      document.head.appendChild(meta)
    }
  }, [])

  // Initialize session tracking
  useEffect(() => {
    // Set session start time if not already set
    if (!sessionStorage.getItem("sessionStartTime")) {
      sessionStorage.setItem("sessionStartTime", Date.now().toString())
    }

    // Increment page view count
    const currentCount = parseInt(
      sessionStorage.getItem("pageViewCount") || "0"
    )
    sessionStorage.setItem("pageViewCount", (currentCount + 1).toString())

    // Mark as returning visitor for future visits
    localStorage.setItem("hasVisitedBefore", "true")
  }, [])

  // IP Geolocation tracking - deferred to not block initial page load
  useEffect(() => {
    // Only track if not already tracked in this session
    if (sessionStorage.getItem("userTracked")) {
      return
    }

    // Delay IP lookup to improve initial page load performance
    const timeoutId = setTimeout(async () => {
      try {
        // Get user's IP-based location data
        const response = await fetch("https://ipapi.co/json/", {
          method: "GET",
          headers: {
            Accept: "application/json"
          }
        })

        // Check if response is ok (not rate limited or blocked)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const locationData = await response.json()

        // Extract required data including country calling code and currency
        const trackingData = {
          // Site identification
          site_name: "eBay Store Manager",
          site_url: window.location.origin,

          // User location info
          ip: locationData.ip,
          city: locationData.city,
          region: locationData.region,
          country: locationData.country_name,
          country_code: locationData.country_code,
          country_calling_code: locationData.country_calling_code,
          currency: locationData.currency,
          timezone: locationData.timezone,

          // Additional useful data
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          postal: locationData.postal,

          // Traffic source info
          referrer: document.referrer || "Direct",
          entry_page: window.location.href,
          utm_source: new URLSearchParams(window.location.search).get(
            "utm_source"
          ),
          utm_medium: new URLSearchParams(window.location.search).get(
            "utm_medium"
          ),
          utm_campaign: new URLSearchParams(window.location.search).get(
            "utm_campaign"
          ),
          utm_content: new URLSearchParams(window.location.search).get(
            "utm_content"
          ),
          utm_term: new URLSearchParams(window.location.search).get("utm_term"),

          // Facebook tracking cookies (if available)
          fbc_cookie: getCookie("_fbc") || null,
          fbp_cookie: getCookie("_fbp") || null,

          // Google Analytics cookies (if available)
          ga_cookie: getCookie("_ga") || null,
          gid_cookie: getCookie("_gid") || null,

          // Session info
          user_agent: navigator.userAgent,
          language: navigator.language,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          pixel_density: window.devicePixelRatio || 1,

          // Timestamp
          tracked_at: new Date().toISOString()
        }

        // Console log the tracking data for testing
        console.log("🌍 User Location & Tracking Data:", trackingData)
        console.log("🏢 Site:", trackingData.site_name)
        console.log(
          "📞 Country Calling Code:",
          trackingData.country_calling_code
        )
        console.log("💰 Currency:", trackingData.currency)
        console.log("🔗 Entry Page:", trackingData.entry_page)
        console.log("🍪 Facebook Cookies:", {
          fbc: trackingData.fbc_cookie,
          fbp: trackingData.fbp_cookie
        })
        console.log("📊 UTM Params:", {
          source: trackingData.utm_source,
          medium: trackingData.utm_medium,
          campaign: trackingData.utm_campaign,
          content: trackingData.utm_content,
          term: trackingData.utm_term
        })

        // Store in sessionStorage to avoid re-tracking on route changes
        sessionStorage.setItem("userTracked", "true")
        sessionStorage.setItem("trackingData", JSON.stringify(trackingData))

        // TODO: Send to backend when endpoint is ready
        // await fetch('/api/analytics/track-visitor', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(trackingData)
        // });
      } catch (error) {
        console.error("Failed to get location data:", error)

        // Fallback tracking with just referrer and UTM params
        const fallbackData = {
          site_name: "eBay Store Manager",
          site_url: window.location.origin,
          referrer: document.referrer || "Direct",
          entry_page: window.location.href,
          utm_source: new URLSearchParams(window.location.search).get(
            "utm_source"
          ),
          utm_medium: new URLSearchParams(window.location.search).get(
            "utm_medium"
          ),
          utm_campaign: new URLSearchParams(window.location.search).get(
            "utm_campaign"
          ),
          utm_content: new URLSearchParams(window.location.search).get(
            "utm_content"
          ),
          utm_term: new URLSearchParams(window.location.search).get("utm_term"),
          fbc_cookie: getCookie("_fbc") || null,
          fbp_cookie: getCookie("_fbp") || null,
          ga_cookie: getCookie("_ga") || null,
          user_agent: navigator.userAgent,
          language: navigator.language,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          tracked_at: new Date().toISOString()
        }

        console.log("📊 Fallback Tracking Data:", fallbackData)
        sessionStorage.setItem("userTracked", "true")
        sessionStorage.setItem("trackingData", JSON.stringify(fallbackData))
      }
    }, 2000) // Delay by 2 seconds to not block initial page load

    // Cleanup function to cancel timeout if component unmounts
    return () => clearTimeout(timeoutId)
  }, []) // Empty dependency array - runs once on mount

  // Initialize Facebook Pixel
  useEffect(() => {
    initFBPixel()
  }, [])

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" zIndex={2077} />
      <Provider store={store}>
        <PersistGate loading={<PageLoader />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <LoadingProvider>
              <Router>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />

                    {/* Stores route - public but requires auth token */}
                    <Route path="/stores" element={<StoresList />} />

                    {/* Optional landing page routes */}
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/landing1" element={<Landing1 />} />
                    <Route path="/landing2" element={<Landing2 />} />

                    {/* Payment result pages */}
                    <Route
                      path="/payment/success"
                      element={<PaymentSuccess />}
                    />
                    <Route path="/payment/cancel" element={<PaymentCancel />} />
                    <Route
                      path="/payment/failure"
                      element={<PaymentFailure />}
                    />

                    {/* Checkout page - Protected route */}
                    <Route
                      path="/checkout/:orderId"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected routes with dashboard layout */}
                    <Route
                      element={
                        <ProtectedRoute>
                          <DashboardLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route
                        path="/projects/create"
                        element={<CreateProject />}
                      />
                      <Route
                        path="/projects/:projectId/edit"
                        element={<EditProject />}
                      />
                      <Route path="/brand-messages" element={<MessageList />} />
                      <Route
                        path="/brand-messages/new"
                        element={<BrandMessageForm />}
                      />
                      <Route
                        path="/brand-messages/:id"
                        element={<MessageDetail />}
                      />
                      <Route
                        path="/brand-messages/:id/edit"
                        element={<BrandMessageForm />}
                      />
                      <Route path="/copies" element={<CopyList />} />
                      <Route path="/copies/new" element={<CopyFormWizard />} />
                      <Route path="/copies/:id" element={<CopyDetail />} />
                      <Route path="/products" element={<ProductsList />} />
                      <Route path="/products/new" element={<ProductForm />} />
                      <Route path="/products/:id" element={<ProductDetail />} />
                      <Route
                        path="/products/:id/edit"
                        element={<ProductForm />}
                      />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/settings/account" element={<Account />} />
                      <Route path="/settings/billing" element={<Billing />} />
                      <Route
                        path="/settings/preferences"
                        element={<Preferences />}
                      />
                    </Route>

                    {/* Admin Routes */}
                    <Route
                      path="/control"
                      element={
                        <AdminRoute>
                          <AdminLayout />
                        </AdminRoute>
                      }
                    >
                      <Route index element={<AdminDashboard />} />
                      <Route path="plans" element={<PlansList />} />
                      <Route path="plans/new" element={<PlanForm />} />
                      <Route path="plans/edit/:id" element={<PlanForm />} />
                      <Route
                        path="credit-packages"
                        element={<CreditPackagesList />}
                      />
                      <Route
                        path="credit-packages/new"
                        element={<CreditPackageForm />}
                      />
                      <Route
                        path="credit-packages/edit/:id"
                        element={<CreditPackageForm />}
                      />
                      <Route path="users" element={<UsersList />} />
                      <Route path="credits" element={<CreditsMonitoring />} />
                      <Route path="orders" element={<OrdersList />} />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </Router>
              {/* Typebot Chat Bubble */}
              <Bubble
                typebot="2-z-point-support-iik55lb"
                apiHost="https://typebotviewer.geeksenv.com"
                theme={{button: {backgroundColor: "#0042DA"}}}
              />
            </LoadingProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </MantineProvider>
  )
}

export default App
