-- Seed data: 10 rows each in categories, properties, amenities, leads (excludes user/auth tables).
-- Run after migrations (e.g. via `supabase db reset`).

-- ─── Categories (10) ────────────────────────────────────────────────────────
INSERT INTO public.categories (id, name, slug, description, is_active, created_at, updated_at) VALUES
  (uuid_generate_v4(), 'Villa', 'villa', 'Luxury villas and standalone homes', true, NOW(), NOW()),
  (uuid_generate_v4(), 'Apartment', 'apartment', 'Apartments and flats', true, NOW(), NOW()),
  (uuid_generate_v4(), 'Penthouse', 'penthouse', 'Premium penthouses', true, NOW(), NOW()),
  (uuid_generate_v4(), 'Studio', 'studio', 'Studio and 1BHK units', true, NOW(), NOW()),
  (uuid_generate_v4(), 'Bungalow', 'bungalow', 'Single-storey bungalows', true, NOW(), NOW()),
  (uuid_generate_v4(), 'Duplex', 'duplex', 'Duplex and triplex units', true, NOW(), NOW()),
  (uuid_generate_v4(), 'Farmhouse', 'farmhouse', 'Farmhouses and country homes', true, NOW(), NOW()),
  (uuid_generate_v4(), 'Plot', 'plot', 'Residential and commercial plots', true, NOW(), NOW()),
  (uuid_generate_v4(), 'Commercial', 'commercial', 'Commercial spaces', true, NOW(), NOW()),
  (uuid_generate_v4(), 'Warehouse', 'warehouse', 'Warehouses and godowns', true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- ─── Properties (10) – reference categories by slug ─────────────────────────
-- cover_image_url is NOT NULL; use placeholder images. is_featured added in later migration.
INSERT INTO public.properties (
  title, slug, description, short_description, type, status, category_id, price, area_sqft, bedrooms, bathrooms,
  address, city, state, country, cover_image_url, is_featured, created_at, updated_at
)
SELECT
  p.title, p.slug, p.description, p.short_description, p.type, p.status, c.id, p.price, p.area_sqft, p.bedrooms, p.bathrooms,
  p.address, p.city, p.state, p.country, p.cover_image_url, p.is_featured, NOW(), NOW()
FROM (VALUES
  ('Skyline Heights Penthouse', 'skyline-heights-penthouse', 'Stunning penthouse with city views.', 'Luxury penthouse', 'sale', 'active', 'penthouse', 125000000, 4200, 4, 5, 'Worli Sea Face', 'Mumbai', 'Maharashtra', 'India', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', true),
  ('Azure Beach Villa', 'azure-beach-villa', 'Beachfront villa with private access.', 'Beach villa', 'sale', 'active', 'villa', 280000000, 8500, 6, 7, 'Juhu Beach', 'Mumbai', 'Maharashtra', 'India', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', true),
  ('Emerald Estate', 'emerald-estate', 'Spacious estate in prime location.', 'Estate home', 'sale', 'active', 'bungalow', 450000000, 6800, 5, 6, 'Malabar Hill', 'Mumbai', 'Maharashtra', 'India', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', true),
  ('Sea-View Serenity', 'sea-view-serenity', 'Modern apartment with sea views.', 'Sea view apt', 'sale', 'active', 'apartment', 182000000, 3100, 3, 4, 'Bandra West', 'Mumbai', 'Maharashtra', 'India', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', true),
  ('Lakeview Luxury Residences', 'lakeview-luxury-residences', 'Luxury living by the lake.', 'Lakeview', 'rent', 'active', 'apartment', 8900000, 2850, 4, 4, 'Powai', 'Mumbai', 'Maharashtra', 'India', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', false),
  ('Victorian Elegance Suite', 'victorian-elegance-suite', 'Heritage-style suite in South Mumbai.', 'Victorian suite', 'sale', 'active', 'penthouse', 224000000, 5400, 5, 5, 'Colaba', 'Mumbai', 'Maharashtra', 'India', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', false),
  ('Garden Duplex', 'garden-duplex', 'Duplex with private garden.', 'Garden duplex', 'sale', 'active', 'duplex', 95000000, 3200, 4, 3, 'Andheri West', 'Mumbai', 'Maharashtra', 'India', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', false),
  ('Sunset Studio', 'sunset-studio', 'Compact studio for professionals.', 'Studio', 'rent', 'active', 'studio', 45000, 450, 1, 1, 'Lower Parel', 'Mumbai', 'Maharashtra', 'India', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', false),
  ('Green Valley Farmhouse', 'green-valley-farmhouse', 'Escape to the countryside.', 'Farmhouse', 'sale', 'active', 'farmhouse', 350000000, 12000, 8, 10, 'Lonavala', 'Pune', 'Maharashtra', 'India', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', true),
  ('Downtown Commercial Hub', 'downtown-commercial-hub', 'Prime commercial space.', 'Commercial', 'sale', 'active', 'commercial', 500000000, 15000, NULL, NULL, 'BKC', 'Mumbai', 'Maharashtra', 'India', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', false)
) AS p(title, slug, description, short_description, type, status, cat_slug, price, area_sqft, bedrooms, bathrooms, address, city, state, country, cover_image_url, is_featured)
JOIN public.categories c ON c.slug = p.cat_slug
ON CONFLICT (title) DO NOTHING;

-- ─── Amenities (10) ────────────────────────────────────────────────────────
INSERT INTO public.amenities (id, name, slug, icon, sort_order, is_active, created_at, updated_at) VALUES
  (uuid_generate_v4(), 'Swimming Pool', 'swimming-pool', 'pool', 1, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Gym', 'gym', 'gym', 2, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Parking', 'parking', 'parking', 3, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Security', 'security', 'security', 4, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Garden', 'garden', 'garden', 5, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Power Backup', 'power-backup', 'power', 6, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Lift', 'lift', 'lift', 7, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Clubhouse', 'clubhouse', 'clubhouse', 8, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Play Area', 'play-area', 'play', 9, true, NOW(), NOW()),
  (uuid_generate_v4(), 'Concierge', 'concierge', 'concierge', 10, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- ─── Leads (10) – optional property_id from first few properties ───────────
INSERT INTO public.leads (name, email, phone, message, source, status, property_id, property_title, created_at, updated_at)
SELECT l.name, l.email, l.phone, l.message, l.source, l.status, p.id, p.title, NOW(), NOW()
FROM (VALUES
  ('Rahul Sharma', 'rahul.s@example.com', '9876543210', 'Interested in Skyline Heights Penthouse.', 'website', 'new', 'skyline-heights-penthouse'),
  ('Priya Mehta', 'priya.m@example.com', '9876543211', 'Would like to schedule a visit for Azure Beach Villa.', 'website', 'contacted', 'azure-beach-villa'),
  ('Amit Patel', 'amit.p@example.com', NULL, 'General inquiry about rental options.', 'website', 'new', NULL),
  ('Sneha Reddy', 'sneha.r@example.com', '9876543213', 'Investment query for Emerald Estate.', 'google_ads', 'qualified', 'emerald-estate'),
  ('Vikram Singh', 'vikram.s@example.com', '9876543214', 'Interested in Sea-View Serenity.', 'website', 'new', 'sea-view-serenity'),
  ('Anita Desai', 'anita.d@example.com', NULL, 'Looking for 2BHK in Bandra.', 'meta_ads', 'new', NULL),
  ('Rajesh Kumar', 'rajesh.k@example.com', '9876543216', 'Want to see Lakeview Luxury Residences.', 'website', 'contacted', 'lakeview-luxury-residences'),
  ('Kavita Nair', 'kavita.n@example.com', '9876543217', 'Inquiry for Victorian Elegance Suite.', 'website', 'new', 'victorian-elegance-suite'),
  ('Sanjay Gupta', 'sanjay.g@example.com', NULL, 'Commercial space for office.', 'manual', 'qualified', 'downtown-commercial-hub'),
  ('Deepa Iyer', 'deepa.i@example.com', '9876543219', 'Farmhouse booking for events.', 'website', 'new', 'green-valley-farmhouse')
) AS l(name, email, phone, message, source, status, prop_slug)
LEFT JOIN public.properties p ON p.slug = l.prop_slug;
