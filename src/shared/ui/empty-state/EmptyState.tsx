import { View, Text, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type AntDesignIconName = React.ComponentProps<typeof AntDesign>['name'];

interface EmptyStateProps {
  icon?: AntDesignIconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
        <AntDesign name={icon} size={36} color="#94A3B8" />
      </View>
      <Text className="text-center text-lg font-bold text-neutral-800">{title}</Text>
      {description && (
        <Text className="mt-2 text-center text-sm leading-5 text-neutral-500">{description}</Text>
      )}
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className="mt-6 rounded-xl bg-primary-600 px-6 py-3 active:bg-primary-700"
        >
          <Text className="text-sm font-semibold text-white">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
