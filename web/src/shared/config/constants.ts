export const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
export const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY ?? '';

export const STORAGE_KEYS = {
  FAVORITES: 'digital_travel_favorites',
  AUTH_STATUS: 'digital_travel_auth_status',
} as const;

export const PAGINATION = {
  PAGE_SIZE: 20,
  INITIAL_PAGE: 1,
} as const;

export const NEWS_CATEGORIES = [
  'general',
  'business',
  'technology',
  'science',
  'health',
  'sports',
  'entertainment',
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];
