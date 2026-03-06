'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Heart,
  ExternalLink,
  Clock,
  User,
  Share2,
  Globe,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSearchArticlesQuery } from '@/entities/article/api';
import { useFavorites } from '@/features/favorites/lib';
import { formatFullDate } from '@/shared/lib';

export default function ArticleDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const articleUrl = searchParams.get('url') || '';
  const [showWebView, setShowWebView] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const { data } = useSearchArticlesQuery({ page: 1, pageSize: 20 });

  const article =
    data?.articles.find((a) => a.id === params.id) ||
    favorites.find((a) => a.id === params.id);

  if (!article) {
    if (articleUrl) {
      return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Card>
            <CardContent className="p-0">
              <iframe
                src={articleUrl}
                title="Article"
                className="h-[80vh] w-full rounded-lg"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Article not found</h2>
        <p className="mt-2 text-muted-foreground">
          This article may no longer be available or the link is invalid.
        </p>
        <Button onClick={() => router.push('/')} className="mt-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to news
        </Button>
      </div>
    );
  }

  const favorite = isFavorite(article.id);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(article.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be unavailable in insecure context */
    }
  };

  return (
    <>
      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{article.source.name}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {formatFullDate(article.publishedAt)}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {article.title}
            </h1>

            {article.author && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                {article.author}
              </p>
            )}
          </div>

          {article.urlToImage && !imgError && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
              <Image
                src={article.urlToImage}
                alt={article.title}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
                priority
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              variant={favorite ? 'default' : 'outline'}
              onClick={() => toggleFavorite(article)}
              className={favorite ? 'gap-2 bg-blue-600 hover:bg-blue-700' : 'gap-2'}
            >
              <Heart className={`h-4 w-4 ${favorite ? 'fill-white' : ''}`} />
              {favorite ? 'In Favorites' : 'Add to Favorites'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowWebView(true)}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              Open Full Article
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(article.url, '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Browser
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              aria-label="Copy article link"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
            </Button>
          </div>

          <Separator />

          <Card>
            <CardContent className="p-6 sm:p-8">
              {article.description && (
                <p className="mb-6 text-lg font-medium leading-relaxed text-foreground">
                  {article.description}
                </p>
              )}
              {article.content ? (
                <div className="prose prose-neutral max-w-none dark:prose-invert">
                  <p className="leading-relaxed text-muted-foreground">{article.content}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Full content is only available on the original website. Click
                  &quot;Open Full Article&quot; to read the complete story in WebView.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </article>

      <Dialog open={showWebView} onOpenChange={setShowWebView}>
        <DialogContent className="h-[90vh] max-w-6xl p-0">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="flex items-center gap-2 truncate text-base">
              <Globe className="h-4 w-4 shrink-0" />
              <span className="truncate">{article.title}</span>
            </DialogTitle>
          </DialogHeader>
          <iframe
            src={article.url}
            title={article.title}
            className="h-full w-full flex-1"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
