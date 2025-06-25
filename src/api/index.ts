import type {
  User,
  Role,
  Permission,
  LoginForm,
  LoginResponse,
  PaginatedResponse,
  DashboardStats,
  ChartData,
  ApiResponse
} from '@/types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: '超级管理员',
    permissions: ['user:read', 'user:write', 'role:read', 'role:write'],
    createdAt: '2024-01-01',
    lastLoginAt: '2024-06-25'
  },
  {
    id: 2,
    username: 'manager',
    email: 'manager@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager',
    role: '管理员',
    permissions: ['user:read', 'role:read'],
    createdAt: '2024-02-01',
    lastLoginAt: '2024-06-24'
  }
]

// 模拟角色数据
const mockRoles: Role[] = [
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

// 模拟权限数据
const mockPermissions: Permission[] = [
  { id: 1, name: '用户查看', code: 'user:read', description: '查看用户列表', module: '用户管理' },
  { id: 2, name: '用户编辑', code: 'user:write', description: '编辑用户信息', module: '用户管理' },
  { id: 3, name: '角色查看', code: 'role:read', description: '查看角色列表', module: '角色管理' },
  { id: 4, name: '角色编辑', code: 'role:write', description: '编辑角色信息', module: '角色管理' },
  { id: 5, name: '权限查看', code: 'permission:read', description: '查看权限列表', module: '权限管理' },
  { id: 6, name: '权限编辑', code: 'permission:write', description: '编辑权限信息', module: '权限管理' }
]

// 登录 API
export const login = async (form: LoginForm): Promise<ApiResponse<LoginResponse>> => {
  await delay(1000)

  const user = mockUsers.find(u => u.username === form.username)

  if (!user || form.password !== '123456') {
    throw new Error('用户名或密码错误')
  }

  return {
    code: 200,
    message: '登录成功',
    data: {
      token: 'mock-jwt-token-' + Date.now(),
      user
    }
  }
}

// 获取用户列表
export const getUsers = async (page: number = 1, pageSize: number = 10): Promise<ApiResponse<PaginatedResponse<User>>> => {
  await delay(500)

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = mockUsers.slice(start, end)

  return {
    code: 200,
    message: '获取成功',
    data: {
      data,
      pagination: {
        page,
        pageSize,
        total: mockUsers.length,
        totalPages: Math.ceil(mockUsers.length / pageSize)
      }
    }
  }
}

// 获取角色列表
export const getRoles = async (page: number = 1, pageSize: number = 10): Promise<ApiResponse<PaginatedResponse<Role>>> => {
  await delay(500)

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = mockRoles.slice(start, end)

  return {
    code: 200,
    message: '获取成功',
    data: {
      data,
      pagination: {
        page,
        pageSize,
        total: mockRoles.length,
        totalPages: Math.ceil(mockRoles.length / pageSize)
      }
    }
  }
}

// 获取权限列表
export const getPermissions = async (): Promise<ApiResponse<Permission[]>> => {
  await delay(300)

  return {
    code: 200,
    message: '获取成功',
    data: mockPermissions
  }
}

// 获取仪表板统计数据
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

// 获取图表数据
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

// 新增角色 API
export const createRole = async (role: Omit<Role, 'id' | 'userCount'>): Promise<ApiResponse<Role>> => {
  await delay(500)
  const newRole: Role = {
    ...role,
    id: mockRoles.length ? Math.max(...mockRoles.map(r => r.id)) + 1 : 1,
    userCount: 0
  }
  mockRoles.push(newRole)
  return {
    code: 200,
    message: '创建成功',
    data: newRole
  }
}
