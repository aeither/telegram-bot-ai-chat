import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
});

const MODEL = "openrouter/free";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN!;

async function sendMessage(chatId: number, text: string) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
    });
}

async function sendTyping(chatId: number) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendChatAction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, action: "typing" }),
    });
}

export async function POST(request: Request): Promise<Response> {
    // Validate secret token
    const secret = request.headers.get("x-telegram-bot-api-secret-token");
    if (secret !== WEBHOOK_SECRET) {
        return new Response("Unauthorized", { status: 401 });
    }

    const update = await request.json();

    const message = update?.message;
    if (!message?.text) {
        return new Response("OK");
    }

    const chatId: number = message.chat.id;
    const userText: string = message.text;

    try {
        await sendTyping(chatId);

        const { text } = await generateText({
            model: openrouter(MODEL),
            messages: [{ role: "user", content: userText }],
        });

        await sendMessage(chatId, text);
    } catch (err) {
        console.error("Error generating response:", err);
        await sendMessage(chatId, "Sorry, something went wrong. Please try again.");
    }

    return new Response("OK");
}
