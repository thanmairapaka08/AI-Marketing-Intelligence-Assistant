import { createFileRoute } from "@tanstack/react-router";

import { PageInProgress } from "@/components/common/page-in-progress";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Download PDF, CSV and JSON audit reports." },
      { property: "og:title", content: "Reports — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Download PDF, CSV and JSON audit reports." },
    ],
  }),
  component: () => <PageInProgress title="Reports" description="Download PDF, CSV and JSON audit reports." />,
});
