import * as React from "react";

import { DashboardRenderer, useDashboardUIStream } from "@/lib/render/renderer";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";


const PROMPTS = [
  "Create a widget with content and password fields for creating a new post.",
];

export function Widget() {
  const [prompt, setPrompt] = React.useState(PROMPTS[0] ?? "");
  const [state, setState] = React.useState<Record<string, unknown>>({});
  const stateRef = React.useRef(state);

  const { spec, isStreaming, error, send, clear } = useDashboardUIStream();

  // Keep stateRef in sync
  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const handleStateChange = React.useCallback((path: string, value: unknown) => {
    path = path.startsWith("/") ? path.slice(1) : path; // strip leading slash
    setState((prev) => {
      const next = { ...prev };
      // Convert path like "customerForm/name" to nested object
      const parts = path.split("/");
      let current: Record<string, unknown> = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]!;
        if (!(part in current) || typeof current[part] !== "object") {
          current[part] = {};
        }
        current = current[part] as Record<string, unknown>;
      }
      const lastPart = parts[parts.length - 1]!;
      current[lastPart] = value;
      return next;
    });
  }, []);

  const handleGenerate = React.useCallback(
      async (text?: string) => {
        const p = text || prompt;
        if (!p.trim()) return;
        if (text) setPrompt(text);
        await send(p, { state });
        // onGenerated?.();
      },
      [prompt, send, state],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // send(prompt);
            handleGenerate()
          }}
          className="flex gap-2"
        >
          <Input
            type="text"
            placeholder="Ask for a UI"
            value={prompt}
            onChange={(e) => setPrompt(e.currentTarget.value)}
          />
          <Button type="submit" disabled={isStreaming || !prompt.trim()}>Generate</Button>
          <Button type="button" variant="outline" onClick={() => clear()}>
            Clear
          </Button>
        </form>

        {error ? <div className="text-destructive text-sm">{String(error)}</div> : null}

        <DashboardRenderer
          spec={spec}
          state={state}
          setState={setState}
          onStateChange={handleStateChange}
          loading={isStreaming}
        />
      </CardContent>
    </Card>
  );
}
