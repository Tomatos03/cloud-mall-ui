import type { ResponseData } from '@/utils/http'

// 收藏项类型
export interface FavoriteItem {
    id: number
    title: string
    img?: string
    price?: string
    desc?: string
    storeName?: string
    addedAt?: string
}

// 获取收藏列表（静态数据）
export function fetchFavorites(): Promise<ResponseData<FavoriteItem[]>> {
    const data: FavoriteItem[] = [
        {
            id: 101,
            title: '轻薄透气运动鞋',
            img: 'https://via.placeholder.com/400x300?text=%E8%BF%90%E5%8A%A8%E9%9E%8B',
            price: '￥239',
            desc: '舒适透气的日常运动鞋',
            storeName: '官方旗舰店',
            addedAt: '2025-12-01',
        },
        {
            id: 102,
            title: '高保湿护手霜套装',
            img: 'https://via.placeholder.com/400x300?text=%E6%8A%A4%E6%89%8B%E9%9C%9C',
            price: '￥59',
            desc: '滋润不油腻，适合冬季使用',
            storeName: '美丽日记',
            addedAt: '2025-11-23',
        },
        {
            id: 103,
            title: '北欧简约台灯',
            img: 'https://via.placeholder.com/400x300?text=%E5%8F%B0%E7%81%AF',
            price: '￥129',
            desc: '柔光护眼，节能省电',
            storeName: '家居生活',
            addedAt: '2025-10-10',
        },
    ]

    return Promise.resolve({ code: 200, message: 'ok', data })
}

// 取消收藏（静态处理）
export function removeFavorite(id: number): Promise<ResponseData<{ success: boolean }>> {
    console.log('removeFavorite called, id=', id)
    return Promise.resolve({ code: 200, message: 'ok', data: { success: true } })
}
