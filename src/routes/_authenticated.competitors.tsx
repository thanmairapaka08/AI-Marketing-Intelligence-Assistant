import { createFileRoute } from "@tanstack/react-router";

import { PageInProgress } from "@/components/common/page-in-progress";

export const Route = createFileRoute("/_authenticated/competitors")({
  head: () => ({
    meta: [
      { title: "Competitor Analysis — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Benchmark technical SEO against up to three competitors." },
      { property: "og:title", content: "Competitor Analysis — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Benchmark technical SEO against up to three competitors." },
    ],
  }),
  component: () => <PageInProgress title="Competitor Analysis" description="Benchmark technical SEO against up to three competitors." />,
});
