'use client';

import { NewsFeed } from '@/widgets/news-feed';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Latest News</h1>
        <p className="mt-2 text-muted-foreground">
          Stay updated with the latest stories from around the world.
        </p>
      </div>
      <NewsFeed />
    </div>
  );
}
