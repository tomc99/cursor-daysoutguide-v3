import { HomePageContent, HeaderContent } from '@/types/content';

const CMS_API_BASE_URL = process.env.CMS_API_URL;
const CMS_CLIENT_ID = process.env.CMS_CLIENT_ID;
const CMS_CLIENT_SECRET = process.env.CMS_CLIENT_SECRET;

interface CMSResponse<T> {
  key: string;
  contentType: string;
  properties: T;
  routeSegment: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

type HomePageCmsContent = Omit<HomePageContent, 'header'> & {
  header: Omit<HeaderContent, 'logo'> & {
    logo: string;
  };
};

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

  private async resolveReference<T>(referenceOrKey: string): Promise<CMSResponse<T>> {
    // Strip the cms://content/ prefix if it exists
    const contentKey = referenceOrKey.replace('cms://content/', '');

    // Check cache first
    const cachedContent = this.contentCache.get(contentKey);
    if (cachedContent) {
      return cachedContent as CMSResponse<T>;
    }

    // Fetch from CMS
    const content = await this.getLatestPublishedVersion<T>(contentKey);
    this.contentCache.set(contentKey, content);
    return content;
  }

  private async getLatestPublishedVersion<T>(contentKey: string): Promise<CMSResponse<T>> {
    // First get the published versions
    const versions = await this.fetchFromCMS<{
      items: Array<{
        key: string;
        version: string;
        status: string;
      }>;
    }>(`/_cms/preview2/content/${contentKey}/versions?statuses=published`);

    if (!versions.items || versions.items.length === 0) {
      throw new Error(`No published version found for content: ${contentKey}`);
    }

    // Get the latest published version
    const latestVersion = versions.items[versions.items.length - 1];

    // Fetch the content with the latest published version
    const content = await this.fetchFromCMS<CMSResponse<T>>(
      `/_cms/preview2/content/${contentKey}/versions/${latestVersion.version}`
    );
    return content;
  }

  private async getImageSrc(imageReference: string): Promise<string> {
    const image = await this.resolveReference(imageReference);
    const imageSrcString = `${CMS_API_BASE_URL}/globalassets/${image?.routeSegment}`;
    return imageSrcString;
  }

  public async getHomeContent(): Promise<HomePageContent> {
    try {
      const homePageKey = '532d21f496944221b01cf9dbcff4f35c';
      const homepageResponse = await this.getLatestPublishedVersion<HomePageCmsContent>(homePageKey);
      const homepage: HomePageContent = {
        metadata: homepageResponse.properties.metadata,
        header: {
          logo: {
            src: await this.getImageSrc(homepageResponse.properties.header.logo),
            alt: JSON.stringify(homepageResponse.properties.header.logo),
          },
          navigation: homepageResponse.properties.header.navigation, 
        },
        footer: homepageResponse.properties.footer,
        hero: {
          title: homepageResponse.properties.hero.title,
          subtitle: homepageResponse.properties.hero.subtitle,
          backgroundImage: await this.getImageSrc(homepageResponse.properties.hero.backgroundImage),
          ctaButton: homepageResponse.properties.hero.ctaButton,
        },
        featuredDestinations: {
          title: homepageResponse.properties.featuredDestinations.title,
          destinations: await Promise.all(homepageResponse.properties.featuredDestinations.destinations.map(async (destination) => {
            return {
              title: destination.title,
              description: destination.description,
              image: await this.getImageSrc(destination.image),
              url: destination.url,
            }
          }))
        }
      };

      return homepage;
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