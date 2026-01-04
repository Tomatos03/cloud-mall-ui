import http from '@/utils/http'

/**
 * 订单状态枚举 - 与后端保持一致
 */
export enum OrderStatus {
    /** 待支付 */
    CREATED = 'CREATED',
    /** 待发货 */
    PAID = 'PAID',
    /** 待收货 */
    SHIPPED = 'SHIPPED',
    /** 已完成 */
    FINISHED = 'FINISHED',
    /** 已取消 */
    CANCELED = 'CANCELED',
    /** 已关闭 */
    CLOSED = 'CLOSED',
}

/**
 * 订单类型枚举（前端计算）
 */
export enum OrderType {
    /** 父订单（多店铺） */
    PARENT = 'PARENT',
    /** 普通订单（单店铺） */
    NORMAL = 'NORMAL',
}

/**
 * 购物车类型枚举
 */
export enum CartType {
    /** 立即购买 */
    INSTANT_BUY = 'INSTANT_BUY',
    /** 普通购物车 */
    NORMAL = 'NORMAL',
}

/**
 * 分页结果定义
 */
export interface PageResult<T> {
    /** 当前页数据 */
    records: T[]
    /** 总条数 */
    total: number
    /** 当前页码 */
    current: number
    /** 每页数量 */
    size: number
    /** 总页数 */
    pages: number
}

/**
 * 订单项（商品明细） - 与后端 OrderItem 对应
 */
export interface OrderItem {
    /** 订单项ID */
    id: string
    /** 商品ID */
    goodsId: string
    /** 商品名称快照 */
    goodsName: string
    /** 商品图片快照 */
    goodsImg: string
    /** 下单时商品单价（单位：分） */
    goodsPrice: number
    goodsPriceText: string // 商品单价文本，单位：元
    /** 购买数量 */
    quantity: number
    /** 明细小计（单位：分） */
    totalPrice: number
    totalPriceText: string // 明细小计文本，单位：元
    /** 评价状态：0-未评价，1-已评价 */
    commentStatus: number
    /** 创建时间 */
    createTime: string
}

/**
 * 店铺订单视图 - 与后端 storeOrderVO 对应
 */
export interface StoreOrderVO {
  /** 子订单号 */
  orderNo: string
  /** 店铺ID */
  storeId: string
  /** 店铺名称 */
  storeName: string
  /** 子订单状态 */
  status: OrderStatus
  /** 商品明细列表 */
  items: OrderItem[]
  totalPrice: number // 总金额，单位：分
  totalPriceText: string // 总金额文本，单位：元
  count: number // 订单商品总数量
}

/**
 * 订单聚合视图 - 与后端 OrderAggregateVO 对应
 */
export interface OrderAggregateVO {
    /** 订单ID */
    orderId: string
    /** 订单号（父订单号或普通订单号） */
    orderNo: string
    /** 订单状态 */
    status: OrderStatus
    /** 订单创建时间（格式：yyyy-MM-dd HH:mm:ss） */
    createTime: string
    /** 店铺订单列表（多店铺订单包含多个，单店铺订单只有1个） */
    storeOrders: StoreOrderVO[]
    totalPrice: number // 总金额，单位：分
    totalPriceText: string // 总金额文本，单位：元
    count: number // 订单商品总数量
}

/**
 * 商品项 - 与后端 TradeShopItemDTO 对应
 */
export interface TradeShopItem {
    /** 商品ID */
    goodsId: string
    /** 购买数量 */
    quantity: number
}

/**
 * 店铺交易数据 - 与后端 TradeShopDTO 对应
 */
export interface TradeShop {
    /** 店铺ID */
    storeId: string
    /** 该店铺的商品列表 */
    tradeShopItemList: TradeShopItem[]
}

/**
 * 下单参数 - 与后端 TradeDTO 对应
 */
export interface TradeDTO {
    /** 收货地址ID */
    addressId: string
    /** 交易店铺列表 */
    tradeItems: TradeShop[]
}

/**
 * 创建订单响应
 */
export interface CreateOrderResponse {
    /** 订单编号 */
    orderNo: string
}

/**
 * 创建订单 - POST /web/order/create/{cartType}
 * @param data 下单参数
 * @param cartType 购物车类型（instant_buy: 立即购买, normal: 购物车购买）
 * @returns 订单创建响应
 */
export function createOrder(data: TradeDTO, cartType: CartType = CartType.INSTANT_BUY) {
    return http.post<CreateOrderResponse>(`/order/create/${cartType}`, data)
}

/**
 * 创建立即购买订单的辅助函数
 * @param addressId 收货地址ID
 * @param storeId 店铺ID
 * @param goodsId 商品ID
 * @param quantity 购买数量
 * @returns 订单创建响应
 */
