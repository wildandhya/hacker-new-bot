import { Context } from "grammy/mod.ts";
import reportMenu from "../menu/report.ts";
import { list } from "../services/kv.ts";
import { Expense } from "../models/expense.ts";
import {
  formatDate,
  formatPeriodName,
  formatRupiah,
  generateChartUrl,
  generateTelegramReportTable,
  groupByCategory,
  groupByDateNumber,
  groupByDay,
  groupByMonth,
  isSameDay,
  isSameMonth,
  isSameYear,
} from "../utils/shared.ts";
import { ChartOptions, ReportPeriod } from "../utils/types.ts";
import { BotContext } from "../middlewares/context.ts";
import { format } from "https://esm.sh/date-fns@3.3.1";

export function reportCmd(ctx: Context) {
  return ctx.reply("📊 Laporan Pengeluaran", {
    reply_markup: reportMenu,
    parse_mode: "MarkdownV2",
  });
}

export async function getReport(
  period: ReportPeriod,
  ctx?: Context,
  userId?: string,
): Promise<{ message: string; data: Expense[] }> {
  const data = await list<Expense>("expenses");
  const today = new Date();

  const userFiltered = userId
    ? data.filter((exp) => exp.userId === userId)
    : data;

  let filtered: Expense[] = [];
  let labelTanggal: string;
  let labelPeriode: string;
  const isFromTelegram = ctx && userId;

  if (isFromTelegram) {
    labelPeriode = ctx.from?.username
      ? `@${ctx.from.username}`
      : ctx.from?.first_name || "Pengguna";
  } else {
    labelPeriode = formatPeriodName(period);
  }

  switch (period) {
    case "daily":
      filtered = userFiltered.filter((exp) =>
        isSameDay(new Date(exp.createdAt), today)
      );
      labelTanggal = formatDate(today.toISOString());
      break;

    case "weekly": {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
      filtered = userFiltered.filter((exp) => {
        const created = new Date(exp.createdAt);
        return created >= startDate && created <= today;
      });
      labelTanggal = `${formatDate(startDate.toISOString())} - ${
        formatDate(today.toISOString())
      }`;
      break;
    }

    case "monthly":
      filtered = userFiltered.filter((exp) =>
        isSameMonth(new Date(exp.createdAt), today)
      );
      labelTanggal = format(today, "MMMM yyyy");
      break;

    case "yearly":
      filtered = userFiltered.filter((exp) =>
        isSameYear(new Date(exp.createdAt), today)
      );
      labelTanggal = format(today, "yyyy");
      break;

    default:
      filtered = userFiltered;
      labelTanggal = formatDate(today.toISOString());
  }

  if (filtered.length === 0) {
    return {
      message: `Tidak ada data pengeluaran untuk laporan ${
        formatPeriodName(period)
      }.`,
      data: [],
    };
  }

  const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);

  const headers = ["No", "Kategori", "Jumlah", "Catatan", "Tanggal"];
  const sortedData = [...filtered].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const rows = sortedData.map((expense, index) => [
    (index + 1).toString(),
    expense.category.slice(0, 12),
    formatRupiah(expense.amount),
    (expense.note || "-").slice(0, 20),
    formatDate(expense.createdAt),
  ]);

  const table = generateTelegramReportTable(headers, rows);

  return {
    message: `<b>📊 Laporan Pengeluaran (${labelPeriode})</b>\n` +
      `🗓️ Periode: ${labelTanggal}\n` +
      `💰 Total: ${formatRupiah(total)}\n\n` +
      `Tabel Pengeluaran:\n\n` +
      `${table}`,
    data: filtered,
  };
}

// ========================
// DAILY REPORT
// ========================
export async function dailyReportCmd(ctx: Context) {
  const { message, data } = await getReport("daily", ctx);
  await ctx.reply(message, { parse_mode: "HTML" });

  if (data.length > 0) {
    const { labels, datasets } = groupByCategory(data);
    const params: ChartOptions = {
      type: "doughnut",
      title: "Pengeluaran Harian",
      labels,
      datasets,
    };
    const chartUrl = generateChartUrl(params);
    await ctx.replyWithPhoto(chartUrl, {
      caption: "📊 Grafik Pengeluaran Harian",
    });
  }
}

// ========================
// WEEKLY REPORT
// ========================
export async function weeklyReportCmd(ctx: Context) {
  const { message, data } = await getReport("weekly", ctx);
  await ctx.reply(message, { parse_mode: "HTML" });

  if (data.length > 0) {
    const { labels, datasets } = groupByDay(data);
    const params: ChartOptions = {
      type: "bar",
      title: "Pengeluaran Mingguan",
      labels,
      datasets,
      hideDataLabel: true,
    };
    const chartUrl = generateChartUrl(params);
    await ctx.replyWithPhoto(chartUrl, {
      caption: "📊 Grafik Pengeluaran Mingguan",
    });
  }
}

// ========================
// MONTHLY REPORT
// ========================
export async function monthlyReportCmd(ctx: Context) {
  const { message, data } = await getReport("monthly", ctx);
  await ctx.reply(message, { parse_mode: "HTML" });

  if (data.length > 0) {
    const { labels, datasets } = groupByDateNumber(data);
    const params: ChartOptions = {
      type: "bar",
      title: "Pengeluaran Bulanan",
      labels: labels,
      datasets,
    };
    const chartUrl = generateChartUrl(params);
    await ctx.replyWithPhoto(chartUrl, {
      caption: "📊 Grafik Pengeluaran Bulanan",
    });
  }
}

// ========================
// YEARLY REPORT
// ========================
export async function yearlyReportCmd(ctx: Context) {
  const { message, data } = await getReport("yearly", ctx);
  await ctx.reply(message, { parse_mode: "HTML" });

  if (data.length > 0) {
    const { labels, datasets } = groupByMonth(data);
    const params: ChartOptions = {
      type: "bar",
      title: "Pengeluaran Tahunan",
      labels: labels,
      datasets,
    };
    const chartUrl = generateChartUrl(params);
    await ctx.replyWithPhoto(chartUrl, {
      caption: "📊 Grafik Pengeluaran Tahunan",
    });
  }
}

// ========================
// PERSONAL REPORT
// ========================
export async function personalReportCmd(ctx: BotContext) {
  const userId = ctx.from?.id?.toString();
  if (!userId) {
    await ctx.reply("❌ Gagal mendapatkan ID pengguna.");
    return;
  }

  const { message, data } = await getReport("personal", ctx, userId);
  await ctx.reply(message, { parse_mode: "HTML" });

  if (data.length > 0) {
    const { labels, datasets } = groupByCategory(data);
    const params: ChartOptions = {
      type: "pie",
      title: `Pengeluaran @${ctx.from?.username || "Pribadi"}`,
      labels: labels,
      datasets,
    };
    const chartUrl = generateChartUrl(params);
    await ctx.replyWithPhoto(chartUrl, {
      caption: "📊 Grafik Pengeluaran Pribadi",
    });
  }
}
