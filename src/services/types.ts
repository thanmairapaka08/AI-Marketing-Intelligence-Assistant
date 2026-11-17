/**
 * Expected response shapes. The backend is under active development, so every
 * field is optional unless the brief guarantees it. Never assume undocumented
 * fields exist; render "Not reported" when they don't.
 */

export type AuditStatus =
  | "queued"
  | "running"
  | "completed"
  | "partially_completed"
  | "failed"
  | "cancelled";

export interface User {
  id?: string | number;
  full_name?: string;
  name?: string;
  email: string;
  created_at?: string;
  session_expires_at?: string;
}

export interface Website {
  id: string | number;
  url?: string;
  domain?: string;
  name?: string;
  latest_score?: number | null;
  last_audit_at?: string | null;
  audit_count?: number | null;
  created_at?: string;
}

export interface AuditSummary {
  id?: string;
  audit_id?: string;
  url?: string;
  domain?: string;
  website_id?: string | number;
  status: AuditStatus;
  overall_score?: number | null;
  score?: number | null;
  pages_crawled?: number | null;
  high_priority_issues?: number | null;
  created_at?: string;
  completed_at?: string | null;
}

export interface AuditStatusResponse {
  audit_id?: string;
  status: AuditStatus;
  pages_crawled?: number | null;
  pages_discovered?: number | null;
  pages_total?: number | null;
  current_url?: string | null;
  message?: string | null;
  error?: string | null;
}

export interface CreateAuditResponse {
  audit_id: string;
  status: AuditStatus;
}

export interface AffectedPage {
  url: string;
  issue?: string;
  detail?: string;
}

export interface LinkResult {
  source_url?: string;
  target_url?: string;
  destination_url?: string;
  status_code?: number | null;
  reason?: string | null;
}

/** One of the five primary metrics. Unknown extra fields are rendered generically. */
export interface MetricResult {
  score?: number | null;
  status?: string | null;
  severity?: string | null;
  affected_urls?: (string | AffectedPage)[];
  suggestions?: string[];
  recommendations?: string[];
  issues?: (string | { message?: string; url?: string; severity?: string })[];
  [key: string]: unknown;
}

export interface SecondaryCheck {
  name?: string;
  check?: string;
  status?: string;
  passed?: boolean;
  message?: string;
  detail?: string;
}

export interface AuditMetrics {
  overall_score?: number | null;
  title_meta?: MetricResult | null;
  broken_links?: MetricResult | null;
  image_alt?: MetricResult | null;
  headings?: MetricResult | null;
  canonical?: MetricResult | null;
  secondary_checks?: SecondaryCheck[];
  crawl_warnings?: (string | { url?: string; message?: string })[];
}

export interface AuditDetail extends AuditSummary {
  metrics?: AuditMetrics;
  crawl_warnings?: (string | { url?: string; message?: string })[];
}

export interface PageResult {
  url: string;
  status_code?: number | null;
  title?: string | null;
  title_length?: number | null;
  meta_description_length?: number | null;
  h1_count?: number | null;
  images_missing_alt?: number | null;
  canonical?: string | null;
  issues_count?: number | null;
}

export type Priority = "high" | "medium" | "low";

export interface Recommendation {
  id?: string | number;
  title: string;
  description?: string;
  priority?: Priority | string;
  impact?: string;
  expected_impact?: string;
  effort?: string;
  estimated_effort?: string;
  category?: string;
  metric?: string;
  affected_urls?: string[];
  steps?: string[];
  source?: "gemini" | "rule_based" | string;
}

export interface TrendPoint {
  date: string;
  score: number | null;
}

export interface DashboardSummary {
  total_websites?: number | null;
  total_audits?: number | null;
  average_score?: number | null;
  critical_issues?: number | null;
  score_trend?: TrendPoint[];
  recent_audits?: AuditSummary[];
  recommendations_preview?: Recommendation[];
  website_performance?: { domain?: string; url?: string; score?: number | null; last_audit_at?: string }[];
}

export interface ComparisonSite {
  url: string;
  is_primary?: boolean;
  overall_score?: number | null;
  status?: AuditStatus | string;
  metrics?: Partial<Record<string, number | null>>;
}

export interface ComparisonResult {
  comparison_id?: string;
  id?: string;
  status?: AuditStatus | string;
  sites?: ComparisonSite[];
}

export interface HealthResult {
  ok: boolean;
  status: number | null;
  latencyMs: number | null;
  body: unknown;
}
