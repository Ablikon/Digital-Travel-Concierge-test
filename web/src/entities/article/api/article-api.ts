import { baseApi } from '@/shared/api';
import type { Article, NewsApiResponse, PaginatedRequest, RawArticle } from '@/shared/types';
import { generateArticleId } from '@/shared/lib';
import { PAGINATION } from '@/shared/config/constants';

function mapRawArticle(raw: RawArticle): Article {
  return {
    id: generateArticleId(raw.url),
    title: raw.title,
    description: raw.description,
    content: raw.content,
    url: raw.url,
    urlToImage: raw.urlToImage,
    publishedAt: raw.publishedAt,
    author: raw.author,
    source: raw.source,
  };
}

function filterValidArticles(articles: RawArticle[]): RawArticle[] {
  return articles.filter(
    (a) => a.title && a.title !== '[Removed]' && a.url
  );
}

export const articleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopHeadlines: builder.query<
      { articles: Article[]; totalResults: number },
      { page?: number; category?: string; country?: string }
    >({
      query: ({ page = 1, category, country = 'us' }) => ({
        url: '/top-headlines',
        params: {
          page,
          pageSize: PAGINATION.PAGE_SIZE,
          country,
          ...(category && { category }),
        },
      }),
      transformResponse: (response: NewsApiResponse) => ({
        articles: filterValidArticles(response.articles).map(mapRawArticle),
        totalResults: response.totalResults,
      }),
      providesTags: ['TopHeadlines'],
    }),

    searchArticles: builder.query<
      { articles: Article[]; totalResults: number },
      PaginatedRequest
    >({
      query: ({ page = 1, pageSize = PAGINATION.PAGE_SIZE, query, category, from, to }) => ({
        url: query ? '/everything' : '/top-headlines',
        params: {
          page,
          pageSize,
          ...(query ? { q: query, sortBy: 'publishedAt' } : { country: 'us' }),
          ...(category && !query && { category }),
          ...(from && { from }),
          ...(to && { to }),
        },
      }),
      transformResponse: (response: NewsApiResponse) => ({
        articles: filterValidArticles(response.articles).map(mapRawArticle),
        totalResults: response.totalResults,
      }),
      providesTags: ['Articles'],
    }),
  }),
});

export const {
  useGetTopHeadlinesQuery,
  useSearchArticlesQuery,
} = articleApi;
