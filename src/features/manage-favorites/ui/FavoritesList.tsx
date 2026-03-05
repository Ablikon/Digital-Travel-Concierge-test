import { useCallback } from 'react';
import { FlatList, View, Text, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArticleCardCompact } from '@/entities/article';
import { EmptyState, Spinner } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { navigateToArticle } from '@/shared/lib/navigation';
import { removeFavorite, persistFavorites } from '../model';
import { useToggleFavorite } from '../lib/use-toggle-favorite';
import type { Article } from '@/shared/types';

export function FavoritesList() {
  const dispatch = useAppDispatch();
  const { articles, isLoading } = useAppSelector((state) => state.favorites);
  const { toggle } = useToggleFavorite();

  const handleRemove = useCallback(
    (article: Article) => {
      Alert.alert(
        'Remove from Favorites',
        `Remove "${article.title}" from your saved articles?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              dispatch(removeFavorite(article.id));
              const updated = articles.filter((a) => a.id !== article.id);
              dispatch(persistFavorites(updated));
            },
          },
        ]
      );
    },
    [articles, dispatch]
  );

  const renderItem = useCallback(
    ({ item }: { item: Article }) => (
      <ArticleCardCompact
        article={item}
        isFavorite
        onPress={() => navigateToArticle(item)}
        onToggleFavorite={() => toggle(item)}
        onRemove={() => handleRemove(item)}
      />
    ),
    [toggle, handleRemove]
  );

  if (isLoading) return <Spinner fullScreen />;

  if (articles.length === 0) {
    return (
      <EmptyState
        icon="heart"
        title="No saved articles"
        description="Articles you mark as favorite will appear here for easy access"
        actionLabel="Browse News"
        onAction={() => router.replace('/(tabs)')}
      />
    );
  }

  return (
    <View className="flex-1">
      <View className="px-5 py-3">
        <Text className="text-xs text-neutral-400">
          {articles.length} {articles.length === 1 ? 'article' : 'articles'} saved
        </Text>
      </View>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
