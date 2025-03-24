import { getHomeContent } from '@/services/contentService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Enable revalidation every hour
export const revalidate = 3600;

// Generate metadata for the page
export async function generateMetadata(): Promise<Metadata> {
  return {
      title: 'Days Out Guide',
      description: 'Discover amazing destinations by train',
    };
}

export default async function Home() {
  try {
    const content = await getHomeContent();

    if (!content) {
      notFound();
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Header content={content.header} />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="relative bg-gray-900">
            <div className="absolute inset-0">
              <Image
                src={content.hero.backgroundImage}
                alt="Hero background"
                fill
                className="object-cover opacity-50"
                priority
              />
            </div>
            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {content.hero.title}
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                {content.hero.subtitle}
              </p>
              <div className="mt-10">
                <Link
                  href={content.hero.ctaButton.url}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  {content.hero.ctaButton.text}
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Destinations */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {content.featuredDestinations.title}
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {content.featuredDestinations.destinations.map((destination, index) => (
                <Link
                  key={index}
                  href={destination.url}
                  className="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={destination.image}
                      alt={destination.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {destination.title}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {destination.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>

        <Footer content={content.footer} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching home content:', error);
    throw error; // This will trigger the error.tsx component
  }
}
