import { Composer } from "grammy/mod.ts";
import { BotContext } from "../middlewares/context.ts";
import mainMenu from "./main_menu.ts";
import expenseMenu from "./expense.ts";
import reportMenu from "./report.ts";

const menusComposer = new Composer<BotContext>();

mainMenu.register(expenseMenu);
mainMenu.register(reportMenu);

menusComposer.use(mainMenu);

export default menusComposer;
