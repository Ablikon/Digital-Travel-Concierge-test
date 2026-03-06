import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Article } from '@/shared/types';
import { STORAGE_KEYS } from '@/shared/config/constants';

interface FavoritesState {
  articles: Article[];
  loaded: boolean;
}

function loadFromStorage(): Article[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(articles: Article[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(articles));
  } catch { /* quota exceeded */ }
}

const initialState: FavoritesState = {
  articles: [],
  loaded: false,
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    hydrateFavorites(state) {
      state.articles = loadFromStorage();
      state.loaded = true;
    },
    toggleFavorite(state, action: PayloadAction<Article>) {
      const idx = state.articles.findIndex((a) => a.id === action.payload.id);
      if (idx >= 0) {
        state.articles.splice(idx, 1);
      } else {
        state.articles.unshift(action.payload);
      }
      saveToStorage(state.articles);
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.articles = state.articles.filter((a) => a.id !== action.payload);
      saveToStorage(state.articles);
    },
  },
});

export const { hydrateFavorites, toggleFavorite, removeFavorite } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
