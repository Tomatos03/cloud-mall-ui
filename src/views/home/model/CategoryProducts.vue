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
        <div class="products-grid">
            <!-- 左侧大图商品 -->
            <div
                class="featured-product bg-linear-to-br from-purple-100 to-blue-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
                @click="goToProduct(featuredProduct.id)"
            >
                <div class="flex flex-col h-full">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">
                        {{ featuredProduct.name }}
                    </h3>
                    <p class="text-sm text-gray-600 mb-4">{{ featuredProduct.description }}</p>
                    <div class="flex-1 flex items-center justify-center mb-4">
                        <img
                            :src="featuredProduct.image"
                            :alt="featuredProduct.name"
                            class="max-w-full max-h-64 object-contain"
                        />
                    </div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-orange-500 text-2xl font-bold">
                            {{ featuredProduct.price }}元
                        </span>
                        <span
                            v-if="featuredProduct.originalPrice"
                            class="text-gray-400 line-through"
                        >
                            {{ featuredProduct.originalPrice }}元
                        </span>
                    </div>
                </div>
            </div>

            <!-- 右侧商品列表 -->
            <div class="products-list">
                <div
                    v-for="product in products"
                    :key="product.id"
                    class="product-card bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-all border border-gray-100 hover:border-orange-300"
                    @click="goToProduct(product.id)"
                >
                    <div class="flex flex-col h-full">
                        <div class="flex-1 flex items-center justify-center mb-3">
                            <img
                                :src="product.image"
                                :alt="product.name"
                                class="max-w-full max-h-40 object-contain"
                            />
                        </div>
                        <h4 class="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                            {{ product.name }}
                        </h4>
                        <p class="text-xs text-gray-500 mb-2 line-clamp-1">
                            {{ product.description }}
                        </p>
                        <div class="flex items-baseline gap-2">
                            <span class="text-orange-500 text-lg font-bold">
                                {{ product.price }}元
                            </span>
                            <span
                                v-if="product.originalPrice"
                                class="text-xs text-gray-400 line-through"
                            >
                                {{ product.originalPrice }}元
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 查看更多按钮 -->
                <div
                    class="view-more bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all flex flex-col items-center justify-center"
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
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { ArrowRight } from '@element-plus/icons-vue'

    interface Product {
        id: number
        name: string
        description: string
        image: string
        price: string | number
        originalPrice?: string | number
    }

    interface Tab {
        id: number | string
        name: string
    }

    interface Props {
        categoryTitle?: string
        categoryId?: number | string
        tabs?: Tab[]
        featuredProduct?: Product
        products?: Product[]
    }

    const props = withDefaults(defineProps<Props>(), {
        categoryTitle: '家电',
        tabs: () => [
            { id: 'hot', name: '热门' },
            { id: 'tv', name: '电视影音' },
            { id: 'air', name: '空调' },
        ],
        featuredProduct: () => ({
            id: 1,
            name: '小米电视 S Mini LED 系列',
            description: 'Mini LED 悬浮屏设计 开启图像新时代',
            image: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/29e4e456c5dd08c395ac4ddf2e1be473.jpg',
            price: '2999',
            originalPrice: '3499',
        }),
        products: () => [
            {
                id: 2,
                name: '小米电视S Pro Mini LED系列',
                description: '288Hz超高刷 4.64G大存储',
                image: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/d604255f1d085b36a0a2b2f5c88917e0.png',
                price: '4999',
                originalPrice: '',
            },
            {
                id: 3,
                name: '小米电视 S Mini LED 系列',
                description: 'Mini LED 悬浮屏设计 1200nits峰值亮度',
                image: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/4c53763d23c456e69afc38d5a51e15f9.jpg',
                price: '2999',
                originalPrice: '',
            },
            {
                id: 4,
                name: 'Redmi 智能电视 X 2025款',
                description: '240Hz高刷 4+64GB 全程通高色域',
                image: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/d9f30b3e28bc5f61d0c5e1d55f7eac58.png',
                price: '3499',
                originalPrice: '',
            },
            {
                id: 5,
                name: '巨省电Pro 1.5匹超一级能效 米家空调',
                description: '新一代巨省电Pro新升级',
                image: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/6ed84c456dca61f1a3d9e59dd6f92d14.png',
                price: '2499',
                originalPrice: '2999',
            },
            {
                id: 6,
                name: '巨省电 小米空调 1.5匹超一级能效',
                description: '强劲制冷 高效节能 智能物联',
                image: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/3e93b4b37e96a1b8aa57b73f5f3bf61f.png',
                price: '1999',
                originalPrice: '2499',
            },
            {
                id: 7,
                name: '巨首Pro 立式3吧 超一级能效',
                description: '精护洗Pro 洗烘10kg',
                image: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/0aebdd1fd4e5aa0e673f1d60e0e6e2e0.png',
                price: '6499',
                originalPrice: '',
            },
            {
                id: 8,
                name: '米家迷你滚筒洗衣机Pro 3kg',
                description: '',
                image: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/a3c3f4c1e1e6b9b4e6d6f2e0f3e8a9c1.png',
                price: '399',
                originalPrice: '',
            },
        ],
    })

    const router = useRouter()
    const activeTab = ref<number | string>(props.tabs[0]?.id || 'hot')

    const activeTabName = computed(() => {
        const tab = props.tabs.find((t) => t.id === activeTab.value)
        return tab?.name || '热门'
    })

    const switchTab = (tabId: number | string) => {
        activeTab.value = tabId
        // 这里可以根据 tabId 加载不同的商品数据
        console.log('切换到标签:', tabId)
    }

    const goToProduct = (productId: number) => {
        router.push(`/product/${productId}`)
    }

    const viewMore = () => {
        // 跳转到分类列表页
        router.push({
            path: '/category',
            query: {
                categoryId: props.categoryId,
                tab: activeTab.value,
            },
        })
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
