export type ScoreBand = "excellent" | "good" | "fair" | "poor" | "unavailable";

export interface ScoreClassification {
  band: ScoreBand;
  label: string;
}

/** Returns a valid 0-100 score, or null when the backend didn't report one. */
export function normalizeScore(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.min(100, Math.max(0, n));
}

/** Classification bands: 90+ Excellent, 75-89 Good, 50-74 Needs work, <50 Poor. */
export function classifyScore(value: unknown): ScoreClassification {
  const score = normalizeScore(value);
  if (score === null) return { band: "unavailable", label: "Unavailable" };
  if (score >= 90) return { band: "excellent", label: "Excellent" };
  if (score >= 75) return { band: "good", label: "Good" };
  if (score >= 50) return { band: "fair", label: "Needs work" };
  return { band: "poor", label: "Poor" };
}

export const scoreBandText: Record<ScoreBand, string> = {
  excellent: "text-success",
  good: "text-primary",
  fair: "text-warning",
  poor: "text-danger",
  unavailable: "text-muted-foreground",
};

export const scoreBandSoft: Record<ScoreBand, string> = {
  excellent: "bg-success-soft text-success",
  good: "bg-primary-soft text-primary",
  fair: "bg-warning-soft text-warning-foreground dark:text-warning",
  poor: "bg-danger-soft text-danger",
  unavailable: "bg-muted text-muted-foreground",
};

export const scoreBandStroke: Record<ScoreBand, string> = {
  excellent: "stroke-success",
  good: "stroke-primary",
  fair: "stroke-warning",
  poor: "stroke-danger",
  unavailable: "stroke-muted-foreground",
};
