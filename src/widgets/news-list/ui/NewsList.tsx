import { useCallback, useState, useMemo } from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import { useGetTopHeadlinesQuery } from '@/entities/article';
import { ArticleCard } from '@/entities/article';
import { Spinner, ErrorView, EmptyState } from '@/shared/ui';
import { useToggleFavorite } from '@/features/manage-favorites';
import { navigateToArticle } from '@/shared/lib/navigation';
import type { Article } from '@/shared/types';

interface NewsListProps {
  category?: string;
}

export function NewsList({ category }: NewsListProps) {
  const { favoriteIds, toggle } = useToggleFavorite();
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

  const renderItem = useCallback(
    ({ item, index }: { item: Article; index: number }) => (
      <ArticleCard
        article={item}
        variant={index === 0 ? 'featured' : 'standard'}
        isFavorite={favoriteIds.has(item.id)}
        onPress={() => navigateToArticle(item)}
        onToggleFavorite={() => toggle(item)}
      />
    ),
    [favoriteIds, toggle]
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
