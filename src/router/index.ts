import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import MainLayout from '@/components/layout/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', redirect: '/dashboard' },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'users',
          name: 'users',
          meta: { requiresAuth: true, permission: 'user:read' },
          children: [
            {
              path: 'list',
              name: 'users-list',
              component: () => import('@/views/users/UsersListView.vue'),
              meta: { requiresAuth: true }
            },
            {
              path: 'logs',
              name: 'users-logs',
              component: () => import('@/views/users/UsersLogsView.vue'),
              meta: { requiresAuth: true }
            }
          ]
        },
        {
          path: 'roles',
          name: 'roles',
          component: () => import('@/views/roles/RolesView.vue'),
          meta: { requiresAuth: true, permission: 'role:read' }
        },
        {
          path: 'permissions',
          name: 'permissions',
          component: () => import('@/views/permissions/PermissionsView.vue'),
          meta: { requiresAuth: true, permission: 'permission:read' }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/settings/SettingsView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/profile/ProfileView.vue'),
          meta: { requiresAuth: true, title: '个人资料' }
        },
        {
          path: 'notfound',
          name: 'notfound',
          component: () => import('@/views/notfound/NotFoundView.vue'),
          meta: { requiresAuth: false }
        }
      ]
    },
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 检查是否需要认证
  if (to.meta.requiresAuth !== false) {
    if (!userStore.isLoggedIn) {
      next('/login')
      return
    }

    // 检查权限
    if (to.meta.permission && !userStore.hasPermission(to.meta.permission as string)) {
      next('/dashboard')
      return
    }
  }

  // 如果已登录且访问登录页，重定向到仪表板
  if (to.path === '/login' && userStore.isLoggedIn) {
    next('/dashboard')
    return
  }

  next()
})

export default router
