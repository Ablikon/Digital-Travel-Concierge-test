import { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Share } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageWithFallback } from '@/shared/ui';
import { formatDate } from '@/shared/lib/utils';
import { useToggleFavorite } from '@/features/manage-favorites';
import type { Article } from '@/shared/types';

export default function ArticleDetailScreen() {
  const { id, article: articleJson } = useLocalSearchParams<{
    id: string;
    article: string;
  }>();

  const { isFavorite, toggle } = useToggleFavorite();

  const article: Article | null = useMemo(() => {
    try {
      return articleJson ? JSON.parse(articleJson) : null;
    } catch {
      return null;
    }
  }, [articleJson]);

  if (!article) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <AntDesign name="file-unknown" size={48} color="#CBD5E1" />
        <Text className="mt-4 text-lg font-medium text-neutral-500">Article not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 rounded-xl bg-primary-600 px-6 py-3"
        >
          <Text className="font-semibold text-white">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  function handleToggleFavorite() {
    if (!article) return;
    toggle(article);
  }

  function handleOpenWebView() {
    if (!article) return;
    router.push({ pathname: '/webview', params: { url: article.url, title: article.title } });
  }

  async function handleShare() {
    if (!article) return;
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.url}`,
        url: article.url,
      });
    } catch {
      // User cancelled share
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
        >
          <AntDesign name="arrow-left" size={22} color="#1E293B" />
        </Pressable>

        <View className="flex-row">
          <Pressable
            onPress={handleToggleFavorite}
            className="mr-1 h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
          >
            <AntDesign
              name="heart"
              size={20}
              color={isFavorite(id ?? '') ? '#EF4444' : '#CBD5E1'}
            />
          </Pressable>
          <Pressable
            onPress={handleShare}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-neutral-100"
          >
            <Ionicons name="share-outline" size={20} color="#1E293B" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <ImageWithFallback uri={article.urlToImage} className="h-56 w-full" />

        <View className="px-5 pt-5">
          {/* Source & Date */}
          <View className="flex-row items-center">
            <View className="rounded-md bg-primary-50 px-2.5 py-1">
              <Text className="text-xs font-bold text-primary-600">
                {article.source.name}
              </Text>
            </View>
            <Text className="ml-3 text-xs text-neutral-400">
              {formatDate(article.publishedAt)}
            </Text>
          </View>

          {/* Title */}
          <Text className="mt-4 text-2xl font-bold leading-8 text-neutral-900">
            {article.title}
          </Text>

          {/* Author */}
          {article.author && (
            <View className="mt-3 flex-row items-center">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                <AntDesign name="user" size={14} color="#4F46E5" />
              </View>
              <View className="ml-2.5">
                <Text className="text-sm font-medium text-neutral-700">{article.author}</Text>
                <Text className="text-[10px] text-neutral-400">Author</Text>
              </View>
            </View>
          )}

          {/* Description */}
          {article.description && (
            <Text className="mt-5 text-base leading-7 text-neutral-600">
              {article.description}
            </Text>
          )}

          {/* Content */}
          {article.content && (
            <Text className="mt-4 text-base leading-7 text-neutral-600">
              {article.content.replace(/\[\+\d+ chars\]/, '')}
            </Text>
          )}

          {/* Read Full Article CTA */}
          <View className="mt-8 rounded-2xl bg-neutral-50 p-5">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="web" size={24} color="#4F46E5" />
              <View className="ml-3 flex-1">
                <Text className="text-sm font-bold text-neutral-800">Read Full Article</Text>
                <Text className="mt-0.5 text-xs text-neutral-400">
                  Open in built-in browser
                </Text>
              </View>
            </View>
            <Pressable
              onPress={handleOpenWebView}
              className="mt-4 flex-row items-center justify-center rounded-xl bg-primary-600 py-3 active:bg-primary-700"
            >
              <Ionicons name="open-outline" size={16} color="#FFFFFF" />
              <Text className="ml-2 text-sm font-semibold text-white">
                Open in WebView
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
