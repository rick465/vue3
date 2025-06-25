<template>
  <div class="flex flex-col gap-6 w-full">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      <div class="card bg-gray-800 text-gray-100 w-full">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-400 truncate">总用户数</dt>
              <dd class="text-lg font-medium text-gray-100">{{ stats.totalUsers.toLocaleString() }}</dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="card bg-gray-800 text-gray-100 w-full">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-400 truncate">总订单数</dt>
              <dd class="text-lg font-medium text-gray-100">{{ stats.totalOrders.toLocaleString() }}</dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="card bg-gray-800 text-gray-100 w-full">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-400 truncate">总收入</dt>
              <dd class="text-lg font-medium text-gray-100">¥{{ (stats.totalRevenue / 10000).toFixed(1) }}万</dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="card bg-gray-800 text-gray-100 w-full">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-400 truncate">增长率</dt>
              <dd class="text-lg font-medium text-gray-100">{{ stats.growthRate }}%</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <!-- 图表和活动 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div class="card bg-gray-800 text-gray-100 w-full">
        <h3 class="text-lg font-medium text-gray-100 mb-4">用户增长趋势</h3>
        <div class="h-64">
          <LineChart v-if="chartData" :chart-data="chartData" :options="chartOptions" />
        </div>
      </div>
      <div class="card bg-gray-800 text-gray-100 w-full">
        <h3 class="text-lg font-medium text-gray-100 mb-4">最近活动</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-100">{{ activity.title }}</p>
              <p class="text-sm text-gray-400">{{ activity.description }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 快速操作 -->
    <div class="card bg-gray-800 text-gray-100 w-full">
      <h3 class="text-lg font-medium text-gray-100 mb-4">快速操作</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <button
          v-for="action in quickActions"
          :key="action.name"
          @click="action.handler"
          class="flex flex-col items-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors w-full"
        >
          <div class="w-8 h-8 mb-2 text-blue-400">
            <component :is="action.icon" />
          </div>
          <span class="text-sm font-medium text-gray-100">{{ action.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import LineChart from '@/components/charts/LineChart.vue'
import { getDashboardStats, getChartData } from '@/api'
import type { DashboardStats, ChartData } from '@/types'

const router = useRouter()
const message = useMessage()

const stats = ref<DashboardStats>({
  totalUsers: 0,
  totalOrders: 0,
  totalRevenue: 0,
  growthRate: 0
})

const chartData = ref<ChartData | null>(null)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const recentActivities = ref([
  {
    id: 1,
    title: '新用户注册',
    description: '用户 admin 注册了账户',
    time: '2 分钟前'
  },
  {
    id: 2,
    title: '订单创建',
    description: '创建了新的订单 #12345',
    time: '5 分钟前'
  },
  {
    id: 3,
    title: '系统更新',
    description: '系统已更新到最新版本',
    time: '1 小时前'
  },
  {
    id: 4,
    title: '权限变更',
    description: '用户权限已更新',
    time: '2 小时前'
  }
])

const quickActions = [
  {
    name: '添加用户',
    icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M12 6v6m0 0v6m0-6h6m-6 0H6' })
    ]),
    handler: () => router.push('/users')
  },
  {
    name: '创建角色',
    icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })
    ]),
    handler: () => router.push('/roles')
  },
  {
    name: '系统设置',
    icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' })
    ]),
    handler: () => router.push('/settings')
  },
  {
    name: '查看报告',
    icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
    ]),
    handler: () => message.info('报告功能开发中...')
  }
]

const loadData = async () => {
  try {
    const [statsResponse, chartResponse] = await Promise.all([
      getDashboardStats(),
      getChartData()
    ])

    stats.value = statsResponse.data
    chartData.value = chartResponse.data
  } catch {
    message.error('加载数据失败')
  }
}

onMounted(() => {
  loadData()
})
</script>
