import apiClient, { unwrapResult } from "./apiClient";
import type { ClubDetail } from "../types/api";

export async function getClubById(id: string | number): Promise<ClubDetail> {
  const { data } = await apiClient.get<ClubDetail | { result: ClubDetail }>(
    `/clubs/${id}`,
  );
  return unwrapResult(data);
}

export async function getExtraServicesByClub(clubId: string | number) {
  const { data } = await apiClient.get(`/extra-services/club/${clubId}`);
  return data;
}
