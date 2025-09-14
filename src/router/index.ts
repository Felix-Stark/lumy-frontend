import { createRouter, createWebHistory } from 'vue-router'
import SlackLogin from '@/views/auth/slack/SlackLogin.vue'

import { useAuthStore } from '@/stores/authStore'
import { useErrorStore } from '@/stores/errorStore';



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
          name: 'slack-not-admin',
          component: () => import('@/views/auth/slack/SlackNotAdmin.vue'),
        }
      ]
    },
    {
      path: '/setup',
      component: () => import('@/layouts/SetupLayout.vue'),
      redirect: '/setup/frameworks',
      children: [
        {
          path: 'users',
          name: 'setup-users',
          component: () => import('@/views/auth/setup/Users.vue'),
        },
        {
          path: 'frameworks',
          name: 'setup-frameworks',
          component: () => import('@/views/auth/setup/Frameworks.vue'),
        },
        {
          path: 'complete',
          name: 'setup-complete',
          component: () => import('@/views/auth/setup/Complete.vue'),
        }
      ]
    },
    {
      path: '/member',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: {
        requiresAuth: true, // This route requires authentication
      },
      children: [
        {
          path: '',
          name: 'member-dashboard',
          component: () => import('@/views/member/MemberDashboard.vue'),
        },
        {
          path: 'feedback/overview',
          name: 'feedback-overview',
          component: () => import('@/views/feedback/Overview.vue'),
        }
      ]
    },  
    {
      path: '/settings',
      redirect: () => {
        const raw = sessionStorage.getItem('LumyRole')
        const role = raw ? JSON.parse(raw) : null;
        if (role === 'admin') {
          return '/settings/admin/general';
        } else {
          return '/settings/member/integrations';
        }
      },
      component: () => import('@/layouts/SettingsLayout.vue'),
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: 'member/integrations',
          name: 'settings-member-integrations',
          component: () => import('@/views//settings/member/Integrations.vue'),
        },
        {
          path: 'admin/general',
          name: 'settings-admin-general',
          component: () => import('@/views/settings/admin/General.vue'),
          meta: { isAdmin: true }
        },
        {
          path: 'admin/intelligence',
          name: 'settings-admin-intelligence',
          component: () => import('@/views/settings/admin/Intelligence.vue'),
          meta: { isAdmin: true }
        },
        {
          path: 'admin/users',
          name: 'settings-admin-users',
          component: () => import('@/views/settings/admin/Users.vue'),
          meta: { isAdmin: true }
        }

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
        },
        {
          path: '/feedback/request',
          name: 'feedback-request',
          component: () => import('@/views/feedback/Request.vue'),
          meta: { requiresAuth: true }
        },
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
  const store = useAuthStore();
  const raw = sessionStorage.getItem('LumyRole')
  const role = raw ? JSON.parse(raw) : null;
  if (to.meta.requiresAuth && !store.isLoggedIn) {
    next({ name: 'slack-login' })
  } else if (to.meta.isAdmin) {
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
    } else {
      next()
    }
})

export default router
