import { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Share } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
        <View className="h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
          <AntDesign name="file-unknown" size={36} color="#CBD5E1" />
        </View>
        <Text className="mt-5 text-lg font-bold text-neutral-800">Article not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-5 rounded-2xl bg-primary-600 px-8 py-3.5"
          style={{
            shadowColor: '#4F46E5',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
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
    } catch {}
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center justify-between px-4 py-2">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 active:bg-neutral-200"
        >
          <AntDesign name="arrow-left" size={18} color="#1E293B" />
        </Pressable>

        <View className="flex-row">
          <Pressable
            onPress={handleToggleFavorite}
            className="mr-2 h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 active:bg-neutral-200"
          >
            <AntDesign
              name="heart"
              size={18}
              color={isFavorite(id ?? '') ? '#EF4444' : '#CBD5E1'}
            />
          </Pressable>
          <Pressable
            onPress={handleShare}
            className="h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 active:bg-neutral-200"
          >
            <Ionicons name="share-outline" size={18} color="#1E293B" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="overflow-hidden">
          <ImageWithFallback uri={article.urlToImage} className="h-60 w-full" />
        </View>

        <View className="px-5 pt-5">
          <View className="flex-row items-center">
            <View className="rounded-full bg-primary-50 px-3 py-1.5">
              <Text className="text-[11px] font-bold uppercase tracking-wider text-primary-600">
                {article.source.name}
              </Text>
            </View>
            <Text className="ml-3 text-[12px] text-neutral-400">
              {formatDate(article.publishedAt)}
            </Text>
          </View>

          <Text className="mt-4 text-[22px] font-extrabold leading-[30px] tracking-tight text-neutral-900">
            {article.title}
          </Text>

          {article.author && (
            <View className="mt-4 flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-100">
                <AntDesign name="user" size={14} color="#4F46E5" />
              </View>
              <View className="ml-3">
                <Text className="text-[13px] font-semibold text-neutral-700">
                  {article.author}
                </Text>
                <Text className="text-[10px] text-neutral-400">Author</Text>
              </View>
            </View>
          )}

          {article.description && (
            <Text className="mt-6 text-[15px] leading-7 text-neutral-600">
              {article.description}
            </Text>
          )}

          {article.content && (
            <Text className="mt-4 text-[15px] leading-7 text-neutral-500">
              {article.content.replace(/\[\+\d+ chars\]/, '')}
            </Text>
          )}

          <View
            className="mt-8 overflow-hidden rounded-2xl"
            style={{
              shadowColor: '#4F46E5',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <LinearGradient
              colors={['#EEF2FF', '#E0E7FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 20 }}
            >
              <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
                  <MaterialCommunityIcons name="web" size={20} color="#FFFFFF" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-[14px] font-bold text-neutral-800">
                    Read Full Article
                  </Text>
                  <Text className="mt-0.5 text-[11px] text-neutral-500">
                    Open in built-in browser
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={handleOpenWebView}
                className="mt-4 flex-row items-center justify-center rounded-xl bg-primary-600 py-3.5 active:bg-primary-700"
                style={{
                  shadowColor: '#4F46E5',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Ionicons name="open-outline" size={16} color="#FFFFFF" />
                <Text className="ml-2 text-[14px] font-semibold text-white">
                  Open in WebView
                </Text>
              </Pressable>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
