-- Amenities (additional to migration seed)
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
  ('Club House', 'club-house', '🏛️', 10),
  ('Boundary wall', 'boundary-wall', '🧱', 11),
  ('Gated Property', 'gated-property', '🚧', 12),
  ('Car Parking', 'car-parking', '🚗', 13),
  ('Interior', 'interior', '🏠', 14),
  ('Exterior', 'exterior', '🏡', 15),
  ('Patio', 'patio', '☀️', 16),
  ('Furnished', 'furnished', '🛋️', 17),
  ('Water Purifier', 'water-purifier', '💧', 18),
  ('Electronics', 'electronics', '📺', 19),
  ('Home theatre', 'home-theatre', '🎬', 20),
  ('Play area', 'play-area', '🎪', 21),
  ('Swing', 'swing', '🎠', 22),
  ('CCTV', 'cctv', '📹', 23),
  ('Well designed Kitchen', 'well-designed-kitchen', '🍳', 24),
  ('Interlock', 'interlock', '🔲', 25)
ON CONFLICT (slug) DO NOTHING;




-- Admin settings: use the same email as ADMIN_EMAIL in .env.local so login and profile match.
INSERT INTO public.admin_settings (
  email,
  display_name,
  theme,
  language,
  timezone
) VALUES (
  'admin@gmail.com',
  'Admin',
  'system',
  'en',
  'UTC'
)
ON CONFLICT (email) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  updated_at = NOW();
