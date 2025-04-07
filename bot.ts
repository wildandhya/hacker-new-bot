import { Bot, GrammyError, HttpError, session } from "grammy/mod.ts";
import { env } from "./src/config/env.ts";
import { initialSession } from "./src/middlewares/session.ts";
import { BotContext } from "./src/middlewares/context.ts";
import { conversations } from "@grammyjs/conversations";
import commandsComposer, { setupCommandMenu } from "./src/commands/mod.ts";
import conversationsComposer from "./src/conversations/mod.ts";
import menusComposer from "./src/menu/mod.ts";

export const bot = new Bot<BotContext>(env.BOT_TOKEN);

// Bot initialization + middleware setup
bot.use(session({ initial: initialSession }));
bot.use(conversations());

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

bot.use(conversationsComposer);
bot.use(menusComposer);
bot.use(commandsComposer);

await setupCommandMenu(bot);
