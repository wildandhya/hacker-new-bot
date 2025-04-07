import { Context, SessionFlavor } from "grammy/mod.ts";
import { type ConversationFlavor } from "@grammyjs/conversations";
import { SessionData } from "./session.ts";

export type BotContext =
  & ConversationFlavor<Context>
  & SessionFlavor<SessionData>;
