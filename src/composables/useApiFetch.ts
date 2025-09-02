// src/composables/useApiFetch.ts
import { ref } from "vue";
import api from "@/services/api";

interface UseApiFetchOptions<T> {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  body?: any;
  params?: Record<string, any>;
}

export function useApiFetch<T>(options: UseApiFetchOptions<T>) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  // this is the function you call to actually run the request
  const run = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.request<T>({
        method: options.method,
        url: options.url,
        data: options.body,
        params: options.params,
      });
      data.value = response.data;
    } catch (err: any) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    error,
    loading,
    run, // function to trigger the fetch
  };
}
