# 🤖 Telegram AI Bot

A stateless Telegram AI chatbot built with **Next.js** and **OpenRouter**, deployed on **Vercel**.

## How It Works

- Telegram sends messages to the `/api/webhooks/telegram` webhook
- The handler calls **OpenRouter** (`openrouter/auto`) to generate a response
- The reply is sent back directly via the Telegram Bot API
- Fully stateless — no database or memory required, works perfectly on serverless

## Stack

- [Next.js](https://nextjs.org/) — API route for the webhook
- [Vercel AI SDK](https://sdk.vercel.ai/) — `generateText` for LLM calls
- [OpenRouter](https://openrouter.ai/) — model routing (`openrouter/auto`)
- [Vercel](https://vercel.com/) — deployment

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/aeither/telegram-bot-ai-chat.git
cd telegram-bot-ai-chat
bun install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_SECRET_TOKEN=your_secret_token
TELEGRAM_BOT_USERNAME=your_bot_username
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3. Deploy to Vercel

```bash
vercel deploy
```

Add all the environment variables above in your Vercel project settings.

### 4. Register the Webhook

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://<YOUR_VERCEL_DOMAIN>/api/webhooks/telegram",
    "secret_token": "<YOUR_SECRET_TOKEN>",
    "allowed_updates": ["message", "callback_query"]
  }'
```

### 5. Verify the Webhook

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

## Project Structure

```
app/
  api/
    webhooks/
      telegram/
        route.ts   # Stateless webhook handler
app/
  page.tsx         # Landing page
```
