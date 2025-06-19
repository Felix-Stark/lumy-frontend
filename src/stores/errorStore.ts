import { defineStore } from "pinia";

export const useErrorStore = defineStore("error", {
  state: () => ({
    error: null as { code: number, detail: string } | null,
  }),
  actions: {
    setError(error: { code: number, detail: string }) {
      this.error = error;
    },
    clearError() {
      this.error = null;
    },
  },
});