import { InputFile } from "grammy/mod.ts";
import { format } from "https://esm.sh/date-fns@3.3.1";
import { formatDate } from "../utils/shared.ts";
import { Expense } from "../models/expense.ts";
import { BotContext } from "../middlewares/context.ts";
import { list } from "../services/kv.ts";

export async function exportCsvCmd(ctx: BotContext) {
  const data = await list<Expense>("expenses");

  if (data.length === 0) {
    await ctx.reply("❌ Tidak ada data pengeluaran untuk diekspor.");
    return;
  }

  const header = ["Tanggal", "Kategori", "Nominal", "Catatan"];
  const rows = data.map((item) => [
    formatDate(item.createdAt),
    item.category,
    item.amount.toString(),
    item.note || "-",
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map((item) => `"${item.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const arrayBuffer = await blob.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);

  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
  const filename = `pengeluaran_${timestamp}.csv`;

  await ctx.replyWithDocument(new InputFile(uint8, filename), {
    caption: "📤 Berikut data pengeluaran kamu dalam format CSV.",
  });
}
