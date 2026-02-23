import { createFileRoute } from "@tanstack/react-router";
import { buildUserPrompt } from "@json-render/core";
import { streamText } from "ai";

import { catalog } from "@/lib/render/catalog";

export const maxDuration = 30;

const SYSTEM_PROMPT = catalog.prompt({
  customRules: [
    "Use Card as root for forms and small UIs.",
    "Use Grid for multi-column layouts.",
  ],
});
const DEFAULT_MODEL = "anthropic/claude-haiku-4.5";

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { prompt, context } = await request.json();

        const userPrompt = buildUserPrompt({
          prompt,
          state: context?.state,
        });

        const result = streamText({
          model: process.env.AI_GATEWAY_MODEL || DEFAULT_MODEL,
          system: SYSTEM_PROMPT,
          prompt: userPrompt,
          temperature: 0.7,
        });

        return result.toTextStreamResponse();
      },
    },
  },
});
