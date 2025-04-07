import { createConversation } from "@grammyjs/conversations";
import {
  addExpenseConversation,
  editExpenseConversation,
  removeExpenseConversation,
  searchExpenseConversation,
} from "./expense.ts";
import { BotContext } from "../middlewares/context.ts";
import { Composer } from "grammy/mod.ts";

const conversationsComposer = new Composer<BotContext>();
conversationsComposer.use(createConversation(addExpenseConversation));
conversationsComposer.use(createConversation(editExpenseConversation));
conversationsComposer.use(createConversation(removeExpenseConversation));
conversationsComposer.use(createConversation(searchExpenseConversation));

export default conversationsComposer;
