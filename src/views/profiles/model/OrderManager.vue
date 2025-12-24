<template>
    <div>
        <!-- 标签页导航 -->
        <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="custom-tabs">
            <el-tab-pane label="所有订单" name="all" />
            <el-tab-pane label="待支付" name="pending_payment" />
            <el-tab-pane label="待发货" name="pending_shipment" />
            <el-tab-pane label="待收货" name="pending_receipt" />
            <el-tab-pane label="待评价" name="pending_review" />
            <el-tab-pane label="待退款" name="pending_refund" />
            <el-tab-pane label="已退款" name="refunded" />
            <el-tab-pane label="已取消" name="cancelled" />
        </el-tabs>

        <!-- 搜索栏 -->
        <div class="p-6 border-b border-gray-50 flex gap-4 bg-gray-50/30">
            <el-input
                v-model="searchKeyword"
                placeholder="输入商品名称或订单号进行搜索"
                clearable
                class="flex-1 custom-input"
                @keyup.enter="handleSearch"
            >
                <template #prefix>
                    <el-icon class="text-gray-400">
                        <Search />
                    </el-icon>
                </template>
            </el-input>
            <el-button
                type="primary"
                @click="handleSearch"
                class="bg-orange-500! border-orange-500! hover:bg-orange-600! rounded-xl! px-8 font-bold"
            >
                搜索
            </el-button>
            <el-button @click="handleReset" class="rounded-xl! px-6"> 重置 </el-button>
        </div>

        <!-- 订单列表 -->
        <div class="p-6" v-loading="loading">
            <div v-if="orderList.length > 0" class="space-y-6">
                <div
                    v-for="order in orderList"
                    :key="order.id"
                    class="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 bg-white"
                >
                    <!-- 订单头部信息 -->
                    <div
                        class="bg-gray-50/50 px-6 py-4 flex items-center justify-between border-b border-gray-50"
                    >
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
                            :type="getStatusTagType(order.status)"
                            effect="plain"
                            class="rounded-full! px-4! font-bold!"
                        >
                            {{ order.statusText }}
                        </el-tag>
                    </div>

                    <!-- 订单内容 -->
                    <div class="p-6 grid grid-cols-12 gap-6 items-center">
                        <!-- 商品信息 -->
                        <div class="col-span-7 space-y-4">
                            <div
                                v-for="item in order.items"
                                :key="item.id"
                                class="flex items-center gap-4"
                            >
                                <div
                                    class="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shrink-0"
                                >
                                    <img
                                        :src="item.productImage"
                                        :alt="item.productName"
                                        class="w-full h-full object-cover"
                                    />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4
                                        class="text-gray-900 font-bold truncate hover:text-orange-500 cursor-pointer transition-colors"
                                    >
                                        {{ item.productName }}
                                    </h4>
                                    <p class="text-gray-400 text-xs mt-1">规格：{{ item.spec || '默认' }}</p>
                                </div>
                                <div class="text-right shrink-0">
                                    <div class="text-gray-900 font-medium">
                                        ¥{{ item.price }}
                                    </div>
                                    <div class="text-gray-400 text-xs">
                                        x{{ item.quantity }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 收货信息 -->
                        <div class="col-span-3 border-l border-gray-50 pl-6 space-y-1">
                            <div
                                class="flex items-center gap-2 text-gray-900 font-bold"
                            >
                                <el-icon class="text-gray-400"><User /></el-icon>
                                {{ order.receiver }}
                            </div>
                            <div class="text-gray-500 text-xs flex items-start gap-2">
                                <el-icon class="mt-0.5 text-gray-400"
                                    ><Location
                                /></el-icon>
                                <span class="leading-relaxed">{{ order.address }}</span>
                            </div>
                            <div class="text-gray-500 text-xs flex items-center gap-2">
                                <el-icon class="text-gray-400"><Phone /></el-icon>
                                {{ order.phone }}
                            </div>
                        </div>

                        <!-- 订单金额与操作 -->
                        <div
                            class="col-span-2 border-l border-gray-50 pl-6 text-center space-y-4"
                        >
                            <div>
                                <div class="text-xs text-gray-400 mb-1">订单总额</div>
                                <div class="text-xl font-black text-orange-600">
                                    ¥{{ order.totalPrice }}
                                </div>
                            </div>

                            <div class="flex flex-col gap-2">
                                <el-button
                                    v-if="order.status === OrderStatus.PENDING_PAYMENT"
                                    type="primary"
                                    class="w-full! bg-orange-500! border-orange-500! hover:bg-orange-600! rounded-xl! font-bold"
                                    @click="handlePay(order.orderNo)"
                                >
                                    立即支付
                                </el-button>
                                <el-button
                                    v-if="order.status === OrderStatus.PENDING_SHIPMENT"
                                    type="warning"
                                    plain
                                    class="w-full! rounded-xl! border-orange-200! text-orange-500! hover:bg-orange-50!"
                                    @click="handleRefund(order.orderNo)"
                                >
                                    申请退款
                                </el-button>
                                <el-button
                                    v-if="order.status === OrderStatus.PENDING_RECEIPT"
                                    type="success"
                                    class="w-full! rounded-xl! font-bold"
                                    @click="handleConfirm(order.orderNo)"
                                >
                                    确认收货
                                </el-button>
                                <el-button
                                    v-if="order.status === OrderStatus.PENDING_PAYMENT"
                                    type="info"
                                    plain
                                    class="w-full! rounded-xl!"
                                    @click="handleCancel(order.orderNo)"
                                >
                                    取消订单
                                </el-button>
                                <el-button
                                    v-if="
                                        order.status === OrderStatus.COMPLETED ||
                                        order.status === OrderStatus.PENDING_REVIEW
                                    "
                                    class="w-full! rounded-xl! hover:text-orange-500! hover:border-orange-200!"
                                    @click="$router.push(`/order/detail/${order.orderNo}`)"
                                >
                                    查看详情
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
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
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { Search, Document, User, Location, Phone } from '@element-plus/icons-vue'
    import { 
        OrderStatus, 
        type Order, 
        fetchOrderList, 
        payOrder, 
        cancelOrder, 
        confirmReceipt, 
        applyRefund 
    } from '@/api/order'

    const activeTab = ref('all')
    const searchKeyword = ref('')
    const orderList = ref<Order[]>([])
    const loading = ref(false)

    const loadOrderList = async () => {
        loading.value = true
        try {
            const params = {
                status: activeTab.value === 'all' ? undefined : activeTab.value as OrderStatus,
                keyword: searchKeyword.value.trim() || undefined
            }
            const res = await fetchOrderList(params)
            // 假设 fetchOrderList 直接返回 Order[]
            orderList.value = res
        } catch (error) {
            console.error('加载订单列表失败:', error)
            ElMessage.error('加载订单列表失败')
        } finally {
            loading.value = false
        }
    }

    const handleTabChange = () => {
        loadOrderList()
    }

    const handleSearch = () => {
        loadOrderList()
    }

    const handleReset = () => {
        searchKeyword.value = ''
        loadOrderList()
    }

    const handlePay = async (orderNo: string) => {
        try {
            await ElMessageBox.confirm('确定要支付该订单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
            })
            await payOrder(orderNo, 'alipay')
            ElMessage.success('支付成功')
            await loadOrderList()
        } catch (error) {
            if (error !== 'cancel') {
                console.error('支付失败:', error)
            }
        }
    }

    const handleCancel = async (orderNo: string) => {
        try {
            await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
            await cancelOrder(orderNo)
            ElMessage.success('取消成功')
            await loadOrderList()
        } catch (error) {
            if (error !== 'cancel') {
                console.error('取消失败:', error)
            }
        }
    }

    const handleConfirm = async (orderNo: string) => {
        try {
            await ElMessageBox.confirm('确定已收到货物吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success',
            })
            await confirmReceipt(orderNo)
            ElMessage.success('确认收货成功')
            await loadOrderList()
        } catch (error) {
            if (error !== 'cancel') {
                console.error('确认收货失败:', error)
            }
        }
    }

    const handleRefund = async (orderNo: string) => {
        try {
            const { value: reason } = await ElMessageBox.prompt('请输入退款原因', '申请退款', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '请输入退款原因',
                inputValidator: (value) => {
                    if (!value || value.trim() === '') {
                        return '请输入退款原因'
                    }
                    return true
                },
            })
            await applyRefund(orderNo, reason)
            ElMessage.success('已提交退款申请')
            await loadOrderList()
        } catch (error) {
            if (error !== 'cancel') {
                console.error('申请退款失败:', error)
            }
        }
    }

    const getStatusTagType = (status: OrderStatus) => {
        const typeMap: Record<OrderStatus, any> = {
            [OrderStatus.PENDING_PAYMENT]: 'danger',
            [OrderStatus.PENDING_SHIPMENT]: 'warning',
            [OrderStatus.PENDING_RECEIPT]: 'primary',
            [OrderStatus.PENDING_REVIEW]: 'warning',
            [OrderStatus.PENDING_REFUND]: 'danger',
            [OrderStatus.REFUNDED]: 'info',
            [OrderStatus.CANCELLED]: 'info',
            [OrderStatus.COMPLETED]: 'success',
        }
        return typeMap[status] || ''
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

    :deep(.custom-input .el-input__wrapper) {
        border-radius: 12px;
        padding: 4px 12px;
        box-shadow: 0 0 0 1px #f3f4f6 inset;
    }

    :deep(.custom-input .el-input__wrapper.is-focus) {
        box-shadow: 0 0 0 1px #f97316 inset !important;
    }
</style>