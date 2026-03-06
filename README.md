# Digital Travel — News Platform

A full-stack news platform consisting of a **Next.js web application** and a **React Native (Expo) mobile application**. Both apps share the same API layer and architectural patterns (Feature-Sliced Design, Redux Toolkit + RTK Query, Tailwind CSS).

---

## Repository Structure

```
Digital-Travel/
├── web/                         # Next.js web application (App Router, Shadcn, Tailwind v4)
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   ├── app-core/            # Redux store, providers
│   │   ├── entities/            # Article entity (API, model, UI)
│   │   ├── features/            # Search, favorites, file-operations
│   │   ├── shared/              # Types, config, lib, API
│   │   ├── widgets/             # Header, NewsFeed
│   │   └── components/ui/       # Shadcn UI components
│   └── package.json
│
├── app/                         # Expo Router — mobile app pages
├── src/                         # Mobile app FSD source
│   ├── app-core/                # Redux store (mobile)
│   ├── entities/                # Article entity (mobile)
│   ├── features/                # Auth, search, favorites, notifications, file-ops
│   ├── shared/                  # Types, config, lib, API, UI kit
│   └── widgets/                 # News list, search results
├── __tests__/                   # Unit tests (29 tests)
└── package.json                 # Mobile app dependencies
```

---

## Tech Stack

### Web Application (`/web`)

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | TypeScript (strict) |
| UI Components | **Shadcn UI** (Card, Button, Input, Dialog, Badge, Select, etc.) |
| Styling | **Tailwind CSS v4** |
| State Management | **Redux Toolkit + RTK Query** |
| Architecture | **Feature-Sliced Design (FSD)** |
| Icons | **Lucide React** |
| Fonts | Inter (Google Fonts via next/font) |

### Mobile Application (root)

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81 (Expo SDK 54) |
| Language | TypeScript (strict) |
| Navigation | Expo Router v6 (file-based routing) |
| State Management | Redux Toolkit + RTK Query |
| Styling | NativeWind v4 (Tailwind CSS for React Native) |
| Architecture | Feature-Sliced Design (FSD) |
| Icons | @expo/vector-icons (Ionicons, AntDesign) |
| Auth | expo-local-authentication (Face ID / Touch ID / Fingerprint) |
| Storage | @react-native-async-storage/async-storage |
| Notifications | expo-notifications |
| File I/O | expo-file-system, expo-image-picker, expo-document-picker, expo-sharing |
| WebView | react-native-webview |
| Testing | Jest + ts-jest (29 unit tests) |

---

## Features

### News Feed
- Top headlines from NewsAPI with pagination
- Category filtering: General, Business, Technology, Science, Health, Sports, Entertainment
- Date range filtering
- Grid / List view toggle (web)
- Featured article card with gradient overlay (mobile)
- Infinite scroll (mobile) / pagination (web)
- Pull-to-refresh (mobile)

### Search & Filtering
- Debounced search by keyword
- Real-time results with RTK Query caching
- Active filter badges with one-click removal

### Article Detail & WebView
- Rich article view with hero image, author, source, date
- **Built-in WebView** for viewing the full article inside the app
  - Mobile: native WebView with navigation controls
  - Web: iframe-based dialog with sandbox
- Add/remove from favorites
- Share article URL

### Biometric Authentication (Mobile)
- **Face ID** (iPhone X+), **Touch ID** (older iPhones), **Fingerprint** (Android)
- Secure passcode fallback when biometrics unavailable
- Auth guard on all routes
- Logout with confirmation dialog

### Favorites
- Add/remove articles with heart button
- **Persistent storage** — localStorage (web) / AsyncStorage (mobile)
- Dedicated Favorites page with article grid

### Push Notifications (Mobile)
- Local notification scheduling
- Platform-specific Android notification channels
- Permission request flow

### File Operations
- **Upload** files from device with progress tracking
- **Download** files from any URL with streaming progress
- Quick Download section with sample test files
- Delete files from list

