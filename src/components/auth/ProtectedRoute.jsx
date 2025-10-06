import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../contexts/LoadingContext';

const ProtectedRoute = ({ children }) => {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;