import { Chat } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { createRedisState } from "@chat-adapter/state-redis";

export const bot = new Chat({
    userName: process.env.TELEGRAM_BOT_USERNAME!,
    state: createRedisState({
        url: process.env.REDIS_URL!,
    }),
    adapters: {
        telegram: createTelegramAdapter(),
    },
});

bot.onNewMention(async (thread, message) => {
    await thread.post(`You said: ${message.text}`);
});