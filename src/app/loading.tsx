import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header content={{
        logo: { src: '/images/logo.svg', alt: 'Days Out Guide Logo' },
        navigation: [],
        ctaButton: { text: 'Loading...', url: '#' }
      }} />
      
      <main className="flex-grow">
        {/* Hero Section Loading State */}
        <div className="relative bg-gray-900">
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <div className="h-16 bg-gray-700 rounded w-3/4 animate-pulse mb-6" />
            <div className="h-8 bg-gray-700 rounded w-1/2 animate-pulse mb-10" />
            <div className="h-12 bg-blue-600 rounded w-48 animate-pulse" />
          </div>
        </div>

        {/* Featured Destinations Loading State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse mb-12" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer content={{
        sections: [],
        copyright: 'Loading...',
        socialLinks: []
      }} />
    </div>
  );
} 