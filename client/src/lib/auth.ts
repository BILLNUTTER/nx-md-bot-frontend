import { queryClient } from "./queryClient";

const TOKEN_KEY = "nxmd_token";
const ADMIN_KEY_STORE = "nxmd_admin_key";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  queryClient.clear();
}

export function getAdminKey(): string | null {
  return localStorage.getItem(ADMIN_KEY_STORE);
}

export function setAdminKey(key: string) {
  localStorage.setItem(ADMIN_KEY_STORE, key);
}

export function removeAdminKey() {
  localStorage.removeItem(ADMIN_KEY_STORE);
}

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const adminKey = getAdminKey();
  if (adminKey) headers["x-admin-key"] = adminKey;

  const res = await fetch(url, { ...options, headers });

  let json: any;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (res.status === 401) {
    removeToken();
    window.location.href = "/login";
    throw new Error(json?.message || "Unauthorized");
  }

  if (!res.ok) {
    throw new Error(json?.message || res.statusText || "Request failed");
  }

  return json; // ✅ always returns JSON
}

export async function authGet(url: string) {
  const res = await authFetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(data.message || "Request failed");
  }
  return res.json();
}

export async function authPost(url: string, data?: any) {
  const res = await authFetch(url, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(d.message || "Request failed");
  }
  return res.json();
}

export async function authPatch(url: string, data?: any) {
  const res = await authFetch(url, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(d.message || "Request failed");
  }
  return res.json();
}
