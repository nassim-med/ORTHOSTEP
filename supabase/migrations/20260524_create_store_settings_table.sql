-- Create store_settings table
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name VARCHAR(255) NOT NULL DEFAULT 'ORTHOSTEP',
  logo TEXT,
  whatsapp VARCHAR(255) NOT NULL DEFAULT '+213556800701',
  facebook TEXT,
  instagram TEXT,
  tiktok TEXT,
  telegram TEXT,
  location TEXT,
  description TEXT,
  support_email VARCHAR(255),
  opening_hours TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_settings_updated_at ON public.store_settings(updated_at DESC);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.store_settings FOR SELECT USING (TRUE);
CREATE POLICY "Enable write access for authenticated users" ON public.store_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.store_settings FOR UPDATE USING (auth.role() = 'authenticated');

INSERT INTO public.store_settings (store_name, whatsapp)
SELECT 'ORTHOSTEP', '+213556800701'
WHERE NOT EXISTS (SELECT 1 FROM public.store_settings);
