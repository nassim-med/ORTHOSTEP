-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  product VARCHAR(255) NOT NULL,
  wilaya VARCHAR(100) NOT NULL,
  commune VARCHAR(100) NOT NULL,
  address TEXT,
  quantity SMALLINT DEFAULT 1,
  color VARCHAR(50),
  size VARCHAR(50),
  status VARCHAR(50) DEFAULT 'New',
  delivery_price BIGINT DEFAULT 0,
  total_price BIGINT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_wilaya ON public.orders(wilaya);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON public.orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable write access for authenticated users" ON public.orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON public.orders FOR DELETE USING (auth.role() = 'authenticated');
