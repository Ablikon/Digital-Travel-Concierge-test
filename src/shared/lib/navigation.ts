import { router } from 'expo-router';
import type { Article } from '@/shared/types';

export function navigateToArticle(article: Article) {
  router.push({
    pathname: '/article/[id]',
    params: { id: article.id, article: JSON.stringify(article) },
  });
}
