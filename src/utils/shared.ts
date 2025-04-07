import { Context } from "grammy/mod.ts";
import { chartBackgroundColors, expenseFormatRegex } from "./constants.ts";
import { ChartOptions, ReportPeriod } from "./types.ts";
import { Expense } from "../models/expense.ts";

export function formatDate(date: string): string {
  return new Date(date).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function escapeMarkdownV2(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export function isCommand(ctx: Context, command: string): boolean {
  const text = ctx.message?.text ?? "";
  const entities = ctx.message?.entities ?? [];

  return entities.some((e) => {
    return e.type === "bot_command" &&
      text.slice(e.offset, e.offset + e.length) === `/${command}`;
  });
}

export function validateExpenseFormat(text: string): boolean {
  if (text.includes(",")) {
    return text.split(",").every((entry) =>
      expenseFormatRegex.test(entry.trim())
    );
  }
  return expenseFormatRegex.test(text.trim());
}

export function generateId(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function pad(text: string, length: number): string {
  return text + " ".repeat(Math.max(length - text.length, 0));
}

export function generateTelegramTable(
  headers: string[],
  rows: string[][],
): string {
  const columnWidths = headers.map((_, colIndex) =>
    Math.max(
      headers[colIndex].length,
      ...rows.map((row) => (row[colIndex] || "").length),
    )
  );

  const line = (cols: string[]) =>
    "| " +
    cols.map((text, i) => pad(text, columnWidths[i])).join(" | ") +
    " |";

  const divider = "|-" +
    columnWidths.map((w) => "-".repeat(w)).join("-|-") +
    "-|";

  const content = [line(headers), divider, ...rows.map((row) => line(row))];

  return `<pre>\n${content.join("\n")}\n</pre>`;
}

function extractNumber(value: string): number {
  const cleaned = value.replace(/[^\d]/g, "");
  return Number(cleaned);
}

export function generateTelegramReportTable(
  headers: string[],
  rows: string[][],
): string {
  const columnWidths = headers.map((_, colIndex) =>
    Math.max(
      headers[colIndex].length,
      ...rows.map((row) => (row[colIndex] || "").length),
    )
  );

  const line = (cols: string[]) =>
    cols.map((text, i) => pad(text, columnWidths[i])).join("   ");

  const divider = columnWidths.map((w) => "-".repeat(w)).join("   ");

  const content = [
    line(headers),
    divider,
    ...rows.map((row) => line(row)),
    divider,
  ];

  return `<pre>\n${content.join("\n")}\n</pre>`;
}

export function generateTelegramReportTableWithTotal(
  headers: string[],
  rows: string[][],
  totalColumnIndex: number, // indeks kolom yang ingin dijumlahkan
): string {
  const columnWidths = headers.map((_, colIndex) =>
    Math.max(
      headers[colIndex].length,
      ...rows.map((row) => (row[colIndex] || "").length),
    )
  );

  const line = (cols: string[]) =>
    cols.map((text, i) => pad(text, columnWidths[i])).join("   ");

  const divider = columnWidths.map((w) => "-".repeat(w)).join("   ");

  // Hitung total
  const total = rows.reduce((sum, row) => {
    return sum + extractNumber(row[totalColumnIndex] || "0");
  }, 0);

  const totalRow = headers.map((_, i) =>
    i === totalColumnIndex ? `Rp ${total.toLocaleString("id-ID")}` : ""
  );

  const content = [
    line(headers),
    divider,
    ...rows.map((row) => line(row)),
    divider,
    line(totalRow),
  ];

  return `<pre>\n${content.join("\n")}\n</pre>`;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isSameWeek(date1: Date, date2: Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const startOfWeek = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Senin sebagai awal minggu
    return new Date(d.setDate(diff));
  };
  return startOfWeek(d1).toDateString() === startOfWeek(d2).toDateString();
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

export function isSameYear(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear();
}

export function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

export function formatPeriodName(period: ReportPeriod): string {
  switch (period) {
    case "daily":
      return "Harian";
    case "weekly":
      return "Mingguan";
    case "monthly":
      return "Bulanan";
    case "yearly":
      return "Tahunan";
    default:
      return period;
  }
}

export function generateChartUrl(params: ChartOptions): string {
  const labelsString = JSON.stringify(params.labels);
  const datasetsString = JSON.stringify(params.datasets);

  // Formatter untuk Doughnut atau chart lain
  const formatterFn = params.type === "doughnut"
    ? `(value) => {
        if (value <= 0) return '';
        return 'Rp ' + value.toLocaleString('id-ID');
      }`
    : `(value) => {
        if (value <= 0) return '';
        return value;
      }`;

  // Konfigurasi plugin datalabels
  const datalabelsConfig = params.hideDataLabel
    ? `{
        "display": false
      }`
    : `{
        "color": "#000",
        "font": {
          "size": 10
        },
        "formatter": ${formatterFn}
      }`;

  const configStr = `{
    "type": "${params.type}",
    "data": {
      "labels": ${labelsString},
      "datasets": ${datasetsString}
    },
    "options": {
      "plugins": {
        "datalabels": ${datalabelsConfig}
      }
    }
  }`;

  const encoded = encodeURIComponent(configStr);
  return `https://quickchart.io/chart?c=${encoded}&v=2.9.4`;
}

// Helper untuk group by category
export function groupByCategory(
  data: Expense[],
): Pick<ChartOptions, "labels" | "datasets"> {
  const grouped = data.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(grouped).map((cat) =>
      cat.charAt(0).toUpperCase() + cat.slice(1)
    ),
    datasets: [
      {
        data: Object.values(grouped),
        backgroundColor: chartBackgroundColors,
      },
    ],
  };
}

const getRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

export function groupByDay(
  data: Expense[],
): Pick<ChartOptions, "labels" | "datasets"> {
  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  // Group: { category: { Senin: nominal, Selasa: nominal, ... } }
  const grouped: Record<string, Record<string, number>> = {};

  data.forEach((item) => {
    const dayName = dayNames[new Date(item.createdAt).getDay()];
    if (!grouped[item.category]) grouped[item.category] = {};
    grouped[item.category][dayName] = (grouped[item.category][dayName] || 0) +
      item.amount;
  });

  const labels = dayNames;
  const datasets = Object.entries(grouped).map(([category, values]) => ({
    label: category.charAt(0).toUpperCase() + category.slice(1),
    data: labels.map((day) => values[day] || 0),
    backgroundColor: [getRandomColor()],
  }));

  return { labels, datasets };
}

export function groupByMonth(
  data: Expense[],
): Pick<ChartOptions, "labels" | "datasets"> {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const grouped: Record<string, Record<string, number>> = {};

  data.forEach((item) => {
    const monthName = monthNames[new Date(item.createdAt).getMonth()];
    if (!grouped[item.category]) grouped[item.category] = {};
    grouped[item.category][monthName] =
      (grouped[item.category][monthName] || 0) + item.amount;
  });

  const labels = monthNames;
  const datasets = Object.entries(grouped).map(([category, values]) => ({
    label: category.charAt(0).toUpperCase() + category.slice(1),
    data: labels.map((month) => values[month] || 0),
    backgroundColor: [getRandomColor()],
  }));

  return {
    labels,
    datasets,
  };
}

export function groupByDateNumber(
  data: Expense[],
): Pick<ChartOptions, "labels" | "datasets"> {
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const grouped: Record<string, Record<string, number>> = {};

  data.forEach((item) => {
    const dateObj = new Date(item.createdAt);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = monthNames[dateObj.getMonth()];
    const label = `${day} ${month}`; // "06 April"

    if (!grouped[item.category]) grouped[item.category] = {};
    grouped[item.category][label] = (grouped[item.category][label] || 0) +
      item.amount;
  });

  // Ambil semua label unik dari semua kategori
  const allLabelsSet = new Set<string>();
  Object.values(grouped).forEach((categoryData) => {
    Object.keys(categoryData).forEach((label) => allLabelsSet.add(label));
  });

  const allLabels = Array.from(allLabelsSet).sort((a, b) => {
    const parse = (label: string) => {
      const [day, monthName] = label.split(" ");
      const monthIndex = monthNames.indexOf(monthName);
      return new Date(2024, monthIndex, parseInt(day));
    };
    return +parse(a) - +parse(b);
  });

  const datasets = Object.entries(grouped).map(([category, values]) => ({
    label: category.charAt(0).toUpperCase() + category.slice(1),
    data: allLabels.map((label) => values[label] || 0),
    backgroundColor: [getRandomColor()],
  }));

  return {
    labels: allLabels,
    datasets,
  };
}

export function toWIBISOString(date = new Date()): string {
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000); // UTC time
  const wibOffset = 7 * 60 * 60000; // WIB = UTC+7
  return new Date(utc + wibOffset).toISOString();
}
