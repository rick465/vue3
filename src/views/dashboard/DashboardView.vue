<template>
  <div class="flex flex-col gap-6 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <BaseCard>
      <template #header>
        <h2 class="text-2xl font-bold">儀表板</h2>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 統計卡片 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-blue-50 dark:bg-blue-900 rounded">
            <h3 class="font-semibold text-blue-800 dark:text-blue-200">總用戶</h3>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-300">{{ stats.totalUsers.toLocaleString() }}</p>
          </div>
          <div class="p-4 bg-green-50 dark:bg-green-900 rounded">
            <h3 class="font-semibold text-green-800 dark:text-green-200">活躍用戶</h3>
            <p class="text-2xl font-bold text-green-600 dark:text-green-300">{{ stats.activeUsers.toLocaleString() }}</p>
          </div>
          <div class="p-4 bg-yellow-50 dark:bg-yellow-900 rounded">
            <h3 class="font-semibold text-yellow-800 dark:text-yellow-200">訂單數</h3>
            <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-300">{{ stats.totalOrders.toLocaleString() }}</p>
          </div>
          <div class="p-4 bg-purple-50 dark:bg-purple-900 rounded">
            <h3 class="font-semibold text-purple-800 dark:text-purple-200">收入</h3>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-300">¥{{ (stats.totalRevenue / 10000).toFixed(1) }}万</p>
          </div>
        </div>

        <!-- 圖表區域 -->
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded">
          <h3 class="font-semibold mb-4">數據趨勢</h3>
          <LineChart v-if="chartData" :chart-data="chartData" :options="chartOptions" />
        </div>
      </div>
    </BaseCard>

    <!-- Composables vs Pinia 對比演示 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Composables 計數器 -->
      <BaseCard>
        <template #header>
          <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400">Composables 計數器</h3>
        </template>

        <div class="space-y-4">
          <div class="text-center">
            <p class="text-3xl font-bold">{{ composableCounter.count }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              狀態:
              <span v-if="composableCounter.isPositive" class="text-green-600">正數</span>
              <span v-else-if="composableCounter.isNegative" class="text-red-600">負數</span>
              <span v-else class="text-gray-600">零</span>
            </p>
          </div>

          <div class="flex flex-wrap gap-2 justify-center">
            <button @click="composableCounter.increment" class="px-3 py-1 bg-blue-500 text-white rounded">
              +1
            </button>
            <button @click="composableCounter.decrement" class="px-3 py-1 bg-red-500 text-white rounded">
              -1
            </button>
            <button @click="composableCounter.reset" class="px-3 py-1 bg-gray-500 text-white rounded">
              重置
            </button>
            <button @click="composableCounter.add(5)" class="px-3 py-1 bg-green-500 text-white rounded">
              +5
            </button>
          </div>

          <div class="text-xs text-gray-500 dark:text-gray-400">
            <p>特點：</p>
            <ul class="list-disc list-inside space-y-1">
              <li>組件級別狀態</li>
              <li>每次調用都是新實例</li>
              <li>適合邏輯重用</li>
              <li>輕量級</li>
            </ul>
          </div>
        </div>
      </BaseCard>

      <!-- Pinia 計數器 -->
      <BaseCard>
        <template #header>
          <h3 class="text-xl font-bold text-purple-600 dark:text-purple-400">Pinia 計數器</h3>
        </template>

        <div class="space-y-4">
          <div class="text-center">
            <p class="text-3xl font-bold">{{ piniaCounter.count }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              狀態:
              <span v-if="piniaCounter.isPositive" class="text-green-600">正數</span>
              <span v-else-if="piniaCounter.isNegative" class="text-red-600">負數</span>
              <span v-else class="text-gray-600">零</span>
            </p>
            <p class="text-xs text-gray-500">
              歷史記錄: {{ piniaCounter.history.length }} 條
            </p>
          </div>

          <div class="flex flex-wrap gap-2 justify-center">
            <button @click="piniaCounter.increment" class="px-3 py-1 bg-purple-500 text-white rounded">
              +1
            </button>
            <button @click="piniaCounter.decrement" class="px-3 py-1 bg-red-500 text-white rounded">
              -1
            </button>
            <button @click="piniaCounter.reset" class="px-3 py-1 bg-gray-500 text-white rounded">
              重置
            </button>
            <button @click="piniaCounter.add(5)" class="px-3 py-1 bg-green-500 text-white rounded">
              +5
            </button>
          </div>

          <div class="flex gap-2 justify-center">
            <button @click="piniaCounter.undo" class="px-3 py-1 bg-yellow-500 text-white rounded text-sm">
              撤銷
            </button>
            <button @click="piniaCounter.clearHistory" class="px-3 py-1 bg-orange-500 text-white rounded text-sm">
              清空歷史
            </button>
          </div>

          <div class="text-xs text-gray-500 dark:text-gray-400">
            <p>特點：</p>
            <ul class="list-disc list-inside space-y-1">
              <li>全局狀態管理</li>
              <li>單例模式</li>
              <li>支持開發工具</li>
              <li>內建持久化</li>
            </ul>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- 使用場景對比 -->
    <BaseCard>
      <template #header>
        <h3 class="text-xl font-bold">使用場景對比</h3>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-3">Composables 適用場景</h4>
          <ul class="space-y-2 text-sm">
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span>組件邏輯重用（表單驗證、API 調用）</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span>工具函數封裝（日期格式化、數據轉換）</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span>本地狀態管理（組件內部狀態）</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span>簡單的數據處理邏輯</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span>第三方庫的 Vue 適配</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-purple-600 dark:text-purple-400 mb-3">Pinia 適用場景</h4>
          <ul class="space-y-2 text-sm">
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span>全局狀態管理（用戶信息、主題設置）</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span>跨組件數據共享（購物車、購物清單）</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span>複雜的業務邏輯（訂單流程、權限管理）</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span>需要持久化的狀態（用戶偏好、設置）</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span>需要開發工具調試的狀態</span>
            </li>
          </ul>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LineChart from '@/components/charts/LineChart.vue'
import { getDashboardStats, getChartData } from '@/api'
import type { DashboardStats, ChartData } from '@/types'
import BaseCard from '@/components/common/BaseCard.vue'
import { useCounterWithComposable } from '@/composables/useCounterWithComposable'
import { useCounterStore } from '@/stores/counter'

const stats = ref<DashboardStats>({
  totalUsers: 0,
  totalOrders: 0,
  totalRevenue: 0,
  activeUsers: 0
})

const chartData = ref<ChartData | null>(null)
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const loadData = async () => {
  try {
    const [statsData, chartDataResponse] = await Promise.all([
      getDashboardStats(),
      getChartData()
    ])
    stats.value = statsData
    chartData.value = chartDataResponse
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

onMounted(() => {
  loadData()
})

// 使用 Composables
const composableCounter = useCounterWithComposable(0)

// 使用 Pinia
const piniaCounter = useCounterStore()
</script>
