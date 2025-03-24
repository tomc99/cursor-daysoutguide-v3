import { HomePageContent } from '@/types/content';
import { cmsService } from './cmsService';

type PageContent = HomePageContent; // Add more page content types as needed

class ContentService {
  private static instance: ContentService;
  private contentCache: Map<string, PageContent> = new Map();

  private constructor() {}

  public static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  /**
   * Get content for a specific page
   * @param pageId - The identifier for the page content (e.g., 'home', 'destinations')
   * @returns The content for the specified page
   */
  public async getPageContent(pageId: string): Promise<PageContent> {
    // Check cache first
    const cachedContent = this.contentCache.get(pageId);
    if (cachedContent) {
      return cachedContent;
    }

    // If not in cache, fetch from CMS
    try {
      let content: PageContent;
      switch (pageId) {
        case 'home':
          content = await cmsService.getHomeContent();
          break;
        default:
          throw new Error(`Content not found for page: ${pageId}`);
      }
      
      this.contentCache.set(pageId, content);
      return content;
    } catch (error) {
      console.error(`Error fetching content for page ${pageId}:`, error);
      throw new Error(`Content not found for page: ${pageId}`);
    }
  }

  /**
   * Get home page content
   * @returns The home page content
   */
  public async getHomeContent(): Promise<HomePageContent> {
    return this.getPageContent('home');
  }

  /**
   * Clear the content cache
   */
  public clearCache(): void {
    this.contentCache.clear();
    cmsService.clearCache();
  }
}

// Export a singleton instance for server-side use
export const contentService = ContentService.getInstance();

// Export a function to get content for server components
export async function getContent(pageId: string): Promise<PageContent> {
  return contentService.getPageContent(pageId);
}

// Export a function to get home content for server components
export async function getHomeContent(): Promise<HomePageContent> {
  return contentService.getHomeContent();
} 