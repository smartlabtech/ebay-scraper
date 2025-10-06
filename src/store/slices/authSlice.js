import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth';
import firstOrderService from '../../services/firstOrderService';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, remember }) => {
    const response = await authService.login(email, password, remember);
    return response;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData) => {
    const response = await authService.register(userData);
    return response;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout();
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates) => {
    const response = await authService.updateProfile(updates);
    return response;
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }) => {
    const response = await authService.changePassword(currentPassword, newPassword);
    return response;
  }
);

export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerification',
  async () => {
    const response = await authService.resendVerificationEmail();
    return response;
  }
);

export const signupWithPlan = createAsyncThunk(
  'auth/signupWithPlan',
  async (signupData) => {
    const response = await firstOrderService.createFirstOrder(signupData);

    // Save the token and user data
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }
);

// Initial state
const initialState = {
  user: authService.getCurrentUser(),
  isAuthenticated: !!authService.getCurrentUser(),
  isEmailVerified: authService.getCurrentUser()?.emailVerified || false,
  loading: false,
  error: null,
  passwordChangeSuccess: false,
  verificationEmailSent: false,
  firstOrderResponse: null // Store orderId and subscriptionId
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPasswordChangeSuccess: (state) => {
      state.passwordChangeSuccess = false;
    },
    updateUserSubscription: (state, action) => {
      if (state.user) {
        state.user.subscription = action.payload;
      }
    },
    emailVerified: (state) => {
      state.isEmailVerified = true;
      if (state.user) {
        state.user.emailVerified = true;
      }
    },
    clearVerificationEmailSent: (state) => {
      state.verificationEmailSent = false;
    },
    clearFirstOrderResponse: (state) => {
      state.firstOrderResponse = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isEmailVerified = action.payload.user?.emailVerified || false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isEmailVerified = action.payload.user?.emailVerified || false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Update failed';
      });

    // Change password
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordChangeSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordChangeSuccess = true;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Password change failed';
        state.passwordChangeSuccess = false;
      });

    // Resend verification email
    builder
      .addCase(resendVerificationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.verificationEmailSent = false;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.loading = false;
        state.verificationEmailSent = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to resend verification email';
        state.verificationEmailSent = false;
      });

    // Signup with plan (first-order)
    builder
      .addCase(signupWithPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.firstOrderResponse = null;
      })
      .addCase(signupWithPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isEmailVerified = action.payload.user?.emailVerified || false;
        state.firstOrderResponse = {
          orderId: action.payload.orderId,
          subscriptionId: action.payload.subscriptionId,
          message: action.payload.message
        };
        state.error = null;
      })
      .addCase(signupWithPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Signup failed';
        state.isAuthenticated = false;
        state.firstOrderResponse = null;
      });
  }
});

// Export actions
export const { clearError, clearPasswordChangeSuccess, updateUserSubscription, emailVerified, clearVerificationEmailSent, clearFirstOrderResponse } = authSlice.actions;

// Export selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectPasswordChangeSuccess = (state) => state.auth.passwordChangeSuccess;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectUserSubscription = (state) => state.auth.user?.subscription;
export const selectIsEmailVerified = (state) => state.auth.isEmailVerified;
export const selectVerificationEmailSent = (state) => state.auth.verificationEmailSent;

// Export reducer
export default authSlice.reducer;