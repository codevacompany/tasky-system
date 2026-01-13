import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
// import PublicLayout from '@/layouts/PublicLayout.vue';
import LoginPage from '@/pages/public/LoginPage.vue';
import UserHome from '@/pages/user/UserHome.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import UserList from '@/pages/admin/UserList.vue';
import DepartmentList from '@/pages/admin/DepartmentList.vue';
import ReportsPage from '@/pages/admin/ReportsPage.vue';
import CategoryList from '@/pages/admin/CategoryList.vue';
import TicketsPage from '@/pages/user/TicketsPage.vue';
import ClientManagement from '@/pages/admin/ClientManagement.vue';
import ClientUsers from '@/pages/admin/ClientUsers.vue';
import ClientSettings from '@/pages/admin/ClientSettings.vue';
import SyncPage from '@/pages/user/SyncPage.vue';
import { localStorageService } from '@/utils/localStorageService';
import SignUpManagement from '@/pages/admin/SignUpManagement.vue';
import { RoleName } from '@/models';
import { useUserStore } from '@/stores/user';

const routes: RouteRecordRaw[] = [
  // Public Routes (No Layout)
  {
    path: '/login',
    component: LoginPage,
    meta: { requiresAuth: false },
  },
  {
    path: '/cadastrar',
    component: () => import('@/pages/public/SignUpPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/completar-cadastro/:token',
    component: () => import('@/pages/public/CompleteRegistration.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/esqueci-senha',
    component: () => import('@/pages/public/ResetPasswordRequestPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/verificar-codigo',
    component: () => import('@/pages/public/VerifyCodePage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/nova-senha',
    component: () => import('@/pages/public/SetNewPasswordPage.vue'),
    meta: { requiresAuth: false },
  },

  // User Panel Routes
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', component: UserHome },
      { path: 'minhas-tarefas', component: TicketsPage },
      {
        path: 'minhas-tarefas/arquivadas',
        component: () => import('@/pages/user/ArchivedTicketsPage.vue'),
      },
      { path: 'faq', component: () => import('@/pages/user/FAQ.vue') },
      { path: 'sync', component: SyncPage },
      {
        path: 'assinaturas',
        redirect: '/admin/configuracoes/assinaturas',
      },
      {
        path: 'assinaturas/simular-plano-customizado',
        redirect: '/admin/configuracoes/assinaturas/simular-plano-customizado',
      },
    ],
    meta: { requiresAuth: true },
  },

  // Admin Panel Routes
  {
    path: '/admin',
    component: DashboardLayout,
    children: [
      { path: '', component: UserHome },
      {
        path: 'relatorios',
        component: ReportsPage,
        meta: { roles: [RoleName.TenantAdmin, RoleName.Supervisor] },
      },
      {
        path: 'usuarios',
        component: UserList,
        meta: { roles: [RoleName.TenantAdmin] },
      },
      {
        path: 'setores',
        component: DepartmentList,
        meta: { roles: [RoleName.TenantAdmin] },
      },
      {
        path: 'categorias',
        component: CategoryList,
        meta: { roles: [RoleName.TenantAdmin] },
      },
      {
        path: 'configuracoes',
        component: () => import('@/pages/admin/AdminSettings.vue'),
        meta: { roles: [RoleName.TenantAdmin] },
        children: [
          {
            path: '',
            redirect: '/admin/configuracoes/empresa',
          },
          {
            path: 'empresa',
            component: () => import('@/pages/admin/TenantSettings.vue'),
          },
          {
            path: 'assinaturas',
            component: () => import('@/pages/admin/BillingPage.vue'),
          },
          {
            path: 'assinaturas/simular-plano-customizado',
            component: () => import('@/pages/admin/CustomPlanSimulationPage.vue'),
          },
        ],
      },
      {
        path: 'clientes',
        component: ClientManagement,
        meta: { roles: [RoleName.GlobalAdmin] },
      },
      {
        path: 'clientes/:id/usuarios',
        component: ClientUsers,
        meta: { roles: [RoleName.GlobalAdmin] },
      },
      {
        path: 'clientes/:id/configuracoes',
        component: ClientSettings,
        meta: { roles: [RoleName.GlobalAdmin] },
      },
      {
        path: 'cadastros',
        component: SignUpManagement,
        meta: { roles: [RoleName.GlobalAdmin] },
      },
    ],
    meta: { requiresAuth: true },
  },

  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../pages/AdminDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: [RoleName.GlobalAdmin, RoleName.TenantAdmin],
    },
  },

  // Not Found Route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const hasTokens = localStorageService.getAccessToken() && localStorageService.getRefreshToken();

  if (hasTokens && !userStore.user) {
    try {
      await userStore.whoami();
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }

  const loggedIn = hasTokens && userStore.user?.role;

  if (requiresAuth && !loggedIn) {
    return next('/login');
  }

  const hasRequiredRole = to.matched.every((record) => {
    if (!record.meta.roles) return true;

    const userRole = userStore.user?.role.name;

    return Array.isArray(record.meta.roles) && userRole
      ? record.meta.roles.includes(userRole)
      : true;
  });

  if (requiresAuth && !hasRequiredRole) {
    return next('/');
  }

  if (requiresAuth && userStore.hasActiveSubscription === false && to.path !== '/assinaturas') {
    return next('/assinaturas');
  }

  // Check if user has accepted terms (except for accept-terms endpoint and public pages)
  if (
    requiresAuth &&
    userStore.user &&
    (!userStore.user.termsAccepted || !userStore.user.privacyPolicyAccepted) &&
    to.path !== '/assinaturas' &&
    !to.path.includes('/accept-terms')
  ) {
    // Don't redirect if already on home page (modal will show)
    if (to.path !== '/') {
      return next('/');
    }
  }

  next();
});

export default router;
