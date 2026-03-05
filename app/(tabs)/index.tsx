import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useDebounce } from '@/shared/lib/hooks';
import { setCategory, setSearchQuery, setSortBy } from '@/features/filter-news';
import { loadFavorites } from '@/features/manage-favorites';
import { NEWS_CATEGORIES, type NewsCategory } from '@/shared/config/constants';
import { Chip, SearchInput } from '@/shared/ui';
import { SortOptions } from '@/features/search-news';
import { NewsList } from '@/widgets/news-list';
import { SearchResults } from '@/widgets/search-results';

export default function NewsScreen() {
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((state) => state.filters.selectedCategory);
  const searchQuery = useAppSelector((state) => state.filters.searchQuery);
  const sortBy = useAppSelector((state) => state.filters.sortBy);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 600);

  useEffect(() => {
    dispatch(loadFavorites());
  }, []);

  function handleCategoryPress(cat: NewsCategory) {
    dispatch(setCategory(selectedCategory === cat ? null : cat));
  }

  function toggleSearch() {
    if (isSearchOpen) {
      dispatch(setSearchQuery(''));
    }
    setIsSearchOpen(!isSearchOpen);
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-secondary" edges={['top']}>
      <View className="border-b border-neutral-100 bg-white">
        <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
          <View>
            <Text className="text-2xl font-bold text-neutral-800">Discover</Text>
            <Text className="mt-0.5 text-xs text-neutral-400">
              Stay updated with latest news
            </Text>
          </View>
          <Pressable
            onPress={toggleSearch}
            className="h-10 w-10 items-center justify-center rounded-full bg-primary-50 active:bg-primary-100"
          >
            <AntDesign
              name={isSearchOpen ? 'close' : 'search'}
              size={20}
              color="#4F46E5"
            />
          </Pressable>
        </View>

        {isSearchOpen && (
          <View className="px-4 pb-3">
            <SearchInput
              value={searchQuery}
              onChangeText={(text) => dispatch(setSearchQuery(text))}
              placeholder="Search news articles..."
              autoFocus
            />
          </View>
        )}

        {isSearchOpen && debouncedQuery.length >= 2 && (
          <SortOptions
            currentSort={sortBy}
            onSortChange={(sort) => dispatch(setSortBy(sort))}
          />
        )}

        {!isSearchOpen && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pb-3"
            contentContainerStyle={{ paddingHorizontal: 16 }}
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
        )}
      </View>

      {isSearchOpen ? (
        <SearchResults query={debouncedQuery} />
      ) : (
        <NewsList category={selectedCategory ?? undefined} />
      )}
    </SafeAreaView>
  );
}
