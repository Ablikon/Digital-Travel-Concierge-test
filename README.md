# Digital Travel — News Companion App

A cross-platform mobile application built with **React Native (Expo)** that delivers curated news articles with rich features including biometric authentication, WebView integration, push notifications, and file management.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 55) |
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
│   ├── app/                # App layer — store configuration, providers
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
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go** app on your device (iOS/Android) for development
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

# Start the development server
npx expo start
```

## Running the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

Scan the QR code with **Expo Go** (Android) or the Camera app (iOS) to run on a physical device.

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

### Why expo-file-system/legacy?
Expo SDK 55 introduced a new File/Directory-based API. The legacy API is used for broader compatibility with download progress callbacks and file system operations.

## Web Deployment (Vercel)

The project is configured for Vercel deployment out of the box:

```bash
# Build for web locally
npm run build:web
```
## Building for Production

```bash
# Build for iOS
npx eas build --platform ios

# Build for Android
npx eas build --platform android

# Export for web
npm run build:web
```

## License

MIT
