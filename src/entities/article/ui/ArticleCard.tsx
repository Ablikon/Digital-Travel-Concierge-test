import { Pressable, View, Text, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageWithFallback } from '@/shared/ui';
import { formatRelativeDate } from '@/shared/lib/utils';
import type { Article } from '@/shared/types';

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  variant?: 'featured' | 'standard';
}

function FavoriteButton({
  isFavorite,
  onToggleFavorite,
  size = 16,
  style,
}: {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  size?: number;
  style?: 'overlay' | 'inline';
}) {
  return (
    <Pressable
      onPress={onToggleFavorite}
      hitSlop={12}
      className={
        style === 'overlay'
          ? 'h-9 w-9 items-center justify-center rounded-full bg-black/30'
          : 'h-8 w-8 items-center justify-center rounded-full bg-neutral-50 active:bg-neutral-100'
      }
    >
      <AntDesign
        name="heart"
        size={size}
        color={isFavorite ? '#EF4444' : style === 'overlay' ? '#FFFFFF' : '#CBD5E1'}
      />
    </Pressable>
  );
}

function FeaturedCard({ article, onPress, isFavorite = false, onToggleFavorite }: ArticleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-5 overflow-hidden rounded-3xl bg-neutral-200"
      style={{
        height: 280,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      {article.urlToImage ? (
        <Image
          source={{ uri: article.urlToImage }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      ) : null}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.75)']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '70%',
          justifyContent: 'flex-end',
          padding: 20,
        }}
      >
        <View className="flex-row items-center">
          <View className="rounded-full bg-white/20 px-3 py-1">
            <Text className="text-[10px] font-bold uppercase text-white">
              {article.source.name}
            </Text>
          </View>
          <Text className="ml-2 text-xs text-white/70">
            {formatRelativeDate(article.publishedAt)}
          </Text>
        </View>
        <Text className="mt-2.5 text-lg font-bold leading-6 text-white" numberOfLines={2}>
          {article.title}
        </Text>
      </LinearGradient>
      {onToggleFavorite ? (
        <View style={{ position: 'absolute', top: 16, right: 16 }}>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            style="overlay"
          />
        </View>
      ) : null}
    </Pressable>
  );
}

function StandardCard({ article, onPress, isFavorite = false, onToggleFavorite }: ArticleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-4 overflow-hidden rounded-2xl bg-white"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <View className="h-44 w-full bg-neutral-100">
        <ImageWithFallback uri={article.urlToImage} className="h-44 w-full" />
      </View>
      <View className="p-4">
        <View className="mb-2.5 flex-row items-center justify-between">
          <View className="mr-3 flex-1 flex-row items-center">
            <View className="rounded-full bg-primary-50 px-2.5 py-1">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
                {article.source.name}
              </Text>
            </View>
            <Text className="ml-2.5 text-[11px] text-neutral-400">
              {formatRelativeDate(article.publishedAt)}
            </Text>
          </View>
          {onToggleFavorite ? (
            <FavoriteButton isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} style="inline" />
          ) : null}
        </View>
        <Text className="text-[15px] font-bold leading-[22px] text-neutral-800" numberOfLines={2}>
          {article.title}
        </Text>
        {article.description ? (
          <Text className="mt-2 text-[13px] leading-5 text-neutral-400" numberOfLines={2}>
            {article.description}
          </Text>
        ) : null}
        {article.author ? (
          <View className="mt-3 flex-row items-center border-t border-neutral-50 pt-3">
            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary-100">
              <AntDesign name="user" size={10} color="#4F46E5" />
            </View>
            <Text className="ml-2 text-[11px] font-medium text-neutral-400" numberOfLines={1}>
              {article.author}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export function ArticleCard(props: ArticleCardProps) {
  if (props.variant === 'featured') {
    return <FeaturedCard {...props} />;
  }
  return <StandardCard {...props} />;
}
