import apiClient from "./apiClient";
import type { BillResponseDTO } from "../types/api";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface PaginatedResponse<T> {
  meta: PaginationMeta;
  result: T[];
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  active: boolean;
  point: number;
  streakCount?: number;
  createdAt?: string;
  role?: {
    id: number;
    name: string;
  };
}

export interface AdminRole {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  permissions?: string[];
}

export interface AdminPermission {
  id: number;
  name: string;
  apiPath: string;
  method: string;
  module: string;
}

export interface PermissionPayload {
  id?: number;
  name: string;
  apiPath: string;
  method: string;
  module: string;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  password: string;
  roleId: number;
  active?: boolean;
  point?: number;
}

export interface UpdateAdminUserPayload {
  name?: string;
  email?: string;
  roleId?: number;
  active?: boolean;
  point?: number;
}

export interface RolePayload {
  name: string;
  description?: string;
  active?: boolean;
  permissionIds?: number[];
}

export interface OwnerClub {
  id: number;
  name: string;
  address: string;
  active: boolean;
  pitches?: { id: number; name: string; active: boolean }[];
  phoneNumber?: string;
  imageAvatar?: string;
}

export interface RevenueSummary {
  total: number;
  count: number;
  paidCount: number;
}

export interface DashboardMetrics {
  users: number;
  clubs: number;
  bills: number;
  revenue: number;
}

export async function getAdminUsers(params: {
  page?: number;
  size?: number;
  sort?: string;
} = {}) {
  const { data } = await apiClient.get<PaginatedResponse<AdminUser>>(
    "/admin/users",
    { params },
  );
  return data;
}

export async function setAdminUserActive(id: number, active: boolean) {
  const { data } = await apiClient.patch<AdminUser>(
    `/admin/users/${id}/active`,
    null,
    { params: { active } },
  );
  return data;
}

export async function createAdminUser(payload: CreateAdminUserPayload) {
  const { data } = await apiClient.post<AdminUser>("/admin/users", payload);
  return data;
}

export async function updateAdminUser(
  id: number,
  payload: UpdateAdminUserPayload,
) {
  const { data } = await apiClient.put<AdminUser>(`/admin/users/${id}`, payload);
  return data;
}

export async function getAdminRoles(params: {
  page?: number;
  size?: number;
  sort?: string;
} = {}) {
  const { data } = await apiClient.get<PaginatedResponse<AdminRole>>(
    "/admin/roles",
    { params },
  );
  return data;
}

export async function createAdminRole(payload: RolePayload) {
  const { data } = await apiClient.post<AdminRole>("/admin/roles", payload);
  return data;
}

export async function updateAdminRole(id: number, payload: RolePayload) {
  const { data } = await apiClient.put<AdminRole>(`/admin/roles/${id}`, payload);
  return data;
}

export async function deleteAdminRole(id: number) {
  await apiClient.delete(`/admin/roles/${id}`);
}

export async function getAdminPermissions(params: {
  page?: number;
  size?: number;
  sort?: string;
} = {}) {
  const { data } = await apiClient.get<PaginatedResponse<AdminPermission>>(
    "/admin/permissions",
    { params },
  );
  return data;
}

export async function createAdminPermission(payload: PermissionPayload) {
  const { data } = await apiClient.post<AdminPermission>(
    "/admin/permissions",
    payload,
  );
  return data;
}

export async function updateAdminPermission(payload: PermissionPayload) {
  const { data } = await apiClient.put<AdminPermission>(
    "/admin/permissions",
    payload,
  );
  return data;
}

export async function deleteAdminPermission(id: number) {
  await apiClient.delete(`/admin/permissions/${id}`);
}

export async function getDashboardMetrics() {
  const { data } = await apiClient.get<DashboardMetrics>(
    "/admin/dashboard/metrics",
  );
  return data;
}

export async function getOwnerClubs(params: {
  page?: number;
  size?: number;
  name?: string;
  sort?: string;
} = {}) {
  const { data } = await apiClient.get<PaginatedResponse<OwnerClub>>(
    "/owner/clubs",
    { params },
  );
  return data;
}

export async function createOwnerClub(payload: unknown) {
  const { data } = await apiClient.post<OwnerClub>("/owner/clubs", payload);
  return data;
}

export async function getOwnerClub(id: string | number) {
  const { data } = await apiClient.get<OwnerClub | any>(`/owner/clubs/${id}`);
  return data;
}

export async function updateOwnerClub(id: string | number, payload: unknown) {
  const { data } = await apiClient.put<OwnerClub>(`/owner/clubs/${id}`, payload);
  return data;
}

export async function deleteOwnerClub(id: string | number) {
  await apiClient.delete(`/owner/clubs/${id}`);
}

export async function getRevenueSummary() {
  const { data } = await apiClient.get<RevenueSummary>("/admin/revenue/summary");
  return data;
}

export async function getRevenueTransactions(params: {
  page?: number;
  size?: number;
  sort?: string;
} = {}) {
  const { data } = await apiClient.get<PaginatedResponse<BillResponseDTO>>(
    "/admin/revenue/transactions",
    { params },
  );
  return data;
}
