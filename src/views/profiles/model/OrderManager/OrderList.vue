<template>
    <div class="p-6" v-loading="loading">
        <div v-if="orders.length > 0" class="space-y-6">
            <OrderCardWrap
                v-for="order in orders"
                :key="order.orderNo"
                :order="order"
                @comment="(shopOrder, item) => $emit('comment', shopOrder, item)"
                @payment="() => $emit('payment', order)"
                @receive="(orderNo) => $emit('receive', orderNo)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import OrderCardWrap from './OrderCardWrap.vue'
    import type { OrderAggregateVO, OrderItem, StoreOrderVO } from '@/api/order'

    interface ExtendedOrderAggregateVO extends OrderAggregateVO {
        isPartial?: boolean
    }

    defineProps<{
        orders: ExtendedOrderAggregateVO[]
        loading: boolean
    }>()

    defineEmits<{
        comment: [storeOrder: StoreOrderVO, item: OrderItem]
        payment: [order: OrderAggregateVO]
        receive: [orderNo: string]
    }>()
</script>
