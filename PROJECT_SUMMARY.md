# Form Builder Frontend - Project Summary

**Version:** 3.0.5  
**Last Updated:** January 27, 2026

---

## 🎯 Project Overview

React-based form builder application with modern FSD (Feature-Sliced Design) architecture, Redux Toolkit for state management, and responsive UI with theme support.

---

## 🏗️ Architecture

### Tech Stack
- **Framework:** React 18.3.1
- **State Management:** Redux Toolkit 2.11.2
- **Routing:** React Router DOM 6.26.2
- **Forms:** React Hook Form 7.53.0
- **Styling:** SASS/SCSS with CSS Modules
- **HTTP Client:** Axios 1.13.2
- **UI Components:** Custom components + MUI Icons
- **Build Tool:** React Scripts 5.0.1 (with customize-cra)

### Architecture: Feature-Sliced Design (FSD)

```
src/
├── app/                    # Application initialization
│   ├── providers/         # Context providers (Theme)
│   ├── router/            # Routing configuration
│   └── store.ts           # Redux store setup
│
├── pages/                  # Page components (routes)
│   ├── auth/              # Sign in/Sign up pages
│   ├── form-builder/      # Form builder page
│   ├── user-form/         # User form page
│   └── welcome-page/      # Landing page
│
├── widgets/                # Complex composite components
│   ├── header/            # Application header
│   └── protected-route/   # Auth guard wrapper
│
├── features/               # Business features
│   └── auth/              # Authentication feature
│       ├── lib/           # Auth helpers & constants
│       └── model/         # Auth API & state (RTK Query + Slice)
│
├── shared/                 # Shared resources
│   ├── api/               # API configuration
│   ├── config/            # App constants & routes
│   ├── lib/               # Hooks & utilities
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Helper functions
│   ├── types/             # TypeScript types
│   └── ui/                # UI kit components
│
└── assets/                 # Static assets
```

---

## 🔐 Authentication System

### Features
- User registration with validation
- User login with "Remember Me" option
- JWT token management (access + refresh)
- Automatic token refresh
- Protected routes
- Persistent authentication state
- Device fingerprinting

### Implementation
- **State:** Redux Toolkit Slice (`features/auth/model/authSlice`)
- **API:** RTK Query (`features/auth/model/authApi`)
- **Storage:** LocalStorage/SessionStorage (`features/auth/model/authStorage`)
- **Route Protection:** `widgets/protected-route/ProtectedRoute`

---

## 🎨 UI/UX Features

### Theme System
- **Light/Dark Mode** with toggle
- Persistent theme preference
- SCSS variables for theming
- Smooth theme transitions

### Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Resizable sidebar
- Adaptive layouts

### Custom Components (shared/ui/)
- **Button** - Customizable button component
- **Input** - Form input with validation support
- **Checkbox** - Custom checkbox
- **Container** - Layout container
- **Layout** - Page layout wrapper
- **Title** - Typography component
- **Burger** - Mobile menu icon
- **Divider** - Visual separator
- **SwitchTheme** - Theme toggle component
- **CustomIcons** - SVG icon components

---

## 📱 Pages

### 1. Welcome Page (`pages/welcome-page/`)
- Landing page
- Marketing content
- Navigation to auth

### 2. Authentication (`pages/auth/`)
- **Sign In** - User login
- **Sign Up** - User registration
- **Forgot Password** - Password recovery (UI ready)
- Shared Card component for auth forms

### 3. Form Builder (`pages/form-builder/`)
- Main form creation interface
- **Sidebar** - Form elements palette (resizable)
- **MainContent** - Form canvas/preview
- Drag & drop functionality (ready for implementation)

### 4. User Form (`pages/user-form/`)
- Form filling interface
- Public form view
- Form submission

---

## 🔌 API Integration

### Configuration (`shared/api/`)
- **axiosInstance** - Configured Axios instance
- **api.constants** - API endpoints & base URL
- Automatic auth token injection
- Request/response interceptors
- Error handling

### Auth API Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

---

## 🧩 Custom Hooks (`shared/lib/hooks/`)

### State Hooks
- **useAppDispatch** - Typed Redux dispatch hook
- **useAppSelector** - Typed Redux selector hook
- **useAuth** - Authentication state & actions

### UI Hooks
- **useMediaQuery** - Responsive media queries
- **useOpen** - Toggle state management
- **useResizableSidebar** - Sidebar resize logic

---

