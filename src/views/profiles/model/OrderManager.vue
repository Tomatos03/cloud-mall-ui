<template>
    <div>
        <!-- 标签页导航 -->
        <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="custom-tabs">
            <el-tab-pane label="所有订单" name="all" />
            <el-tab-pane label="待支付" name="PENDING_PAYMENT" />
            <el-tab-pane label="待发货" name="PENDING_SHIPMENT" />
            <el-tab-pane label="待收货" name="SHIPPED" />
            <el-tab-pane label="已完成" name="COMPLETED" />
            <el-tab-pane label="已评价" name="RATED" />
            <el-tab-pane label="已退款" name="REFUNDED" />
            <el-tab-pane label="已取消" name="CANCELLED" />
        </el-tabs>

        <!-- 订单列表 -->
        <div class="p-6" v-loading="loading">
            <div v-if="orderList.length > 0" class="space-y-6">
                <div
                    v-for="order in orderList"
                    :key="order.orderId"
                    class="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 bg-white"
                >
                    <!-- 订单头部信息 -->
                    <div class="bg-gray-50/50 px-6 py-4 border-b border-gray-50">
                        <div class="mb-2">
                            <span class="text-gray-400 text-sm">
                                {{ getOrderTypeText(order) }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-6 text-sm">
                                <span class="text-gray-500">
                                    下单时间：<span class="text-gray-900 font-medium">{{
                                        order.createTime
                                    }}</span>
                                </span>
                                <span class="text-gray-500">
                                    订单号：<span class="text-gray-900 font-medium">{{
                                        order.orderNo
                                    }}</span>
                                </span>
                            </div>
                            <el-tag
                                :type="getOrderStatusTagType(order.status)"
                                effect="plain"
                                class="rounded-full! px-4! font-bold!"
                            >
                                {{ getOrderStatusText(order.status) }}
                            </el-tag>
                        </div>
                    </div>

                    <!-- 店铺订单列表 -->
                    <div
                        v-for="shopOrder in order.shopOrders"
                        :key="shopOrder.orderId"
                        class="border-b border-gray-50 last:border-b-0"
                    >
                        <!-- 店铺信息头部 -->
                        <div class="px-6 py-3 bg-gray-50/30 flex items-center justify-between">
                            <div class="flex items-center gap-2 text-sm">
                                <el-icon class="text-gray-400"><Shop /></el-icon>
                                <span
                                    class="text-gray-900 font-bold hover:text-orange-500 cursor-pointer transition-colors"
                                    @click="$router.push(`/store/${shopOrder.storeId}`)"
                                >
                                    {{ shopOrder.storeName }}
                                </span>
                            </div>
                            <el-tag
                                v-if="order.shopOrders.length > 1"
                                :type="getOrderStatusTagType(shopOrder.status)"
                                size="small"
                                effect="plain"
                                class="rounded-full!"
                            >
                                {{ getOrderStatusText(shopOrder.status) }}
                            </el-tag>
                        </div>

                        <!-- 商品列表 -->
                        <div class="p-6 space-y-3">
                            <div
                                v-for="item in shopOrder.items"
                                :key="item.id"
                                class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <!-- 商品图片 -->
                                <div
                                    class="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                    @click="$router.push(`/goods/${item.goodsId}`)"
                                >
                                    <img
                                        :src="item.goodsImg"
                                        :alt="item.goodsName"
                                        class="w-full h-full object-cover"
                                    />
                                </div>

                                <!-- 商品信息 -->
                                <div class="flex-1 min-w-0">
                                    <h4
                                        class="text-gray-900 font-bold hover:text-orange-500 cursor-pointer transition-colors mb-2"
                                        @click="$router.push(`/goods/${item.goodsId}`)"
                                    >
                                        {{ item.goodsName }}
                                    </h4>
                                    <div class="flex items-center gap-4 text-sm">
                                        <span class="text-gray-400">数量：{{ item.quantity }}</span>
                                        <span class="text-gray-400">单价：¥{{ formatPrice(item.goodsPrice) }}</span>
                                    </div>
                                </div>

                                <!-- 商品小计 -->
                                <div class="text-right shrink-0">
                                    <div class="text-orange-600 font-bold text-lg">
                                        ¥{{ formatPrice(item.totalPrice) }}
                                    </div>
                                </div>
                            </div>

                            <!-- 评价信息 -->
                            <div
                                v-if="isCommented(shopOrder)"
                                class="mt-4 p-4 bg-orange-50/30 rounded-xl border border-orange-100"
                            >
                                <div class="flex items-start gap-3">
                                    <el-icon class="mt-1 text-orange-400"><ChatDotRound /></el-icon>
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-2">
                                            <el-rate
                                                :model-value="shopOrder.rate || 0"
                                                disabled
                                                size="small"
                                                show-score
                                                text-color="#ff9900"
                                            />
                                        </div>
                                        <p class="text-gray-700 text-sm leading-relaxed mb-2">
                                            {{ shopOrder.comment }}
                                        </p>
                                        <p
                                            v-if="shopOrder.reply"
                                            class="text-orange-600 text-sm leading-relaxed pl-4 border-l-2 border-orange-300"
                                        >
                                            商家回复：{{ shopOrder.reply }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- 店铺订单操作栏 -->
                            <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div class="text-sm">
                                    <span class="text-gray-400">商品总数：</span>
                                    <span class="text-gray-900 font-bold">
                                        {{ calculateShopOrderItemCount(shopOrder) }}
                                    </span>
                                    <span class="text-gray-400 ml-4">小计：</span>
                                    <span class="text-orange-600 font-bold text-lg">
                                        ¥{{ formatPrice(calculateShopOrderTotal(shopOrder)) }}
                                    </span>
                                </div>

                                <div class="flex gap-2">
                                    <el-button
                                        v-if="canComment(shopOrder)"
                                        type="warning"
                                        size="small"
                                        class="rounded-xl! font-bold"
                                        @click="handleComment(shopOrder)"
                                    >
                                        去评价
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 订单总计与操作 -->
                    <div class="px-6 py-4 bg-gray-50/50 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <span class="text-gray-500 text-sm">订单总额：</span>
                            <span class="text-orange-600 font-black text-2xl">
                                ¥{{ formatPrice(calculateOrderTotalPrice(order)) }}
                            </span>
                        </div>
                        <!-- 待支付订单显示支付按钮 -->
                        <el-button
                            v-if="order.status === OrderStatus.PENDING_PAYMENT"
                            type="primary"
                            class="bg-orange-600! border-orange-600! hover:bg-orange-700! rounded-xl! font-bold px-8!"
                            @click="handlePayment(order)"
                        >
                            立即支付
                        </el-button>
                    </div>
                </div>
            </div>

            <!-- 分页 -->
            <div v-if="total > 0" class="flex justify-center mt-8">
                <el-pagination
                    v-model:current-page="pageNum"
                    v-model:page-size="pageSize"
                    :total="total"
                    :page-sizes="[10, 20, 30, 50]"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="loadOrderList"
                    @current-change="loadOrderList"
                    class="custom-pagination"
                />
            </div>

            <!-- 空状态 -->
            <div v-else-if="!loading" class="flex flex-col items-center justify-center py-32">
                <div
                    class="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6"
                >
                    <el-icon class="text-5xl text-gray-200">
                        <Document />
                    </el-icon>
                </div>
                <p class="text-gray-400 text-lg mb-6">暂无相关订单信息</p>
                <el-button
                    type="primary"
                    plain
                    class="border-orange-500! text-orange-500! hover:bg-orange-50! rounded-xl! px-8"
                    @click="$router.push('/')"
                >
                    去逛逛
                </el-button>
            </div>
        </div>

        <!-- 评价对话框 -->
        <el-dialog
            v-model="commentDialogVisible"
            title="订单评价"
            width="500px"
            :close-on-click-modal="false"
        >
            <el-form :model="commentForm" label-width="80px">
                <el-form-item label="评分">
                    <el-rate v-model="commentForm.rate" show-score text-color="#ff9900" />
                </el-form-item>
                <el-form-item label="评价内容">
                    <el-input
                        v-model="commentForm.comment"
                        type="textarea"
                        :rows="5"
                        placeholder="请输入您的评价内容"
                        maxlength="500"
                        show-word-limit
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="commentDialogVisible = false">取消</el-button>
                <el-button
                    type="primary"
                    @click="submitComment"
                    :loading="commentLoading"
                    class="bg-orange-500! border-orange-500! hover:bg-orange-600!"
                >
                    提交评价
                </el-button>
            </template>
        </el-dialog>

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
    import { ElMessage } from 'element-plus'
    import { Document, Shop, ChatDotRound } from '@element-plus/icons-vue'
    import PaymentModal from '@/views/goods/model/PaymentModal.vue'
    import {
        OrderStatus,
        OrderType,
        type OrderAggregateVO,
        type ShopOrderVO,
        pageQueryOrders,
        commentOrder,
        getOrderStatusText,
        getOrderStatusTagType,
        getOrderType,
        calculateOrderTotalPrice,
        calculateShopOrderTotal,
        calculateShopOrderItemCount,
        formatPrice,
        canComment,
        isCommented,
    } from '@/api/order'

    const activeTab = ref('all')
    const orderList = ref<OrderAggregateVO[]>([])
    const loading = ref(false)
    const pageNum = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    // 评价相关
    const commentDialogVisible = ref(false)
    const commentLoading = ref(false)
    const currentShopOrder = ref<ShopOrderVO | null>(null)
    const commentForm = ref({
        rate: 5,
        comment: '',
    })

    // 支付相关
    const paymentModalVisible = ref(false)
    const paymentOrderNo = ref('')
    const paymentAmount = ref(0)
    const paymentQuantity = ref(0)
    const currentPaymentOrder = ref<OrderAggregateVO | null>(null)

    /**
     * 获取订单类型文本
     */
    const getOrderTypeText = (order: OrderAggregateVO): string => {
        const orderType = getOrderType(order)
        return orderType === OrderType.PARENT ? '多店铺订单' : '单店铺订单'
    }

    /**
     * 加载订单列表
     */
    const loadOrderList = async () => {
        loading.value = true
        try {
            // 构建查询参数
            const params: any = {
                pageNum: pageNum.value,
                pageSize: pageSize.value,
            }

            // 只有选择具体状态时才添加 status 参数
            if (activeTab.value !== 'all') {
                params.status = activeTab.value
            }

            const res = await pageQueryOrders(params)

            if (res && res.data) {
                orderList.value = res.data.records || []
                total.value = res.data.total || 0
            }
        } finally {
            loading.value = false
        }
    }

    /**
     * 切换标签页
     */
    const handleTabChange = () => {
        pageNum.value = 1
        loadOrderList()
    }

    /**
     * 打开评价对话框
     */
    const handleComment = (shopOrder: ShopOrderVO) => {
        currentShopOrder.value = shopOrder
        commentForm.value = {
            rate: shopOrder.rate || 5,
            comment: shopOrder.comment || '',
        }
        commentDialogVisible.value = true
    }

    /**
     * 提交评价
     */
    const submitComment = async () => {
        if (!currentShopOrder.value) return

        if (!commentForm.value.comment.trim()) {
            ElMessage.warning('请输入评价内容')
            return
        }

        commentLoading.value = true
        try {
            const res = await commentOrder(
                currentShopOrder.value.orderId,
                commentForm.value.rate,
                commentForm.value.comment
            )

            if (res && res.data) {
                ElMessage.success('评价成功')
                commentDialogVisible.value = false
                await loadOrderList()
            }
        } finally {
            commentLoading.value = false
        }
    }

    /**
     * 处理支付
     */
    const handlePayment = (order: OrderAggregateVO) => {
        currentPaymentOrder.value = order
        paymentOrderNo.value = order.orderNo
        paymentAmount.value = calculateOrderTotalPrice(order) / 100 // 分转元

        // 计算商品总数量
        paymentQuantity.value = order.shopOrders.reduce((total, shopOrder) => {
            return total + calculateShopOrderItemCount(shopOrder)
        }, 0)

        paymentModalVisible.value = true
    }

    /**
     * 支付成功回调
     */
    const handlePaymentSuccess = async (orderNo: string) => {
        ElMessage.success('支付成功！订单状态将自动更新')

        // 延迟关闭弹窗并刷新订单列表
        setTimeout(() => {
            paymentModalVisible.value = false
            loadOrderList()
        }, 1500)
    }

    onMounted(() => {
        loadOrderList()
    })
</script>

<style scoped>
    :deep(.custom-tabs .el-tabs__header) {
        margin: 0;
        padding: 0 32px;
        border-bottom: 1px solid #f9fafb;
    }

    :deep(.custom-tabs .el-tabs__nav-wrap::after) {
        display: none;
    }

    :deep(.custom-tabs .el-tabs__item) {
        height: 64px;
        font-size: 15px;
        font-weight: 700;
        color: #9ca3af;
    }

    :deep(.custom-tabs .el-tabs__item.is-active) {
        color: #f97316;
    }

    :deep(.custom-tabs .el-tabs__active-bar) {
        background-color: #f97316;
        height: 3px;
        border-radius: 3px;
    }

    :deep(.custom-pagination) {
        justify-content: center;
    }

    :deep(.custom-pagination .el-pagination__total),
    :deep(.custom-pagination .el-pagination__jump) {
        color: #6b7280;
    }

    :deep(.custom-pagination .el-pager li.is-active) {
        background-color: #f97316;
        color: white;
    }

    :deep(.custom-pagination .el-pager li:hover) {
        color: #f97316;
    }
</style>
