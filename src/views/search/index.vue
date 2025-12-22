<template>
    <div class="flex flex-col h-screen overflow-hidden bg-gray-100">
        <el-header class="sticky top-0 z-30 shrink-0" style="padding-bottom: 10px">
            <Header />
        </el-header>

        <el-main class="flex-1 overflow-y-auto overflow-x-hidden">
            <div class="max-w-7xl mx-auto p-6">
                <!-- 分类导航 -->
                <div class="bg-white rounded-2xl shadow mb-6 p-4">
                    <div class="flex items-center gap-3">
                        <span class="text-gray-700 font-medium">商品分类:</span>
                        <div class="flex gap-2 flex-wrap">
                            <el-tag
                                :type="activeCategory === 'all' ? 'danger' : 'info'"
                                :effect="activeCategory === 'all' ? 'dark' : 'plain'"
                                class="cursor-pointer"
                                @click="switchCategory('all')"
                            >
                                全部
                            </el-tag>
                            <el-tag
                                v-for="category in categories"
                                :key="category.id"
                                :type="activeCategory === category.id ? 'danger' : 'info'"
                                :effect="activeCategory === category.id ? 'dark' : 'plain'"
                                class="cursor-pointer"
                                @click="switchCategory(category.id)"
                            >
                                {{ category.name }}
                            </el-tag>
                        </div>
                    </div>
                </div>

                <!-- 排序和筛选栏 -->
                <div class="bg-white rounded-2xl shadow mb-6 p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <span class="text-gray-700">排序:</span>
                            <div class="flex gap-2">
                                <el-button
                                    :type="sortType === 'default' ? 'primary' : 'default'"
                                    size="small"
                                    @click="changeSortType('default')"
                                >
                                    综合
                                </el-button>
                                <el-button
                                    :type="sortType === 'new' ? 'primary' : 'default'"
                                    size="small"
                                    @click="changeSortType('new')"
                                >
                                    新品
                                </el-button>
                                <el-button
                                    :type="sortType === 'sales' ? 'primary' : 'default'"
                                    size="small"
                                    @click="changeSortType('sales')"
                                >
                                    销量
                                </el-button>
                            </div>
                        </div>

                        <div class="text-gray-600">
                            搜索关键词:
                            <span class="text-orange-500 font-semibold">{{ keyword || '无' }}</span>
                        </div>
                    </div>
                </div>

                <!-- 商品网格 -->
                <div class="bg-white rounded-2xl shadow p-6">
                    <!-- 加载中状态 -->
                    <div v-if="loading" class="flex justify-center items-center py-20">
                        <div class="loading-spinner"></div>
                        <span class="ml-3 text-gray-500">加载中...</span>
                    </div>

                    <!-- 空状态 -->
                    <div
                        v-else-if="products.length === 0"
                        class="flex flex-col items-center justify-center py-20"
                    >
                        <el-icon :size="80" class="text-gray-300 mb-4">
                            <box />
                        </el-icon>
                        <p class="text-gray-500 text-lg">暂无商品</p>
                        <p class="text-gray-400 text-sm mt-2">换个关键词试试吧</p>
                    </div>

                    <!-- 商品列表 -->
                    <div v-else class="products-grid">
                        <div
                            v-for="product in products"
                            :key="product.id"
                            class="product-card bg-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all border border-gray-100 hover:border-orange-300"
                            @click="goToProduct(product.id)"
                        >
                            <div class="flex flex-col h-full">
                                <!-- 商品图片 -->
                                <div
                                    class="flex-1 flex items-center justify-center mb-3 overflow-hidden rounded-lg bg-gray-50"
                                >
                                    <img
                                        :src="product.image"
                                        :alt="product.name"
                                        class="max-w-full max-h-48 object-contain transition-transform hover:scale-105"
                                    />
                                </div>

                                <!-- 商品名称 -->
                                <h4
                                    class="text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-10"
                                >
                                    {{ product.name }}
                                </h4>

                                <!-- 商品描述 -->
                                <p class="text-xs text-gray-500 mb-3 line-clamp-1">
                                    {{ product.description }}
                                </p>

                                <!-- 价格和销量 -->
                                <div class="flex items-end justify-between">
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
                                    <div class="text-xs text-gray-400">
                                        已售{{ product.sales || 0 }}
                                    </div>
                                </div>

                                <!-- 标签 -->
                                <div
                                    v-if="product.tags && product.tags.length > 0"
                                    class="flex gap-1 mt-2"
                                >
                                    <el-tag
                                        v-for="tag in product.tags"
                                        :key="tag"
                                        size="small"
                                        type="warning"
                                        effect="plain"
                                    >
                                        {{ tag }}
                                    </el-tag>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分页 -->
                    <div v-if="total > pageSize" class="flex justify-center mt-8">
                        <el-pagination
                            v-model:current-page="currentPage"
                            v-model:page-size="pageSize"
                            :page-sizes="[12, 24, 48, 96]"
                            :total="total"
                            layout="total, sizes, prev, pager, next, jumper"
                            @size-change="handleSizeChange"
                            @current-change="handlePageChange"
                        />
                    </div>
                </div>
            </div>
        </el-main>
        <Footer />
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { Box } from '@element-plus/icons-vue'
    import Header from '@/views/home/model/Header.vue'
    import Footer from '@/views/home/model/Footer.vue'

    interface Product {
        id: number
        name: string
        description: string
        image: string
        price: string | number
        originalPrice?: string | number
        sales?: number
        tags?: string[]
    }

    interface Category {
        id: string | number
        name: string
    }

    const route = useRoute()
    const router = useRouter()

    // 搜索关键词
    const keyword = ref<string>('')

    // 分类数据
    const categories = ref<Category[]>([
        { id: 'clothing', name: '女装' },
        { id: 'electronics', name: '智能穿戴' },
        { id: 'record', name: '笔记本平板' },
        { id: 'phone', name: '智能手机' },
        { id: 'appliances', name: '家用家电' },
        { id: 'audio', name: '影音娱乐' },
        { id: 'accessories', name: '箱包手袋' },
        { id: 'beauty', name: '护肤彩妆' },
        { id: 'outdoor', name: '户外运动' },
        { id: 'toys', name: '玩具礼品' },
    ])

    // 当前选中的分类
    const activeCategory = ref<string | number>('all')

    // 排序类型
    const sortType = ref<'default' | 'new' | 'sales'>('default')

    // 商品列表
    const products = ref<Product[]>([])

    // 加载状态
    const loading = ref(false)

    // 分页
    const currentPage = ref(1)
    const pageSize = ref(12)
    const total = ref(0)

    // 模拟商品数据
    const mockProducts: Product[] = [
        {
            id: 1,
            name: 'BJHQ不计后果男女秋冬美式巴洛克风手绣条杠彩色针织卫衣套装',
            description: '潮流时尚 舒适面料',
            image: 'https://tse2.mm.bing.net/th/id/OIP.YtiN-hpBNBdEAQq0oYN_vAHaD-?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
            price: '269',
            originalPrice: '399',
            sales: 9999,
            tags: ['热销', '包邮'],
        },
        {
            id: 2,
            name: '蓝牙大阳能充电手环手表电话',
            description: '智能运动 健康监测',
            image: 'https://gd4.alicdn.com/imgextra/i1/2211064776913/O1CN01KA8gAB1JrnLCrJkIS_!!2211064776913.jpg',
            price: '159',
            sales: 9997,
            tags: ['精选'],
        },
        {
            id: 3,
            name: '赫莲娜绿宝瓶',
            description: '高端护肤 奢华体验',
            image: 'https://img.alicdn.com/imgextra/i2/2211064776913/O1CN01QcqKhT1JrnMNrOEci_!!2211064776913.jpg',
            price: '990',
            sales: 9999,
            tags: ['热销'],
        },
        {
            id: 4,
            name: '星美提拉紧致精华露',
            description: '紧致肌肤 焕发光彩',
            image: 'https://img.alicdn.com/imgextra/i3/2211064776913/O1CN01xVr0dD1JrnLyiqBdv_!!2211064776913.jpg',
            price: '109',
            sales: 9995,
            tags: ['精选'],
        },
        {
            id: 5,
            name: '小米电视 S Mini LED 系列',
            description: 'Mini LED 悬浮屏设计',
            image: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/29e4e456c5dd08c395ac4ddf2e1be473.jpg',
            price: '2999',
            originalPrice: '3499',
            sales: 5000,
            tags: ['新品', '热销'],
        },
        {
            id: 6,
            name: 'Redmi 智能电视 X 2025款',
            description: '240Hz高刷 4+64GB',
            image: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/d9f30b3e28bc5f61d0c5e1d55f7eac58.png',
            price: '3499',
            sales: 3500,
            tags: ['新品'],
        },
        {
            id: 7,
            name: '巨省电Pro 1.5匹超一级能效',
            description: '新一代巨省电Pro',
            image: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/6ed84c456dca61f1a3d9e59dd6f92d14.png',
            price: '2499',
            originalPrice: '2999',
            sales: 8000,
            tags: ['热销', '包邮'],
        },
        {
            id: 8,
            name: '米家迷你滚筒洗衣机Pro 3kg',
            description: '小巧便携 高效洗涤',
            image: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/a3c3f4c1e1e6b9b4e6d6f2e0f3e8a9c1.png',
            price: '399',
            sales: 2000,
            tags: ['精选'],
        },
        {
            id: 9,
            name: '时尚休闲外套 女装秋冬新款',
            description: '韩版宽松 潮流百搭',
            image: 'https://tse2.mm.bing.net/th/id/OIP.YtiN-hpBNBdEAQq0oYN_vAHaD-?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
            price: '199',
            originalPrice: '299',
            sales: 6000,
            tags: ['热销'],
        },
        {
            id: 10,
            name: '智能手表运动版',
            description: '全天候健康监测',
            image: 'https://gd4.alicdn.com/imgextra/i1/2211064776913/O1CN01KA8gAB1JrnLCrJkIS_!!2211064776913.jpg',
            price: '299',
            sales: 4500,
            tags: ['新品', '精选'],
        },
        {
            id: 11,
            name: '轻薄笔记本电脑 商务办公',
            description: '高性能 长续航',
            image: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/d604255f1d085b36a0a2b2f5c88917e0.png',
            price: '4999',
            sales: 1200,
            tags: ['新品'],
        },
        {
            id: 12,
            name: '真无线蓝牙耳机',
            description: '主动降噪 HiFi音质',
            image: 'https://gd4.alicdn.com/imgextra/i1/2211064776913/O1CN01KA8gAB1JrnLCrJkIS_!!2211064776913.jpg',
            price: '599',
            originalPrice: '799',
            sales: 7000,
            tags: ['热销', '包邮'],
        },
    ]

    // 切换分类
    const switchCategory = (categoryId: string | number) => {
        activeCategory.value = categoryId
        currentPage.value = 1
        loadProducts()
    }

    // 切换排序
    const changeSortType = (type: 'default' | 'new' | 'sales') => {
        sortType.value = type
        currentPage.value = 1
        loadProducts()
    }

    // 加载商品数据
    const loadProducts = async () => {
        loading.value = true

        try {
            // 模拟API请求延迟
            await new Promise((resolve) => setTimeout(resolve, 500))

            // 这里应该调用真实的API接口
            // const response = await fetchGoodsList({
            //     keyword: keyword.value,
            //     category: activeCategory.value,
            //     sort: sortType.value,
            //     page: currentPage.value,
            //     pageSize: pageSize.value
            // })

            // 模拟数据过滤和排序
            let filteredProducts = [...mockProducts]

            // 根据关键词筛选
            if (keyword.value) {
                filteredProducts = filteredProducts.filter(
                    (p) =>
                        p.name.toLowerCase().includes(keyword.value.toLowerCase()) ||
                        p.description.toLowerCase().includes(keyword.value.toLowerCase()),
                )
            }

            // 根据排序类型排序
            if (sortType.value === 'sales') {
                filteredProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0))
            } else if (sortType.value === 'new') {
                filteredProducts.reverse()
            }

            // 设置总数
            total.value = filteredProducts.length

            // 分页
            const start = (currentPage.value - 1) * pageSize.value
            const end = start + pageSize.value
            products.value = filteredProducts.slice(start, end)
        } catch (error) {
            console.error('加载商品失败:', error)
            products.value = []
        } finally {
            loading.value = false
        }
    }

    // 跳转到商品详情
    const goToProduct = (productId: number) => {
        router.push(`/product/${productId}`)
    }

    // 处理分页大小变化
    const handleSizeChange = (size: number) => {
        pageSize.value = size
        currentPage.value = 1
        loadProducts()
    }

    // 处理页码变化
    const handlePageChange = (page: number) => {
        currentPage.value = page
        loadProducts()
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // 监听路由查询参数变化
    watch(
        () => route.query.keyword,
        (newKeyword) => {
            keyword.value = (newKeyword as string) || ''
            currentPage.value = 1
            loadProducts()
        },
        { immediate: true },
    )

    onMounted(() => {
        keyword.value = (route.query.keyword as string) || ''
        loadProducts()
    })
</script>

<style scoped>
    /* 覆盖 Element Plus 默认样式 */
    :deep(.el-header) {
        padding: 0 !important;
        height: auto !important;
    }

    :deep(.el-main) {
        padding: 0;
        display: block !important;
    }

    /* 商品网格布局 */
    .products-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
    }

    .product-card {
        min-height: 320px;
        transition: all 0.3s ease;
    }

    .product-card:hover {
        transform: translateY(-4px);
    }

    /* 文本截断 */
    .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    /* 响应式设计 */
    @media (max-width: 1400px) {
        .products-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 1024px) {
        .products-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .products-grid {
            grid-template-columns: repeat(1, 1fr);
        }
    }

    /* Element Plus 标签样式优化 */
    :deep(.el-tag) {
        border-radius: 4px;
        font-size: 12px;
    }

    /* 分页样式 */
    :deep(.el-pagination) {
        justify-content: center;
    }

    /* 加载动画 */
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #ff6700;
        border-radius: 50%;
        animation: rotating 1s linear infinite;
    }

    @keyframes rotating {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
