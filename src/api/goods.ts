import http from '@/utils/http'

/**
 * 商品项类型（兼容前端页面所有字段）
 */
export interface GoodsItem {
    id: string // 商品ID
    name: string
    img: string
    info: string
    price: string
    originalPrice: string
    storeId: string
}

/**
 * 获取猜你喜欢 / 推荐商品
 * - 返回 Promise<ResponseData<ProductItem[]>>
 * - 接口路径为示例，后端调整时请同步修改
 */
export function fetchRecommendedProducts(params?: Record<string, unknown>) {
    return http.get<GoodsItem[]>('/goods/recommend', params)
}

/**
 * 商品分页响应类型
 */
export interface GoodsListResponse {
    records: GoodsItem[]
    total: number
}

/**
 * 获取商品列表（分页）
 */
export function searchGoods(params?: Record<string, unknown>) {
    return http.get<GoodsListResponse>('/goods/search', params)
}

/**
 * 商品详情类型
 */
export interface GoodsDetail {
    shopId: string // 店铺ID
    shopName: string // 店铺名称
    shopAvatar: string // 店铺头像
    goodsName: string // 商品名称
    goodsInfo: string // 商品简短信息
    price: number // 现价, 单位: 分
    originalPrice?: number // 原价, 单位: 分
    sale: number // 销量
    inventory: number // 库存
    mainImg: string // 主图url
    subImg: string[] // 子图url列表
    description: string // 商品详细描述（富文本）
    options?: string[] // 规格选项
    createTime?: string // 上架时间或创建时间
}

/**
 * 商品评论类型（用于懒加载）
 */
export interface GoodsComment {
    id: string
    user: string
    time: string
    rating?: number
    content: string
}

/**
 * 获取商品评论（支持分页）
 */
export function fetchGoodsComments(goodsId: string, params?: Record<string, unknown>) {
    return http.get<{ records: GoodsComment[]; total: number }>(`/goods/comments`, {
        goodsId,
        ...params,
    })
}

/**
 * 获取商品详情
 */
export function fetchGoodsDetail(goodsId: string) {
    return http.get<GoodsDetail>(`/goods/detail/${goodsId}`)
}
