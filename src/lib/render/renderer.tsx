import { Fallback, handlers as createHandlers, registry } from "./registry";
import {
  ActionProvider,
  Renderer,
  StateProvider,
  ValidationProvider,
  VisibilityProvider,
  useUIStream,
} from "@json-render/react";
import type { ComponentRenderer, Spec } from "@json-render/react";
import { useMemo, useRef } from "react";

type SetState = (updater: (prev: Record<string, unknown>) => Record<string, unknown>) => void;

interface DashboardRendererProps {
  spec: Spec | null;
  state?: Record<string, unknown>;
  setState?: SetState;
  onStateChange?: (path: string, value: unknown) => void;
  loading?: boolean;
}

// Fallback component for unknown types
const fallback: ComponentRenderer = ({ element }) => <Fallback type={element.type} />;

export function DashboardRenderer({
  spec,
  state = {},
  setState,
  onStateChange,
  loading,
}: DashboardRendererProps) {
  // Use refs so action handlers always see the latest state/setState
  const stateRef = useRef(state);
  const setStateRef = useRef(setState);
  stateRef.current = state;
  setStateRef.current = setState;

  // Create ActionProvider-compatible handlers using getters so they
  // always read the latest state/setState from refs
  const actionHandlers = useMemo(
    () =>
      createHandlers(
        () => setStateRef.current,
        () => stateRef.current,
      ),
    [],
  );
  // console.log("Action Handlers:", actionHandlers);

  if (!spec) return null;
  // console.log("Rendering Dashboard with spec:", spec, "state:", state);

  return (
    <div>
      <StateProvider initialState={state} onStateChange={onStateChange}>
        <VisibilityProvider>
          <ValidationProvider>
            <ActionProvider handlers={actionHandlers}>
              <Renderer spec={spec} registry={registry} fallback={fallback} loading={loading} />
            </ActionProvider>
          </ValidationProvider>
        </VisibilityProvider>
      </StateProvider>
      {loading ? <div className="text-muted-foreground mt-2 text-xs">Streaming…</div> : null}
    </div>
  );
}

export function useDashboardUIStream() {
  return useUIStream({ api: "/api/generate" });
}
