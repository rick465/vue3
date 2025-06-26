<template>
  <div class="flex flex-col gap-6 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- 页面标题 -->
    <div>
      <p class="mt-1 text-sm text-gray-500">管理系统配置和参数</p>
    </div>

    <!-- 设置选项卡 -->
    <div class="card bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full">
      <n-tabs type="line" animated>
        <n-tab-pane name="general" tab="基本设置">
          <div class="space-y-6 bg-black text-gray-100 dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg">
            <n-form
              ref="generalFormRef"
              :model="generalForm"
              :rules="generalRules"
              label-placement="left"
              label-width="auto"
              require-mark-placement="right-hanging"
            >
              <n-form-item label="系统名称" path="systemName">
                <n-input v-model:value="generalForm.systemName" placeholder="请输入系统名称" />
              </n-form-item>

              <n-form-item label="系统描述" path="description">
                <n-input
                  v-model:value="generalForm.description"
                  type="textarea"
                  placeholder="请输入系统描述"
                  :rows="3"
                />
              </n-form-item>

              <n-form-item label="管理员邮箱" path="adminEmail">
                <n-input v-model:value="generalForm.adminEmail" placeholder="请输入管理员邮箱" />
              </n-form-item>

              <n-form-item label="系统版本" path="version">
                <n-input v-model:value="generalForm.version" placeholder="请输入系统版本" />
              </n-form-item>

              <n-form-item label="维护模式" path="maintenanceMode">
                <n-switch v-model:value="generalForm.maintenanceMode" />
              </n-form-item>
            </n-form>

            <div class="flex justify-end">
              <n-button type="primary" @click="saveGeneralSettings">
                保存设置
              </n-button>
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="security" tab="安全设置">
          <div class="space-y-6 bg-black text-gray-100 dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg">
            <n-form
              ref="securityFormRef"
              :model="securityForm"
              :rules="securityRules"
              label-placement="left"
              label-width="auto"
              require-mark-placement="right-hanging"
            >
              <n-form-item label="密码最小长度" path="minPasswordLength">
                <n-input-number
                  v-model:value="securityForm.minPasswordLength"
                  :min="6"
                  :max="20"
                  placeholder="请输入密码最小长度"
                />
              </n-form-item>

              <n-form-item label="密码复杂度" path="passwordComplexity">
                <n-checkbox-group v-model:value="securityForm.passwordComplexity">
                  <div class="space-y-2">
                    <n-checkbox value="uppercase">必须包含大写字母</n-checkbox>
                    <n-checkbox value="lowercase">必须包含小写字母</n-checkbox>
                    <n-checkbox value="numbers">必须包含数字</n-checkbox>
                    <n-checkbox value="symbols">必须包含特殊字符</n-checkbox>
                  </div>
                </n-checkbox-group>
              </n-form-item>

              <n-form-item label="登录失败锁定" path="loginLockEnabled">
                <n-switch v-model:value="securityForm.loginLockEnabled" />
              </n-form-item>

              <n-form-item label="最大登录失败次数" path="maxLoginAttempts">
                <n-input-number
                  v-model:value="securityForm.maxLoginAttempts"
                  :min="3"
                  :max="10"
                  placeholder="请输入最大登录失败次数"
                />
              </n-form-item>

              <n-form-item label="锁定时间（分钟）" path="lockDuration">
                <n-input-number
                  v-model:value="securityForm.lockDuration"
                  :min="5"
                  :max="60"
                  placeholder="请输入锁定时间"
                />
              </n-form-item>
            </n-form>

            <div class="flex justify-end">
              <n-button type="primary" @click="saveSecuritySettings">
                保存设置
              </n-button>
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="notification" tab="通知设置">
          <div class="space-y-6 bg-black text-gray-100 dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg">
            <n-form
              ref="notificationFormRef"
              :model="notificationForm"
              label-placement="left"
              label-width="auto"
              require-mark-placement="right-hanging"
            >
              <n-form-item label="邮件通知" path="emailNotification">
                <n-switch v-model:value="notificationForm.emailNotification" />
              </n-form-item>

              <n-form-item label="SMTP服务器" path="smtpServer">
                <n-input v-model:value="notificationForm.smtpServer" placeholder="请输入SMTP服务器地址" />
              </n-form-item>

              <n-form-item label="SMTP端口" path="smtpPort">
                <n-input-number v-model:value="notificationForm.smtpPort" placeholder="请输入SMTP端口" />
              </n-form-item>

              <n-form-item label="邮箱账号" path="emailAccount">
                <n-input v-model:value="notificationForm.emailAccount" placeholder="请输入邮箱账号" />
              </n-form-item>

              <n-form-item label="邮箱密码" path="emailPassword">
                <n-input
                  v-model:value="notificationForm.emailPassword"
                  type="password"
                  placeholder="请输入邮箱密码"
                  show-password-on="click"
                />
              </n-form-item>

              <n-form-item label="系统通知" path="systemNotification">
                <n-switch v-model:value="notificationForm.systemNotification" />
              </n-form-item>
            </n-form>

            <div class="flex justify-end">
              <n-button type="primary" @click="saveNotificationSettings">
                保存设置
              </n-button>
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="backup" tab="备份设置">
          <div class="space-y-6 bg-black text-gray-100 dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg">
            <div class="bg-blue-900 border border-blue-700 rounded-lg p-4 dark:bg-blue-50 dark:border-blue-200 dark:text-blue-800">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-200 dark:text-blue-800">备份提醒</h3>
                  <div class="mt-2 text-sm text-blue-100 dark:text-blue-700">
                    <p>定期备份系统数据可以防止数据丢失。建议每周进行一次完整备份。</p>
                  </div>
                </div>
              </div>
            </div>

            <n-form
              ref="backupFormRef"
              :model="backupForm"
              label-placement="left"
              label-width="auto"
              require-mark-placement="right-hanging"
            >
              <n-form-item label="自动备份" path="autoBackup">
                <n-switch v-model:value="backupForm.autoBackup" />
              </n-form-item>

              <n-form-item label="备份频率" path="backupFrequency">
                <n-select
                  v-model:value="backupForm.backupFrequency"
                  :options="backupFrequencyOptions"
                  placeholder="请选择备份频率"
                />
              </n-form-item>

              <n-form-item label="备份保留天数" path="backupRetention">
                <n-input-number
                  v-model:value="backupForm.backupRetention"
                  :min="1"
                  :max="365"
                  placeholder="请输入备份保留天数"
                />
              </n-form-item>

              <n-form-item label="备份路径" path="backupPath">
                <n-input v-model:value="backupForm.backupPath" placeholder="请输入备份路径" />
              </n-form-item>
            </n-form>

            <div class="flex justify-end space-x-2">
              <n-button @click="createBackup">
                立即备份
              </n-button>
              <n-button type="primary" @click="saveBackupSettings">
                保存设置
              </n-button>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()

