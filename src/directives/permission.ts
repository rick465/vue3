import { useUserStore } from '@/stores/user'
import type { DirectiveBinding } from 'vue'

function checkPermission(value: string | string[]): boolean {
  const userStore = useUserStore()
  const userPermissions = userStore.user?.permissions || []
  if (Array.isArray(value)) {
    return value.some(p => userPermissions.includes(p))
  }
  return userPermissions.includes(value)
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (!checkPermission(binding.value)) {
      el.style.display = 'none'
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (!checkPermission(binding.value)) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  }
}
