# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Nexo is a Next.js (App Router) frontend for a middleware that syncs products, per-client pricing, and orders between Tango Gestión (an ERP) and a business's online store. This repo is frontend-only — it has no backend/API routes of its own; all data comes from an external middleware API reached over HTTP (see Architecture below). The project was originally scaffolded by v0.app and is linked to a v0 project (pushes to `main` auto-deploy).

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint
```

There is no test suite configured in this repo.

## Architecture

The codebase has two parallel trees that serve different purposes — don't confuse them:

- `app/`, `components/`, `hooks/`, `lib/` (root-level) — Next.js routes and the shadcn/ui component library (`components/ui/*`) generated via v0/shadcn. `lib/utils.ts` is the shadcn `cn()` helper. Import alias `@/*` maps to repo root (see `tsconfig.json` / `components.json`).
- `src/` — the actual application logic layer: `src/repositories` (HTTP calls), `src/hooks` (React Query hooks wrapping repositories), `src/store` (Zustand), `src/types`, `src/providers`. When adding a new feature that talks to the middleware, this is where it goes.

**Data flow / layering**: `component → src/hooks/use*.ts (TanStack Query) → src/repositories/*Repository.ts → lib/httpClient.ts (axios) → external middleware API`.

- All repositories are plain objects of async functions using the shared `httpClient`; they don't call axios directly.
- All server state (customers, sync status, auth `me`) is read through TanStack Query hooks in `src/hooks`, never fetched ad hoc in components. Mutations invalidate the relevant query key on success.
- `QueryProvider` (`src/providers/QueryProvider.tsx`) wraps the whole app in `app/layout.tsx` and sets global defaults (`retry: 3`, no refetch-on-focus).

**Auth**: JWT-based, stored in `localStorage` under `nexo_token`/`nexo_user` (not cookies — this is a client-side-only guard, not middleware/SSR protected).
- `src/store/authStore.ts` (Zustand) is the source of truth for `user`/`token`/`isAuthenticated` at runtime; `loadFromStorage()` hydrates it from `localStorage` on mount.
- `httpClient` (`lib/httpClient.ts`) attaches the bearer token to every request via an axios request interceptor, and on a `401` response clears storage and hard-redirects to `/login`.
- `app/dashboard/layout.tsx` and `app/login/layout.tsx` are client components that gate on `useAuthStore` + `useAppInit()` (which just triggers `loadFromStorage`) and redirect between `/login` and `/dashboard` accordingly — there's a brief `initialized` guard to avoid a flash of the wrong screen.
- `src/hooks/useAuth.ts` has the actual login/logout/me hooks (`useLogin`, `useLogout`, `useMe`); use these instead of calling `authRepository` directly from components.

**Env vars** (used by `lib/httpClient.ts`):
- `NEXT_PUBLIC_MIDDLEWARE_URL` — base URL of the middleware API
- `NEXT_PUBLIC_API_KEY` — sent as `X-API-Key` on every request

## Conventions

- Path alias `@/*` → repo root everywhere (`@/components`, `@/lib`, `@/src/...`).
- UI text/comments in the codebase are in Spanish (es-AR); match this in UI-facing strings and comments in existing files.
- Styling via Tailwind v4 + shadcn "new-york" style, CSS variables for theming (`app/globals.css`).
