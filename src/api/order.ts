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
 * 订单项（商品明细） - 与后端 OrderItem 对应
 */
export interface OrderItem {
    /** 订单项ID */
    id: number
    /** 所属订单ID */
    orderId: number
    /** 商品ID */
    goodsId: number
    /** 商品名称快照 */
    goodsName: string
    /** 商品图片快照 */
    goodsImg: string
    /** 下单时商品单价（单位：分） */
    goodsPrice: number
    /** 购买数量 */
    quantity: number
    /** 明细小计（单位：分） */
    totalPrice: number
    /** 创建时间 */
    createTime: string
}

/**
 * 店铺订单视图 - 与后端 ShopOrderVO 对应
 */
export interface ShopOrderVO {
    /** 子订单ID */
    orderId: number
    /** 子订单号 */
    orderNo: string
    /** 店铺ID */
    storeId: number
    /** 店铺名称 */
    storeName: string
    /** 子订单状态 */
    status: OrderStatus
    /** 商品明细列表 */
    items: OrderItem[]
    /** 评分（1-5分），未评价为null */
    rate?: number | null
    /** 评价内容，未评价为null */
    comment?: string | null
    /** 商家回复，未回复为null */
    reply?: string | null
}

/**
 * 订单聚合视图 - 与后端 OrderAggregateVO 对应
 */
export interface OrderAggregateVO {
    /** 订单ID */
    orderId: number
    /** 订单号（父订单号或普通订单号） */
    orderNo: string
    /** 订单状态 */
    status: OrderStatus
    /** 订单创建时间（格式：yyyy-MM-dd HH:mm:ss） */
    createTime: string
    /** 店铺订单列表（多店铺订单包含多个，单店铺订单只有1个） */
    shopOrders: ShopOrderVO[]
}

/**
 * 订单分页查询参数 - 与后端接口参数对应
 */
export interface OrderPageParams {
    /** 页码（从1开始，默认1） */
    pageNum?: number
    /** 每页数量（默认10） */
    pageSize?: number
    /** 订单号（模糊查询） */
    orderNo?: string
    /** 订单状态（精确匹配） */
    status?: OrderStatus | string
    /** 开始时间（格式：yyyy-MM-dd HH:mm:ss） */
    startTime?: string
    /** 结束时间（格式：yyyy-MM-dd HH:mm:ss） */
    endTime?: string
}

/**
 * 分页返回结果 - 与后端 Page 对象对应
 */
export interface PageResult<T> {
    /** 数据列表 */
    records: T[]
    /** 总记录数 */
    total: number
    /** 每页数量 */
    size: number
    /** 当前页码 */
    current: number
    /** 总页数 */
    pages: number
}

/**
 * 商品项 - 与后端 TradeShopItemDTO 对应
 */
export interface TradeShopItem {
    /** 商品ID */
    goodsId: number
    /** 购买数量 */
    quantity: number
}

/**
 * 店铺交易数据 - 与后端 TradeShopDTO 对应
 */
export interface TradeShop {
    /** 店铺ID */
    storeId: number
    /** 该店铺的商品列表 */
    tradeShopItemList: TradeShopItem[]
}

/**
 * 下单参数 - 与后端 TradeDTO 对应
 */
