import http from '@/utils/http'

/**
 * 收藏项类型
 */
export interface FavoriteItem {
    /** 收藏ID */
    id: string
    /** 用户ID */
    userId: string
    /** 商品ID */
    goodsId: string
    /** 商品标题 */
    goodsTitle: string
    /** 商品图片 */
    goodsImg: string
    /** 商品价格 */
    goodsPrice: string
    /** 商品描述 */
    goodsDesc: string
    /** 店铺ID */
    storeId: string
    /** 收藏时间 */
    addedAt: string
}

/**
 * 获取收藏列表
 */
export function fetchFavorites() {
    return http.get<FavoriteItem[]>('/favorites')
}

/**
 * 添加收藏
 * @param goodsId 商品ID
 * @param storeId 店铺ID
 */
export function addFavorite(goodsId: string, storeId: string) {
    // 将 goodsId 与 storeId 都放入请求体，接口路径不携带参数
    return http.post<{ id: string; goodsId: string }>(`/favorites`, { goodsId, storeId })
}

/**
 * 取消收藏
 * @param id 收藏ID
 */
export function removeFavorite(id: string) {
    return http.delete(`/favorites/${id}`)
}

/**
 * 收藏状态
 */
export interface FavoriteStatus {
    /** 是否已收藏 */
    isFavorite: boolean
    /** 收藏ID（已收藏时返回ID，未收藏时返回null） */
    favoriteId: string | null
}

/**
 * 检查是否已收藏
 * @param goodsId 商品ID
 */
export function checkFavoriteStatus(goodsId: string) {
    return http.get<FavoriteStatus>(`/favorites/status/${goodsId}`)
}
