# BrgyGo Frontend

This project is a Next.js + Supabase + shadcn/ui implementation for a digitized barangay services platform. The codebase is located inside `src/` and organized using the Next.js App Router.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set environment variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

The marketing landing page lives at `/`, while portal routes are available under `/user` and `/admin` (redirecting to `/user/dashboard` and `/admin/overview` respectively).

## Tech stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS with shadcn/ui primitives
- Supabase auth helpers (client + server)

## Project structure

Key directories:

- `src/app/(marketing)` – Landing page
- `src/app/(auth)` – Login screen
- `src/app/(portal)/user` – Citizen portal views
- `src/app/(portal)/admin` – Admin/staff portal views
- `src/components` – Shared UI components and layouts
- `src/lib/supabase` – Supabase client helpers

Each portal view currently renders a placeholder with its title so you can scaffold functionality incrementally.
