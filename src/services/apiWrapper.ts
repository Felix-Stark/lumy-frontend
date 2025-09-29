import { type AxiosResponse } from "axios";
import api from "./api";
import { useErrorStore } from "@/stores/errorStore";

export async function apiRequest<T>(
  request: Promise<AxiosResponse<T>>
): Promise<T> {
  const errorStore = useErrorStore();

  try {
    const response = await request;
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Something went wrong";
    const code = err.response?.status;
    errorStore.setError(message, code);
    throw err; // rethrow so the caller can decide if it wants extra handling
  }
}

export default api;
