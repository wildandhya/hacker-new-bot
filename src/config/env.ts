const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
if (!BOT_TOKEN) throw new Error("BOT_TOKEN not set");

const HACKER_NEWS_API_URL = Deno.env.get("HACKER_NEWS_API_URL");
if (!HACKER_NEWS_API_URL) throw new Error("HACKER_NEWS_API_URL not set");

const NOTIFICATION_CHAT_ID = Deno.env.get("NOTIFICATION_CHAT_ID");
if (!NOTIFICATION_CHAT_ID) throw new Error("NOTIFICATION_CHAT_ID not set");

const CRON_SCHEDULE = Deno.env.get("CRON_SCHEDULE");
if (!CRON_SCHEDULE) throw new Error("CRON_SCHEDULE not set");

const MAX_STORIES = Deno.env.get("MAX_STORIES");
if (!MAX_STORIES) throw new Error("MAX_STORIES not set");

const STORY_AGE_HOURS = Deno.env.get("STORY_AGE_HOURS");
if (!STORY_AGE_HOURS) throw new Error("STORY_AGE_HOURS not set");

export const env = {
  BOT_TOKEN,
  HACKER_NEWS_API_URL,
  NOTIFICATION_CHAT_ID,
  CRON_SCHEDULE,
  MAX_STORIES,
  STORY_AGE_HOURS
};
