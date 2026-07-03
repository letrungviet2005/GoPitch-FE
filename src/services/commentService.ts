import apiClient from "./apiClient";
import type { CommentResponseDTO, CreateCommentRequest } from "../types/api";

export async function getCommentsByClub(
  clubId: number,
): Promise<CommentResponseDTO[]> {
  const { data } = await apiClient.get<CommentResponseDTO[]>(
    `/comments/club/${clubId}`,
  );
  return data;
}

export async function createComment(
  payload: CreateCommentRequest,
): Promise<CommentResponseDTO> {
  const { data } = await apiClient.post<CommentResponseDTO>("/comments", payload);
  return data;
}

export async function deleteComment(id: number): Promise<void> {
  await apiClient.delete(`/comments/${id}`);
}
