import { http } from '@/utils/http'
import type { ResponseData } from '@/utils/http'

// 数据转换函数：确保 number 类型字段正确转换
function transformCartItem(item: any): CartItem {
    return {
        shopId: Number(item.shopId),
        shopName: item.shopName,
        productId: Number(item.productId),
        productName: item.productName,
        price: Number(item.price),
        selected: Boolean(item.selected),
        stock: Number(item.stock),
        quantity: Number(item.quantity),
        mainImage: item.mainImage,
        unit: item.unit
    }
}

function transformCartResponse(data: any): CartResponse {
    return {
        shops: data.shops.map((shop: any) => ({
            shopId: Number(shop.shopId),
            shopName: shop.shopName,
            items: shop.items.map(transformCartItem)
        }))
    }
}

// 购物车商品项类型
export interface CartItem {
    shopId: number
    shopName: string
    productId: number
    productName: string
    price: number // 单位: 分
    selected: boolean
    stock: number
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
 * DELETE /cart/{storeId}/{goodsId}
 */
export function removeCartItem(storeId: number, goodsId: number): Promise<ResponseData<void>> {
    return http.delete<void>(`/cart/${storeId}/${goodsId}`)
}

/**
 * 清空购物车
 * DELETE /cart
 */
export function clearCart(): Promise<ResponseData<void>> {
    return http.delete<void>('/cart')
}
