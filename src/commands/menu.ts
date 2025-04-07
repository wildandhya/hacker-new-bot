import { Context } from "grammy/mod.ts";
import mainMenu from "../menu/main_menu.ts";

export function menuCmd(ctx: Context) {
  return ctx.reply("📋 *Bot Asisten Menu*:", {
    reply_markup: mainMenu,
    parse_mode: "MarkdownV2",
  });
}
