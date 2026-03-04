-- ─── Enable UUID extension ─────────────────────────────────────────────────
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

CREATE INDEX IF NOT EXISTS categories_slug_idx    ON public.categories (slug);
CREATE INDEX IF NOT EXISTS categories_active_idx  ON public.categories (is_active);

-- ─── Properties ────────────────────────────────────────────────────────────
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
  parking           BOOLEAN NOT NULL DEFAULT FALSE,
  furnished         TEXT CHECK (furnished IN ('furnished', 'semi-furnished', 'unfurnished')),
  address           TEXT NOT NULL DEFAULT '',
  city              TEXT NOT NULL DEFAULT '',
  state             TEXT NOT NULL DEFAULT '',
  zip_code          TEXT,
  country           TEXT NOT NULL DEFAULT 'India',
  latitude          NUMERIC(10, 7),
  longitude         NUMERIC(10, 7),
  map_embed_url     TEXT,
  cover_image_url   TEXT,
  amenities         TEXT[],
  highlights        TEXT[],
  plot_number       TEXT,
  plot_dimensions   TEXT,
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  views             INTEGER NOT NULL DEFAULT 0,
  meta_title        TEXT,
  meta_description  TEXT,
  meta_keywords     TEXT,
  og_image_url      TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS properties_status_idx    ON public.properties (status);
CREATE INDEX IF NOT EXISTS properties_type_idx      ON public.properties (type);
CREATE INDEX IF NOT EXISTS properties_city_idx      ON public.properties (city);
CREATE INDEX IF NOT EXISTS properties_category_idx  ON public.properties (category_id);
CREATE INDEX IF NOT EXISTS properties_featured_idx  ON public.properties (is_featured);
CREATE INDEX IF NOT EXISTS properties_created_idx   ON public.properties (created_at DESC);

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

CREATE INDEX IF NOT EXISTS leads_status_idx     ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_source_idx     ON public.leads (source);
CREATE INDEX IF NOT EXISTS leads_property_idx   ON public.leads (property_id);
CREATE INDEX IF NOT EXISTS leads_created_idx    ON public.leads (created_at DESC);

-- ─── Row Level Security (allow service role full access) ──────────────────
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads      ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and active properties
CREATE POLICY "public_read_categories"  ON public.categories FOR SELECT USING (true);
CREATE POLICY "public_read_properties"  ON public.properties FOR SELECT USING (true);

-- Service role has full access (bypasses RLS automatically)
-- No additional policies needed for service role

-- Allow public insert into leads (contact form)
CREATE POLICY "public_insert_leads" ON public.leads FOR INSERT WITH CHECK (true);

-- ─── Seed sample data ──────────────────────────────────────────────────────
INSERT INTO public.categories (name, slug, description, icon, is_active) VALUES
  ('Residential', 'residential', 'Houses, apartments and villas for living', '🏠', true),
  ('Commercial', 'commercial', 'Offices, shops and commercial spaces', '🏢', true),
  ('Plots & Land', 'plots-land', 'Plots, agricultural and industrial land', '🌍', true),
  ('Luxury Villas', 'luxury-villas', 'Premium luxury villas and bungalows', '🏰', true),
  ('Apartments', 'apartments', 'Flats and apartment complexes', '🏗️', true)
ON CONFLICT (slug) DO NOTHING;

-- Sample properties (using first category)
WITH cat AS (SELECT id FROM public.categories WHERE slug = 'residential' LIMIT 1)
INSERT INTO public.properties (
  title, slug, short_description, description, type, status, category_id,
  price, area_sqft, bedrooms, bathrooms, address, city, state, country,
  cover_image_url, parking, is_featured, furnished
)
SELECT
  '3BHK Luxury Apartment in Bandra',
  '3bhk-luxury-apartment-bandra',
  'Stunning 3BHK apartment with sea view in the heart of Bandra',
  'A beautifully designed 3 bedroom luxury apartment with panoramic sea views located in the prestigious Bandra West area. The apartment features premium Italian marble flooring, modular kitchen, and 3 attached bathrooms.',
  'sale', 'active', cat.id,
  15000000, 1450, 3, 3,
  'Hill Road, Bandra West', 'Mumbai', 'Maharashtra', 'India',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', true, true, 'furnished'
FROM cat
ON CONFLICT (slug) DO NOTHING;

WITH cat AS (SELECT id FROM public.categories WHERE slug = 'commercial' LIMIT 1)
INSERT INTO public.properties (
  title, slug, short_description, description, type, status, category_id,
  price, area_sqft, bedrooms, bathrooms, address, city, state, country,
  cover_image_url, parking, is_featured
)
SELECT
  'Premium Office Space in BKC',
  'premium-office-bkc',
  'Grade A office space in Mumbai''s prime business district',
  'Fully fitted Grade A office space in BKC with 24/7 security, power backup, and ample parking. Perfect for corporate headquarters.',
  'rent', 'active', cat.id,
  350000, 3200, 0, 4,
  'G Block, Bandra Kurla Complex', 'Mumbai', 'Maharashtra', 'India',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', true, true
FROM cat
ON CONFLICT (slug) DO NOTHING;

WITH cat AS (SELECT id FROM public.categories WHERE slug = 'plots-land' LIMIT 1)
INSERT INTO public.properties (
  title, slug, short_description, description, type, status, category_id,
  price, area_sqft, address, city, state, country,
  cover_image_url, is_featured
)
SELECT
  'Prime Residential Plot in Pune',
  'prime-residential-plot-pune',
  '2400 sqft east-facing residential plot in a gated community',
  'Premium residential plot in a fully developed gated community with all utilities. Surrounded by top-rated schools and hospitals.',
  'sale', 'active', cat.id,
  4800000, 2400,
  'Baner Road, Baner', 'Pune', 'Maharashtra', 'India',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', false
FROM cat
ON CONFLICT (slug) DO NOTHING;

-- Sample leads
INSERT INTO public.leads (name, email, phone, message, source, status, property_title) VALUES
  ('Rahul Sharma', 'rahul.sharma@email.com', '+91 98765 43210', 'I am interested in the Bandra apartment. Please share more details.', 'website', 'new', '3BHK Luxury Apartment in Bandra'),
  ('Priya Patel', 'priya.patel@email.com', '+91 87654 32109', 'Looking for commercial space for my startup. Budget is flexible.', 'meta_ads', 'contacted', 'Premium Office Space in BKC'),
  ('Amit Kumar', null, '+91 76543 21098', 'Plot enquiry for residential construction', 'google_ads', 'qualified', 'Prime Residential Plot in Pune'),
  ('Sneha Gupta', 'sneha.g@email.com', '+91 65432 10987', 'I would like to schedule a site visit for the Bandra property.', 'website', 'new', null),
  ('Vikram Singh', 'vikram.singh@email.com', null, 'Interested in luxury properties in Mumbai', 'manual', 'new', null)
ON CONFLICT DO NOTHING;
