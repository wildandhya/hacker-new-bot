# Project commands
dev: ## Run the bot with env loaded
	@source env.sh && deno run --watch --allow-env --allow-import --allow-net --allow-read --unstable-kv poll.ts

deploy: ## Deploy to deno deploy
	deployctl deploy --project=marbot --entrypoint=server.ts

format: ## Format code using deno fmt
	@deno fmt

lint: ## Lint your code
	@deno lint

