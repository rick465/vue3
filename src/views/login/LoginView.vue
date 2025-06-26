<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900">
    <div class="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-xl flex flex-col items-center">
      <div class="mb-8 flex flex-col items-center">
        <svg class="h-14 w-14 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-100 tracking-wide mb-1">后台管理系统</h2>
        <p class="text-gray-400 text-sm">请登录您的账户</p>
      </div>
      <n-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="w-full space-y-5"
        @submit.prevent="handleSubmit"
      >
        <n-form-item path="username">
          <n-input
            v-model:value="form.username"
            placeholder="账号"
            size="large"
            :disabled="loading"
            class="w-full"
            :input-props="{ autocomplete: 'username' }"
          >
            <template #prefix>
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="password">
          <n-input
            v-model:value="form.password"
            type="password"
            placeholder="密码"
            size="large"
            :disabled="loading"
            show-password-on="click"
            class="w-full"
            :input-props="{ autocomplete: 'current-password' }"
          >
            <template #prefix>
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </template>
          </n-input>
        </n-form-item>
        <div class="flex items-center justify-between w-full">
          <n-checkbox v-model:checked="rememberMe" class="text-gray-400">记住我</n-checkbox>
          <a href="#" class="text-xs text-blue-400 hover:underline">忘记密码？</a>
        </div>
        <n-button
          type="primary"
          size="large"
          :loading="loading"
          :disabled="loading"
          @keyup.enter="handleSubmit"

          class="w-full mt-2 bg-blue-500 hover:bg-blue-600 border-0"
          @click="handleSubmit"
        >
          {{ loading ? '登录中...' : '登录' }}
        </n-button>
      </n-form>
      <div class="text-center text-xs text-gray-500 mt-8">
        <p>测试账号：admin / 123456</p>
        <p>或 manager / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NForm, NFormItem, NInput, NButton, NCheckbox } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import type { FormInst } from 'naive-ui'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const rememberMe = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    await userStore.loginAction(form)
    message.success('登录成功')
    router.push('/dashboard')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '登录失败'
    message.error(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>
