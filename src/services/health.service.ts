import axios from "axios";

import { isOfflinePreview } from "./api";
import { API_ROOT_URL } from "./config";
import type { HealthResult } from "./types";

const root = axios.create({ baseURL: API_ROOT_URL, timeout: 8_000 });

async function probe(path: string): Promise<HealthResult> {
  if (isOfflinePreview()) return { ok: false, status: null, latencyMs: null, body: null };
  const started = performance.now();
  try {
    const response = await root.get(path);
    return {
      ok: true,
      status: response.status,
      latencyMs: Math.round(performance.now() - started),
      body: response.data,
    };
  } catch (error) {
    const status = axios.isAxiosError(error) ? (error.response?.status ?? null) : null;
    return { ok: false, status, latencyMs: null, body: null };
  }
}

export interface OpenApiSchema {
  paths?: Record<string, Record<string, unknown>>;
  info?: { title?: string; version?: string };
}

export const healthService = {
  health: () => probe("/health"),
  ready: () => probe("/ready"),
  async openapi(): Promise<OpenApiSchema | null> {
    if (isOfflinePreview()) return null;
    try {
      const { data } = await root.get("/openapi.json");
      return data as OpenApiSchema;
    } catch {
      return null;
    }
  },
};
