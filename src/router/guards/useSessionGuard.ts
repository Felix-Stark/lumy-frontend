// src/router/guards/useSessionGuard.ts
export async function useSessionGuard() {
  const { useSessionStore } = await import('@/stores/sessionStore')
  return useSessionStore()
}
