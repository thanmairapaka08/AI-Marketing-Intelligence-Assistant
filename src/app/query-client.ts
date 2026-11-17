import { QueryClient } from "@tanstack/react-query";

import { toApiError } from "@/services/errors";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // Only transient server errors are worth one retry; 4xx, missing endpoints
        // and an unreachable backend fail fast so the UI can explain what happened.
        retry: (failureCount, error) => toApiError(error).kind === "server" && failureCount < 1,
      },
      mutations: { retry: false },
    },
  });
}
