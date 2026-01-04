import http from '@/utils/http'

// 商品类型
export interface GoodsItem {
    id: string // 商品ID
    name: string // 商品名称
    img: string // 商品图片
    info: string // 简短描述
    price: string // 现价
    originalPrice?: string // 原价
}

export interface GoodsCard extends GoodsItem {
  sale: number // 销量
}

/**
 * 商品详情类型
 */
export interface GoodsDetail {
    id: string // 商品ID
    storeId: string // 店铺ID
    storeName: string // 店铺名称
    storeAvatarUrl: string // 店铺头像URL
    goodsName: string // 商品名称
    goodsInfo: string // 商品简短信息
    price: number // 现价, 单位: 分
    sale: number // 销量
    inventory: number // 库存
    mainImg: string // 主图url
    subImg: string[] // 子图url列表
    description: string // 商品详细描述（富文本）
    createTime?: string // 上架时间或创建时间
}

// 获取某分类及其所有子分类下的商品
export function fetchGoodsByCategoryId(categoryId: string, limit = 10) {
    return http.get<GoodsItem[]>('/goods/listByCategory', {
        categoryId,
        limit,
    })
}

/**
 * 获取猜你喜欢 / 推荐商品
 * - 返回 Promise<ResponseData<GoodsItem[]>>
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
 * 获取商品详情
 */
export function fetchGoodsDetail(goodsId: string) {
    return http.get<GoodsDetail>(`/goods/detail/${goodsId}`)
}
