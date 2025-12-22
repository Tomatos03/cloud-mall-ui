import type { ResponseData } from '@/utils/http'

// 商店信息类型
export interface StoreItem {
    id: number
    name: string
    description: string
    avatar: string
    coverImage?: string
    address?: string
    phone?: string
    rating?: number
    followerCount?: number
    productCount?: number
}

// 商店商品类型（扩展 ProductItem）
export interface StoreProductItem {
    id: number
    title: string
    img?: string
    price?: string
    price_cents?: number
    desc?: string
    storeId: number
    category?: string
    stock?: number
    sales?: number
}

// 获取商店信息
export function fetchStoreInfo(storeId: string | number): Promise<ResponseData<StoreItem>> {
    // 暂时注释掉 API 调用，使用静态数据
    // return http.get<StoreItem>(`/store/${storeId}`)
    return Promise.resolve({
        data: {
            id: Number(storeId),
            name: '示例商店',
            description: '这是一个示例商店，提供各种优质商品。',
            avatar: '/default-store-avatar.png',
            coverImage: '/default-store-cover.png',
            address: '北京市朝阳区',
            phone: '13800138000',
            rating: 4.5,
            followerCount: 1234,
            productCount: 56,
        },
        code: 200,
        message: 'success',
    })
}

// 获取商店商品列表
export function fetchStoreProducts(storeId: string | number): Promise<ResponseData<StoreProductItem[]>> {
    // 暂时注释掉 API 调用，使用静态数据
    // return http.get<StoreProductItem[]>(`/store/${storeId}/products`)
    return Promise.resolve({
        data: [
            {
                id: 1,
                title: '示例商品1',
                img: 'https://example.com/image1.jpg',
                price: '￥99',
                price_cents: 9900,
                desc: '商品描述1',
                storeId: Number(storeId),
                category: '电子产品',
                stock: 100,
                sales: 50,
            },
            {
                id: 2,
                title: '示例商品2',
                img: 'https://example.com/image2.jpg',
                price: '￥199',
                price_cents: 19900,
                desc: '商品描述2',
                storeId: Number(storeId),
                category: '服装',
                stock: 200,
                sales: 80,
            },
            // 可以添加更多静态数据
        ],
        code: 200,
        message: 'success',
    })
}