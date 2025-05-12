import { HackerNewsStory, StoryType } from "../services/hacker-news.ts";

export function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#\+\-=|{}.!])/g, '\\$1');
}

export function formatStoryMessage(story: HackerNewsStory): string {
  const age = Math.round((Date.now() / 1000 - story.time) / 3600);
  const typeAlias = story.type === 'topstories' ? 'Top Stories' : story.type === "newstories" ? 'New Stories' : 'Best Stories';
  return `🔥 *Hacker News ${typeAlias}* 🔥

*${escapeMarkdown(story.title)}*

👤 Author: ${escapeMarkdown(story.by)}
⏰ ${age} hours ago
👍 Votes: ${story.score}
🔗 [Read More](${story.url || `https://news.ycombinator.com/item?id=${story.id}`})`;
}