-- ─── Consolidated schema (single migration) ─────────────────────────────────
-- Run this on a fresh database. Replaces incremental migrations 20250303–20250311.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Categories ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories (slug);
CREATE INDEX IF NOT EXISTS categories_active_idx ON public.categories (is_active);
ALTER TABLE public.categories ADD CONSTRAINT categories_name_unique UNIQUE (name);

-- ─── Properties (no parking, no is_featured; cover_image_url required; gallery_images) ─
CREATE TABLE IF NOT EXISTS public.properties (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  description       TEXT,
  short_description TEXT,
  type              TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
  status            TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'sold', 'rented', 'draft')),
  category_id       UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  price             NUMERIC(15, 2) NOT NULL DEFAULT 0,
  price_label       TEXT,
  area_sqft         NUMERIC(10, 2),
  bedrooms          INTEGER,
  bathrooms         INTEGER,
  floors            INTEGER,
  facing            TEXT,
  age_years         INTEGER,
  furnished         TEXT CHECK (furnished IN ('furnished', 'semi-furnished', 'unfurnished')),
  address           TEXT NOT NULL DEFAULT '',
  city              TEXT NOT NULL DEFAULT '',
  state             TEXT NOT NULL DEFAULT '',
  zip_code          TEXT,
  country           TEXT NOT NULL DEFAULT 'India',
  latitude          NUMERIC(10, 7),
  longitude         NUMERIC(10, 7),
  map_embed_url     TEXT,
  cover_image_url   TEXT NOT NULL,
  gallery_images   TEXT[] DEFAULT '{}',
  amenities         TEXT[],
  highlights        TEXT[],
  plot_number       TEXT,
  plot_dimensions   TEXT,
  views             INTEGER NOT NULL DEFAULT 0,
  meta_title        TEXT,
  meta_description  TEXT,
  meta_keywords     TEXT,
  og_image_url      TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS properties_status_idx ON public.properties (status);
CREATE INDEX IF NOT EXISTS properties_type_idx ON public.properties (type);
CREATE INDEX IF NOT EXISTS properties_city_idx ON public.properties (city);
CREATE INDEX IF NOT EXISTS properties_category_idx ON public.properties (category_id);
CREATE INDEX IF NOT EXISTS properties_created_idx ON public.properties (created_at DESC);
ALTER TABLE public.properties ADD CONSTRAINT properties_title_unique UNIQUE (title);

-- ─── Leads ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  email          TEXT,
  phone          TEXT,
  message        TEXT,
  source         TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'meta_ads', 'google_ads', 'manual')),
  status         TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  property_id    UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  property_title TEXT,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_source_idx ON public.leads (source);
CREATE INDEX IF NOT EXISTS leads_property_idx ON public.leads (property_id);
CREATE INDEX IF NOT EXISTS leads_created_idx ON public.leads (created_at DESC);

-- ─── Amenities ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.amenities (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  icon        TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS amenities_slug_idx ON public.amenities (slug);
CREATE INDEX IF NOT EXISTS amenities_active_idx ON public.amenities (is_active);
CREATE INDEX IF NOT EXISTS amenities_sort_idx ON public.amenities (sort_order);

-- ─── Admin Settings ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email          TEXT NOT NULL UNIQUE,
  display_name   TEXT,
  avatar_url     TEXT,
  phone          TEXT,
  notifications_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  email_notifications     BOOLEAN NOT NULL DEFAULT TRUE,
  lead_alerts             BOOLEAN NOT NULL DEFAULT TRUE,
  browser_notifications   BOOLEAN NOT NULL DEFAULT TRUE,
  theme          TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language       TEXT NOT NULL DEFAULT 'en',
  timezone       TEXT NOT NULL DEFAULT 'UTC',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS admin_settings_email_idx ON public.admin_settings (email);

-- ─── RLS ───────────────────────────────────────────────────────────────────
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "public_read_properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "public_insert_leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_amenities" ON public.amenities FOR SELECT USING (true);

-- ─── Storage bucket (properties images) ────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'properties',
  'properties',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "properties_public_read" ON storage.objects;
CREATE POLICY "properties_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'properties');
DROP POLICY IF EXISTS "properties_service_upload" ON storage.objects;
CREATE POLICY "properties_service_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'properties');
DROP POLICY IF EXISTS "properties_service_update" ON storage.objects;
CREATE POLICY "properties_service_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'properties');
DROP POLICY IF EXISTS "properties_service_delete" ON storage.objects;
CREATE POLICY "properties_service_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'properties');

-- ─── Seed amenities ────────────────────────────────────────────────────────
INSERT INTO public.amenities (name, slug, icon, sort_order) VALUES
  ('Swimming Pool', 'swimming-pool', '🏊', 1),
  ('Gym', 'gym', '🏋️', 2),
  ('Parking', 'parking', '🅿️', 3),
  ('Garden', 'garden', '🌳', 4),
  ('Balcony', 'balcony', '🏠', 5),
  ('Security', 'security', '🔒', 6),
  ('Lift/Elevator', 'lift-elevator', '🛗', 7),
  ('Power Backup', 'power-backup', '⚡', 8),
  ('Water Supply', 'water-supply', '💧', 9),
  ('Club House', 'club-house', '🏛️', 10)
ON CONFLICT (slug) DO NOTHING;
