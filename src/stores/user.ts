import { defineStore } from 'pinia'

// 用户状态类型定义，规定了用户状态包含哪些字段及类型

export interface UserState {
    uid: string // 用户ID
    nickname: string // 用户昵称
    token: string // 登录令牌
    avatarUrl?: string // 用户头像URL（可选）
}

/**
 * 用户状态管理 Store
 * - 用于集中管理用户相关的状态数据
 * - 支持持久化，自动同步到 localStorage
 */
export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        uid: '',
        nickname: '',
        token: '',
        avatarUrl: '',
    }),
    actions: {
        setToken(token: string) {
            this.token = token
        },
        /**
         * 批量设置用户信息
         * @param user 传入部分或全部用户字段，自动合并到当前状态
         */
        setUser(user: Partial<UserState>) {
            ;(Object.keys(user) as Array<keyof UserState>).forEach((key) => {
                if (key in this) {
                    this[key] = user[key]!
                }
            })
        },
        /**
         * 清空用户信息（如退出登录时调用）
         */
        clearUser() {
            this.$reset()
        },

        /**
         * 退出登录，清空用户信息并移除持久化存储中的用户数据
         */
        logout() {
            // 清空当前内存状态
            this.clearUser()
        },
    },
    // persist 配置用于状态持久化（依赖 pinia-plugin-persistedstate 插件）
    persist: true,
})
