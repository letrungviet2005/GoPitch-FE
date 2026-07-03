import apiClient from "./apiClient";

export async function chatWithAI(message: string, lat: number, lng: number) {
  const { data } = await apiClient.post<{ reply: string }>("/ai/chat", {
    message,
    lat,
    lng,
  });
  return data.reply;
}
