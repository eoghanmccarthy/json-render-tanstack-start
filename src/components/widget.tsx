import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardRenderer, useDashboardUIStream } from "@/lib/render/renderer";
// src/components/Widget.tsx

export function Widget() {
  const { spec, isStreaming, error, send, clear } = useDashboardUIStream();
  const [prompt, setPrompt] = React.useState("");

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

        <DashboardRenderer spec={spec} loading={isStreaming} />
      </CardContent>
    </Card>
  );
}
