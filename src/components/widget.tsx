import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardRenderer, useDashboardUIStream } from "@/lib/render/renderer";
import * as React from "react";

const PROMPTS = [
  "Create a Card titled ‘New Post’. Add a Textarea labeled ‘Content’. Add an Input labeled ‘Password’ with type ‘password’. Add a Button labeled ‘Create Post’ with action ‘posts.create’.",
];

export function Widget() {
  const { spec, isStreaming, error, send, clear } = useDashboardUIStream();
  const [prompt, setPrompt] = React.useState(PROMPTS[0] ?? "");
  const [state, setState] = React.useState<Record<string, unknown>>({});
  const stateRef = React.useRef(state);

  // Keep stateRef in sync
  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const handleStateChange = React.useCallback((path: string, value: unknown) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(prompt);
          }}
          className="flex gap-2"
        >
          <input
            className="border-input flex-1 rounded-md border px-2 py-1 text-sm"
            placeholder="Ask for a UI"
            value={prompt}
            onChange={(e) => setPrompt(e.currentTarget.value)}
          />
          <Button type="submit">Generate</Button>
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
