import { defineStore } from "pinia";

import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
  const error = ref<{ code?: number; message?: string } | null>(null)

  function setError( code?: number, message?: string) {
    error.value = { code, message }
  }

  function clearError() {
    error.value = null
  }

  return { error, setError, clearError }
})