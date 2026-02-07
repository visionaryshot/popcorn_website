import Link from 'next/link';

export const metadata = {
  title: 'About Us - Visionary Popcorn',
  description: 'Learn about Visionary Popcorn - your source for delicious, handcrafted gourmet popcorn.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-butter-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-butter-500 font-semibold tracking-wide uppercase text-sm">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            About Visionary Popcorn
          </h1>
          <p className="text-xl text-gray-600">
            Bringing you the finest handcrafted popcorn made with love and premium ingredients.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-butter-400 via-caramel-400 to-cheese-400 rounded-3xl p-12 aspect-square flex items-center justify-center">
                <span className="text-9xl">🍿</span>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4">
                <p className="text-2xl font-bold text-butter-600">Fresh Daily</p>
                <p className="text-sm text-gray-500">Made to order</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Handcrafted with Passion
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Every batch of our visionary popcorn is handcrafted in small quantities 
                to ensure perfect flavor distribution and that irresistible crunch. 
                We believe popcorn should be more than just a snack — it should be 
                an experience.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our recipes have been perfected over time, combining traditional 
                techniques with modern flavor profiles to create something truly special 
                that keeps our customers coming back for more.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-butter-600">5+</p>
                  <p className="text-sm text-gray-500">Products</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-caramel-600">Happy</p>
                  <p className="text-sm text-gray-500">Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-cheese-600">⭐⭐⭐⭐⭐</p>
                  <p className="text-sm text-gray-500">Quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gradient-to-b from-white to-cream-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything we do is guided by our commitment to quality and customer satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Quality */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-butter-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌽</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Only the finest non-GMO corn kernels and real ingredients. 
                No artificial substitutes — just real, delicious popcorn.
              </p>
            </div>

            {/* Freshness */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-caramel-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💛</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Made with Love</h3>
              <p className="text-gray-600">
                Each batch is handcrafted with care. We put our heart into 
                every kernel to ensure the perfect snack experience.
              </p>
            </div>

            {/* Service */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-cheese-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Ordering</h3>
              <p className="text-gray-600">
                Order directly through our website and pay via bank transfer. 
                Simple, fast, and convenient.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-butter-500 via-caramel-500 to-cheese-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Have questions or want to place a custom order? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/2347086879592" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-butter-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              📱 Chat on WhatsApp
            </a>
            <Link 
              href="/checkout" 
              className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-white/30 transition-all duration-300"
            >
              🍿 Order Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

