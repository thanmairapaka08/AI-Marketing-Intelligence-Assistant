import { createFileRoute } from "@tanstack/react-router";

import { PageInProgress } from "@/components/common/page-in-progress";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "Audit History — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Browse and compare past SEO audits." },
      { property: "og:title", content: "Audit History — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Browse and compare past SEO audits." },
    ],
  }),
  component: () => <PageInProgress title="Audit History" description="Browse and compare past SEO audits." />,
});
