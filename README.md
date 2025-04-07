# 🤖 Bot Expense Tracker

A Telegram bot built with Deno and grammY to help track daily expenses.

## 🌟 Features

- 💰 Track expenses with categories
- 📊 Generate reports (daily, weekly, monthly, yearly)
- 📈 Visualize spending with charts
- 👤 Personal expense tracking
- 💾 Data persistence using Deno KV

## 🔜 Upcoming Features

- ⏰ Daily expense reminders
- 💵 Monthly budget planning and alerts
- 🔄 Recurring expense automation


## 🛠️ Tech Stack

- [Deno](https://deno.land/) - Runtime environment
- [grammY](https://grammy.dev/) - Telegram Bot framework
- [Deno KV](https://deno.com/kv) - Key-value database
- [QuickChart](https://quickchart.io/) - Chart generation

## 🚀 Getting Started
### Local Development
1. Clone the repository
```bash
git clone https://github.com/yourusername/marbot.git
cd marbot
```

2. Create a `env.sh` file:
```env
export BOT_TOKEN=your_telegram_bot_token
```

3. Run the bot:
```bash
make dev
```
### Production Deployment
1. Install Deno Deploy CLI:
```bash
deno install -A --no-check -r -f https://deno.land/x/deploy/deployctl.ts
```

2. Login to Deno Deploy:
```bash
deployctl login
 ```

3. Create new project on Deno Deploy
4. Configure environment variables:
   
   - Go to project settings
   - Add BOT_TOKEN with your Telegram bot token
5. Deploy your bot:
```bash
deployctl deploy --project=your-project-name --entrypoint=server.ts
 ```

6. Set up Telegram Webhook:
   - Replace YOUR_BOT_TOKEN and YOUR_DENO_DEPLOY_URL
```bash
curl -X POST https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<YOUR_DENO_DEPLOY_URL>/
```

## 📝 Commands

- `/start` - Start the bot
- `/menu` - Show main menu
- `/catat` - Record new expense
- `/laporan` - View expense reports
- `/export` - Export expense data to CSV

## 📊 Expense Format

```
/catat category amount note 
# or use free text
makan 50000 note
```

Example:
```
/catat makan 50000 lunch with friends
```

Multiple expenses:
```
/catat makan 50000 lunch, transport 25000 grab
```
