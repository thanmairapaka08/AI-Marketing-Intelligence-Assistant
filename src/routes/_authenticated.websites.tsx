import { createFileRoute } from "@tanstack/react-router";

import { PageInProgress } from "@/components/common/page-in-progress";

export const Route = createFileRoute("/_authenticated/websites")({
  head: () => ({
    meta: [
      { title: "Websites — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Manage the websites you monitor." },
      { property: "og:title", content: "Websites — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Manage the websites you monitor." },
    ],
  }),
  component: () => <PageInProgress title="Websites" description="Manage the websites you monitor." />,
});
