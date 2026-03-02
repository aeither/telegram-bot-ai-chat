import { Chat } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { createMemoryState } from "@chat-adapter/state-memory";
import { streamText, generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
});

// Pick any model from openrouter.ai/models
const MODEL = "anthropic/claude-3.5-sonnet";

export const bot = new Chat({
    userName: process.env.TELEGRAM_BOT_USERNAME!,
    state: createMemoryState(),
    adapters: {
        telegram: createTelegramAdapter(),
    },
});

// Handle all direct messages (match any text)
bot.onNewMessage(/.*/, async (thread, message) => {
    if (!message.text) return;

    await thread.startTyping();

    // streamText uses post-then-edit fallback on Telegram
    const { textStream } = streamText({
        model: openrouter(MODEL),
        messages: [{ role: "user", content: message.text }],
    });

    await thread.post(textStream);
});

// Handle @mentions (in groups)
bot.onNewMention(async (thread, message) => {
    if (!message.text) return;

    await thread.startTyping();

    const { text } = await generateText({
        model: openrouter(MODEL),
        prompt: message.text,
    });

    await thread.post(text);
});
