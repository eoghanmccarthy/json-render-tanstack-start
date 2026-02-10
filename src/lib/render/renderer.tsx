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
  console.log("DashboardRenderer spec.state", spec?.state);

  // Auto-wire "on" bindings from action props so the LLM doesn't need to generate them
  const resolvedSpec = useMemo(() => {
    if (!spec) return null;
    const elements = { ...spec.elements };
    for (const [key, el] of Object.entries(elements)) {
      if (el.on) continue;
      const props = el.props;
      if (el.type === "Button" && typeof props.action === "string") {
        elements[key] = {
          ...el,
          on: {
            press: {
              action: props.action,
              params: props.actionParams as Record<string, unknown> | undefined,
            },
          },
        };
      } else if (el.type === "Form" && typeof props.submitAction === "string") {
        elements[key] = {
          ...el,
          on: {
            submit: {
              action: props.submitAction,
              params: props.submitActionParams as Record<string, unknown> | undefined,
            },
          },
        };
      }
    }
    return { ...spec, elements };
  }, [spec]);

  if (!resolvedSpec) return null;
  console.log("Rendering Dashboard with spec:", resolvedSpec);

  return (
    <div>
      <StateProvider initialState={state} onStateChange={onStateChange}>
        <VisibilityProvider>
          <ValidationProvider>
            <ActionProvider handlers={actionHandlers}>
              <Renderer
                spec={resolvedSpec}
                registry={registry}
                fallback={fallback}
                loading={loading}
              />
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
