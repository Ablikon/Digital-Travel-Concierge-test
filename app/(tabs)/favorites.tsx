import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/app/store/hooks';
import { FavoritesList } from '@/features/manage-favorites';

export default function FavoritesScreen() {
  const count = useAppSelector((state) => state.favorites.articles.length);

  return (
    <SafeAreaView className="flex-1 bg-surface-secondary" edges={['top']}>
      <View className="border-b border-neutral-100 bg-white px-5 pb-3 pt-3">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-neutral-800">Favorites</Text>
            <Text className="mt-0.5 text-xs text-neutral-400">
              Your saved articles
            </Text>
          </View>
          {count > 0 && (
            <View className="rounded-full bg-primary-100 px-3 py-1">
              <Text className="text-sm font-bold text-primary-700">{count}</Text>
            </View>
          )}
        </View>
      </View>
      <FavoritesList />
    </SafeAreaView>
  );
}
