import { Pressable, View, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { ImageWithFallback } from '@/shared/ui';
import { formatRelativeDate } from '@/shared/lib/utils';
import { shadows } from '@/shared/config/styles';
import type { Article } from '@/shared/types';

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ArticleCard({
  article,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}: ArticleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-4 overflow-hidden rounded-2xl bg-white"
      style={shadows.card}
    >
      <ImageWithFallback uri={article.urlToImage} className="h-48 w-full" />

      <View className="p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="mr-3 flex-1 flex-row items-center">
            <View className="mr-2 rounded-md bg-primary-50 px-2 py-0.5">
              <Text className="text-[10px] font-bold uppercase text-primary-600">
                {article.source.name}
              </Text>
            </View>
            <Text className="text-xs text-neutral-400">
              {formatRelativeDate(article.publishedAt)}
            </Text>
          </View>

          {onToggleFavorite && (
            <Pressable
              onPress={onToggleFavorite}
              hitSlop={12}
              className="h-8 w-8 items-center justify-center rounded-full active:bg-neutral-50"
            >
              <AntDesign
                name="heart"
                size={18}
                color={isFavorite ? '#EF4444' : '#CBD5E1'}
              />
            </Pressable>
          )}
        </View>

        <Text className="text-base font-bold leading-6 text-neutral-800" numberOfLines={2}>
          {article.title}
        </Text>

        {article.description && (
          <Text className="mt-1.5 text-sm leading-5 text-neutral-500" numberOfLines={2}>
            {article.description}
          </Text>
        )}

        {article.author && (
          <View className="mt-3 flex-row items-center">
            <AntDesign name="user" size={12} color="#94A3B8" />
            <Text className="ml-1.5 text-xs text-neutral-400" numberOfLines={1}>
              {article.author}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
