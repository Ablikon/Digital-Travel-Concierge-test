'use client';

import { useState, useCallback, useMemo } from 'react';
import { Loader2, AlertCircle, RefreshCw, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchArticlesQuery } from '@/entities/article/api';
import { ArticleCard } from '@/entities/article/ui';
import { SearchBar } from '@/features/search/ui';
import { useFavorites } from '@/features/favorites/lib';
import { useNewsSearch } from '@/features/search/lib';
import { PAGINATION } from '@/shared/config/constants';
import { cn } from '@/lib/utils';

export function NewsFeed() {
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const search = useNewsSearch();
  const { isFavorite, toggleFavorite } = useFavorites();

  const queryArgs = useMemo(
    () => ({
      page,
      pageSize: PAGINATION.PAGE_SIZE,
      query: search.debouncedQuery || undefined,
      category: search.category || undefined,
      from: search.dateFrom || undefined,
      to: search.dateTo || undefined,
    }),
    [page, search.debouncedQuery, search.category, search.dateFrom, search.dateTo]
  );

  const { data, isLoading, isFetching, error, refetch } = useSearchArticlesQuery(queryArgs);

  const totalPages = data ? Math.ceil(data.totalResults / PAGINATION.PAGE_SIZE) : 0;

  const handleClearAndReset = useCallback(() => {
    search.clearFilters();
    setPage(1);
  }, [search.clearFilters]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Failed to load news</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            There was a problem fetching the latest articles.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <SearchBar
            query={search.query}
            onQueryChange={(q) => { search.setQuery(q); setPage(1); }}
            category={search.category}
            onCategoryChange={(c) => { search.setCategory(c); setPage(1); }}
            dateFrom={search.dateFrom}
            onDateFromChange={(d) => { search.setDateFrom(d); setPage(1); }}
            dateTo={search.dateTo}
            onDateToChange={(d) => { search.setDateTo(d); setPage(1); }}
            onClear={handleClearAndReset}
            hasActiveFilters={search.hasActiveFilters}
          />
        </div>
        <div className="flex gap-1 rounded-lg border p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            className={cn('h-8 w-8', viewMode === 'grid' && 'bg-blue-600 text-white hover:bg-blue-700')}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            className={cn('h-8 w-8', viewMode === 'list' && 'bg-blue-600 text-white hover:bg-blue-700')}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className={viewMode === 'grid'
          ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
          : 'space-y-4'
        }>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className={viewMode === 'grid' ? 'aspect-video w-full rounded-xl' : 'h-24 w-full rounded-xl'} />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {data && data.articles.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {data.totalResults.toLocaleString()} articles found
                </p>
                {isFetching && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </div>
                )}
              </div>

              <div className={viewMode === 'grid'
                ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
              }>
                {data.articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    isFavorite={isFavorite(article.id)}
                    onToggleFavorite={toggleFavorite}
                    compact={viewMode === 'list'}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="px-4 text-sm text-muted-foreground">
                    Page {page} of {Math.min(totalPages, 5)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= Math.min(totalPages, 5)}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No articles found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
              {search.hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={handleClearAndReset}>
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
