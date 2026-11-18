import { createFileRoute } from "@tanstack/react-router";

import { PageInProgress } from "@/components/common/page-in-progress";

export const Route = createFileRoute("/_authenticated/recommendations")({
  head: () => ({
    meta: [
      { title: "AI Recommendations — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Prioritised improvements from your audits." },
      { property: "og:title", content: "AI Recommendations — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Prioritised improvements from your audits." },
    ],
  }),
  component: () => <PageInProgress title="AI Recommendations" description="Prioritised improvements from your audits." />,
});
