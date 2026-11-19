import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Globe, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { ScoreBadge } from "@/components/common/badges";
import { ScoreGauge } from "@/components/common/score-gauge";
import { competitorsService, type CompareInput } from "@/services/competitors.service";
import { useWebsites } from "@/features/websites/hooks";
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
  const { data: websites, isPending: websitesPending } = useWebsites();
  const navigate = useNavigate();
  const [primaryWebsiteId, setPrimaryWebsiteId] = useState("");
  const [competitorUrls, setCompetitorUrls] = useState<string[]>(["", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryWebsiteId) {
      setError("Please select a primary website");
      return;
    }
    const validCompetitors = competitorUrls.filter(u => u.trim());
    if (validCompetitors.length === 0) {
      setError("Please enter at least one competitor URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const input: CompareInput = {
        website_id: primaryWebsiteId,
        competitor_urls: validCompetitors,
      };
      const data = await competitorsService.compare(input);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to compare competitors");
    } finally {
      setIsLoading(false);
    }
  };

  if (websitesPending) {
    return (
      <div className="space-y-6">
        <PageHeader title="Competitor Analysis" description="Benchmark technical SEO against up to three competitors." />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Competitor Analysis"
        description="Benchmark your site against competitors metric by metric."
      />

      <Card>
        <CardHeader>
          <CardTitle>Compare your sites</CardTitle>
          <CardDescription>Select your primary site and enter up to 3 competitor URLs to compare.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Primary site</label>
              <select
                value={primaryWebsiteId}
                onChange={(e) => setPrimaryWebsiteId(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select a website...</option>
                {websites?.items?.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name ?? getDomain(site.url)} ({getDomain(site.url)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Competitor 1</label>
              <input
                type="url"
                placeholder="https://competitor.com"
                value={competitorUrls[0]}
                onChange={(e) => setCompetitorUrls(prev => { const n = [...prev]; n[0] = e.target.value; return n; })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Competitor 2 (optional)</label>
              <input
                type="url"
                placeholder="https://competitor2.com"
                value={competitorUrls[1]}
                onChange={(e) => setCompetitorUrls(prev => { const n = [...prev]; n[1] = e.target.value; return n; })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Competitor 3 (optional)</label>
              <input
                type="url"
                placeholder="https://competitor3.com"
                value={competitorUrls[2]}
                onChange={(e) => setCompetitorUrls(prev => { const n = [...prev]; n[2] = e.target.value; return n; })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" disabled={isLoading || !websites?.items?.length}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Compare Sites
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6 lg:grid-cols-4">
          {result.sites.map((site: any, i: number) => (
            <ComparisonCard key={i} site={site} title={site.is_primary ? "Your Site" : `Competitor ${i}`} />
          ))}
        </div>
      )}
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
          {Object.entries(site.metrics || {}).map(([key, value]) => (
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