<template>
    <div class="flex flex-col gap-6 w-full min-w-0">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">个人资料</h1>
        <p class="mt-1 text-sm text-gray-500">管理您的个人信息和账户设置</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <!-- 个人信息卡片 -->
        <div class="lg:col-span-2">
          <div class="card bg-gray-800 text-gray-100">
            <h3 class="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
            <n-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-placement="left"
              label-width="auto"
              require-mark-placement="right-hanging"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <n-form-item label="用户名" path="username">
                  <n-input v-model:value="form.username" disabled />
                </n-form-item>

                <n-form-item label="邮箱" path="email">
                  <n-input v-model:value="form.email" placeholder="请输入邮箱" />
                </n-form-item>

                <n-form-item label="真实姓名" path="realName">
                  <n-input v-model:value="form.realName" placeholder="请输入真实姓名" />
                </n-form-item>

                <n-form-item label="手机号码" path="phone">
                  <n-input v-model:value="form.phone" placeholder="请输入手机号码" />
                </n-form-item>
              </div>

              <n-form-item label="个人简介" path="bio">
                <n-input
                  v-model:value="form.bio"
                  type="textarea"
                  placeholder="请输入个人简介"
                  :rows="3"
                />
              </n-form-item>

              <div class="flex justify-end">
                <n-button type="primary" @click="saveProfile">
                  保存信息
                </n-button>
              </div>
            </n-form>
          </div>
        </div>

        <!-- 头像和统计信息 -->
        <div class="space-y-6">
          <div class="card bg-gray-800 text-gray-100 w-full">
            <div class="text-center">
              <n-avatar
                :src="userStore.user?.avatar"
                :fallback-src="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userStore.user?.username"
                size="large"
                class="mx-auto mb-4"
              />
              <h3 class="text-lg font-medium text-gray-900">{{ userStore.user?.username }}</h3>
              <p class="text-sm text-gray-500">{{ userStore.user?.role }}</p>
              <n-button class="mt-4" size="small">
                更换头像
              </n-button>
            </div>
          </div>

          <div class="card bg-gray-800 text-gray-100 w-full">
            <h3 class="text-lg font-medium text-gray-900 mb-4">账户信息</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">用户ID</span>
                <span class="text-sm font-medium">{{ userStore.user?.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">注册时间</span>
                <span class="text-sm font-medium">{{ formatDate(userStore.user?.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">最后登录</span>
                <span class="text-sm font-medium">{{ formatDate(userStore.user?.lastLoginAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 修改密码 -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">修改密码</h3>
        <n-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <n-form-item label="当前密码" path="currentPassword">
              <n-input
                v-model:value="passwordForm.currentPassword"
                type="password"
                placeholder="请输入当前密码"
                show-password-on="click"
              />
            </n-form-item>

            <n-form-item label="新密码" path="newPassword">
              <n-input
                v-model:value="passwordForm.newPassword"
                type="password"
                placeholder="请输入新密码"
                show-password-on="click"
              />
            </n-form-item>

            <n-form-item label="确认密码" path="confirmPassword">
              <n-input
                v-model:value="passwordForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                show-password-on="click"
              />
            </n-form-item>
          </div>

          <div class="flex justify-end">
            <n-button type="primary" @click="changePassword">
              修改密码
            </n-button>
          </div>
        </n-form>
      </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useMessage } from 'naive-ui'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useUserStore } from '@/stores/user'

const message = useMessage()
const userStore = useUserStore()

const form = reactive({
  username: userStore.user?.username || '',
  email: userStore.user?.email || '',
  realName: '',
  phone: '',
  bio: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule: unknown, value: string) => {
        if (value !== passwordForm.newPassword) {
          return new Error('两次输入的密码不一致')
        }
      },
      trigger: 'blur'
    }
  ]
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString()
}

const saveProfile = () => {
  message.success('个人信息保存成功')
}

const changePassword = () => {
  message.success('密码修改成功')
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}
</script>
