import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/slack/callback',
      name: 'slack-callback',
      component: () => import('@/views/auth/slack/SlackCallback.vue'),
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/Error.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    }
  ],
})

export default router
