# Postcode Manager Components

This folder contains all components, hooks, and services related to the postcode validation and service area management functionality.

## Structure

```
postcode-manager/
├── index.ts                     # Main exports for easy importing
├── PostcodeChecker.tsx         # Main postcode validation component
├── AdminPostcodeManager.tsx    # Admin interface for managing service areas  
├── AdminDashboard.tsx          # Complete admin dashboard with both components
├── hooks/
│   └── usePostcodeService.ts   # React hook for centralized postcode state management
└── services/
    └── postcodeService.ts      # Core service layer with localStorage persistence
```

## Components

### PostcodeChecker
- User-facing postcode validation component
- Typewriter animation effect
- Auto-detection via geolocation
- Real-time service area checking

### AdminPostcodeManager
- Admin interface for CRUD operations on service areas
- Postcode validation before adding
- Search and filter functionality
- Export capabilities

### AdminDashboard
- Clean admin interface focused on service area management
- Simple, streamlined navigation
- Direct access to service area management tools

## Hooks

### usePostcodeService
- Centralized state management for postcode data
- Real-time synchronization across tabs
- localStorage persistence
- Automatic refresh capabilities

## Services

### postcodeService
- Core data layer with localStorage persistence
- UK Postcode API integration for validation
- Cross-tab synchronization via storage events
- Duplicate prevention and data integrity

## Usage

```typescript
// Import individual components
import { PostcodeChecker, AdminDashboard } from '@/components/postcode-manager';

// Import hooks and services
import { usePostcodeService, formatPostcode } from '@/components/postcode-manager';
```

## Features

- ✅ Real-time data synchronization
- ✅ localStorage persistence
- ✅ Cross-tab updates
- ✅ UK Postcode API validation
- ✅ Geolocation auto-detection
- ✅ Scalable architecture
- ✅ TypeScript support
- ✅ Mobile responsive design
