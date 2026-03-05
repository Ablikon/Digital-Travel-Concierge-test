import {
  filtersReducer,
  setSearchQuery,
  setCategory,
  setDateRange,
  setSortBy,
  resetFilters,
} from '@/features/filter-news/model/filters-slice';

const initialState = {
  searchQuery: '',
  selectedCategory: null,
  dateFrom: null,
  dateTo: null,
  sortBy: 'publishedAt' as const,
};

describe('filtersSlice', () => {
  it('returns the initial state', () => {
    expect(filtersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('handles setSearchQuery', () => {
    const state = filtersReducer(initialState, setSearchQuery('react native'));
    expect(state.searchQuery).toBe('react native');
  });

  it('handles setCategory', () => {
    const state = filtersReducer(initialState, setCategory('technology'));
    expect(state.selectedCategory).toBe('technology');
  });

  it('handles setCategory with null to clear', () => {
    const withCategory = { ...initialState, selectedCategory: 'technology' as const };
    const state = filtersReducer(withCategory, setCategory(null));
    expect(state.selectedCategory).toBeNull();
  });

  it('handles setDateRange', () => {
    const state = filtersReducer(
      initialState,
      setDateRange({ from: '2026-01-01', to: '2026-03-01' })
    );
    expect(state.dateFrom).toBe('2026-01-01');
    expect(state.dateTo).toBe('2026-03-01');
  });

  it('handles setSortBy', () => {
    const state = filtersReducer(initialState, setSortBy('popularity'));
    expect(state.sortBy).toBe('popularity');
  });

  it('handles resetFilters', () => {
    const modified = {
      searchQuery: 'test',
      selectedCategory: 'science' as const,
      dateFrom: '2026-01-01',
      dateTo: '2026-03-01',
      sortBy: 'popularity' as const,
    };
    const state = filtersReducer(modified, resetFilters());
    expect(state).toEqual(initialState);
  });
});
