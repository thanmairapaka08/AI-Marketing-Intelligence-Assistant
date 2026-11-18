import { createFileRoute } from "@tanstack/react-router";

import { PageInProgress } from "@/components/common/page-in-progress";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Profile, theme, session and backend connection." },
      { property: "og:title", content: "Settings — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Profile, theme, session and backend connection." },
    ],
  }),
  component: () => <PageInProgress title="Settings" description="Profile, theme, session and backend connection." />,
});
