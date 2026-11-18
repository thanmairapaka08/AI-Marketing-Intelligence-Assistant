import { Construction } from "lucide-react";

import { EmptyState } from "./empty-state";
import { PageHeader } from "./page-header";

/** Temporary page body for screens not yet built. */
export function PageInProgress({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={Construction}
        title="This page is still being built"
        description="The navigation and backend connection are ready; this screen's content comes next."
      />
    </div>
  );
}
