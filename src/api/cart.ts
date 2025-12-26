import { http } from '@/utils/http'
import type { ResponseData } from '@/utils/http'

/**
 * 数据转换函数：将后端返回的字段映射为 index.vue 中使用的字段名称
 * 后端返回: storeId, storeName, goodsId, inventory
 * 前端使用: shopId, shopName, productId, stock
 */
function transformCartItem(item: any): CartItem {
    const inventory = Number(item.inventory)
    return {
        shopId: Number(item.storeId),
        shopName: item.storeName,
        productId: Number(item.goodsId),
        goodsName: item.goodsName,
        price: Number(item.price),
        selected: Boolean(item.selected),
        inventory: inventory,
        stock: inventory, // 适配 index.vue 中使用的 item.stock
        quantity: Number(item.quantity),
        mainImage: item.mainImage,
        unit: item.unit
    }
}

function transformCartResponse(data: any): CartResponse {
    return {
        shops: data.shops.map((shop: any) => ({
            shopId: Number(shop.storeId),
            shopName: shop.storeName,
            items: shop.items.map(transformCartItem)
        }))
    }
}

// 购物车商品项类型
export interface CartItem {
    shopId: number
    shopName: string
    productId: number
    goodsName: string
    price: number // 单位: 分
    selected: boolean
    inventory: number
    stock: number // 适配 index.vue 中的 :max="item.stock"
    quantity: number
    mainImage: string
    unit: string
}

// 购物车响应（按店铺分组）
export interface CartResponse {
    shops: Array<{
        shopId: number
        shopName: string
        items: CartItem[]
    }>
}

// 添加到购物车的请求参数
export interface AddToCartParams {
    goodsId: number
    storeId: number
    quantity: number
}

// 更新购物车项的请求参数
export interface UpdateCartItemParams {
    storeId: number
    goodsId: number
    quantity: number
}

// 删除购物车项的请求参数
export interface RemoveCartItemParams {
    storeId: number
    goodsId: number
}

// 批量删除购物车项的请求参数
export interface BatchRemoveCartItemsParams {
    items: RemoveCartItemParams[]
}

/**
 * 获取购物车
 * GET /cart
 */
export async function fetchCart(): Promise<ResponseData<CartResponse>> {
    const response = await http.get<any>('/cart')
    return {
        ...response,
        data: transformCartResponse(response.data)
    }
}

/**
 * 添加商品到购物车
 * POST /cart
 */
export async function addToCart(params: AddToCartParams): Promise<ResponseData<CartItem>> {
    const response = await http.post<any>('/cart', params)
    return {
        ...response,
        data: transformCartItem(response.data)
    }
}

/**
 * 更新购物车项（数量）
 * PUT /cart
 */
export async function updateCartItem(
    params: UpdateCartItemParams
): Promise<ResponseData<CartItem>> {
    const response = await http.put<any>('/cart', params)
    return {
        ...response,
        data: transformCartItem(response.data)
    }
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
