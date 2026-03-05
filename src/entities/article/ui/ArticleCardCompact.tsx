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
      className="mb-3 flex-row overflow-hidden rounded-2xl bg-white p-3"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <ImageWithFallback
        uri={article.urlToImage}
        style={{ width: 100, height: 100, borderRadius: 12 }}
      />
      <View className="ml-3.5 flex-1 justify-between py-0.5">
        <View>
          <View className="mb-1.5 flex-row items-center">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
              {article.source.name}
            </Text>
            <Text className="mx-1.5 text-neutral-200">{'|'}</Text>
            <Text className="text-[10px] text-neutral-400">
              {formatRelativeDate(article.publishedAt)}
            </Text>
          </View>
          <Text className="text-[13px] font-bold leading-[18px] text-neutral-800" numberOfLines={2}>
            {article.title}
          </Text>
        </View>
        <View className="mt-2 flex-row items-center justify-end">
          {onToggleFavorite ? (
            <Pressable
              onPress={onToggleFavorite}
              hitSlop={8}
              className="mr-1 h-7 w-7 items-center justify-center rounded-full bg-neutral-50"
            >
              <AntDesign
                name="heart"
                size={13}
                color={isFavorite ? '#EF4444' : '#CBD5E1'}
              />
            </Pressable>
          ) : null}
          {onRemove ? (
            <Pressable
              onPress={onRemove}
              hitSlop={8}
              className="h-7 w-7 items-center justify-center rounded-full bg-red-50"
            >
              <AntDesign name="delete" size={13} color="#EF4444" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
