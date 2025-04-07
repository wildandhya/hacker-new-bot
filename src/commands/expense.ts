import { Context } from "grammy/mod.ts";
import { Expense } from "../models/expense.ts";
import { create, list } from "../services/kv.ts";
import {
  formatDate,
  formatRupiah,
  generateId,
  generateTelegramTable,
  isCommand,
} from "../utils/shared.ts";
import { validateExpenseFormat } from "../utils/shared.ts";
import expenseMenu from "../menu/expense.ts";

const kvPrefix = "expenses";

export function expenseCmd(ctx: Context) {
  return ctx.reply("📋 *Bot Asisten Menu*:", {
    reply_markup: expenseMenu,
    parse_mode: "MarkdownV2",
  });
}

export async function addExpenseCmd(ctx: Context) {
  const fullText = ctx.message?.text ?? "";
  const isCmd = isCommand(ctx, "catat");

  const text = isCmd
    ? fullText.split(" ").slice(1).join(" ").trim() // hapus command-nya
    : fullText.trim();
  if (!text) return;

  if (isCmd && !validateExpenseFormat(text)) {
    return ctx.reply(
      "⚠️ Format tidak valid. Contoh: `/catat makan 20000 nasi goreng, jajan 5000 es teh`",
      { parse_mode: "Markdown" },
    );
  }

  const messageId = ctx.msg?.message_id;
  if (!messageId) {
    return ctx.reply("Message ID tidak ditemukan.");
  }

  const userId = ctx.msg?.from?.id.toString() || "";
  const username = ctx.msg?.from?.username || "anonymous";
  const entries = text.split(",").map((s) => s.trim()).filter(Boolean);
  if (entries.length === 0) {
    return;
  }

  const successExpenses: Expense[] = [];
  const failedInputs: string[] = [];

  for (const entry of entries) {
    if (!validateExpenseFormat(entry)) {
      failedInputs.push(entry);
      continue;
    }

    const parts = entry.trim().split(" ");
    const category = parts[0];
    const amount = parts[1];
    const note = parts.slice(2).join(" ");

    const expense: Expense = {
      id: generateId(),
      userId,
      username,
      category: category.toLowerCase(),
      amount: parseInt(amount),
      note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await create<Expense>(kvPrefix, expense);
    successExpenses.push(expense);
  }

  // Format response message
  const successMessages = successExpenses.map((e) => {
    const noteText = e.note ? ` (${e.note})` : "";
    return `📝 *${e.category}*\n💰 ${formatRupiah(e.amount)}${noteText}`;
  });

  let replyMsg =
    `✅ Berhasil mencatat *${successExpenses.length}* pengeluaran:\n\n${
      successMessages.join("\n\n")
    }`;

  if (failedInputs.length > 0) {
    replyMsg += `⚠️ Gagal memproses format salah:\n- ${
      failedInputs.join("\n- ")
    }`;
  }

  return ctx.reply(replyMsg, {
    parse_mode: "Markdown",
    reply_parameters: { message_id: messageId },
  });
}

export async function searchExpenseCmd(ctx: Context) {
  const keyword = ctx.message?.text?.split(" ").slice(1).join(" ")
    .toLowerCase();
  if (!keyword) {
    return ctx.reply(
      "Ketik kata kunci setelah perintah. Contoh:\n`/cari makan`",
      {
        parse_mode: "Markdown",
      },
    );
  }
  const allExpenses = await list<Expense>("expenses");

  if (allExpenses.length === 0) {
    await ctx.reply("❌ Tidak ada data pengeluaran yang tersedia.");
    return;
  }

  const filtered = allExpenses.filter((expense) => {
    const cat = expense.category.toLowerCase();
    const note = (expense.note || "").toLowerCase();
    return cat.includes(keyword) || note.includes(keyword);
  });

  if (filtered.length === 0) {
    await ctx.reply(
      "❌ Tidak ditemukan pengeluaran dengan kata kunci tersebut.",
    );
    return;
  }

  const last10 = filtered.slice(-10).reverse();

  const headers = ["No", "ID", "Kategori", "Jumlah", "Catatan", "Tanggal"];
  const rows = last10.map((expense, index) => [
    (index + 1).toString(),
    expense.id.slice(0, 8),
    expense.category.slice(0, 8),
    formatRupiah(expense.amount),
    (expense.note || "-").slice(0, 14),
    formatDate(expense.createdAt).slice(0, 19),
  ]);

  const tableMessage = `<b>📊 Hasil Pencarian Pengeluaran</b>\n\n` +
    generateTelegramTable(headers, rows);

  await ctx.reply(tableMessage, { parse_mode: "HTML" });
}
