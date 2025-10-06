import {configureStore} from "@reduxjs/toolkit"
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from "redux-persist"
import storage from "redux-persist/lib/storage"
import {combineReducers} from "redux"

// Import slices
import authReducer from "./slices/authSlice"
import projectsReducer from "./slices/projectsSlice"
import projectProductsReducer from "./slices/projectProductsSlice"
import productsReducer from "./slices/productsSlice"
import messagesReducer from "./slices/messagesSlice"
import copiesReducer from "./slices/copiesSlice"
import analyticsReducer from "./slices/analyticsSlice"
import uiReducer from "./slices/uiSlice"
import brandMessagesReducer from "./slices/brandMessagesSlice"
import subscriptionReducer from "./slices/subscriptionSlice"
import plansReducer from "./slices/plansSlice"
import ordersReducer from "./slices/ordersSlice"
import creditPackagesReducer from "./slices/creditPackagesSlice"
import writingStylesReducer from "./slices/writingStylesSlice"

// Redux persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"] // Only persist auth state
}

// Combine reducers
const appReducer = combineReducers({
  auth: authReducer,
  projects: projectsReducer,
  projectProducts: projectProductsReducer,
  products: productsReducer,
  messages: messagesReducer,
  copies: copiesReducer,
  analytics: analyticsReducer,
  ui: uiReducer,
  brandMessages: brandMessagesReducer,
  subscription: subscriptionReducer,
  plans: plansReducer,
  orders: ordersReducer,
  creditPackages: creditPackagesReducer,
  writingStyles: writingStylesReducer
})

// Root reducer that handles logout action to reset entire store
const rootReducer = (state, action) => {
  // When logout is successful, reset the entire state
  if (action.type === 'auth/logout/fulfilled') {
    // Clear the persisted storage
    storage.removeItem('persist:root')
    // Reset state to undefined so each reducer returns initial state
    state = undefined
  }
  return appReducer(state, action)
}

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

// Create persistor
export const persistor = persistStore(store)

// Export types
export default store
