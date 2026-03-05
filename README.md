# Digital Travel — News Companion App

A cross-platform mobile application built with **React Native (Expo SDK 54)** that delivers curated news articles with rich features including biometric authentication (Face ID / Touch ID), WebView integration, push notifications, and file management. The app runs on **iOS**, **Android**, and **Web** from a single codebase.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81 (Expo SDK 54) |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router v6 (file-based routing) |
| State Management | Redux Toolkit + RTK Query |
| Styling | NativeWind v4 (Tailwind CSS for React Native) |
| Architecture | Feature-Sliced Design (FSD) |
| Icons | @expo/vector-icons (Ionicons, AntDesign, MaterialCommunityIcons) |
| Auth | expo-local-authentication (Face ID / Touch ID / Fingerprint) |
| Storage | @react-native-async-storage/async-storage |
| Notifications | expo-notifications (local scheduling) |
| File I/O | expo-file-system, expo-image-picker, expo-document-picker, expo-sharing |
| WebView | react-native-webview |
| Testing | Jest + ts-jest (29 unit tests) |

---

## Features

### News Feed
- Top headlines from NewsAPI with **infinite scroll** and **pull-to-refresh**
- Category chips: All, General, Business, Technology, Science, Health, Sports, Entertainment
- Sort options: Latest, Relevant, Popular
- Featured article card with gradient overlay
- Compact card list for regular articles

### Search & Filtering
- **Debounced search** (600ms) by keyword
- Real-time results with RTK Query caching
- Category and sort filter persistence via Redux

### Article Detail & WebView
- Rich article view with hero image, author, source, date
- **Built-in WebView** browser for viewing the full article inside the app
- Navigation controls (back/forward/reload), URL bar, share functionality
- No external browser redirect — everything stays in-app

### Biometric Authentication
- **Face ID** (iPhone X+), **Touch ID** (older iPhones), **Fingerprint** (Android)
- Secure passcode fallback when biometrics unavailable
- Auth guard on all routes — unauthenticated users are redirected to login
- Logout with confirmation dialog on the Profile screen

### Favorites
- Add/remove articles from favorites with a heart button
- **Persistent storage** via AsyncStorage — favorites survive app restarts
- Dedicated Favorites tab with article list

### Push Notifications
- Local notification scheduling (e.g. when a file downloads)
- Platform-specific Android notification channels
- Permission request flow

### File Operations
- **Upload** images from Photo Library or documents via file picker
- **Download** files from any URL with progress tracking
- Quick Download section with sample test files
- **Share** downloaded files via native share sheet
- **Delete** files with confirmation

---

## Project Architecture (Feature-Sliced Design)

