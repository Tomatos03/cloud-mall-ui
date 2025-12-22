import type { ResponseData } from '@/utils/http'

// 购物车商品项类型
export interface CartItem {
    id: number
    productId: number
    title: string
    img?: string
    price: string
    price_cents: number
    quantity: number
    selected: boolean
    storeId: number
    storeName: string
    stock: number
    attributes?: {
        color?: string
        size?: string
        spec?: string
    }
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
    productId: number
    quantity: number
    attributes?: {
        color?: string
        size?: string
        spec?: string
    }
}

// 更新购物车商品数量的参数
export interface UpdateCartItemParams {
    cartItemId: number
    quantity: number
}

// 获取购物车商品列表
export function fetchCartItems(): Promise<ResponseData<CartItem[]>> {
    // 暂时注释掉 API 调用，使用静态数据
    // return http.get<CartItem[]>('/cart/items')
    return Promise.resolve({
        data: [
            {
                id: 1,
                productId: 101,
                title: '蓝牙无线耳机 TWS真无线 降噪耳机',
                img: 'https://via.placeholder.com/100x100?text=耳机',
                price: '￥299',
                price_cents: 29900,
                quantity: 1,
                selected: true,
                storeId: 1,
                storeName: '数码专营店',
                stock: 50,
                attributes: {
                    color: '白色',
                    spec: '标准版'
                }
            },
            {
                id: 2,
                productId: 102,
                title: '智能手表 运动手环 心率监测',
                img: 'https://via.placeholder.com/100x100?text=手表',
                price: '￥899',
                price_cents: 89900,
                quantity: 2,
                selected: true,
                storeId: 1,
                storeName: '数码专营店',
                stock: 30,
                attributes: {
                    color: '黑色',
                    size: '42mm'
                }
            },
            {
                id: 3,
                productId: 103,
                title: '无线充电器 快充底座 支持多设备',
                img: 'https://via.placeholder.com/100x100?text=充电器',
                price: '￥159',
                price_cents: 15900,
                quantity: 1,
                selected: false,
                storeId: 2,
                storeName: '电子配件店',
                stock: 100,
                attributes: {
                    color: '银色'
                }
            }
        ],
        code: 200,
        message: 'success'
    })
}

// 添加商品到购物车
export function addToCart(params: AddToCartParams): Promise<ResponseData<{ success: boolean }>> {
    // 暂时注释掉 API 调用
    // return http.post('/cart/add', params)
    console.log('添加到购物车:', params)
    return Promise.resolve({
        data: { success: true },
        code: 200,
        message: '添加成功'
    })
}

// 更新购物车商品数量
export function updateCartItemQuantity(params: UpdateCartItemParams): Promise<ResponseData<{ success: boolean }>> {
    // 暂时注释掉 API 调用
    // return http.put('/cart/update', params)
    console.log('更新商品数量:', params)
    return Promise.resolve({
        data: { success: true },
        code: 200,
        message: '更新成功'
    })
}

// 删除购物车商品
export function removeCartItem(cartItemId: number): Promise<ResponseData<{ success: boolean }>> {
    // 暂时注释掉 API 调用
    // return http.delete(`/cart/remove/${cartItemId}`)
    console.log('删除购物车商品:', cartItemId)
    return Promise.resolve({
        data: { success: true },
        code: 200,
        message: '删除成功'
    })
}

// 批量删除购物车商品
export function removeCartItems(cartItemIds: number[]): Promise<ResponseData<{ success: boolean }>> {
    // 暂时注释掉 API 调用
    // return http.post('/cart/remove/batch', { ids: cartItemIds })
    console.log('批量删除购物车商品:', cartItemIds)
    return Promise.resolve({
        data: { success: true },
        code: 200,
        message: '删除成功'
    })
}

// 切换商品选中状态
export function toggleCartItemSelected(cartItemId: number, selected: boolean): Promise<ResponseData<{ success: boolean }>> {
    // 暂时注释掉 API 调用
    // return http.put('/cart/select', { cartItemId, selected })
    console.log('切换商品选中状态:', cartItemId, selected)
    return Promise.resolve({
        data: { success: true },
        code: 200,
        message: '更新成功'
    })
}

// 全选/取消全选
export function toggleAllCartItems(selected: boolean): Promise<ResponseData<{ success: boolean }>> {
    // 暂时注释掉 API 调用
    // return http.put('/cart/select/all', { selected })
    console.log('全选/取消全选:', selected)
    return Promise.resolve({
        data: { success: true },
        code: 200,
        message: '更新成功'
    })
}

// 获取购物车统计信息
export function getCartSummary(): Promise<ResponseData<CartSummary>> {
    // 暂时注释掉 API 调用
    // return http.get<CartSummary>('/cart/summary')
    return Promise.resolve({
        data: {
            totalItems: 4,
            totalPrice: 135700, // 以分为单位
            selectedItems: 3,
            selectedPrice: 119800
        },
        code: 200,
        message: 'success'
    })
}