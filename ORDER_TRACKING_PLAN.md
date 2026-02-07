# Order Tracking Page Implementation Plan

## Objective
Create an Order Tracking Page where customers can check their order status using Order ID (no login required).

---

## Phase 1: Order Tracking Page Implementation

### Files to Create:
1. **src/app/track/page.tsx** - Order tracking page
2. **src/components/OrderTracker.tsx** - Order tracking component

### Features:
1. Order ID input field
2. Fetch order details from Supabase
3. Display order status (Pending/Confirmed/Cancelled)
4. Show order items and total
5. Show payment proof status
6. WhatsApp contact link for issues

---

## Phase 2: Update Navigation

### Files to Modify:
1. **src/components/Navbar.tsx** - Add "Track Order" link

---

## Phase 3: Update Checkout Success Message

### Files to Modify:
1. **src/components/CheckoutForm.tsx** - Show order ID prominently with link to track page

---

## Implementation Steps:

### Step 1: Create OrderTracker Component
- [ ] Create OrderTracker.tsx with:
  - Order ID input
  - Fetch order from Supabase
  - Display order details
  - Status badges
  - WhatsApp contact button

### Step 2: Create Track Page
- [ ] Create src/app/track/page.tsx
  - Page layout
  - SEO meta tags
  - OrderTracker component integration

### Step 3: Update Navbar
- [ ] Add "Track Order" link in navigation
- [ ] Add to mobile menu

### Step 4: Update Checkout Success
- [ ] Add link to track page in success message
- [ ] Make order ID clickable

---

## Expected Result:
1. Customers can visit `/track` 
2. Enter their Order ID (shown after checkout)
3. See their order status updated by admin
4. Know when payment is confirmed
5. Contact admin via WhatsApp if needed

---

## Technical Details:

### Database Query:
```typescript
// Fetch order with items
const { data, error } = await supabase
  .from('orders')
  .select('*, order_items(*)')
  .eq('id', orderId)
  .single()
```

### Status Display:
- **Pending**: Yellow badge - "Awaiting confirmation"
- **Confirmed**: Green badge - "Payment confirmed!"
- **Cancelled**: Red badge - "Order cancelled"

---

## Timeline: 4 steps

