import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface PageState {
  page: number
  search?: string
  [key: string]: any
}

export const usePageStore = defineStore('page', () => {
  const pageState = ref<Record<string, PageState>>({})

  function setPageState(path: string, state: PageState) {
    pageState.value[path] = { ...pageState.value[path], ...state }
  }

  function getPageState(path: string): PageState {
    return pageState.value[path] || { page: 1 }
  }

  return { pageState, setPageState, getPageState }
})
