'use client';

import { CartProvider } from '@/hooks/useCart';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