export function createInstantBuyOrder(
    addressId: string,
    storeId: string,
    goodsId: string,
    quantity: number
) {
    const data: TradeDTO = {
        addressId,
        tradeItems: [
            {
                storeId,
                tradeShopItemList: [
                    {
                        goodsId,
                        quantity,
                    },
                ],
            },
        ],
    }
    return createOrder(data, CartType.INSTANT_BUY)
}

/**
 * 创建购物车订单的辅助函数
 * @param addressId 收货地址ID
 * @param cartItems 购物车商品数据，Map<店铺ID, 商品列表>
 * @returns 订单创建响应
 */
export function createCartOrder(
    addressId: string,
    cartItems: Map<string, TradeShopItem[]>
) {
    const tradeItems: TradeShop[] = Array.from(cartItems.entries()).map(
        ([storeId, items]) => ({
            storeId,
            tradeShopItemList: items,
        })
    )

    const data: TradeDTO = {
        addressId,
        tradeItems,
    }
    return createOrder(data, CartType.NORMAL)
}

/**
 * 分页查询订单 - GET /web/order/page
 * 返回订单聚合视图，包含店铺订单和商品明细
 * @param params 分页查询参数
 * @returns 订单聚合视图分页结果
 */

 /**
  * 分页查询订单 - GET /web/order/page
  * 返回订单聚合视图，包含店铺订单和商品明细
  * @param params 分页查询参数
  * @returns 订单聚合视图分页结果
  */
 export async function pageQueryOrders(params: Record<string, unknown> = {}) {
     return http.get<PageResult<OrderAggregateVO>>('/order/page', params)
 }

/**
 * 确认收货 - POST /order/receive
 * @param orderNo 子订单号
 * @returns 是否成功
 */
export function receiveOrder(orderNo: string) {
    return http.post<boolean>(`/order/confirm/${orderNo}`)
}

/**
 * 评价订单 - POST /order/comment
 * @param orderId 子订单ID
 * @param rate 评分 1-5
 * @param comment 评价内容
 * @returns 是否成功
 */
export function commentOrder(orderId: string, rate: number, comment: string) {
    return http.post<boolean>('/order/comment', {
        orderId,
        rate,
        comment,
    })
}

/**
 * 订单回复 - POST /order/reply
 * @param orderId 订单ID
 * @param reply 回复内容
 * @returns 是否成功
 */
export function replyOrder(orderId: string, reply: string) {
    return http.post<boolean>('/order/reply', {
        orderId,
        reply,
    })
}

/**
 * 查询订单支付状态 - GET /web/order/payment/status
 * @param orderNo 订单号
 * @returns 订单是否支付成功
 */
export function getPaymentStatus(orderNo: string) {
    return http.get<boolean>('/order/payment/status', {
        orderNo,
    })
}

/**
 * 获取订单状态文本
 * @param status 订单状态
 * @returns 状态文本
 */
export function getOrderStatusText(status: OrderStatus): string {
  const statusTextMap: Record<OrderStatus, string> = {
    [OrderStatus.CREATED]: '待支付',
    [OrderStatus.PAID]: '待发货',
    [OrderStatus.SHIPPED]: '待收货',
    [OrderStatus.FINISHED]: '已完成',
    [OrderStatus.CANCELED]: '已取消',
    [OrderStatus.CLOSED]: '已关闭',
  }
  return statusTextMap[status] || '未知状态'
}

/**
 * 获取订单状态标签类型
 * @param status 订单状态
 * @returns Element Plus 标签类型
 */
export function getOrderStatusTagType(status: OrderStatus): string {
    const typeMap: Record<OrderStatus, string> = {
        [OrderStatus.CREATED]: 'danger',
        [OrderStatus.PAID]: 'warning',
        [OrderStatus.SHIPPED]: 'primary',
        [OrderStatus.FINISHED]: 'success',
        [OrderStatus.CANCELED]: 'info',
        [OrderStatus.CLOSED]: 'info',
    }
    return typeMap[status] || ''
}

/**
 * 判断子订单是否有效（可支付/可计算金额）
 * @param storeOrder 店铺订单
 * @returns 是否有效
 */
export function isstoreOrderValid(storeOrder: StoreOrderVO): boolean {
    // 排除已取消和已关闭的子订单
    return storeOrder.status !== OrderStatus.CANCELED && storeOrder.status !== OrderStatus.CLOSED
}


/**
 * 判断是否是聚合订单
 */
export function isParentOrder(orderNo: string): boolean {
    return orderNo.startsWith('P')
}
