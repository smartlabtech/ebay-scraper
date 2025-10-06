# Facebook Pixel Backend Integration Guide

## Overview
This guide explains how to implement server-side Facebook Pixel tracking using the Conversions API (CAPI) to send events from your backend to Facebook.

## Frontend Data Collection

The frontend now sends the following data with the signup request in the `fbPixelData` object:

```javascript
fbPixelData: {
  fbp: '_fbp cookie value',        // Facebook browser ID
  fbc: '_fbc cookie value',        // Facebook click ID
  ip: 'user IP address',
  userAgent: 'browser user agent',
  country: 'country code',
  city: 'city name',
  region: 'state/region',
  currency: 'USD',
  language: 'en-US',
  referrer: 'referrer URL',
  landingPage: 'landing page URL',
  utmSource: 'utm_source',
  utmMedium: 'utm_medium',
  utmCampaign: 'utm_campaign',
  utmContent: 'utm_content',
  utmTerm: 'utm_term'
}
```

## Backend Implementation

### 1. Install Facebook Business SDK

```bash
# For Node.js
npm install facebook-nodejs-business-sdk

# For Python
pip install facebook-business

# For PHP
composer require facebook/php-business-sdk
```

### 2. Initialize Facebook API (Node.js Example)

```javascript
const bizSdk = require('facebook-nodejs-business-sdk');

const access_token = process.env.FB_ACCESS_TOKEN; // Your access token
const pixel_id = process.env.FB_PIXEL_ID; // Your pixel ID

const api = bizSdk.FacebookAdsApi.init(access_token);
const serverEvent = bizSdk.ServerEvent;
const userData = bizSdk.UserData;
const customData = bizSdk.CustomData;
const eventRequest = bizSdk.EventRequest;
```

### 3. Create a FB Pixel Service

```javascript
// services/fbPixelService.js
const crypto = require('crypto');
const bizSdk = require('facebook-nodejs-business-sdk');

class FacebookPixelService {
  constructor() {
    this.accessToken = process.env.FB_ACCESS_TOKEN;
    this.pixelId = process.env.FB_PIXEL_ID;
    this.testEventCode = process.env.FB_TEST_EVENT_CODE; // Optional, for testing

    bizSdk.FacebookAdsApi.init(this.accessToken);
  }

  // Hash user data for privacy
  hashData(data) {
    if (!data) return null;
    return crypto
      .createHash('sha256')
      .update(data.toLowerCase().trim())
      .digest('hex');
  }

  // Send event to Facebook
  async sendEvent(eventName, userData, customData, eventSourceUrl) {
    try {
      const ServerEvent = bizSdk.ServerEvent;
      const UserData = bizSdk.UserData;
      const CustomData = bizSdk.CustomData;
      const EventRequest = bizSdk.EventRequest;

      // Create user data object
      const user = new UserData()
        .setEmails([this.hashData(userData.email)])
        .setFirstName(this.hashData(userData.firstName))
        .setLastName(this.hashData(userData.lastName))
        .setClientIpAddress(userData.ip)
        .setClientUserAgent(userData.userAgent)
        .setFbp(userData.fbp) // Facebook browser ID
        .setFbc(userData.fbc) // Facebook click ID
        .setCountry(this.hashData(userData.country))
        .setState(this.hashData(userData.region))
        .setCity(this.hashData(userData.city));

      // Create custom data object
      const custom = new CustomData()
        .setCurrency(customData.currency || 'USD')
        .setValue(customData.value || 0)
        .setContentName(customData.contentName)
        .setContentIds(customData.contentIds || [])
        .setContentType(customData.contentType || 'product')
        .setCustomProperties(customData.custom || {});

      // Create server event
      const serverEvent = new ServerEvent()
        .setEventName(eventName)
        .setEventTime(Math.floor(Date.now() / 1000))
        .setUserData(user)
        .setCustomData(custom)
        .setEventSourceUrl(eventSourceUrl)
        .setActionSource('website'); // or 'app', 'offline', etc.

      // Create event request
      const eventsData = [serverEvent];
      const eventRequest = new EventRequest(this.accessToken, this.pixelId)
        .setEvents(eventsData);

      // Add test event code if in development
      if (this.testEventCode) {
        eventRequest.setTestEventCode(this.testEventCode);
      }

      // Send the event
      const response = await eventRequest.execute();
      console.log('FB Pixel Event Sent:', eventName, response);
      return response;

    } catch (error) {
      console.error('FB Pixel Error:', error);
      throw error;
    }
  }

  // Specific event methods
  async trackLead(userData, planData) {
    return this.sendEvent(
      'Lead',
      userData,
      {
        value: planData.price,
        currency: planData.currency || 'USD',
        contentName: `Lead - ${planData.name}`,
        custom: { planId: planData._id }
      },
      userData.landingPage
    );
  }

  async trackCompleteRegistration(userData, planData) {
    return this.sendEvent(
      'CompleteRegistration',
      userData,
      {
        value: planData.price,
        currency: planData.currency || 'USD',
        contentName: planData.name,
        contentIds: [planData._id],
        custom: {
          credits: planData.credits,
          registrationMethod: 'Website'
        }
      },
      userData.landingPage
    );
  }

  async trackInitiateCheckout(userData, orderData) {
    return this.sendEvent(
      'InitiateCheckout',
      userData,
      {
        value: orderData.total,
        currency: orderData.currency || 'USD',
        contentIds: orderData.items.map(item => item.id),
        contentType: 'subscription',
        numItems: orderData.items.length
      },
      userData.landingPage
    );
  }

  async trackPurchase(userData, orderData) {
    return this.sendEvent(
      'Purchase',
      userData,
      {
        value: orderData.total,
        currency: orderData.currency || 'USD',
        contentIds: orderData.items.map(item => item.id),
        contentName: orderData.description,
        contentType: 'subscription',
        numItems: orderData.items.length,
        custom: {
          orderId: orderData._id,
          paymentMethod: orderData.paymentMethod
        }
      },
      userData.landingPage
    );
  }

  async trackViewContent(userData, contentData) {
    return this.sendEvent(
      'ViewContent',
      userData,
      {
        value: contentData.value || 0,
        currency: contentData.currency || 'USD',
        contentName: contentData.name,
        contentIds: contentData.ids || [],
        contentType: contentData.type || 'product',
        contentCategory: contentData.category
      },
      userData.currentPage
    );
  }

  async trackSearch(userData, searchData) {
    return this.sendEvent(
      'Search',
      userData,
      {
        searchString: searchData.query,
        contentCategory: searchData.category,
        custom: { resultsCount: searchData.resultsCount }
      },
      userData.currentPage
    );
  }

  async trackAddToCart(userData, cartData) {
    return this.sendEvent(
      'AddToCart',
      userData,
      {
        value: cartData.value,
        currency: cartData.currency || 'USD',
        contentName: cartData.name,
        contentIds: [cartData.id],
        contentType: 'subscription'
      },
      userData.currentPage
    );
  }

  async trackCustomEvent(eventName, userData, customData) {
    return this.sendEvent(eventName, userData, customData, userData.currentPage);
  }
}

module.exports = new FacebookPixelService();
```

