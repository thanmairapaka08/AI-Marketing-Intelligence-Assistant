import { Bot, ChevronDown, Cog } from "lucide-react";
import { useState } from "react";

import { PriorityBadge } from "@/components/common/badges";
import { UrlList } from "@/components/common/url-list";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/services/types";
import { humanize } from "@/utils/format";

export function SourceBadge({ source }: { source: string | undefined }) {
  if (!source) return null;
  const ai = source.toLowerCase().includes("gemini") || source.toLowerCase() === "ai";
  return (
    <Badge variant={ai ? "primary" : "muted"}>
      {ai ? <Bot className="size-3" /> : <Cog className="size-3" />}
      {ai ? "Gemini AI" : "Rule-based"}
    </Badge>
  );
}

export function RecommendationCard({ rec, compact = false }: { rec: Recommendation; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const impact = rec.expected_impact ?? rec.impact;
  const effort = rec.estimated_effort ?? rec.effort;
  const category = rec.category ?? rec.metric;
  const hasDetails = !compact && ((rec.steps?.length ?? 0) > 0 || (rec.affected_urls?.length ?? 0) > 0);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-xl border bg-card">
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={rec.priority} />
          {category && <Badge variant="outline">{humanize(category)}</Badge>}
          <SourceBadge source={rec.source} />
        </div>
        <h3 className="mt-2.5 text-sm font-semibold">{rec.title}</h3>
        {rec.description && (
          <p className={cn("mt-1 text-sm text-muted-foreground", compact && "line-clamp-2")}>{rec.description}</p>
        )}
        {!compact && (impact || effort) && (
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs">
            {impact && (
              <div className="flex gap-1.5"><dt className="text-muted-foreground">Expected impact</dt><dd className="font-medium">{impact}</dd></div>
            )}
            {effort && (
              <div className="flex gap-1.5"><dt className="text-muted-foreground">Effort</dt><dd className="font-medium">{effort}</dd></div>
            )}
          </dl>
        )}
        {hasDetails && (
          <CollapsibleTrigger className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            {open ? "Hide details" : "Show steps and affected URLs"}
            <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
          </CollapsibleTrigger>
        )}
      </div>
      {hasDetails && (
        <CollapsibleContent className="space-y-4 border-t px-4 py-4">
          {rec.steps && rec.steps.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">Steps</p>
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                {rec.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
          )}
          {rec.affected_urls && rec.affected_urls.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">Affected URLs</p>
              <UrlList urls={rec.affected_urls} />
            </div>
          )}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}
