import { api } from "./api";
import type { ComparisonResult } from "./types";

export interface CompareInput {
  website_id: string | number;
  competitor_urls: string[];
}

export const competitorsService = {
  async compare(input: CompareInput): Promise<ComparisonResult> {
    const { data } = await api.post("/competitors/compare", input);
    return data as ComparisonResult;
  },
  async get(id: string): Promise<ComparisonResult> {
    const { data } = await api.get(`/competitors/comparisons/${id}`);
    return data as ComparisonResult;
  },
};
