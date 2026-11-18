import { AlertTriangle, CheckCircle2, FileText, Image, Link2, Heading1 } from "lucide-react";

import { ScoreGauge } from "@/components/common/score-gauge";

/** Static marketing illustration of the audit report. Not connected to any data. */
const SAMPLE = [
  { label: "Title & meta", value: 82, icon: FileText },
  { label: "Broken links", value: 94, icon: Link2 },
  { label: "Alt text", value: 61, icon: Image },
  { label: "Headings", value: 88, icon: Heading1 },
];

export function DashboardPreview() {
  return (
    <figure className="relative mx-auto w-full max-w-5xl">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-elevated">
        <div className="flex items-center gap-2 border-b bg-surface px-4 py-3">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="ml-3 truncate rounded-md border bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground">
            app / audits / example-store.com
          </span>
        </div>
        <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center justify-center rounded-xl border bg-surface/50 p-5">
            <ScoreGauge score={84} size={140} />
            <p className="mt-3 text-xs text-muted-foreground">142 pages crawled</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {SAMPLE.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="size-4" aria-hidden /> {label}
                  </span>
                  <span className="font-semibold tabular">{value}</span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
            <div className="flex items-start gap-3 rounded-xl border bg-warning-soft/50 p-4 sm:col-span-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
              <div className="text-sm">
                <p className="font-medium">38 product images are missing alt text</p>
                <p className="mt-0.5 text-muted-foreground">Recommendation: add descriptive alt attributes on /products/*</p>
              </div>
              <CheckCircle2 className="ml-auto size-4 shrink-0 text-muted-foreground" aria-hidden />
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">Illustrative preview of an audit report</figcaption>
    </figure>
  );
}
