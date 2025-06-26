import { ref, computed, readonly } from 'vue'

interface UseApiOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: string) => void
}

export function useApi<T = unknown>(options: UseApiOptions = {}) {
  const { onSuccess, onError } = options

  // 響應式狀態
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 計算屬性
  const hasData = computed(() => data.value !== null)
  const hasError = computed(() => error.value !== null)

  // 執行 API 請求
  const execute = async (apiCall: () => Promise<T>) => {
    loading.value = true
    error.value = null

    try {
      const result = await apiCall()
      data.value = result
      onSuccess?.(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤'
      error.value = errorMessage
      onError?.(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 重置狀態
  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
  }

  // 設置數據
  const setData = (newData: T) => {
    data.value = newData
  }

  // 設置錯誤
  const setError = (errorMessage: string) => {
    error.value = errorMessage
  }

  return {
    // 狀態
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),

    // 計算屬性
    hasData,
    hasError,

    // 方法
    execute,
    reset,
    setData,
    setError
  }
}