```
├── app/                        # Expo Router — pages layer
│   ├── _layout.tsx             # Root layout (StoreProvider, AuthGate, StatusBar)
│   ├── (auth)/                 # Auth group
│   │   ├── _layout.tsx         # Auth stack layout
│   │   └── index.tsx           # Login screen (biometric prompt)
│   ├── (tabs)/                 # Main tab navigation
│   │   ├── _layout.tsx         # Tab bar configuration (News, Favorites, Files, Profile)
│   │   ├── index.tsx           # News feed screen
│   │   ├── favorites.tsx       # Favorites screen
│   │   ├── files.tsx           # File operations screen
│   │   └── profile.tsx         # Profile & logout screen
│   ├── article/[id].tsx        # Article detail (dynamic route)
│   └── webview.tsx             # In-app WebView browser (modal)
│
├── src/
│   ├── app-core/               # FSD App layer
│   │   ├── store/              # Redux store configuration & typed hooks
│   │   └── providers/          # StoreProvider (Redux Provider wrapper)
│   │
│   ├── widgets/                # Composite UI blocks
│   │   ├── news-list/          # News feed with FlatList, infinite scroll, refresh
│   │   └── search-results/     # Search results list
│   │
│   ├── features/               # User-facing functionality
│   │   ├── auth/               # Biometric auth hook, login UI, auth Redux slice
│   │   ├── search-news/        # SearchBar, SortOptions components
│   │   ├── filter-news/        # Category & date filters (Redux slice)
│   │   ├── manage-favorites/   # Toggle favorite hook, favorites Redux slice, list UI
│   │   ├── notifications/      # useNotifications hook (push token, scheduling)
│   │   └── file-operations/    # useFileOperations hook (upload, download, share, delete)
│   │
│   ├── entities/               # Business entities
│   │   └── article/            # Article type, RTK Query API, ArticleCard, ArticleCardCompact
│   │
│   └── shared/                 # Shared utilities & UI kit
│       ├── api/                # RTK Query base API configuration
│       ├── config/             # Constants (API URL, keys, categories, pagination)
│       ├── lib/                # Hooks (useDebounce), utils (formatDate, generateId), navigation
│       ├── types/              # TypeScript interfaces (Article, FileItem, etc.)
│       └── ui/                 # Reusable components: Button, Chip, Spinner, ErrorView,
│                               # EmptyState, SearchInput, ScreenHeader, ImageWithFallback
│
└── __tests__/                  # Unit tests (Jest + ts-jest)
    ├── features/               # Redux slice tests (auth, favorites, filters)
    └── shared/                 # Utility tests (formatDate, generateId)
```

---

## Prerequisites

