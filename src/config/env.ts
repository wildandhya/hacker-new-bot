const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
if (!BOT_TOKEN) throw new Error("BOT_TOKEN not set");

export const env = {
  BOT_TOKEN,
};
