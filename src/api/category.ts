import http from '@/utils/http'

// 分类类型定义
export interface Category {
    id: string
    name: string
    level: number
}

// 获取分类列表
export function fetchCategories() {
    return http.get<Category[]>('/category/list')
}
