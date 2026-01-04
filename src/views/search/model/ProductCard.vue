<template>
    <div
        class="product-card group bg-white rounded-2xl p-4 cursor-pointer hover:shadow-2xl hover:shadow-orange-100 transition-all duration-300 border border-gray-100 hover:border-orange-200"
        @click="handleClick"
    >
        <div class="flex flex-col h-full">
            <!-- 商品图片 -->
            <div
                class="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center"
            >
                <img
                    :src="getImageURL(product.img)"
                    :alt="product.name"
                    class="max-w-[85%] max-h-[85%] object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <div
                    class="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                    <div
                        class="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform"
                    >
                        <span class="text-xs font-bold text-orange-500">查看详情</span>
                    </div>
                </div>
            </div>

            <!-- 商品信息 -->
            <div class="flex-1 flex flex-col">
                <h4
                    class="text-sm font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors"
                >
                    {{ product.name }}
                </h4>
                <p class="text-xs text-gray-400 mb-4 line-clamp-1">
                    {{ product.info }}
                </p>

                <div class="mt-auto">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-baseline gap-0.5">
                            <span class="text-orange-500 text-xl font-black">
                                {{ product.price }}
                            </span>
                            <span class="text-orange-500 text-xs font-bold">元</span>
                            <span
                                v-if="product.originalPrice"
                                class="ml-2 text-xs text-gray-300 line-through"
                            >
                                {{ product.originalPrice }}元
                            </span>
                        </div>
                        <span class="text-[10px] text-gray-400">销量 {{ product.sale || 0 }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { GoodsCard } from '@/api/goods'
    import { getImageURL } from '@/utils/image'

    interface Props {
        product: GoodsCard
    }

    const props = defineProps<Props>()
    const emit = defineEmits<{
        (e: 'click', productId: string): void
    }>()

    const handleClick = () => {
        emit('click', props.product.id)
    }
</script>

<style scoped>
    .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