export interface TradeDTO {
    /** 收货地址ID */
    addressId: number
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
    addressId: number,
    storeId: number,
    goodsId: number,
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
    addressId: number,
    cartItems: Map<number, TradeShopItem[]>
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
export async function pageQueryOrders(params: OrderPageParams = {}) {
    const res = await http.get<PageResult<OrderAggregateVO>>('/order/page', params)

    // 转换数据类型
    if (res && res.data && res.data.records) {
        res.data.records = res.data.records.map(convertOrderAggregateVO)
        res.data.total = Number(res.data.total)
        res.data.size = Number(res.data.size)
        res.data.current = Number(res.data.current)
        res.data.pages = Number(res.data.pages)
    }

    return res
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
export function commentOrder(orderId: number, rate: number, comment: string) {
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
export function replyOrder(orderId: number, reply: string) {
    return http.post<boolean>('/order/reply', {
        orderId,
        reply,
    })
}

/**
 * 转换订单项数据，将字符串类型的数字字段转换为 number
 * @param item 订单项原始数据
 * @returns 转换后的订单项
 */
function convertOrderItem(item: any): OrderItem {
    return {
        ...item,
        id: Number(item.id),
        orderId: Number(item.orderId),
        goodsId: Number(item.goodsId),
        goodsPrice: Number(item.goodsPrice),
        quantity: Number(item.quantity),
        totalPrice: Number(item.totalPrice),
    }
}

/**
 * 转换店铺订单数据，将字符串类型的数字字段转换为 number
 * @param shopOrder 店铺订单原始数据
 * @returns 转换后的店铺订单
 */
function convertShopOrder(shopOrder: any): ShopOrderVO {
    return {
        ...shopOrder,
        orderId: Number(shopOrder.orderId),
        storeId: Number(shopOrder.storeId),
        items: shopOrder.items?.map(convertOrderItem) || [],
        rate: shopOrder.rate !== null && shopOrder.rate !== undefined ? Number(shopOrder.rate) : null,
    }
}

/**
 * 转换订单聚合视图数据，将字符串类型的数字字段转换为 number
 * @param order 订单聚合视图原始数据
 * @returns 转换后的订单聚合视图
 */
function convertOrderAggregateVO(order: any): OrderAggregateVO {
    return {
        ...order,
        orderId: Number(order.orderId),
        shopOrders: order.shopOrders?.map(convertShopOrder) || [],
    }
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
 * @param shopOrder 店铺订单
 * @returns 是否有效
 */
export function isShopOrderValid(shopOrder: ShopOrderVO): boolean {
    // 排除已取消和已关闭的子订单
    return shopOrder.status !== OrderStatus.CANCELED && shopOrder.status !== OrderStatus.CLOSED
}

/**
 * 判断订单类型（前端计算）
 * @param orderAggregateVO 订单聚合视图
 * @returns 订单类型
 */
export function getOrderType(orderAggregateVO: OrderAggregateVO): OrderType {
    return orderAggregateVO.shopOrders.length > 1 ? OrderType.PARENT : OrderType.NORMAL
}

/**
 * 计算订单总价（前端计算）- 排除已取消/已关闭的子订单
 * @param orderAggregateVO 订单聚合视图
 * @returns 订单总价（单位：分）
 */
export function calculateOrderTotalPrice(orderAggregateVO: OrderAggregateVO): number {
    return orderAggregateVO.shopOrders
        .filter(isShopOrderValid) // 只计算有效的子订单
        .reduce((sum, shopOrder) => {
            const shopTotal = shopOrder.items.reduce((itemSum, item) => {
                return itemSum + item.totalPrice
            }, 0)
            return sum + shopTotal
        }, 0)
}

/**
 * 计算店铺订单小计（前端计算）
 * @param shopOrder 店铺订单
 * @returns 店铺订单小计（单位：分）
 */
export function calculateShopOrderTotal(shopOrder: ShopOrderVO): number {
    return shopOrder.items.reduce((sum, item) => {
        return sum + item.totalPrice
    }, 0)
}

/**
 * 计算订单商品项总数（前端计算）- 排除已取消/已关闭的子订单
 * @param orderAggregateVO 订单聚合视图
 * @returns 商品项总数
 */
export function calculateOrderItemCount(orderAggregateVO: OrderAggregateVO): number {
    return orderAggregateVO.shopOrders
        .filter(isShopOrderValid) // 只计算有效的子订单
        .reduce((count, shopOrder) => {
            return count + shopOrder.items.length
        }, 0)
}

/**
 * 计算店铺订单商品项总数（前端计算）
 * @param shopOrder 店铺订单
 * @returns 商品项总数
 */
export function calculateShopOrderItemCount(shopOrder: ShopOrderVO): number {
    return shopOrder.items.reduce((count, item) => {
        return count + item.quantity
    }, 0)
}

/**
 * 获取订单有效子订单列表（排除已取消/已关闭）
 * @param orderAggregateVO 订单聚合视图
 * @returns 有效的子订单列表
 */
export function getValidShopOrders(orderAggregateVO: OrderAggregateVO): ShopOrderVO[] {
    return orderAggregateVO.shopOrders.filter(isShopOrderValid)
}

/**
 * 获取订单无效子订单列表（已取消/已关闭）
 * @param orderAggregateVO 订单聚合视图
 * @returns 无效的子订单列表
 */
export function getInvalidShopOrders(orderAggregateVO: OrderAggregateVO): ShopOrderVO[] {
    return orderAggregateVO.shopOrders.filter(shopOrder => !isShopOrderValid(shopOrder))
}

/**
 * 格式化金额（分转元）
 * @param price 金额（单位：分）
 * @returns 格式化后的金额字符串（保留2位小数）
 */
export function formatPrice(price: number): string {
    return (price / 100).toFixed(2)
}

/**
 * 格式化时间
 * @param timeStr 时间字符串（格式：yyyy-MM-dd HH:mm:ss）
 * @returns 格式化后的时间字符串
 */
export function formatTime(timeStr: string): string {
    // 后端返回的时间格式已经是 yyyy-MM-dd HH:mm:ss，直接返回
    return timeStr
}

/**
 * 判断订单是否可以评价
 * @param shopOrder 店铺订单
 * @returns 是否可以评价
 */
export function canComment(shopOrder: ShopOrderVO): boolean {
    return (shopOrder.status === OrderStatus.FINISHED || shopOrder.status === OrderStatus.CLOSED) && !shopOrder.comment
}

/**
 * 判断订单是否已评价
 * @param shopOrder 店铺订单
 * @returns 是否已评价
 */
export function isCommented(shopOrder: ShopOrderVO): boolean {
    return shopOrder.rate !== null && shopOrder.rate !== undefined
}
