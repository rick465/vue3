import { ref, computed, readonly } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  // 計算屬性
  const isPositive = computed(() => count.value > 0)
  const isNegative = computed(() => count.value < 0)
  const isZero = computed(() => count.value === 0)

  // 方法
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  const setValue = (value: number) => count.value = value
  const add = (amount: number) => count.value += amount
  const subtract = (amount: number) => count.value -= amount

  return {
    // 只讀狀態
    count: readonly(count),

    // 計算屬性
    isPositive,
    isNegative,
    isZero,

    // 方法
    increment,
    decrement,
    reset,
    setValue,
    add,
    subtract
  }
}
