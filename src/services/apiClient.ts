import axios from "axios";
import config from "../config/config";

const apiClient = axios.create({
  baseURL: config,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((req) => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default apiClient;

export function unwrapResult<T>(data: T | { result?: T }): T {
  if (data && typeof data === "object" && "result" in data) {
    return (data as { result?: T }).result as T;
  }
  return data as T;
}
