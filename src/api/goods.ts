import http from '@/utils/http'

/**
 * 商品项类型
 */
export interface ProductItem {
    id: number
    title: string
    img?: string
    price?: string
    /** 价格的最小单位（用于精确计算和排序） */
    price_cents?: number
    /** 简短描述 */
    desc?: string
}

/**
 * 获取猜你喜欢 / 推荐商品
 * - 返回 Promise<ResponseData<ProductItem[]>>
 * - 接口路径为示例，后端调整时请同步修改
 */
export function fetchRecommendedProducts(params?: Record<string, unknown>) {
    return http.get<ProductItem[]>('/goods/recommend', params)
}

/**
 * 获取商品列表（示例）
 */
export function fetchGoodsList(params?: Record<string, unknown>) {
    return http.get<ProductItem[]>('/goods', params)
}

/**
 * 商品详情类型
 */
export interface ProductDetail {
    id: number
    title: string
    desc: string
    price: number
    stock: number
    sales: number
    images: string[]
    mainImage: string
    createTime: string
    // 配送信息
    shipFrom?: string
    // 口味/规格选项
    options?: string[]
    // 详情描述
    detail?: string
    // 评价
    comments?: Array<{
        id: number
        user: string
        content: string
        rating: number
        time: string
    }>
}

/**
 * 获取商品详情
 */
export function fetchGoodsDetail(id: string | number) {
    return http.get<ProductDetail>(`/goods/detail`, { id })
}
