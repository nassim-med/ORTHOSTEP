# ORTHOSTEP Landing Page & Admin Panel

Premium orthopedic shoes and insoles e-commerce platform built with Next.js, Tailwind CSS, Framer Motion, and Supabase. Includes admin panel for managing products, orders, and delivery zones across 58 Algerian wilayas.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free at [supabase.com](https://supabase.com))
- Git

### Step 1: Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name:** ORTHOSTEP (or your preference)
   - **Password:** Create a strong password
   - **Region:** Choose closest to your location
4. Click **Create new project**
5. Wait for initialization (2-3 minutes)

### Step 2: Create Storage Bucket for Product Images

1. In Supabase dashboard, go to **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Name it: `product-images`
4. **Uncheck** "Private bucket" (make it public for image URLs)
5. Click **Create**

### Step 3: Set Up Environment Variables

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role** key (your `SUPABASE_SERVICE_ROLE_KEY`)

3. Create `.env.local` file in project root:

```env
# Supabase Public (used in browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Private (server-side only, in API routes)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 4: Run Database Migrations

1. Go to Supabase dashboard → **SQL Editor**
2. Click **New Query**
3. Copy-paste content from `supabase/migrations/20240524_create_products_table.sql`
4. Click **Run**
5. Repeat for:
   - `supabase/migrations/20240524_create_orders_table.sql`
   - `supabase/migrations/20240524_create_delivery_zones_table.sql`

Or use SQL Editor to manually create tables with the schemas below.

### Step 5: Set Up Authentication (Admin Login)

1. In Supabase dashboard → **Authentication** → **Users**
2. Click **Invite** (top right)
3. Enter your admin email
4. Copy the invite link
5. Open it in browser and set password
6. You now have admin credentials for `/admin/login`

### Step 6: Install Dependencies

```bash
npm install
```

### Step 7: Seed Database (Optional but Recommended)

To populate initial products and delivery zones:

```bash
# Set environment variables
export SUPABASE_URL="your-url"
export SUPABASE_SERVICE_ROLE_KEY="your-key"

# Run seed script
npx ts-node scripts/seed.ts
```

**Note:** You may need to install ts-node first:
```bash
npm install -D ts-node @types/node
```

### Step 8: Start Development Server

```bash
npm run dev
```

Open your running site in the browser.

### Step 9: Access Admin Panel

1. Navigate to `/admin/login` on your deployed domain
2. Use the email and password you set in Step 5
3. Manage products, orders, and delivery zones

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home page (server component)
│   ├── globals.css             # Tailwind & global styles
│   ├── api/
│   │   └── admin/
│   │       ├── products/       # Product CRUD routes
│   │       ├── orders/         # Order management routes
│   │       ├── delivery/       # Delivery zones routes
│   │       └── stats/          # Dashboard stats route
│   └── admin/
│       ├── login/              # Admin login page
│       ├── dashboard/          # Admin dashboard
│       ├── products/           # Product management
│       ├── orders/             # Order management
│       └── delivery/           # Delivery zone management
├── components/
│   ├── BenefitCard.tsx         # Animated benefit card (client)
│   ├── ProductShowcase.tsx     # Featured products grid (client)
│   ├── ProductModal.tsx        # Product detail modal (client)
│   ├── FloatingWhatsApp.tsx    # Floating WhatsApp button (client)
│   ├── StickyBar.tsx           # Mobile sticky bar (client)
│   ├── Footer.tsx              # Footer component
│   └── admin/
│       ├── AdminShell.tsx      # Admin layout wrapper (client)
│       ├── ProductManager.tsx  # Product CRUD UI (client)
│       ├── OrderManager.tsx    # Order management UI (client)
│       ├── DeliveryManager.tsx # Delivery zones UI (client)
│       └── StatCard.tsx        # Stat display card
├── lib/
│   ├── supabase-browser.ts     # Client-side Supabase
│   ├── supabase-server.ts      # Server-side Supabase
│   └── i18n.ts                 # Translations (FR/AR)
├── types/
│   └── product.ts              # TypeScript interfaces
├── data/
│   ├── products.json           # Sample products
│   ├── orders.json             # Sample orders
│   ├── algeria-delivery.json   # All 58 wilayas + communes
│   └── reviews.json            # Customer reviews
├── supabase/
│   └── migrations/             # SQL migrations
├── scripts/
│   └── seed.ts                 # Database seed script
├── public/                     # Static assets
└── package.json
```

---

## 🗄️ Database Schema

### `products` Table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  title VARCHAR,              -- Product name (English)
  titleFR VARCHAR,            -- Product name (French)
  titleAR VARCHAR,            -- Product name (Arabic)
  description TEXT,           -- Description (English)
  descriptionFR TEXT,         -- Description (French)
  descriptionAR TEXT,         -- Description (Arabic)
  price BIGINT,               -- Current price in DZD
  oldPrice BIGINT,            -- Original price (for discount display)
  discount SMALLINT,          -- Discount percentage (0-100)
  category VARCHAR,           -- Product category
  comfortLevel VARCHAR,       -- e.g., "Support élevé"
  recommendedUse TEXT,        -- Recommended usage
  stock SMALLINT,             -- Available quantity
  featured BOOLEAN,           -- Show on homepage
  badge VARCHAR,              -- Special badge label
  sizes INTEGER[],            -- Available sizes
  customSizes TEXT[],         -- Custom size descriptions
  colors JSONB,               -- Array of color objects
  images TEXT[],              -- Image URLs
  views BIGINT,               -- View count for analytics
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### `orders` Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  customer VARCHAR,           -- Customer name
  phone VARCHAR,              -- Phone number
  product VARCHAR,            -- Product ordered
  wilaya VARCHAR,             -- Delivery wilaya
  commune VARCHAR,            -- Delivery commune
  address TEXT,               -- Delivery address
  quantity SMALLINT,          -- Order quantity
  color VARCHAR,              -- Selected color
  size VARCHAR,               -- Selected size
  status VARCHAR,             -- New/Confirmed/Shipped/Delivered/Cancelled
  delivery_price BIGINT,      -- Delivery cost
  total_price BIGINT,         -- Total including delivery
  notes TEXT,                 -- Admin notes
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### `delivery_zones` Table

```sql
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY,
  wilaya VARCHAR,             -- Wilaya name (e.g., "Alger")
  commune VARCHAR,            -- Commune name
  price BIGINT,               -- Delivery price in DZD
  days VARCHAR,               -- Delivery timeframe (e.g., "1-2 days")
  enabled BOOLEAN,            -- Zone active/inactive
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 🛒 How Products Work

1. **Product Management:** Admins create/edit products via `/admin/products`
2. **Images:** Uploaded to Supabase Storage (bucket: `product-images`)
3. **Homepage:** Shows 8 featured products with animations
4. **Product Modal:** Click "Voir détails" to see full product with order form
5. **WhatsApp Integration:** Pre-fills order details with customer info

**Product JSON Structure:**
```json
{
  "id": "unique-id",
  "title": "Orthopedic Walking Shoes",
  "price": 12990,
  "oldPrice": 15990,
  "discount": 19,
  "sizes": [38, 39, 40, 41, 42, 43],
  "colors": ["Beige", "Blanc", "Vert"],
  "images": ["url1", "url2", "url3"],
  "comfortLevel": "Support élevé",
  "recommendedUse": "Marche quotidienne"
}
```

---

## 📦 How Delivery Zones Work

The project includes all 58 Algerian wilayas with communes in `data/algeria-delivery.json`:

```json
[
  {
    "id": "...",
    "wilaya": "Alger",
    "commune": "Alger Centre",
    "price": 500,
    "days": "1-2 days",
    "enabled": true
  }
]
```

**Admin can:**
- Add new delivery zones
- Set delivery price per zone
- Enable/disable zones
- Update delivery timeframes

**Customers:**
- Select wilaya and commune during checkout
- See delivery price calculated automatically
- Receive WhatsApp message with total including delivery

---

## 🌍 Algeria Wilayas Data

The `data/algeria-delivery.json` contains:
- All 58 official wilayas of Algeria
- Major communes for each wilaya
- Delivery prices and timeframes
- Enabled/disabled status

Use this as reference for adding more communes per wilaya.

---

## 🔐 Authentication & Permissions

### Admin Access
- Login at `/admin/login`
- Uses Supabase Auth with email/password
- Session persists in localStorage (browser-side only)

### Permissions (via Row Level Security)
- **Products:** Anyone can read; authenticated users can write/edit/delete
- **Orders:** Authenticated users only (read/write/edit/delete)
- **Delivery Zones:** Anyone can read; authenticated users can manage

---

## 📱 Mobile Responsive

- Sticky WhatsApp bar on mobile (bottom)
- Floating WhatsApp button on desktop (bottom-right)
- Mobile-optimized admin interface
- Responsive product grid (1-4 columns depending on screen)

---

## 🎨 Customization

### Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  orthostep: {
    DEFAULT: "#1f7d4a",  // Main green
    light: "#d9f2e0",    // Light green
    dark: "#0f4f2e"      // Dark green
  }
}
```

### WhatsApp Number
Replace `213XXXXXXXXX` in:
- `components/FloatingWhatsApp.tsx`
- `components/StickyBar.tsx`
- `components/ProductShowcase.tsx`

### Copy/Text
- French text in components
- Arabic text in admin (optional)
- RTL support in admin panel

---

## 🚀 Production Deployment

### Option 1: Vercel (Recommended)

1. Push the project to GitHub.
2. Open Vercel and import the repository.
3. Add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy the project.
5. Open `yourproject.vercel.app`.
6. Open the admin panel at `yourproject.vercel.app/admin/login`.

### Option 2: Self-Hosted

```bash
# Build
npm run build

# Start
npm start
```

### Environment Variables on Server
Add the same `.env.local` variables to your hosting platform.

---

## 🐛 Troubleshooting

### Framer Motion Module Error
**Error:** "Could not find module ... framer-motion ... React Client Manifest"

**Fix:** Ensure all components using `motion.*` have `"use client"` directive:
- ✅ BenefitCard.tsx
- ✅ ProductShowcase.tsx
- ✅ ProductModal.tsx
- ✅ FloatingWhatsApp.tsx
- ✅ StickyBar.tsx
- ✅ AdminShell.tsx

### Supabase Connection Error
**Error:** "Missing NEXT_PUBLIC_SUPABASE_URL"

**Fix:** 
1. Verify `.env.local` is in project root
2. Restart dev server: `npm run dev`
3. Check variables are set: `echo $NEXT_PUBLIC_SUPABASE_URL`

### Products Not Showing
1. Check products exist in Supabase: `SELECT COUNT(*) FROM products;`
2. Verify storage bucket is public
3. Check image URLs are valid

### Admin Login Not Working
1. Verify admin user exists in Supabase Auth → Users
2. Try resending reset password link
3. Check email is confirmed

---

## 📊 Analytics

Dashboard shows:
- Total products count
- Total orders
- Most viewed products
- Recent order activity

---

## 📝 API Routes

All API routes are protected with Supabase service role key:

```
GET  /api/admin/products         - List all products
POST /api/admin/products         - Create product
PUT  /api/admin/products?id=...  - Update product
DEL  /api/admin/products?id=...  - Delete product

GET  /api/admin/orders           - List orders
PUT  /api/admin/orders?id=...    - Update order status

GET  /api/admin/delivery         - List zones
POST /api/admin/delivery         - Create zone
PUT  /api/admin/delivery?id=...  - Update zone
DEL  /api/admin/delivery?id=...  - Delete zone

GET  /api/admin/stats            - Dashboard stats
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Build for production
npm run start           # Start production server

# Linting
npm run lint            # Run ESLint

# Database
npx ts-node scripts/seed.ts  # Seed database with initial data
```

---

## 📦 Dependencies

- **Next.js 14** - React framework
- **React 18** - UI library
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Supabase** - Backend/Database
- **Lucide Icons** - Icon library

---

## 📄 License

© 2024 ORTHOSTEP. All rights reserved.

---

## 📞 Support

- **WhatsApp:** Configurable from admin settings
- **Email:** contact@orthostep.dz
- **Location:** Alger, Algérie

---

## 🎯 Features

✅ Landing page with animations
✅ Product showcase with modal details
✅ WhatsApp integration for orders
✅ Admin dashboard with authentication
✅ Product management (CRUD)
✅ Order tracking and status updates
✅ Delivery zone management
✅ Support for all 58 Algerian wilayas
✅ Responsive design (mobile/tablet/desktop)
✅ Dark/Light theme support (admin)
✅ French and Arabic translations (admin)
✅ Database with RLS security
✅ Image storage integration

---

## 🔄 Next Steps After Setup

1. **Customize colors** in `tailwind.config.ts`
2. **Update WhatsApp number** in components
3. **Add real product images** via admin panel
4. **Set up delivery zones** for your coverage area
5. **Create admin accounts** for your team
6. **Deploy to production** (Vercel recommended)
7. **Set up Google Analytics** (optional)
8. **Configure email notifications** (optional)

Enjoy your ORTHOSTEP platform! 🚀
