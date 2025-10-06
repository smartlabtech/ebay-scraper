import axiosInstance from '../api/axios';
import { getCookie } from '../utils/tracking';

class TrackingService {
  constructor() {
    // Track ongoing requests to prevent duplicates
    this.trackingPromises = new Map();
  }

  /**
   * Check if user is authenticated
   */
  isUserAuthenticated() {
    // Check for auth token or user data in localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  /**
   * Get user ID if authenticated
   */
  getUserId() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || user._id || null;
    } catch {
      return null;
    }
  }

  /**
   * Get or create session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  /**
   * Get tracking data from sessionStorage (collected in App.jsx)
   */
  getTrackingData() {
    return JSON.parse(sessionStorage.getItem('trackingData') || '{}');
  }

  /**
   * Build FB Pixel data object matching backend DTO
   */
  buildFbPixelData() {
    const trackingData = this.getTrackingData();

    return {
      // Facebook cookies
      fbp: trackingData.fbp_cookie || getCookie('_fbp') || undefined,
      fbc: trackingData.fbc_cookie || getCookie('_fbc') || undefined,

      // Location data
      ip: trackingData.ip || undefined,
      userAgent: trackingData.user_agent || navigator.userAgent,
      country: trackingData.country_name || undefined,
      countryCode: trackingData.country_code || undefined,
      countryCallingCode: trackingData.country_calling_code || undefined,
      city: trackingData.city || undefined,
      region: trackingData.region || undefined,
      currency: trackingData.currency || 'USD',
      timezone: trackingData.timezone || undefined,
      latitude: trackingData.latitude || undefined,
      longitude: trackingData.longitude || undefined,
      postal: trackingData.postal || undefined,

      // Browser data
      language: trackingData.language || navigator.language,
      screenResolution: trackingData.screen_resolution || undefined,
      viewportSize: trackingData.viewport_size || undefined,
      pixelDensity: trackingData.pixel_density || undefined,

      // Traffic source
      referrer: trackingData.referrer || document.referrer || 'Direct',
      landingPage: trackingData.entry_page || window.location.href,
      currentPage: window.location.href,

      // UTM parameters
      utmSource: trackingData.utm_source || undefined,
      utmMedium: trackingData.utm_medium || undefined,
      utmCampaign: trackingData.utm_campaign || undefined,
      utmContent: trackingData.utm_content || undefined,
      utmTerm: trackingData.utm_term || undefined,

      // Google Analytics
      gaCookie: trackingData.ga_cookie || undefined,
      gidCookie: trackingData.gid_cookie || undefined,

      // Timestamps
      trackedAt: trackingData.tracked_at || undefined,

      // Site info
      siteName: trackingData.site_name || undefined,
      siteUrl: trackingData.site_url || undefined
    };
  }

  /**
   * Track anonymous event (main method)
   * @param {'view_content'|'add_to_cart'|'page_view'} eventType
   * @param {Object} eventData
   * @param {Object} metadata
   */
  async trackAnonymousEvent(eventType, eventData = {}, metadata = {}) {
    try {
      // Skip anonymous tracking if user is authenticated
      if (this.isUserAuthenticated()) {
        const userId = this.getUserId();
        console.log(`📊 Skipping anonymous tracking for authenticated user: ${userId}`);
        return { skipped: true, reason: 'User authenticated', userId };
      }

      // Create a unique key for this tracking request
      const requestKey = `${eventType}_${JSON.stringify(eventData)}_${JSON.stringify(metadata)}`;

      // Check if this exact request is already in progress
      if (this.trackingPromises.has(requestKey)) {
        console.log(`📊 Duplicate tracking request detected, reusing existing promise for: ${eventType}`);
        return this.trackingPromises.get(requestKey);
      }

      // Create the tracking promise
      const trackingPromise = (async () => {
        // Wait for tracking data to be available
        let attempts = 0;
        while (!sessionStorage.getItem('trackingData') && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
        }

        const payload = {
          eventType,
          sessionId: this.getSessionId(),
          eventData,
          fbPixelData: this.buildFbPixelData(),
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
            pageUrl: window.location.href,
            pageTitle: document.title,
            deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
            sessionStartTime: sessionStorage.getItem('sessionStartTime'),
            pageViewCount: sessionStorage.getItem('pageViewCount')
          }
        };

        try {
          const response = await axiosInstance.post('/en/tracking/event/anonymous', payload);

          console.log(`📊 Anonymous event tracked: ${eventType}`, {
            eventId: response.data.eventId,
            sessionId: payload.sessionId
          });

          return response.data;
        } catch (apiError) {
          // Log as warning, not error - tracking shouldn't break the app
          console.warn(`📊 Tracking API unavailable (${apiError.code || apiError.message}). Continuing without tracking.`);

          // Return a mock successful response so the app continues normally
          return {
            success: true,
            queued: true,
            eventType,
            sessionId: payload.sessionId,
            message: 'Tracking queued locally (backend offline)'
          };
        }
      })();

      // Store the promise
      this.trackingPromises.set(requestKey, trackingPromise);

      // Clean up after completion
      trackingPromise.finally(() => {
        this.trackingPromises.delete(requestKey);
      });

      return trackingPromise;
    } catch (error) {
      console.error('Error tracking anonymous event:', error);
      // Don't throw - tracking failures shouldn't break the app
      return null;
    }
  }

  /**
   * Track page view (for landing page)
   */
  async trackPageView(pageName = 'Landing Page') {
    return this.trackAnonymousEvent('page_view', {
      pageName,
      pageUrl: window.location.href,
      pageTitle: document.title,
      isFirstVisit: localStorage.getItem('hasVisitedBefore') !== 'true'
    });
  }

  /**
   * Track content view (for viewing plans/features)
   */
  async trackViewContent(contentId, contentName, price = null, contentType = 'plan') {
    return this.trackAnonymousEvent('view_content', {
      productId: contentId,
      productName: contentName,
      price: price,
      contentType: contentType,
      currency: 'USD'
    });
  }

  /**
   * Track add to cart (when user selects a plan)
   */
  async trackAddToCart(planId, planName, price) {
    return this.trackAnonymousEvent('add_to_cart', {
      productId: planId,
      productName: planName,
      price: price,
      quantity: 1,
      currency: 'USD'
    });
  }

  /**
   * Track custom event as page_view with custom data
   * Since FB doesn't support 'custom' event type, we use page_view with metadata
   */
  async trackCustomEvent(eventName, eventData = {}) {
    return this.trackAnonymousEvent('page_view', {
      customEventName: eventName,
      ...eventData
    }, {
      isCustomEvent: true,
      eventName: eventName
    });
  }

  /**
   * Track scroll depth on landing page
   */
  async trackScrollDepth(depth) {
    return this.trackAnonymousEvent('page_view', {
      customEventName: 'scroll_depth',
      depth: depth,
      maxDepth: Math.max(depth, parseInt(sessionStorage.getItem('maxScrollDepth') || '0'))
    }, {
      isScrollEvent: true,
      scrollDepth: depth
    });
  }

  /**
   * Track CTA clicks
   */
  async trackCtaClick(ctaName, ctaLocation) {
    return this.trackCustomEvent('cta_click', {
      ctaName,
      ctaLocation,
      ctaText: event?.target?.textContent || '',
      targetUrl: event?.target?.href || ''
    });
  }

  /**
   * Track time on page
   */
  async trackTimeOnPage(seconds, pageName = 'Landing Page') {
    return this.trackAnonymousEvent('page_view', {
      customEventName: 'time_on_page',
      duration: seconds,
      pageName,
      engaged: seconds > 10
    }, {
      isTimeOnPageEvent: true,
      timeOnPage: seconds
    });
  }

  /**
   * Track pricing section view
   */
  async trackPricingView(plans) {
    return this.trackCustomEvent('pricing_view', {
      plansViewed: plans?.map(p => ({
        id: p._id,
        name: p.name,
        price: p.price,
        credits: p.credits
      })) || [],
      planCount: plans?.length || 0
    });
  }

  /**
   * Track feature interaction
   */
  async trackFeatureClick(featureName, featureSection) {
    return this.trackCustomEvent('feature_interaction', {
      featureName,
      featureSection,
      action: 'click'
    });
  }

  /**
   * Track testimonial view
   */
  async trackTestimonialView(testimonialId, authorName) {
    return this.trackCustomEvent('testimonial_view', {
      testimonialId,
      authorName
    });
  }

  /**
   * Track FAQ interaction
   */
  async trackFaqInteraction(question, action) {
    return this.trackCustomEvent('faq_interaction', {
      question,
      action // 'expand' or 'collapse'
    });
  }
}

export default new TrackingService();