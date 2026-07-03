import apiClient, { unwrapResult } from "./apiClient";
import type { UpdateProfileRequest, UserProfile } from "../types/api";

export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile | { result: UserProfile }>(
    "/users/me",
  );
  return unwrapResult(data);
}

export async function updateMyProfile(
  payload: UpdateProfileRequest,
): Promise<UserProfile> {
  const { data } = await apiClient.put<UserProfile>(
    "/user-info/profile",
    payload,
  );
  return data;
}
