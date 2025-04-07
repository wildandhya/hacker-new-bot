import { Context } from "grammy/mod.ts";
import { escapeMarkdownV2 } from "../utils/shared.ts";

export default async function helpCmd(ctx: Context) {
  const message = [
    `🆘 *Bantuan Penggunaan Bot*`,
    ``,
    `Bot ini membantumu mencatat dan melacak pengeluaran pribadi serta menyimpan backup ke Google Drive. Berikut beberapa panduan penggunaan:`,
    ``,
    `▶️ */start* - Mulai menggunakan bot dan menyapa pengguna baru`,
    `ℹ️ */help* - Tampilkan semua perintah dan panduan penggunaan`,
    `📋 */menu* - Tampilkan semua menu utama bot`,
    ``,
    `📝 */catat* - Catat pengeluaran secara manual`,
    `Contoh: \`makan 15000 nasi goreng\``,
    ``,
    `🔍 */cari* - Cari pengeluaran berdasarkan kata kunci`,
    `Contoh: \`/cari makan\``,
    ``,
    `📊 */laporan* - Tampilkan semua menu laporan pengeluaran`,
    `📅 */laporan_harian* - Laporan pengeluaran hari ini`,
    `📆 */laporan_mingguan* - Laporan pengeluaran 7 hari terakhir`,
    `🗓️ */laporan_bulanan* - Laporan pengeluaran bulan ini`,
    `📈 */laporan_tahunan* - Laporan pengeluaran tahun ini`,
    ``,
    `👤 */laporan_pribadi* - Laporan pengeluaran berdasarkan user`,
    ``,
    `📤 */export* - Export seluruh pengeluaran ke format CSV`,
    ``,
    `💡 *Tips*: Gunakan kategori yang konsisten seperti \`makan\`, \`transport\`, \`belanja\`, dll untuk laporan yang lebih akurat.`,
  ].join("\n");

  return await ctx.reply(escapeMarkdownV2(message), {
    parse_mode: "MarkdownV2",
  });
}
