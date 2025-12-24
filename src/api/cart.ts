import { http } from '@/utils/http'
import type { ResponseData } from '@/utils/http'

// 购物车商品项类型
export interface CartItem {
    id: string
    goodsId: string
    goodsName: string
    mainImg: string
    price: number // 单位: 分
    quantity: number
    selected: boolean
    shopId: string
    shopName: string
    inventory: number
    options?: string[]
}

// 购物车统计信息
export interface CartSummary {
    totalItems: number
    totalPrice: number
    selectedItems: number
    selectedPrice: number
}

// 添加到购物车的请求参数
export interface AddToCartParams {
    goodsId: string
    quantity: number
}

/**
 * 获取购物车商品列表
 * GET /cart
 */
export function fetchCartItems(): Promise<ResponseData<CartItem[]>> {
    return http.get<CartItem[]>('/cart')
}

/**
 * 添加商品到购物车
 * POST /cart
 */
export function addToCart(params: AddToCartParams): Promise<ResponseData<CartItem>> {
    return http.post<CartItem>('/cart', params)
}

/**
 * 更新购物车商品（数量、选中状态等）
 * PATCH /cart/:id
 */
export function updateCartItem(
    id: string,
    data: Partial<Pick<CartItem, 'quantity' | 'selected'>>
): Promise<ResponseData<CartItem>> {
    return http.put<CartItem>(`/cart/${id}`, data)
}

/**
 * 删除购物车商品
 * DELETE /cart/:id
 */
export function removeCartItem(id: string): Promise<ResponseData<void>> {
    return http.delete<void>(`/cart/${id}`)
}

/**
 * 批量更新购物车（如全选/取消全选）
 * PATCH /cart
 */
export function updateCartBatch(data: {
    ids?: string[]
    selected?: boolean
}): Promise<ResponseData<void>> {
    return http.put<void>('/cart', data)
}

/**
 * 批量删除购物车商品
 * DELETE /cart
 */
export function removeCartItems(ids: string[]): Promise<ResponseData<void>> {
    return http.delete<void>('/cart', { ids })
}

/**
 * 获取购物车统计信息
 * GET /cart/summary
 */
export function getCartSummary(): Promise<ResponseData<CartSummary>> {
    return http.get<CartSummary>('/cart/summary')
}
