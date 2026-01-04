<template>
    <div class="category-goods-list bg-white border border-gray-100 rounded-xl p-5 mb-6">
        <!-- 顶部标题与分类切换 -->
        <div
            class="flex flex-col md:flex-row justify-between items-center mb-6 pb-3 border-b border-gray-50 gap-4"
        >
            <div class="flex items-center gap-4">
                <h2 class="text-2xl font-bold text-gray-900 tracking-tight">{{ categoryTitle }}</h2>
                <div class="h-4 w-px bg-gray-200 hidden md:block"></div>
                <span
                    class="text-xs text-gray-400 uppercase tracking-widest hidden md:block font-medium"
                    >Selected Collection</span
                >
            </div>

            <!-- 分类标签 -->
            <div class="flex flex-wrap gap-2 md:gap-6">
                <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    :class="[
                        'relative py-1 px-1 text-sm transition-all duration-300 cursor-pointer',
                        activeTab.id === tab.id
                            ? 'text-orange-500 font-bold'
                            : 'text-gray-500 hover:text-gray-800',
                    ]"
                    @click="switchTab(tab)"
                >
                    {{ tab.name }}
                    <span
                        v-if="activeTab.id === tab.id"
                        class="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-full"
                    ></span>
                </button>
            </div>
        </div>

        <!-- 布局网格 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <!-- 左侧主推商品 - 淡橙色扁平化风格 -->
            <div
                v-if="goodsList[0]"
                class="featured-card lg:col-span-4 xl:col-span-3 group relative bg-orange-50 rounded-xl cursor-pointer border border-orange-100 hover:border-orange-400 transition-all duration-300 flex flex-col min-h-105 overflow-hidden"
                @click="onGoodsClick(goodsList[0].id)"
            >
                <!-- 背景装饰数字 -->
                <div
                    class="absolute -right-4 -top-4 text-[180px] font-black text-orange-200/30 select-none pointer-events-none italic leading-none tracking-tighter"
                >
                    01
                </div>

                <div class="p-6 pb-0 relative z-10">
                    <div class="inline-flex items-center px-2 py-0.5 bg-orange-500 rounded-sm mb-4">
                        <span class="text-white text-[10px] font-black uppercase tracking-wider"
                            >Featured</span
                        >
                    </div>
                    <h3
                        class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight"
                    >
                        {{ goodsList[0].name }}
                    </h3>
                    <p class="text-gray-500 text-xs line-clamp-2 leading-relaxed font-light">
                        {{ goodsList[0].info }}
                    </p>
                </div>

                <div class="flex-1 flex items-center justify-center p-6">
                    <img
                        :src="getImageURL(goodsList[0].img)"
                        :alt="goodsList[0].name"
                        class="max-w-full max-h-52 object-contain mix-blend-multiply transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                </div>

                <div class="p-6 pt-0 mt-auto">
                    <div class="flex items-baseline gap-1">
                        <span class="text-orange-600 text-3xl font-black"
                            >¥{{ fenToYuan(goodsList[0].price) }}</span
                        >
                        <span
                            v-if="goodsList[0].originalPrice"
                            class="text-orange-200 line-through text-sm ml-1"
                        >
                            ¥{{ fenToYuan(goodsList[0].originalPrice) }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- 右侧普通商品网格 -->
            <div
                class="lg:col-span-8 xl:col-span-9 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
            >
                <div
                    v-for="goods in goodsList.slice(1, 8)"
                    :key="goods.id"
                    class="product-card group bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-orange-500 transition-all duration-300 flex flex-col w-full"
                    @click="onGoodsClick(goods.id)"
                >
                    <div
                        class="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center p-3"
                    >
                        <img
                            :src="getImageURL(goods.img)"
                            :alt="goods.name"
                            class="w-full h-full object-contain mix-blend-multiply transform group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    <div class="flex flex-col flex-1">
                        <h4
                            class="text-[15px] text-gray-800 mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors font-bold leading-snug"
                        >
                            {{ goods.name }}
                        </h4>
                        <p class="text-xs text-gray-400 mb-2 line-clamp-1 font-light">
                            {{ goods.info }}
                        </p>
                        <div class="mt-auto flex items-center justify-between">
                            <span class="text-lg font-black text-orange-500"
                                >¥{{ fenToYuan(goods.price) }}</span
                            >
                            <span
                                v-if="goods.originalPrice"
                                class="text-[11px] text-gray-300 line-through font-light"
                            >
                                ¥{{ fenToYuan(goods.originalPrice) }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 查看更多 -->
                <div
                    class="view-more group border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-orange-500 transition-all duration-300 w-full min-h-45"
                    @click="viewMore"
                >
                    <div
                        class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mb-3 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300"
                    >
                        <el-icon size="22"><arrow-right /></el-icon>
                    </div>
                    <span
                        class="text-xs font-bold tracking-widest uppercase text-gray-400 group-hover:text-orange-500"
                        >View More</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ArrowRight } from '@element-plus/icons-vue'
    import { getImageURL } from '@/utils/image'
    import { fenToYuan } from '@/utils/price'
    import type { CategoryTab } from '@/api/category'
    import type { GoodsItem } from '@/api/goods'

    interface CategoryGoodsCardListProps {
        categoryTitle: string
        topCategoryId: string
        tabs: CategoryTab[]
        goodsList: GoodsItem[]
        activeTab: CategoryTab
    }

    const props = defineProps<CategoryGoodsCardListProps>()

    const emit = defineEmits(['goods-click', 'tab-change', 'view-more'])

    function switchTab(categoryTab: CategoryTab) {
        emit('tab-change', props.topCategoryId, categoryTab)
    }

    function onGoodsClick(goodsId: string) {
        emit('goods-click', goodsId)
    }

    function viewMore() {
        emit('view-more', props.activeTab.name)
    }
</script>

<style scoped>
    .line-clamp-1 {
        display: -webkit-box;
        line-clamp: 1;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .line-clamp-2 {
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .category-goods-list {
        font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
            sans-serif;
    }
</style>
