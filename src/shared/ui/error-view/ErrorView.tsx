import { View, Text, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}: ErrorViewProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AntDesign name="warning" size={28} color="#EF4444" />
      </View>
      <Text className="text-center text-lg font-bold text-neutral-800">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-neutral-500">{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="mt-6 flex-row items-center rounded-xl bg-primary-600 px-6 py-3 active:bg-primary-700"
        >
          <AntDesign name="reload" size={16} color="#FFFFFF" />
          <Text className="ml-2 text-sm font-semibold text-white">Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}
