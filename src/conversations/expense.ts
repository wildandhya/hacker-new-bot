import { type Conversation } from "@grammyjs/conversations";
import { Context } from "grammy/mod.ts";
import { create, list, read, remove, update } from "../services/kv.ts";
import { Expense } from "../models/expense.ts";
import {
  formatDate,
  formatRupiah,
  generateId,
  generateTelegramTable,
} from "../utils/shared.ts";

export async function addExpenseConversation(
  conversation: Conversation,
  ctx: Context,
) {
  await ctx.reply("🗂 Masukkan kategori pengeluaran:");
  const category = await conversation.form.text();

  await ctx.reply("💸 Masukkan jumlah:");
  const amount = await conversation.form.number();

  await ctx.reply("📝 Masukkan catatan:");
  const note = await conversation.form.text();

  const userId = ctx.msg?.chat?.id.toString() || "";
  const username = ctx.msg?.chat?.username || "anonymous";

  const expense: Expense = {
    id: generateId(),
    userId,
    username,
    category,
    amount,
    note,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await create<Expense>("expenses", expense);

  await ctx.reply(
    `✅ Pengeluaran tercatat:\nKategori: ${category}\nJumlah: ${amount}\nCatatan: ${note}`,
  );
}

export async function editExpenseConversation(
  conversation: Conversation,
  ctx: Context,
) {
  const recentExpenses = await list<Expense>("expenses");

  if (recentExpenses.length === 0) {
    await ctx.reply("Tidak ada data pengeluaran yang tersedia.");
    return;
  }

  const last10 = recentExpenses.slice(-10).reverse();

  const headers = ["No", "ID", "Kategori", "Jumlah", "Catatan", "Tanggal"];

  const rows = last10.map((expense, index) => [
    (index + 1).toString(),
    expense.id.slice(0, 8),
    expense.category.slice(0, 8),
    formatRupiah(expense.amount),
    (expense.note || "-").slice(0, 14),
    formatDate(expense.createdAt).slice(0, 19),
  ]);

  const tableMessage = "<b>📊 10 Pengeluaran Terakhir</b>\n\n" +
    generateTelegramTable(headers, rows);

  await ctx.reply(tableMessage, { parse_mode: "HTML" });

  await ctx.reply("🆔 Masukkan ID pengeluaran yang ingin diubah:");
  const expenseId = await conversation.form.text();

  const existingExpense = await read<Expense>("expenses", expenseId);
  if (!existingExpense) {
    await ctx.reply("❌ ID pengeluaran tidak ditemukan!");
    return;
  }

  await ctx.reply(
    `🗂 Masukkan kategori baru atau "-" untuk skip (saat ini: ${existingExpense.category}):`,
  );
  const categoryInput = await conversation.form.text();

  await ctx.reply(
    `💸 Masukkan jumlah baru atau "-" untuk skip (saat ini: ${existingExpense.amount}):`,
  );
  const amountInput = await conversation.form.text();

  await ctx.reply(
    `📝 Masukkan catatan baru atau "-" untuk skip (saat ini: ${
      existingExpense.note || "-"
    })`,
  );
  const noteInput = await conversation.form.text();

  const userId = ctx.msg?.chat?.id.toString() || "";

  const updatedExpense: Expense = {
    ...existingExpense,
    category: categoryInput !== "-" ? categoryInput : existingExpense.category,
    amount: amountInput !== "-"
      ? parseInt(amountInput)
      : existingExpense.amount,
    note: noteInput !== "-" ? noteInput : existingExpense.note,
    updatedAt: new Date().toISOString(),
    updatedBy: userId,
  };

  try {
    await update<Expense>("expenses", updatedExpense);
    await ctx.reply(
      `✅ Pengeluaran berhasil diperbarui`,
    );
  } catch (error) {
    console.error("Error updating expense:", error);
    await ctx.reply(
      `❌ Gagal memperbarui pengeluaran: ${error || "Unknown error"}`,
    );
  }
}

export async function removeExpenseConversation(
  conversation: Conversation,
  ctx: Context,
) {
  const recentExpenses = await list<Expense>("expenses");

  if (recentExpenses.length === 0) {
    await ctx.reply("Tidak ada data pengeluaran yang tersedia.");
    return;
  }

  const last10 = recentExpenses.slice(-10).reverse();

  const headers = ["No", "ID", "Kategori", "Jumlah", "Catatan", "Tanggal"];

  const rows = last10.map((expense, index) => [
    (index + 1).toString(),
    expense.id.slice(0, 8),
    expense.category.slice(0, 8),
    formatRupiah(expense.amount),
    (expense.note || "-").slice(0, 14),
    formatDate(expense.createdAt).slice(0, 19),
  ]);

  const tableMessage = "<b>📊 10 Pengeluaran Terakhir</b>\n\n" +
    generateTelegramTable(headers, rows);

  await ctx.reply(tableMessage, { parse_mode: "HTML" });

  await ctx.reply("Masukkan ID pengeluaran yang ingin diubah:");
  const expenseId = await conversation.form.text();

  const existingExpense = await read<Expense>("expenses", expenseId);
  if (!existingExpense) {
    await ctx.reply("❌ ID pengeluaran tidak ditemukan!");
    return;
  }

  try {
    await remove("expenses", expenseId);
    await ctx.reply(
      `✅ Pengeluaran berhasil dihapus:\nKategori: ${existingExpense.category}\nJumlah: ${existingExpense.amount}\nCatatan: ${existingExpense.note}`,
    );
  } catch (error) {
    console.error("Error removing expense:", error);
    await ctx.reply(
      `❌ Gagal menghapus pengeluaran: ${error || "Unknown error"}`,
    );
  }
}

export async function searchExpenseConversation(
  conversation: Conversation,
  ctx: Context,
) {
  await ctx.reply(
    "🔍 Masukkan kata kunci yang ingin dicari (kategori / catatan):",
  );
  const keyword = (await conversation.form.text()).toLowerCase();

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
