import { http } from '@/utils/http'
import type { ResponseData } from '@/utils/http'

// 购物车商品项类型
export interface CartItem {
    storeId: string
    storeName: string
    goodsId: string
    goodsName: string
    price: number // 单位: 分
    selected: boolean
    inventory: number // 库存
    quantity: number
    mainImage: string
    unit: string
}

export interface CartStoreItem {
    storeId: string
    storeName: string
    items: CartItem[]
}

// 添加到购物车的请求参数
export interface AddToCartParams {
    goodsId: string
    storeId: string
    quantity: number
}

// 更新购物车项的请求参数
export interface UpdateCartItemParams {
    storeId: string
    goodsId: string
    quantity: number
}

// 删除购物车项的请求参数
export interface RemoveCartItemParams {
    storeId: string
    goodsId: string
}

// 批量删除购物车项的请求参数
export interface BatchRemoveCartItemsParams {
    items: RemoveCartItemParams[]
}

export interface CartResponseData {
    storeList: CartStoreItem[]
}

/**
 * 获取购物车
 * GET /cart
 */
export async function fetchCart() {
    return http.get<CartResponseData>('/cart')
}

/**
 * 添加商品到购物车
 * POST /cart
 */
export async function addToCart(params: AddToCartParams) {
    return http.post<void>('/cart', params)
}

/**
 * 更新购物车项（数量）
 * PUT /cart
 */
export async function updateCartItem(params: UpdateCartItemParams) {
    return http.put<void>('/cart', params)
}

/**
 * 删除购物车项
 * DELETE /cart/{storeId}/items/{goodsId}
 */
export function removeCartItem(params: RemoveCartItemParams): Promise<ResponseData<void>> {
    return http.delete<void>(`/cart/${params.storeId}/items/${params.goodsId}`)
}

/**
 * 批量删除购物车项
 * POST /web/cart/items/batch
 */
export function batchRemoveCartItems(items: RemoveCartItemParams[]): Promise<ResponseData<void>> {
    return http.post<void>('/cart/items/batch', items)
}

/**
 * 清空购物车
 * DELETE /cart
 */
export function clearCart(): Promise<ResponseData<void>> {
    return http.delete<void>('/cart')
}
