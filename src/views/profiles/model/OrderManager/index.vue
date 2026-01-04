<template>
    <div>
        <!-- 标签页导航 -->
        <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="custom-tabs">
            <el-tab-pane label="所有订单" name="all" />
            <el-tab-pane label="待支付" name="CREATED" />
            <el-tab-pane label="待发货" name="PAID" />
            <el-tab-pane label="待收货" name="SHIPPED" />
            <el-tab-pane label="已完成" name="FINISHED" />
            <el-tab-pane label="已取消" name="CANCELED" />
            <el-tab-pane label="已关闭" name="CLOSED" />
        </el-tabs>

        <!-- 订单列表 -->
        <OrderList
            :orders="filteredOrders"
            :loading="loading"
            @comment="handleComment"
            @payment="handlePayment"
            @receive="handleReceive"
        />

        <!-- 分页 -->
        <OrderPagination
            v-if="total > 0 && filteredOrders.length > 0"
            v-model:page-num="pageNum"
            v-model:page-size="pageSize"
            :total="total"
            @change="loadOrderList"
        />

        <!-- 空状态 -->
        <OrderEmpty v-if="!loading && filteredOrders.length === 0" />

        <!-- 商品评价表单组件 -->
        <CommentFormDialog
            v-model:visible="commentDialogVisible"
            :order-no="currentShopOrder?.orderNo || ''"
            :goods="currentCommentGoods"
            @success="handleCommentSuccess"
        />

        <!-- 支付弹窗 -->
        <PaymentModal
            v-model:visible="paymentModalVisible"
            :amount="paymentAmount"
            :order-no="paymentOrderNo"
            :quantity="paymentQuantity"
            @success="handlePaymentSuccess"
        />
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import PaymentModal from '@/views/goods/model/PaymentModal.vue'
    import CommentFormDialog from '../CommentFormDialog.vue'
    import OrderList from './OrderList.vue'
    import OrderPagination from './OrderPagination.vue'
    import OrderEmpty from './OrderEmpty.vue'
    import {
        OrderStatus,
        type OrderAggregateVO,
        type OrderItem,
        type StoreOrderVO,
        pageQueryOrders,
        receiveOrder,
    } from '@/api/order'

    // CommentFormDialog 定义的 GoodsItem 类型
    interface CommentGoodsItem {
        id: number
        goodsId: number
        goodsName: string
        goodsImg: string
        goodsPrice: number
        quantity: number
        totalPrice: number
    }

    // 标签页类型：'all' 或 订单状态枚举
    type TabType = 'all' | OrderStatus

    const activeTab = ref<TabType>('all')
    const orderList = ref<OrderAggregateVO[]>([])
    const loading = ref(false)
    const pageNum = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    /**
     * 过滤后的订单列表
     * 当处于特定状态标签页时，仅展示该状态的子订单
     * 如果聚合订单下没有符合状态的子订单，则不展示该聚合订单
     */
    const filteredOrders = computed(() => {
        if (activeTab.value === 'all') {
            return orderList.value.map((order) => ({ ...order, isPartial: false }))
        }
        return orderList.value
            .map((order) => {
                const filteredShops = order.storeOrders.filter((shop) => shop.status === activeTab.value)
                return {
                    ...order,
                    shopOrders: filteredShops,
                    isPartial: filteredShops.length < order.storeOrders.length,
                }
            })
            .filter((order) => order.shopOrders.length > 0) as (OrderAggregateVO & { isPartial: boolean })[]
    })

    // 评价相关
    const commentDialogVisible = ref(false)
    const currentShopOrder = ref<StoreOrderVO | null>(null)
    const currentCommentGoods = ref<CommentGoodsItem>({
        id: 0,
        goodsId: 0,
        goodsName: '',
        goodsImg: '',
        goodsPrice: 0,
        quantity: 0,
        totalPrice: 0,
    })

    // 支付相关
    const paymentModalVisible = ref(false)
    const paymentOrderNo = ref('')
    const paymentAmount = ref('0')
    const paymentQuantity = ref(0)
    const currentPaymentOrder = ref<OrderAggregateVO | null>(null)

    /**
     * 加载订单列表
     */
    const loadOrderList = async (): Promise<void> => {
        loading.value = true
        try {
            const res = await pageQueryOrders({
                pageNum: pageNum.value,
                pageSize: pageSize.value,
                ...(activeTab.value !== 'all' && { status: activeTab.value }),
            })
            orderList.value = res.data.records
            total.value = res.data.total
        } finally {
            loading.value = false
        }
    }

    /**
     * 切换标签页
     */
    const handleTabChange = (): void => {
        pageNum.value = 1
        loadOrderList()
    }

    /**
     * 打开评价对话框
     */
    const handleComment = (shopOrder: StoreOrderVO, item: OrderItem): void => {
        currentShopOrder.value = shopOrder
        // 将 OrderItem 转换为 CommentGoodsItem
        currentCommentGoods.value = {
            id: Number(item.id),
            goodsId: Number(item.goodsId),
            goodsName: item.goodsName,
            goodsImg: item.goodsImg,
            goodsPrice: item.goodsPrice,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
        }
        commentDialogVisible.value = true
    }

    /**
     * 评价成功回调
     */
    const handleCommentSuccess = async (): Promise<void> => {
        currentShopOrder.value = null
        commentDialogVisible.value = false
        await loadOrderList()
    }

    /**
     * 处理支付
     */
    const handlePayment = (order: OrderAggregateVO): void => {
        currentPaymentOrder.value = order
        paymentOrderNo.value = order.orderNo
        paymentAmount.value = order.totalPriceText
        paymentQuantity.value = order.count

        paymentModalVisible.value = true
    }


    /**
     * 支付成功回调
     */
    const handlePaymentSuccess = async (): Promise<void> => {
        setTimeout(() => {
            paymentModalVisible.value = false
            currentPaymentOrder.value = null
            loadOrderList()
        }, 1000)
    }

    /**
     * 处理收货
     */
    const handleReceive = async (orderNo: string): Promise<void> => {
        try {
            await ElMessageBox.confirm('确认已收到货物吗？', '确认收货', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            })
            await receiveOrder(orderNo)
            ElMessage.success('收货成功')
            await loadOrderList()
        } catch {
            // 取消或失败
        }
    }

    onMounted(() => {
        loadOrderList()
    })
</script>

<style scoped>
    :deep(.custom-tabs .el-tabs__header) {
        border-bottom: 2px solid #f3f4f6;
        margin-bottom: 0;
    }

    :deep(.custom-tabs .el-tabs__nav-wrap::after) {
        display: none;
    }

    :deep(.custom-tabs .el-tabs__item) {
        color: #9ca3af;
        font-weight: 500;
    }

    :deep(.custom-tabs .el-tabs__item.is-active) {
        color: #ff8900;
    }

    :deep(.custom-tabs .el-tabs__active-bar) {
        background-color: #ff8900;
        height: 3px;
        bottom: -2px;
    }

    :deep(.custom-pagination) {
        text-align: center;
    }

    :deep(.custom-pagination .el-pagination__total),
    :deep(.custom-pagination .el-pagination__jump) {
        color: #9ca3af;
    }

    :deep(.custom-pagination .el-pager li.is-active) {
        color: #ff8900;
        font-weight: bold;
    }

    :deep(.custom-pagination .el-pager li:hover) {
        color: #ff8900;
    }
</style>
