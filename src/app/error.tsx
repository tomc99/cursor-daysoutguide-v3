'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header content={{
        logo: { src: '/images/logo.svg', alt: 'Days Out Guide Logo' },
        navigation: [],
        ctaButton: { text: 'Home', url: '/' }
      }} />
      
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Something went wrong!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We&apos;re sorry, but we couldn&apos;t load the content. Please try again.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </main>

      <Footer content={{
        sections: [],
        copyright: '© 2024 Days Out Guide',
        socialLinks: []
      }} />
    </div>
  );
} 