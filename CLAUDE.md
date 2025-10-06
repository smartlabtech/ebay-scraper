# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

2zpoint is a React-based SaaS application for content creation and copywriting services. The frontend uses Vite, React 19, Mantine UI v8, Redux Toolkit, and React Query for a modern, performant web application.

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

# Generate sitemap (runs automatically on build)
npm run generate-sitemap
```

## Architecture & Key Components

### State Management
- **Redux Toolkit** (`/src/store/`) - Global state management with slices for:
  - Authentication (`authSlice`)
  - Subscriptions (`subscriptionSlice`)
  - Projects, Copies, Brand Messages
  - Orders, Plans, Credit Packages
  - Uses Redux Persist for local storage persistence

### API Layer
- **Base Configuration**: `/src/config/api.js`
  - API URL from env: `VITE_API_BASE_URL` (default: `http://localhost:3041/api`)
  - Language from env: `VITE_API_LANG` (default: `en`)
- **Service Layer** (`/src/services/`): Axios-based API calls with interceptors for auth
- **React Query**: Server state management for API data caching and synchronization

### Routing Architecture
- **Public Routes**: Landing pages, auth flows (login, register, password reset)
- **Protected Routes**: Dashboard, projects, copies - wrapped in `ProtectedRoute`
- **Admin Routes**: Control panel at `/control/*` - wrapped in `AdminRoute`
- **Lazy Loading**: All route components are lazy-loaded for performance

### UI Framework
- **Mantine v8**: Primary UI library
  - Custom theme in `App.jsx` with violet primary color
  - Notifications configured globally
  - Components use Mantine's sx prop for styling
- **Icons**: Using `react-icons` library (NOT @tabler/icons-react)

### Key Features Implementation
- **Facebook Pixel Integration**: Tracking setup in App.jsx
- **IP Geolocation Tracking**: Session tracking with ipapi.co
- **Payment Integration**: Stripe implementation for subscriptions and credit packages
- **Rich Text Editor**: TipTap integration for content editing
- **File Uploads**: Mantine Dropzone for image/file handling

## Build & Deployment

### Docker Build
```bash
# Build with environment variables
docker build --build-arg VITE_API_BASE_URL=<api-url> --build-arg VITE_API_LANG=<lang> -t 2zpoint-fe .
```

### GitHub Actions
- Automated Docker builds on push to master/main
- Pushes to GitHub Container Registry (ghcr.io)
- Requires GitHub repository variables:
  - `VITE_API_BASE_URL`
  - `VITE_API_LANG`

### Production Optimization
- Vite configured with code splitting:
  - Vendor chunks: react, redux, mantine, utils
  - CSS code splitting enabled
  - Assets inlined under 4KB
- Nginx serves static files with:
  - Gzip compression
  - Cache headers for assets (1 year)
  - React Router support (fallback to index.html)

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3041/api  # Backend API URL
VITE_API_LANG=en                              # API language (en/ar)
```

## Project Structure Patterns

### Service Pattern
Services in `/src/services/` follow a consistent pattern:
- Import base API from `./api`
- Export async functions that return API responses
- Handle errors with proper error messages
- Use React Query for caching when appropriate

### Redux Slice Pattern
Slices use Redux Toolkit's createSlice with:
- Initial state definition
- Reducers for synchronous updates
- Extra reducers for async thunks
- Selectors exported for component usage

### Component Organization
- Pages in `/src/pages/` - route components
- Components in `/src/components/` - reusable UI components
- Hooks in `/src/hooks/` - custom React hooks
- Utils in `/src/utils/` - helper functions

## Current Landing Page Setup
- App uses `Landing2` component at root route (`/`)
- Landing2 is located at `/src/pages/landing/LandingPage2/Landing2.jsx`
- Built with Mantine components