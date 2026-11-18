import { createFileRoute } from "@tanstack/react-router";

import { DashboardPage } from "@/features/dashboard/dashboard-page";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Your websites, audits and SEO performance at a glance." },
      { property: "og:title", content: "Dashboard — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Your websites, audits and SEO performance at a glance." },
    ],
  }),
  component: DashboardPage,
});
