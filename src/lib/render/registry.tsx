import { findFormValue } from "@json-render/core";
import { defineRegistry } from "@json-render/react";
import { shadcnComponents } from "@json-render/shadcn";

import { catalog } from "./catalog";

export const { registry, handlers, executeAction } = defineRegistry(catalog, {
  components: {
    Button: shadcnComponents.Button,
    Card: shadcnComponents.Card,
    Grid: shadcnComponents.Grid,
    Heading: shadcnComponents.Heading,
    Input: shadcnComponents.Input,
    Text:shadcnComponents.Text,
    Textarea: shadcnComponents.Textarea,
    Toggle: shadcnComponents.Toggle,
    Select: shadcnComponents.Select,
    Separator: shadcnComponents.Separator,
    Slider: shadcnComponents.Slider,
    Spinner: shadcnComponents.Spinner,
    Skeleton: shadcnComponents.Skeleton,
    Stack: shadcnComponents.Stack,
    Switch: shadcnComponents.Switch,

  },
  actions: {
    "posts.list": async (params, setData) => {
      try {
        const query = new URLSearchParams();
        if (params?.limit != null) query.set("limit", String(params.limit));
        const url = `/api/v1/posts${query.toString() ? `?${query}` : ""}`;
        const res = await fetch(url);
        const posts = await res.json();
        if (!res.ok) throw new Error(posts?.error || "Failed to list posts");
        setData((prev: any) => ({ ...prev, posts }));
      } catch (err) {
        console.error("posts.list failed", err);
      }
    },

    "debug.alert": async (params) => {
      const message = (params as Record<string, unknown>)?.message ?? "Button clicked!";
      alert(String(message));
    },

    "posts.create": async (params, setState, state) => {
      console.log("posts.create action called with params", params, "and data", state);
      // const content = findFormValue("content", params, state) as string;
      // const password = findFormValue("password", params, state) as string;

      const { content, password } = params as Record<string, string>;

      if (!content || !password) {
        console.warn("Missing required fields for posts.create");
        return;
      }
      try {
        const res = await fetch("/api/v1/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, password }),
        });
        const json = await res.json();

        if (res.ok) {
          //
        } else {
          throw new Error(json?.error || "Failed to create post");
        }
      } catch (err) {
        console.error("posts.create failed", err);
      }
    },
  },
});

// =============================================================================
// Fallback Component
// =============================================================================

export function Fallback({ type }: { type: string }) {
  return (
    <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
      Unknown component: {type}
    </div>
  );
}
