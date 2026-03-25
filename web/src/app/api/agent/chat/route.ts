import { auth } from "@/lib/auth";
import { buildSystemPrompt } from "@/lib/agent-prompt";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.AGENT_API_URL || "http://109.230.162.92:44334/v1",
  apiKey: process.env.AGENT_API_KEY || "",
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { messages } = await request.json();

  const userMessages = messages.filter((m: { role: string }) => m.role === "user");
  if (userMessages.length > 20) {
    return new Response(JSON.stringify({ error: "Лимит 20 сообщений" }), { status: 429 });
  }

  const systemPrompt = await buildSystemPrompt();

  try {
    const stream = await client.chat.completions.create({
      model: process.env.AGENT_MODEL || "gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream: true,
      max_tokens: 2048,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (e) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "AI сервис недоступен" }), { status: 503 });
  }
}
