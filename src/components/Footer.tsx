import { FooterContent } from '@/types/content';
import Link from 'next/link';

interface FooterProps {
  content: FooterContent;
}

export default function Footer({ content }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Footer Sections */}
          {content.sections.map((section, index) => (
            <div key={`${section.title}-${index}`}>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-4">
                {section.links.map((link, index) => (
                  <li key={`${link.url}-${index}`}>
                    <Link
                      href={link.url}
                      className="text-base text-gray-300 hover:text-white"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <div className="flex justify-center space-x-6">
            {content.socialLinks.map((social, index) => (
              <a
                key={`${social.platform}-${index}`}
                href={social.url}
                className="text-gray-400 hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">{social.platform}</span>
                {/* You can replace these with actual social media icons */}
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            {content.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
} 