import { createRouter, createWebHistory } from 'vue-router'
import SlackLogin from '@/views/auth/slack/SlackLogin.vue'

import { useAuthStore } from '@/stores/authStore'
import { useErrorStore } from '@/stores/errorStore';
import SettingsLayout from '@/layouts/SettingsLayout.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout.vue';
import SetupLayout from '@/layouts/SetupLayout.vue';
import SlackLayout from '@/layouts/SlackLayout.vue';
import FeedbackOverview from '@/views/member/FeedbackOverview.vue';
import MemberDashboard from '@/views/member/MemberDashboard.vue';
import General from '@/views/settings/admin/General.vue';
import Intelligence from '@/views/settings/admin/Intelligence.vue';
import Users from '@/views/settings/admin/Users.vue';
import Integrations from '@/views/settings/member/Integrations.vue';
import SkillOverview from '@/views/member/SkillOverview.vue';
import Overview from '@/views/admin/Overview.vue';
import Teams from '@/views/settings/admin/Teams.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: SlackLayout,
      redirect: '/slack/login',
      meta: {
        title: 'Slack Login',
      },
      children: [
        {
          path: 'slack/login',
          name: 'slack-login',
          component: SlackLogin,
        },
        {
          path: 'slack/callback',
          name: 'slack-callback',
          component: () => import('@/views/auth/slack/SlackCallback.vue'),
        },
        {
          path: 'slack/register',
          name: 'slack-register',
          component: () => import('@/views/auth/slack/SlackRegister.vue'),
        },
        {
          path: 'slack/install-redirect',
          name: 'slack-install-redirect',
          component: () => import('@/views/auth/slack/SlackInstallRedirect.vue'),
        },
        {
          path: 'slack/install-success',
          name: 'slack-install-success',
          component: () => import('@/views/auth/slack/SlackInstallSuccess.vue'),
        },
        {
          path: 'slack/notadmin',
          name: 'slack-not-admin',
          component: () => import('@/views/auth/slack/SlackNotAdmin.vue'),
        }
      ]
    },
    {
      path: '/setup',
      component: SetupLayout,
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
      path: '/admin',
      component: AdminDashboardLayout,
      redirect: '/admin/overview',
      meta: {
        isAdmin: true,
        requiresAuth: true,
      },
      children: [
        {
          path: 'overview',
          name: 'admin-overview',
          component: Overview
        },
        {
          path: 'overview/employee',
          name: 'admin-overview-employee',
          component: () => import('@/views/admin/Employee.vue'),
        }
      ]
    },
    {
      path: '/member',
      name: 'member',
      redirect: '/member/overview',
      component: DashboardLayout,
      meta: {
        requiresAuth: true, // This route requires authentication
      },
      children: [
        {
          path: 'overview',
          name: 'member-overview',
          component: MemberDashboard,
        },
        {
          path: 'feedback-overview',
          name: 'feedback-overview',
          component: FeedbackOverview,
        },
        {
          path: 'skill-overview',
          name: 'skill-overview',
          component: SkillOverview,
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
      component: SettingsLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: 'member/integrations',
          name: 'settings-member-integrations',
          component: Integrations,
        },
        {
          path: 'admin/general',
          name: 'settings-admin-general',
          component: General,
          meta: { isAdmin: true }
        },
        {
          path: 'admin/intelligence',
          name: 'settings-admin-intelligence',
          component: Intelligence,
          meta: { isAdmin: true }
        },
        {
          path: 'admin/users',
          name: 'settings-admin-users',
          component: Users,
          meta: { isAdmin: true }
        },
        {
          path: 'admin/teams',
          name: 'settings-admin-teams',
          component: Teams,
          meta: { isAdmin: true }
        }

      ]
    },
    {
      path: '/feedback',
      redirect: '/feedback/give',
      children: [
        {
          path: 'give',
          name: 'feedback-give',
          component: () => import('@/views/feedback/Give.vue')
        },
        {
          path: 'give/success',
          name: 'feedback-give-success',
          component: () => import('@/views/feedback/GiveSuccess.vue')
        },
        {
          path: 'request',
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
  const rawLoggedIn = sessionStorage.getItem('loggedin')
  const raw = sessionStorage.getItem('LumyRole');
  const role = raw ? JSON.parse(raw) : null;
  const loggedIn = rawLoggedIn ? JSON.parse(rawLoggedIn) : null;

  // 1. Require authentication
  if (to.meta.requiresAuth && !loggedIn) {
    return next({ name: 'slack-login' });
  }

  // 2. Require admin
  if (to.meta.isAdmin && role !== 'admin') {
    const message = 'You do not have permission to access this page (admin only).'
    const code = 403;
    errorStore.setError(
      code, message
    );
    return next({ name: 'error' });
  }

  // 3. Require manager
  if (to.meta.isManager && role !== 'manager') {
    const message = 'You do not have permission to access this page (manager only).'
    const code = 403;
    errorStore.setError(
      code, message
    );
    return next({ name: 'error' });
  }

  if (from.name === 'slack-callback' && role !== 'member') {
    return next({ name: 'admin-overview' });
  }
  if (from.name === 'slack-callback' && role === 'member') {
    return next({ name: 'member' });
  }


  if(to.path === null) {
    const code = 404;
    const message = 'Page not found!'
    errorStore.setError(code, message);
    return next({ name: 'error' })
  }
  // ✅ 4. Allow navigation
  next();
});


export default router
