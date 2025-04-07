import { Menu } from "@grammyjs/menu";
import { BotContext } from "../middlewares/context.ts";
import { exportCsvCmd } from "../commands/csv.ts";
import { personalReportCmd } from "../commands/report.ts";

const mainMenu = new Menu<BotContext>("main-menu")
  .submenu("📝 Pencatatan", "expense-menu")
  .row()
  .submenu("📊 Laporan", "report-menu")
  .row()
  .text("👤 Rekap Pengeluaran Pribadi", personalReportCmd)
  .row()
  .text("📤 Export CSV", exportCsvCmd);

export default mainMenu;
