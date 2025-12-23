<template>
    <div
        class="category-products bg-white rounded-2xl shadow p-6 mb-6"
        v-if="goodsList && goodsList.length > 0"
    >
        <!-- 顶部标题栏 -->
        <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h2 class="text-2xl font-bold text-gray-800">{{ categoryTitle }}</h2>
            <div class="flex gap-4 items-center">
                <!-- 三级分类标签 -->
                <div class="flex gap-3">
                    <span
                        v-for="tab in tabs"
                        :key="tab.id"
                        :class="[
                            'cursor-pointer px-3 py-1 rounded-md transition-all',
                            activeTab === tab.id
                                ? 'text-orange-500 font-semibold'
                                : 'text-gray-600 hover:text-orange-400',
                        ]"
                        @click="switchTab(tab.id)"
                    >
                        {{ tab.name }}
                    </span>
                </div>
            </div>
        </div>

        <!-- 商品网格 -->
        <div class="products-grid">
            <!-- 左侧主推商品，直接用 products[0] -->
            <div
                v-if="goodsList[0]"
                class="featured-product bg-linear-to-br from-purple-100 to-blue-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
                @click="onGoodsClick(goodsList[0].id, goodsList[0].storeId)"
            >
                <div class="flex flex-col h-full">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">
                        {{ goodsList[0].name }}
                    </h3>
                    <p class="text-sm text-gray-600 mb-4">{{ goodsList[0].info }}</p>
                    <div class="flex-1 flex items-center justify-center mb-4">
                        <img
                            :src="goodsList[0].image"
                            :alt="goodsList[0].name"
                            class="max-w-full max-h-64 object-contain"
                        />
                    </div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-orange-500 text-2xl font-bold">
                            {{ goodsList[0].price }}元
                        </span>
                        <span v-if="goodsList[0].originalPrice" class="text-gray-400 line-through">
                            {{ goodsList[0].originalPrice }}元
                        </span>
                    </div>
                </div>
            </div>

            <!-- 右侧商品列表（不包含主推商品） -->
            <div class="products-list">
                <div
                    v-for="goods in goodsList.slice(1)"
                    :key="goods.id"
                    class="product-card bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-all border border-gray-100 hover:border-orange-300"
                    @click="onGoodsClick(goods.id, goods.storeId)"
                >
                    <div class="flex flex-col h-full">
                        <div class="flex-1 flex items-center justify-center mb-3">
                            <img
                                :src="goods.image"
                                :alt="goods.name"
                                class="max-w-full max-h-40 object-contain"
                            />
                        </div>
                        <h4 class="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                            {{ goods.name }}
                        </h4>
                        <p class="text-xs text-gray-500 mb-2 line-clamp-1">
                            {{ goods.info }}
                        </p>
                        <div class="flex items-baseline gap-2">
                            <span class="text-orange-500 text-lg font-bold">
                                {{ goods.price }}元
                            </span>
                            <span
                                v-if="goods.originalPrice"
                                class="text-xs text-gray-400 line-through"
                            >
                                {{ goods.originalPrice }}元
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 查看更多按钮 -->
                <div
                    class="view-more bg-linear-to-br from-orange-50 to-orange-100 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all flex flex-col items-center justify-center"
                    @click="viewMore"
                >
                    <div
                        class="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm"
                    >
                        <el-icon :size="32" class="text-orange-500">
                            <arrow-right />
                        </el-icon>
                    </div>
                    <p class="text-orange-500 font-semibold text-lg">浏览更多</p>
                    <p class="text-orange-400 text-sm">{{ activeTabName }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ArrowRight } from '@element-plus/icons-vue'
    import { computed } from 'vue'

    interface GoodsCard {
        id: string
        name: string
        info: string
        image: string
        price: string
        storeId: string
        originalPrice?: string
    }

    interface Tab {
        id: string
        name: string
    }

    const props = defineProps<{
        categoryTitle: string
        categoryId: string
        tabs: Tab[]
        goodsList: GoodsCard[]
        activeTab: string | number
    }>()

    const emit = defineEmits(['product-click', 'tab-change', 'view-more'])

    const activeTabName = computed(() => {
        const tab = props.tabs.find((t) => t.id === props.activeTab)
        return tab?.name || ''
    })

    function switchTab(tabId: string) {
        emit('tab-change', tabId)
    }

    function onGoodsClick(productId: string, storeId: string) {
        emit('product-click', productId, storeId)
    }

    function viewMore() {
        emit('view-more', activeTabName.value)
    }
</script>

<style scoped>
    .products-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 20px;
    }

    .products-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
    }

    .product-card {
        min-height: 280px;
    }

    .view-more {
        min-height: 280px;
    }

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

    /* 响应式设计 */
    @media (max-width: 1400px) {
        .products-list {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 1024px) {
        .products-grid {
            grid-template-columns: 1fr;
        }

        .products-list {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    @media (max-width: 768px) {
        .products-list {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
