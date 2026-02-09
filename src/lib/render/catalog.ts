// src/lib/render/catalog.ts
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react";
import { z } from "zod";

// Blog-focused catalog: Card, Text, Button, Input, Textarea
// Actions: posts.list, posts.create, posts.updateStatus
export const catalog = defineCatalog(schema, {
  components: {
    // Containers / Display
    Card: {
      props: z.object({
        title: z.string().optional(),
        description: z.string().nullable().optional(),
      }),
      slots: ["default"],
      description: "Container card with optional title",
    },

    Text: {
      props: z.object({
        content: z.string(),
        muted: z.boolean().nullable().optional(),
      }),
      description: "Text content",
    },

    Button: {
      props: z.object({
        label: z.string(),
        action: z.string(),
        actionParams: z.record(z.string(), z.unknown()).nullable().optional(),
        variant: z
          .enum(["default", "secondary", "destructive", "outline", "ghost"])
          .nullable()
          .optional(),
        disabled: z.boolean().nullable().optional(),
      }),
      description:
        'Clickable button. Use actionParams to pass parameters to the action (e.g., { limit: 5, sort: "newest" })',
    },

    // Form Inputs
    Input: {
      props: z.object({
        label: z.string().nullable().optional(),
        valuePath: z.string(),
        placeholder: z.string().nullable().optional(),
        type: z.enum(["text", "email", "password", "number", "tel"]).nullable().optional(),
      }),
      description: "Text input field bound to a data path",
    },

    Textarea: {
      props: z.object({
        label: z.string().nullable().optional(),
        valuePath: z.string(),
        placeholder: z.string().nullable().optional(),
        rows: z.number().nullable().optional(),
      }),
      description: "Multi-line text input bound to a data path",
    },
  },

  actions: {
    // Blog: Posts
    "posts.list": {
      params: z.object({
        limit: z.number().nullable().optional(),
      }),
      description: "List posts (optionally limited). Uses GET /api/v1/posts",
    },

    "posts.create": {
      params: z.object({
        content: z.string(),
        password: z.string(),
      }),
      description: "Create a post via POST /api/v1/posts",
    },

    "posts.updateStatus": {
      params: z.object({
        id: z.string(),
        status: z.enum(["draft", "published"]),
        password: z.string(),
      }),
      description: "Update a post status via PATCH /api/v1/posts/:id/status",
    },
  },
});
