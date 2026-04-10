# Myke Visuals — Next.js 16 Codebase

A full-stack photography portfolio and business platform built with Next.js 16, Supabase, and Resend.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Styling | Tailwind CSS + CSS Variables |
| Animations | Framer Motion |
| Database + Auth | Supabase (PostgreSQL) |
| File Storage | Supabase Storage |
| Email | Resend |
| Booking | Cal.com (embedded) |
| Analytics | Google Analytics 4 |
| Deployment | Vercel |

---

## Project Structure

```
app/
  page.tsx                    Homepage
  about/page.tsx              About page
  studio/page.tsx             Studio page
  albums/
    page.tsx                  Albums index
    [slug]/page.tsx           Individual album
  blog/
    page.tsx                  Blog index
    [slug]/page.tsx           Individual post
  reviews/page.tsx            Reviews page
  contact/page.tsx            Contact page
  admin/
    login/page.tsx            Admin login
    dashboard/page.tsx        Business overview + analytics
    blog/page.tsx             Manage blog posts
    albums/page.tsx           Manage albums
    reviews/page.tsx          Manage reviews
    enquiries/page.tsx        Contact form submissions
  api/
    contact/route.ts          Contact form handler (saves to DB + sends email)
  sitemap.ts                  Auto-generated XML sitemap
  robots.ts                   SEO robots file

components/
  layout/
    Navbar.tsx                Public navigation (desktop + mobile)
    Footer.tsx                Public footer
    PublicLayout.tsx          Wraps all public pages
  sections/                   Homepage section components
    HeroSection.tsx
    StatsSection.tsx
    AboutSection.tsx
    AlbumsSection.tsx
    ServicesSection.tsx
    ExtraServicesSection.tsx
    ReviewsSection.tsx
    BlogSection.tsx
    FAQSection.tsx
  ui/
    PageHero.tsx              Reusable full-viewport page hero
  forms/
    ContactForm.tsx           Contact form with validation (react-hook-form + zod)
  admin/
    AdminSidebar.tsx          Admin navigation sidebar

lib/
  supabase/
    client.ts                 Browser Supabase client
    server.ts                 Server Supabase client + admin client
    schema.sql                Full database schema — run this in Supabase SQL Editor
  queries.ts                  All public data fetching functions

types/
  index.ts                    TypeScript types for the entire app
```

---

## First-Time Setup

### Step 1 — Install dependencies

```bash
npm install
```

### Step 2 — Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in all values. Every variable has a comment
explaining exactly where to find it. Do not commit `.env.local` to git.

### Step 3 — Set up Supabase (database)

1. Create a free project at https://supabase.com
2. Go to **SQL Editor** → **New Query**
3. Paste the entire contents of `lib/supabase/schema.sql` and click **Run**
4. Go to **Storage** → create two buckets:
   - `images` — set **Public** to ON (for album and blog photos)
   - `avatars` — set **Public** to ON (for reviewer profile photos)
5. Go to **Settings** → **API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 4 — Create your admin account

1. In Supabase → **Authentication** → **Users** → **Add User**
2. Enter your email and a strong password
3. This is the only account that can access `/admin`
4. Set `ADMIN_EMAIL` in `.env.local` to match

### Step 5 — Set up Resend (email)

1. Create a free account at https://resend.com
2. Add and verify your sending domain (e.g. `mykevisuals.com`) under **Domains**
3. Go to **API Keys** → **Create API Key** → copy it
4. Set `RESEND_API_KEY` in `.env.local`
5. Set `RESEND_FROM_EMAIL` to a verified sender (e.g. `hello@mykevisuals.com`)
6. Set `RESEND_TO_EMAIL` to where Myke wants to receive enquiry notifications

### Step 6 — Set up Cal.com (booking)

1. Create a free account at https://cal.com
2. Create an event type (e.g. "Photography Session Enquiry")
3. Copy your booking page URL (e.g. `https://cal.com/mykevisuals/session`)
4. Set `NEXT_PUBLIC_CAL_BOOKING_URL` in `.env.local`