## 🛠️ Utilities (`shared/lib/utils/`)

### Date Helpers
- Date formatting functions
- Time calculations
- Localization support

### Device Helpers
- Device fingerprint generation
- Browser detection
- Device info extraction

### Sweet Alert
- Custom alert/toast notifications
- Styled with app theme
- Success/error/warning messages

---

## 🎯 Recent Improvements (v3.0.5)

### Build Configuration
1. **Suppressed Source Map Warnings**
   - Added `ignoreWarnings` config in webpack
   - Filters out node_modules source map errors
   - Cleaner build output

### FSD Architecture Migration (v3.0.4)
1. **Restructured Project**
   - Migrated from flat structure to FSD
   - Organized by features, not file types
   - Improved code discoverability

2. **Cleaned Up Codebase**
   - Removed old structure folders
   - Consolidated duplicate files
   - Optimized imports

3. **Improved Modularity**
   - Feature-based organization
   - Clear dependency hierarchy
   - Better code splitting potential

---

## 📦 Dependencies

### Core
- `react` v18.3.1
- `react-dom` v18.3.1
- `react-router-dom` v6.26.2
- `@reduxjs/toolkit` v2.11.2
- `react-redux` v9.2.0

### Forms & Validation
- `react-hook-form` v7.53.0
- `classnames` v2.5.1

### HTTP & API
- `axios` v1.13.2

### UI & Styling
- `sass` v1.79.4
- `@mui/icons-material` v6.1.4
- `sweetalert2` v11.14.4
- `react-spinners-css` v2.0.2

### Development
- `typescript` v4.9.5
- `eslint` v8.57.1
- `prettier` v3.3.3
- `react-app-rewired` v2.2.1

---

## 🔧 Development Scripts

```bash
# Development
npm start                # Start dev server

# Build
npm run build            # Production build

# Code Quality
npm run lint             # Run ESLint
npm run format           # Run Prettier

# Testing
npm test                 # Run tests

# Versioning
npm run version:patch    # Bump patch version
npm run version:minor    # Bump minor version
npm run version:major    # Bump major version
```

---

## 📋 Project Structure Benefits

### FSD Advantages
1. **Scalability** - Easy to add new features
2. **Maintainability** - Clear code organization
3. **Testability** - Isolated feature testing
4. **Reusability** - Shared components & utilities
5. **Team Collaboration** - Clear boundaries & ownership

### Layer Responsibilities
- **app** - App initialization, providers, routing
- **pages** - Route-level components
- **widgets** - Complex composite components
- **features** - Business logic features
- **shared** - Reusable code across features

---

## 🚀 TODO

### High Priority
1. Implement form builder drag & drop
2. Add form field components (text, select, radio, etc.)
3. Implement form preview functionality
4. Add form saving/loading

### Medium Priority
5. Implement password reset flow
6. Add user profile management
7. Implement form templates
8. Add form analytics

### Low Priority
9. Add form export (JSON/PDF)
10. Implement form versioning
11. Add collaborative editing
12. Implement A/B testing

---

## 🌐 Deployment

- **Hosting:** Netlify
- **Config:** `netlify.toml`
- **Auto Deploy:** Push to main branch

---

## 🔗 Repository

- **URL:** https://github.com/Svyat0y/form-builder
- **Branches:** 
  - `main` - Production (protected, requires PR)
  - `develop` - Development
- **Latest Version:** v3.0.5

---

## 📚 Key Files

- **Entry Point:** `src/index.tsx`
- **App Root:** `src/app/App.tsx`
- **Router:** `src/app/router/AppRouter.tsx`
- **Store:** `src/app/store.ts`
- **API Config:** `src/shared/api/axiosInstance.ts`
- **Theme Config:** `src/shared/ui/styles/scss/`
- **Webpack Config:** `config-overrides.js`

---

## 🎨 Design System

### Colors
- Defined in `src/shared/ui/styles/scss/_colors.scss`
- Light & Dark theme variants
- Consistent color palette

### Typography
- **Font Family:** Domine (Regular, Medium, SemiBold, Bold)
- Font files in `src/shared/ui/styles/assets/fonts/`
- Responsive font sizes

### Spacing
- Defined in `src/shared/ui/styles/scss/_vars.scss`
- Consistent spacing scale
- Responsive spacing

---

**Status:** ✅ Production Ready (Auth & UI)  
**Architecture:** ✅ Modern FSD Structure  
**Next Steps:** Implement form builder core functionality
