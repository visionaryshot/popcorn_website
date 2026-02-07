import OrderConfirmedClient from './OrderConfirmedClient';

export const metadata = {
  title: 'Order Confirmed | Gourmet Popcorn Shop',
  description: 'Your order has been confirmed! Here are your order details.',
};

export default function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-butter-50">
      <OrderConfirmedClient orderId={searchParams.id as string | undefined} />
    </div>
  );
}

