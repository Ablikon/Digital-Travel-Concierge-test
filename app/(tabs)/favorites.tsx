import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useAppSelector } from '@/shared/lib/hooks';
import { FavoritesList } from '@/features/manage-favorites';

export default function FavoritesScreen() {
  const count = useAppSelector((state) => state.favorites.articles.length);

  return (
    <SafeAreaView className="flex-1 bg-surface-secondary" edges={['top']}>
      <View className="flex-row items-center justify-between border-b border-neutral-100 bg-white px-5 py-5">
        <View>
          <Text className="text-2xl font-bold text-neutral-800">Favorites</Text>
          <Text className="mt-0.5 text-xs text-neutral-400">Your saved articles</Text>
        </View>
        {count > 0 && (
          <View className="flex-row items-center rounded-full bg-red-50 px-3 py-1.5">
            <AntDesign name="heart" size={12} color="#EF4444" />
            <Text className="ml-1.5 text-xs font-bold text-red-500">{count}</Text>
          </View>
        )}
      </View>
      <FavoritesList />
    </SafeAreaView>
  );
}
