import { catalog } from "@/lib/render/catalog";
import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";

const SYSTEM_PROMPT = catalog.prompt();
const DEFAULT_MODEL = "anthropic/claude-haiku-4.5";

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: any = {};
        try {
          body = await request.json();
        } catch {}
        const { prompt = "", context } = body || {};

        let fullPrompt = String(prompt);
        if (context?.data) {
          try {
            fullPrompt += `\n\nAVAILABLE DATA:\n${JSON.stringify(context.data, null, 2)}`;
          } catch {}
        }

        const result = streamText({
          model: process.env.AI_GATEWAY_MODEL || DEFAULT_MODEL,
          system: SYSTEM_PROMPT,
          prompt: fullPrompt,
          temperature: 0.7,
        });

        return result.toTextStreamResponse();
      },
    },
  },
});
