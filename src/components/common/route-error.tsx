import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { reportLovableError } from "@/lib/lovable-error-reporting";

export function RouteError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "route_error_component" });
  }, [error]);

  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <span className="mb-4 grid size-11 place-items-center rounded-xl bg-danger-soft text-danger">
        <AlertTriangle className="size-5" aria-hidden />
      </span>
      <h2 className="text-lg font-semibold">This section ran into a problem</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The rest of the app still works. Try again, or go back to the dashboard.
      </p>
      <div className="mt-6 flex gap-2">
        <Button
          onClick={() => {
            void router.invalidate();
            reset();
          }}
        >
          Try again
        </Button>
        <Button variant="outline" onClick={() => void router.navigate({ to: "/dashboard" })}>
          Dashboard
        </Button>
      </div>
    </div>
  );
}
