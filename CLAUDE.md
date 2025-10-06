# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

2zpoint is a React-based SaaS application for content creation and copywriting services. The frontend uses Vite, React 19, Mantine UI v8, Redux Toolkit, and React Query for a modern, performant web application.

**Tech Stack:**
- Build Tool: Vite 7.0
- Framework: React 19.1 with React Router 7.6
- UI Library: Mantine v8.3 (primary), Framer Motion for animations
- State: Redux Toolkit 2.8 with Redux Persist 6.0
- API: Axios with React Query 5.81 for server state
- Forms: React Hook Form 7.58 with Yup validation
- Rich Text: TipTap 3.4
- Payments: Stripe React 3.7

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
  - Projects (`projectsSlice`), Products (`productsSlice`, `projectProductsSlice`)
  - Copies (`copySlice`, `copiesSlice`), Brand Messages (`brandMessagesSlice`)
  - Orders (`ordersSlice`), Plans (`plansSlice`), Credit Packages (`creditPackagesSlice`)
  - Writing Styles (`writingStylesSlice`), UI State (`uiSlice`)
  - Analytics (`analyticsSlice`), Messages (`messagesSlice`)
  - Uses Redux Persist for local storage persistence with whitelist configuration

### API Layer
- **Base Configuration**: `/src/config/api.js`
  - API URL from env: `VITE_API_BASE_URL` (default: `http://localhost:3041/api`)
  - Language from env: `VITE_API_LANG` (default: `en`)
  - Full URL pattern: `${VITE_API_BASE_URL}/${VITE_API_LANG}/endpoint`
- **Service Layer** (`/src/services/`):
  - Base API client in `/src/services/api.js` with Axios interceptors
  - Auto-includes auth token from localStorage
  - Handles 401 errors with auto-redirect to login
  - Individual service files for each domain (auth, projects, copies, etc.)
- **React Query**: Server state management with QueryClient configuration

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
VITE_FB_PIXEL_ID=                            # Facebook Pixel ID (optional)
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
- Alternative landing pages available:
  - `Landing1` at `/src/pages/landing/landingPage1/Landing1_DRY.jsx`
  - Legacy `Landing` at `/src/pages/landing/Landing.jsx`

## Testing & Scripts
- Sitemap generation: `scripts/generate-sitemap.js` (runs automatically on build)
- SEO testing scripts available in `scripts/` directory

## Important Notes
- Always use `react-icons` for icons, NOT `@tabler/icons-react`
- Facebook Pixel tracking is integrated in `App.jsx` with custom hooks in `/src/hooks/useFBPixel.js`
- Typebot chat widget integration available via `@typebot.io/react`
- IP-based geolocation tracking implemented for user sessions
- Storage keys defined in `/src/types/index.js`