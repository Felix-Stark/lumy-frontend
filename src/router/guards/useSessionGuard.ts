// src/router/guards/useSessionGuard.ts
export async function useSessionGuard() {
  // dynamic import ensures the store module is only evaluated when this runs
  const mod = await import('@/stores/sessionStore')
  const { useSessionStore } = mod
  const store = useSessionStore()
  // ensure session is loaded
  try {
    await store.getSession()
  } catch (err) {
    // swallow or rethrow depending on your error handling strategy
  }
  return store
}