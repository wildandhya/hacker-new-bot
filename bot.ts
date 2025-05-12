import { Bot, GrammyError, HttpError, session } from "grammy/mod.ts";
import { env } from "./src/config/env.ts";
import { initialSession } from "./src/middlewares/session.ts";
import { BotContext } from "./src/middlewares/context.ts";
import { HackerNewsService, HackerNewsStory, StoryType } from "./src/services/hacker-news.ts";
import { formatStoryMessage } from "./src/utils/shared.ts";
import { kv } from "./src/services/kv.ts";

export const bot = new Bot<BotContext>(env.BOT_TOKEN);

// Bot initialization + middleware setup
bot.use(session({ initial: initialSession }));

bot.catch((err) => {
  console.error(`Error while handling update ${err.ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});



const hackerNewsService = new HackerNewsService(env.HACKER_NEWS_API_URL);

async function sendPeriodicNotification() {
  try {
    // Skip if no notification chat is configured
    if (!env.NOTIFICATION_CHAT_ID) return;

    const types: StoryType[] = ["topstories", "newstories", "beststories"];
    const allStories: HackerNewsStory[] = [];

    for (const type of types) {
      const stories = await hackerNewsService.getStories(
        type,
        Number(env.MAX_STORIES),
        Number(env.STORY_AGE_HOURS),
      );
      allStories.push(...stories);
    }

    const seen = new Set<number>();

    for (const story of allStories) {
      if (seen.has(story.id)) continue;
      seen.add(story.id);

      const key = ["sent_story", story.id];
      const existing = await kv.get(key);
      if (existing.value !== null) {
        console.log(`Skipping already sent story ID: ${story.id}`);
        continue;
      }

      const message = formatStoryMessage(story);
      await bot.api.sendMessage(env.NOTIFICATION_CHAT_ID, message, {
        parse_mode: "Markdown",
      });

      await kv.set(key, true, { expireIn: 60 * 60 * 24 * 1000 }); // 24h TTL
    }
  } catch (error) {
    console.error('Error in periodic notification:', error);
  }
}

Deno.cron("Schedule Reminders", env.CRON_SCHEDULE, async () => {
  console.log("Sending periodic notification...");
	await sendPeriodicNotification();
});