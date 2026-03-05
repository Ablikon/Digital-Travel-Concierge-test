import { View, Text, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

type AntDesignIconName = React.ComponentProps<typeof AntDesign>['name'];

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  rightIcon?: AntDesignIconName;
  onRightPress?: () => void;
  transparent?: boolean;
}

export function ScreenHeader({
  title,
  showBack = false,
  rightIcon,
  onRightPress,
  transparent = false,
}: ScreenHeaderProps) {
  return (
    <View
      className={`flex-row items-center justify-between px-4 py-3 ${
        transparent ? '' : 'border-b border-neutral-100 bg-white'
      }`}
    >
      <View className="w-10">
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
          >
            <AntDesign name="arrow-left" size={22} color="#1E293B" />
          </Pressable>
        )}
      </View>

      <Text className="flex-1 text-center text-lg font-bold text-neutral-800" numberOfLines={1}>
        {title}
      </Text>

      <View className="w-10">
        {rightIcon && onRightPress && (
          <Pressable
            onPress={onRightPress}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
          >
            <AntDesign name={rightIcon} size={22} color="#1E293B" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
