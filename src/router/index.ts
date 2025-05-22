import { createRouter, createWebHistory } from 'vue-router'
import SlackLogin from '@/views/auth/slack/SlackLogin.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

import { useAuthStore } from '@/stores/authStore'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: AdminLayout,
      meta: {
        title: 'Home',
        requiresAuth: true,
      },
      children: [
        {
          path: '/admin/dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/Dashboard.vue'),
          meta: {
            title: 'Admin Dashboard',
            requiresAuth: true,
          },
        }
      ]
    },
    {
      path: '/slack',
      component: () => import('@/layouts/SlackLayout.vue'),
      redirect: '/slack/login',
      meta: {
        title: 'Slack Login',
      },
      children: [
        {
          path: '/slack/login',
          name: 'slack-login',
          component: SlackLogin,
        },
        {
          path: '/slack/callback',
          name: 'slack-callback',
          component: () => import('@/views/auth/slack/SlackCallback.vue'),
        },
        {
          path: '/slack/register',
          name: 'slack-register',
          component: () => import('@/views/auth/slack/SlackRegister.vue'),
        },
        {
          path: '/slack/install-redirect',
          name: 'slack-install-redirect',
          component: () => import('@/views/auth/slack/SlackInstallRedirect.vue'),
        }
      ]
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/Error.vue'),
    },
  ],
});


// Global navigation guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next({ name: 'slack-login' })
  } else {
    next()
  }
})

export default router
