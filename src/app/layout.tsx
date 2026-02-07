import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "Visionary Popcorn | Handcrafted Gourmet Popcorn",
    template: "%s | Visionary Popcorn",
  },
  description: "Discover delicious handcrafted popcorn varieties - Butter, Cheese, Caramel & Sachet Water. Made fresh with premium ingredients in Nigeria.",
  keywords: ["popcorn", "gourmet popcorn", "butter popcorn", "cheese popcorn", "caramel popcorn", "snacks", "Nigerian snacks", " Visionary Popcorn"],
  authors: [{ name: "Visionary Popcorn" }],
  openGraph: {
    title: "Visionary Popcorn | Handcrafted Gourmet Popcorn",
    description: "Discover delicious handcrafted popcorn varieties made with premium ingredients.",
    type: "website",
    locale: "en_NG",
    siteName: "Visionary Popcorn",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visionary Popcorn",
    description: "Handcrafted gourmet popcorn made with love.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="bg-gray-900 text-white py-8">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-butter-400 font-semibold mb-2">🍿 Visionary Popcorn Shop</p>
                <p className="text-gray-400 text-sm">Handcrafted with love • Premium ingredients</p>
                <p className="text-gray-500 text-xs mt-4">© 2024 Visionary Popcorn. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
