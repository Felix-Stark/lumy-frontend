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
import Employee from '@/views/admin/Employee.vue';
import Give from '@/views/feedback/Give.vue';
import GiveSuccess from '@/views/feedback/GiveSuccess.vue';
import Error from '@/views/Error.vue';
const authStore = useAuthStore();
const role = authStore.session?.user.role || '';
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top:0 }),
  routes: [
    {
      path: '/',
      component: SlackLayout,
      redirect: () => {
        authStore.getSession();
        if (!authStore.authenticated) {
          return '/slack/login';
        } else if (authStore.authenticated && role === 'admin') {
          return '/admin/overview';
        } else {
          return '/member/overview';
        }
      },
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
        roles: ["manager", "admin"]
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
          component: Employee,
        }
      ]
    },
    {
      path: '/member',
      redirect: '/member/overview',
      component: DashboardLayout,
      meta: {
        roles: ["member", "manager", "admin"]
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
        if (role === 'admin') {
          return '/settings/admin/general';
        } else {
          return '/settings/member/integrations';
        }
      },
      component: SettingsLayout,
      children: [
        {
          path: 'member/integrations',
          name: 'settings-member-integrations',
          component: Integrations,
          meta: { roles: ["member", "manager", "admin"] }
        },
        {
          path: 'admin/general',
          name: 'settings-admin-general',
          component: General,
          meta: { roles: ["admin"] }
        },
        {
          path: 'admin/intelligence',
          name: 'settings-admin-intelligence',
          component: Intelligence,
          meta: { roles: ["admin"] }
        },
        {
          path: 'admin/users',
          name: 'settings-admin-users',
          component: Users,
          meta: { roles: ["admin"] }
        },
        {
          path: 'admin/teams',
          name: 'settings-admin-teams',
          component: Teams,
          meta: { roles: ["admin"] }
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
          component: Give
        },
        {
          path: 'give/success',
          name: 'feedback-give-success',
          component: GiveSuccess
        },
      ]
    },
    {
      path: '/error',
      name: 'error',
      component: Error,
    },
  ],
});


// Global navigation guard
router.beforeEach(async(to, from, next) => {
  const errorStore = useErrorStore();
  const authStore = useAuthStore();
  await authStore.getSession();
  const role = authStore.session?.user.role || '';
  // ✅ 1. Check if the user is authenticated
 
  const allowedRoles = to.meta.roles as string[] | undefined;

  if (!allowedRoles) {
    return next(); // unrestricted route
  }

  if (allowedRoles.includes(role)) {
    return next(); // user is allowed
  }

  if(!allowedRoles.includes(role)) {
    const message = 'You do not have permission to access this page (admin only).'
    const code = 403;
    errorStore.setError(
      code, message
    );
    return next({ name: 'error' });
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
