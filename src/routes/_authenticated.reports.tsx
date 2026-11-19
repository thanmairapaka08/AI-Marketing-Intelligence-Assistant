import { createFileRoute, Link } from "@tanstack/react-router";
import { FileDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAudits } from "@/features/audits/hooks";
import { formatDate } from "@/utils/format";
import { getDomain } from "@/utils/url";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Download PDF, CSV and JSON audit reports." },
      { property: "og:title", content: "Reports — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Download PDF, CSV and JSON audit reports." },
    ],
  }),
  component: () => <ReportsPage />,
});

function ReportsPage() {
  const { data, isPending } = useAudits();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Download audit reports in PDF, CSV, or JSON format."
      />

      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded bg-muted animate-pulse" />
          ))}
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <div className="space-y-4">
          {data.items.map((audit) => (
            <Card key={audit.id ?? audit.audit_id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{audit.domain ?? getDomain(audit.url)}</CardTitle>
                    <CardDescription>
                      Completed: {formatDate(audit.completed_at ?? audit.created_at)} • Score: {audit.overall_score ?? audit.score}/100
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/audits/${audit.id ?? audit.audit_id}`}>View</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href={`/api/v1/audits/${audit.id ?? audit.audit_id}/export/pdf`} download>
                        <FileDown className="mr-2 size-4" /> PDF
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href={`/api/v1/audits/${audit.id ?? audit.audit_id}/export/csv`} download>
                        CSV
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href={`/api/v1/audits/${audit.id ?? audit.audit_id}/export/json`} download>
                        JSON
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No completed audits to report on yet.</p>
      )}
    </div>
  );
}