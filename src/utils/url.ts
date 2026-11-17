/** Adds https:// when the scheme is missing and trims whitespace. */
export function normalizeUrl(input: string): string {
  const value = input.trim();
  if (!value) return value;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

/** True for http(s) URLs with a dotted hostname (or localhost). */
export function isValidWebsiteUrl(input: string): boolean {
  try {
    const url = new URL(normalizeUrl(input));
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (url.hostname === "localhost") return true;
    return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname) && !url.hostname.endsWith(".");
  } catch {
    return false;
  }
}

export function getDomain(input: string | null | undefined): string {
  if (!input) return "";
  try {
    return new URL(normalizeUrl(input)).hostname.replace(/^www\./, "");
  } catch {
    return input;
  }
}

/** Only allow same-app relative paths as post-login redirect targets. */
export function safeRedirect(target: unknown, fallback = "/dashboard"): string {
  if (typeof target !== "string") return fallback;
  if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) return fallback;
  return target;
}
