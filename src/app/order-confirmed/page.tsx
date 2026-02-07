import OrderConfirmedClient from './OrderConfirmedClient';

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await the searchParams promise
  const { id } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-butter-50">
      <OrderConfirmedClient orderId={id as string | undefined} />
    </div>
  );
}
