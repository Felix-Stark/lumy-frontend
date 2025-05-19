import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import Dashboard from '../views/Dashboard.vue'
import { useAuthStore } from '@/stores/authStore'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: 'Home',
        requiresAuth: true,
      }
    },
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
});


// Global navigation guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
