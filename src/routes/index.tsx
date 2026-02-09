import { Widget } from "@/components/widget.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: RouteComponent });

function RouteComponent() {
  return (
    <div className="bg-background w-full">
      <div className="mx-auto grid min-h-screen w-full max-w-2xl min-w-0 content-center items-start gap-8 p-12">
        <Widget />
      </div>
    </div>
  );
}
