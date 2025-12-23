import http from '@/utils/http'

// Banner 列表项类型
export interface BannerItem {
    id: string
    title: string
    info: string
    imageUrl: string
    goodsId: number
    [key: string]: string | number | undefined
}

// 用户信息类型
export interface User {
    id: number
    nickname: string
    avatar: string
}

export interface CategoryItem {
    id: string
    name: string
    level: number
    parentId: string
}

export function fetchBanner() {
    return http.get<BannerItem[]>('/banner/list')
}

/**
 * 获取用户信息
 */
export function fetchUser() {
    return http.get<User>('/user/info')
}

export function fetchCategory() {
    return http.get<CategoryItem[]>('/category/list')
}

// 商品类型
export interface ProductItem {
    id: string
    title: string
    img: string
    price: string
    // 可根据实际接口补充字段
}

// 获取某分类及其所有子分类下的商品
export function fetchProductsByCategory(categoryId: string, limit = 10) {
    return http.get<ProductItem[]>('/goods/listByCategory', {
        categoryId,
        limit,
    })
}
