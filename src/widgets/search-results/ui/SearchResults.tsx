import { useCallback, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { router } from 'expo-router';
import { useSearchArticlesQuery } from '@/entities/article/api';
import { ArticleCardCompact } from '@/entities/article/ui/ArticleCardCompact';
import { Spinner, ErrorView, EmptyState } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { toggleFavorite, persistFavorites } from '@/features/manage-favorites/model';
import { PAGINATION } from '@/shared/config/constants';
import type { Article } from '@/shared/types';

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.articles);
  const { sortBy, dateFrom, dateTo, selectedCategory } = useAppSelector(
    (state) => state.filters
  );
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<Article[]>([]);

  const { data, isLoading, isFetching, isError, refetch } = useSearchArticlesQuery(
    {
      page,
      pageSize: PAGINATION.PAGE_SIZE,
      query,
      category: selectedCategory ?? undefined,
      from: dateFrom ?? undefined,
      to: dateTo ?? undefined,
    },
    { skip: !query || query.length < 2 }
  );

  const articles = useMemo(() => {
    if (page === 1 && data?.articles) return data.articles;
    if (data?.articles && page > 1) {
      const existing = new Set(accumulated.map((a) => a.id));
      const newItems = data.articles.filter((a) => !existing.has(a.id));
      return [...accumulated, ...newItems];
    }
    return accumulated;
  }, [data, page, accumulated]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((a) => a.id)),
    [favorites]
  );

  function handleToggleFavorite(article: Article) {
    dispatch(toggleFavorite(article));
    const updated = favoriteIds.has(article.id)
      ? favorites.filter((a) => a.id !== article.id)
      : [...favorites, article];
    dispatch(persistFavorites(updated));
  }

  function handleLoadMore() {
    if (!isFetching && data && articles.length < data.totalResults) {
      setAccumulated(articles);
      setPage((p) => p + 1);
    }
  }

  const renderItem = useCallback(
    ({ item }: { item: Article }) => (
      <ArticleCardCompact
        article={item}
        isFavorite={favoriteIds.has(item.id)}
        onPress={() =>
          router.push({
            pathname: '/article/[id]',
            params: { id: item.id, article: JSON.stringify(item) },
          })
        }
        onToggleFavorite={() => handleToggleFavorite(item)}
      />
    ),
    [favoriteIds, favorites]
  );

  if (!query || query.length < 2) {
    return (
      <EmptyState
        icon="search"
        title="Search for news"
        description="Enter at least 2 characters to search articles"
      />
    );
  }

  if (isLoading) return <Spinner fullScreen />;

  if (isError) {
    return (
      <ErrorView
        title="Search failed"
        message="Could not perform search. Please try again."
        onRetry={refetch}
      />
    );
  }

  if (articles.length === 0) {
    return (
      <EmptyState
        icon="file-unknown"
        title="No results"
        description={`No articles found for "${query}"`}
      />
    );
  }

  return (
    <FlatList
      data={articles}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetching && page > 1 ? (
          <View className="py-4">
            <Spinner size="small" />
          </View>
        ) : null
      }
    />
  );
}
