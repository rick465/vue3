<template>
  <div class="min-h-screen bg-gray-900 flex">
    <!-- 侧边栏 -->
    <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800 flex flex-col shadow-lg">
      <!-- LOGO区 -->
      <div class="flex items-center h-16 px-6 border-b border-gray-800">
        <svg class="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="ml-2 text-2xl font-bold text-blue-300 tracking-wide select-none">Vue</span>
      </div>
      <!-- 菜单区 -->
      <nav class="flex-1 overflow-y-auto py-4 px-2">
        <div class="space-y-1">
          <template v-for="item in menuItems" :key="item.path">
            <div v-if="item.children && item.children.length" class="mb-1">
              <div
                class="sidebar-item text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-lg px-3 py-2 flex items-center cursor-pointer select-none"
                :class="{ 'bg-gray-800 text-blue-400': isMenuOpen(item) }"
                @click="toggleMenu(item)"
              >
                <component :is="item.icon" class="h-5 w-5 mr-3" />
                <span class="truncate flex-1">{{ item.title }}</span>
                <svg class="h-4 w-4 ml-2 transition-transform" :class="{ 'rotate-90': isMenuOpen(item) }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <transition name="fade">
                <div v-show="isMenuOpen(item)" class="pl-6 space-y-1">
                  <router-link
                    v-for="child in item.children"
                    :key="child.path"
                    :to="child.path"
                    class="sidebar-item m-2 text-gray-300 hover:text-blue-400 hover:bg-gray-800/80 rounded-md px-3 py-2 flex items-center transition-all border-l-2"
                    :class="{
                      'text-blue-500': $route.path === child.path,
                      'bg-gray-800/80 text-blue-400 border-blue-400': $route.path === child.path,
                      'border-transparent': $route.path !== child.path
                    }"
                  >
                    <component :is="child.icon" class="h-5 w-5 mr-3" v-if="child.icon" />
                    <span class="truncate">{{ child.title }}</span>
                  </router-link>
                </div>
              </transition>
            </div>
            <router-link
              v-else
              :to="item.path"
              class="sidebar-item text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-lg px-3 py-2 flex items-center"
              :class="{ 'bg-gray-800 text-blue-400': $route.path === item.path }"
              v-show="!item.permission || userStore.hasPermission(item.permission)"
            >
              <component :is="item.icon" class="h-5 w-5 mr-3" />
              <span class="truncate">{{ item.title }}</span>
            </router-link>
          </template>
        </div>
      </nav>
    </aside>

    <!-- 主内容区域 -->
    <div class="flex-1 min-h-screen ml-64 flex flex-col bg-gray-900">
      <!-- 顶部导航栏 -->
      <header class="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 shadow-sm flex items-center h-16 px-8">
        <h1 class="text-lg font-semibold text-gray-100 flex-1">{{ pageTitle }}</h1>
        <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect">
          <div class="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-800">
            <n-avatar
              :src="userStore.user?.avatar"
              :fallback-src="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userStore.user?.username"
              size="small"
            />
            <span class="text-sm font-medium text-gray-200">{{ userStore.user?.username }}</span>
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </n-dropdown>
      </header>
      <!-- 页面内容 -->
      <main class="flex-1 w-full p-8 bg-gray-900 text-gray-100 overflow-x-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NDropdown, NAvatar } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import type { MenuItem } from '@/types'

// 图标组件
const DashboardIcon = () => h('svg', { class: 'h-5 w-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' }),
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z' })
])

const UsersIcon = () => h('svg', { class: 'h-5 w-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' })
])

const RolesIcon = () => h('svg', { class: 'h-5 w-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })
])

const PermissionsIcon = () => h('svg', { class: 'h-5 w-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' })
])

const SettingsIcon = () => h('svg', { class: 'h-5 w-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
  h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
])

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const openMenus = ref<string[]>([])

function isMenuOpen(item: MenuItem) {
  return openMenus.value.includes(item.path)
}
function toggleMenu(item: MenuItem) {
  const idx = openMenus.value.indexOf(item.path)
  if (idx > -1) {
    openMenus.value.splice(idx, 1)
  } else {
    openMenus.value.splice(0, openMenus.value.length, item.path)
  }
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    title: '仪表板',
    icon: DashboardIcon,
    path: '/dashboard'
  },
  {
    id: 2,
    title: '用户管理',
    icon: UsersIcon,
    path: '/users',
    children: [
      {
        id: 21,
        title: '用户列表',
        icon: '',
        path: '/users/list'
      },
      {
        id: 22,
        title: '用户日志',
        icon: '',
        path: '/users/logs'
      }
    ]
  },
  {
    id: 3,
    title: '角色管理',
    icon: RolesIcon,
    path: '/roles',
    permission: 'role:read'
  },
  {
    id: 4,
    title: '权限管理',
    icon: PermissionsIcon,
    path: '/permissions',
    permission: 'permission:read'
  },
  {
    id: 5,
    title: '系统设置',
    icon: SettingsIcon,
    path: '/settings'
  },
]

const pageTitle = computed(() => {
  // 优先读取当前路由 meta.title
  if (route.meta && route.meta.title) {
    return route.meta.title as string
  }
  // 再查菜单项
  const currentItem = menuItems.find(item => item.path === route.path)
  return currentItem?.title || '页面'
})

const userMenuOptions = [
  {
    label: '个人资料',
    key: 'profile',
    icon: () => h('svg', { class: 'h-4 w-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
    ])
  },
  {
    label: '设置',
    key: 'settings',
    icon: () => h('svg', { class: 'h-4 w-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' })
    ])
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h('svg', { class: 'h-4 w-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' })
    ])
  }
]

const handleUserMenuSelect = (key: string) => {
  switch (key) {
    case 'logout':
      userStore.logout()
      router.push('/login')
      break
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
  }
}

watch(
  () => route.path,
  (newPath) => {
    const parent = menuItems.find(item =>
      item.children && item.children.some(child => child.path === newPath)
    )
    if (parent) {
      openMenus.value = [parent.path]
    } else {
      openMenus.value = []
    }
  },
  { immediate: true }
)
</script>
