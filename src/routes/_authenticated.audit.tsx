import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Globe, Loader2, ScanSearch } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/page-header";
import { useCreateAudit } from "@/features/audits/hooks";
import { normalizeUrl, isValidWebsiteUrl } from "@/utils/url";

export const Route = createFileRoute("/_authenticated/audit")({
  head: () => ({
    meta: [
      { title: "New Audit — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Run a technical SEO audit on any website." },
      { property: "og:title", content: "New Audit — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Run a technical SEO audit on any website." },
    ],
  }),
  component: () => <AuditPage />,
});

function AuditPage() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createAudit = useCreateAudit();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidWebsiteUrl(url)) {
      setError("Enter a valid website URL, e.g. https://example.com");
      return;
    }

    const normalizedUrl = normalizeUrl(url);
    createAudit.mutate(normalizedUrl, {
      onSuccess: (data) => {
        toast.success("Audit started", { description: normalizedUrl });
        void navigate({ to: "/audits/$id", params: { id: data.audit_id } });
      },
      onError: (err) => {
        toast.error("Couldn't start audit");
        console.error(err);
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Audit"
        description="Enter a website URL below. We validate it and run a technical SEO audit."
      />

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="audit-url">Website URL</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="audit-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10"
              autoComplete="url"
            />
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={createAudit.isPending} className="w-full">
          {createAudit.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {createAudit.isPending ? "Starting audit…" : "Start Audit"}
        </Button>
      </form>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium">What we check</h3>
        <ul className="mt-2 text-sm text-muted-foreground space-y-1">
          <li>• Title and meta description length and presence</li>
          <li>• Broken internal links</li>
          <li>• Image alt text coverage</li>
          <li>• Heading structure (single H1, logical hierarchy)</li>
          <li>• Canonical URL tags</li>
        </ul>
      </div>
    </div>
  );
}