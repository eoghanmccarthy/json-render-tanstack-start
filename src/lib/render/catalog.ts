import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { shadcnComponentDefinitions } from "@json-render/shadcn/catalog";
import { z } from "zod";


export const catalog = defineCatalog(schema, {
  components: {
    Button: shadcnComponentDefinitions.Button,
    Card: shadcnComponentDefinitions.Card,
    Grid: shadcnComponentDefinitions.Grid,
    Heading: shadcnComponentDefinitions.Heading,
    Input: shadcnComponentDefinitions.Input,
    Text:shadcnComponentDefinitions.Text,
    Textarea: shadcnComponentDefinitions.Textarea,
    Toggle: shadcnComponentDefinitions.Toggle,
    Select: shadcnComponentDefinitions.Select,
    Separator: shadcnComponentDefinitions.Separator,
    Slider: shadcnComponentDefinitions.Slider,
    Spinner: shadcnComponentDefinitions.Spinner,
    Skeleton: shadcnComponentDefinitions.Skeleton,
    Stack: shadcnComponentDefinitions.Stack,
    Switch: shadcnComponentDefinitions.Switch,
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
        "Create a post via POST /api/v1/posts. Expects 'content' and 'password' fields from form values.",
    },

    "debug.alert": {
      params: z.object({
        message: z.string().optional(),
      }),
      description: "Show a native browser alert. Useful for testing button actions.",
    },
  },
});
