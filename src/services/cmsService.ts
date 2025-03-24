import { HomePageContent, PageMetadata, HeaderContent, FooterContent, NavigationItem } from '@/types/content';

const CMS_API_BASE_URL = process.env.NEXT_PUBLIC_CMS_API_URL;
const CMS_CLIENT_ID = process.env.CMS_CLIENT_ID;
const CMS_CLIENT_SECRET = process.env.CMS_CLIENT_SECRET;

interface CMSResponse<T> {
  key: string;
  contentType: string;
  properties: T;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class CMSService {
  private static instance: CMSService;
  private contentCache: Map<string, unknown> = new Map();
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  private constructor() {}

  public static getInstance(): CMSService {
    if (!CMSService.instance) {
      CMSService.instance = new CMSService();
    }
    return CMSService.instance;
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Generate new token
    if (!CMS_CLIENT_ID || !CMS_CLIENT_SECRET) {
      throw new Error('CMS client credentials are not configured');
    }
    const response = await fetch(`${CMS_API_BASE_URL}/_cms/preview2/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: CMS_CLIENT_ID,
        client_secret: CMS_CLIENT_SECRET,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const tokenData: TokenResponse = await response.json();
    this.accessToken = tokenData.access_token;
    this.tokenExpiry = Date.now() + (tokenData.expires_in - 60) * 1000;

    return this.accessToken;
  }

  private async fetchFromCMS<T>(endpoint: string, attempts: number = 0): Promise<T> {
    const accessToken = await this.getAccessToken();
    const response = await fetch(`${CMS_API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.optimizely.cms.v1.includeSchema+json',
      },
    });
    if (!response.ok) {
      // If we get a 401, try to refresh the token and retry once
      if (response.status === 401 && attempts < 1) {
        this.accessToken = null;
        this.tokenExpiry = null;
        return this.fetchFromCMS<T>(endpoint, attempts + 1);
      }
      throw new Error(`CMS API error: ${response.statusText}`);
    }

    return response.json();
  }

  private async resolveReference<T>(reference: string): Promise<T> {
    // Check cache first
    const cachedContent = this.contentCache.get(reference);
    if (cachedContent) {
      return cachedContent as T;
    }

    // Fetch from CMS
    const content = await this.fetchFromCMS<CMSResponse<T>>(`/_cms/preview2/content/${reference}`);
    this.contentCache.set(reference, content.properties);
    return content.properties;
  }

  public async getHomeContent(): Promise<HomePageContent> {
    try {
      // First get the published versions
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const versions = await this.fetchFromCMS<any>('/_cms/preview2/content/532d21f496944221b01cf9dbcff4f35c/versions?statuses=published');
      if (!versions.items || versions.items.length === 0) {
        throw new Error('No published version found for homepage');
      }

      // Get the latest published version
      const latestVersion = versions.items[versions.items.length - 1];

      // Fetch the main homepage content with the latest published version
      const homepage = await this.fetchFromCMS<CMSResponse<{
        metadata: { title: string, description: string, keywords: string[] };
        header: { logo: { src: string, alt: string }, navigation: NavigationItem[], ctaButton?: { text: string, url: string } };
        hero: { title: string, subtitle: string, backgroundImage: string, ctaButton: { text: string, url: string } };
        featuredDestinations: { title: string, destinations: { title: string, description: string, image: string, url: string }[] };
        footer: { sections: { title: string, links: { title: string, url: string }[] }[], copyright: string, socialLinks: { platform: string, url: string, icon: string }[] };
      }>>(`/_cms/preview2/content/532d21f496944221b01cf9dbcff4f35c/versions/${latestVersion.version}`);

      return {
        metadata: homepage?.properties.metadata,
        header: homepage?.properties.header,
        hero: homepage?.properties.hero,
        featuredDestinations: homepage?.properties.featuredDestinations,
        footer: homepage?.properties.footer,
      };
    } catch (error) {
      console.error('Error fetching home content from CMS:', error);
      throw error;
    }
  }

  public clearCache(): void {
    this.contentCache.clear();
    this.accessToken = null;
    this.tokenExpiry = null;
  }
}

export const cmsService = CMSService.getInstance(); 