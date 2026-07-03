import apiClient from "./apiClient";
import type { LoginResponse } from "../types/api";

export async function login(username: string, password: string) {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", {
    username: username.trim(),
    password,
  });
  return data;
}

export function normalizeRole(role?: string): string {
  if (!role) return "User";
  const upper = role.toUpperCase();
  if (upper === "ADMIN") return "Admin";
  if (upper === "OWNER") return "Owner";
  return "User";
}

export function storeAuthSession(
  data: LoginResponse,
  rememberMe: boolean,
): void {
  localStorage.clear();
  sessionStorage.clear();

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("accessToken", data.accessToken);

  if (data.user) {
    storage.setItem("userId", data.user.id?.toString() || "");
    storage.setItem("userName", data.user.name || "");
    storage.setItem("userRole", normalizeRole(data.user.role?.name));
  }
}

export function clearAuthSession(): void {
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userRole");
}