### 4. Integrate in Your Signup Endpoint

```javascript
// routes/auth.js or controllers/authController.js
const fbPixelService = require('./services/fbPixelService');

async function signupWithPlan(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      planId,
      fbPixelData // This contains all FB tracking data
    } = req.body;

    // Track Lead event when signup starts
    if (fbPixelData) {
      await fbPixelService.trackLead(
        {
          email,
          firstName,
          lastName,
          ip: fbPixelData.ip,
          userAgent: fbPixelData.userAgent,
          fbp: fbPixelData.fbp,
          fbc: fbPixelData.fbc,
          country: fbPixelData.country,
          city: fbPixelData.city,
          region: fbPixelData.region,
          landingPage: fbPixelData.landingPage
        },
        plan // Your plan object
      );
    }

    // Your existing signup logic...
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      // ...
    });

    // After successful signup, track Complete Registration
    if (fbPixelData) {
      await fbPixelService.trackCompleteRegistration(
        {
          email,
          firstName,
          lastName,
          ip: fbPixelData.ip,
          userAgent: fbPixelData.userAgent,
          fbp: fbPixelData.fbp,
          fbc: fbPixelData.fbc,
          country: fbPixelData.country,
          city: fbPixelData.city,
          region: fbPixelData.region,
          landingPage: fbPixelData.landingPage
        },
        plan
      );

      // If paid plan, track Initiate Checkout
      if (plan.price > 0 && order) {
        await fbPixelService.trackInitiateCheckout(
          {
            email,
            firstName,
            lastName,
            ip: fbPixelData.ip,
            userAgent: fbPixelData.userAgent,
            fbp: fbPixelData.fbp,
            fbc: fbPixelData.fbc,
            country: fbPixelData.country,
            city: fbPixelData.city,
            region: fbPixelData.region,
            landingPage: fbPixelData.landingPage
          },
          {
            total: plan.price,
            currency: fbPixelData.currency || 'USD',
            items: [{ id: plan._id, name: plan.name }]
          }
        );
      }

      // Store FB pixel data with user for future events
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            'tracking.fbp': fbPixelData.fbp,
            'tracking.fbc': fbPixelData.fbc,
            'tracking.utm': {
              source: fbPixelData.utmSource,
              medium: fbPixelData.utmMedium,
              campaign: fbPixelData.utmCampaign,
              content: fbPixelData.utmContent,
              term: fbPixelData.utmTerm
            },
            'tracking.referrer': fbPixelData.referrer,
            'tracking.landingPage': fbPixelData.landingPage
          }
        }
      );
    }

    // Return response
    res.json({
      success: true,
      user,
      orderId: order?._id,
      message: 'Signup successful'
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
}
```

