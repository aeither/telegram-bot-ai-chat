# Telegram AI Bot 🤖

A Next.js Telegram bot using **Chat SDK**, **Vercel AI SDK**, and **OpenRouter**.

## Stack

- **Framework**: Next.js (App Router) on Vercel
- **Bot Platform**: `chat` + `@chat-adapter/telegram`
- **AI Provider**: OpenRouter (`anthropic/claude-3.5-sonnet` by default)
- **Runtime**: Node.js (Vercel Serverless)

## Local Development

```bash
bun install
bun run dev
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in [vercel.com](https://vercel.com)
3. Add the following **Environment Variables** in Vercel → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Your bot token from @BotFather |
| `TELEGRAM_WEBHOOK_SECRET_TOKEN` | Any random secret string |
| `TELEGRAM_BOT_USERNAME` | Your bot username (without `@`) |
| `OPENROUTER_API_KEY` | Your OpenRouter API key |

## Register the Webhook (after deploy)

Replace `YOUR_VERCEL_DOMAIN` with your actual Vercel deployment URL:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://YOUR_VERCEL_DOMAIN/api/webhooks/telegram",
    "secret_token": "$TELEGRAM_WEBHOOK_SECRET_TOKEN",
    "allowed_updates": ["message", "callback_query"]
  }'
```

Verify it:

```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo"
```

## Switching Models

Edit the `MODEL` constant in `lib/bot.ts`:

| Model | Notes |
|---|---|
| `anthropic/claude-3.5-sonnet` | Best all-round (default) |
| `google/gemini-2.0-flash-001` | Fast + cheap |
| `deepseek/deepseek-r1` | Strong reasoning |
| `openai/gpt-4o` | OpenAI via OpenRouter |
| `meta-llama/llama-3.3-70b-instruct` | Open-source |

## Adding Conversation Memory (Redis)

```bash
bun add @chat-adapter/state-redis ioredis
```

See the main spec for the full Redis integration code.
