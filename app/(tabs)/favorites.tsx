import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/app-core/store/hooks';
import { FavoritesList } from '@/features/manage-favorites';

export default function FavoritesScreen() {
  const count = useAppSelector((state) => state.favorites.articles.length);

  return (
    <SafeAreaView className="flex-1 bg-neutral-50" edges={['top']}>
      <View className="bg-white px-5 pb-4 pt-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[26px] font-extrabold tracking-tight text-neutral-900">
              Favorites
            </Text>
            <Text className="mt-0.5 text-[13px] text-neutral-400">
              Your saved articles
            </Text>
          </View>
          {count > 0 && (
            <View
              className="rounded-full bg-primary-600 px-3.5 py-1.5"
              style={{
                shadowColor: '#4F46E5',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text className="text-[13px] font-bold text-white">{count}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.04)' }} />
      <FavoritesList />
    </SafeAreaView>
  );
}
