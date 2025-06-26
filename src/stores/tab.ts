import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TabItem {
  title: string
  path: string
  name: string
  fullPath?: string
}

export const useTabStore = defineStore('tab', () => {
  const tabs = ref<TabItem[]>([
    { title: '儀表板', path: '/dashboard', name: 'dashboard' }
  ])

  // 新增 Tab
  function addTab(tab: TabItem) {
    if (!tabs.value.find(t => t.path === tab.path)) {
      tabs.value.push(tab)
    }
  }

  // 關閉 Tab
  function removeTab(path: string) {
    const idx = tabs.value.findIndex(t => t.path === path)
    if (idx !== -1) tabs.value.splice(idx, 1)
  }

  return { tabs, addTab, removeTab }
})
