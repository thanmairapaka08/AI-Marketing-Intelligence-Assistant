import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/app/query-keys";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboardSummary() {
  return useQuery({ queryKey: queryKeys.dashboard, queryFn: dashboardService.summary });
}
