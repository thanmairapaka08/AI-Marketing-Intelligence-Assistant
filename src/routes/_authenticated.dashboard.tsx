import { createFileRoute } from "@tanstack/react-router";

import { PageInProgress } from "@/components/common/page-in-progress";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Your websites, audits and SEO performance at a glance." },
      { property: "og:title", content: "Dashboard — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Your websites, audits and SEO performance at a glance." },
    ],
  }),
  component: () => <PageInProgress title="Dashboard" description="Your websites, audits and SEO performance at a glance." />,
});
