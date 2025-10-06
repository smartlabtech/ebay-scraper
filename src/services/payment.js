import api from './api';
import axiosInstance from '../api/axios';
import authService from './auth';
import { SUBSCRIPTION_PLANS, SUBSCRIPTION_STATUS, PAYMENT_STATUS, PRICING } from '../types';

class PaymentService {
  /**
   * Create a checkout session for an order
   * @param {string} orderId - The ID of the order to create checkout for
   * @returns {Promise<Object>} - Payment checkout response containing paymentUrl, paymentIntentId, amount, currency, expiresAt
   */
  async createCheckout(orderId) {
    try {
      const response = await axiosInstance.post(`/en/payment/checkout/${orderId}`);

      // Check if response has nested data property or direct properties
      const responseData = response.data.data || response.data;
      
      return {
        paymentUrl: responseData.paymentUrl,
        paymentIntentId: responseData.paymentIntentId,
        amount: responseData.amount,
        currency: responseData.currency,
        expiresAt: responseData.expiresAt,
        orderId: responseData.orderId || orderId,
        status: responseData.status || 'pending_payment'
      };
    } catch (error) {
      // Handle different error scenarios
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Invalid checkout request');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to create checkout for this order');
      } else if (error.response?.status === 404) {
        throw new Error('Order not found or cannot be processed');
      } else if (error.response?.status === 409) {
        throw new Error('Checkout already exists for this order');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create checkout. Please try again.');
    }
  }

  /**
   * Get checkout details by order ID
   * @param {string} orderId - The order ID to get checkout details for
   * @returns {Promise<Object>} - Checkout details
   */
  async getCheckoutDetails(orderId) {
    try {
      const response = await axiosInstance.get(`/en/payment/checkout/${orderId}`);

      // Check if response has nested data property or direct properties
      const responseData = response.data.data || response.data;
      
      return {
        paymentUrl: responseData.paymentUrl,
        paymentIntentId: responseData.paymentIntentId,
        amount: responseData.amount,
        currency: responseData.currency,
        expiresAt: responseData.expiresAt,
        orderId: responseData.orderId || orderId,
        status: responseData.status
      };
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to view checkout details for this order');
      } else if (error.response?.status === 404) {
        throw new Error('Checkout not found for this order');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to get checkout details. Please try again.');
    }
  }

  /**
   * Cancel a checkout session
   * @param {string} orderId - The order ID to cancel checkout for
   * @returns {Promise<Object>} - Cancellation response
   */
  async cancelCheckout(orderId) {
    try {
      const response = await axiosInstance.post(`/en/payment/checkout/${orderId}/cancel`);

      // Check if response has nested data property or direct properties
      const responseData = response.data.data || response.data;
      
      return {
        orderId: responseData.orderId || orderId,
        status: responseData.status,
        message: responseData.message || 'Checkout cancelled successfully'
      };
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Cannot cancel this checkout');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to cancel this checkout');
      } else if (error.response?.status === 404) {
        throw new Error('Checkout not found for this order');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to cancel checkout. Please try again.');
    }
  }

  // Initialize Stripe (mock)
  initializeStripe() {
    // In real app, this would initialize Stripe
    console.log('Mock Stripe initialized');
    return {
      redirectToCheckout: this.mockCheckout.bind(this),
      createPaymentMethod: this.mockCreatePaymentMethod.bind(this)
    };
  }

  // Create checkout session
  async createCheckoutSession(plan, billingCycle = 'monthly') {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const priceId = `price_${plan}_${billingCycle}`;
    const amount = PRICING[plan][billingCycle];

    // Mock checkout session
    const session = {
      id: `cs_mock_${Date.now()}`,
      url: `/checkout?session_id=${Date.now()}`,
      priceId,
      amount,
      currency: 'usd',
      customerEmail: user.email,
      successUrl: '/dashboard?payment=success',
      cancelUrl: '/pricing?payment=cancelled'
    };

    return session;
  }

  // Mock checkout redirect
  async mockCheckout({ sessionId }) {
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful payment
    return {
      success: true,
      sessionId
    };
  }

  // Create subscription
  async createSubscription(plan, paymentMethodId) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Mock subscription creation
    const subscription = {
      id: `sub_mock_${Date.now()}`,
      customerId: user.id,
      plan,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      paymentMethodId
    };

    // Update user's subscription in mock data
    user.subscription = {
      plan,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      startDate: subscription.currentPeriodStart,
      endDate: subscription.currentPeriodEnd,
      autoRenew: true
    };

    // Update in localStorage
    authService.updateProfile({ subscription: user.subscription });

    return subscription;
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId, cancelImmediately = false) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    if (!user.subscription || user.subscription.status !== SUBSCRIPTION_STATUS.ACTIVE) {
      throw new Error('No active subscription found');
    }

    const updatedSubscription = {
      ...user.subscription,
      status: cancelImmediately ? SUBSCRIPTION_STATUS.CANCELLED : SUBSCRIPTION_STATUS.ACTIVE,
      cancelAtPeriodEnd: !cancelImmediately,
      autoRenew: false
    };

    // Update user's subscription
    await authService.updateProfile({ subscription: updatedSubscription });

    return {
      success: true,
      subscription: updatedSubscription,
      message: cancelImmediately ? 
        'Subscription cancelled immediately' : 
        'Subscription will be cancelled at the end of the billing period'
    };
  }

  // Update payment method
  async updatePaymentMethod(paymentMethodId) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Mock payment method update
    return {
      success: true,
      paymentMethodId,
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025
    };
  }

  // Mock create payment method
  async mockCreatePaymentMethod(cardDetails) {
    // Simulate payment method creation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: `pm_mock_${Date.now()}`,
      card: {
        last4: cardDetails.number.slice(-4),
        brand: this.getCardBrand(cardDetails.number),
        expMonth: cardDetails.expMonth,
        expYear: cardDetails.expYear
      }
    };
  }

  // Get card brand from number
  getCardBrand(number) {
    const firstDigit = number[0];
    if (firstDigit === '4') return 'visa';
    if (firstDigit === '5') return 'mastercard';
    if (firstDigit === '3') return 'amex';
    return 'unknown';
  }

  // Get subscription details
  async getSubscriptionDetails() {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const subscription = user.subscription || {
      plan: SUBSCRIPTION_PLANS.FREE,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      startDate: user.createdAt,
      endDate: null,
      autoRenew: false
    };

    const planDetails = PRICING[subscription.plan];
    const usage = await this.getUsageStats();

    return {
      ...subscription,
      planDetails,
      usage,
      nextBillingDate: subscription.endDate,
      canUpgrade: subscription.plan !== SUBSCRIPTION_PLANS.ENTERPRISE,
      canDowngrade: subscription.plan !== SUBSCRIPTION_PLANS.FREE
    };
  }

  // Get usage statistics
  async getUsageStats() {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Calculate usage from mock data
    const { mockProjects, mockBrandMessages, mockCopies } = await import('../data/mockData');
    
    const userProjects = mockProjects.filter(p => p.userId === user.id);
    const userMessages = mockBrandMessages.filter(m => m.userId === user.id);
    const userCopies = mockCopies.filter(c => c.userId === user.id);

    const limits = await import('../types').then(m => m.PLAN_LIMITS[user.subscription?.plan || SUBSCRIPTION_PLANS.FREE]);

    return {
      projects: {
        used: userProjects.length,
        limit: limits.projects,
        percentage: limits.projects === Infinity ? 0 : (userProjects.length / limits.projects) * 100
      },
      messages: {
        used: userMessages.length,
        limit: limits.messages,
        percentage: limits.messages === Infinity ? 0 : (userMessages.length / limits.messages) * 100
      },
      copies: {
        used: userCopies.length,
        limit: limits.copies,
        percentage: limits.copies === Infinity ? 0 : (userCopies.length / limits.copies) * 100
      }
    };
  }

  // Get invoices
  async getInvoices() {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Mock invoices
    const invoices = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 6; i++) {
      const invoiceDate = new Date(currentDate);
      invoiceDate.setMonth(invoiceDate.getMonth() - i);
      
      invoices.push({
        id: `inv_mock_${Date.now()}_${i}`,
        number: `INV-${invoiceDate.getFullYear()}-${String(invoiceDate.getMonth() + 1).padStart(2, '0')}-001`,
        date: invoiceDate.toISOString(),
        amount: PRICING[user.subscription?.plan || SUBSCRIPTION_PLANS.FREE].monthly,
        status: PAYMENT_STATUS.COMPLETED,
        downloadUrl: `/invoices/download/${Date.now()}_${i}`
      });
    }

    return invoices;
  }

  // Download invoice (mock)
  async downloadInvoice(invoiceId) {
    // Mock invoice download
    const mockInvoiceContent = `
      INVOICE
      -----------------
      Invoice ID: ${invoiceId}
      Date: ${new Date().toLocaleDateString()}
      Amount: $99.00
      Status: Paid
      
      Thank you for your business!
    `;

    const blob = new Blob([mockInvoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    return {
      url,
      filename: `invoice-${invoiceId}.txt`
    };
  }

  // Get payment methods
  async getPaymentMethods() {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Mock payment methods
    return [
      {
        id: 'pm_mock_default',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          expMonth: 12,
          expYear: 2025
        },
        isDefault: true
      }
    ];
  }

  // Calculate proration
  async calculateProration(fromPlan, toPlan) {
    const fromPrice = PRICING[fromPlan].monthly;
    const toPrice = PRICING[toPlan].monthly;
    
    const currentDate = new Date();
    const daysInMonth = 30;
    const daysRemaining = daysInMonth - currentDate.getDate();
    const prorationAmount = ((toPrice - fromPrice) * daysRemaining) / daysInMonth;

    return {
      fromPlan,
      toPlan,
      currentCharge: fromPrice,
      newCharge: toPrice,
      prorationAmount: Math.max(0, prorationAmount),
      immediateCharge: Math.max(0, prorationAmount),
      nextBillingAmount: toPrice
    };
  }

  // Apply coupon
  async applyCoupon(couponCode) {
    // Mock coupon validation
    const validCoupons = {
      'WELCOME20': { discount: 20, type: 'percentage' },
      'SAVE50': { discount: 50, type: 'amount' },
      'TRIAL30': { discount: 100, type: 'percentage', duration: 1 }
    };

    const coupon = validCoupons[couponCode.toUpperCase()];
    
    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    return {
      code: couponCode.toUpperCase(),
      ...coupon,
      message: `Coupon applied! You saved ${coupon.type === 'percentage' ? coupon.discount + '%' : '$' + coupon.discount}`
    };
  }
}

// Create and export service instance
const paymentService = new PaymentService();
export default paymentService;