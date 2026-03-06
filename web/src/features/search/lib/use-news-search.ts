'use client';

import { useState, useCallback } from 'react';
import { useDebounce } from '@/shared/lib';
import type { NewsCategory } from '@/shared/config/constants';

export function useNewsSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<NewsCategory | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const debouncedQuery = useDebounce(query, 400);

  const clearFilters = useCallback(() => {
    setQuery('');
    setCategory('');
    setDateFrom('');
    setDateTo('');
  }, []);

  const hasActiveFilters = Boolean(debouncedQuery || category || dateFrom || dateTo);

  return {
    query,
    setQuery,
    category,
    setCategory,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    debouncedQuery,
    clearFilters,
    hasActiveFilters,
  };
}
