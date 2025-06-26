<template>
  <div class="flex flex-col gap-6 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- 页面标题和操作按钮 -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
      <div>
        <p class="mt-1 text-sm text-gray-400">管理所有角色及其權限</p>
      </div>
      <n-button type="primary" @click="showCreateModal = true" class="w-full md:w-auto">
        <template #icon>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </template>
        新增角色
      </n-button>
    </div>

    <!-- 角色列表 -->
    <div class="card bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full">
      <n-data-table
        :columns="columns"
        :data="roles"
        :loading="loading"
        :pagination="false"
        :bordered="false"
        striped
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

  <!-- 创建角色模态框 -->
  <n-modal v-model:show="showCreateModal" preset="card" title="创建角色" style="width: 600px">
    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="角色名称" path="name">
        <n-input v-model:value="form.name" placeholder="请输入角色名称" />
      </n-form-item>

      <n-form-item label="角色代码" path="code">
        <n-input v-model:value="form.code" placeholder="请输入角色代码" />
      </n-form-item>

      <n-form-item label="描述" path="description">
        <n-input
          v-model:value="form.description"
          type="textarea"
          placeholder="请输入角色描述"
          :rows="3"
        />
      </n-form-item>

      <n-form-item label="权限" path="permissions">
        <n-checkbox-group v-model:value="form.permissions">
          <div class="grid grid-cols-2 gap-2">
            <n-checkbox value="user:read">用户查看</n-checkbox>
            <n-checkbox value="user:write">用户编辑</n-checkbox>
            <n-checkbox value="role:read">角色查看</n-checkbox>
            <n-checkbox value="role:write">角色编辑</n-checkbox>
            <n-checkbox value="permission:read">权限查看</n-checkbox>
            <n-checkbox value="permission:write">权限编辑</n-checkbox>
          </div>
        </n-checkbox-group>
      </n-form-item>

      <n-form-item label="密碼" path="password">
        <n-input v-model:value="form.password" type="password" placeholder="請輸入密碼" />
      </n-form-item>
    </n-form>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <n-button @click="showCreateModal = false">取消</n-button>
        <n-button type="primary" :loading="submitting" @click="handleCreateRole">
          创建
        </n-button>
      </div>
    </template>
  </n-modal>

  <!-- 编辑角色模态框 -->
  <n-modal v-model:show="showEditModal" preset="card" title="編輯角色" style="width: 600px">
    <n-form :model="editForm" :rules="rules" label-placement="left" label-width="auto" require-mark-placement="right-hanging">
      <n-form-item label="角色名稱" path="name">
        <n-input v-model:value="editForm.name" placeholder="請輸入角色名稱" />
      </n-form-item>
      <n-form-item label="角色代碼" path="code">
        <n-input v-model:value="editForm.code" placeholder="請輸入角色代碼" />
      </n-form-item>
      <n-form-item label="描述" path="description">
        <n-input v-model:value="editForm.description" type="textarea" placeholder="請輸入角色描述" :rows="3" />
      </n-form-item>
      <n-form-item label="權限" path="permissions">
        <n-checkbox-group v-model:value="editForm.permissions">
          <div class="grid grid-cols-2 gap-2">
            <n-checkbox value="user:read">用戶查看</n-checkbox>
            <n-checkbox value="user:write">用戶編輯</n-checkbox>
            <n-checkbox value="role:read">角色查看</n-checkbox>
            <n-checkbox value="role:write">角色編輯</n-checkbox>
            <n-checkbox value="permission:read">權限查看</n-checkbox>
            <n-checkbox value="permission:write">權限編輯</n-checkbox>
          </div>
        </n-checkbox-group>
      </n-form-item>
      <n-form-item label="密碼" path="password">
        <n-input v-model:value="editForm.password" type="password" placeholder="如需修改請輸入新密碼" />
      </n-form-item>
    </n-form>
    <template #footer>
      <div class="flex justify-end space-x-2">
        <n-button @click="showEditModal = false">取消</n-button>
        <n-button type="primary" @click="handleUpdateRole">儲存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import { useMessage } from 'naive-ui'
