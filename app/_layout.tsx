import '../global.css';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StoreProvider } from '@/app-core/providers';
import { ErrorBoundary } from '@/shared/ui';
import { useAppSelector } from '@/app-core/store/hooks';
import { useNotifications } from '@/features/notifications';

SplashScreen.preventAutoHideAsync();

function NotificationInit() {
  useNotifications();
  return null;
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  return <>{children}</>;
}

function RootNavigation() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <NotificationInit />
      <AuthGate>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="article/[id]"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="webview"
            options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
          />
        </Stack>
      </AuthGate>
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <RootNavigation />
      </StoreProvider>
    </ErrorBoundary>
  );
}
