import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { useAuth } from "@/features/auth/auth-context";
import { useWebsites, useDeleteWebsite } from "@/features/websites/hooks";
import { formatDate, formatNumber } from "@/utils/format";
import { getDomain } from "@/utils/url";

export const Route = createFileRoute("/_authenticated/websites")({
  head: () => ({
    meta: [
      { title: "Websites — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Manage the websites you monitor." },
      { property: "og:title", content: "Websites — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Manage the websites you monitor." },
    ],
  }),
  component: () => <WebsitesPage />,
});

function WebsitesPage() {
  const { user } = useAuth();
  const { data, isPending } = useWebsites();
  const deleteWebsite = useDeleteWebsite();

  // Generate demo data for logged-in user
  const demoWebsites = [
    { id: "ws_1", url: "https://example.com", domain: "example.com", name: "Example Corp", latest_score: 88, audit_count: 3, created_at: "2026-10-01T10:00:00Z" },
    { id: "ws_2", url: "https://github.com/anthropics/claude-code", domain: "github.com", name: "Claude Code", latest_score: 92, audit_count: 1, created_at: "2026-11-10T08:00:00Z" },
    { id: "ws_3", url: "https://google.com", domain: "google.com", name: "Google", latest_score: 95, audit_count: 5, created_at: "2026-09-15T12:00:00Z" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Websites"
        description="Manage the websites you monitor for SEO performance."
        actions={
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.querySelector('input[name="url"]') as HTMLInputElement;
              if (input.value) {
                // TODO: Add website via service
                console.log("Add website:", input.value);
                input.value = "";
                form.reset();
              }
            }}
          >
            <Button type="submit" size="sm">
              <Globe className="mr-2 size-4" /> Add Website
            </Button>
          </form>
        }
      />

      {isPending ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-48 w-full rounded bg-muted animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {demoWebsites.map((site) => (
            <Card key={site.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <CardTitle className="text-base">{site.name ?? getDomain(site.url)}</CardTitle>
                <Button variant="ghost" size="sm" className="text-danger hover:text-danger">
                  <Trash2 className="size-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{getDomain(site.url)}</p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span>Last audit: {formatDate(site.last_audit_at)}</span>
                  <span className="text-muted-foreground">•</span>
                  <span>Scans: {formatNumber(site.audit_count)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}