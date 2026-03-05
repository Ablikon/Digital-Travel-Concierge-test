import { Pressable, View, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { ImageWithFallback } from '@/shared/ui';
import { formatRelativeDate } from '@/shared/lib/utils';
import type { Article } from '@/shared/types';

interface ArticleCardCompactProps {
  article: Article;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onRemove?: () => void;
}

export function ArticleCardCompact({
  article,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  onRemove,
}: ArticleCardCompactProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row overflow-hidden rounded-xl bg-white p-3"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <ImageWithFallback uri={article.urlToImage} className="h-24 w-24 rounded-lg" />

      <View className="ml-3 flex-1 justify-between">
        <View>
          <View className="mb-1 flex-row items-center">
            <Text className="text-[10px] font-bold uppercase text-primary-600">
              {article.source.name}
            </Text>
            <Text className="mx-1.5 text-neutral-300">·</Text>
            <Text className="text-[10px] text-neutral-400">
              {formatRelativeDate(article.publishedAt)}
            </Text>
          </View>
          <Text className="text-sm font-bold leading-5 text-neutral-800" numberOfLines={2}>
            {article.title}
          </Text>
        </View>

        <View className="mt-1 flex-row items-center justify-end">
          {onToggleFavorite && (
            <Pressable onPress={onToggleFavorite} hitSlop={8} className="mr-2 p-1">
              <AntDesign
                name="heart"
                size={16}
                color={isFavorite ? '#EF4444' : '#CBD5E1'}
              />
            </Pressable>
          )}
          {onRemove && (
            <Pressable onPress={onRemove} hitSlop={8} className="p-1">
              <AntDesign name="delete" size={16} color="#EF4444" />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}
