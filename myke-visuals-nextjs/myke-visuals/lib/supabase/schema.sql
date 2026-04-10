-- ============================================================
-- MYKE VISUALS — SUPABASE DATABASE SCHEMA
-- ============================================================
-- [README] Run this entire file in your Supabase SQL Editor.
-- Go to: Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ALBUMS
-- ============================================================
CREATE TABLE albums (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  overview TEXT,
  year INTEGER,
  location TEXT,
  camera TEXT,
  lenses TEXT,
  other_devices TEXT,
  client TEXT,
  category TEXT,
  project_type TEXT,
  button_text TEXT DEFAULT 'View Project',
  button_link TEXT,
  youtube_link TEXT,
  cover_image TEXT,
  images TEXT[] DEFAULT '{}', -- array of image URLs (up to 20)
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  body TEXT, -- markdown content
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reviewer_name TEXT NOT NULL,
  reviewer_title TEXT,
  reviewer_company TEXT,
  avatar_url TEXT,
  body TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ENQUIRIES (Contact form submissions)
-- ============================================================
CREATE TABLE enquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CLIENTS
-- ============================================================
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SESSIONS (Bookings)
-- ============================================================
CREATE TABLE sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  service TEXT NOT NULL,
  date TIMESTAMPTZ,
  location TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UPDATED_AT TRIGGER (auto-update timestamps)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER albums_updated_at BEFORE UPDATE ON albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Albums: public can read published, only admin can write
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published albums" ON albums
  FOR SELECT USING (published = true);
CREATE POLICY "Admin full access to albums" ON albums
  FOR ALL USING (auth.role() = 'authenticated');

-- Blog: public can read published, only admin can write
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published posts" ON blog_posts
  FOR SELECT USING (published = true);
CREATE POLICY "Admin full access to blog" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Reviews: public can read approved, only admin can write
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view approved reviews" ON reviews
  FOR SELECT USING (approved = true);
CREATE POLICY "Admin full access to reviews" ON reviews
  FOR ALL USING (auth.role() = 'authenticated');

-- Enquiries: anyone can insert (contact form), only admin can read
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit enquiry" ON enquiries
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can read enquiries" ON enquiries
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can update enquiries" ON enquiries
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Clients and sessions: admin only
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access to clients" ON clients
  FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access to sessions" ON sessions
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- [README] After running this SQL, also go to:
-- Supabase Dashboard → Storage → Create bucket
-- Create two buckets:
--   1. "images" (public: true) — for all uploaded photos
--   2. "avatars" (public: true) — for reviewer avatars
-- ============================================================
