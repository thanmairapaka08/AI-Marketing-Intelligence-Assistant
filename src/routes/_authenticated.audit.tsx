import { createFileRoute } from "@tanstack/react-router";

import { PageInProgress } from "@/components/common/page-in-progress";

export const Route = createFileRoute("/_authenticated/audit")({
  head: () => ({
    meta: [
      { title: "New Audit — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Run a technical SEO audit on any website." },
      { property: "og:title", content: "New Audit — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Run a technical SEO audit on any website." },
    ],
  }),
  component: () => <PageInProgress title="New Audit" description="Run a technical SEO audit on any website." />,
});
