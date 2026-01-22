import { createRouter, createWebHistory } from 'vue-router'

import { useErrorStore } from '@/stores/errorStore';
import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top:0 }),
  routes: routes
});

const roleRedirectMap: Record<string, string> = {
  admin: '/admin/overview',
  manager: '/admin/overview',
  member: '/member/overview'
}
const settingsRedirect: Record<string, string> = {
  admin: '/settings/admin/general',
  manager: '/settings/member/integrations',
  member: '/settings/member/integrations'
}

router.beforeEach(async (to, from, next) => {
  // Only call the session guard when you need session info.
  // If the route is public and you don't need role, you can skip.

  let sessionStore = null

  try {
    // Lazily import and fetch session (guarantees Pinia is installed)
    const { useSessionGuard } = await import('./guards/useSessionGuard')
    sessionStore = await useSessionGuard()
  } catch (err) {
    // If session fetch fails, treat as not authenticated
    console.error('Session guard error:', err)
  }

  const role = sessionStore?.user?.role ?? ''
  const authenticated = sessionStore?.authenticated ?? false

  // If they're authenticated and trying to visit auth/login pages -> redirect based on role
  if (authenticated && (to.name === 'slack-login' || to.path === '/' || to.path === '/login')) {
    const redirectTo = roleRedirectMap[role] || '/member/overview'
    return next(redirectTo)
  }

  if (authenticated && (to.name === 'settings')) {
    const redirectTo = settingsRedirect[role];
    return next(redirectTo)
  }

  // If route has role restrictions, check them
  const allowedRoles = to.meta?.roles as string[] | undefined
  if (!allowedRoles) {
    return next()
  }

  if (!authenticated) {
    // not logged in -> redirect to login (or Slack login)
    return next({ name: 'slack-login' })
  }

  if (allowedRoles.includes(role)) {
    return next()
  } else {
    // unauthorized
    const errorStore = useErrorStore()
    errorStore.setError(403, 'You do not have permission to access this page.')
    return next({ name: 'error' })
  }  
})

export default router

