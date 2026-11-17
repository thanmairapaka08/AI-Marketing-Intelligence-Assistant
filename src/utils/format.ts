import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";

export const EMPTY = "—";

function toDate(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const date = value instanceof Date ? value : typeof value === "string" ? parseISO(value) : new Date(value);
  return isValid(date) ? date : null;
}

/** Consistent date format across the app, e.g. "17 Nov 2026". */
export function formatDate(value: string | number | Date | null | undefined): string {
  const date = toDate(value);
  return date ? format(date, "d MMM yyyy") : EMPTY;
}

export function formatDateTime(value: string | number | Date | null | undefined): string {
  const date = toDate(value);
  return date ? format(date, "d MMM yyyy, HH:mm") : EMPTY;
}

export function formatRelative(value: string | number | Date | null | undefined): string {
  const date = toDate(value);
  return date ? `${formatDistanceToNowStrict(date)} ago` : EMPTY;
}

/** Null/undefined stay "—" so unavailable values are never displayed as zero. */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return EMPTY;
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatScore(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return EMPTY;
  return String(Math.round(value));
}

/** Accepts 0-1 ratios or 0-100 percentages. */
export function formatPercent(value: number | null | undefined, digits = 0): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return EMPTY;
  const pct = value <= 1 && value >= 0 ? value * 100 : value;
  return `${pct.toFixed(digits)}%`;
}

export function humanize(key: string): string {
  const text = key.replace(/[_-]+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}
