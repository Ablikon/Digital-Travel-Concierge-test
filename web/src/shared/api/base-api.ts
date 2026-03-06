import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NEWS_API_BASE_URL, NEWS_API_KEY } from '@/shared/config/constants';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: NEWS_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('X-Api-Key', NEWS_API_KEY);
      return headers;
    },
  }),
  tagTypes: ['Articles', 'TopHeadlines'],
  endpoints: () => ({}),
});
