# Digital Travel — News Companion App

A cross-platform mobile application built with **React Native (Expo)** that delivers curated news articles with rich features including biometric authentication, WebView integration, push notifications, and file management.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 54) |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router (file-based) |
| State Management | Redux Toolkit + RTK Query |
| Styling | NativeWind (Tailwind CSS) |
| Architecture | Feature-Sliced Design (FSD) |
| Icons | @expo/vector-icons (AntDesign, Ionicons, MaterialCommunityIcons) |
| Testing | Jest + ts-jest |

## Features

### Core
- **News Feed** — Browse top headlines from NewsAPI with infinite scroll and pull-to-refresh
- **Search & Filtering** — Debounced search (600ms) with category chips and sort options (latest, relevant, popular)
- **Article Detail** — Rich article view with hero image, author info, and content preview
- **WebView** — Built-in browser with navigation controls (back/forward/reload), URL bar, and share

### Security
- **Biometric Authentication** — Face ID / Touch ID with passcode fallback
- **Auth Guard** — Protected routes that redirect unauthenticated users
- **Secure Logout** — Confirmation dialog before sign-out

### Data
- **Favorites** — Add/remove articles with AsyncStorage persistence
- **Push Notifications** — Local notification scheduling with platform-specific channel support
- **File Operations** — Upload images/documents, download files with progress tracking, share via native sheet

## Project Architecture (Feature-Sliced Design)

```
├── app/                    # Expo Router (pages layer)
│   ├── (auth)/             # Authentication screens
│   ├── (tabs)/             # Tab navigation (News, Favorites, Files, Profile)
│   ├── article/[id].tsx    # Article detail (dynamic route)
│   └── webview.tsx         # WebView modal
├── src/
│   ├── app-core/           # App layer — store configuration, providers
│   ├── widgets/            # Composite UI blocks
│   │   ├── news-list/      # News feed with infinite scroll
│   │   └── search-results/ # Search results list
│   ├── features/           # User interactions
│   │   ├── auth/           # Biometric auth + logout
│   │   ├── search-news/    # Search bar, sort options
│   │   ├── filter-news/    # Category & date filters (Redux)
│   │   ├── manage-favorites/ # Add/remove/persist favorites
│   │   ├── notifications/  # Push notification hooks
│   │   └── file-operations/ # Upload, download, share files
│   ├── entities/           # Business entities
│   │   └── article/        # Article model, API (RTK Query), card components
│   └── shared/             # Shared code
│       ├── api/            # RTK Query base configuration
│       ├── config/         # Constants, API keys
│       ├── lib/            # Hooks (useDebounce), utilities, navigation helpers
│       ├── types/          # TypeScript interfaces
│       └── ui/             # Reusable components (Button, Chip, Spinner, etc.)
└── __tests__/              # Unit tests
```

## Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**
- **Expo Go** app on your device (iOS/Android) — for quick testing
- **Xcode 17+** (macOS) — for iOS development build with Face ID support
- **NewsAPI Key** — free at [newsapi.org/register](https://newsapi.org/register)

## Installation

```bash
# Clone the repository
git clone https://github.com/Ablikon/Digital-Travel-Concierge-test.git
cd Digital-Travel-Concierge-test

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Then edit .env and add your NewsAPI key
```

## Running the App

There are two ways to run the app on a physical device:

### Option 1: Expo Go (Quick Start)

The fastest way to preview the app. All features work except Face ID (Expo Go limitation — uses device passcode as fallback).

```bash
# Start Expo development server
npx expo start

# Or with cache clear
npx expo start --clear
```

Scan the QR code with **Expo Go** (Android) or the Camera app (iOS).

> **Note:** Ensure your phone and computer are on the same Wi-Fi network. If you experience timeouts, try using your phone's Personal Hotspot.

### Option 2: Development Build (Full Feature Set, including Face ID)

For complete native functionality including Face ID/Touch ID biometric authentication:

```bash
# Generate native iOS project
npx expo prebuild --platform ios --clean

# Install CocoaPods (requires LANG=en_US.UTF-8 for Ruby 4.0+)
cd ios && LANG=en_US.UTF-8 pod install && cd ..

# Build and run on connected device
npx expo run:ios --device

# Or run on simulator
npx expo run:ios
```

**Requirements for development build:**
- macOS with Xcode 17+ (for iOS 26 devices) or Xcode 16+ (for iOS 18 devices)
- Apple Developer account (free tier is sufficient for device testing)
- CocoaPods (`brew install cocoapods`)

### Web

```bash
# Run in web browser
npm run web
```

## Biometric Authentication

The app implements biometric authentication using `expo-local-authentication`:

| Environment | Behavior |
|-------------|----------|
| **Development Build** (iOS/Android) | Full Face ID / Touch ID with passcode fallback |
| **Expo Go** | Device passcode only (Expo Go limitation — no Face ID access) |
| **Web** | Auto-authenticated (biometrics not available on web) |

The implementation detects the available biometric type (Face ID, Touch ID, or Iris) and adapts the UI accordingly. See `src/features/auth/lib/use-biometric-auth.ts`.

## API Configuration

The app uses [NewsAPI](https://newsapi.org/) for fetching news articles.

1. Sign up at [newsapi.org](https://newsapi.org/register) (free, 100 requests/day)
2. Copy your API key
3. Set `EXPO_PUBLIC_NEWS_API_KEY` in your `.env` file

> **Note:** The API key is loaded from environment variables and is **never** hardcoded or committed to the repository.

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npx jest --coverage

# Run specific test file
npx jest __tests__/features/auth-slice.test.ts
```

### Test Coverage
- **Redux Slices**: Auth, favorites, and filters reducers with full action coverage
- **Utilities**: Date formatting (relative & absolute), article ID generation
- **29 unit tests** across 5 test suites

## Code Quality

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Format code
npm run format
```

## Design Decisions

### Why Feature-Sliced Design?
FSD provides strict boundaries between layers, making the codebase scalable for team collaboration. Each feature is self-contained with its own model, UI, and API — matching the microservices architecture described in the project requirements.

### Why RTK Query over plain fetch?
RTK Query provides automatic caching, request deduplication, optimistic updates, and seamless Redux integration. It eliminates boilerplate for loading/error states and works naturally with infinite scroll patterns.

### Why NativeWind?
Tailwind CSS utility classes accelerate UI development while maintaining consistency. NativeWind brings the same DX to React Native with zero runtime cost after compilation.

### Why Expo SDK 54?
SDK 54 provides full compatibility with the standard Expo Go app from the App Store, allowing seamless testing on physical devices. For full native features (Face ID), a development build is recommended.

## Web Deployment (Vercel)

The project is configured for Vercel deployment out of the box:

```bash
# Build for web locally
npm run build:web
```

Set the `EXPO_PUBLIC_NEWS_API_KEY` environment variable in Vercel project settings.

## Building for Production

```bash
# Build for iOS
npx eas build --platform ios

# Build for Android
npx eas build --platform android

# Export for web
npm run build:web
```
