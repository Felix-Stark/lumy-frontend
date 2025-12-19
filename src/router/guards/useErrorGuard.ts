export async function useErrorGuard() {
  const { useErrorStore } = await import('@/stores/errorStore')
  return useErrorStore()
}