import { View, Text, Pressable } from 'react-native';
import { Link, Stack } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center bg-white px-6">
        <AntDesign name="exclamation-circle" size={64} color="#94A3B8" />
        <Text className="mt-6 text-2xl font-bold text-neutral-800">Page Not Found</Text>
        <Text className="mt-2 text-center text-neutral-500">
          The page you're looking for doesn't exist.
        </Text>
        <Link href="/" asChild>
          <Pressable className="mt-8 rounded-xl bg-primary-600 px-8 py-3.5">
            <Text className="text-base font-semibold text-white">Go Home</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
