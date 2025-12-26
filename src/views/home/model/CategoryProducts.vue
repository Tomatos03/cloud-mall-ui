<template>
    <div class="category-products bg-white rounded-2xl shadow p-6 mb-6">
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
        <div class="products-grid" v-if="goodsList && goodsList.length > 0">
            <!-- 左侧主推商品 - 采用简约高级感设计 -->
            <div
                v-if="goodsList[0]"
                class="featured-product group relative overflow-hidden bg-indigo-50/50 rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-500 border border-indigo-100"
                @click="onGoodsClick(goodsList[0].id, goodsList[0].storeId)"
            >
                <!-- 背景装饰数字 -->
                <div class="absolute right-0 top-0 p-4">
                    <div class="text-indigo-100/50 font-serif italic text-6xl select-none leading-none group-hover:text-indigo-200/50 transition-colors duration-500">01</div>
                </div>
                
                <div class="relative flex flex-col h-full z-10">
                    <div class="max-w-[85%]">
                        <span class="inline-block text-indigo-600 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                            Featured Selection
                        </span>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2 line-clamp-1 leading-tight group-hover:text-indigo-700 transition-colors">
                            {{ goodsList[0].name }}
                        </h3>
                        <p class="text-sm text-slate-500 line-clamp-1 leading-relaxed">
                            {{ goodsList[0].info }}
                        </p>
                    </div>

                    <div class="flex-1 flex items-center justify-center my-4">
                        <img
                            :src="getImageURL(goodsList[0].img)"
                            :alt="goodsList[0].name"
                            class="max-w-full max-h-64 object-contain transform group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    <div class="mt-auto flex items-center justify-between">
                        <div class="flex items-baseline gap-3">
                            <span class="text-gray-900 text-3xl font-light">
                                <span class="text-lg mr-1">¥</span>{{ fenToYuan(goodsList[0].price) }}
                            </span>
                            <span v-if="goodsList[0].originalPrice" class="text-gray-400 line-through text-xs font-light">
                                ¥{{ fenToYuan(goodsList[0].originalPrice) }}
                            </span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-400 group-hover:text-indigo-600 transition-colors">
                            <span class="text-sm font-medium">查看详情</span>
                            <el-icon><arrow-right /></el-icon>
                        </div>
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
                        <div class="flex-1 flex items-center justify-center mb-2">
                            <img
                                :src="getImageURL(goods.img)"
                                :alt="goods.name"
                                class="max-w-full max-h-32 object-contain"
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
                                ¥{{ fenToYuan(goods.price) }}
                            </span>
                            <span
                                v-if="goods.originalPrice"
                                class="text-xs text-gray-400 line-through"
                            >
                                ¥{{ fenToYuan(goods.originalPrice) }}
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

        <!-- 空状态页面 -->
        <div v-else class="empty-state flex flex-col items-center justify-center py-16">
            <div class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <el-icon :size="48" class="text-gray-400">
                    <picture />
                </el-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">暂无商品</h3>
            <p class="text-gray-400 text-sm mb-6">当前分类下还没有商品</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ArrowRight, Picture } from '@element-plus/icons-vue'
    import { computed } from 'vue'
    import { getImageURL } from '@/utils/image'
    import { fenToYuan } from '@/utils/price'

    interface GoodsCard {
        id: string
        name: string
        info: string
        img: string
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

    .featured-product {
        min-height: 420px;
    }

    .product-card {
        min-height: 200px;
    }

    .view-more {
        min-height: 200px;
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
