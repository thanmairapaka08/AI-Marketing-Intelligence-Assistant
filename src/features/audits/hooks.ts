import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/app/query-keys";
import { auditsService, type AuditListParams } from "@/services/audits.service";
import { hasResults, statusPollInterval } from "@/utils/status";

export function useAudits(params: AuditListParams = {}) {
  return useQuery({
    queryKey: queryKeys.audits(params as Record<string, unknown>),
    queryFn: () => auditsService.list(params),
  });
}

export function useAudit(id: string) {
  return useQuery({ queryKey: queryKeys.audit(id), queryFn: () => auditsService.get(id) });
}

/** Polls GET /audits/{id}/status every 3s and stops on terminal states. */
export function useAuditStatus(id: string) {
  return useQuery({
    queryKey: queryKeys.auditStatus(id),
    queryFn: () => auditsService.status(id),
    refetchInterval: (query) => (query.state.error ? false : statusPollInterval(query.state.data?.status)),
  });
}

export function useAuditMetrics(id: string, status: string | undefined) {
  return useQuery({
    queryKey: queryKeys.auditMetrics(id),
    queryFn: () => auditsService.metrics(id),
    enabled: hasResults(status),
  });
}

export function useAuditPages(id: string, status: string | undefined) {
  return useQuery({
    queryKey: queryKeys.auditPages(id),
    queryFn: () => auditsService.pages(id),
    enabled: hasResults(status),
  });
}

export function useAuditRecommendations(id: string | undefined, status?: string) {
  return useQuery({
    queryKey: queryKeys.auditRecommendations(id ?? ""),
    queryFn: () => auditsService.recommendations(id ?? ""),
    enabled: !!id && (status === undefined || hasResults(status)),
  });
}

export function useCreateAudit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => auditsService.create(url),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["audits"] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

/** Audit id from list items, which may use `id` or `audit_id`. */
export function auditId(audit: { id?: string; audit_id?: string }): string | undefined {
  return audit.id ?? audit.audit_id;
}

export function auditScore(audit: { overall_score?: number | null; score?: number | null }): number | null {
  return audit.overall_score ?? audit.score ?? null;
}
