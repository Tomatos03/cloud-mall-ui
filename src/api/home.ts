import http from '@/utils/http'

// Banner 列表项类型
export interface Banner {
    imageUrl: string
    goodsId: string
}

export interface CategoryItem {
    id: string
    name: string
    level: number
    parentId: string
}

export interface NoticeItem {
    id: string
    content: string
}

export function fetchBanner() {
    return http.get<Banner[]>('/banner')
}

export function fetchCategory() {
    return http.get<CategoryItem[]>('/category/list')
}

export function fetchNotice() {
    return http.get<NoticeItem[]>('/common/notice')
}
