-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  titleFR VARCHAR(255),
  titleAR VARCHAR(255),
  description TEXT NOT NULL,
  descriptionFR TEXT,
  descriptionAR TEXT,
  price BIGINT NOT NULL,
  oldPrice BIGINT NOT NULL,
  discount SMALLINT DEFAULT 0,
  category VARCHAR(100) NOT NULL,
  comfortLevel VARCHAR(100),
  recommendedUse TEXT,
  stock SMALLINT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  badge VARCHAR(100),
  sizes INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  customSizes TEXT[] DEFAULT ARRAY[]::TEXT[],
  colors JSONB DEFAULT '[]'::JSONB,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  views BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_featured ON public.products(featured);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.products FOR SELECT USING (TRUE);
CREATE POLICY "Enable write access for authenticated users" ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON public.products FOR DELETE USING (auth.role() = 'authenticated');
