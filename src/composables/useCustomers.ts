import { ref, computed, readonly } from 'vue'
import type { Pagination } from '@/types'

interface Customer {
  id: number
  username: string
  email: string
  createdAt: string
  status: 'active' | 'inactive'
}

interface UseCustomersOptions {
  initialPageSize?: number
}

export function useCustomers(options: UseCustomersOptions = {}) {
  const { initialPageSize = 10 } = options

  // 響應式狀態
  const customers = ref<Customer[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(initialPageSize)
  const searchKeyword = ref('')
  const selectedStatus = ref('')

  const pagination = ref<Pagination>({
    page: 1,
    pageSize: initialPageSize,
    total: 0,
    totalPages: 0
  })

  // 模擬API：隨機產生客戶數據
  function generateRandomCustomers(count = 50): Customer[] {
    const customers: Customer[] = []
    for (let i = 1; i <= count; i++) {
      customers.push({
        id: i,
        username: `customer${i}`,
        email: `customer${i}@example.com`,
        createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
        status: Math.random() > 0.5 ? 'active' : 'inactive'
      })
    }
    return customers
  }

  const allCustomers = generateRandomCustomers(50)

  // 計算屬性
  const filteredCustomers = computed(() => {
    let filtered = customers.value

    // 按關鍵字搜索
    if (searchKeyword.value) {
      filtered = filtered.filter(customer =>
        customer.username.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    }

    // 按狀態篩選
    if (selectedStatus.value) {
      filtered = filtered.filter(customer => customer.status === selectedStatus.value)
    }

    return filtered
  })

  const totalCustomers = computed(() => customers.value.length)

  // API 方法
  const fetchCustomers = async (page: number, size: number): Promise<{ data: Customer[]; pagination: Pagination }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const start = (page - 1) * size
        const end = start + size
        resolve({
          data: allCustomers.slice(start, end),
          pagination: {
            page,
            pageSize: size,
            total: allCustomers.length,
            totalPages: Math.ceil(allCustomers.length / size)
          }
        })
      }, 300)
    })
  }

  const loadCustomers = async () => {
    loading.value = true
    try {
      const res = await fetchCustomers(currentPage.value, pageSize.value)
      customers.value = res.data
      pagination.value = res.pagination
    } catch (error) {
      console.error('Failed to load customers:', error)
    } finally {
      loading.value = false
    }
  }

  // 分頁方法
  const handlePageChange = (page: number, size: number) => {
    currentPage.value = page
    pageSize.value = size
    loadCustomers()
  }

  const handlePageSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
    loadCustomers()
  }

  // 搜索和篩選方法
  const handleSearch = (keyword: string) => {
    searchKeyword.value = keyword
    console.log('搜索:', keyword)
  }

  const handleClear = () => {
    searchKeyword.value = ''
    console.log('清除搜索')
  }

  const resetFilters = () => {
    searchKeyword.value = ''
    selectedStatus.value = ''
  }

  // 客戶操作方法
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Math.max(...customers.value.map(c => c.id)) + 1
    }
    customers.value.push(newCustomer)
    console.log('新增客戶:', newCustomer)
  }

  const updateCustomer = (id: number, updates: Partial<Customer>) => {
    const index = customers.value.findIndex(c => c.id === id)
    if (index !== -1) {
      customers.value[index] = { ...customers.value[index], ...updates }
      console.log('更新客戶:', id, updates)
    }
  }

  const deleteCustomer = (id: number) => {
    const index = customers.value.findIndex(c => c.id === id)
    if (index !== -1) {
      customers.value.splice(index, 1)
      console.log('刪除客戶:', id)
    }
  }

  // 返回響應式狀態和方法
  return {
    // 狀態
    customers: readonly(customers),
    loading: readonly(loading),
    currentPage: readonly(currentPage),
    pageSize: readonly(pageSize),
    searchKeyword,
    selectedStatus,
    pagination: readonly(pagination),

    // 計算屬性
    filteredCustomers,
    totalCustomers,

    // 方法
    loadCustomers,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleClear,
    resetFilters,
    addCustomer,
    updateCustomer,
    deleteCustomer
  }
}
