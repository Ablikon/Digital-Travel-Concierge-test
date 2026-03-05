import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '@/shared/types';
import { STORAGE_KEYS } from '@/shared/config/constants';

interface FavoritesState {
  articles: Article[];
  isLoading: boolean;
}

const initialState: FavoritesState = {
  articles: [],
  isLoading: false,
};

export const loadFavorites = createAsyncThunk(
  'favorites/load',
  async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? (JSON.parse(stored) as Article[]) : [];
  }
);

export const persistFavorites = createAsyncThunk(
  'favorites/persist',
  async (articles: Article[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(articles));
    return articles;
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<Article>) {
      const index = state.articles.findIndex((a) => a.id === action.payload.id);
      if (index >= 0) {
        state.articles.splice(index, 1);
      } else {
        state.articles.push(action.payload);
      }
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.articles = state.articles.filter((a) => a.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.articles = action.payload;
        state.isLoading = false;
      })
      .addCase(loadFavorites.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { toggleFavorite, removeFavorite } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
