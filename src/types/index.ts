// 用户相关类型
export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  role: string
  permissions: string[]
  createdAt: string
  lastLoginAt: string
}

// 权限相关类型
export interface Permission {
  id: number
  name: string
  code: string
  description: string
  module: string
}

export interface Role {
  id: number
  name: string
  code: string
  description: string
  permissions: Permission[]
  userCount: number
}

// 菜单项类型
export interface MenuItem {
  id: number
  title: string
  icon?: string | object
  path: string
  children?: MenuItem[]
  permission?: string
}

// 分页相关类型
export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

// 仪表板数据类型
export interface DashboardStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  growthRate: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string
    borderWidth?: number
  }[]
}

// API 响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 登录相关类型
export interface LoginForm {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}
