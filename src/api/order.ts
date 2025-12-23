import http from '@/utils/http'


/**
 * 订单状态枚举
 */
export enum OrderStatus {
    /** 待支付 */
    PENDING_PAYMENT = 'pending_payment',
    /** 待发货 */
    PENDING_SHIPMENT = 'pending_shipment',
    /** 待收货 */
    PENDING_RECEIPT = 'pending_receipt',
    /** 待评价 */
    PENDING_REVIEW = 'pending_review',
    /** 待退款 */
    PENDING_REFUND = 'pending_refund',
    /** 已退款 */
    REFUNDED = 'refunded',
    /** 已取消 */
    CANCELLED = 'cancelled',
    /** 已完成 */
    COMPLETED = 'completed',
}

/**
 * 订单商品项
 */
export interface OrderItem {
    id: number
    /** 商品名称 */
    productName: string
    /** 商品图片 */
    productImage: string
    /** 商品数量 */
    quantity: number
    /** 单价 */
    price: number
    /** 规格/属性 */
    spec?: string
}

/**
 * 订单类型
 */
export interface Order {
    id: number
    /** 订单号 */
    orderNo: string
    /** 商品列表 */
    items: OrderItem[]
    /** 订单总价 */
    totalPrice: number
    /** 下单时间 */
    createTime: string
    /** 订单状态 */
    status: OrderStatus
    /** 订单状态文本 */
    statusText: string
    /** 收货人 */
    receiver: string
    /** 收货地址 */
    address: string
    /** 联系电话 */
    phone: string
}

/**
 * 订单列表查询参数
 */
export interface OrderQueryParams {
    /** 订单状态 */
    status?: OrderStatus | 'all'
    /** 搜索关键词 */
    keyword?: string
    /** 页码 */
    page?: number
    /** 每页数量 */
    pageSize?: number
}

/**
 * 获取订单列表
 */
export function fetchOrderList(params?: OrderQueryParams) {
    return http.get<Order[]>('/order/list', params as Record<string, unknown>)
}

/**
 * 获取订单详情
 */
export function fetchOrderDetail(orderNo: string) {
    return http.get<Order>(`/order/detail/${orderNo}`)
}

/**
 * 取消订单
 */
export function cancelOrder(orderNo: string) {
    return http.post(`/order/cancel`, { orderNo })
}

/**
 * 删除订单
 */
export function deleteOrder(orderNo: string) {
    return http.delete(`/order/delete/${orderNo}`)
}

/**
 * 确认收货
 */
export function confirmReceipt(orderNo: string) {
    return http.post(`/order/confirm`, { orderNo })
}

/**
 * 申请退款
 */
export function applyRefund(orderNo: string, reason: string) {
    return http.post(`/order/refund`, { orderNo, reason })
}

/**
 * 支付订单
 */
export function payOrder(orderNo: string, paymentMethod: string) {
    return http.post(`/order/pay`, { orderNo, paymentMethod })
}
