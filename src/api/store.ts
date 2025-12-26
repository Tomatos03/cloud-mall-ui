import http from '@/utils/http'

/**
 * 店铺信息类型
 */
export interface StoreItem {
    id: string
    name: string
    description: string
    avatarUrl: string
    rating: number
    followerCount: number
    productCount: number
    banner?: string
}

/**
 * 店铺商品项类型
 */
export interface StoreProductItem {
    id: string
    title: string
    desc: string
    price: string
    img: string
    sale?: number
}

/**
 * 获取店铺基本信息
 */
export function fetchStoreInfo(storeId: string) {
    return http.get<StoreItem>(`/store/info/${storeId}`)
}

/**
 * 获取店铺商品列表
 */
export function fetchStoreProducts(storeId: string, params?: Record<string, unknown>) {
    return http.get<StoreProductItem[]>(`/store/products/${storeId}`, params)
}

/**
 * 关注/取消关注店铺
 */
export function toggleFollowStore(storeId: string) {
    return http.post(`/store/follow/${storeId}`)
}