### 5. Track Other Events

```javascript
// Track when user completes payment
async function handlePaymentSuccess(req, res) {
  const { orderId } = req.body;
  const order = await Order.findById(orderId).populate('user');

  if (order.user.tracking?.fbp) {
    await fbPixelService.trackPurchase(
      {
        email: order.user.email,
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        fbp: order.user.tracking.fbp,
        fbc: order.user.tracking.fbc,
        landingPage: order.user.tracking.landingPage
      },
      {
        _id: order._id,
        total: order.total,
        currency: order.currency,
        description: order.description,
        items: order.items,
        paymentMethod: order.paymentMethod
      }
    );
  }
}

// Track when user views content
async function trackContentView(req, res) {
  const { contentId, contentType, value } = req.body;
  const user = req.user;

  if (user.tracking?.fbp) {
    await fbPixelService.trackViewContent(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        fbp: user.tracking.fbp,
        fbc: user.tracking.fbc,
        currentPage: req.headers.referer
      },
      {
        ids: [contentId],
        type: contentType,
        value: value,
        name: content.name,
        category: content.category
      }
    );
  }
}
```

### 6. Environment Variables

Add to your `.env` file:

```bash
# Facebook Pixel Configuration
FB_PIXEL_ID=your_pixel_id
FB_ACCESS_TOKEN=your_access_token
FB_TEST_EVENT_CODE=TEST12345  # Optional, for testing
```

### 7. Getting Your Access Token

1. Go to Facebook Events Manager
2. Select your pixel
3. Go to Settings → Conversions API
4. Generate an access token

### 8. Testing Your Integration

Use Facebook's Test Events tool:
1. Go to Events Manager
2. Select your pixel
3. Click "Test Events"
4. Use the test event code in your backend
5. Trigger events and verify they appear

## Important Considerations

### Privacy & Compliance
- Always hash PII (Personally Identifiable Information)
- Comply with GDPR/CCPA
- Include proper consent mechanisms
- Provide opt-out options

### Data Quality
- Send events within 24 hours of occurrence
- Include as much user data as possible for better matching
- Use consistent event naming

### Event Deduplication
- Send the same event_id from both client and server
- Facebook will deduplicate automatically

### Rate Limits
- Maximum 1000 events per request
- Maximum 10 requests per second

## Monitoring & Debugging

### Check Event Quality
```javascript
// Add logging to track event success
async sendEvent(eventName, userData, customData, eventSourceUrl) {
  try {
    const response = await eventRequest.execute();

    // Log success
    await EventLog.create({
      eventName,
      status: 'success',
      response: response,
      timestamp: new Date()
    });

    return response;
  } catch (error) {
    // Log failure
    await EventLog.create({
      eventName,
      status: 'error',
      error: error.message,
      timestamp: new Date()
    });

    throw error;
  }
}
```

### Verify Events in Facebook
1. Go to Events Manager
2. View your pixel
3. Check "Overview" for event counts
4. Use "Diagnostics" to identify issues

## Complete Event Flow

1. **User lands on site** → FB Pixel (client) tracks PageView
2. **User starts signup** → FB Pixel (client) tracks Lead
3. **Signup submitted** → Backend receives fbPixelData
4. **Backend processes signup** → Server sends Lead event via CAPI
5. **Signup successful** → Server sends CompleteRegistration via CAPI
6. **Payment initiated** → Server sends InitiateCheckout via CAPI
7. **Payment completed** → Server sends Purchase via CAPI

## Benefits of Server-Side Tracking

1. **Better Attribution** - Not blocked by ad blockers
2. **Enhanced Data** - Can send offline conversions
3. **Improved Matching** - Higher match rates with hashed data
4. **GDPR Compliance** - Better control over data sent
5. **Reliability** - Not affected by browser issues

## Troubleshooting

### Common Issues:
1. **Events not showing**: Check access token and pixel ID
2. **Low match rate**: Include more user data points
3. **Duplicate events**: Implement event_id for deduplication
4. **Test events in production**: Remove test_event_code

### Debug Mode:
```javascript
// Enable debug mode for detailed logging
if (process.env.NODE_ENV === 'development') {
  bizSdk.FacebookAdsApi.setDebugMode(true);
}
```

## Next Steps

1. Implement webhook endpoints for real-time tracking
2. Set up batch processing for high-volume events
3. Create dashboard for monitoring event success rates
4. Implement retry logic for failed events
5. Set up alerts for tracking issues