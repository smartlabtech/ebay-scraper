import {configureStore} from "@reduxjs/toolkit"
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from "redux-persist"
import storage from "redux-persist/lib/storage"
import {combineReducers} from "redux"

// Import slices
import authReducer from "./slices/authSlice"
import storesReducer from "./slices/storesSlice"
import keywordsReducer from "./slices/keywordsSlice"
import keywordPagesReducer from "./slices/keywordPagesSlice"
import manifestsReducer from "./slices/manifestsSlice"
import webscraperReducer from "./slices/webscraperSlice"
import uiReducer from "./slices/uiSlice"

// Redux persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "stores", "keywords", "keywordPages", "manifests", "webscraper"] // Persist auth, stores, keywords, keywordPages, manifests and webscraper state
}

// Combine reducers
const appReducer = combineReducers({
  auth: authReducer,
  stores: storesReducer,
  keywords: keywordsReducer,
  keywordPages: keywordPagesReducer,
  manifests: manifestsReducer,
  webscraper: webscraperReducer,
  ui: uiReducer
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