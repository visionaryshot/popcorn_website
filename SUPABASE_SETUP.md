# Supabase Setup Guide

Complete guide to setting up Supabase for your Gourmet Popcorn Shop.

## 📋 Table of Contents

1. [Create Supabase Project](#1-create-supabase-project)
2. [Create Database Tables](#2-create-database-tables)
3. [Set Up Storage](#3-set-up-storage)
4. [Configure Environment Variables](#4-configure-environment-variables)
5. [Test the Integration](#5-test-the-integration)

---

## 1. Create Supabase Project

### Step 1.1: Sign Up for Supabase

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign Up"
3. Sign up with GitHub, Google, or email

### Step 1.2: Create New Project

1. Click "New Project"
2. Select your organization
3. Fill in project details:
   - **Name**: `popcorn-shop` (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose the region closest to your users
4. Click "Create new project"

### Step 1.3: Get API Credentials

Once your project is created:

1. Go to **Project Settings** (cog icon) → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 2. Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run the following SQL:

### Step 2.1: Create Orders Table

```sql
-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),
  proof_of_payment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read/write for authenticated users
CREATE POLICY "Enable all operations for authenticated users" 
ON orders FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
```

### Step 2.2: Create Order Items Table

```sql
-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Enable all operations for authenticated users" 
ON order_items FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
```

### Step 2.3: Verify Tables Created

1. Go to **Table Editor** in Supabase
2. You should see `orders` and `order_items` tables
3. Click on each table to verify the columns

---

## 3. Set Up Storage

### Step 3.1: Create Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click **New Bucket**
3. Configure:
   - **Name**: `proof-of-payment`
   - **Public bucket**: ✅ Check this (make it public)
4. Click "Create bucket"

### Step 3.2: Set Upload Policy

1. Click on the `proof-of-payment` bucket
2. Go to **Policies** tab
3. Create a new policy with these settings:

**For Upload (INSERT):**
```sql
CREATE POLICY "Allow public uploads" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( true );
```

**For View (SELECT):**
```sql
CREATE POLICY "Allow public view" 
ON storage.objects FOR SELECT 
TO authenticated 
USING ( bucket_id = 'proof-of-payment' );
```

### Step 3.3: Configure CORS (Optional)

If you have issues with uploads, you may need to configure CORS:

1. Go to **API** → **API Settings**
2. Add your domain to `Access Control - Allow Origins`

---

## 4. Configure Environment Variables

### Step 4.1: Create Environment File

In your project root, create `.env.local`:

```bash
# Supabase Configuration
# Get these from: Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# Admin Password (for /admin route)
# Change this to something secure!
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
```

### Step 4.2: Get Your Supabase URL and Key

1. Go to **Project Settings** → **API**
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4.3: Example Complete File

```env
# 🍿 Gourmet Popcorn Shop - Environment Variables

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abc123def456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyMyIsInJvbGUiOiJhbG9uIiwiaWF0IjoxNjQwMDAwMDAwLCJleHAiOjE5NTU2MDAwMDB9.example

# Admin Panel Password
# Default: admin123 (change this for production!)
NEXT_PUBLIC_ADMIN_PASSWORD=popcorn123
```

---

## 5. Test the Integration

### Step 5.1: Start Development Server

```bash
npm run dev
```

### Step 5.2: Test Checkout Flow

1. Go to [http://localhost:3000](http://localhost:3000)
2. Add products to cart
3. Go to checkout
4. Fill in test data
5. Upload a test image
6. Submit order

### Step 5.3: Verify in Supabase

1. Go to **Table Editor** → **orders**
2. You should see your new order
3. Go to **Storage** → `proof-of-payment`
4. You should see your uploaded image

### Step 5.4: Test Admin Panel

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Enter the admin password
3. You should see the order you just created
4. Try changing status from "Pending" to "Confirmed"

---

## 🔧 Troubleshooting

### "Relation does not exist" Error

Make sure you've created the tables in Supabase. Run the SQL from Step 2 again.

### Upload Fails with CORS Error

1. Go to **API** → **API Settings**
2. Add `http://localhost:3000` to `Access Control - Allow Origins`
3. For production, add your Vercel domain

### Row Level Security Blocked

If you're getting permission errors:

1. Go to **Authentication** → **Policies**
2. Make sure your tables have policies that allow operations
3. Or temporarily disable RLS for testing:
   ```sql
   ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
   ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
   ```

### Anonymous Key Not Working

1. Make sure you're using the **anon public** key, not the **service_role** key
2. The anon key starts with `eyJ...`

---

## 📝 Additional Security for Production

### Enable Email Confirmations

1. Go to **Authentication** → **Providers**
2. Enable Email provider
3. Configure email templates

### Set Up Webhooks (Optional)

For real-time updates, you can set up webhooks:

1. Go to **Database** → **Webhooks**
2. Create a new webhook
3. Point to your server endpoint
4. Listen for INSERT on `orders` table

---

## 🎉 You're All Set!

Once completed:

- ✅ Database tables created
- ✅ Storage bucket configured
- ✅ Environment variables set
- ✅ Checkout flow working
- ✅ Admin panel accessible

---

**Questions? Issues? Check the main [README.md](../README.md) for additional help.**

