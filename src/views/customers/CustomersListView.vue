<template>
  <div class="flex flex-col gap-6 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <BaseCard>
      <!-- 標題插槽 -->
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">客戶列表</h2>
          <div class="flex items-center gap-4">
            <!-- 使用計數器 composable -->
            <div class="text-sm text-gray-600 dark:text-gray-400">
              操作次數: {{ counter.count }}
              <button @click="counter.increment" class="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs">
                +1
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- 搜索和篩選區域 -->
      <div class="mb-4 flex gap-4">
        <SearchInput
          v-model="searchKeyword"
          placeholder="搜索客戶名稱或郵箱"
          @search="handleSearch"
          @clear="handleClear"
        />
        <select v-model="selectedStatus" class="px-3 py-2 border rounded">
          <option value="">全部狀態</option>
          <option value="active">活躍</option>
          <option value="inactive">非活躍</option>
        </select>
        <button @click="resetFilters" class="px-4 py-2 bg-gray-500 text-white rounded">
          重置篩選
        </button>
      </div>

      <!-- 統計信息 -->
      <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900 rounded">
        <p>總客戶數：{{ totalCustomers }}</p>
        <p>當前頁：{{ currentPage }} / {{ pagination.totalPages }}</p>
        <p>搜索結果：{{ filteredCustomers.length }} 個</p>
        <!-- 使用 localStorage composable -->
        <p>上次訪問：{{ lastVisitTime }}</p>
      </div>

      <!-- 錯誤狀態 -->
      <div v-if="apiError" class="mb-4 p-4 bg-red-50 dark:bg-red-900 rounded text-red-700 dark:text-red-300">
        <p>錯誤：{{ apiError }}</p>
        <button @click="retryLoad" class="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm">
          重試
        </button>
      </div>

      <!-- 加載狀態 -->
      <div v-if="loading" class="text-center py-8">
        <p>載入中...</p>
      </div>

      <!-- 數據表格 -->
      <div v-else-if="filteredCustomers.length > 0">
        <n-data-table
          :columns="columns"
          :data="filteredCustomers"
          :pagination="false"
          :bordered="false"
          striped
        />
      </div>

      <!-- 空狀態 -->
      <div v-else class="text-center py-8">
        <p>沒有找到客戶數據</p>
      </div>

      <!-- 底部插槽 -->
      <template #footer>
        <div class="flex justify-between items-center">
          <span>共 {{ filteredCustomers.length }} 個客戶</span>
          <button @click="showAddModal = true" class="px-4 py-2 bg-blue-500 text-white rounded">
            新增客戶
          </button>
        </div>
      </template>
    </BaseCard>

    <!-- 分頁組件 -->
    <BasePagination
      v-if="!loading && filteredCustomers.length > 0"
      :pagination="pagination"
      v-model="currentPage"
      :page-size="pageSize"
      @change="handlePageChange"
      @update:page-size="handlePageSizeChange"
      class="w-full"
    />

    <!-- 新增客戶模態框 -->
    <n-modal v-model:show="showAddModal" preset="card" title="新增客戶" style="width: 500px">
      <n-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="left"
        label-width="auto"
      >
        <n-form-item label="用戶名" path="username">
          <n-input v-model:value="form.username" placeholder="請輸入用戶名" />
        </n-form-item>
        <n-form-item label="郵箱" path="email">
          <n-input v-model:value="form.email" placeholder="請輸入郵箱" />
        </n-form-item>
        <n-form-item label="狀態" path="status">
          <n-select v-model:value="form.status" :options="statusOptions" />
        </n-form-item>
      </n-form>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <n-button @click="showAddModal = false">取消</n-button>
          <n-button type="primary" @click="handleAddCustomer">確定</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { NDataTable, NModal, NForm, NFormItem, NInput, NSelect, NButton } from 'naive-ui'
import BasePagination from '@/components/common/BasePagination.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import { useCustomers } from '@/composables/useCustomers'
import { useCounter } from '@/composables/useCounter'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useApi } from '@/composables/useApi'

// 使用多個 composables
const {
  loading,
  currentPage,
  pageSize,
  searchKeyword,
  selectedStatus,
  pagination,
  filteredCustomers,
  totalCustomers,
  loadCustomers,
  handlePageChange,
  handlePageSizeChange,
  handleSearch,
  handleClear,
  resetFilters,
  addCustomer
} = useCustomers({ initialPageSize: 10 })

// 使用計數器 composable
const counter = useCounter(0)

// 使用 localStorage composable
const { value: lastVisitTime } = useLocalStorage('lastVisitTime', new Date().toLocaleString())

// 使用 API composable 來處理錯誤
const { error: apiError } = useApi({
  onError: (error) => {
    console.error('API Error:', error)
  }
})

// 模態框狀態
const showAddModal = ref(false)

// 表單數據
const form = reactive({
  username: '',
  email: '',
  status: 'active' as 'active' | 'inactive'
})

const statusOptions = [
  { label: '活躍', value: 'active' },
  { label: '非活躍', value: 'inactive' }
]

const rules = {
  username: [
    { required: true, message: '請輸入用戶名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '請輸入郵箱', trigger: 'blur' },
    { type: 'email', message: '請輸入正確的郵箱格式', trigger: 'blur' }
  ]
}

const columns = [
  { title: 'ID', key: 'id' },
  { title: '用戶名', key: 'username' },
  { title: '郵箱', key: 'email' },
  { title: '註冊時間', key: 'createdAt' },
  {
    title: '狀態',
    key: 'status',
    render: (row: { status: 'active' | 'inactive' }) => {
      return row.status === 'active' ? '活躍' : '非活躍'
    }
  }
]

// 新增客戶
const handleAddCustomer = () => {
  addCustomer({
    username: form.username,
    email: form.email,
    status: form.status,
    createdAt: new Date().toISOString().slice(0, 10)
  })

  // 重置表單
  form.username = ''
  form.email = ''
  form.status = 'active'

  // 關閉模態框
  showAddModal.value = false

  // 增加操作計數
  counter.increment()
}

// 重試加載
const retryLoad = () => {
  loadCustomers()
}

onMounted(() => {
  // 更新最後訪問時間
  lastVisitTime.value = new Date().toLocaleString()

  // 加載客戶數據
  loadCustomers()
})
</script>
