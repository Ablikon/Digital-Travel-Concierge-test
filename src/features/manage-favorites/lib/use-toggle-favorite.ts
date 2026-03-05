import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { toggleFavorite, persistFavorites } from '../model/favorites-slice';
import type { Article } from '@/shared/types';

export function useToggleFavorite() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.articles);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((a) => a.id)),
    [favorites]
  );

  const isFavorite = useCallback(
    (articleId: string) => favoriteIds.has(articleId),
    [favoriteIds]
  );

  const toggle = useCallback(
    (article: Article) => {
      const willRemove = favoriteIds.has(article.id);
      dispatch(toggleFavorite(article));

      const updated = willRemove
        ? favorites.filter((a) => a.id !== article.id)
        : [...favorites, article];
      dispatch(persistFavorites(updated));
    },
    [dispatch, favorites, favoriteIds]
  );

  return { favorites, favoriteIds, isFavorite, toggle };
}
