import { createFileRoute } from "@tanstack/react-router";

import { AuthForm } from "@/features/auth/auth-form";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {},
  head: () => ({
    meta: [
      { title: "Sign in — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Sign in to run AI-powered SEO audits and track your websites." },
      { property: "og:title", content: "Sign in — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Sign in to run AI-powered SEO audits and track your websites." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  return <AuthForm mode="login" redirect={redirect} />;
}
