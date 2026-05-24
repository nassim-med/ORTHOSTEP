export interface ProductColor {
  name: string;
  hex?: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  title: string;
  titleFR?: string;
  titleAR?: string;
  description: string;
  descriptionFR?: string;
  descriptionAR?: string;
  price: number;
  oldPrice: number;
  discount: number;
  category: string;
  comfortLevel: string;
  recommendedUse: string;
  stock?: number;
  featured?: boolean;
  badge?: string;
  sizes: number[];
  customSizes?: string[];
  colors: Array<ProductColor | string>;
  images: string[];
  views?: number;
  created_at?: string;
}

export interface DeliveryZone {
  id?: string;
  wilaya: string;
  commune: string;
  price: number;
  days: string;
  enabled: boolean;
}

export interface OrderRecord {
  id: string;
  customer: string;
  phone: string;
  product: string;
  wilaya: string;
  commune: string;
  status: string;
  created_at: string;
}

export interface Review {
  name: string;
  location: string;
  photo: string;
  rating: number;
  text: string;
}

export interface StoreSettings {
  id?: string;
  store_name: string;
  logo?: string;
  whatsapp: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  telegram?: string;
  location?: string;
  description?: string;
  support_email?: string;
  opening_hours?: string;
  updated_at?: string;
}
