import { webhookCallback } from "grammy/mod.ts";
import { bot } from "./bot.ts";

const handleUpdate = webhookCallback(bot, "std/http");
Deno.serve(async (req) => {
  if (req.method === "POST") {
    const url = new URL(req.url);
    if (url.pathname.slice(1) === bot.token) {
      try {
        return await handleUpdate(req);
      } catch (e) {
        console.error(e);
        return new Response("Internal Server Error", { status: 500 });
      }
    }
    return new Response("Not Found", { status: 404 });
  }
  return new Response("Method Not Allowed", { status: 405 });
});
