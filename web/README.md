# Digital Travel — Web Application

Next.js web application for Digital Travel news platform. Built with **App Router**, **Shadcn UI**, **Tailwind CSS v4**, **Redux Toolkit + RTK Query**, and **Feature-Sliced Design** architecture.

## Quick Start

```bash
npm install
cp .env.example .env.local
# Add your NewsAPI key to .env.local
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Tech Stack

- **Next.js 16** — App Router, server components, Turbopack
- **Shadcn UI** — Pre-built accessible components (Card, Dialog, Select, etc.)
- **Tailwind CSS v4** — Utility-first styling
- **Redux Toolkit + RTK Query** — State management and API caching
- **TypeScript** — Full type safety
- **Lucide React** — Icon system
- **Feature-Sliced Design** — Modular architecture

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_NEWS_API_KEY` | NewsAPI key ([get one here](https://newsapi.org/register)) |
