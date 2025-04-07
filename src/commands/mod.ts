import { Bot, Composer } from "grammy/mod.ts";
import startCmd from "./start.ts";
import helpCmd from "./help.ts";
import { menuCmd } from "./menu.ts";
import {
  dailyReportCmd,
  monthlyReportCmd,
  personalReportCmd,
  reportCmd,
  weeklyReportCmd,
  yearlyReportCmd,
} from "./report.ts";
import { addExpenseCmd, searchExpenseCmd } from "./expense.ts";
import { BotContext } from "../middlewares/context.ts";
import { expenseFormatRegex } from "../utils/constants.ts";
import { exportCsvCmd } from "./csv.ts";

const commandsComposer = new Composer<BotContext>();

commandsComposer.command("start", startCmd);
commandsComposer.command("help", helpCmd);
commandsComposer.command("menu", menuCmd);
commandsComposer.command("laporan", reportCmd);
commandsComposer.command("laporan_harian", dailyReportCmd);
commandsComposer.command("laporan_mingguan", weeklyReportCmd);
commandsComposer.command("laporan_bulanan", monthlyReportCmd);
commandsComposer.command("laporan_tahunan", yearlyReportCmd);
commandsComposer.command("laporan_pribadi", personalReportCmd);
commandsComposer.command("catat", addExpenseCmd);
commandsComposer.command("cari", searchExpenseCmd);
commandsComposer.command("export", exportCsvCmd);

// Handler untuk command /catat
commandsComposer.hears(expenseFormatRegex, addExpenseCmd);

export async function setupCommandMenu(bot: Bot<BotContext>) {
  await bot.api.setMyCommands([
    {
      command: "start",
      description: "Mulai menggunakan bot dan menyapa pengguna baru",
    },
    {
      command: "help",
      description: "Tampilkan semua perintah dan panduan penggunaan",
    },
    { command: "menu", description: "Tampilkan semua menu utama bot" },
    {
      command: "laporan",
      description: "Tampilkan semua menu report pengeluaran",
    },
    {
      command: "laporan_harian",
      description: "Tampilkan report pengeluaran harian",
    },
    {
      command: "laporan_mingguan",
      description: "Tampilkan report pengeluaran mingguan",
    },
    {
      command: "laporan_bulanan",
      description: "Tampilkan report pengeluaran bulanan",
    },
    {
      command: "laporan_tahunan",
      description: "Tampilkan report pengeluaran tahunan",
    },
    {
      command: "laporan_pribadi",
      description: "Tampilkan report pengeluaran pribadi",
    },
    { command: "catat", description: "Catat pengeluaran secara manual" },
    { command: "cari", description: "Cari pengeluaran berdasarkan kata kunci" },
    {
      command: "export",
      description: "Export seluruh pengeluaran ke format CSV",
    },
  ]);
  console.log("Command menu setup complete");
}

export default commandsComposer;
