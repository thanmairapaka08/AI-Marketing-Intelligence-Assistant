import { createRouter } from "@tanstack/react-router";

import { createQueryClient } from "./app/query-client";
import { RouteError } from "./components/common/route-error";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  // One client per request: a module-level QueryClient leaks cached data between SSR requests.
  const queryClient = createQueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Per-route error boundary: a failing page renders inside the app shell.
    defaultErrorComponent: RouteError,
  });

  return router;
};
