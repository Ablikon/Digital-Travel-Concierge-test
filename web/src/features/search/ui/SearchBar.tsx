'use client';

import { Search, X, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NEWS_CATEGORIES, type NewsCategory } from '@/shared/config/constants';
import { useState } from 'react';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  category: NewsCategory | '';
  onCategoryChange: (c: NewsCategory | '') => void;
  dateFrom: string;
  onDateFromChange: (d: string) => void;
  dateTo: string;
  onDateToChange: (d: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function SearchBar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClear,
  hasActiveFilters,
}: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search news..."
            className="pl-10 pr-10"
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0"
          aria-label="Toggle filters"
        >
          <Filter className="h-4 w-4" />
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="shrink-0">
            Clear all
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/30 p-4">
          <div className="min-w-[180px] flex-1">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Category</label>
            <Select
              value={category || 'all'}
              onValueChange={(v) => onCategoryChange(v === 'all' ? '' : (v as NewsCategory))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {NEWS_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[160px]">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              <Calendar className="mr-1 inline h-3 w-3" />
              From
            </label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
          </div>
          <div className="min-w-[160px]">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              <Calendar className="mr-1 inline h-3 w-3" />
              To
            </label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {query && (
            <Badge variant="secondary" className="gap-1">
              Search: &quot;{query}&quot;
              <button type="button" onClick={() => onQueryChange('')} aria-label="Clear search">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {category && (
            <Badge variant="secondary" className="gap-1">
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <button type="button" onClick={() => onCategoryChange('')} aria-label="Clear category">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {dateFrom && (
            <Badge variant="secondary" className="gap-1">
              From: {dateFrom}
              <button type="button" onClick={() => onDateFromChange('')} aria-label="Clear start date">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {dateTo && (
            <Badge variant="secondary" className="gap-1">
              To: {dateTo}
              <button type="button" onClick={() => onDateToChange('')} aria-label="Clear end date">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
