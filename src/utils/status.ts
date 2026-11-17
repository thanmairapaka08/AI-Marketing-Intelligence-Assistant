import type { AuditStatus } from "@/services/types";

export const TERMINAL_STATUSES: AuditStatus[] = ["completed", "partially_completed", "failed", "cancelled"];
export const RESULT_STATUSES: AuditStatus[] = ["completed", "partially_completed"];

export function isTerminalStatus(status: string | null | undefined): boolean {
  return !!status && (TERMINAL_STATUSES as string[]).includes(status);
}

export function hasResults(status: string | null | undefined): boolean {
  return !!status && (RESULT_STATUSES as string[]).includes(status);
}

export const STATUS_LABEL: Record<AuditStatus, string> = {
  queued: "Queued",
  running: "Running",
  completed: "Completed",
  partially_completed: "Partially completed",
  failed: "Failed",
  cancelled: "Cancelled",
};

export function statusLabel(status: string | null | undefined): string {
  if (!status) return "Unknown";
  return STATUS_LABEL[status as AuditStatus] ?? status;
}

/** Polling interval for the audit status endpoint; false stops polling. */
export function statusPollInterval(status: string | null | undefined, intervalMs = 3000): number | false {
  return isTerminalStatus(status) ? false : intervalMs;
}
