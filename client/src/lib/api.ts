// lib/api.ts
import { getToken } from "./auth";

const BASE_URL = "https://nx-md-bot-65f116873bb7.herokuapp.com"; // backend URL

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();

  // Merge headers and add Authorization if token exists
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized globally
  if (res.status === 401) {
    // Clear token and redirect to login
    localStorage.removeItem("nxmd_token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  // Parse JSON response, fallback to status text on error
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
}
