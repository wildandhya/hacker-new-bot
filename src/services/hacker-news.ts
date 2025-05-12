export interface HackerNewsStory {
  id: number;
  title: string;
  url?: string;
  by: string;
  time: number;
  type: string;
  score: number;
}

export type StoryType = "topstories" | "newstories" | "beststories";

export class HackerNewsService {
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl;
  }

  async getTopStories(
    maxStories: number = 5, 
    maxAgeHours: number = 24
  ): Promise<HackerNewsStory[]> {
    try {
      // Fetch top story IDs
      const response = await fetch(`${this.apiBaseUrl}/topstories.json`);
      const topStoryIds: number[] = await response.json();

      // Fetch details for top stories
      const storyDetailsPromises = topStoryIds
        .slice(0, maxStories)
        .map(id => this.fetchStoryDetails(id));

      const stories = await Promise.all(storyDetailsPromises);

      if (!stories) {
        return [];
      }

      // Filter stories based on criteria
      return stories.filter(story => 
        // Ensure it's a valid story
        story && 
        story.type === 'story' && 
        // Check story age
        (Date.now() / 1000 - story.time) / 3600 <= maxAgeHours &&
        // Ensure story has a title and either a URL or is a Show HN post
        story.title && 
        (story.url || story.title.startsWith('Show HN:'))
      ) as HackerNewsStory[];
    } catch (error) {
      console.error('Error fetching Hacker News stories:', error);
      return [];
    }
  }

  async getStories(
    type: StoryType,
    maxStories: number = 5, 
    maxAgeHours: number = 24
  ): Promise<HackerNewsStory[]> {
    try {
      // Fetch top story IDs
      const response = await fetch(`${this.apiBaseUrl}/${type}.json`);
      const topStoryIds: number[] = await response.json();

      // Fetch details for top stories
      const storyDetailsPromises = topStoryIds
        .slice(0, maxStories)
        .map(id => this.fetchStoryDetails(id));

      const stories = await Promise.all(storyDetailsPromises);

      if (!stories) {
        return [];
      }

      // Filter stories based on criteria
      return stories.filter(story => 
        // Ensure it's a valid story
        story && 
        story.type === 'story' && 
        // Check story age
        (Date.now() / 1000 - story.time) / 3600 <= maxAgeHours &&
        // Ensure story has a title and either a URL or is a Show HN post
        story.title && 
        (story.url || story.title.startsWith('Show HN:'))
      ) as HackerNewsStory[];
    } catch (error) {
      console.error('Error fetching Hacker News stories:', error);
      return [];
    }
  }

  private async fetchStoryDetails(storyId: number): Promise<HackerNewsStory | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/item/${storyId}.json`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching story ${storyId}:`, error);
      return null;
    }
  }
}