// 基本设置表单
const generalForm = reactive({
  systemName: '后台管理系统',
  description: '基于 Vue 3 + Naive UI 的现代化后台管理系统',
  adminEmail: 'admin@example.com',
  version: '1.0.0',
  maintenanceMode: false
})

const generalRules = {
  systemName: [
    { required: true, message: '请输入系统名称', trigger: 'blur' }
  ],
  adminEmail: [
    { required: true, message: '请输入管理员邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 安全设置表单
const securityForm = reactive({
  minPasswordLength: 8,
  passwordComplexity: ['uppercase', 'lowercase', 'numbers'],
  loginLockEnabled: true,
  maxLoginAttempts: 5,
  lockDuration: 30
})

const securityRules = {
  minPasswordLength: [
    { required: true, message: '请输入密码最小长度', trigger: 'blur' }
  ],
  maxLoginAttempts: [
    { required: true, message: '请输入最大登录失败次数', trigger: 'blur' }
  ]
}

// 通知设置表单
const notificationForm = reactive({
  emailNotification: false,
  smtpServer: '',
  smtpPort: 587,
  emailAccount: '',
  emailPassword: '',
  systemNotification: true
})

// 备份设置表单
const backupForm = reactive({
  autoBackup: true,
  backupFrequency: 'weekly',
  backupRetention: 30,
  backupPath: '/backup'
})

const backupFrequencyOptions = [
  { label: '每天', value: 'daily' },
  { label: '每周', value: 'weekly' },
  { label: '每月', value: 'monthly' }
]

// 保存设置方法
const saveGeneralSettings = () => {
  message.success('基本设置保存成功')
}

const saveSecuritySettings = () => {
  message.success('安全设置保存成功')
}

const saveNotificationSettings = () => {
  message.success('通知设置保存成功')
}

const saveBackupSettings = () => {
  message.success('备份设置保存成功')
}

const createBackup = () => {
  message.info('开始创建备份...')
  setTimeout(() => {
    message.success('备份创建成功')
  }, 2000)
}
</script>
