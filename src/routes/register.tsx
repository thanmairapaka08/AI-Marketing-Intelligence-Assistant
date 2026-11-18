import { createFileRoute } from "@tanstack/react-router";

import { AuthForm } from "@/features/auth/auth-form";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Create a free account and audit your website's technical SEO." },
      { property: "og:title", content: "Create account — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Create a free account and audit your website's technical SEO." },
    ],
  }),
  component: () => <AuthForm mode="register" />,
});
