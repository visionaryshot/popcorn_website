# Deployment Guide for Popcorn Shop

## 🚀 Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option 2: Deploy via GitHub
1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/popcorn-shop.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) and import your GitHub repo
3. Add Environment Variables in Vercel Dashboard:
   - Go to Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key

4. Deploy!

---

## 📋 Pre-Deployment Checklist

### 1. Supabase Setup (Production)
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Enable Row Level Security (RLS)

Run these SQL commands in Supabase SQL Editor:

```sql
-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert orders (for checkout)
CREATE POLICY "Allow inserts for orders" ON orders
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated admin to view all orders
CREATE POLICY "Admin can view all orders" ON orders
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated admin to update orders
CREATE POLICY "Admin can update orders" ON orders
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated admin to delete orders
CREATE POLICY "Admin can delete orders" ON orders
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Enable RLS on order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policy for order_items
CREATE POLICY "Allow inserts for order_items" ON order_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can manage order_items" ON order_items
  FOR ALL
  USING (auth.role() = 'authenticated');
```

### 3. Storage Bucket Setup
1. Go to Storage → New Bucket
2. Name: `proof-of-payment`
3. Make bucket **Public**
4. Add storage policy:
```sql
-- Allow public uploads for payment proofs
CREATE POLICY "Public can upload" ON storage.objects
  FOR INSERT
  WITH CHECK ( bucket_id = 'proof-of-payment' AND bucket_id IN (SELECT name FROM storage.buckets WHERE public = true) );

-- Allow authenticated to view
CREATE POLICY "Authenticated can view" ON storage.objects
  FOR SELECT
  USING ( bucket_id = 'proof-of-payment' AND bucket_id IN (SELECT name FROM storage.buckets WHERE public = true) );
```

### 4. Build Test
Run locally to verify:
```bash
npm run build
npm run start
```

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

2. **Use Vercel Environment Variables** - Don't hardcode Supabase keys

3. **Enable RLS** - Prevent unauthorized access to orders

4. **Rate Limiting** - Consider adding rate limiting for checkout endpoint

---

## 📦 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key | Yes |

---

## 🐛 Troubleshooting

### "Failed to fetch" on checkout
- Check Supabase URL is correct
- Ensure CORS is configured in Supabase
- Check browser ad blocker isn't blocking requests

### Orders not saving
- Verify RLS policies are set correctly
- Check Supabase storage is public

### Payment proof not uploading
- Verify storage bucket exists
- Check storage policies allow uploads

---

## 🎯 Post-Deployment

1. Test complete checkout flow
2. Verify admin panel works
3. Test order tracking
4. Set up custom domain (optional)
5. Enable HTTPS (automatic on Vercel)

