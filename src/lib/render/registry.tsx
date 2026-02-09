import { catalog } from "./catalog";
import { Button as UIButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input as UIInput } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import { Textarea as UITextarea } from "@/components/ui/textarea";
import { findFormValue, getByPath } from "@json-render/core";
// src/lib/render/registry.tsx
import { defineRegistry, useData } from "@json-render/react";

export const { registry, handlers } = defineRegistry(catalog, {
  components: {
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
    Button: ({ props, onAction, loading }) => (
      <UIButton
        variant={props.variant ?? "default"}
        disabled={loading || (props.disabled ?? false)}
        onClick={() =>
          onAction?.({
            name: props.action,
            params: props.actionParams ?? undefined,
          })
        }
      >
        {loading ? "..." : props.label}
      </UIButton>
    ),
    Input: ({ props }) => {
      const { data, set } = useData();
      const value = (getByPath(data, props.valuePath) as string) ?? "";
      return (
        <div className="flex flex-col gap-2">
          {props.label ? <UILabel htmlFor={props.valuePath}>{props.label}</UILabel> : null}
          <UIInput
            id={props.valuePath}
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
      const { data, set } = useData();
      const value = (getByPath(data, props.valuePath) as string) ?? "";
      return (
        <div className="flex flex-col gap-2">
          {props.label ? <UILabel htmlFor={props.valuePath}>{props.label}</UILabel> : null}
          <UITextarea
            id={props.valuePath}
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

    "posts.create": async (params, setData, data) => {
      const content = (findFormValue("content", params, data) as string) ?? "";
      const password = (findFormValue("password", params, data) as string) ?? "";
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
        if (!res.ok) throw new Error(json?.error || "Failed to create post");
        // Refresh list after create
        try {
          const listRes = await fetch("/api/v1/posts");
          const posts = await listRes.json();
          if (listRes.ok) {
            setData((prev: any) => ({
              ...prev,
              posts,
              form: { ...(prev?.form ?? {}), content: "", password: "" },
            }));
          }
        } catch {}
      } catch (err) {
        console.error("posts.create failed", err);
      }
    },

    "posts.updateStatus": async (params, setData, data) => {
      const id = String(findFormValue("id", params, data) ?? "");
      const status = String(findFormValue("status", params, data) ?? "");
      const password = String(findFormValue("password", params, data) ?? "");
      if (!id || !status || !password) {
        console.warn("Missing required fields for posts.updateStatus");
        return;
      }
      try {
        const res = await fetch(`/api/v1/posts/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, password }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to update post status");
        // Refresh list after update
        try {
          const listRes = await fetch("/api/v1/posts");
          const posts = await listRes.json();
          if (listRes.ok) setData((prev: any) => ({ ...prev, posts }));
        } catch {}
      } catch (err) {
        console.error("posts.updateStatus failed", err);
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
