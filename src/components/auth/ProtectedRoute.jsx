import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../contexts/LoadingContext';

const ProtectedRoute = ({ children, allowWithError = false }) => {
  const { isAuthenticated, loading } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (loading) {
      showLoading('auth', 'Verifying authentication...');
    } else {
      hideLoading('auth');
    }

    return () => {
      hideLoading('auth');
    };
  }, [loading, showLoading, hideLoading]);

  if (loading) {
    return null; // LoadingOverlay will handle the display
  }

  // Check if we have a token even if not authenticated in Redux state
  // This prevents redirect when there's a temporary auth error
  const hasToken = localStorage.getItem('ebay_manager_auth_token');

  if (!isAuthenticated && !hasToken && !allowWithError) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;