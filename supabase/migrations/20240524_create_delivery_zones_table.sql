-- Create delivery_zones table
CREATE TABLE IF NOT EXISTS public.delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya VARCHAR(100) NOT NULL,
  commune VARCHAR(100) NOT NULL,
  price BIGINT NOT NULL,
  days VARCHAR(50),
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_delivery_zones_wilaya_commune ON public.delivery_zones(wilaya, commune);
CREATE INDEX idx_delivery_zones_enabled ON public.delivery_zones(enabled);

-- Enable RLS
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.delivery_zones FOR SELECT USING (TRUE);
CREATE POLICY "Enable write access for authenticated users" ON public.delivery_zones FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.delivery_zones FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON public.delivery_zones FOR DELETE USING (auth.role() = 'authenticated');
