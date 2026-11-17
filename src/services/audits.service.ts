import { api, toList } from "./api";
import type {
  AuditDetail,
  AuditMetrics,
  AuditStatusResponse,
  AuditSummary,
  CreateAuditResponse,
  PageResult,
  Recommendation,
} from "./types";

export interface AuditListParams {
  website_id?: string | number;
  status?: string;
}

export const auditsService = {
  async create(url: string): Promise<CreateAuditResponse> {
    const { data } = await api.post("/audits", { url });
    return data as CreateAuditResponse;
  },
  async list(params: AuditListParams = {}) {
    const { data } = await api.get("/audits", { params });
    return toList<AuditSummary>(data);
  },
  async get(id: string): Promise<AuditDetail> {
    const { data } = await api.get(`/audits/${id}`);
    return data as AuditDetail;
  },
  async status(id: string): Promise<AuditStatusResponse> {
    const { data } = await api.get(`/audits/${id}/status`);
    return data as AuditStatusResponse;
  },
  async pages(id: string) {
    const { data } = await api.get(`/audits/${id}/pages`);
    return toList<PageResult>(data);
  },
  async metrics(id: string): Promise<AuditMetrics> {
    const { data } = await api.get(`/audits/${id}/metrics`);
    return data as AuditMetrics;
  },
  async recommendations(id: string) {
    const { data } = await api.get(`/audits/${id}/recommendations`);
    return toList<Recommendation>(data);
  },
};
