import { defineStore } from "pinia";

import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
  const error = ref<{ code?: number; message: string } | null>(null)

  function setError(message: string, code?: number) {
    error.value = { message, code }
  }

  function clearError() {
    error.value = null
  }

  return { error, setError, clearError }
})