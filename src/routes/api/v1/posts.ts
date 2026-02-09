import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/posts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const upstream = process.env.BLOG_API_BASE;
        if (!upstream) {
          return Response.json({ error: "BLOG_API_BASE not set" }, { status: 500 });
        }
        const url = new URL(request.url);
        const qs = url.search;
        const res = await fetch(`${upstream}/posts${qs}`, {
          headers: baseHeaders("GET"),
        });
        return forward(res);
      },
      POST: async ({ request }) => {
        const upstream = process.env.BLOG_API_BASE;
        if (!upstream) {
          return Response.json({ error: "BLOG_API_BASE not set" }, { status: 500 });
        }
        const body = await request.text();
        const res = await fetch(`${upstream}/posts/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...baseHeaders("POST") },
          body,
        });
        return forward(res);
      },
    },
  },
});

function baseHeaders(method: string): Record<string, string> {
  const headers: Record<string, string> = {};
  // Only add custom header for modifying methods; no Bearer tokens required
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const custom = process.env.BLOG_API_KEY;
    if (custom) headers["X-Custom-Auth-Key"] = custom;
  }
  return headers;
}

async function forward(res: Response) {
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "application/json";
  return new Response(text, { status: res.status, headers: { "Content-Type": contentType } });
}
