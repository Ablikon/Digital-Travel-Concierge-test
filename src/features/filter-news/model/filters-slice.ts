import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { NewsCategory } from '@/shared/config/constants';

interface FiltersState {
  searchQuery: string;
  selectedCategory: NewsCategory | null;
  dateFrom: string | null;
  dateTo: string | null;
  sortBy: 'publishedAt' | 'relevancy' | 'popularity';
}

const initialState: FiltersState = {
  searchQuery: '',
  selectedCategory: null,
  dateFrom: null,
  dateTo: null,
  sortBy: 'publishedAt',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setCategory(state, action: PayloadAction<NewsCategory | null>) {
      state.selectedCategory = action.payload;
    },
    setDateRange(state, action: PayloadAction<{ from: string | null; to: string | null }>) {
      state.dateFrom = action.payload.from;
      state.dateTo = action.payload.to;
    },
    setSortBy(state, action: PayloadAction<'publishedAt' | 'relevancy' | 'popularity'>) {
      state.sortBy = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setSearchQuery,
  setCategory,
  setDateRange,
  setSortBy,
  resetFilters,
} = filtersSlice.actions;

export const filtersReducer = filtersSlice.reducer;
