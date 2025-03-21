export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
}

export interface NavigationItem {
  title: string;
  url: string;
  children?: NavigationItem[];
}

export interface FooterSection {
  title: string;
  links: {
    title: string;
    url: string;
  }[];
}

export interface FooterContent {
  sections: FooterSection[];
  copyright: string;
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

export interface HeaderContent {
  logo: {
    src: string;
    alt: string;
  };
  navigation: NavigationItem[];
  ctaButton?: {
    text: string;
    url: string;
  };
}

export interface HomePageContent {
  metadata: PageMetadata;
  header: HeaderContent;
  footer: FooterContent;
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaButton: {
      text: string;
      url: string;
    };
  };
  featuredDestinations: {
    title: string;
    destinations: {
      title: string;
      description: string;
      image: string;
      url: string;
    }[];
  };
} 