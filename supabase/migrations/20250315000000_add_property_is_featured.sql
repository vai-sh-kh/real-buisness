-- Add featured flag to properties (for highlighting on listing pages)
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS properties_is_featured_idx ON public.properties (is_featured) WHERE is_featured = TRUE;
