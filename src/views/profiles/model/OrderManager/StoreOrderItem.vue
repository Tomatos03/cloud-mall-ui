<template>
    <div class="border-b border-gray-50 last:border-b-0">
        <!-- 店铺信息头部 -->
        <div class="px-6 py-3 bg-gray-50/30 flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm">
                <el-icon class="text-gray-400"><Shop /></el-icon>
                <span
                    class="text-gray-900 font-bold hover:text-orange-500 cursor-pointer transition-colors"
                    @click="$router.push(`/store/${storeOrder.storeId}`)"
                >
                    {{ storeOrder.storeName }}
                </span>
            </div>
            <!-- 店铺订单状态标记 -->
            <div
                :class="[
                    'px-3 py-1 rounded-full text-xs font-bold border transition-colors',
                    getStatusStyle(storeOrder.status)
                ]"
            >
                {{ getOrderStatusText(storeOrder.status) }}
            </div>
        </div>

        <!-- 商品列表 -->
        <div class="p-6 space-y-3">
            <GoodsItem
                v-for="item in storeOrder.items"
                :key="item.id"
                :item="item"
                :store-order-status="storeOrder.status"
                @comment="(goods) => $emit('comment', goods)"
            />

            <!-- 店铺订单操作栏 -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                <div class="text-sm">
                    <span class="text-gray-400">商品总数：</span>
                    <span class="text-gray-900 font-bold">
                        {{ storeOrder.count }}
                    </span>
                    <span class="text-gray-400 ml-4">小计：</span>
                    <span class="text-orange-600 font-bold text-lg">
                        ¥{{ storeOrder.totalPriceText }}
                    </span>
                </div>

                <div class="flex gap-2">
                    <button
                        v-if="storeOrder.status === OrderStatus.SHIPPED"
                        class="px-6 py-2 bg-orange-500 text-white text-sm font-bold rounded-full hover:bg-orange-600 shadow-sm shadow-orange-200 transition-all active:scale-95"
                        @click="$emit('receive', storeOrder.orderNo)"
                    >
                        确认收货
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Shop } from '@element-plus/icons-vue'
    import GoodsItem from './GoodsItem.vue'
    import {
        OrderStatus as OrderStatusEnum,
        type OrderItem,
        getOrderStatusText,
        type StoreOrderVO
    } from '@/api/order'

    defineProps<{
        storeOrder: StoreOrderVO
    }>()

    defineEmits<{
        comment: [item: OrderItem]
        receive: [orderNo: string]
    }>()

    // 用于模板中使用
    const OrderStatus = OrderStatusEnum

    /**
     * 获取状态样式类
     */
    const getStatusStyle = (status: OrderStatusEnum): string => {
        switch (status) {
            case OrderStatusEnum.CREATED:
                return 'bg-orange-50/80 text-orange-500 border-orange-100/50'
            case OrderStatusEnum.PAID:
                return 'bg-blue-50/80 text-blue-500 border-blue-100/50'
            case OrderStatusEnum.SHIPPED:
                return 'bg-indigo-50/80 text-indigo-500 border-indigo-100/50'
            case OrderStatusEnum.FINISHED:
                return 'bg-green-50/80 text-green-500 border-green-100/50'
            case OrderStatusEnum.CANCELED:
            case OrderStatusEnum.CLOSED:
                return 'bg-gray-50/80 text-gray-400 border-gray-200/50'
            default:
                return 'bg-gray-50/80 text-gray-400 border-gray-200/50'
        }
    }
</script>
