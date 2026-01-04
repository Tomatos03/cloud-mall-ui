import http from '@/utils/http'

/**
 * 创建评论 DTO
 */
export interface CreateCommentDTO {
    /**
     * 用户ID（必需）
     */
    userId: string | number

    /**
     * 订单明细ID（必需）
     */
    orderItemId: number

    /**
     * 订单号（必需）
     */
    orderNo: string

    /**
     * 商品ID（必需）
     */
    goodsId: number

    /**
     * 评分：1~5（必需）
     */
    rating: number

    /**
     * 评论内容（必需）
     */
    content: string

    /**
     * 评论图片，逗号分隔URL（可选）
     */
    images?: string

    /**
     * 是否匿名：0-否 1-是（可选，默认0）
     */
    isAnonymous?: number

    /**
     * 用户昵称（必需）
     */
    userName: string

    /**
     * 用户头像（必需）
     */
    userAvatar: string
}

/**
 * 商品评论视图对象 - 与后端 GoodsCommentVO 对应
 */
export interface GoodsCommentVO {
    /** 评论ID */
    id: number
    /** 订单明细ID */
    orderItemId: number
    /** 订单ID */
    orderId: number
    /** 商品ID */
    goodsId: number
    /** 商品名称 */
    goodsName: string
    /** 商品图片 */
    goodsImage: string
    /** 评论用户ID */
    userId: number
    /** 用户昵称 */
    userNickname: string
    /** 用户头像 */
    userAvatar: string
    /** 评分：1~5 */
    rating: number
    /** 评论内容 */
    content: string
    /** 商家回复 */
    reply: string
    /** 评论图片列表 */
    images: string[]
    /** 是否匿名：0-否 1-是 */
    isAnonymous: number
    /** 创建时间 */
    createTime: string
}

/**
 * 分页返回结果
 */
export interface PageResult<T> {
    records: T[]
    total: number
    size: number
    current: number
    pages: number
}

/**
 * 添加评论 - POST /web/comments/add
 * @param data 评论数据
 * @returns 是否成功
 */
export function addComment(data: CreateCommentDTO) {
    return http.post<boolean>('/comments/add', data)
}

/**
 * 获取商品评论列表 - GET /web/comments/goods/{goodsId}
 * @param goodsId 商品ID
 * @param page 页码
 * @param size 每页数量
 */
export function getCommentsByGoodsId(goodsId: string | number, page = 1, size = 10) {
    return http.get<PageResult<GoodsCommentVO>>(`/comments/goods/${goodsId}`, {
        page,
        size,
    })
}
