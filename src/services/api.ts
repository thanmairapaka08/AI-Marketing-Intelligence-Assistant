import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "./config";
import { ApiError, toApiError } from "./errors";

/**
 * Centralised Axios client for the FastAPI backend.
 * - Auth uses HttpOnly cookies (withCredentials); no tokens touch browser storage.
 * - On 401 it tries ONE shared POST /auth/refresh, then retries the request once.
 * - Every error is normalised to ApiError.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { Accept: "application/json" },
});

let offlinePreview = false;
/** Explore mode: short-circuit every request instead of hitting an unreachable backend. */
export function setOfflinePreview(value: boolean) {
  offlinePreview = value;
}
export function isOfflinePreview() {
  return offlinePreview;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

const NO_REFRESH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

let refreshPromise: Promise<boolean> | null = null;
let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler;
}

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh", undefined, { _retried: true } as RetriableConfig)
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.request.use((config) => {
  if (offlinePreview) {
    return Promise.reject(
      new ApiError("Backend not connected. You're exploring the interface without an API server.", "network"),
    );
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const url = config?.url ?? "";
    const shouldRefresh =
      error.response?.status === 401 &&
      config &&
      !config._retried &&
      !NO_REFRESH_PATHS.some((path) => url.startsWith(path));

    if (shouldRefresh) {
      config._retried = true;
      const refreshed = await refreshSession();
      if (refreshed) {
        try {
          return await api.request(config);
        } catch (retryError) {
          return Promise.reject(toApiError(retryError));
        }
      }
      onSessionExpired?.();
    }

    return Promise.reject(toApiError(error));
  },
);

/** Unwraps list responses that may be a bare array or a paginated envelope. */
export function toList<T>(data: unknown): { items: T[]; total: number | null } {
  if (Array.isArray(data)) return { items: data as T[], total: data.length };
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    for (const key of ["items", "results", "data", "audits", "websites", "recommendations", "pages"]) {
      if (Array.isArray(record[key])) {
        const total = typeof record["total"] === "number" ? record["total"] : (record[key] as T[]).length;
        return { items: record[key] as T[], total };
      }
    }
  }
  return { items: [], total: null };
}
