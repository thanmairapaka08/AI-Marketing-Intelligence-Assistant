import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Globe, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { useWebsites, useDeleteWebsite, useCreateWebsite } from "@/features/websites/hooks";
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
  const { data, isPending } = useWebsites();
  const deleteWebsite = useDeleteWebsite();
  const createWebsite = useCreateWebsite();
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    await createWebsite.mutateAsync({ url: newUrl.trim(), name: newName.trim() || undefined });
    setNewUrl("");
    setNewName("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Websites"
        description="Manage the websites you monitor for SEO performance."
        actions={
          <form onSubmit={handleCreate} className="flex gap-2">
            <div className="flex gap-2">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="pl-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Optional name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Button type="submit" disabled={createWebsite.isPending} size="sm">
                {createWebsite.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                <Globe className="mr-2 size-4" /> Add Website
              </Button>
            </div>
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
          {data?.items?.map((site) => (
            <Card key={site.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <CardTitle className="text-base">{site.name ?? getDomain(site.url)}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-danger hover:text-danger"
                  onClick={() => deleteWebsite.mutate(site.id)}
                  disabled={deleteWebsite.isPending}
                >
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
          {(!data?.items || data.items.length === 0) && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p>No websites yet. Add your first website above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}