# 🤖 Bot Hacker News

A Telegram bot built with Deno and grammY to get Hacker News.

## 🚀 Getting Started

### Local Development

1. Clone the repository

```bash
git clone https://github.com/yourusername/hacker-news-bot.git
cd hacker-news-bot
```

2. Copy `env.sh.example` file:
```bash
cp env.sh.example env.sh
```
3. Run the bot:

```bash
make dev
```

### Production Deployment

1. Install Deno Deploy CLI:

```bash
deno install -gArf jsr:@deno/deployctl
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
deployctl deploy --project=your-project-name --entrypoint=server.ts --prod
```

6. Set up Telegram Webhook:
   - Replace YOUR_BOT_TOKEN and YOUR_DENO_DEPLOY_URL

```bash
curl -X POST https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<YOUR_DENO_DEPLOY_URL>/<BOT_TOKEN>
```