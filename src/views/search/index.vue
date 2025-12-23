```vue /home/Tomatos/Projects/design/oneline-shop-buyer/src/views/search/index.vue
<template>
    <div class="flex flex-col h-screen bg-gray-50 overflow-hidden">
        <!-- 顶部导航 - 保持固定 -->
        <div class="shrink-0 z-30 shadow-sm">
            <Header />
        </div>

        <!-- 主内容滚动区 -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div class="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
                <!-- 筛选与排序区域 -->
                <div class="flex flex-col gap-4 mb-8">
                    <!-- 分类选择 -->
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md"
                    >
                        <div class="flex items-start gap-6">
                            <span
                                class="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2 shrink-0"
                                >分类</span
                            >
                            <div class="flex gap-2.5 flex-wrap">
                                <button
                                    v-for="category in [
                                        { id: 'all', name: '全部商品' },
                                        ...categories,
                                    ]"
                                    :key="category.id"
                                    :class="[
                                        'px-5 py-1.5 rounded-xl text-sm font-bold transition-all border',
                                        activeCategory === category.id
                                            ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-100'
                                            : 'bg-gray-50 border-transparent text-gray-500 hover:bg-orange-50 hover:text-orange-500',
                                    ]"
                                    @click="switchCategory(category.id)"
                                >
                                    {{ category.name }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 排序工具栏 -->
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 px-6 flex flex-wrap items-center justify-between gap-4"
                    >
                        <div class="flex items-center gap-6">
                            <span class="text-gray-400 font-bold text-xs uppercase tracking-widest"
                                >排序</span
                            >
                            <div class="flex bg-gray-100 p-1 rounded-xl">
                                <button
                                    v-for="sort in sortOptions"
                                    :key="sort.value"
                                    :class="[
                                        'px-6 py-1.5 rounded-lg text-sm font-bold transition-all',
                                        sortType === sort.value
                                            ? 'bg-white text-orange-500 shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600',
                                    ]"
                                    @click="changeSortType(sort.value)"
                                >
                                    {{ sort.label }}
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center gap-3">
                            <div class="h-8 w-[1px] bg-gray-100 mx-2 hidden sm:block"></div>
                            <span class="text-sm text-gray-400">
                                找到
                                <span class="text-gray-900 font-black">{{ total }}</span> 件关于
                                <span class="text-orange-500 font-bold"
                                    >"{{ keyword || '全部' }}"</span
                                >
                                的商品
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 商品展示区 -->
                <div class="min-h-[500px]">
                    <!-- 加载中状态 -->
                    <div v-if="loading" class="flex flex-col justify-center items-center py-32">
                        <div class="loading-dots">
                            <span></span><span></span><span></span><span></span>
                        </div>
                        <p class="mt-6 text-gray-400 font-medium animate-pulse">
                            正在为您筛选优质商品...
                        </p>
                    </div>

                    <!-- 空状态 -->
                    <div
                        v-else-if="products.length === 0"
                        class="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm"
                    >
                        <div
                            class="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6"
                        >
                            <el-icon :size="40" class="text-orange-200"><Box /></el-icon>
                        </div>
                        <h3 class="text-lg font-bold text-gray-800">未找到匹配商品</h3>
                        <p class="text-gray-400 text-sm mt-2 mb-8">
                            尝试调整关键词或分类以获得更多结果
                        </p>
                        <el-button
                            round
                            class="border-orange-500! text-orange-500! hover:bg-orange-50!"
                            @click="resetSearch"
                        >
                            重置搜索条件
                        </el-button>
                    </div>

                    <!-- 商品列表 -->
                    <div v-else>
                        <div class="products-grid">
                            <div
                                v-for="product in products"
                                :key="product.id"
                                class="product-card group bg-white rounded-2xl p-4 cursor-pointer hover:shadow-2xl hover:shadow-orange-100 transition-all duration-300 border border-gray-100 hover:border-orange-200"
                                @click="goToProduct(product.id)"
                            >
                                <div class="flex flex-col h-full">
                                    <!-- 商品图片 -->
                                    <div
                                        class="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center"
                                    >
                                        <img
                                            :src="product.image"
                                            :alt="product.name"
                                            class="max-w-[85%] max-h-[85%] object-contain transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div
                                            class="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                        >
                                            <div
                                                class="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform"
                                            >
                                                <span class="text-xs font-bold text-orange-500"
                                                    >查看详情</span
                                                >
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
                                            {{ product.description }}
                                        </p>

                                        <div class="mt-auto">
                                            <div class="flex items-center justify-between mb-3">
                                                <div class="flex items-baseline gap-0.5">
                                                    <span
                                                        class="text-orange-500 text-xl font-black"
                                                        >{{ product.price }}</span
                                                    >
                                                    <span class="text-orange-500 text-xs font-bold"
                                                        >元</span
                                                    >
                                                    <span
                                                        v-if="product.originalPrice"
                                                        class="ml-2 text-xs text-gray-300 line-through"
                                                    >
                                                        {{ product.originalPrice }}元
                                                    </span>
                                                </div>
                                                <span class="text-[10px] text-gray-400"
                                                    >销量 {{ product.sales || 0 }}</span
                                                >
                                            </div>

                                            <!-- 标签 -->
                                            <div
                                                v-if="product.tags && product.tags.length > 0"
                                                class="flex gap-1.5 flex-wrap"
                                            >
                                                <span
                                                    v-for="tag in product.tags.slice(0, 2)"
                                                    :key="tag"
                                                    class="text-[10px] px-2 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100"
                                                >
                                                    {{ tag }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 分页 -->
                        <div v-if="total > pageSize" class="flex justify-center mt-16 pb-10">
                            <el-pagination
                                v-model:current-page="currentPage"
                                v-model:page-size="pageSize"
                                :page-sizes="[12, 24, 48]"
                                :total="total"
                                layout="total, prev, pager, next"
                                class="custom-pagination"
                                @size-change="handleSizeChange"
                                @current-change="handlePageChange"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { Box } from '@element-plus/icons-vue'
    import Header from '@/views/home/model/Header.vue'

    import { searchGoods, type GoodsItem } from '@/api/goods'
    import { fetchCategories, type Category } from '@/api/category'

    const route = useRoute()
    const router = useRouter()

    const keyword = ref<string>('')
    const categories = ref<Category[]>([])
    const activeCategory = ref<string>('all')
    const sortType = ref<'default' | 'new' | 'sales'>('default')
    const products = ref<GoodsItem[]>([])
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(12)
    const total = ref(0)

    const sortOptions = [
        { label: '综合', value: 'default' },
        { label: '新品', value: 'new' },
        { label: '销量', value: 'sales' },
    ] as const

    const switchCategory = (categoryId: string) => {
        activeCategory.value = categoryId
        currentPage.value = 1
        loadProducts()
    }

    const changeSortType = (type: 'default' | 'new' | 'sales') => {
        sortType.value = type
        currentPage.value = 1
        loadProducts()
    }

    const resetSearch = () => {
        keyword.value = ''
        activeCategory.value = 'all'
        currentPage.value = 1
        loadProducts()
    }

    const loadProducts = async () => {
        loading.value = true
        try {
            const params: Record<string, unknown> = {
                page: currentPage.value,
                pageSize: pageSize.value,
                sortType: sortType.value,
            }

            if (keyword.value) {
                params.keyword = keyword.value
            }

            if (activeCategory.value !== 'all') {
                params.categoryId = activeCategory.value
            }

            const res = await searchGoods(params)
            products.value = res.data.records
            total.value = res.data.total
        } catch (error) {
            console.error('加载商品失败:', error)
            products.value = []
        } finally {
            loading.value = false
        }
    }

    const goToProduct = (productId: string) => {
        router.push(`/goods/${productId}`)
    }

    const handleSizeChange = (size: number) => {
        pageSize.value = size
        currentPage.value = 1
        loadProducts()
    }

    const handlePageChange = (page: number) => {
        currentPage.value = page
        loadProducts()
        const scrollContainer = document.querySelector('.overflow-y-auto')
        if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
    }

    watch(
        () => route.query.keyword,
        (newKeyword) => {
            keyword.value = (newKeyword as string) || ''
            currentPage.value = 1
            activeCategory.value = 'all'
            loadProducts()
        },
        { immediate: true },
    )

    const loadCategories = async () => {
        try {
            const res = await fetchCategories()
            categories.value = res.data.filter((cat) => cat.level == 1)
        } catch (error) {
            console.error('加载分类失败:', error)
            categories.value = []
        }
    }

    onMounted(() => {
        keyword.value = (route.query.keyword as string) || ''
        loadCategories()
        loadProducts()
    })
</script>

<style scoped>
    /* 隐藏原生滚动条但保留功能 */
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #e5e7eb;
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background-color: transparent;
    }

    /* 商品网格布局 - 响应式 */
    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 24px;
    }

    /* 加载动画 */
    .loading-dots {
        display: flex;
        gap: 8px;
    }
    .loading-dots span {
        width: 12px;
        height: 12px;
        background-color: #f97316;
        border-radius: 50%;
        animation: bounce 0.5s infinite alternate;
    }
    .loading-dots span:nth-child(2) {
        animation-delay: 0.1s;
    }
    .loading-dots span:nth-child(3) {
        animation-delay: 0.2s;
    }
    .loading-dots span:nth-child(4) {
        animation-delay: 0.3s;
    }

    @keyframes bounce {
        to {
            transform: translateY(-10px);
            opacity: 0.5;
        }
    }

    /* 分页样式定制 */
    :deep(.custom-pagination) {
        --el-color-primary: #f97316;
    }
    :deep(.custom-pagination .el-pager li:hover) {
        color: #f97316;
    }
    :deep(.custom-pagination .el-pager li.is-active) {
        background-color: #f97316 !important;
        color: #fff !important;
        border-radius: 8px;
    }

    /* 文本截断 */
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
