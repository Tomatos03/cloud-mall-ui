<template>
    <div
        class="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 bg-white"
    >
        <!-- 订单头部信息 -->
        <div class="bg-gray-50/50 px-6 py-4 border-b border-gray-50">
            <div class="mb-2 flex items-center gap-3">
                <span class="text-gray-400 text-sm font-medium">
                    {{ getOrderTypeText(order) }}
                </span>
                <!-- 聚合订单过滤提示 -->
                <span
                    v-if="isParentOrder(order.orderNo) && order.isPartial"
                    class="text-[10px] text-orange-400 bg-orange-50/50 px-2 py-0.5 rounded-full border border-orange-100/50"
                >
                    这个订单当前仅展示了部分商品
                </span>
            </div>
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
        </div>

        <!-- 店铺订单列表 -->
        <div>
            <StoreOrderItem
                v-for="storeOrder in order.storeOrders"
                :key="storeOrder.orderNo"
                :store-order="storeOrder"
                @comment="(item) => $emit('comment', storeOrder, item)"
                @receive="(orderNo) => $emit('receive', orderNo)"
            />
        </div>

        <!-- 订单总计与操作 -->
        <div class="px-6 py-4 bg-gray-50/50 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <span class="text-gray-500 text-sm">订单总额：</span>
                <span class="text-orange-600 font-black text-2xl">
                    ¥{{ order.totalPriceText }}
                </span>
            </div>
            <!-- 待支付订单显示支付按钮 -->
            <button
                v-if="order.status === OrderStatus.CREATED"
                class="px-10 py-3 bg-orange-600 text-white text-base font-bold rounded-full hover:bg-orange-700 shadow-md shadow-orange-200 transition-all active:scale-95"
                @click="$emit('payment')"
            >
                立即支付
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import StoreOrderItem from './StoreOrderItem.vue'
    import type { OrderAggregateVO, OrderItem, StoreOrderVO } from '@/api/order'
    import {
        isParentOrder,
        OrderStatus,
    } from '@/api/order'

    interface ExtendedOrderAggregateVO extends OrderAggregateVO {
        isPartial?: boolean
    }

    defineProps<{
        order: ExtendedOrderAggregateVO
    }>()

    defineEmits<{
        comment: [shopOrder: StoreOrderVO, item: OrderItem]
        payment: []
        receive: [orderNo: string]
    }>()

    /**
     * 获取订单类型文本
     */
    const getOrderTypeText = (order: OrderAggregateVO): string => {
        return isParentOrder(order.orderNo) ? '多店铺订单' : '单店铺订单'
    }
</script>