import { NButton, NTag, NSpace, NCheckboxGroup, NCheckbox } from 'naive-ui'
import BasePagination from '@/components/common/BasePagination.vue'
import { getRoles, createRole } from '@/api'
import type { Role, Pagination } from '@/types'

const message = useMessage()

const loading = ref(false)
const submitting = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

const roles = ref<Role[]>([])
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

const form = reactive({
  name: '',
  code: '',
  description: '',
  permissions: [] as string[],
  password: ''
})

const editForm = reactive({
  id: null as number | null,
  name: '',
  code: '',
  description: '',
  permissions: [] as string[],
  password: ''
})

const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色代码', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密碼', trigger: 'blur' },
    { min: 6, message: '密碼長度不能少於6位', trigger: 'blur' }
  ]
}

const columns = [
  {
    title: '角色名称',
    key: 'name',
    render: (row: Role) => h('div', [
      h('div', { class: 'font-medium' }, row.name),
      h('div', { class: 'text-sm text-gray-500' }, row.code)
    ])
  },
  {
    title: '描述',
    key: 'description'
  },
  {
    title: '用户数量',
    key: 'userCount',
    render: (row: Role) => h(NTag, { type: 'info' }, { default: () => row.userCount })
  },
  {
    title: '操作',
    key: 'actions',
    render: (row: Role) => {
      return h(NSpace, { size: 'small' }, {
        default: () => [
          h(NButton, {
            size: 'small',
            onClick: () => handleEditRole(row)
          }, { default: () => '編輯' })
        ]
      })
    }
  }
]

const formRef = ref()

const loadRoles = async () => {
  loading.value = true
  try {
    const response = await getRoles(currentPage.value, pageSize.value)
    roles.value = response.data.data
    pagination.value = response.data.pagination
  } catch {
    message.error('加载角色列表失败')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  loadRoles()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadRoles()
}

const handleCreateRole = async () => {
  submitting.value = true
  try {
    // 校验表单
    await formRef.value?.validate()
    // 调用新增角色API
    await createRole({
      name: form.name,
      code: form.code,
      description: form.description,
      permissions: form.permissions,
      password: form.password
    })
    message.success('角色创建成功')
    showCreateModal.value = false
    // 重置表单
    form.name = ''
    form.code = ''
    form.description = ''
    form.permissions = []
    form.password = ''
    loadRoles()
  } catch (err) {
    if (err?.message) message.error(err.message)
    else if (typeof err === 'string') message.error(err)
    else if (err && err[0] && err[0].message) message.error(err[0].message)
    else message.error('创建角色失败')
  } finally {
    submitting.value = false
  }
}

const handleEditRole = (role: Role) => {
  editForm.id = role.id
  editForm.name = role.name
  editForm.code = role.code
  editForm.description = role.description
  editForm.permissions = Array.isArray(role.permissions) ? [...role.permissions] : []
  editForm.password = ''
  showEditModal.value = true
}

const handleUpdateRole = async () => {
  // mock 更新角色到 localStorage
  const roles: Role[] = JSON.parse(localStorage.getItem('mockRoles') || 'null') || []
  const idx = roles.findIndex(r => r.id === editForm.id)
  if (idx !== -1) {
    roles[idx] = {
      ...roles[idx],
      name: editForm.name,
      code: editForm.code,
      description: editForm.description,
      permissions: [...editForm.permissions]
    }
    localStorage.setItem('mockRoles', JSON.stringify(roles))
  }
  // mock 更新 user 密碼與權限
  if (editForm.id) {
    const users = JSON.parse(localStorage.getItem('mockUsers') || 'null') || []
    const user = users.find((u) => u.role === roles[idx].name)
    if (user) {
      user.role = editForm.name
      user.permissions = [...editForm.permissions]
      if (editForm.password && editForm.password.length >= 6) {
        user.password = editForm.password
      }
      localStorage.setItem('mockUsers', JSON.stringify(users))
    }
  }
  showEditModal.value = false
  loadRoles()
}

onMounted(() => {
  loadRoles()
})
</script>
