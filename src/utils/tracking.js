// Utility function to get cookie value by name
export const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

// Enhanced tracking function that includes Facebook cookies if needed
export const getEnhancedTrackingData = async () => {
  try {
    // Get IP and location data
    const response = await fetch('https://ipapi.co/json/');
    const locationData = await response.json();

    // Build tracking data object
    const trackingData = {
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
      referrer: document.referrer || 'Direct',
      entry_page: window.location.href,
      utm_source: new URLSearchParams(window.location.search).get('utm_source'),
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),

      // Session info
      user_agent: navigator.userAgent,
      language: navigator.language,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,

      // Facebook tracking cookies (if available)
      fbc_cookie: getCookie('_fbc') || null,
      fbp_cookie: getCookie('_fbp') || null,

      // Google Analytics cookies (if available)
      ga_cookie: getCookie('_ga') || null,

      // Timestamp
      tracked_at: new Date().toISOString()
    };

    return trackingData;
  } catch (error) {
    console.error('Failed to get tracking data:', error);

    // Return fallback data
    return {
      referrer: document.referrer || 'Direct',
      entry_page: window.location.href,
      utm_source: new URLSearchParams(window.location.search).get('utm_source'),
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
      user_agent: navigator.userAgent,
      language: navigator.language,
      fbc_cookie: getCookie('_fbc') || null,
      fbp_cookie: getCookie('_fbp') || null,
      tracked_at: new Date().toISOString()
    };
  }
};