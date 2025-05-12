# Project commands
dev: ## Run the bot with env loaded
	@source env.sh && deno run --watch --allow-env --allow-import --allow-net --allow-read --unstable-kv --unstable-cron poll.ts

deploy: ## Deploy to deno deploy
	deployctl deploy --project=hacker-news-bot --entrypoint=server.ts --prod

format: ## Format code using deno fmt
	@deno fmt

lint: ## Lint your code
	@deno lint

set-webhook: ## Set the webhook for the bot
	@curl -X POST https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<YOUR_DENO_DEPLOY_URL>/<BOT_TOKEN>

del-webhook: ## Delete the webhook for the bot
	@curl -X POST https://api.telegram.org/bot<BOT_TOKEN>/deleteWebhook

get-bot-info: ## Get the bot info
	@curl -X POST https://api.telegram.org/bot<BOT_TOKEN>/getUpdates