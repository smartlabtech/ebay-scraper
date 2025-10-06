import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import {
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearNotifications,
  showToast,
  hideToast,
  selectNotifications,
  selectUnreadNotifications,
  selectToasts
} from '../store/slices/uiSlice';

export const useNotifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const unreadNotifications = useSelector(selectUnreadNotifications);
  const toasts = useSelector(selectToasts);

  const notify = useCallback((notification) => {
    dispatch(addNotification(notification));
  }, [dispatch]);

  const markAsRead = useCallback((notificationId) => {
    dispatch(markNotificationRead(notificationId));
  }, [dispatch]);

  const markAllAsRead = useCallback(() => {
    dispatch(markAllNotificationsRead());
  }, [dispatch]);

  const removeNotify = useCallback((notificationId) => {
    dispatch(removeNotification(notificationId));
  }, [dispatch]);

  const clearAll = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    dispatch(showToast({ message, type, duration }));
  }, [dispatch]);

  const removeToast = useCallback((toastId) => {
    dispatch(hideToast(toastId));
  }, [dispatch]);

  // Track toast timers to avoid recreating them
  const toastTimers = useRef({});

  // Auto-hide toasts
  useEffect(() => {
    toasts.forEach(t => {
      // Only create timer if it doesn't exist for this toast
      if (t.duration && t.duration > 0 && !toastTimers.current[t.id]) {
        toastTimers.current[t.id] = setTimeout(() => {
          removeToast(t.id);
          delete toastTimers.current[t.id];
        }, t.duration);
      }
    });
    
    // Cleanup timers for toasts that no longer exist
    const currentToastIds = new Set(toasts.map(t => t.id));
    Object.keys(toastTimers.current).forEach(id => {
      if (!currentToastIds.has(id)) {
        clearTimeout(toastTimers.current[id]);
        delete toastTimers.current[id];
      }
    });
    
    return () => {
      // Clear all timers on unmount
      Object.values(toastTimers.current).forEach(timer => clearTimeout(timer));
      toastTimers.current = {};
    };
  }, [toasts, removeToast]);

  // Helper methods for different notification types
  const notifySuccess = useCallback((message, title = 'Success') => {
    notify({ type: 'success', title, message });
    toast(message, 'success');
  }, [notify, toast]);

  const notifyError = useCallback((message, title = 'Error') => {
    notify({ type: 'error', title, message });
    toast(message, 'error');
  }, [notify, toast]);

  const notifyWarning = useCallback((message, title = 'Warning') => {
    notify({ type: 'warning', title, message });
    toast(message, 'warning');
  }, [notify, toast]);

  const notifyInfo = useCallback((message, title = 'Info') => {
    notify({ type: 'info', title, message });
    toast(message, 'info');
  }, [notify, toast]);

  return {
    notifications,
    unreadNotifications,
    unreadCount: unreadNotifications.length,
    toasts,
    notify,
    markAsRead,
    markAllAsRead,
    removeNotify,
    clearAll,
    toast,
    removeToast,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo
  };
};