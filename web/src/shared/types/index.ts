export interface Article {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  author: string | null;
  source: {
    id: string | null;
    name: string;
  };
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: RawArticle[];
}

export interface RawArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface PaginatedRequest {
  page: number;
  pageSize: number;
  query?: string;
  category?: string;
  from?: string;
  to?: string;
}

export interface FileItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  downloadedAt?: string;
  uploadedAt?: string;
}
