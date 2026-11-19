import { Link } from "@tanstack/react-router";
import { AlertOctagon, Gauge, Globe, ScanSearch, Sparkles, TrendingUp } from "lucide-react";

import { ScoreTrendChart } from "@/components/charts/score-trend-chart";
import { ScoreBadge } from "@/components/common/badges";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { TableSkeleton } from "@/components/common/table-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditsTable } from "@/features/audits/audits-table";
import { QuickAuditForm } from "@/features/audits/quick-audit-form";
import { RecommendationCard } from "@/features/recommendations/recommendation-card";
import { formatDate, formatNumber, formatScore } from "@/utils/format";
import { getDomain } from "@/utils/url";

import { useDashboardSummary } from "./hooks";

export function DashboardPage() {
  const { data, isPending, error, refetch } = useDashboardSummary();
  const isNewUser = !!data && (data.total_audits ?? 0) === 0 && (data.recent_audits?.length ?? 0) === 0;

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        title="Dashboard"
        description="Your websites, audits and SEO performance at a glance."
        actions={
          <Button asChild>
            <Link to="/audit"><ScanSearch /> New audit</Link>
          </Button>
        }
      />

      {error ? (
        <ErrorState error={error} feature="Dashboard summary" onRetry={() => void refetch()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Websites monitored" icon={Globe} loading={isPending} value={formatNumber(data?.total_websites)} />
            <StatCard label="Total SEO audits" icon={ScanSearch} loading={isPending} value={formatNumber(data?.total_audits)} />
            <StatCard
              label="Average SEO score"
              icon={Gauge}
              loading={isPending}
              value={formatScore(data?.average_score)}
              hint={data?.average_score != null ? <ScoreBadge score={data.average_score} /> : "No completed audits yet"}
            />
            <StatCard label="Critical SEO issues" icon={AlertOctagon} tone="danger" loading={isPending} value={formatNumber(data?.critical_issues)} />
          </div>

          {isNewUser && (
            <EmptyState
              icon={ScanSearch}
              title="Run your first audit"
              description="Enter a website below. Your scores, trends and recommendations will appear here once it finishes."
            />
          )}
        </>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="size-4 text-primary" /> SEO performance trend</CardTitle>
            <CardDescription>Overall score from completed audits</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending && !error ? (
              <Skeleton className="h-[260px] w-full" />
            ) : data?.score_trend && data.score_trend.length > 0 ? (
              <ScoreTrendChart data={data.score_trend} />
            ) : (
              <EmptyState compact title="No trend data yet" description="Scores appear here after your audits complete." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick website audit</CardTitle>
            <CardDescription>Start a crawl and open the report.</CardDescription>
          </CardHeader>
          <CardContent>
            <QuickAuditForm />
            <p className="mt-4 text-xs text-muted-foreground">
              We check titles, meta descriptions, internal links, image alt text, headings and canonical tags.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent audits</CardTitle>
              <CardDescription>Your latest crawls</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm"><Link to="/history">View all</Link></Button>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            {isPending && !error ? (
              <TableSkeleton rows={4} columns={4} />
            ) : data?.recent_audits && data.recent_audits.length > 0 ? (
              <AuditsTable audits={data.recent_audits.slice(0, 6)} showPages={false} />
            ) : (
              <div className="px-6 pb-4"><EmptyState compact title="No audits yet" /></div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="size-4 text-primary" /> AI recommendations</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/recommendations">All</Link></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {isPending && !error ? (
              <>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </>
            ) : data?.recommendations_preview && data.recommendations_preview.length > 0 ? (
              data.recommendations_preview.slice(0, 3).map((rec, i) => <RecommendationCard key={rec.id ?? i} rec={rec} compact />)
            ) : (
              <EmptyState compact title="No recommendations yet" description="They're generated from completed audits." />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Website performance</CardTitle>
          <CardDescription>Latest score per monitored website</CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && !error ? (
            <TableSkeleton rows={3} columns={3} />
          ) : data?.website_performance && data.website_performance.length > 0 ? (
            <ul className="divide-y">
              {data.website_performance.map((site, i) => (
                <li key={site.url ?? site.domain ?? i} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{site.domain ?? getDomain(site.url)}</p>
                    <p className="text-xs text-muted-foreground">Last audit {formatDate(site.last_audit_at)}</p>
                  </div>
                  <ScoreBadge score={site.score} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              compact
              title="No websites yet"
              action={<Button asChild variant="outline" size="sm"><Link to="/websites">Add a website</Link></Button>}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}