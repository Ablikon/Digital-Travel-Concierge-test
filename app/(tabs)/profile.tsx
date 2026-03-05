import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface-secondary" edges={['top']}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold text-neutral-800">Profile</Text>
        <Text className="mt-2 text-center text-neutral-500">
          Account settings and preferences
        </Text>
      </View>
    </SafeAreaView>
  );
}
