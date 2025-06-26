import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // 從 localStorage 讀取初始值
  const getStoredValue = (): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  // 創建響應式引用
  const storedValue = ref<T>(getStoredValue())

  // 設置值的函數
  const setValue = (value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      storedValue.value = value
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  // 移除值的函數
  const removeValue = () => {
    try {
      localStorage.removeItem(key)
      storedValue.value = defaultValue
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  }

  // 監聽值變化，自動保存到 localStorage
  watch(storedValue, (newValue) => {
    setValue(newValue)
  }, { deep: true })

  return {
    value: storedValue,
    setValue,
    removeValue
  }
}
