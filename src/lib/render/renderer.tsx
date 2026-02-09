import {
  ActionProvider,
  DataProvider,
  Renderer,
  ValidationProvider,
  VisibilityProvider,
  useUIStream,
} from "@json-render/react";
// src/lib/render/renderer.tsx
import { Fallback, registry, handlers as registryHandlers } from "./registry";

export function DashboardRenderer({ spec, loading }: { spec: any; loading?: boolean }) {
  const fallback = ({ element }: any) => <Fallback type={element.type} />;

  if (!spec) return null;

  return (
    <div>
      <DataProvider initialData={{}}>
        <VisibilityProvider>
          <ValidationProvider>
            <ActionProvider handlers={registryHandlers}>
              <Renderer spec={spec} registry={registry} fallback={fallback} loading={loading} />
            </ActionProvider>
          </ValidationProvider>
        </VisibilityProvider>
      </DataProvider>
      {loading ? <div className="text-muted-foreground mt-2 text-xs">Streaming…</div> : null}
    </div>
  );
}

export function useDashboardUIStream() {
  return useUIStream({ api: "/api/generate" });
}
