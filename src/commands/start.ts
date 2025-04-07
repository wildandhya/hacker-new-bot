import { Context } from "grammy/mod.ts";
import { escapeMarkdownV2 } from "../utils/shared.ts";

export default async function startCmd(ctx: Context) {
  const name = ctx.from?.first_name || "teman";

  const message = [
    `👋 Halo *${
      escapeMarkdownV2(name)
    }*\\! Selamat datang di bot asisten pribadimu\\.`,
    "",
    `Silahkan ketik /menu untuk interaktif menu atau /help untuk melihat daftar perintah`,
  ].join("\n");

  return await ctx.reply(message, { parse_mode: "MarkdownV2" });
}
