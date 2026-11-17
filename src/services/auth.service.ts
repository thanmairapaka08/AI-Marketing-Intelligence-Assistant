import { api } from "./api";
import type { User } from "./types";

export interface LoginInput {
  email: string;
  password: string;
}
export interface RegisterInput {
  full_name: string;
  email: string;
  password: string;
}

export const authService = {
  async me(): Promise<User> {
    const { data } = await api.get("/auth/me");
    return (data?.user ?? data) as User;
  },
  async login(input: LoginInput) {
    const { data } = await api.post("/auth/login", input);
    return data;
  },
  async register(input: RegisterInput) {
    const { data } = await api.post("/auth/register", input);
    return data;
  },
  async logout() {
    await api.post("/auth/logout");
  },
};
