import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-butter-50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-6xl">🍿</div>
          <div className="absolute top-20 right-20 text-5xl">🍿</div>
          <div className="absolute bottom-10 left-1/4 text-4xl">🍿</div>
          <div className="absolute bottom-20 right-10 text-5xl">🍿</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block bg-butter-100 text-butter-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              ✨ Handcrafted with Premium Ingredients
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              The Ultimate
              <span className="gradient-text block mt-2">Visionary Popcorn</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover our artisanal collection of handcrafted popcorn. 
              From classic butter to bold cheese and sweet caramel — 
              each kernel is a perfect bite of heaven.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#products" 
                className="btn-primary inline-flex items-center"
              >
                <span className="mr-2">🧺</span>
                Browse Collection
              </a>
              <a 
                href="/checkout" 
                className="btn-secondary inline-flex items-center"
              >
                <span className="mr-2">🛒</span>
                View Cart
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-butter-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌽</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Corn</h3>
              <p className="text-gray-600">Only the finest non-GMO corn kernels for the perfect pop</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-caramel-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧈</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Real Butter</h3>
              <p className="text-gray-600">No artificial substitutes — just real, creamy butter</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cheese-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧂</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Artisanal Salt</h3>
              <p className="text-gray-600">Sea salt harvested from premium sources worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section id="products" className="bg-white">
        <ProductGrid />
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-b from-white to-cream-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-butter-500 font-semibold tracking-wide uppercase text-sm">
                Our Story
              </span>
              <h2 className="section-title mt-2">Crafted with Passion</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Every batch of our visionary popcorn is handcrafted in small quantities 
                to ensure perfect flavor distribution and that irresistible crunch. 
                We believe popcorn should be more than just a snack — it should be 
                an experience you'll remember.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our secret recipes have been perfected over time, combining 
                traditional techniques with modern flavor profiles to create 
                something truly special.
              </p>
              <Link 
                href="/about" 
                className="inline-flex items-center text-butter-600 font-semibold hover:text-butter-700 transition-colors"
              >
                Learn more about us →
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-butter-400 via-caramel-400 to-cheese-400 rounded-3xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <span className="text-9xl">🍿</span>
                  <p className="text-white text-xl font-semibold mt-4">Handcrafted Daily</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-butter-500 via-caramel-500 to-cheese-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Taste the Difference?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join thousands of satisfied customers who have made visionary popcorn 
            their favorite indulgence.
          </p>
          <a 
            href="#products" 
            className="inline-block bg-white text-butter-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Order Now →
          </a>
        </div>
      </section>
    </>
  );
}
