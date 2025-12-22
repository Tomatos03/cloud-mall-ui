import { http } from '@/utils/http'

export interface LoginPayload {
    username: string
    password: string
    role: string
}

export interface LoginResponse {
    id: string
    username: string
    nickname: string
    token: string
    avatar: string
}

/**
 * 登录请求
 * POST /web/login
 */
export function login(payload: LoginPayload) {
    return http.post<LoginResponse>('/user/login', payload)
}

export interface RegisterPayload {
    username: string
    password: string
}

/**
 * 注册请求
 * POST /web/register
 * 无返回值（只需保证请求成功）
 */
export async function register(payload: RegisterPayload) {
    await http.post('/user/register', payload)
}
