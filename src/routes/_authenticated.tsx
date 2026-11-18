import { createFileRoute, Navigate, Outlet, useRouterState } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/auth-context";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { status } = useAuth();
  const href = useRouterState({ select: (s) => s.location.href });

  if (status === "unauthenticated" || status === "unreachable") {
    return <Navigate to="/login" search={{ redirect: href }} replace />;
  }

  return (
    <AppShell>
      {status === "loading" ? (
        <div className="space-y-4" aria-busy="true">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <Outlet />
      )}
    </AppShell>
  );
}
