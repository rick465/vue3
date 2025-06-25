<template>
  <div class="flex flex-col gap-6 w-full min-w-0">
    <!-- 页面标题和操作按钮 -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
      <div>
        <p class="mt-1 text-sm text-gray-400">管理系统中的所有用户</p>
      </div>
      <n-button type="primary" @click="showCreateModal = true" class="w-full md:w-auto">
        <template #icon>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </template>
        添加用户
      </n-button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card bg-gray-800 text-gray-100 w-full">
      <div class="flex flex-col sm:flex-row gap-4 w-full">
        <n-input
          v-model:value="searchKeyword"
          placeholder="搜索用户名或邮箱"
          class="flex-1 w-full"
          clearable
        >
          <template #prefix>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </template>
        </n-input>

        <n-select
          v-model:value="roleFilter"
          :options="roleOptions"
          placeholder="选择角色"
          clearable
          class="w-full sm:w-48"
        />

        <n-button @click="loadUsers" class="w-full sm:w-auto">
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </template>
          刷新
        </n-button>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="card bg-gray-800 text-gray-100 w-full">
      <n-data-table
        :columns="columns"
        :data="users"
        :loading="loading"
        :pagination="false"
        :bordered="false"
        striped
        class="w-full"
      />

      <!-- 分页组件 -->
      <BasePagination
        :pagination="pagination"
        v-model="currentPage"
        :page-size="pageSize"
        @change="handlePageChange"
        @update:page-size="handlePageSizeChange"
        class="w-full"
      />
    </div>
  </div>

  <!-- 创建用户模态框 -->
  <n-modal v-model:show="showCreateModal" preset="card" title="创建用户" style="width: 600px">
    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="用户名" path="username">
        <n-input v-model:value="form.username" placeholder="请输入用户名" />
      </n-form-item>

      <n-form-item label="邮箱" path="email">
        <n-input v-model:value="form.email" placeholder="请输入邮箱" />
      </n-form-item>

      <n-form-item label="密码" path="password">
        <n-input
          v-model:value="form.password"
          type="password"
          placeholder="请输入密码"
          show-password-on="click"
        />
      </n-form-item>

      <n-form-item label="角色" path="role">
        <n-select
          v-model:value="form.role"
          :options="roleOptions"
          placeholder="请选择角色"
        />
      </n-form-item>
    </n-form>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <n-button @click="showCreateModal = false">取消</n-button>
        <n-button type="primary" :loading="submitting" @click="handleCreateUser">
          创建
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import { useMessage } from 'naive-ui'
import { NButton, NTag, NAvatar, NSpace, NPopconfirm } from 'naive-ui'
import BasePagination from '@/components/common/BasePagination.vue'
import { getUsers } from '@/api'
import type { User, Pagination } from '@/types'

const message = useMessage()

const loading = ref(false)
const submitting = ref(false)
const showCreateModal = ref(false)
const searchKeyword = ref('')
const roleFilter = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)

const users = ref<User[]>([])
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

const form = reactive({
  username: '',
  email: '',
  password: '',
  role: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const roleOptions = [
  { label: '超级管理员', value: 'SUPER_ADMIN' },
  { label: '管理员', value: 'ADMIN' },
  { label: '普通用户', value: 'USER' }
]

const columns = [
  {
    title: '用户',
    key: 'user',
    render: (row: User) => {
      return h(NSpace, { align: 'center' }, {
        default: () => [
          h(NAvatar, {
            src: row.avatar,
            fallbackSrc: `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.username}`,
            size: 'small'
          }),
          h('div', [
            h('div', { class: 'font-medium' }, row.username),
            h('div', { class: 'text-sm text-gray-500' }, row.email)
          ])
        ]
      })
    }
  },
  {
    title: '角色',
    key: 'role',
    render: (row: User) => {
      const color = row.role === '超级管理员' ? 'red' : row.role === '管理员' ? 'blue' : 'green'
      return h(NTag, { type: color as 'success' | 'error' | 'warning' | 'info' }, { default: () => row.role })
    }
  },
  {
    title: '创建时间',
    key: 'createdAt',
    render: (row: User) => new Date(row.createdAt).toLocaleDateString()
  },
  {
    title: '最后登录',
    key: 'lastLoginAt',
    render: (row: User) => new Date(row.lastLoginAt).toLocaleDateString()
  },
  {
    title: '操作',
    key: 'actions',
    render: (row: User) => {
      return h(NSpace, { size: 'small' }, {
        default: () => [
          h(NButton, {
            size: 'small',
            onClick: () => handleEditUser(row)
          }, { default: () => '编辑' }),
          h(NPopconfirm, {
            onPositiveClick: () => handleDeleteUser(row.id)
          }, {
            trigger: () => h(NButton, {
              size: 'small',
              type: 'error'
            }, { default: () => '删除' }),
            default: () => '确定要删除这个用户吗？'
          })
        ]
      })
    }
  }
]

const loadUsers = async () => {
  loading.value = true
  try {
    const response = await getUsers(currentPage.value, pageSize.value)
    users.value = response.data.data
    pagination.value = response.data.pagination
  } catch {
    message.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  loadUsers()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadUsers()
}

const handleCreateUser = async () => {
  submitting.value = true
  try {
    // 这里应该调用创建用户的 API
    message.success('用户创建成功')
    showCreateModal.value = false
    loadUsers()
  } catch {
    message.error('创建用户失败')
  } finally {
    submitting.value = false
  }
}

const handleEditUser = (user: User) => {
  message.info(`编辑用户: ${user.username}`)
}

const handleDeleteUser = (userId: number) => {
  message.success(`删除用户 ID: ${userId}`)
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>
