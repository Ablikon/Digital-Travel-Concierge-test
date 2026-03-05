import { useState, useRef } from 'react';
import { View, Text, Pressable, ActivityIndicator, Share } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import type WebViewType from 'react-native-webview';

export default function WebViewScreen() {
  const { url, title } = useLocalSearchParams<{ url: string; title?: string }>();
  const webviewRef = useRef<WebViewType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url || '');
  const [hasError, setHasError] = useState(false);

  if (!url) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-neutral-500">No URL provided</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 rounded-xl bg-primary-600 px-6 py-3"
        >
          <Text className="font-semibold text-white">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  async function handleShare() {
    try {
      await Share.share({
        title: title || 'Article',
        message: currentUrl,
        url: currentUrl,
      });
    } catch {
      // User cancelled
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Top Bar */}
      <View className="flex-row items-center border-b border-neutral-100 px-2 py-2">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
        >
          <AntDesign name="close" size={20} color="#1E293B" />
        </Pressable>

        <View className="mx-2 flex-1 rounded-lg bg-neutral-50 px-3 py-2">
          <Text className="text-xs text-neutral-400" numberOfLines={1}>
            {currentUrl}
          </Text>
        </View>

        <Pressable
          onPress={handleShare}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
        >
          <Ionicons name="share-outline" size={18} color="#1E293B" />
        </Pressable>
      </View>

      {/* Loading Bar */}
      {isLoading && (
        <View className="h-0.5 w-full bg-neutral-100">
          <View className="h-full w-1/3 rounded-r-full bg-primary-600" />
        </View>
      )}

      {/* WebView */}
      {hasError ? (
        <View className="flex-1 items-center justify-center px-8">
          <AntDesign name="disconnect" size={48} color="#CBD5E1" />
          <Text className="mt-4 text-center text-lg font-bold text-neutral-800">
            Failed to load page
          </Text>
          <Text className="mt-2 text-center text-sm text-neutral-500">
            The page could not be loaded. Check your connection and try again.
          </Text>
          <Pressable
            onPress={() => {
              setHasError(false);
              webviewRef.current?.reload();
            }}
            className="mt-6 flex-row items-center rounded-xl bg-primary-600 px-6 py-3"
          >
            <AntDesign name="reload" size={14} color="#FFFFFF" />
            <Text className="ml-2 text-sm font-semibold text-white">Retry</Text>
          </Pressable>
        </View>
      ) : (
        <WebView
          ref={webviewRef}
          source={{ uri: url }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            setCanGoForward(navState.canGoForward);
            if (navState.url) setCurrentUrl(navState.url);
          }}
          startInLoadingState
          renderLoading={() => (
            <View className="absolute inset-0 items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#4F46E5" />
            </View>
          )}
          allowsBackForwardNavigationGestures
          javaScriptEnabled
          domStorageEnabled
          style={{ flex: 1 }}
        />
      )}

      {/* Bottom Navigation */}
      <View className="flex-row items-center justify-around border-t border-neutral-100 bg-white py-2">
        <Pressable
          onPress={() => webviewRef.current?.goBack()}
          disabled={!canGoBack}
          className={`h-10 w-10 items-center justify-center rounded-full ${
            canGoBack ? 'active:bg-neutral-100' : 'opacity-30'
          }`}
        >
          <AntDesign name="arrow-left" size={20} color="#1E293B" />
        </Pressable>

        <Pressable
          onPress={() => webviewRef.current?.goForward()}
          disabled={!canGoForward}
          className={`h-10 w-10 items-center justify-center rounded-full ${
            canGoForward ? 'active:bg-neutral-100' : 'opacity-30'
          }`}
        >
          <AntDesign name="arrow-right" size={20} color="#1E293B" />
        </Pressable>

        <Pressable
          onPress={() => webviewRef.current?.reload()}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
        >
          <AntDesign name="reload" size={18} color="#1E293B" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
