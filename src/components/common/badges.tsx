import { CheckCircle2, CircleDashed, Loader2, MinusCircle, XCircle, AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { classifyScore, normalizeScore, scoreBandSoft } from "@/utils/score";
import { statusLabel } from "@/utils/status";

export function ScoreBadge({ score, className }: { score: number | null | undefined; className?: string }) {
  const value = normalizeScore(score);
  const { band, label } = classifyScore(value);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium tabular whitespace-nowrap",
        scoreBandSoft[band],
        className,
      )}
      title={label}
    >
      {value === null ? "N/A" : Math.round(value)}
      <span className="opacity-70">· {label}</span>
    </span>
  );
}

const STATUS_STYLE: Record<string, { variant: "success" | "warning" | "danger" | "info" | "muted"; icon: typeof CheckCircle2; spin?: boolean }> = {
  queued: { variant: "muted", icon: CircleDashed },
  running: { variant: "info", icon: Loader2, spin: true },
  completed: { variant: "success", icon: CheckCircle2 },
  partially_completed: { variant: "warning", icon: AlertCircle },
  failed: { variant: "danger", icon: XCircle },
  cancelled: { variant: "muted", icon: MinusCircle },
};

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const style = STATUS_STYLE[status ?? ""] ?? { variant: "muted" as const, icon: CircleDashed };
  const Icon = style.icon;
  return (
    <Badge variant={style.variant}>
      <Icon className={cn("size-3", style.spin && "animate-spin")} aria-hidden />
      {statusLabel(status)}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: string | null | undefined }) {
  const p = (priority ?? "").toLowerCase();
  const variant = p === "high" || p === "critical" ? "danger" : p === "medium" ? "warning" : p === "low" ? "info" : "muted";
  return <Badge variant={variant}>{p ? p.charAt(0).toUpperCase() + p.slice(1) : "Unrated"}</Badge>;
}

export function SeverityBadge({ severity }: { severity: string | null | undefined }) {
  if (!severity) return null;
  return <PriorityBadge priority={severity} />;
}
