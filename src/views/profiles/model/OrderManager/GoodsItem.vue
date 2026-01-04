<template>
    <div
        class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
    >
        <!-- 商品图片 -->
        <div
            class="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            @click="$router.push(`/goods/${item.goodsId}`)"
        >
            <img
                :src="getImageURL(item.goodsImg)"
                :alt="item.goodsName"
                class="w-full h-full object-cover"
            />
        </div>

        <!-- 商品信息 -->
        <div class="flex-1 min-w-0">
            <h4
                class="text-gray-900 font-bold hover:text-orange-500 cursor-pointer transition-colors mb-2 truncate"
                @click="$router.push(`/goods/${item.goodsId}`)"
            >
                {{ item.goodsName }}
            </h4>
            <div class="flex items-center gap-4 text-sm">
                <span class="text-gray-400">数量：{{ item.quantity }}</span>
                <span class="text-gray-400">单价：¥{{ item.goodsPriceText }}</span>
            </div>
        </div>

        <!-- 商品小计与评价按钮 -->
        <div class="text-right shrink-0">
            <div class="text-orange-600 font-bold text-lg mb-2">
                ¥{{ item.totalPriceText }}
            </div>
            <!-- 评论按钮（已完成状态） -->
            <div v-if="storeOrderStatus === OrderStatusEnum.FINISHED">
                <button
                    v-if="item.commentStatus === 0"
                    class="px-4 py-1.5 bg-orange-50 text-orange-500 text-xs font-bold rounded-full border border-orange-100 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all active:scale-95"
                    @click="$emit('comment', item)"
                >
                    去评价
                </button>
                <span v-else class="text-gray-500 text-xs font-medium flex items-center justify-end gap-1">
                    <el-icon><CircleCheck /></el-icon>已评价
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { CircleCheck } from '@element-plus/icons-vue'
    import type { OrderItem, OrderStatus } from '@/api/order'
    import { OrderStatus as OrderStatusEnum } from '@/api/order'
    import { getImageURL } from '@/utils/image'

    defineProps<{
        item: OrderItem
        storeOrderStatus: OrderStatus
    }>()

    defineEmits<{
        comment: [item: OrderItem]
    }>()
</script>
