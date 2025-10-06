import {useEffect, useCallback} from "react"
import {useLocation} from "react-router-dom"
import {
  fbPixelPageView,
  fbPixelViewContent,
  fbPixelSearch,
  fbPixelAddToCart,
  fbPixelInitiateCheckout,
  fbPixelPurchase,
  fbPixelLead,
  fbPixelCompleteRegistration,
  fbPixelSubscribe,
  fbPixelStartTrial,
  fbPixelTrackFeature,
  fbPixelContentCreated,
  fbPixelEngagement,
  fbPixelCreditPurchase,
  fbPixelCustomEvent,
  setFBUserData,
  clearFBUserData,
  isFBPixelLoaded
} from "../utils/fbPixel"

// Hook for tracking page views automatically
export const useFBPixelPageView = () => {
  const location = useLocation()

  useEffect(() => {
    // Track page view on route change
    if (isFBPixelLoaded()) {
      fbPixelPageView()
    }
  }, [location])
}

// Main hook for all FB Pixel functions
export const useFBPixel = () => {
  const location = useLocation()

  // Track page view on mount and route changes
  useEffect(() => {
    if (isFBPixelLoaded()) {
      fbPixelPageView()
    }
  }, [location])

  // Wrapped tracking functions
  const trackViewContent = useCallback((contentData) => {
    fbPixelViewContent(contentData)
  }, [])

  const trackSearch = useCallback((query, category) => {
    fbPixelSearch(query, category)
  }, [])

  const trackAddToCart = useCallback((planData) => {
    fbPixelAddToCart(planData)
  }, [])

  const trackInitiateCheckout = useCallback((checkoutData) => {
    fbPixelInitiateCheckout(checkoutData)
  }, [])

  const trackPurchase = useCallback((purchaseData) => {
    fbPixelPurchase(purchaseData)
  }, [])

  const trackLead = useCallback((leadData) => {
    fbPixelLead(leadData)
  }, [])

  const trackRegistration = useCallback((registrationData) => {
    fbPixelCompleteRegistration(registrationData)
  }, [])

  const trackSubscribe = useCallback((subscriptionData) => {
    fbPixelSubscribe(subscriptionData)
  }, [])

  const trackStartTrial = useCallback((trialData) => {
    fbPixelStartTrial(trialData)
  }, [])

  const trackFeatureUsed = useCallback((featureName, data) => {
    fbPixelTrackFeature(featureName, data)
  }, [])

  const trackContentCreated = useCallback((contentType, data) => {
    fbPixelContentCreated(contentType, data)
  }, [])

  const trackEngagement = useCallback((type, data) => {
    fbPixelEngagement(type, data)
  }, [])

  const trackCreditPurchase = useCallback((creditData) => {
    fbPixelCreditPurchase(creditData)
  }, [])

  const trackCustom = useCallback((eventName, eventData) => {
    fbPixelCustomEvent(eventName, eventData)
  }, [])

  const updateUserData = useCallback(async (userData) => {
    await setFBUserData(userData)
  }, [])

  const clearUserData = useCallback(() => {
    clearFBUserData()
  }, [])

  return {
    trackViewContent,
    trackSearch,
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase,
    trackLead,
    trackRegistration,
    trackSubscribe,
    trackStartTrial,
    trackFeatureUsed,
    trackContentCreated,
    trackEngagement,
    trackCreditPurchase,
    trackCustom,
    updateUserData,
    clearUserData,
    isLoaded: isFBPixelLoaded()
  }
}

// Hook for tracking e-commerce events
export const useFBPixelEcommerce = () => {
  const {
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase,
    trackSubscribe,
    trackCreditPurchase
  } = useFBPixel()

  return {
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase,
    trackSubscribe,
    trackCreditPurchase
  }
}

// Hook for tracking user events
export const useFBPixelUser = () => {
  const {trackLead, trackRegistration, updateUserData, clearUserData} =
    useFBPixel()

  return {
    trackLead,
    trackRegistration,
    updateUserData,
    clearUserData
  }
}

// Hook for tracking content events
export const useFBPixelContent = () => {
  const {
    trackViewContent,
    trackFeatureUsed,
    trackContentCreated,
    trackEngagement
  } = useFBPixel()

  return {
    trackViewContent,
    trackFeatureUsed,
    trackContentCreated,
    trackEngagement
  }
}