### Step 7 — Set up Google Analytics

1. Go to https://analytics.google.com
2. Create a GA4 property for your domain
3. Copy the **Measurement ID** — it starts with `G-`
4. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local`

### Step 8 — Add fonts and images

From your Framer export ZIP, copy:
- `assets/fonts/` → `public/assets/fonts/`
- `assets/images/` → `public/assets/images/`

Key images the codebase references (rename yours to match, or update the src paths):

| File | Used in |
|---|---|
| `hero-bg.jpg` | Homepage hero background |
| `myke-portrait.jpg` | About page portrait |
| `about-hero.jpg` | About page hero |
| `about-1.jpg`, `about-2.jpg` | About page image pair |
| `studio-hero.jpg` | Studio page hero |
| `studio-1.jpg`, `studio-2.jpg`, `studio-3.jpg` | Studio gallery |
| `album-cover-1.jpg` to `album-cover-4.jpg` | Albums fallback covers |
| `service-commercial.jpg` | Services section |
| `service-fashion.jpg` | Services section |
| `service-wedding.jpg` | Services section |
| `service-portrait.jpg` | Services section |
| `studio-hire.jpg` | Extra services section |
| `equipment-rental.jpg` | Extra services + Studio page |
| `content-creation.jpg` | Extra services section |
| `on-location.jpg` | Extra services section |
| `blog-1.jpg`, `blog-2.jpg`, `blog-3.jpg` | Blog section fallbacks |
| `og-image.jpg` | Open Graph / social sharing (1200×630px) |

### Step 9 — Run locally

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

---

## Deploying to Vercel

1. Push your repo to GitHub
2. Go to https://vercel.com/new → import your repo
3. Add **all** environment variables from `.env.local` in Vercel's project settings
4. Change `NEXT_PUBLIC_SITE_URL` to your actual domain (e.g. `https://mykevisuals.com`)
5. Click **Deploy**

Vercel auto-deploys every time you push to `main`.

---

## Managing Content (Admin Dashboard)

### Adding a blog post
1. Go to `/admin` → sign in
2. **Blog Posts** → **+ New Post**
3. Fill in title, body (markdown), cover image URL, tags
4. Toggle **Published** when ready to go live

### Adding an album
1. **Albums** → **+ New Album**
2. Upload images to Supabase Storage (`images` bucket), copy the public URLs
3. Fill in title, overview, client, gear details, paste image URLs
4. Toggle **Published** when ready

### Approving a review
1. **Reviews** → toggle the approval switch on any pending review
2. Only approved reviews appear on the public site

### Viewing enquiries
1. **Enquiries** → all contact form submissions appear here with status tracking
2. New enquiries are also emailed to you via Resend instantly

---

## [README] Placeholders to update before going live

Search the codebase for `[README]` — each one marks something that needs your real data:

| Location | What to update |
|---|---|
| `components/layout/Navbar.tsx` | Replace logo text with actual logo image |
| `components/layout/Footer.tsx` | Confirm Myke's actual email address |
| `app/contact/page.tsx` | Confirm email and WhatsApp link |
| `app/api/contact/route.ts` | Confirm RESEND_FROM_EMAIL and RESEND_TO_EMAIL |
| `next.config.ts` | Add your Supabase project reference ID |
| `app/about/page.tsx` | Replace placeholder awards with Myke's real accolades |
| All image `src` props | Replace placeholder paths with real uploaded images |

---

## What's Not Yet Built (Phase 2)

These items are planned for the next iteration. All database tables and TypeScript types are already in place — only the UI/admin editor components remain:

- Rich text / markdown editor for blog posts in admin
- Drag-and-drop image uploader for album management in admin
- Approve / reject buttons for reviews (API route + UI)
- Full enquiry management — status updates, reply from admin interface
- Clients management page (list, add, edit)
- Bookings management page (calendar view, session tracking)
- Cal.com booking embed on the contact page
- Password reset flow for admin account
