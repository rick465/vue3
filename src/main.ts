import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'
import permission from './directives/permission'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naive)
app.directive('permission', permission)

// 初始化用户状态
const userStore = useUserStore()
userStore.initAuth()

app.mount('#app')
