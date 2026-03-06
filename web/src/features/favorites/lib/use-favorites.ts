'use client';

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app-core/store/hooks';
import { hydrateFavorites, toggleFavorite } from '@/features/favorites/model';
import type { Article } from '@/shared/types';

export function useFavorites() {
  const dispatch = useAppDispatch();
  const { articles: favorites, loaded } = useAppSelector((s) => s.favorites);

  useEffect(() => {
    if (!loaded) {
      dispatch(hydrateFavorites());
    }
  }, [dispatch, loaded]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((a) => a.id === id),
    [favorites]
  );

  const toggle = useCallback(
    (article: Article) => dispatch(toggleFavorite(article)),
    [dispatch]
  );

  return { favorites, isFavorite, toggleFavorite: toggle };
}
