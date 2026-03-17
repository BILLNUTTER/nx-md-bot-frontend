// lib/api.ts
const BASE_URL = "https://nx-md-bot-65f116873bb7.herokuapp.com"; // hardcoded backend URL

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    // Attempt to parse the error message, fallback to status text
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
}