| Tool | Required For | Install |
|------|-------------|---------|
| **Node.js** >= 18 | All platforms | [nodejs.org](https://nodejs.org/) |
| **npm** | Dependency management | Comes with Node.js |
| **Expo Go** (iOS/Android) | Quick testing on physical device | App Store / Google Play |
| **Xcode** (macOS only) | iOS development build (Face ID) | App Store or [developer.apple.com](https://developer.apple.com/xcode/) |
| **Android Studio** (optional) | Android emulator / development build | [developer.android.com](https://developer.android.com/studio) |
| **CocoaPods** (macOS only) | iOS native dependencies | `brew install cocoapods` |
| **NewsAPI Key** | Fetching news data | [newsapi.org/register](https://newsapi.org/register) (free) |

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ablikon/Digital-Travel-Concierge-test.git
cd Digital-Travel-Concierge-test

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

Then open `.env` and paste your NewsAPI key:

```
EXPO_PUBLIC_NEWS_API_KEY=your_api_key_here
```

> You can get a free key at [newsapi.org/register](https://newsapi.org/register) (100 requests/day on the free plan).

---

## Running the App

### Option 1: Expo Go (Quickest — no build required)

**Best for:** Quick preview of all features on a physical device. Works on both iOS and Android.

```bash
npx expo start --clear
```

1. A QR code will appear in the terminal
2. **iOS:** Open the Camera app and scan the QR code — it will open in Expo Go
3. **Android:** Open the Expo Go app and scan the QR code
4. The app will bundle and launch on your device

**Networking requirements:**
- Your phone and computer **must be on the same Wi-Fi network**
- If you get "request timeout", try connecting your Mac to your iPhone's **Personal Hotspot** (Settings → Personal Hotspot → Allow Others to Join). Then restart `npx expo start --clear`
- The terminal will show the local URL (e.g. `exp://192.168.1.5:8081`)

**Expo Go limitations:**
- Face ID / Touch ID is **not available** in Expo Go (Apple does not grant biometric permissions to third-party sandbox apps). The app gracefully falls back to **device passcode** authentication
- Push notification tokens cannot be registered (local notifications still work)
- All other features (news feed, search, WebView, favorites, file upload/download, share) work fully

> **Tip:** If the server starts in "development build" mode (QR code won't work with Expo Go), press `s` in the terminal to switch to Expo Go mode.

---

### Option 2: iOS Development Build (Full Face ID support)

**Best for:** Testing the complete native experience including Face ID on a physical iPhone.

**Requirements:**
- macOS
- Xcode installed (Xcode 17+ for iOS 26 devices, Xcode 16+ for iOS 18 devices)
- CocoaPods (`brew install cocoapods`)
- iPhone connected via USB (or on same Wi-Fi)
- Apple Developer account (free tier works for device testing)

```bash
# 1. Generate the native iOS project
npx expo prebuild --platform ios --clean

# 2. Install CocoaPods dependencies
#    Note: Ruby 4.0+ requires explicit UTF-8 encoding
cd ios && LANG=en_US.UTF-8 pod install && cd ..

# 3a. Build and run on a connected physical device
npx expo run:ios --device

# 3b. Or build and run on the iOS Simulator
npx expo run:ios
```

**What you get with a development build:**
- Full **Face ID / Touch ID** biometric authentication
- Full **push notification** support (remote tokens)
- Native performance without Expo Go sandbox limitations

**Troubleshooting:**
- If `pod install` fails with `Encoding::CompatibilityError`, ensure you prefix with `LANG=en_US.UTF-8`
- First build takes 5-10 minutes (compiling React Native + all native modules from source)
- Subsequent builds are much faster due to Xcode build cache
- If targeting a device with a newer iOS version, ensure your Xcode version supports it

---

### Option 3: Android Development Build

**Best for:** Testing on an Android device or emulator with full native features (fingerprint auth).

**Requirements:**
- Android Studio installed with Android SDK
- `ANDROID_HOME` environment variable set (usually `~/Library/Android/sdk` on macOS)
- Android device connected via USB with USB debugging enabled, or an Android emulator running

```bash
# 1. Generate the native Android project
npx expo prebuild --platform android --clean

# 2a. Build and run on connected device / emulator
npx expo run:android

# 2b. Or specify a device
npx expo run:android --device
```

**What you get:**
- Full **fingerprint / biometric** authentication
- Full **push notification** support
- Native Android adaptive icons and splash screen

**Without Android Studio:**
You can still test on a physical Android device using **Expo Go** from Google Play (see Option 1). All features work except biometric auth will use device PIN/pattern as fallback.

---

### Option 4: Web Browser

**Best for:** Quick desktop preview, no mobile device or emulator required.

```bash
# Start web dev server
npm run web
```

Opens automatically at `http://localhost:8081`. The web version includes:
- Full news feed, search, and filtering
- Article detail view (WebView opens in an iframe)
- Favorites management
- Auto-authentication (biometrics not available on web, user is authenticated automatically)
- File download (upload and native sharing are not available on web)

---

### Option 5: iOS Simulator (no physical device needed)

**Best for:** Quick iOS testing without a physical device. Face ID can be simulated.

```bash
# Start Expo and press 'i' to open iOS Simulator
npx expo start --clear
# Then press: i
```

Or with a development build:

```bash
npx expo prebuild --platform ios --clean
cd ios && LANG=en_US.UTF-8 pod install && cd ..
npx expo run:ios
```

**Simulating Face ID in the Simulator:**
1. In the Simulator menu: **Features → Face ID → Enrolled**
2. When the app prompts for authentication: **Features → Face ID → Matching Face**

---

## Biometric Authentication — Detailed Behavior

The app uses `expo-local-authentication` to provide biometric security. Here is how it behaves across all environments:

| Environment | Auth Method | Details |
|-------------|------------|---------|
| **Dev Build on iPhone X+** | Face ID | Native Face ID prompt, passcode fallback on 3 failed attempts |
| **Dev Build on older iPhone** | Touch ID | Native Touch ID prompt, passcode fallback |
| **Dev Build on Android** | Fingerprint | Native biometric prompt, PIN/pattern fallback |
| **Expo Go (iOS)** | Device Passcode | Face ID unavailable in Expo Go sandbox — falls back to iOS passcode |
| **Expo Go (Android)** | Device PIN/Pattern | Same limitation as iOS Expo Go |
| **iOS Simulator** | Simulated Face ID | Use Simulator menu → Features → Face ID |
| **Web Browser** | Auto-authenticated | No biometric hardware — user is signed in automatically |

**Why Face ID doesn't work in Expo Go:**
Apple requires the `NSFaceIDUsageDescription` key in the app's own `Info.plist` to access Face ID. Expo Go is a generic container app that cannot include your app's specific Face ID permission. A **development build** generates a standalone app with the correct `Info.plist` configuration, enabling Face ID.

The Face ID permission is configured in `app.json`:
```json
["expo-local-authentication", { "faceIDPermission": "Allow Digital Travel to use Face ID for authentication." }]
```

Implementation: `src/features/auth/lib/use-biometric-auth.ts`

---

## API Configuration

The app fetches real news data from [NewsAPI](https://newsapi.org/).

### Setup

1. Register at [newsapi.org/register](https://newsapi.org/register) (free plan: 100 requests/day)
2. Copy your API key
3. Add it to `.env`:

```
EXPO_PUBLIC_NEWS_API_KEY=your_key_here
```

The key is loaded via `process.env.EXPO_PUBLIC_NEWS_API_KEY` and is **never hardcoded** in the source code. The `.env` file is in `.gitignore` and not committed to the repository. A `.env.example` template is provided.

### Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `GET /v2/top-headlines` | Main news feed (by country, category) |
| `GET /v2/everything` | Search results (by keyword, sort order) |

---

## Testing

```bash
# Run all 29 unit tests
npm test

# Run with coverage report
npx jest --coverage

# Run a specific test suite
npx jest __tests__/features/auth-slice.test.ts
```

### What's Tested

| Suite | Tests | Description |
|-------|-------|-------------|
| `auth-slice.test.ts` | 7 | Auth state: loading, authenticated, biometric type, logout |
| `favorites-slice.test.ts` | 8 | Add, remove, toggle, persist, load favorites |
| `filters-slice.test.ts` | 7 | Search query, category, date range, sort, reset |
| `format-date.test.ts` | 4 | Relative dates ("2h ago"), absolute formatting |
| `generate-id.test.ts` | 3 | Deterministic article ID generation from URLs |

---

## Code Quality

```bash
# TypeScript type checking (strict mode)
npm run type-check

# ESLint
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Prettier formatting
npm run format
```

---

## Building for Production

### iOS (via EAS Build)

```bash
npx eas build --platform ios
```

Requires an Apple Developer account ($99/year for App Store distribution).

### Android (via EAS Build)

```bash
npx eas build --platform android
```

Generates an APK or AAB for Google Play distribution.

### Web

```bash
npm run build:web
```

Outputs static files to `dist/` — deploy to any static hosting (Vercel, Netlify, etc.).

---

## Design Decisions

### Why Feature-Sliced Design (FSD)?
FSD enforces strict boundaries between architectural layers (`shared → entities → features → widgets → app`). Each feature is self-contained with its own model, UI, and API. This matches the microservices architecture described in the project requirements and scales well for team collaboration.

### Why Redux Toolkit + RTK Query?
RTK Query provides automatic caching, request deduplication, loading/error states, and pagination support out of the box. Combined with Redux Toolkit, it eliminates boilerplate while maintaining a predictable state container. The news feed infinite scroll pattern benefits directly from RTK Query's cache and pagination capabilities.

### Why NativeWind (Tailwind CSS)?
Tailwind's utility-first approach accelerates UI development while maintaining visual consistency. NativeWind compiles Tailwind classes to React Native StyleSheet objects at build time — zero runtime overhead with familiar DX.

### Why Expo SDK 54?
SDK 54 is fully compatible with the standard **Expo Go** app from the App Store and Google Play, allowing anyone to test the app by simply scanning a QR code. For production features like Face ID, the project includes `expo-dev-client` for building a custom development client.

### Why expo-file-system/legacy?
Expo SDK 54 introduced a new `File`/`Directory`-based filesystem API. The legacy API (`expo-file-system/legacy`) is used for broader compatibility with download progress callbacks and established patterns for file operations in Expo Go.

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| `request timeout` when scanning QR | Phone and Mac not on same network. Use iPhone Personal Hotspot |
| QR code doesn't open in Expo Go | Press `s` in terminal to switch from "development build" to "Expo Go" mode |
| `No "projectId" found` error | Safe to ignore in Expo Go — push token registration requires EAS project ID |
| `pod install` encoding error | Prefix with `LANG=en_US.UTF-8`: `LANG=en_US.UTF-8 pod install` |
| Face ID not prompting | Expected in Expo Go. Use development build for Face ID (see Option 2) |
| `Failed to pick image` | Grant photo library permission when prompted. Restart if needed |
| Port 8081 already in use | Kill existing process: `lsof -ti :8081 \| xargs kill -9` then restart |
| Android SDK not found | Install Android Studio and set `ANDROID_HOME` env variable |
| Images not loading | Check internet connection; some NewsAPI images may be unavailable |
| Web version layout issues | Web uses `react-native-web` — minor visual differences from native are expected |

---

## Deviations from the Tech Stack in the Assignment

The assignment specifies **Next.js** and **Shadcn** as part of the technology stack. These were intentionally replaced with more appropriate alternatives for a cross-platform React Native project. This section explains the reasoning.

### Next.js → Expo Router + Expo Web Export

The assignment requires a **cross-platform mobile application** as the primary deliverable, with a web version for preview. Using Next.js for the web portion would mean maintaining **two separate codebases** (Next.js for web + React Native for mobile) with duplicated business logic, state management, and UI components.

Instead, **Expo Router** provides the same file-based routing paradigm that Next.js is known for, while **Expo's web export** (`npx expo export -p web`) generates a production-ready static web app from the exact same React Native codebase. This approach:

- **Eliminates code duplication** — one codebase serves iOS, Android, and Web
- **Ensures feature parity** — every feature works identically across all platforms
- **Reduces maintenance burden** — bug fixes and features are implemented once
- **Uses the same routing model** — `app/(tabs)/index.tsx` maps to routes the same way Next.js `app/` directory does

In a real production environment where the web app needs SSR, SEO, or server components, Next.js would be the right choice. For this project scope (a mobile-first news app with a web preview), Expo's unified approach is architecturally superior.

### Shadcn → NativeWind + @expo/vector-icons

Shadcn UI is built on top of **Radix UI primitives**, which depend on the browser DOM (`document`, `window`, CSS pseudo-elements, focus management via DOM APIs). These APIs do not exist in React Native's rendering environment — React Native uses native platform views, not HTML elements.

This means Shadcn components **cannot render on iOS or Android**. They would only work on the web, which contradicts the cross-platform requirement.

The replacement stack achieves the same goals:

| Shadcn Feature | Our Replacement | Rationale |
|---|---|---|
| Tailwind-based styling | **NativeWind v4** | Identical Tailwind utility classes, compiled to React Native StyleSheet |
| Pre-built accessible components | **Custom UI kit** (`src/shared/ui/`) | Button, Chip, SearchInput, Spinner, ErrorView, EmptyState — all platform-native |
| Consistent icon system | **@expo/vector-icons** | Ionicons, AntDesign, MaterialCommunityIcons — 5000+ vector icons |
| Design tokens / theming | **tailwind.config.js** | Custom color palette, spacing, typography via Tailwind config |

### Summary

Both deviations are **technical necessities**, not shortcuts. The chosen alternatives (Expo Router, NativeWind, custom UI kit) fulfill the same architectural roles while being compatible with React Native's cross-platform model. All **100% of functional requirements** from the assignment are fully implemented.
