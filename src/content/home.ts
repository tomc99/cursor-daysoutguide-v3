import { HomePageContent } from '@/types/content';

export const homeContent: HomePageContent = {
  metadata: {
    title: 'Days Out Guide | Discover Amazing Destinations by Train',
    description: 'Find the perfect day out destinations accessible by train. Explore cities, attractions, and hidden gems across the country.',
    keywords: ['days out', 'train travel', 'destinations', 'attractions', 'day trips'],
  },
  header: {
    logo: {
      src: '/images/logo.svg',
      alt: 'Days Out Guide Logo',
    },
    navigation: [
      {
        title: 'Destinations',
        url: '/destinations',
        children: [
          { title: 'Cities', url: '/destinations/cities' },
          { title: 'Attractions', url: '/destinations/attractions' },
          { title: 'Hidden Gems', url: '/destinations/hidden-gems' },
        ],
      },
      { title: 'About', url: '/about' },
      { title: 'Contact', url: '/contact' },
    ],
    ctaButton: {
      text: 'Plan Your Journey',
      url: '/plan-journey',
    },
  },
  hero: {
    title: 'Discover Amazing Days Out by Train',
    subtitle: 'Explore the best destinations across the country with our curated guide to unforgettable experiences',
    backgroundImage: '/images/hero-bg.jpg',
    ctaButton: {
      text: 'Browse Destinations',
      url: '/destinations',
    },
  },
  featuredDestinations: {
    title: 'Popular Destinations',
    destinations: [
      {
        title: 'London',
        description: 'Explore the capital\'s world-class museums, historic landmarks, and vibrant culture.',
        image: '/images/destinations/london.jpg',
        url: '/destinations/london',
      },
      {
        title: 'Edinburgh',
        description: 'Discover the historic charm of Scotland\'s capital with its stunning architecture and rich heritage.',
        image: '/images/destinations/edinburgh.jpg',
        url: '/destinations/edinburgh',
      },
      {
        title: 'Bath',
        description: 'Experience the Georgian elegance and Roman heritage of this beautiful city.',
        image: '/images/destinations/bath.jpg',
        url: '/destinations/bath',
      },
    ],
  },
  footer: {
    sections: [
      {
        title: 'Quick Links',
        links: [
          { title: 'Destinations', url: '/destinations' },
          { title: 'About Us', url: '/about' },
          { title: 'Contact', url: '/contact' },
        ],
      },
      {
        title: 'Help & Support',
        links: [
          { title: 'Plan Your Journey', url: '/plan-journey' },
          { title: 'FAQs', url: '/faqs' },
          { title: 'Terms & Conditions', url: '/terms' },
        ],
      },
    ],
    copyright: '© 2024 Days Out Guide. All rights reserved.',
    socialLinks: [
      {
        platform: 'Twitter',
        url: 'https://twitter.com/daysoutguide',
        icon: 'twitter',
      },
      {
        platform: 'Facebook',
        url: 'https://facebook.com/daysoutguide',
        icon: 'facebook',
      },
      {
        platform: 'Instagram',
        url: 'https://instagram.com/daysoutguide',
        icon: 'instagram',
      },
    ],
  },
}; 