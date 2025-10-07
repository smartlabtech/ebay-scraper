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
import ControlPanelLayout from "./components/layout/ControlPanelLayout"
import {unifiedTheme} from "./utils/theme/unifiedTheme"
import {LoadingProvider, AppLoadingOverlay} from "./contexts/LoadingContext"

// Lazy load pages
const Login = lazy(() => import("./pages/auth/Login"))
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"))
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"))
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"))
const UserDashboard = lazy(() => import("./pages/dashboard/UserDashboard"))
const StoresList = lazy(() => import("./pages/stores/StoresList"))
const KeywordsList = lazy(() => import("./pages/keywords/KeywordsList"))
const KeywordPagesList = lazy(() => import("./pages/middleWork/KeywordPagesList"))
const ManifestsList = lazy(() => import("./pages/middleWork/ManifestsList"))
const WebscraperList = lazy(() => import("./pages/webscraper/WebscraperList"))

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
    <AppLoadingOverlay visible={true} message="Loading..." />
  </MantineProvider>
)

function App() {
  // Set default document meta tags
  useEffect(() => {
    document.title = "eBay Store Manager - Control Panel"
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Manage your eBay stores efficiently with our control panel"
      )
    }
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={<PageLoader />} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme} defaultColorScheme="light">
            <LoadingProvider>
              <Notifications />
              <Router>
                <AppContent />
              </Router>
            </LoadingProvider>
          </MantineProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  )
}

// Separate component to use hooks inside Router context
function AppContent() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Control Panel routes */}
          <Route
            path="/control"
            element={
              <ProtectedRoute>
                <ControlPanelLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard Overview */}
            <Route index element={<UserDashboard />} />

            {/* Stores Management */}
            <Route path="stores" element={<StoresList />} />
            <Route path="stores/new" element={<StoresList />} />
            <Route path="stores/:id" element={<StoresList />} />
            <Route path="stores/edit/:id" element={<StoresList />} />
            <Route path="stores/import" element={<StoresList />} />
            <Route path="stores/analytics" element={<StoresList />} />

            {/* Keywords Management */}
            <Route path="keywords" element={<KeywordsList />} />

            {/* Middle Work - Keyword Pages */}
            <Route path="keyword-pages" element={<KeywordPagesList />} />

            {/* Middle Work - Manifests */}
            <Route path="manifests" element={<ManifestsList />} />

            {/* Webscraper Jobs */}
            <Route path="webscraper" element={<WebscraperList />} />

            {/* Future routes can be added here */}
            {/* <Route path="inventory" element={<Inventory />} /> */}
            {/* <Route path="analytics" element={<Analytics />} /> */}
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>

          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/control" replace />} />
          <Route path="/dashboard" element={<Navigate to="/control" replace />} />
          <Route path="/stores" element={<Navigate to="/control/stores" replace />} />
          <Route path="*" element={<Navigate to="/control" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App