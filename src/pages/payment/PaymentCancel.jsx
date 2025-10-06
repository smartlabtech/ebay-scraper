import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimesCircle } from 'react-icons/fa';

export default function PaymentCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      // Get order details from localStorage
      const storedOrder = localStorage.getItem(`order_${orderId}`);
      if (storedOrder) {
        const order = JSON.parse(storedOrder);
        setOrderDetails(order);
      }
    }
  }, [orderId]);

  const handleRetry = () => {
    if (orderDetails?.returnUrl) {
      // Return to the page that initiated the payment
      window.location.href = orderDetails.returnUrl;
    } else if (orderDetails?.projectId) {
      navigate(`/projects/${orderDetails.projectId}`);
    } else {
      navigate('/pricing');
    }
  };

  const handleGoToDashboard = () => {
    // Clean up localStorage
    if (orderId) {
      localStorage.removeItem(`order_${orderId}`);
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100"
          >
            <FaTimesCircle className="h-12 w-12 text-yellow-600" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-3xl font-extrabold text-gray-900"
          >
            Payment Cancelled
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-gray-600"
          >
            Your payment was cancelled. No charges have been made.
          </motion.p>

          {orderDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-gray-50 rounded-lg p-4"
            >
              <h3 className="text-sm font-medium text-gray-900 mb-2">Order Details</h3>
              <dl className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <dt>Order ID:</dt>
                  <dd className="font-medium">{orderId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Amount:</dt>
                  <dd className="font-medium">${orderDetails.amount / 100}</dd>
                </div>
                {orderDetails.projectName && (
                  <div className="flex justify-between">
                    <dt>Project:</dt>
                    <dd className="font-medium">{orderDetails.projectName}</dd>
                  </div>
                )}
              </dl>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 space-y-3"
          >
            <button
              onClick={handleRetry}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Try Again
            </button>
            
            <button
              onClick={handleGoToDashboard}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Go to Dashboard
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 text-xs text-gray-500"
          >
            You can complete your purchase at any time from your project page.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}