import { Chat } from "chat";
import { createTelegramAdapter } from "@chat-adapter/telegram";
import { createMemoryState } from "@chat-adapter/state-memory";

export const bot = new Chat({
    userName: "mybot",
    state: createMemoryState(),
    adapters: {
        telegram: createTelegramAdapter(),
    },
});

bot.onNewMention(async (thread, message) => {
    await thread.post(`You said: ${message.text}`);
});