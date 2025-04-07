import { Menu } from "@grammyjs/menu";
import { BotContext } from "../middlewares/context.ts";
import {
  dailyReportCmd,
  monthlyReportCmd,
  weeklyReportCmd,
  yearlyReportCmd,
} from "../commands/report.ts";

const reportMenu = new Menu<BotContext>("report-menu")
  .text("📅 Hari", dailyReportCmd)
  .row()
  .text("📅 Minggu", weeklyReportCmd)
  .row()
  .text("📅 Bulan", monthlyReportCmd)
  .row()
  .text("📅 Tahun", yearlyReportCmd)
  .row()
  .back("↩️ Kembali");

export default reportMenu;
