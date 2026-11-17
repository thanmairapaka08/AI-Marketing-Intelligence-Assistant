const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

/** Base URL for application routes, e.g. http://127.0.0.1:8000/api/v1 */
export const API_BASE_URL = trimTrailingSlash(
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || DEFAULT_API_BASE_URL,
);

/** Backend root used for /health, /ready and /openapi.json. */
export const API_ROOT_URL = trimTrailingSlash(
  (import.meta.env.VITE_API_ROOT_URL as string | undefined) ||
    API_BASE_URL.replace(/\/api\/v\d+$/, ""),
);

/** Path prefix of application routes as it appears in the OpenAPI schema. */
export const API_PREFIX = API_BASE_URL.slice(API_ROOT_URL.length) || "";

export const REQUEST_TIMEOUT_MS = 20_000;
