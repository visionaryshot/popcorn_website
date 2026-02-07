# 🍿 Gourmet Popcorn Shop - Development Plan

## 📁 Project Structure
```
popcorn-shop/
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind + custom gourmet styles
│   │   ├── layout.tsx           # Root layout with navigation
│   │   ├── page.tsx             # Homepage with product grid
│   │   ├── checkout/
│   │   │   └── page.tsx         # Checkout form + file upload
│   │   ├── admin/
│   │   │   ├── page.tsx         # Admin dashboard
│   │   │   └── orders/
│   │   │       └── page.tsx     # Order management
│   │   └── api/
│   │       ├── orders/
│   │       │   └── route.ts     # Create order API
│   │       └── upload/
│   │           └── route.ts     # Image upload API
│   ├── components/
│   │   ├── ProductGrid.tsx      # Product display with quantity selectors
│   │   ├── Cart.tsx             # Shopping cart sidebar
│   │   ├── CheckoutForm.tsx     # Form with file upload
│   │   ├── AdminTable.tsx       # Order management table
│   │   └── Navbar.tsx           # Navigation component
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client configuration
│   │   └── types.ts             # TypeScript interfaces
│   └── hooks/
│       └── useCart.ts           # Cart state management
├── public/
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── .env.local.example
```

## 🎨 Design System
- **Primary Color**: Rich golden yellow (#FFD700, #F4C430)
- **Secondary**: Warm cream (#FFF8DC)
- **Background**: Clean white (#FFFFFF)
- **Typography**: Modern sans-serif with elegant headings
- **Effects**: Subtle shadows, smooth transitions, rounded corners

## 🍿 Products
1. **Butter Popcorn** - Classic rich butter flavor
2. **Cheese Popcorn** - Sharp cheddar cheese coating
3. **Caramel Popcorn** - Sweet caramel glaze

## 🗄️ Supabase Schema
```sql
-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'Pending',
  proof_of_payment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Storage bucket
-- Bucket name: 'proof-of-payment'
-- Policy: Public access for uploads, authenticated for updates
```

## 📋 Implementation Steps

### Phase 1: Project Setup
1. [ ] Initialize Next.js 15 project with Tailwind CSS
2. [ ] Configure Supabase client
3. [ ] Set up environment variables
4. [ ] Create TypeScript types

### Phase 2: Core Components
5. [ ] Build Navbar component
6. [ ] Create ProductGrid with quantity selectors
7. [ ] Implement Cart hook and state management
8. [ ] Build Cart sidebar component

### Phase 3: Checkout System
9. [ ] Create checkout form with validation
10. [ ] Implement file upload to Supabase Storage
11. [ ] Build order creation API endpoint
12. [ ] Connect form to Supabase database

### Phase 4: Admin Panel
13. [ ] Create admin authentication (simple password)
14. [ ] Build orders table view
15. [ ] Implement status update functionality
16. [ ] Add proof of payment image preview

### Phase 5: Styling & Polish
17. [ ] Apply gourmet design system
18. [ ] Add animations and transitions
19. [ ] Ensure mobile responsiveness
20. [ ] Test all integrations

## 🔧 Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_admin_password
```

## 📦 Dependencies
- next: 15.x
- @supabase/supabase-js
- @supabase/ssr
- tailwindcss
- postcss
- autoprefixer
- lucide-react (icons)
- clsx
- tailwind-merge

## 🚀 Deployment
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## ⏱️ Estimated Time
- Setup: 10 minutes
- Components: 25 minutes
- Checkout: 20 minutes
- Admin: 15 minutes
- Styling: 10 minutes
- **Total: ~80 minutes**

---
**Ready to proceed with implementation?**

