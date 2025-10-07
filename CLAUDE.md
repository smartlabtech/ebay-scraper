# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

eBay Store Manager is a private React-based control panel application for managing eBay store operations. It provides a clean interface for store management, inventory control, and sales tracking.

**Tech Stack:**
- Build Tool: Vite 7.0
- Framework: React 19.1 with React Router 7.6
- UI Library: Mantine v8.3, Framer Motion for animations
- State: Redux Toolkit 2.8 with Redux Persist 6.0
- API: Axios with React Query 5.81 for server state

## Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## Architecture & Key Components

### State Management
- **Redux Toolkit** (`/src/store/`) - Global state management with slices for:
  - Authentication (`authSlice`)
  - Stores (`storesSlice`)
  - UI State (`uiSlice`)
  - Uses Redux Persist for local storage persistence

### API Layer
- **Base Configuration**: `/src/config/api.js`
  - API URL from env: `VITE_API_BASE_URL` (default: `http://localhost:3041/api`)
  - Language from env: `VITE_API_LANG` (default: `en`)
- **Service Layer** (`/src/services/`):
  - Base API client in `/src/services/api.js` with Axios interceptors
  - Auto-includes auth token from localStorage
  - Handles 401 errors with auto-redirect to login
  - Services: auth, stores, cache clearing

### Routing Architecture
- **Public Routes**: Login, password reset, email verification
- **Protected Routes**: All control panel routes wrapped in `ProtectedRoute`
- All main routes under `/control/*` path:
  - `/control` - Dashboard overview
  - `/control/stores` - Store management
  - `/control/stores/new` - Add new store
  - `/control/stores/:id` - Store details

### Layout
- **Control Panel Layout**: Sidebar navigation with expandable menu
- Professional admin panel style interface
- Mobile responsive with burger menu
- Easy to extend with new sections

## Project Structure

```
/src/
├── components/
│   ├── auth/          # Authentication components
│   ├── common/        # Reusable UI components
│   ├── forms/         # Form components
│   ├── layout/        # Layout components (ControlPanelLayout)
│   └── ui/            # UI utilities
├── pages/
│   ├── auth/          # Auth pages (Login, Register, etc.)
│   ├── dashboard/     # UserDashboard
│   └── stores/        # StoresList
├── services/          # API services
├── store/            # Redux store configuration
│   └── slices/       # Redux slices
├── utils/            # Utility functions
└── App.jsx           # Main app component
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3041/api  # Backend API URL
VITE_API_LANG=en                              # API language
```

## Important Notes

- This is a **private management system** - no public-facing pages
- No tracking or analytics included
- Authentication required for all control panel routes
- Clean, minimal architecture focused on eBay store management
- Ready for expansion with additional management features