import { bot } from "./bot.ts";

bot.catch(console.error);

await bot.api.deleteWebhook();

bot.start({
  onStart: (bot) => console.log(`Bot ${bot.username} is running! 🚀`, ""),
  drop_pending_updates: true,
});
