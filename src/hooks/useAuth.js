import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectUserRole,
  selectUserSubscription,
  login,
  logout,
  updateProfile
} from '../store/slices/authSlice';
import { USER_ROLES } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const userRole = useSelector(selectUserRole);
  const subscription = useSelector(selectUserSubscription);

  const signIn = useCallback(async (email, password, remember = false) => {
    try {
      const result = await dispatch(login({ email, password, remember })).unwrap();
      navigate('/dashboard');
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch, navigate]);

  const signOut = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [dispatch, navigate]);

  const updateUserProfile = useCallback(async (updates) => {
    try {
      const result = await dispatch(updateProfile(updates)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const checkPermission = useCallback((requiredRole) => {
    if (!userRole) return false;
    
    const roleHierarchy = {
      [USER_ROLES.FREE]: 0,
      [USER_ROLES.PREMIUM]: 1,
      [USER_ROLES.ENTERPRISE]: 2,
      [USER_ROLES.ADMIN]: 3
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }, [userRole]);

  const hasActiveSubscription = useCallback(() => {
    return subscription && subscription.status === 'active';
  }, [subscription]);

  const canAccessFeature = useCallback((feature) => {
    // Check feature access based on subscription plan
    const featureAccess = {
      projects: true,
      messages: true,
      copies: true,
      analytics: userRole !== USER_ROLES.FREE,
      advancedAnalytics: userRole === USER_ROLES.ENTERPRISE || userRole === USER_ROLES.ADMIN,
      teamCollaboration: userRole !== USER_ROLES.FREE,
      apiAccess: userRole === USER_ROLES.ENTERPRISE || userRole === USER_ROLES.ADMIN,
      customBranding: userRole === USER_ROLES.ENTERPRISE || userRole === USER_ROLES.ADMIN
    };

    return featureAccess[feature] || false;
  }, [userRole]);

  return {
    user,
    isAuthenticated,
    loading,
    userRole,
    subscription,
    signIn,
    signOut,
    updateUserProfile,
    checkPermission,
    hasActiveSubscription,
    canAccessFeature
  };
};