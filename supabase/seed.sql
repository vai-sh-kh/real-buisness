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
