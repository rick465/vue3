import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // 狀態
  const count = ref(0)
  const history = ref<number[]>([])

  // 計算屬性
  const isPositive = computed(() => count.value > 0)
  const isNegative = computed(() => count.value < 0)
  const isZero = computed(() => count.value === 0)
  const lastValue = computed(() => history.value[history.value.length - 1])

  // Actions (方法)
  const increment = () => {
    history.value.push(count.value)
    count.value++
  }

  const decrement = () => {
    history.value.push(count.value)
    count.value--
  }

  const reset = () => {
    history.value.push(count.value)
    count.value = 0
  }

  const setValue = (value: number) => {
    history.value.push(count.value)
    count.value = value
  }

  const add = (amount: number) => {
    history.value.push(count.value)
    count.value += amount
  }

  const subtract = (amount: number) => {
    history.value.push(count.value)
    count.value -= amount
  }

  const undo = () => {
    if (history.value.length > 0) {
      count.value = history.value.pop()!
    }
  }

  const clearHistory = () => {
    history.value = []
  }

  return {
    // 狀態
    count,
    history,

    // 計算屬性
    isPositive,
    isNegative,
    isZero,
    lastValue,

    // Actions
    increment,
    decrement,
    reset,
    setValue,
    add,
    subtract,
    undo,
    clearHistory
  }
})
