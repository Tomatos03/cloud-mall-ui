import { http } from '@/utils/http'

/**
 * 用户信息接口（后端返回结构）
 */
export interface UserInfo {
    uid: string // 用户ID
    username: string // 用户名
    nickname: string // 昵称
    avatarUrl: string // 头像URL
    email: string // 邮箱
    phone: string // 手机号
    bio: string // 个人简介
}

export type UpdateUserInfoPayload = Partial<Omit<UserInfo, 'username'>>

/**
 * 获取用户信息
 * GET /user/info
 */
export function getUserInfo() {
    return http.get<UserInfo>('/user/info')
}

/**
 * 更新用户信息
 * PUT /user/info
 */
export function updateUserInfo(payload: UpdateUserInfoPayload) {
    return http.put<UserInfo>('/user/info', payload)
}

/**
 * 修改密码
 * PUT /user/password
 */
export interface ChangePasswordPayload {
    oldPassword: string // 旧密码
    newPassword: string // 新密码
}

export function changePassword(payload: ChangePasswordPayload) {
    return http.put('/user/password', payload)
}
