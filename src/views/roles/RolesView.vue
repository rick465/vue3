<template>
  <div class="flex flex-col gap-6 w-full min-w-0">
    <!-- 页面标题和操作按钮 -->
    <div class="flex items-center justify-between">
      <div>
        <p class="mt-1 text-sm text-gray-500">管理系统中的所有角色</p>
      </div>
      <n-button type="primary" @click="showCreateModal = true">
        <template #icon>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </template>
        创建角色
      </n-button>
    </div>

    <!-- 角色列表 -->
    <div class="card bg-gray-800 text-gray-100 w-full">
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import { useMessage } from 'naive-ui'
import { NButton, NTag, NSpace, NPopconfirm, NCheckboxGroup, NCheckbox } from 'naive-ui'
import BasePagination from '@/components/common/BasePagination.vue'
import { getRoles, createRole } from '@/api'
import type { Role, Pagination } from '@/types'

const message = useMessage()

const loading = ref(false)
const submitting = ref(false)
const showCreateModal = ref(false)
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
  permissions: [] as string[]
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
          }, { default: () => '编辑' }),
          h(NButton, {
            size: 'small',
            onClick: () => handleViewPermissions(row)
          }, { default: () => '权限' }),
          h(NPopconfirm, {
            onPositiveClick: () => handleDeleteRole(row.id)
          }, {
            trigger: () => h(NButton, {
              size: 'small',
              type: 'error'
            }, { default: () => '删除' }),
            default: () => '确定要删除这个角色吗？'
          })
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
      permissions: form.permissions
    })
    message.success('角色创建成功')
    showCreateModal.value = false
    // 重置表单
    form.name = ''
    form.code = ''
    form.description = ''
    form.permissions = []
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
  message.info(`编辑角色: ${role.name}`)
}

const handleViewPermissions = (role: Role) => {
  message.info(`查看角色权限: ${role.name}`)
}

const handleDeleteRole = (roleId: number) => {
  message.success(`删除角色 ID: ${roleId}`)
  loadRoles()
}

onMounted(() => {
  loadRoles()
})
</script>
