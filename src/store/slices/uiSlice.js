import { createSlice, createSelector } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  modals: {
    createProject: false,
    createMessage: false,
    createCopy: false,
    deleteConfirm: false,
    shareProject: false,
    exportData: false,
    aiSettings: false,
    payment: false,
    upgrade: false,
    projectSelection: false  // Add global project selection modal state
  },
  notifications: [],
  toasts: [],
  activeTab: null,
  breadcrumbs: [],
  isFullscreen: false,
  isMobile: false,
  keyboardShortcutsEnabled: true,
  animationsEnabled: true,
  soundEnabled: false,
  autoSaveEnabled: true,
  tourCompleted: false,
  tourStep: 0,
  preferences: {
    compactView: false,
    showStats: true,
    defaultView: 'grid',
    notificationSound: true,
    emailNotifications: true,
    autoExport: false
  }
};

let notificationId = 0;
let toastId = 0;

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    // Modals
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },

    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: ++notificationId,
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload
      };
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(n => {
        n.read = true;
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Toasts
    showToast: (state, action) => {
      const toast = {
        id: ++toastId,
        duration: 4000,
        type: 'info',
        shown: false,
        ...action.payload
      };
      state.toasts.push(toast);
    },
    markToastShown: (state, action) => {
      const toast = state.toasts.find(t => t.id === action.payload);
      if (toast) {
        toast.shown = true;
      }
    },
    hideToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },

    // Navigation
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (state, action) => {
      state.breadcrumbs.push(action.payload);
    },
    popBreadcrumb: (state) => {
      state.breadcrumbs.pop();
    },

    // Layout
    setFullscreen: (state, action) => {
      state.isFullscreen = action.payload;
    },
    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen;
    },
    setMobile: (state, action) => {
      state.isMobile = action.payload;
    },

    // Settings
    setKeyboardShortcuts: (state, action) => {
      state.keyboardShortcutsEnabled = action.payload;
    },
    setAnimations: (state, action) => {
      state.animationsEnabled = action.payload;
    },
    setSound: (state, action) => {
      state.soundEnabled = action.payload;
    },
    setAutoSave: (state, action) => {
      state.autoSaveEnabled = action.payload;
    },

    // Tour
    setTourCompleted: (state, action) => {
      state.tourCompleted = action.payload;
    },
    setTourStep: (state, action) => {
      state.tourStep = action.payload;
    },
    nextTourStep: (state) => {
      state.tourStep += 1;
    },
    prevTourStep: (state) => {
      state.tourStep = Math.max(0, state.tourStep - 1);
    },
    resetTour: (state) => {
      state.tourStep = 0;
      state.tourCompleted = false;
    },

    // Preferences
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    resetPreferences: (state) => {
      state.preferences = initialState.preferences;
    },

    // Global reset
    resetUI: (state) => {
      return initialState;
    }
  }
});

// Export actions
export const {
  setSidebarOpen,
  toggleSidebar,
  setSidebarCollapsed,
  toggleSidebarCollapsed,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearNotifications,
  showToast,
  markToastShown,
  hideToast,
  clearToasts,
  setActiveTab,
  setBreadcrumbs,
  addBreadcrumb,
  popBreadcrumb,
  setFullscreen,
  toggleFullscreen,
  setMobile,
  setKeyboardShortcuts,
  setAnimations,
  setSound,
  setAutoSave,
  setTourCompleted,
  setTourStep,
  nextTourStep,
  prevTourStep,
  resetTour,
  updatePreferences,
  resetPreferences,
  resetUI
} = uiSlice.actions;

// Export selectors
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectModals = (state) => state.ui.modals;
export const selectModalOpen = (modalName) => (state) => state.ui.modals[modalName] || false;
export const selectNotifications = (state) => state.ui.notifications;

// Memoized selector for unread notifications to prevent unnecessary re-renders
export const selectUnreadNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(n => !n.read)
);

export const selectToasts = (state) => state.ui.toasts;
export const selectActiveTab = (state) => state.ui.activeTab;
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs;
export const selectIsFullscreen = (state) => state.ui.isFullscreen;
export const selectIsMobile = (state) => state.ui.isMobile;
export const selectKeyboardShortcuts = (state) => state.ui.keyboardShortcutsEnabled;
export const selectAnimations = (state) => state.ui.animationsEnabled;
export const selectSound = (state) => state.ui.soundEnabled;
export const selectAutoSave = (state) => state.ui.autoSaveEnabled;
export const selectTourCompleted = (state) => state.ui.tourCompleted;
export const selectTourStep = (state) => state.ui.tourStep;
export const selectPreferences = (state) => state.ui.preferences;

// Export reducer
export default uiSlice.reducer;