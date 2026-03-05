import {
  favoritesReducer,
  toggleFavorite,
  removeFavorite,
} from '@/features/manage-favorites/model/favorites-slice';
import type { Article } from '@/shared/types';

const mockArticle: Article = {
  id: 'test-123',
  title: 'Test Article',
  description: 'A test article description',
  content: 'Full content here',
  url: 'https://example.com/test',
  urlToImage: 'https://example.com/image.jpg',
  publishedAt: '2026-03-05T10:00:00Z',
  author: 'Test Author',
  source: { id: 'test', name: 'Test Source' },
};

const initialState = {
  articles: [],
  isLoading: false,
};

describe('favoritesSlice', () => {
  it('returns the initial state', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('adds an article to favorites with toggleFavorite', () => {
    const state = favoritesReducer(initialState, toggleFavorite(mockArticle));
    expect(state.articles).toHaveLength(1);
    expect(state.articles[0].id).toBe('test-123');
  });

  it('removes an article from favorites with toggleFavorite', () => {
    const withFavorite = { ...initialState, articles: [mockArticle] };
    const state = favoritesReducer(withFavorite, toggleFavorite(mockArticle));
    expect(state.articles).toHaveLength(0);
  });

  it('removes a specific article with removeFavorite', () => {
    const secondArticle = { ...mockArticle, id: 'test-456', title: 'Second Article' };
    const withTwo = { ...initialState, articles: [mockArticle, secondArticle] };
    const state = favoritesReducer(withTwo, removeFavorite('test-123'));
    expect(state.articles).toHaveLength(1);
    expect(state.articles[0].id).toBe('test-456');
  });
});
