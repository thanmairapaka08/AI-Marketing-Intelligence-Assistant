import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { queryKeys } from "@/app/query-keys";
import { setOfflinePreview, setSessionExpiredHandler } from "@/services/api";
import { authService, type LoginInput, type RegisterInput } from "@/services/auth.service";
import { ApiError, toApiError } from "@/services/errors";
import type { User } from "@/services/types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "unreachable" | "preview";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  error: ApiError | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  enterPreview: () => void;
  exitPreview: () => void;
  recheck: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchMe(): Promise<User | null> {
  try {
    return await authService.me();
  } catch (error) {
    const apiError = toApiError(error);
    // 401 = no session. Anything else (unreachable, missing endpoint) is surfaced as an error.
    if (apiError.kind === "unauthorized" || apiError.kind === "forbidden") return null;
    throw apiError;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState(false);

  const meQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60_000,
    enabled: !preview,
  });

  useEffect(() => {
    setSessionExpiredHandler(() => queryClient.setQueryData(queryKeys.me, null));
    return () => setSessionExpiredHandler(null);
  }, [queryClient]);

  const login = useCallback(
    async (input: LoginInput) => {
      await authService.login(input);
      const user = await authService.me();
      queryClient.setQueryData(queryKeys.me, user);
    },
    [queryClient],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      await authService.register(input);
      // Sign in right away so the new account lands on the dashboard.
      await login({ email: input.email, password: input.password });
    },
    [login],
  );

  const logout = useCallback(async () => {
    if (preview) {
      setOfflinePreview(false);
      setPreview(false);
    } else {
      try {
        await authService.logout();
      } catch {
        // Clear local state even if the backend call fails.
      }
    }
    queryClient.clear();
    queryClient.setQueryData(queryKeys.me, null);
  }, [preview, queryClient]);

  const enterPreview = useCallback(() => {
    setOfflinePreview(true);
    setPreview(true);
  }, []);

  const exitPreview = useCallback(() => {
    setOfflinePreview(false);
    setPreview(false);
    queryClient.clear();
  }, [queryClient]);

  const recheck = useCallback(() => {
    void meQuery.refetch();
  }, [meQuery]);

  const value = useMemo<AuthContextValue>(() => {
    let status: AuthStatus;
    if (preview) status = "preview";
    else if (meQuery.isPending) status = "loading";
    else if (meQuery.isError) status = "unreachable";
    else status = meQuery.data ? "authenticated" : "unauthenticated";

    return {
      user: preview ? null : (meQuery.data ?? null),
      status,
      error: meQuery.error ? toApiError(meQuery.error) : null,
      login,
      register,
      logout,
      enterPreview,
      exitPreview,
      recheck,
    };
  }, [preview, meQuery.isPending, meQuery.isError, meQuery.data, meQuery.error, login, register, logout, enterPreview, exitPreview, recheck]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function displayName(user: User | null): string {
  if (!user) return "Guest";
  return user.full_name || user.name || user.email.split("@")[0];
}

export function initials(user: User | null): string {
  const name = displayName(user);
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
