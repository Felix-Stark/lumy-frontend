import { createRouter, createWebHistory } from 'vue-router'
import SlackLogin from '@/views/auth/slack/SlackLogin.vue'

import { useAuthStore } from '@/stores/authStore'
import { useErrorStore } from '@/stores/errorStore';



const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
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
      path: '/overview',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: {
        requiresRole: true,
        requiresAuth: true,
      },
      children: [
        {
          path: 'employee',
          name: 'overview-employee',
          component: () => import('@/views/admin/Employee.vue'),
        }
      ]
    },
    {
      path: '/member',
      name: 'member',
      redirect: '/member/overview',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: {
        requiresAuth: true, // This route requires authentication
      },
      children: [
        {
          path: '/member/overview',
          name: 'member-overview',
          component: () => import('@/views/member/MemberDashboard.vue'),
        },
        {
          path: 'feedback-overview',
          name: 'feedback-overview',
          component: () => import('@/views/member/FeedbackOverview.vue'),
        },
        {
          path: 'skill-overview',
          name: 'skill-overview',
          component: () => import('@/views/member/SkillOverview.vue'),
        }
      ]
    },  
    {
      path: '/settings',
      name: 'settings',
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
          component: () => import('@/views/settings/member/Integrations.vue'),
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
  const errorStore = useErrorStore();

  const raw = sessionStorage.getItem('LumyRole');
  const role = raw ? JSON.parse(raw) : null;

  // 1. Require authentication
  if (to.meta.requiresAuth && !store.isLoggedIn) {
    return next({ name: 'slack-login' });
  }

  // 2. Require admin
  if (to.meta.isAdmin && role !== 'admin') {
    errorStore.setError({
      code: 403,
      detail: 'You do not have permission to access this page (admin only).',
    });
    return next({ name: 'error' });
  }

  // 3. Require manager
  if (to.meta.isManager && role !== 'manager') {
    errorStore.setError({
      code: 403,
      detail: 'You do not have permission to access this page (manager only).',
    });
    return next({ name: 'error' });
  }

  // ✅ 4. Allow navigation
  next();
});


export default router
