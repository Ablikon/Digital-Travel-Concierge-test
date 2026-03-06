'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Clock, User, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatArticleDate } from '@/shared/lib';
import type { Article } from '@/shared/types';
import { useState } from 'react';

interface ArticleCardProps {
  article: Article;
  isFavorite: boolean;
  onToggleFavorite: (article: Article) => void;
  compact?: boolean;
}

export function ArticleCard({ article, isFavorite, onToggleFavorite, compact }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);

  if (compact) {
    return (
      <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div className="flex gap-4 p-4">
          <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
            {article.urlToImage && !imgError ? (
              <Image
                src={article.urlToImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImgError(true)}
                sizes="128px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <ExternalLink className="h-6 w-6 text-blue-300" />
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <Link href={`/article/${article.id}?url=${encodeURIComponent(article.url)}`}>
                <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground transition-colors hover:text-blue-600">
                  {article.title}
                </h3>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatArticleDate(article.publishedAt)}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onToggleFavorite(article)}
              >
                <Heart
                  className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {article.urlToImage && !imgError ? (
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
            <ExternalLink className="h-12 w-12 text-blue-300" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm dark:bg-black/70">
            {article.source.name}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-black/70 dark:hover:bg-black/90"
          onClick={() => onToggleFavorite(article)}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </Button>
      </div>
      <CardContent className="p-5">
        <Link href={`/article/${article.id}?url=${encodeURIComponent(article.url)}`}>
          <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-foreground transition-colors hover:text-blue-600">
            {article.title}
          </h3>
        </Link>
        {article.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {article.author && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="max-w-[140px] truncate">{article.author}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatArticleDate(article.publishedAt)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
