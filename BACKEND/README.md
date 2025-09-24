# BrgyGo Backend (Supabase)

This directory holds Supabase-related infrastructure for the barangay services platform. The goal is to manage migrations, database policies, edge functions, and automation scripts separate from the Next.js frontend.

## Suggested layout

```
BACKEND/
├── supabase/            # Supabase CLI project directory
│   ├── migrations/      # SQL migration files
│   ├── functions/       # Supabase Edge Functions
│   └── seed.sql         # Seed data for local development
├── scripts/             # Helper scripts (seeding, backups, etc.)
└── README.md            # This document
```

## Getting started

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```
2. Initialize the project inside this folder:
   ```bash
   cd BACKEND
   supabase init
   ```
3. Link to your Supabase project and pull the latest schema:
   ```bash
   supabase link --project-ref your-project-ref
   supabase db pull
   ```
4. During local development, run the Supabase stack alongside the Next.js frontend:
   ```bash
   supabase start
   ```

Once the CLI is initialized, commit the generated configuration files into this directory so infrastructure changes are tracked with the repository.
