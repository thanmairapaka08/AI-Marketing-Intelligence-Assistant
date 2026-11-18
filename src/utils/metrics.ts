import type { AuditMetrics, MetricResult } from "@/services/types";

export type MetricKey = "title_meta" | "broken_links" | "image_alt" | "headings" | "canonical";

export interface MetricStatField {
  key: string;
  aliases?: string[];
  label: string;
  kind?: "number" | "percent";
  /** Higher is worse: highlights non-zero values. */
  bad?: boolean;
}

export interface MetricDefinition {
  key: MetricKey;
  label: string;
  shortLabel: string;
  weight: number;
  description: string;
  aliases: string[];
  stats: MetricStatField[];
}

/** The five primary metrics and their weights. Weights sum to 100. */
export const METRICS: MetricDefinition[] = [
  {
    key: "title_meta",
    label: "Title & meta description",
    shortLabel: "Title & meta",
    weight: 25,
    description: "Presence and length of page titles and meta descriptions.",
    aliases: ["title_and_meta", "title_meta_description", "meta"],
    stats: [
      { key: "missing_titles", label: "Missing titles", bad: true },
      { key: "title_length_issues", aliases: ["incorrect_title_lengths", "invalid_title_lengths"], label: "Incorrect title lengths", bad: true },
      { key: "missing_descriptions", aliases: ["missing_meta_descriptions"], label: "Missing meta descriptions", bad: true },
      { key: "description_length_issues", aliases: ["incorrect_description_lengths", "invalid_description_lengths"], label: "Incorrect description lengths", bad: true },
    ],
  },
  {
    key: "broken_links",
    label: "Broken internal links",
    shortLabel: "Broken links",
    weight: 25,
    description: "Internal links that return errors. Timeouts are reported separately.",
    aliases: ["internal_links", "links"],
    stats: [
      { key: "working_links", aliases: ["working_internal_links"], label: "Working internal links" },
      { key: "broken_count", aliases: ["confirmed_broken", "broken_links_count"], label: "Confirmed broken", bad: true },
      { key: "unreachable_count", aliases: ["timed_out", "unreachable_links_count"], label: "Unreachable / timed out" },
    ],
  },
  {
    key: "image_alt",
    label: "Image alt text",
    shortLabel: "Alt text",
    weight: 15,
    description: "Descriptive alt attributes on content images.",
    aliases: ["images", "alt_text", "image_alt_text"],
    stats: [
      { key: "total_images", label: "Relevant images" },
      { key: "images_with_alt", label: "With alt text" },
      { key: "images_missing_alt", label: "Missing alt text", bad: true },
      { key: "coverage", aliases: ["alt_coverage", "coverage_percent"], label: "Alt-text coverage", kind: "percent" },
    ],
  },
  {
    key: "headings",
    label: "Heading structure",
    shortLabel: "Headings",
    weight: 20,
    description: "Exactly one H1 per page and a logical heading hierarchy.",
    aliases: ["heading_structure", "h1"],
    stats: [
      { key: "pages_with_single_h1", aliases: ["valid_h1_pages"], label: "Pages with one H1" },
      { key: "pages_missing_h1", label: "Pages missing H1", bad: true },
      { key: "pages_multiple_h1", aliases: ["pages_with_multiple_h1"], label: "Pages with multiple H1", bad: true },
    ],
  },
  {
    key: "canonical",
    label: "Canonical tags",
    shortLabel: "Canonical",
    weight: 15,
    description: "Valid, self-consistent canonical references.",
    aliases: ["canonical_tags", "canonicals"],
    stats: [
      { key: "valid_canonical", aliases: ["pages_with_valid_canonical", "valid"], label: "Valid canonical" },
      { key: "missing_canonical", aliases: ["pages_missing_canonical", "missing"], label: "Missing canonical", bad: true },
      { key: "invalid_canonical", aliases: ["invalid_canonical_references", "invalid"], label: "Invalid references", bad: true },
      { key: "coverage", aliases: ["canonical_coverage"], label: "Canonical coverage", kind: "percent" },
    ],
  },
];

export const METRIC_BY_KEY = Object.fromEntries(METRICS.map((m) => [m.key, m])) as Record<MetricKey, MetricDefinition>;

/** Finds a metric block in the response, accepting a few common key spellings. */
export function getMetric(metrics: AuditMetrics | null | undefined, key: MetricKey): MetricResult | null {
  if (!metrics) return null;
  const record = metrics as Record<string, unknown>;
  const container = (record["metrics"] && typeof record["metrics"] === "object" ? record["metrics"] : record) as Record<string, unknown>;
  const def = METRIC_BY_KEY[key];
  for (const name of [key, ...def.aliases]) {
    const value = container[name];
    if (value && typeof value === "object") return value as MetricResult;
  }
  return null;
}

/** Reads a stat by key or alias; returns null (not zero) when absent. */
export function readStat(metric: MetricResult | null, field: MetricStatField): number | null {
  if (!metric) return null;
  for (const name of [field.key, ...(field.aliases ?? [])]) {
    const value = metric[name];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (Array.isArray(value) && field.key.endsWith("_count")) return value.length;
  }
  return null;
}

export function metricScore(metric: MetricResult | null): number | null {
  const value = metric?.score;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
