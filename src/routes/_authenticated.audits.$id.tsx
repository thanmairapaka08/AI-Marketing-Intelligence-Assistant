import { createFileRoute } from "@tanstack/react-router";

import { PageInProgress } from "@/components/common/page-in-progress";

export const Route = createFileRoute("/_authenticated/audits/$id")({
  head: () => ({
    meta: [
      { title: "Audit report — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Detailed technical SEO audit report." },
      { property: "og:title", content: "Audit report — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Detailed technical SEO audit report." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <PageInProgress title="Audit report" description="Score, five SEO metrics and recommendations for this audit." />,
});
