<template>
    <div class="flex flex-col h-screen bg-gray-50 overflow-hidden">
        <!-- 顶部导航 - 保持固定 -->
        <div class="shrink-0 z-30 shadow-sm">
            <Header />
        </div>

        <!-- 主内容滚动区 -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div class="max-w-350 mx-auto px-6 lg:px-10 py-8">
                <!-- 搜索头部（分类 + 排序） -->
                <SearchHeader
                    :categories="categories"
                    :active-category="activeCategory"
                    :sort-type="sortType"
                    :keyword="keyword"
                    :total="total"
                    @update:active-category="handleCategoryChange"
                    @update:sort-type="handleSortTypeChange"
                />

                <!-- 商品展示区 -->
                <ProductList
                    :products="products"
                    :loading="loading"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :total="total"
                    @product-click="goToProduct"
                    @reset="resetSearch"
                    @size-change="handleSizeChange"
                    @page-change="handlePageChange"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import Header from '@/views/home/model/Header.vue'
    import SearchHeader from './model/SearchHeader.vue'
    import ProductList from './model/ProductList.vue'

    import { searchGoods, type GoodsItem } from '@/api/goods'
    import { fetchCategories, type Category } from '@/api/category'

    const route = useRoute()
    const router = useRouter()

    // 状态管理
    const keyword = ref<string>('')
    const categories = ref<Category[]>([])
    const activeCategory = ref<string>('all')
    const sortType = ref<'default' | 'new' | 'sales'>('default')
    const products = ref<GoodsItem[]>([])
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(12)
    const total = ref(0)

    // 处理分类切换
    const handleCategoryChange = (categoryId: string) => {
        activeCategory.value = categoryId
        currentPage.value = 1
        loadProducts()
    }

    // 处理排序方式改变
    const handleSortTypeChange = (type: 'default' | 'new' | 'sales') => {
        sortType.value = type
        currentPage.value = 1
        loadProducts()
    }

    // 重置搜索
    const resetSearch = () => {
        keyword.value = ''
        activeCategory.value = 'all'
        sortType.value = 'default'
        currentPage.value = 1
        loadProducts()
    }

    // 加载商品列表
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

    // 跳转到商品详情
    const goToProduct = (productId: string) => {
        router.push(`/goods/${productId}`)
    }

    // 处理每页数量改变
    const handleSizeChange = (size: number) => {
        pageSize.value = size
        currentPage.value = 1
        loadProducts()
    }

    // 处理页码改变
    const handlePageChange = (page: number) => {
        currentPage.value = page
        loadProducts()
        const scrollContainer = document.querySelector('.overflow-y-auto')
        if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // 监听路由中的关键词参数
    watch(
        () => route.query.keyword,
        (newKeyword) => {
            keyword.value = (newKeyword as string) || ''
            currentPage.value = 1
            activeCategory.value = 'all'
            sortType.value = 'default'
            loadProducts()
        },
        { immediate: true },
    )

    // 加载分类列表
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
</style>
