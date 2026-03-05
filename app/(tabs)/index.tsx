import { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { setCategory } from '@/features/filter-news/model';
import { loadFavorites } from '@/features/manage-favorites/model';
import { NEWS_CATEGORIES, type NewsCategory } from '@/shared/config/constants';
import { Chip } from '@/shared/ui';
import { NewsList } from '@/widgets/news-list';

export default function NewsScreen() {
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((state) => state.filters.selectedCategory);

  useEffect(() => {
    dispatch(loadFavorites());
  }, []);

  function handleCategoryPress(cat: NewsCategory) {
    dispatch(setCategory(selectedCategory === cat ? null : cat));
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-secondary" edges={['top']}>
      <View className="border-b border-neutral-100 bg-white px-5 pb-4 pt-3">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-neutral-800">Discover</Text>
            <Text className="mt-0.5 text-xs text-neutral-400">
              Stay updated with latest news
            </Text>
          </View>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-50">
            <Ionicons name="globe-outline" size={22} color="#4F46E5" />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          <Chip
            label="All"
            selected={selectedCategory === null}
            onPress={() => dispatch(setCategory(null))}
          />
          {NEWS_CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={selectedCategory === cat}
              onPress={() => handleCategoryPress(cat)}
            />
          ))}
        </ScrollView>
      </View>

      <NewsList category={selectedCategory ?? undefined} />
    </SafeAreaView>
  );
}
