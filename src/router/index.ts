import { createRouter, createWebHistory } from 'vue-router'
import SlackLogin from '@/views/auth/slack/SlackLogin.vue'
import AdminLayout from '@/layouts/admin/AdminLayout.vue'

import { useAuthStore } from '@/stores/authStore'
import { useErrorStore } from '@/stores/errorStore';



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/member',
      component: () => import('@/layouts/MemberLayout.vue'),
      redirect: '/member/dashboard',
      meta: {
        requiresAuth: true, // This route requires authentication
      },
      children: [
        {
          path: '/member/dashboard',
          name: 'member-dashboard',
          component: () => import('@/views/member/MemberDashboard.vue'),
        },
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: {
        title: 'Admin dashboard',
        requiresAuth: false,
        isAdmin: true, // This route requires admin privileges
      },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/Dashboard.vue'),
          meta: {
            title: 'Admin Dashboard',
            requiresAuth: false,
          },
        },
        {
          path: 'settings',
          component: () => import('@/layouts/admin/AdminSettingsLayout.vue'),
          redirect: '/admin/settings/general',
          meta: {
            title: 'Admin Settings',
          },
          children: [
            {
              path: 'general',
              name: 'admin-settings-general',
              component: () => import('@/views/admin/settings/General.vue'),
            },
            {
              path: 'users',
              name: 'admin-settings-users',
              component: () => import('@/views/admin/settings/Users.vue'),
            }
          ]
        },
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
        },
        {
          path: '/slack/install-success',
          name: 'slack-install-success',
          component: () => import('@/views/auth/slack/SlackInstallSuccess.vue'),
        },
        {
          path: '/slack/notadmin',
          name: 'slack-notadmin',
          component: () => import('@/views/auth/slack/SlackNotAdmin.vue'),
        }
      ]
    },
    {
      path: '/setup',
      component: () => import('@/layouts/SetupLayout.vue'),
      redirect: '/setup/framework',
      children: [
        {
          path: 'framework',
          name: 'setup-framework',
          component: () => import('@/views/admin/setup/Framework.vue'),
        },
        {
          path: 'users',
          name: 'setup-users',
          component: () => import('@/views/admin/setup/Users.vue'),
        },
      ]
    },
    {
      path: '/feedback',
      redirect: '/feedback/give',
      children: [
        {
          path: '/feedback/give',
          name: 'feedback-give',
          component: () => import('@/views/feedback/Give.vue')
        },
        {
          path: '/feedback/give/success',
          name: 'feedback-give-success',
          component: () => import('@/views/feedback/GiveSuccess.vue')
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

  const isLoggedIn = sessionStorage.getItem('LumyLoggedIn')
  if (to.meta.requiresAuth && !isLoggedIn) {

    next({ name: 'slack-login' })
  } else if (isLoggedIn && to.meta.isAdmin) {
    const role = sessionStorage.getItem('LumyRole')
    if (role !== 'admin') {
      const errorStore = useErrorStore();
      errorStore.setError({
        code: 403,
        detail: 'You do not have permission to access this page.',
      });
      next({ name: 'error' })
    } else {
      next()
    }
  }else {
    next()
  }
})

export default router
