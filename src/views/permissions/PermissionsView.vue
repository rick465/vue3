<template>
  <div class="flex flex-col gap-6 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- 页面标题和操作按钮 -->
    <div class="flex items-center justify-between">
      <div>
        <p class="mt-1 text-sm text-gray-500">管理系统中的所有权限</p>
      </div>
      <n-button type="primary" @click="showCreateModal = true">
        <template #icon>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </template>
        创建权限
      </n-button>
    </div>

    <!-- 权限列表 -->
    <div class="card bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full">
      <n-data-table
        :columns="columns"
        :data="permissions"
        :loading="loading"
        :pagination="false"
        :bordered="false"
        striped
      />
    </div>
  </div>

  <!-- 创建权限模态框 -->
  <n-modal v-model:show="showCreateModal" preset="card" title="创建权限" style="width: 600px">
    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="权限名称" path="name">
        <n-input v-model:value="form.name" placeholder="请输入权限名称" />
      </n-form-item>

      <n-form-item label="权限代码" path="code">
        <n-input v-model:value="form.code" placeholder="请输入权限代码" />
      </n-form-item>

      <n-form-item label="描述" path="description">
        <n-input
          v-model:value="form.description"
          type="textarea"
          placeholder="请输入权限描述"
          :rows="3"
        />
      </n-form-item>

      <n-form-item label="模块" path="module">
        <n-select
          v-model:value="form.module"
          :options="moduleOptions"
          placeholder="请选择模块"
        />
      </n-form-item>
    </n-form>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <n-button @click="showCreateModal = false">取消</n-button>
        <n-button type="primary" :loading="submitting" @click="handleCreatePermission">
          创建
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import { useMessage } from 'naive-ui'
import { NButton, NTag, NSpace, NPopconfirm } from 'naive-ui'
import { getPermissions } from '@/api'
import type { Permission } from '@/types'

const message = useMessage()

const loading = ref(false)
const submitting = ref(false)
const showCreateModal = ref(false)

const permissions = ref<Permission[]>([])

const form = reactive({
  name: '',
  code: '',
  description: '',
  module: ''
})

const rules = {
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入权限代码', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入权限描述', trigger: 'blur' }
  ],
  module: [
    { required: true, message: '请选择模块', trigger: 'change' }
  ]
}

const moduleOptions = [
  { label: '用户管理', value: '用户管理' },
  { label: '角色管理', value: '角色管理' },
  { label: '权限管理', value: '权限管理' },
  { label: '系统设置', value: '系统设置' }
]

const columns = [
  {
    title: '权限名称',
    key: 'name',
    render: (row: Permission) => h('div', [
      h('div', { class: 'font-medium' }, row.name),
      h('div', { class: 'text-sm text-gray-500' }, row.code)
    ])
  },
  {
    title: '描述',
    key: 'description'
  },
  {
    title: '模块',
    key: 'module',
    render: (row: Permission) => h(NTag, { type: 'info' }, { default: () => row.module })
  },
  {
    title: '操作',
    key: 'actions',
    render: (row: Permission) => {
      return h(NSpace, { size: 'small' }, {
        default: () => [
          h(NButton, {
            size: 'small',
            onClick: () => handleEditPermission(row)
          }, { default: () => '编辑' }),
          h(NPopconfirm, {
            onPositiveClick: () => handleDeletePermission(row.id)
          }, {
            trigger: () => h(NButton, {
              size: 'small',
              type: 'error'
            }, { default: () => '删除' }),
            default: () => '确定要删除这个权限吗？'
          })
        ]
      })
    }
  }
]

const loadPermissions = async () => {
  loading.value = true
  try {
    const response = await getPermissions()
    permissions.value = response.data
  } catch {
    message.error('加载权限列表失败')
  } finally {
    loading.value = false
  }
}

const handleCreatePermission = async () => {
  submitting.value = true
  try {
    // 这里应该调用创建权限的 API
    message.success('权限创建成功')
    showCreateModal.value = false
    loadPermissions()
  } catch {
    message.error('创建权限失败')
  } finally {
    submitting.value = false
  }
}

const handleEditPermission = (permission: Permission) => {
  message.info(`编辑权限: ${permission.name}`)
}

const handleDeletePermission = (permissionId: number) => {
  message.success(`删除权限 ID: ${permissionId}`)
  loadPermissions()
}

onMounted(() => {
  loadPermissions()
})
</script>
