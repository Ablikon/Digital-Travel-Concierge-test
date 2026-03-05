import { useCallback, useState, useMemo } from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useGetTopHeadlinesQuery } from '@/entities/article/api';
import { ArticleCard } from '@/entities/article/ui/ArticleCard';
import { Spinner, ErrorView, EmptyState } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { toggleFavorite, persistFavorites } from '@/features/manage-favorites/model';
import type { Article } from '@/shared/types';

interface NewsListProps {
  searchQuery?: string;
  category?: string;
}

export function NewsList({ searchQuery, category }: NewsListProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.articles);
  const [page, setPage] = useState(1);
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  const { data, isLoading, isFetching, isError, refetch } = useGetTopHeadlinesQuery(
    { page, category },
    { refetchOnMountOrArgChange: true }
  );

  const displayArticles = useMemo(() => {
    if (page === 1 && data?.articles) return data.articles;
    if (data?.articles && page > 1) {
      const existing = new Set(allArticles.map((a) => a.id));
      const newItems = data.articles.filter((a) => !existing.has(a.id));
      return [...allArticles, ...newItems];
    }
    return allArticles;
  }, [data, page, allArticles]);

  const hasMore = data ? displayArticles.length < data.totalResults : false;

  const favoriteIds = useMemo(
    () => new Set(favorites.map((a) => a.id)),
    [favorites]
  );

  function handleRefresh() {
    setPage(1);
    setAllArticles([]);
    refetch();
  }

  function handleLoadMore() {
    if (!isFetching && hasMore) {
      setAllArticles(displayArticles);
      setPage((prev) => prev + 1);
    }
  }

  function handleToggleFavorite(article: Article) {
    dispatch(toggleFavorite(article));
    const updated = favoriteIds.has(article.id)
      ? favorites.filter((a) => a.id !== article.id)
      : [...favorites, article];
    dispatch(persistFavorites(updated));
  }

  const renderItem = useCallback(
    ({ item }: { item: Article }) => (
      <ArticleCard
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

  const keyExtractor = useCallback((item: Article) => item.id, []);

  if (isLoading && page === 1) {
    return <Spinner fullScreen />;
  }

  if (isError && displayArticles.length === 0) {
    return (
      <ErrorView
        title="Failed to load news"
        message="Could not fetch articles. Check your connection and try again."
        onRetry={handleRefresh}
      />
    );
  }

  if (!isLoading && displayArticles.length === 0) {
    return (
      <EmptyState
        icon="file-unknown"
        title="No articles found"
        description="There are no articles matching your criteria right now."
        actionLabel="Refresh"
        onAction={handleRefresh}
      />
    );
  }

  return (
    <FlatList
      data={displayArticles}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isFetching && page === 1}
          onRefresh={handleRefresh}
          tintColor="#4F46E5"
          colors={['#4F46E5']}
        />
      }
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
