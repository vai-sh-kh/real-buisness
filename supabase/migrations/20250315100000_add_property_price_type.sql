-- Add price_type to properties: 'total' = total amount, 'percent' = per cent
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS price_type TEXT NOT NULL DEFAULT 'total'
  CHECK (price_type IN ('total', 'percent'));
