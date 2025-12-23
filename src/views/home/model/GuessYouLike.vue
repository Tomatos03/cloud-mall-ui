<template>
    <div class="guess-you-like bg-white rounded-2xl shadow p-6 mb-6">
        <!-- 顶部标题栏 -->
        <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h2 class="text-2xl font-bold text-gray-800">{{ title || '猜你喜欢' }}</h2>
            <small class="text-gray-500">为你智能推荐</small>
        </div>

        <!-- 商品网格 -->
        <div class="products-grid">
            <div
                v-for="item in itemsComputed"
                :key="item.id"
                class="product-card bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-all border border-gray-100 hover:border-orange-300"
                @click="goToProduct(item.id)"
            >
                <div class="flex flex-col h-full">
                    <div class="flex-1 flex items-center justify-center mb-3">
                        <img
                            :src="item.img || '/default-product.png'"
                            :alt="item.title"
                            class="max-w-full max-h-40 object-contain rounded"
                        />
                    </div>
                    <h4 class="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                        {{ item.title }}
                    </h4>
                    <div class="flex items-baseline gap-2 mt-auto">
                        <span class="text-orange-500 text-lg font-bold">
                            {{ item.price }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import { useRouter } from 'vue-router'
    import type { GoodsItem } from '@/api/goods'

    const props = defineProps<{
        title?: string
        items?: GoodsItem[]
    }>()

    const router = useRouter()
    const itemsComputed = computed(() => props.items || [])

    const goToProduct = (productId: number) => {
        router.push(`/product/${productId}`)
    }
</script>

<style scoped>
    .products-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 16px;
    }

    .product-card {
        min-height: 280px;
    }

    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    /* 响应式设计 */
    @media (max-width: 1400px) {
        .products-grid {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    @media (max-width: 1024px) {
        .products-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 768px) {
        .products-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 480px) {
        .products-grid {
            grid-template-columns: repeat(1, 1fr);
        }
    }
</style>
