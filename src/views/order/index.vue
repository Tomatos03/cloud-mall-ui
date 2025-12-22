<template>
    <div class="min-h-screen bg-gray-50">
        <!-- 顶部导航栏 -->
        <Header />

        <!-- 订单管理主体 -->
        <div class="max-w-7xl mx-auto p-6">
            <div class="bg-white rounded-lg shadow-md">
                <!-- 标签页导航 -->
                <el-tabs v-model="activeTab" @tab-change="handleTabChange">
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
                <div class="px-6 pb-4 flex gap-2">
                    <el-input
                        v-model="searchKeyword"
                        placeholder="输入商品名称进行搜索"
                        clearable
                        class="flex-1"
                    >
                        <template #prefix>
                            <el-icon>
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </div>

                <!-- 订单列表 -->
                <div class="px-6 pb-6">
                    <!-- 表头 -->
                    <div
                        class="grid grid-cols-12 gap-4 p-4 bg-gray-100 font-medium text-gray-700 text-sm"
                    >
                        <div class="col-span-1">订单号</div>
                        <div class="col-span-2">商品图片</div>
                        <div class="col-span-1">商品名称</div>
                        <div class="col-span-1">商品数量</div>
                        <div class="col-span-1">订单总价</div>
                        <div class="col-span-1">下单时间</div>
                        <div class="col-span-1">状态</div>
                        <div class="col-span-2">收货地址</div>
                        <div class="col-span-1">联系电话</div>
                        <div class="col-span-1">操作</div>
                    </div>

                    <!-- 订单列表项 -->
                    <div v-if="orderList.length > 0" class="space-y-2">
                        <div
                            v-for="order in orderList"
                            :key="order.id"
                            class="grid grid-cols-12 gap-4 p-4 border border-gray-200 rounded hover:border-blue-300 transition items-center"
                        >
                            <!-- 订单号 -->
                            <div class="col-span-1 text-sm text-gray-600 break-all">
                                {{ order.orderNo }}
                            </div>

                            <!-- 商品图片 -->
                            <div class="col-span-2">
                                <div class="flex gap-2">
                                    <img
                                        v-for="(item, index) in order.items.slice(0, 2)"
                                        :key="index"
                                        :src="item.productImage"
                                        :alt="item.productName"
                                        class="w-16 h-16 object-cover rounded border"
                                    />
                                    <div
                                        v-if="order.items.length > 2"
                                        class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded border text-gray-500 text-xs"
                                    >
                                        +{{ order.items.length - 2 }}
                                    </div>
                                </div>
                            </div>

                            <!-- 商品名称 -->
                            <div class="col-span-1">
                                <div
                                    v-for="item in order.items"
                                    :key="item.id"
                                    class="text-sm text-gray-700 mb-1 truncate"
                                    :title="item.productName"
                                >
                                    {{ item.productName }}
                                </div>
                            </div>

                            <!-- 商品数量 -->
                            <div class="col-span-1 text-center">
                                <div
                                    v-for="item in order.items"
                                    :key="item.id"
                                    class="text-sm text-gray-700 mb-1"
                                >
                                    {{ item.quantity }}
                                </div>
                            </div>

                            <!-- 订单总价 -->
                            <div class="col-span-1 text-center">
                                <span class="text-orange-500 font-medium"
                                    >¥{{ order.totalPrice }}</span
                                >
                            </div>

                            <!-- 下单时间 -->
                            <div class="col-span-1 text-sm text-gray-600">
                                {{ order.createTime }}
                            </div>

                            <!-- 状态 -->
                            <div class="col-span-1 text-center">
                                <el-tag :type="getStatusTagType(order.status)" size="small">{{
                                    order.statusText
                                }}</el-tag>
                            </div>

                            <!-- 收货地址 -->
                            <div class="col-span-2">
                                <div class="text-sm text-gray-700">
                                    {{ order.receiver }}
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    {{ order.address }}
                                </div>
                            </div>

                            <!-- 联系电话 -->
                            <div class="col-span-1 text-sm text-gray-600">
                                {{ order.phone }}
                            </div>

                            <!-- 操作 -->
                            <div class="col-span-1 flex flex-col gap-1">
                                <el-button
                                    v-if="order.status === OrderStatus.PENDING_PAYMENT"
                                    type="primary"
                                    size="small"
                                    @click="handlePay(order.orderNo)"
                                >
                                    支付
                                </el-button>
                                <el-button
                                    v-if="order.status === OrderStatus.PENDING_SHIPMENT"
                                    type="warning"
                                    size="small"
                                    @click="handleRefund(order.orderNo)"
                                >
                                    退款
                                </el-button>
                                <el-button
                                    v-if="order.status === OrderStatus.PENDING_RECEIPT"
                                    type="success"
                                    size="small"
                                    @click="handleConfirm(order.orderNo)"
                                >
                                    确认
                                </el-button>
                                <el-button
                                    v-if="order.status === OrderStatus.PENDING_PAYMENT"
                                    type="danger"
                                    size="small"
                                    @click="handleCancel(order.orderNo)"
                                >
                                    取消
                                </el-button>
                            </div>
                        </div>
                    </div>

                    <!-- 空状态 -->
                    <div v-else class="text-center py-20">
                        <el-icon class="text-6xl text-gray-300 mb-4">
                            <Document />
                        </el-icon>
                        <p class="text-gray-400">暂无订单</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { Search, Document } from '@element-plus/icons-vue'
    import Header from '@/views/home/model/Header.vue'
    import { OrderStatus, type Order } from '@/api/order'

    // 静态数据
    const mockOrderList = ref<Order[]>([
        {
            id: 1,
            orderNo: '20250911105742806926',
            items: [
                {
                    id: 1,
                    productName: '林氏薄暖智能恒温',
                    productImage:
                        'https://res.vmallres.com/pimages//uomcdn/CN/pms/202410/gbom/6942103126253/428_428_1728290612827mp.png',
                    quantity: 1,
                    price: 1499,
                },
            ],
            totalPrice: 1499,
            createTime: '2025-09-11 10:57:42',
            status: OrderStatus.PENDING_PAYMENT,
            statusText: '待支付',
            receiver: '王宝宝',
            address: 'HK林氏官方旗舰店 王宝宝',
            phone: '13888888888',
        },
        {
            id: 2,
            orderNo: '20250907012951888714',
            items: [
                {
                    id: 2,
                    productName: 'Redmi Buds 6 降噪版',
                    productImage:
                        'https://cdn.cnbj1.fds.api.mi-img.com/nr-pub/202410281631_cf1e9e7df9dca6bfba2e4d0d0af3c3ad.png',
                    quantity: 1,
                    price: 139,
                },
            ],
            totalPrice: 139,
            createTime: '2025-09-07 20:29:51',
            status: OrderStatus.PENDING_SHIPMENT,
            statusText: '待发货',
            receiver: '王宝宝',
            address: '富士商店 王宝宝',
            phone: '13888888888',
        },
        {
            id: 3,
            orderNo: '20250904419532384069',
            items: [
                {
                    id: 3,
                    productName: '风采异秀典雅职装外套',
                    productImage:
                        'https://img.alicdn.com/imgextra/i3/2215464672622/O1CN01qE9Z8K1PkNBvYjJHG_!!2215464672622.jpg',
                    quantity: 3,
                    price: 269,
                },
            ],
            totalPrice: 807,
            createTime: '2025-09-04 19:53:23',
            status: OrderStatus.PENDING_REVIEW,
            statusText: '待评价',
            receiver: '王兰兰',
            address: '优雅 KUNXI 王宝宝',
            phone: '13888888888',
        },
        {
            id: 4,
            orderNo: '20250904194717872957',
            items: [
                {
                    id: 4,
                    productName: '林氏薄白智能恒温',
                    productImage:
                        'https://res.vmallres.com/pimages//uomcdn/CN/pms/202410/gbom/6942103126253/428_428_1728290613071mp.png',
                    quantity: 2,
                    price: 1499,
                },
            ],
            totalPrice: 2998,
            createTime: '2025-09-04 19:47:17',
            status: OrderStatus.PENDING_REFUND,
            statusText: '待退款',
            receiver: '王宝宝',
            address: 'HK林氏官方旗舰店 王宝宝',
            phone: '13888888888',
        },
        {
            id: 5,
            orderNo: '20250904194717837143',
            items: [
                {
                    id: 5,
                    productName: '上太阳维度开车照射灯',
                    productImage:
                        'https://img.alicdn.com/imgextra/i2/2208857326233/O1CN01NqZ3nY1GvvXCYn8kJ_!!2208857326233.jpg',
                    quantity: 1,
                    price: 159,
                },
            ],
            totalPrice: 159,
            createTime: '2025-09-04 19:47:17',
            status: OrderStatus.COMPLETED,
            statusText: '已完成',
            receiver: '王宝宝',
            address: '富士商店 王宝宝',
            phone: '13888888888',
        },
        {
            id: 6,
            orderNo: '20250904194636555335',
            items: [
                {
                    id: 6,
                    productName: '上太阳维度开车照射灯',
                    productImage:
                        'https://img.alicdn.com/imgextra/i2/2208857326233/O1CN01NqZ3nY1GvvXCYn8kJ_!!2208857326233.jpg',
                    quantity: 1,
                    price: 159,
                },
            ],
            totalPrice: 159,
            createTime: '2025-09-04 19:46:36',
            status: OrderStatus.PENDING_SHIPMENT,
            statusText: '待发货',
            receiver: '王宝宝',
            address: '富士商店 王宝宝',
            phone: '13888888888',
        },
    ])

    const activeTab = ref('all')
    const searchKeyword = ref('')
    const orderList = ref<Order[]>([])

    // 加载订单列表
    const loadOrderList = async () => {
        try {
            // 使用静态数据
            let filteredList = [...mockOrderList.value]

            // 按状态筛选
            if (activeTab.value !== 'all') {
                filteredList = filteredList.filter((order) => order.status === activeTab.value)
            }

            // 按关键词搜索
            if (searchKeyword.value.trim()) {
                const keyword = searchKeyword.value.trim().toLowerCase()
                filteredList = filteredList.filter(
                    (order) =>
                        order.orderNo.toLowerCase().includes(keyword) ||
                        order.items.some((item) =>
                            item.productName.toLowerCase().includes(keyword),
                        ),
                )
            }

            orderList.value = filteredList
        } catch (error) {
            console.error('加载订单列表失败:', error)
            ElMessage.error('加载订单列表失败')
        }
    }

    // 切换标签页
    const handleTabChange = () => {
        loadOrderList()
    }

    // 搜索
    const handleSearch = () => {
        loadOrderList()
    }

    // 重置
    const handleReset = () => {
        searchKeyword.value = ''
        loadOrderList()
    }

    // 支付订单
    const handlePay = async (orderNo: string) => {
        try {
            await ElMessageBox.confirm('确定要支付该订单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
            })

            // 模拟支付
            const order = mockOrderList.value.find((o) => o.orderNo === orderNo)
            if (order) {
                order.status = OrderStatus.PENDING_SHIPMENT
                order.statusText = '待发货'
                await loadOrderList()
                ElMessage.success('支付成功')
            }
        } catch (error) {
            // 取消支付
        }
    }

    // 取消订单
    const handleCancel = async (orderNo: string) => {
        try {
            await ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })

            // 模拟取消
            const order = mockOrderList.value.find((o) => o.orderNo === orderNo)
            if (order) {
                order.status = OrderStatus.CANCELLED
                order.statusText = '已取消'
                await loadOrderList()
                ElMessage.success('取消成功')
            }
        } catch (error) {
            // 取消操作
        }
    }

    // 确认收货
    const handleConfirm = async (orderNo: string) => {
        try {
            await ElMessageBox.confirm('确定已收到货物吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success',
            })

            // 模拟确认收货
            const order = mockOrderList.value.find((o) => o.orderNo === orderNo)
            if (order) {
                order.status = OrderStatus.PENDING_REVIEW
                order.statusText = '待评价'
                await loadOrderList()
                ElMessage.success('确认收货成功')
            }
        } catch (error) {
            // 取消操作
        }
    }

    // 申请退款
    const handleRefund = async (orderNo: string) => {
        try {
            await ElMessageBox.prompt('请输入退款原因', '申请退款', {
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

            // 模拟申请退款
            const order = mockOrderList.value.find((o) => o.orderNo === orderNo)
            if (order) {
                order.status = OrderStatus.PENDING_REFUND
                order.statusText = '待退款'
                await loadOrderList()
                ElMessage.success('已提交退款申请')
            }
        } catch (error) {
            // 取消操作
        }
    }

    // 获取状态标签类型
    const getStatusTagType = (status: OrderStatus) => {
        const typeMap: Record<OrderStatus, any> = {
            [OrderStatus.PENDING_PAYMENT]: 'info',
            [OrderStatus.PENDING_SHIPMENT]: 'warning',
            [OrderStatus.PENDING_RECEIPT]: 'primary',
            [OrderStatus.PENDING_REVIEW]: '',
            [OrderStatus.PENDING_REFUND]: 'warning',
            [OrderStatus.REFUNDED]: 'success',
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
    :deep(.el-tabs__item) {
        font-size: 14px;
        padding: 0 20px;
    }

    :deep(.el-tabs__nav-wrap::after) {
        height: 1px;
    }
</style>
