import type { User, LoginForm, LoginResponse, PaginatedResponse, ApiResponse } from '@/types'

// 用戶資料（支援 localStorage 永久保存）
export const mockUsers: (User & { password: string })[] = JSON.parse(localStorage.getItem('mockUsers') || 'null') || [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: '超级管理员',
    permissions: ['user:read', 'user:write', 'role:read', 'role:write'],
    createdAt: '2024-01-01',
    lastLoginAt: '2024-06-25',
    password: '123456'
  },
  {
    id: 2,
    username: 'manager',
    email: 'manager@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager',
    role: '管理员',
    permissions: ['user:read', 'role:read'],
    createdAt: '2024-02-01',
    lastLoginAt: '2024-06-24',
    password: '123456'
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 登入
export const login = async (form: LoginForm): Promise<ApiResponse<LoginResponse>> => {
  await delay(1000)
  const user = mockUsers.find(u => u.username === form.username)
  if (!user || form.password !== user.password) {
    throw new Error('用户名或密码错误')
  }
  // 登入時不要回傳密碼
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pw, ...userWithoutPassword } = user
  return {
    code: 200,
    message: '登录成功',
    data: {
      token: 'mock-jwt-token-' + Date.now(),
      user: userWithoutPassword as User
    }
  }
}

// 取得用戶列表
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

// 更新用戶資料
export const updateUser = async (userData: Partial<User> & { username: string }): Promise<ApiResponse<User>> => {
  await delay(500)
  const user = mockUsers.find(u => u.username === userData.username)
  if (!user) {
    throw new Error('用戶不存在')
  }
  Object.assign(user, userData)
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers))
  return {
    code: 200,
    message: '更新成功',
    data: user
  }
}

// 修改密碼
export const changePassword = async (username: string, currentPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
  await delay(500)
  const user = mockUsers.find(u => u.username === username)
  if (!user) {
    throw new Error('用戶不存在')
  }
  if (user.password !== currentPassword) {
    throw new Error('當前密碼錯誤')
  }
  user.password = newPassword
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers))
  return {
    code: 200,
    message: '密碼修改成功',
    data: null
  }
}