---

## Prerequisites

| Tool | Required For | Install |
|------|-------------|---------|
| **Node.js** >= 18 | All | [nodejs.org](https://nodejs.org/) |
| **npm** | Dependencies | Comes with Node.js |
| **NewsAPI Key** | Fetching news | [newsapi.org/register](https://newsapi.org/register) (free) |
| **Expo Go** (iOS/Android) | Quick mobile testing | App Store / Google Play |
| **Xcode** (macOS only) | iOS dev build (Face ID) | [developer.apple.com/xcode](https://developer.apple.com/xcode/) |
| **Android Studio** (optional) | Android emulator | [developer.android.com/studio](https://developer.android.com/studio) |

---

## Installation & Setup

### Web Application (Next.js)

```bash
# 1. Navigate to the web directory
cd web

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

Edit `.env.local` and add your NewsAPI key:

```
NEXT_PUBLIC_NEWS_API_KEY=your_api_key_here
```

### Mobile Application (Expo)

```bash
# 1. From the project root
npm install

# 2. Set up environment variables
cp .env.example .env
```

Edit `.env` and add your NewsAPI key:

```
EXPO_PUBLIC_NEWS_API_KEY=your_api_key_here
```

> Get a free API key at [newsapi.org/register](https://newsapi.org/register) (100 requests/day).

---

## Running the Web Application

```bash
cd web

# Development server
npm run dev
```

Opens at `http://localhost:3000`. Features:
- Full news feed with search, filtering, and pagination
- Article detail with iframe WebView
- Favorites management (persisted in localStorage)
- File upload and download with progress

### Production Build

```bash
cd web
npm run build
npm start
```

### Deploy to Vercel

```bash
cd web
npx vercel --prod
```

Set `NEXT_PUBLIC_NEWS_API_KEY` in Vercel project settings → Environment Variables.

---

## Running the Mobile Application

### Option 1: Expo Go (Quickest)

```bash
npx expo start --clear
```

1. Scan QR code with Camera (iOS) or Expo Go app (Android)
2. Phone and computer must be on the same network
3. If "request timeout" — connect Mac to iPhone's Personal Hotspot

**Expo Go limitations:**
- Face ID / Touch ID not available (falls back to device passcode)
- Push notification tokens cannot be registered

### Option 2: iOS Development Build (Full Face ID)

```bash
npx expo prebuild --platform ios --clean
cd ios && LANG=en_US.UTF-8 pod install && cd ..
npx expo run:ios --device
```

### Option 3: Android Development Build

```bash
npx expo prebuild --platform android --clean
npx expo run:android
```

### Option 4: iOS Simulator

```bash
npx expo start --clear
# Press 'i' to open in Simulator
```

**Simulating Face ID:** Simulator menu → Features → Face ID → Enrolled → Matching Face

---

## Biometric Authentication — Behavior by Platform

| Environment | Auth Method | Details |
|-------------|------------|---------|
| Dev Build on iPhone X+ | Face ID | Native Face ID, passcode fallback |
| Dev Build on older iPhone | Touch ID | Native Touch ID, passcode fallback |
| Dev Build on Android | Fingerprint | Native biometric, PIN/pattern fallback |
| Expo Go (iOS) | Device Passcode | Face ID unavailable in sandbox |
| Expo Go (Android) | Device PIN/Pattern | Same sandbox limitation |
| iOS Simulator | Simulated Face ID | Via Simulator menu |
| Web Browser | N/A | Web app does not require authentication |

**Why Face ID doesn't work in Expo Go:**
Apple requires `NSFaceIDUsageDescription` in the app's own `Info.plist`. Expo Go is a generic container that cannot include your app's Face ID permission. A development build generates a standalone app with the correct configuration.

---

## Testing (Mobile)

```bash
# Run all 29 unit tests
npm test

# Coverage report
npx jest --coverage
```

| Suite | Tests | Description |
|-------|-------|-------------|
| auth-slice.test.ts | 7 | Auth state, biometric type, logout |
| favorites-slice.test.ts | 8 | Add, remove, toggle, persist favorites |
| filters-slice.test.ts | 7 | Query, category, date range, sort, reset |
| format-date.test.ts | 4 | Relative and absolute date formatting |
| generate-id.test.ts | 3 | Deterministic article ID generation |

---

## Web Application Architecture (FSD)

```
web/src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (StoreProvider, Header, Toaster)
│   ├── page.tsx                  # Home — news feed
│   ├── article/[id]/page.tsx     # Article detail with WebView dialog
│   ├── favorites/page.tsx        # Favorites page
│   └── files/page.tsx            # File upload/download page
│
├── app-core/                     # FSD App layer
│   ├── store/                    # Redux store (configureStore, typed hooks)
│   └── providers/                # StoreProvider (Redux Provider wrapper)
│
├── entities/                     # Business entities
│   └── article/
│       ├── api/                  # RTK Query endpoints (getTopHeadlines, searchArticles)
│       ├── model/                # Article type re-export
│       └── ui/                   # ArticleCard (grid + compact variants)
│
├── features/                     # User-facing features
│   ├── favorites/                # Redux slice + useFavorites hook (localStorage persistence)
│   ├── search/                   # SearchBar UI + useNewsSearch hook
│   └── file-operations/          # useFileOperations hook (upload, download, progress)
│
├── shared/                       # Shared layer
│   ├── api/                      # RTK Query base API (baseQuery with API key)
│   ├── config/                   # Constants (API URL, categories, pagination)
│   ├── lib/                      # Utilities (formatDate, generateId, useDebounce)
│   └── types/                    # TypeScript interfaces (Article, FileItem, etc.)
│
├── widgets/                      # Composite UI blocks
│   ├── header/                   # Navigation header with active route highlighting
│   └── news-feed/                # Full news feed with search, filters, pagination
│
├── components/ui/                # Shadcn UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── badge.tsx
│   ├── skeleton.tsx
│   ├── dialog.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sonner.tsx (toaster)
│   └── ...
│
└── lib/
    └── utils.ts                  # Shadcn cn() utility
```

---

## Design Decisions

### Feature-Sliced Design (FSD)
Both web and mobile apps use FSD with strict layer boundaries: `shared → entities → features → widgets → app`. Each feature is self-contained with its own model, UI, and API. This matches the microservices architecture and scales for team collaboration.

### Redux Toolkit + RTK Query
RTK Query provides automatic caching, request deduplication, loading/error states, and pagination. Combined with Redux Toolkit, it eliminates boilerplate. The same patterns are used in both web and mobile apps.

### Shared Types & API Logic
Both apps use identical TypeScript interfaces (`Article`, `NewsApiResponse`, `PaginatedRequest`) and the same RTK Query endpoint definitions. This ensures API parity and type safety across platforms.

### Tailwind CSS
Both apps use Tailwind — v4 with Shadcn on web, NativeWind on mobile. The utility-first approach accelerates development while maintaining visual consistency.

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| `request timeout` when scanning QR | Phone and Mac not on same network. Use iPhone Personal Hotspot |
| QR code doesn't open in Expo Go | Press `s` in terminal to switch to Expo Go mode |
| Face ID not prompting | Expected in Expo Go. Use development build (see Option 2) |
| `pod install` encoding error | Prefix: `LANG=en_US.UTF-8 pod install` |
| Port 3000 in use (web) | Kill process: `lsof -ti :3000 \| xargs kill -9` |
| Port 8081 in use (mobile) | Kill process: `lsof -ti :8081 \| xargs kill -9` |
| Images not loading | Check internet; some NewsAPI images may be unavailable |
| Android SDK not found | Install Android Studio and set `ANDROID_HOME` env variable |
