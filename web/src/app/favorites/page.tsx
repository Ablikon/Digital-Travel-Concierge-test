'use client';

import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/entities/article/ui';
import { useFavorites } from '@/features/favorites/lib';
import { useAppDispatch } from '@/app-core/store/hooks';
import { removeFavorite } from '@/features/favorites/model';

export default function FavoritesPage() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const dispatch = useAppDispatch();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
          <p className="mt-2 text-muted-foreground">
            {favorites.length
              ? `${favorites.length} saved article${favorites.length > 1 ? 's' : ''}`
              : 'No saved articles yet.'}
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <Heart className="h-10 w-10 text-red-300" />
          </div>
          <h3 className="text-xl font-semibold">No favorites yet</h3>
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            Start adding articles to your favorites by clicking the heart icon on any news card.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((article) => (
            <div key={article.id} className="group relative">
              <ArticleCard
                article={article}
                isFavorite={isFavorite(article.id)}
                onToggleFavorite={toggleFavorite}
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute bottom-4 right-4 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => dispatch(removeFavorite(article.id))}
                aria-label="Remove from favorites"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
