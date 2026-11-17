import { API_PREFIX } from "./config";

export interface EndpointSpec {
  method: "get" | "post" | "delete";
  path: string;
  group: string;
  root?: boolean;
}

/** Every endpoint the frontend integrates with. Used for the API status view. */
export const ENDPOINTS: EndpointSpec[] = [
  { group: "Health", method: "get", path: "/health", root: true },
  { group: "Health", method: "get", path: "/ready", root: true },
  { group: "Auth", method: "post", path: "/auth/register" },
  { group: "Auth", method: "post", path: "/auth/login" },
  { group: "Auth", method: "post", path: "/auth/refresh" },
  { group: "Auth", method: "post", path: "/auth/logout" },
  { group: "Auth", method: "get", path: "/auth/me" },
  { group: "Dashboard", method: "get", path: "/dashboard/summary" },
  { group: "Websites", method: "get", path: "/websites" },
  { group: "Websites", method: "post", path: "/websites" },
  { group: "Websites", method: "get", path: "/websites/{id}" },
  { group: "Websites", method: "delete", path: "/websites/{id}" },
  { group: "Audits", method: "post", path: "/audits" },
  { group: "Audits", method: "get", path: "/audits" },
  { group: "Audits", method: "get", path: "/audits/{id}" },
  { group: "Audits", method: "get", path: "/audits/{id}/status" },
  { group: "Audits", method: "get", path: "/audits/{id}/pages" },
  { group: "Audits", method: "get", path: "/audits/{id}/metrics" },
  { group: "Audits", method: "get", path: "/audits/{id}/recommendations" },
  { group: "Competitors", method: "post", path: "/competitors/compare" },
  { group: "Competitors", method: "get", path: "/competitors/comparisons/{id}" },
  { group: "Reports", method: "get", path: "/audits/{id}/export/pdf" },
  { group: "Reports", method: "get", path: "/audits/{id}/export/csv" },
  { group: "Reports", method: "get", path: "/audits/{id}/export/json" },
];

/** Optional AI endpoint; the meta assistant only enables when the schema declares it. */
export const META_ASSISTANT_ENDPOINT: EndpointSpec = {
  group: "AI",
  method: "post",
  path: "/ai/meta-suggestions",
};

function normalizePath(path: string) {
  return path.replace(/\{[^}]+\}/g, "{}").replace(/\/+$/, "");
}

/** Checks whether an OpenAPI `paths` object declares this endpoint (param names ignored). */
export function isDeclared(
  paths: Record<string, Record<string, unknown>> | undefined,
  spec: EndpointSpec,
): boolean {
  if (!paths) return false;
  const wanted = normalizePath((spec.root ? "" : API_PREFIX) + spec.path);
  return Object.entries(paths).some(
    ([path, methods]) => normalizePath(path) === wanted && !!methods && spec.method in methods,
  );
}
