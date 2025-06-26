<template>
    <div class="flex flex-col gap-6 w-full min-w-0">
      <div>
        <h1 class="text-2xl font-bold text-white-100">個人資料</h1>
        <p class="mt-1 text-sm text-gray-500">管理您的個人資訊和帳戶設定</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <!-- 个人信息卡片 -->
        <div class="lg:col-span-2">
          <div class="card bg-gray-800 text-gray-100">
            <h3 class="text-lg font-medium text-white-100 mb-4">基本資訊</h3>
            <n-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-placement="left"
              label-width="auto"
              require-mark-placement="right-hanging"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <n-form-item label="用戶名" path="username">
                  <n-input v-model:value="form.username" disabled />
                </n-form-item>

                <n-form-item label="郵箱" path="email">
                  <n-input v-model:value="form.email" placeholder="請輸入郵箱" />
                </n-form-item>

                <n-form-item label="真實姓名" path="realName">
                  <n-input v-model:value="form.realName" placeholder="請輸入真實姓名" />
                </n-form-item>

                <n-form-item label="手機號碼" path="phone">
                  <n-input v-model:value="form.phone" placeholder="請輸入手機號碼" />
                </n-form-item>
              </div>

              <n-form-item label="個人簡介" path="bio">
                <n-input
                  v-model:value="form.bio"
                  type="textarea"
                  placeholder="請輸入個人簡介"
                  :rows="3"
                />
              </n-form-item>

              <div class="flex justify-end">
                <n-button type="primary" @click="saveProfile">
                  儲存資訊
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
              <h3 class="text-lg font-medium text-white-100">{{ userStore.user?.username }}</h3>
              <p class="text-sm text-gray-500">{{ userStore.user?.role }}</p>
              <n-button class="mt-4" size="small">
                更換頭像
              </n-button>
            </div>
          </div>

          <div class="card bg-gray-800 text-gray-100 w-full">
            <h3 class="text-lg font-medium text-white-100 mb-4">帳戶資訊</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">用戶ID</span>
                <span class="text-sm font-medium">{{ userStore.user?.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">註冊時間</span>
                <span class="text-sm font-medium">{{ formatDate(userStore.user?.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">最後登入</span>
                <span class="text-sm font-medium">{{ formatDate(userStore.user?.lastLoginAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 修改密码 -->
      <div class="card bg-gray-800 text-white-100">
        <h3 class="text-lg font-medium text-white-100 mb-4">修改密碼</h3>
        <n-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <n-form-item label="當前密碼" path="currentPassword">
              <n-input
                v-model:value="passwordForm.currentPassword"
                type="password"
                placeholder="請輸入當前密碼"
                show-password-on="click"
              />
            </n-form-item>

            <n-form-item label="新密碼" path="newPassword">
              <n-input
                v-model:value="passwordForm.newPassword"
                type="password"
                placeholder="請輸入新密碼"
                show-password-on="click"
              />
            </n-form-item>

            <n-form-item label="確認密碼" path="confirmPassword">
              <n-input
                v-model:value="passwordForm.confirmPassword"
                type="password"
                placeholder="請再次輸入新密碼"
                show-password-on="click"
              />
            </n-form-item>
          </div>

          <div class="flex justify-end">
            <n-button type="primary" @click="handleChangePassword">
              修改密碼
            </n-button>
          </div>
        </n-form>
      </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { updateUser, changePassword as changePasswordApi } from '@/api'

const message = useMessage()
const userStore = useUserStore()

const form = reactive({
  username: '',
  email: '',
  realName: '',
  phone: '',
  bio: ''
})

const rules = {
  email: [
    { required: true, message: '請輸入郵箱', trigger: 'blur' },
    { type: 'email', message: '請輸入正確的郵箱格式', trigger: 'blur' }
  ]
}

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  currentPassword: [
    { required: true, message: '請輸入當前密碼', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '請輸入新密碼', trigger: 'blur' },
    { min: 6, message: '密碼長度不能少於6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '請再次輸入新密碼', trigger: 'blur' },
    {
      validator: (_rule: unknown, value: string) => {
        if (value !== passwordForm.newPassword) {
          return new Error('兩次輸入的密碼不一致')
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

const saveProfile = async () => {
  try {
    const res = await updateUser({
      username: form.username,
      email: form.email,
      realName: form.realName,
      phone: form.phone,
      bio: form.bio
    })
    // 更新 userStore 及 localStorage
    userStore.user = res.data
    localStorage.setItem('user', JSON.stringify(res.data))
    // 重新設置 form
    form.username = res.data.username || ''
    form.email = res.data.email || ''
    form.realName = res.data.realName || ''
    form.phone = res.data.phone || ''
    form.bio = res.data.bio || ''
    message.success('個人資訊儲存成功')
  } catch (e: unknown) {
    if (e instanceof Error) {
      message.error(e.message || '儲存失敗')
    } else {
      message.error('儲存失敗')
    }
  }
}

const handleChangePassword = async () => {
  try {
    await changePasswordApi(
      form.username,
      passwordForm.currentPassword,
      passwordForm.newPassword
    )
    message.success('密碼修改成功')
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (e: unknown) {
    if (e instanceof Error) {
      message.error(e.message || '密碼修改失敗')
    } else {
      message.error('密碼修改失敗')
    }
  }
}

onMounted(() => {
  userStore.initAuth()
  if (userStore.user) {
    form.username = userStore.user.username || ''
    form.email = userStore.user.email || ''
    form.realName = userStore.user.realName || ''
    form.phone = userStore.user.phone || ''
    form.bio = userStore.user.bio || ''
  }
})
</script>
