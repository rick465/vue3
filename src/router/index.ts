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
        // 客戶管理
        {
          path: 'customers',
          name: 'customers',
          meta: { requiresAuth: true },
          children: [
            {
              path: 'list',
              name: 'customers-list',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '客戶列表' }
            },
            {
              path: 'tags',
              name: 'customers-tags',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '客戶分組' }
            }
          ]
        },
        // 用戶管理
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
            },
            {
              path: 'roles',
              name: 'users-roles',
              component: () => import('@/views/users/RolesView.vue'),
              meta: { requiresAuth: true, permission: 'role:read' }
            }
          ]
        },
        // 訂單管理
        {
          path: 'orders',
          name: 'orders',
          meta: { requiresAuth: true },
          children: [
            {
              path: 'list',
              name: 'orders-list',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '訂單列表' }
            },
            {
              path: 'stats',
              name: 'orders-stats',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '訂單統計' }
            }
          ]
        },
        // 商品管理
        {
          path: 'products',
          name: 'products',
          meta: { requiresAuth: true },
          children: [
            {
              path: 'list',
              name: 'products-list',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '商品列表' }
            },
            {
              path: 'categories',
              name: 'products-categories',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '分類管理' }
            }
          ]
        },
        // 文件管理
        {
          path: 'files',
          name: 'files',
          meta: { requiresAuth: true },
          children: [
            {
              path: 'list',
              name: 'files-list',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '文件列表' }
            },
            {
              path: 'upload',
              name: 'files-upload',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '文件上傳' }
            }
          ]
        },
        // 消息中心
        {
          path: 'notifications',
          name: 'notifications',
          meta: { requiresAuth: true },
          children: [
            {
              path: 'list',
              name: 'notifications-list',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '消息列表' }
            },
            {
              path: 'announcements',
              name: 'notifications-announcements',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '公告管理' }
            }
          ]
        },
        // 操作日誌
        {
          path: 'logs',
          name: 'logs',
          meta: { requiresAuth: true },
          children: [
            {
              path: 'user',
              name: 'logs-user',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '用戶操作日誌' }
            },
            {
              path: 'login',
              name: 'logs-login',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '登入日誌' }
            }
          ]
        },
        // 數據報表
        {
          path: 'reports',
          name: 'reports',
          meta: { requiresAuth: true },
          children: [
            {
              path: 'user',
              name: 'reports-user',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '用戶報表' }
            },
            {
              path: 'order',
              name: 'reports-order',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '訂單報表' }
            }
          ]
        },
        // 系統設置
        {
          path: 'settings',
          name: 'settings',
          meta: { requiresAuth: true },
          children: [
            {
              path: 'base',
              name: 'settings-base',
              component: () => import('@/views/settings/SettingsView.vue'),
              meta: { requiresAuth: true, title: '基本設置' }
            },
            {
              path: 'security',
              name: 'settings-security',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '安全設置' }
            }
          ]
        },
        // 個人中心
        {
          path: 'profile',
          name: 'profile',
          meta: { requiresAuth: true },
          children: [
            {
              path: 'info',
              name: 'profile-info',
              component: () => import('@/views/profile/ProfileView.vue'),
              meta: { requiresAuth: true, title: '個人資料' }
            },
            {
              path: 'password',
              name: 'profile-password',
              component: () => import('@/views/notfound/NotFoundView.vue'),
              meta: { requiresAuth: true, title: '修改密碼' }
            }
          ]
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
