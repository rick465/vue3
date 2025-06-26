import type { Permission, ApiResponse } from '@/types'

// 權限資料
export const mockPermissions: Permission[] = [
  { id: 1, name: '用户查看', code: 'user:read', description: '查看用户列表', module: '用户管理' },
  { id: 2, name: '用户编辑', code: 'user:write', description: '编辑用户信息', module: '用户管理' },
  { id: 3, name: '角色查看', code: 'role:read', description: '查看角色列表', module: '角色管理' },
  { id: 4, name: '角色编辑', code: 'role:write', description: '编辑角色信息', module: '角色管理' },
  { id: 5, name: '权限查看', code: 'permission:read', description: '查看权限列表', module: '权限管理' },
  { id: 6, name: '权限编辑', code: 'permission:write', description: '编辑权限信息', module: '权限管理' }
]

// 取得權限列表
export const getPermissions = async (): Promise<ApiResponse<Permission[]>> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return {
    code: 200,
    message: '获取成功',
    data: mockPermissions
  }
}
