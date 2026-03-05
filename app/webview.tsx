import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WebViewScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold text-neutral-800">WebView</Text>
        <Text className="mt-2 text-neutral-500">URL: {url}</Text>
      </View>
    </SafeAreaView>
  );
}
