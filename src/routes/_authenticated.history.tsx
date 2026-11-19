import { createFileRoute, Link } from "@tanstack/react-router";
import { FileDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { useAudits } from "@/features/audits/hooks";
import { AuditsTable } from "@/features/audits/audits-table";
import { formatDate } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "Audit History — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Browse and compare past SEO audits." },
      { property: "og:title", content: "Audit History — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Browse and compare past SEO audits." },
    ],
  }),
  component: () => <HistoryPage />,
});

function HistoryPage() {
  const { data, isPending } = useAudits();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit History"
        description="Your completed SEO audits appear here."
      />

      {isPending ? (
        <div className="space-y-4">
          <div className="h-10 rounded bg-muted animate-pulse" />
          <div className="h-96 rounded bg-muted animate-pulse" />
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <AuditsTable audits={data.items} />
      ) : (
        <div>
          <p className="text-muted-foreground">No audits yet.</p>
          <Button asChild className="mt-4">
            <Link to="/audit">Run your first audit</Link>
          </Button>
        </div>
      )}
    </div>
  );
}