import { catalog } from "./catalog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { findFormValue, getByPath } from "@json-render/core";
import { defineRegistry, useStateStore } from "@json-render/react";

export const { registry, handlers, executeAction } = defineRegistry(catalog, {
  components: {
    Stack: ({ props, children }) => {
      const gapClass =
          { sm: "gap-2", md: "gap-4", lg: "gap-6" }[props.gap ?? "md"] ??
          "gap-4";
      return (
          <div
              className={`flex ${props.direction === "horizontal" ? "flex-row" : "flex-col"} ${gapClass}`}
          >
            {children}
          </div>
      );
    },
    Card: ({ props, children }) => (
      <Card>
        {(props.title || props.description) && (
          <CardHeader>
            {props.title ? <CardTitle>{props.title}</CardTitle> : null}
            {props.description ? <CardDescription>{props.description}</CardDescription> : null}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
        <CardFooter />
      </Card>
    ),
    Text: ({ props }) => (
      <p className={props.muted ? "text-muted-foreground" : ""}>{props.content}</p>
    ),
    Button: ({ props, emit, loading }) => (
      <Button
        variant={props.variant ?? "default"}
        disabled={loading || (props.disabled ?? false)}
        onClick={() => {
          console.log("Button clicked:", props.action, props.actionParams, props.label, emit);
          return emit?.("press");
        }}
      >
        {loading ? "..." : props.label}
      </Button>
    ),
    Input: ({ props }) => {
      const { state, set } = useStateStore();
      const value = (getByPath(state, props.valuePath) as string) ?? "";
      console.log("Rendering Input:", "props.valuePath", props.valuePath, "with value:", value);
      return (
        <div className="flex flex-col gap-2">
          {props.label ? <Label>{props.label}</Label> : null}
          <Input
            type={props.type ?? "text"}
            value={value}
            placeholder={props.placeholder ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              set(props.valuePath, e.target.value)
            }
          />
        </div>
      );
    },
    Textarea: ({ props }) => {
      const { state, set } = useStateStore();
      const value = (getByPath(state, props.valuePath) as string) ?? "";
      return (
        <div className="flex flex-col gap-2">
          {props.label ? <Label>{props.label}</Label> : null}
          <Textarea
            value={value}
            placeholder={props.placeholder ?? ""}
            rows={props.rows ?? 4}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              set(props.valuePath, e.target.value)
            }
          />
        </div>
      );
    },
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
      const content = (findFormValue("content", params, state) as string) ?? "";
      const password = (findFormValue("password", params, state) as string) ?? "";

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
