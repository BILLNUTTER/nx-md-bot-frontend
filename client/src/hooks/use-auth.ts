import { useQuery } from "@tanstack/react-query";
import { authGet, getToken } from "@/lib/auth";
import type { User } from "@shared/schema";

export function useAuth() {
  const token = getToken();

  const { data: user, isLoading, error, refetch } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      if (!token) return null;
      try {
        return await authGet("/api/auth/me");
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 30000,
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user && !!token,
    error,
    refetch,
  };
}
