import { Menu } from "@grammyjs/menu";
import { BotContext } from "../middlewares/context.ts";

const expenseMenu = new Menu<BotContext>("expense-menu")
  .text(
    "🆕 Tambah",
    async (ctx) => await ctx.conversation.enter("addExpenseConversation"),
  )
  .row()
  .text(
    "✏️ Edit",
    async (ctx) => await ctx.conversation.enter("editExpenseConversation"),
  )
  .row()
  .text(
    "🗑️ Hapus",
    async (ctx) => await ctx.conversation.enter("removeExpenseConversation"),
  )
  .row()
  .text(
    "🔎 Cari",
    async (ctx) => await ctx.conversation.enter("searchExpenseConversation"),
  )
  .row()
  .text("⬅️ Kembali", (ctx) => ctx.menu.back());

export default expenseMenu;
