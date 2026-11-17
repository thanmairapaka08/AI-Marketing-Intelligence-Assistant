import { api, toList } from "./api";
import type { Website } from "./types";

export const websitesService = {
  async list() {
    const { data } = await api.get("/websites");
    return toList<Website>(data);
  },
  async get(id: string | number): Promise<Website> {
    const { data } = await api.get(`/websites/${id}`);
    return data as Website;
  },
  async create(input: { url: string; name?: string }): Promise<Website> {
    const { data } = await api.post("/websites", input);
    return data as Website;
  },
  async remove(id: string | number) {
    await api.delete(`/websites/${id}`);
  },
};
