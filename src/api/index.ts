// ===================== 型別引入 =====================
import type {
  Role,
  DashboardStats,
  ChartData,
  ApiResponse,
  PaginatedResponse,
  User
} from '@/types'
import { mockUsers } from './users'


// ===================== 工具函式 =====================
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// ===================== Mock 資料區 =====================
// 角色資料（支援 localStorage 永久保存）
const mockRoles: Role[] = JSON.parse(localStorage.getItem('mockRoles') || 'null') || [
  {
    id: 1,
    name: '超级管理员',
    code: 'SUPER_ADMIN',
    description: '拥有所有权限',
    permissions: [],
    userCount: 1
  },
  {
    id: 2,
    name: '管理员',
    code: 'ADMIN',
    description: '拥有大部分权限',
    permissions: [],
    userCount: 3
  },
  {
    id: 3,
    name: '普通用户',
    code: 'USER',
    description: '基础权限',
    permissions: [],
    userCount: 10
  }
]

// ===================== 角色相關 API =====================
// 取得角色列表
export const getRoles = async (page: number = 1, pageSize: number = 10): Promise<ApiResponse<PaginatedResponse<Role>>> => {
  await delay(500)
  // 每次都從 localStorage 讀取最新資料
  const roles: Role[] = JSON.parse(localStorage.getItem('mockRoles') || 'null') || []
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = roles.slice(start, end)
  return {
    code: 200,
    message: '获取成功',
    data: {
      data,
      pagination: {
        page,
        pageSize,
        total: roles.length,
        totalPages: Math.ceil(roles.length / pageSize)
      }
    }
  }
}

// 新增角色（同步新增 mock user）
export const createRole = async (role: Omit<Role, 'id' | 'userCount'> & { password?: string }): Promise<ApiResponse<Role>> => {
  await delay(500)
  const newRole: Role = {
    ...role,
    id: mockRoles.length ? Math.max(...mockRoles.map(r => r.id)) + 1 : 1,
    userCount: 1
  }
  mockRoles.push(newRole)
  localStorage.setItem('mockRoles', JSON.stringify(mockRoles))

  // 同步新增 mock user
  const username = (role.name || 'user').toLowerCase()
  const newUser: User & { password: string } = {
    id: mockUsers.length ? Math.max(...mockUsers.map(u => u.id)) + 1 : 1,
    username,
    email: `${username}@example.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    role: role.name,
    permissions: role.permissions?.map(p => typeof p === 'string' ? p : p.code) || [],
    createdAt: new Date().toISOString().slice(0, 10),
    lastLoginAt: new Date().toISOString().slice(0, 10),
    password: (role).password || '123456'
  }
  mockUsers.push(newUser)
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers))

  return {
    code: 200,
    message: '创建成功',
    data: newRole
  }
}

// ===================== 權限/統計/圖表 API =====================
// 取得儀表板統計
export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  await delay(300)
  return {
    code: 200,
    message: '获取成功',
    data: {
      totalUsers: 1250,
      totalOrders: 8560,
      totalRevenue: 1250000,
      growthRate: 12.5
    }
  }
}

// 取得圖表資料
export const getChartData = async (): Promise<ApiResponse<ChartData>> => {
  await delay(300)
  return {
    code: 200,
    message: '获取成功',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [
        {
          label: '用户增长',
          data: [65, 78, 90, 105, 125, 150],
          backgroundColor: ['rgba(59, 130, 246, 0.2)'],
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2
        },
        {
          label: '订单数量',
          data: [120, 135, 150, 180, 200, 220],
          backgroundColor: ['rgba(16, 185, 129, 0.2)'],
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2
        }
      ]
    }
  }
}

// 重新導出 users 與 permissions 相關 API，供外部從 @/api 匯入
export { login, getUsers, updateUser, changePassword } from './users'
export { getPermissions } from './permissions'
