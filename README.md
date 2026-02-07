# 🍿 Gourmet Popcorn Shop

A beautiful, professional e-commerce website for selling gourmet popcorn, built with Next.js 15, Tailwind CSS, and Supabase.

![Gourmet Popcorn Shop](https://via.placeholder.com/1200x600/F59E0B/FFFFFF?text=Gourmet+Popcorn+Shop)

## ✨ Features

- **Beautiful Product Grid** - Showcase Butter, Cheese, and Caramel popcorn with quantity selectors
- **Shopping Cart** - Persistent cart with localStorage
- **Checkout Form** - Customer information collection with validation
- **Payment Proof Upload** - Upload proof of payment images to Supabase Storage
- **Admin Dashboard** - Password-protected order management
- **Order Status Updates** - Mark orders as Pending → Confirmed
- **Responsive Design** - Works beautifully on all devices
- **Gourmet Theme** - Rich yellows and clean white space

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd popcorn-shop
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
```

### 3. Set Up Supabase

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed database setup instructions.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
popcorn-shop/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage with product grid
│   │   ├── checkout/
│   │   │   └── page.tsx         # Checkout form
│   │   ├── admin/
│   │   │   └── page.tsx         # Admin dashboard
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Tailwind styles
│   ├── components/
│   │   ├── Navbar.tsx           # Navigation
│   │   ├── ProductGrid.tsx       # Product cards with quantity selectors
│   │   ├── CheckoutForm.tsx      # Checkout with file upload
│   │   └── AdminTable.tsx       # Order management table
│   ├── hooks/
│   │   └── useCart.ts           # Cart state management
│   └── lib/
│       ├── supabase.ts           # Supabase client
│       └── types.ts              # TypeScript types
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🎨 Design System

### Colors
- **Butter**: Rich golden yellow (#F59E0B)
- **Caramel**: Warm orange (#F97316)
- **Cheese**: Bold orange (#FF9800)
- **Cream**: Soft beige (#FFF8DC)

### Typography
- **Display**: Playfair Display (elegant headings)
- **Body**: Inter (clean sans-serif)

## 🛒 Usage

### For Customers
1. Browse the product selection
2. Adjust quantities using +/- buttons
3. Click "Add to Cart"
4. Proceed to checkout
5. Fill in customer details
6. Upload proof of payment
7. Submit order

### For Admins
1. Navigate to `/admin`
2. Enter the admin password
3. View all orders with details
4. Click "View" to see payment proof
5. Click "Confirm" to mark as Confirmed

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Vercel

Add these in Vercel Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_ADMIN_PASSWORD
```

## 🗄️ Supabase Setup

### Database Tables

Run these SQL commands in your Supabase SQL Editor:

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
```

### Storage Bucket

1. Go to Storage → New Bucket
2. Name: `proof-of-payment`
3. Make bucket public
4. Set storage policies for upload access

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

## 🔧 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📝 License

MIT License - feel free to use for your own popcorn shop!

## 🙏 Credits

Built with ❤️ using:
- [Next.js 15](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)

---

**🍿 Made with love for popcorn enthusiasts everywhere!**

