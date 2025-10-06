import {siteMeta} from "../config/siteMeta"

// Facebook Pixel ID from environment or siteMeta
const FB_PIXEL_ID = siteMeta.analytics.FB_PIXEL_ID

// Initialize Facebook Pixel
export const initFBPixel = () => {
  if (!FB_PIXEL_ID) {
    console.warn("Facebook Pixel ID not configured")
    return
  }

  // Check if already initialized
  if (window.fbq) return

  // Facebook Pixel Code
  ;(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = "2.0"
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  )

  // Initialize Pixel
  window.fbq("init", FB_PIXEL_ID, {
    em: localStorage.getItem("user_email_hash") || undefined,
    fn: localStorage.getItem("user_fname_hash") || undefined,
    ln: localStorage.getItem("user_lname_hash") || undefined
  })

  // Track initial page view
  window.fbq("track", "PageView")

  console.log("Facebook Pixel initialized")
}

// Hash function for advanced matching (SHA-256)
const hashValue = async (value) => {
  if (!value) return null

  const encoder = new TextEncoder()
  const data = encoder.encode(value.toLowerCase().trim())
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

// Set user data for advanced matching
export const setFBUserData = async (userData) => {
  if (!window.fbq || !FB_PIXEL_ID) return

  const hashedData = {}

  if (userData.email) {
    const hashedEmail = await hashValue(userData.email)
    hashedData.em = hashedEmail
    localStorage.setItem("user_email_hash", hashedEmail)
  }

  if (userData.firstName) {
    const hashedFn = await hashValue(userData.firstName)
    hashedData.fn = hashedFn
    localStorage.setItem("user_fname_hash", hashedFn)
  }

  if (userData.lastName) {
    const hashedLn = await hashValue(userData.lastName)
    hashedData.ln = hashedLn
    localStorage.setItem("user_lname_hash", hashedLn)
  }

  if (userData.phone) {
    hashedData.ph = await hashValue(userData.phone.replace(/\D/g, ""))
  }

  if (userData.city) {
    hashedData.ct = await hashValue(userData.city)
  }

  if (userData.state) {
    hashedData.st = await hashValue(userData.state)
  }

  if (userData.zip) {
    hashedData.zp = await hashValue(userData.zip)
  }

  if (userData.country) {
    hashedData.country = await hashValue(userData.country)
  }

  // Update pixel with advanced matching data
  window.fbq("init", FB_PIXEL_ID, hashedData)
}

// Track page view
export const fbPixelPageView = () => {
  if (!window.fbq) return
  window.fbq("track", "PageView")
}

// Track custom page view with custom data
export const fbPixelCustomPageView = (pageName, customData = {}) => {
  if (!window.fbq) return
  window.fbq("trackCustom", "PageView", {
    page: pageName,
    ...customData
  })
}

// Track View Content (product/content views)
export const fbPixelViewContent = (contentData) => {
  if (!window.fbq) return

  const eventData = {
    content_name: contentData.name,
    content_category: contentData.category,
    content_ids: contentData.ids || [],
    content_type: contentData.type || "product",
    value: contentData.value || 0,
    currency: contentData.currency || "USD",
    ...contentData.custom
  }

  window.fbq("track", "ViewContent", eventData)
}

// Track Search
export const fbPixelSearch = (searchQuery, searchCategory = null) => {
  if (!window.fbq) return

  const eventData = {
    search_string: searchQuery
  }

  if (searchCategory) {
    eventData.content_category = searchCategory
  }

  window.fbq("track", "Search", eventData)
}

// Track Add to Cart (for subscription selection)
export const fbPixelAddToCart = (planData) => {
  if (!window.fbq) return

  window.fbq("track", "AddToCart", {
    content_name: planData.name,
    content_ids: [planData.id],
    content_type: "subscription",
    value: planData.price,
    currency: planData.currency || "USD",
    content_category: "Subscription Plan"
  })
}

// Track Initiate Checkout
export const fbPixelInitiateCheckout = (checkoutData) => {
  if (!window.fbq) return

  window.fbq("track", "InitiateCheckout", {
    value: checkoutData.value,
    currency: checkoutData.currency || "USD",
    content_ids: checkoutData.contentIds || [],
    content_type: checkoutData.contentType || "subscription",
    num_items: checkoutData.numItems || 1
  })
}

// Track Purchase
export const fbPixelPurchase = (purchaseData) => {
  if (!window.fbq) return

  window.fbq("track", "Purchase", {
    value: purchaseData.value,
    currency: purchaseData.currency || "USD",
    content_ids: purchaseData.contentIds || [],
    content_name: purchaseData.contentName,
    content_type: purchaseData.contentType || "subscription",
    num_items: purchaseData.numItems || 1,
    order_id: purchaseData.orderId
  })
}

// Track Lead Generation
export const fbPixelLead = (leadData = {}) => {
  if (!window.fbq) return

  window.fbq("track", "Lead", {
    value: leadData.value || 0,
    currency: leadData.currency || "USD",
    content_name: leadData.contentName || "Sign Up",
    content_category: leadData.category || "Registration",
    ...leadData.custom
  })
}

// Track Complete Registration
export const fbPixelCompleteRegistration = (registrationData = {}) => {
  if (!window.fbq) return

  window.fbq("track", "CompleteRegistration", {
    value: registrationData.value || 0,
    currency: registrationData.currency || "USD",
    content_name: registrationData.contentName || "Account Registration",
    status: registrationData.status || "Completed",
    registration_method: registrationData.method || "Website",
    ...registrationData.custom
  })
}

// Track Contact
export const fbPixelContact = (contactData = {}) => {
  if (!window.fbq) return

  window.fbq("track", "Contact", {
    content_category: contactData.category || "Support",
    content_name: contactData.name || "Contact Form",
    ...contactData.custom
  })
}

// Track Custom Events for specific actions
export const fbPixelCustomEvent = (eventName, eventData = {}) => {
  if (!window.fbq) return

  window.fbq("trackCustom", eventName, eventData)
}

// Track Subscription Events
export const fbPixelSubscribe = (subscriptionData) => {
  if (!window.fbq) return

  window.fbq("track", "Subscribe", {
    value: subscriptionData.value,
    currency: subscriptionData.currency || "USD",
    predicted_ltv: subscriptionData.predictedLTV || subscriptionData.value * 12,
    subscription_id: subscriptionData.subscriptionId,
    plan_name: subscriptionData.planName,
    billing_cycle: subscriptionData.billingCycle || "monthly"
  })
}

// Track Trial Start
export const fbPixelStartTrial = (trialData) => {
  if (!window.fbq) return

  window.fbq("track", "StartTrial", {
    value: trialData.value || 0,
    currency: trialData.currency || "USD",
    predicted_ltv: trialData.predictedLTV || 0,
    content_name: trialData.planName,
    trial_period: trialData.trialPeriod || "7_days"
  })
}

// Track specific feature usage
export const fbPixelTrackFeature = (featureName, featureData = {}) => {
  if (!window.fbq) return

  window.fbq("trackCustom", "FeatureUsed", {
    feature_name: featureName,
    timestamp: new Date().toISOString(),
    ...featureData
  })
}

// Track content creation events
export const fbPixelContentCreated = (contentType, contentData = {}) => {
  if (!window.fbq) return

  window.fbq("trackCustom", "ContentCreated", {
    content_type: contentType,
    timestamp: new Date().toISOString(),
    ...contentData
  })
}

// Track engagement metrics
export const fbPixelEngagement = (engagementType, engagementData = {}) => {
  if (!window.fbq) return

  window.fbq("trackCustom", "UserEngagement", {
    engagement_type: engagementType,
    timestamp: new Date().toISOString(),
    ...engagementData
  })
}

// Track credit purchase
export const fbPixelCreditPurchase = (creditData) => {
  if (!window.fbq) return

  window.fbq("trackCustom", "CreditPurchase", {
    value: creditData.value,
    currency: creditData.currency || "USD",
    credit_amount: creditData.creditAmount,
    package_name: creditData.packageName,
    timestamp: new Date().toISOString()
  })
}

// Track A/B test events
export const fbPixelABTest = (testName, variant, testData = {}) => {
  if (!window.fbq) return

  window.fbq("trackCustom", "ABTestView", {
    test_name: testName,
    variant: variant,
    timestamp: new Date().toISOString(),
    ...testData
  })
}

// Clear user data (for logout)
export const clearFBUserData = () => {
  localStorage.removeItem("user_email_hash")
  localStorage.removeItem("user_fname_hash")
  localStorage.removeItem("user_lname_hash")
}

// Utility to check if FB Pixel is loaded
export const isFBPixelLoaded = () => {
  return typeof window !== "undefined" && window.fbq !== undefined
}

// Debug function to test if pixel is working
export const debugFBPixel = () => {
  if (!window.fbq) {
    console.log("Facebook Pixel not loaded")
    return false
  }

  console.log("Facebook Pixel is loaded")
  console.log("Pixel ID:", FB_PIXEL_ID)

  // Test event
  window.fbq("track", "TestEvent", {
    test: true,
    timestamp: new Date().toISOString()
  })

  console.log("Test event sent")
  return true
}
