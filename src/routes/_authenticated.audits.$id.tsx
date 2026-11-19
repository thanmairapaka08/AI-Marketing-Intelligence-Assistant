import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileDown, Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAudit } from "@/features/audits/hooks";
import { ScoreBadge } from "@/components/common/badges";
import { ScoreGauge } from "@/components/common/score-gauge";
import { reportsService } from "@/services/reports.service";
import { formatDate, formatNumber } from "@/utils/format";
import { getDomain } from "@/utils/url";

export const Route = createFileRoute("/_authenticated/audits/$id")({
  params: (schema) => ({ id: schema.string.required() }),
  head: () => ({
    meta: [
      { title: "Audit Report — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Detailed technical SEO audit report." },
      { property: "og:title", content: "Audit Report — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Detailed technical SEO audit report." },
    ],
  }),
  component: () => <AuditReportPage />,
});

function AuditReportPage() {
  const { id } = Route.useParams();
  const { data: audit, isPending, error } = useAudit(id);

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Audit Report</h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="h-64 rounded bg-muted animate-pulse" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 rounded bg-muted animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Audit Not Found</h1>
        <p className="text-muted-foreground">
          The audit could not be loaded. It may have been deleted or is still processing.
        </p>
        <Button asChild>
          <Link to="/history">View audit history</Link>
        </Button>
      </div>
    );
  }

  const domain = audit.domain ?? getDomain(audit.url) ?? "Unknown";
  const score = audit.overall_score ?? audit.score;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {domain} {score !== undefined && <ScoreBadge score={score} className="ml-2 inline" />}
          </h1>
          <p className="text-muted-foreground">
            Audit completed: {formatDate(audit.completed_at ?? audit.created_at)} • Pages crawled:{" "}
            {formatNumber(audit.pages_crawled)}
          </p>
        </div>
        <Button asChild>
          <Link to="/history">
            <FileDown className="mr-2 size-4" />
            Back to History
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ScoreGauge score={score} size={120} showLabel={false} />
          <p className="mt-2 text-center text-sm font-medium">Overall SEO Score</p>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="pt-4">
              <MetricsTab audit={audit} />
            </TabsContent>

            <TabsContent value="recommendations" className="pt-4">
              <RecommendationsTab audit={audit} />
            </TabsContent>

            <TabsContent value="reports" className="pt-4">
              <ReportsTab audit={audit} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function MetricsTab({ audit }: { audit: any }) {
  const metrics = audit.metrics;
  if (!metrics) return <p className="text-muted-foreground">No metrics available.</p>;

  const metricKeys: { key: string; label: string; weight: number }[] = [
    { key: "title_meta", label: "Title & Meta", weight: 25 },
    { key: "broken_links", label: "Broken Links", weight: 25 },
    { key: "image_alt", label: "Image Alt Text", weight: 15 },
    { key: "headings", label: "Headings", weight: 20 },
    { key: "canonical", label: "Canonical Tags", weight: 15 },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Each metric is weighted and contributes to the overall score.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {metricKeys.map(({ key, label, weight }) => {
          const metric = metrics[key];
          const score = metric?.score;
          return (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{label}</CardTitle>
                    <CardDescription>{weight}% weight</CardDescription>
                  </div>
                  {score !== undefined && <ScoreBadge score={score} />}
                </div>
                {metric?.suggestions && metric.suggestions.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {metric.suggestions.slice(0, 2).map((s: string, i: number) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function RecommendationsTab({ audit }: { audit: any }) {
  const recommendations = audit.recommendations;
  if (!recommendations || recommendations.length === 0) {
    return <p className="text-muted-foreground">No recommendations available for this audit.</p>;
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec: any, i: number) => (
        <Card key={rec.id ?? i}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{rec.title}</CardTitle>
                {rec.description && <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>}
              </div>
            </div>
            {rec.priority && (
              <div className="mt-2 text-xs">
                <span className="font-medium">Priority:</span> {rec.priority}
              </div>
            )}
            {rec.steps && rec.steps.length > 0 && (
              <ol className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                {rec.steps.slice(0, 3).map((step: string, j: number) => (
                  <li key={j}>{step}</li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ReportsTab({ audit }: { audit: any }) {
  const [downloading, setDownloading] = useState(false);

  async function download(format: "pdf" | "csv" | "json") {
    setDownloading(true);
    try {
      await reportsService.download(audit.id ?? audit.audit_id, format);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Download the audit report in various formats. These files include the full
        SEO metrics breakdown, recommendations, and affected pages.
      </p>

      <div className="flex gap-2">
        <Button
          disabled={downloading}
          onClick={() => void download("pdf")}
        >
          {downloading && <Loader2 className="mr-2 size-4 animate-spin" />}
          <Download className="mr-2 size-4" />
          PDF Report
        </Button>
        <Button
          disabled={downloading}
          variant="outline"
          onClick={() => void download("csv")}
        >
          <Download className="mr-2 size-4" />
          CSV
        </Button>
        <Button
          disabled={downloading}
          variant="outline"
          onClick={() => void download("json")}
        >
          <Download className="mr-2 size-4" />
          JSON
        </Button>
      </div>
    </div>
  );
}