import { http } from '@/utils/http'

/**
 * 用户信息接口（后端返回结构）
 */
export interface UserInfo {
    id: string              // 用户ID
    username: string        // 用户名
    nickname: string        // 昵称
    avatarUrl: string       // 头像URL（后端字段名）
    email: string           // 邮箱（后端返回确定值，null会转为空字符串）
    phone: string           // 手机号（后端返回确定值，null会转为空字符串）
    bio: string             // 个人简介（后端返回确定值，null会转为空字符串）
}

/**
 * 更新用户信息的请求参数
 */
export interface UpdateUserInfoPayload {
    nickname?: string       // 昵称
    phone?: string          // 手机号
    email?: string          // 邮箱
    bio?: string            // 个人简介
    avatarUrl?: string      // 头像URL
}

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
 * 上传头像
 * POST /common/upload/image
 * @param file 头像文件
 */
export function uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return http.post<{ url: string }>('/common/upload/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

/**
 * 修改密码
 * PUT /user/password
 */
export interface ChangePasswordPayload {
    oldPassword: string     // 旧密码
    newPassword: string     // 新密码
}

export function changePassword(payload: ChangePasswordPayload) {
    return http.put('/user/password', payload)
}
