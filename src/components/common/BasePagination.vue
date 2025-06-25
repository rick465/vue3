<template>
  <div class="pagination-dark flex items-center justify-between px-4 py-3 bg-gray-900 border-t border-gray-800 sm:px-6">
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center">
        <p class="text-sm text-gray-300">
          显示第
          <span class="font-medium text-blue-400">{{ startItem }}</span>
          到
          <span class="font-medium text-blue-400">{{ endItem }}</span>
          条，共
          <span class="font-medium text-blue-400">{{ pagination.total }}</span>
          条记录
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <n-select
          v-model:value="currentPageSize"
          :options="pageSizeOptions"
          size="small"
          @update:value="handlePageSizeChange"
          class="pagination-dark-select"
        />

        <n-pagination
          v-model:page="currentPage"
          :page-count="pagination.totalPages"
          :page-sizes="[10, 20, 50, 100]"
          show-size-picker
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
          class="pagination-dark-pagination"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { NSelect, NPagination } from 'naive-ui'
import type { Pagination } from '@/types'

interface Props {
  pagination: Pagination
  modelValue: number
  pageSize: number
}

interface Emits {
  (e: 'update:modelValue', page: number): void
  (e: 'update:pageSize', pageSize: number): void
  (e: 'change', page: number, pageSize: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentPage = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const currentPageSize = computed({
  get: () => props.pageSize,
  set: (value) => emit('update:pageSize', value)
})

const pageSizeOptions = [
  { label: '10 条/页', value: 10 },
  { label: '20 条/页', value: 20 },
  { label: '50 条/页', value: 50 },
  { label: '100 条/页', value: 100 }
]

const startItem = computed(() => {
  return props.pagination.total === 0 ? 0 : (props.pagination.page - 1) * props.pagination.pageSize + 1
})

const endItem = computed(() => {
  return Math.min(props.pagination.page * props.pagination.pageSize, props.pagination.total)
})

const handlePageChange = (page: number) => {
  emit('change', page, props.pageSize)
}

const handlePageSizeChange = (size: number) => {
  emit('update:pageSize', size)
  emit('change', 1, size) // 切换页面大小时重置到第一页
}

// 监听分页变化
watch(() => props.pagination, (newPagination) => {
  if (newPagination.page > newPagination.totalPages && newPagination.totalPages > 0) {
    emit('change', newPagination.totalPages, props.pageSize)
  }
}, { deep: true })
</script>

<style scoped>
.pagination-dark {
  background: #181f2a;
  border-top: 1px solid #232b3a;
}
.pagination-dark-select :deep(.n-base-selection) {
  background: #232b3a;
  color: #cbd5e1;
  border-color: #334155;
}
.pagination-dark-pagination :deep(.n-pagination-item),
.pagination-dark-pagination :deep(.n-pagination-item--active) {
  background: #232b3a;
  color: #cbd5e1;
  border-color: #334155;
}
.pagination-dark-pagination :deep(.n-pagination-item--active) {
  color: #38bdf8;
  border-color: #38bdf8;
  background: #181f2a;
}
.pagination-dark-pagination :deep(.n-pagination-item:hover) {
  color: #38bdf8;
  border-color: #38bdf8;
  background: #232b3a;
}
.pagination-dark-pagination :deep(.n-pagination-prefix),
.pagination-dark-pagination :deep(.n-pagination-suffix) {
  color: #94a3b8;
}
</style>
