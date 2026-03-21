This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Supabase setup

1. **Create project:** [supabase.com](https://supabase.com) → New project → note **Project URL** and **Service role key** (Settings → API).
2. **Run schema:** Dashboard → SQL Editor → New query → paste contents of `supabase/schema.sql` → Run.
3. **Env (in `web/.env.local`):**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   # Settings → API → anon public; required server-side for /auth/v1/user (apikey header)
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   MAGIC_SESSION_SECRET=your-secret-at-least-16-chars  # for "View your history" link (signed cookie)
   ADMIN_EMAILS=your@email.com  # comma-separated; these emails can access /admin (via magic cookie or Supabase)
   ```
4. **Install deps:** `npm install` (adds `@supabase/supabase-js`).

**Admin login with Google:** Supabase → Authentication → Providers → Google: enable and add Client ID + Secret from [Google Cloud Console](https://console.cloud.google.com/) (OAuth 2.0 credentials, redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`). Redirect URLs in Supabase must include your app callback, e.g. `https://cmk-preview.vercel.app/auth/callback`. Emails in `ADMIN_EMAILS` get admin access (JWT verified with anon key + optional `profiles.is_admin`).

**When switching to production (cmk.elitegrowth.pro):** Supabase → Authentication → URL Configuration: set Site URL and Redirect URLs to `https://cmk.elitegrowth.pro` and `https://cmk.elitegrowth.pro/auth/callback`. In Vercel Production env set `NEXT_PUBLIC_APP_URL=https://cmk.elitegrowth.pro`.

API route `POST /api/audit-requests` expects `{ email, payload? }` and inserts into `audit_requests`.

**Test (PowerShell, one line, single quotes around JSON):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/audit-requests" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","payload":{"note":"test"}}'
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
