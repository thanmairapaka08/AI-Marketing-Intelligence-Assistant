import { createFileRoute } from "@tanstack/react-router";
import { Bot, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge } from "@/components/common/badges";
import { useAudits } from "@/features/audits/hooks";
import { formatDate } from "@/utils/format";
import { getDomain } from "@/utils/url";

export const Route = createFileRoute("/_authenticated/recommendations")({
  head: () => ({
    meta: [
      { title: "AI Recommendations — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Prioritised improvements from your audits." },
      { property: "og:title", content: "AI Recommendations — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Prioritised improvements from your audits." },
    ],
  }),
  component: () => <RecommendationsPage />,
});

function RecommendationsPage() {
  const { data, isPending } = useAudits();

  // Collect all recommendations from all audits
  const allRecommendations = data?.items?.flatMap((audit) =>
    (audit.recommendations || []).map((rec: any) => ({
      ...rec,
      audit_id: audit.id,
      audit_url: audit.url,
      audit_domain: audit.domain,
      audit_date: audit.completed_at || audit.created_at,
    }))
  ) || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Recommendations"
        description="Prioritised improvements from your completed audits."
      />

      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded bg-muted animate-pulse" />
          ))}
        </div>
      ) : allRecommendations && allRecommendations.length > 0 ? (
        <div className="space-y-4">
          {allRecommendations.map((rec) => (
            <Card key={rec.id ?? rec.audit_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{rec.title}</CardTitle>
                  <PriorityBadge priority={rec.priority} />
                </div>
                <CardDescription>{rec.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div>
                    <span className="font-medium text-muted-foreground">Priority: </span>
                    {rec.priority}
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Impact: </span>
                    {rec.expected_impact ?? rec.impact}
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Effort: </span>
                    {rec.estimated_effort ?? rec.effort}
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">From: </span>
                    {rec.audit_domain ?? getDomain(rec.audit_url)} ({formatDate(rec.audit_date)})
                  </div>
                </div>
                {rec.steps && rec.steps.length > 0 && (
                  <ol className="mt-3 list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    {rec.steps.slice(0, 3).map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No recommendations yet. Complete an audit to see AI suggestions.</p>
      )}
    </div>
  );
}