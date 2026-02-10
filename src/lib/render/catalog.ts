import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react";
import { z } from "zod";

// Blog-focused catalog: Card, Text, Button, Input, Textarea
// Actions: posts.list, posts.create
export const catalog = defineCatalog(schema, {
  components: {
    // Layout
    Stack: {
      props: z.object({
        direction: z.enum(["horizontal", "vertical"]).nullable(),
        gap: z.enum(["sm", "md", "lg"]).nullable(),
      }),
      slots: ["default"],
      description: "Flex layout container",
      example: { direction: "vertical", gap: "md" },
    },

    // Containers / Display
    Card: {
      props: z.object({
        title: z.string().optional(),
        description: z.string().nullable().optional(),
      }),
      slots: ["default"],
      description:
        "Container card for content sections. Use for forms/content boxes, NOT for page headers.",
      example: { title: "Overview", description: "Your account summary" },
    },

    // Typography
    Text: {
      props: z.object({
        content: z.string(),
        muted: z.boolean().nullable().optional(),
      }),
      description: "Text content",
      example: { content: "Welcome back! Here is your overview." },
    },

    // Form
    Button: {
      props: z.object({
        label: z.string(),
        action: z.string(),
        actionParams: z.record(z.string(), z.unknown()).nullable().optional(),
        variant: z
          .enum(["default", "secondary", "destructive", "outline", "ghost"])
          .nullable()
          .optional(),
        disabled: z.boolean().nullable(),
      }),
      description:
        'Clickable button. Use actionParams to pass parameters to the action (e.g., { limit: 5, sort: "newest" })',
      example: { label: "Save", variant: "default", action: "formSubmit" },
    },

    Input: {
      props: z.object({
        label: z.string().nullable().optional(),
        valuePath: z.string(),
        placeholder: z.string().nullable().optional(),
        type: z.enum(["text", "email", "password", "number", "tel"]).nullable().optional(),
      }),
      description: "Text input field",
      example: {
        label: "Email",
        valuePath: "/form/email",
        placeholder: "you@example.com",
        type: "email",
      },
    },

    Textarea: {
      props: z.object({
        label: z.string().nullable().optional(),
        valuePath: z.string(),
        placeholder: z.string().nullable().optional(),
        rows: z.number().nullable().optional(),
      }),
      description: "Multi-line text input",
    },
  },

  actions: {
    // Blog: Posts
    "posts.list": {
      params: z.object({
        limit: z.number().nullable().optional(),
      }),
      description: "Fetch posts from GET /api/v1/posts. Supports ?limit=N.",
    },

    "posts.create": {
      params: z.object({
        content: z.string(),
        password: z.string(),
      }),
      description:
        "Create a post via POST /api/v1/posts. Inputs MUST use valuePaths matching param names exactly: /content and /password",
    },

    "debug.alert": {
      params: z.object({
        message: z.string().optional(),
      }),
      description: "Show a native browser alert. Useful for testing button actions.",
    },
  },
});
