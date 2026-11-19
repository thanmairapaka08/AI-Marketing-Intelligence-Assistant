import { createFileRoute } from "@tanstack/react-router";
import { Globe, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { ScoreBadge } from "@/components/common/badges";
import { ScoreGauge } from "@/components/common/score-gauge";
import { useAuth } from "@/features/auth/auth-context";
import { getDomain } from "@/utils/url";

export const Route = createFileRoute("/_authenticated/competitors")({
  head: () => ({
    meta: [
      { title: "Competitor Analysis — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Benchmark technical SEO against up to three competitors." },
      { property: "og:title", content: "Competitor Analysis — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Benchmark technical SEO against up to three competitors." },
    ],
  }),
  component: () => <CompetitorsPage />,
});

function CompetitorsPage() {
  const { user } = useAuth();
  const isPending = false;

  // Demo data for initial implementation
  const primarySite = {
    url: "https://example.com",
    is_primary: true,
    overall_score: 88,
    status: "completed",
    metrics: {
      title_meta: 90,
      broken_links: 100,
      image_alt: 85,
      headings: 95,
      canonical: 100,
    },
  };

  const competitors = [
    {
      url: "https://competitor-alpha.com",
      is_primary: false,
      overall_score: 72,
      status: "completed",
      metrics: { title_meta: 70, broken_links: 80, image_alt: 65, headings: 75, canonical: 60 },
    },
    {
      url: "https://competitor-beta.com",
      is_primary: false,
      overall_score: 78,
      status: "completed",
      metrics: { title_meta: 75, broken_links: 85, image_alt: 70, headings: 80, canonical: 72 },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Competitor Analysis"
        description="Benchmark your site against competitors metric by metric."
      />

      <Card>
        <CardHeader>
          <CardTitle>Compare your sites</CardTitle>
          <CardDescription>Enter up to 3 competitor URLs to compare against your primary site.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium">Primary site</label>
              <p className="text-muted-foreground">{getDomain(primarySite.url)}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Competitor 1</label>
              <input
                type="url"
                placeholder="https://competitor.com"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Competitor 2 (optional)</label>
              <input
                type="url"
                placeholder="https://competitor2.com"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Competitor 3 (optional)</label>
              <input
                type="url"
                placeholder="https://competitor3.com"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Compare Sites
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <ComparisonCard site={primarySite} title="Your Site" />
        {competitors.map((comp, i) => (
          <ComparisonCard key={i} site={comp} title={`Competitor ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

function ComparisonCard({ site, title }: { site: any; title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <ScoreGauge score={site.overall_score} size={100} showLabel={false} />
        </div>
        <p className="text-center text-sm font-medium mb-2">{site.overall_score}/100</p>
        <div className="space-y-3">
          {Object.entries(site.metrics).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-muted-foreground capitalize">{key.replace("_", " ")}</span>
              <ScoreBadge score={value} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}