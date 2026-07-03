import apiClient from "./apiClient";
import type { BillResponseDTO } from "../types/api";

export async function getMyBookingHistory(): Promise<BillResponseDTO[]> {
  const { data } = await apiClient.get<BillResponseDTO[]>("/bills/my-history");
  return data;
}

export async function getBillDetail(id: number): Promise<BillResponseDTO> {
  const { data } = await apiClient.get<BillResponseDTO>(`/bills/${id}`);
  return data;
}
