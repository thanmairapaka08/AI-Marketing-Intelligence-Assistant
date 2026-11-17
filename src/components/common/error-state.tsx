import { AlertTriangle, Construction, PlugZap, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toApiError } from "@/services/errors";

/**
 * Explains a failed request honestly: backend unreachable, endpoint not built
 * yet, or a real error — instead of showing empty or zero values.
 */
export function ErrorState({
  error,
  onRetry,
  feature,
  className,
  compact = false,
}: {
  error: unknown;
  onRetry?: () => void;
  feature?: string;
  className?: string;
  compact?: boolean;
}) {
  const apiError = toApiError(error);
  const config =
    apiError.kind === "network" || apiError.kind === "timeout"
      ? {
          icon: PlugZap,
          title: "Backend not connected",
          body: apiError.message,
        }
      : apiError.kind === "unavailable"
        ? {
            icon: Construction,
            title: `${feature ?? "This feature"} isn't available yet`,
            body: "The backend endpoint for this hasn't been implemented. It will appear here automatically once it is.",
          }
        : {
            icon: AlertTriangle,
            title: `Couldn't load ${feature ? feature.toLowerCase() : "this data"}`,
            body: apiError.message,
          };

  const Icon = config.icon;
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed bg-surface/50 text-center",
        compact ? "px-4 py-8" : "px-6 py-12",
        className,
      )}
    >
      <span className="mb-3 grid size-10 place-items-center rounded-lg border bg-card text-muted-foreground shadow-card">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="text-sm font-semibold">{config.title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{config.body}</p>
      {onRetry && apiError.kind !== "unavailable" && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          <RotateCw /> Try again
        </Button>
      )}
    </div>
  );
}
