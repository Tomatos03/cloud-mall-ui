<template>
    <div class="flex flex-col h-screen overflow-hidden bg-slate-50">
        <!-- 顶部导航栏 -->
        <el-header class="sticky top-0 z-30 shrink-0" style="padding-bottom: 10px">
            <Header />
        </el-header>

        <!-- 店铺主体内容 -->
        <el-main class="flex-1 overflow-y-auto overflow-x-hidden">
            <div class="max-w-7xl mx-auto p-6 space-y-6">
                <!-- 加载中状态 -->
                <div
                    v-if="loading"
                    class="flex flex-col items-center justify-center py-32 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                    <el-icon class="text-4xl text-orange-600 animate-spin">
                        <Loading />
                    </el-icon>
                    <p class="mt-4 text-gray-600 font-medium">正在为您加载店铺信息...</p>
                </div>

                <template v-else-if="storeInfo">
                    <!-- 店铺头部卡片 -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <!-- 店铺横幅 (如果有) -->
                        <div class="h-48 bg-linear-to-r from-orange-100 to-orange-50 relative">
                            <img
                                v-if="storeInfo.banner"
                                :src="getImageURL(storeInfo.banner)"
                                class="w-full h-full object-cover"
                                alt="店铺横幅"
                            />
                            <div v-else class="w-full h-full flex items-center justify-center opacity-20">
                                <el-icon :size="120" class="text-orange-300"><Shop /></el-icon>
                            </div>
                        </div>

                        <!-- 店铺基本信息 -->
                        <div class="px-8 pb-8 -mt-12 relative z-10">
                            <div class="flex flex-col md:flex-row items-end md:items-center gap-6">
                                <div class="relative">
                                    <img
                                        :src="getImageURL(storeInfo.avatarUrl)"
                                        :alt="storeInfo.name"
                                        class="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
                                    />
                                    <div class="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full p-1 border-2 border-white">
                                        <el-icon :size="16"><Check /></el-icon>
                                    </div>
                                </div>

                                <div class="flex-1 pt-14 md:pt-0">
                                    <div class="flex items-center gap-3 mb-2">
                                        <h1 class="text-3xl font-bold text-gray-900">{{ storeInfo.name }}</h1>
                                        <el-tag size="small" type="warning" effect="plain" class="border-orange-400! text-orange-700! bg-orange-50!">官方认证</el-tag>
                                    </div>
                                    <p class="text-gray-600 text-sm mb-4 max-w-2xl">{{ storeInfo.description }}</p>

                                    <div class="flex flex-wrap items-center gap-6">
                                        <div class="flex flex-col">
                                            <span class="text-xs text-gray-500 uppercase tracking-wider">综合评分</span>
                                            <div class="flex items-center gap-1">
                                                <span class="text-lg font-bold text-gray-900">{{ storeInfo.rating }}</span>
                                                <el-rate v-model="storeInfo.rating" disabled size="small" />
                                            </div>
                                        </div>
                                        <div class="w-px h-8 bg-gray-200 hidden sm:block"></div>
                                        <div class="flex flex-col">
                                            <span class="text-xs text-gray-500 uppercase tracking-wider">粉丝数</span>
                                            <span class="text-lg font-bold text-gray-900">{{ formatNumber(storeInfo.followerCount) }}</span>
                                        </div>
                                        <div class="w-px h-8 bg-gray-200 hidden sm:block"></div>
                                        <div class="flex flex-col">
                                            <span class="text-xs text-gray-500 uppercase tracking-wider">全部商品</span>
                                            <span class="text-lg font-bold text-gray-900">{{ storeInfo.productCount }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex gap-3 pb-2">
                                    <el-button
                                        type="primary"
                                        class="bg-orange-500! border-orange-500! hover:bg-orange-600! rounded-xl! px-8 h-11 font-bold"
                                        @click="handleFollow"
                                    >
                                        {{ isFollowed ? '已关注' : '关注店铺' }}
                                    </el-button>
                                    <el-button
                                        class="rounded-xl! h-11 px-6 border-gray-200! hover:text-orange-500! hover:border-orange-200!"
                                        :icon="Share"
                                    >
                                        分享
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 商品列表区域 -->
                    <div class="space-y-6">
                        <!-- 搜索与筛选栏 -->
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div class="flex items-center gap-4 w-full md:w-auto">
                                <span class="font-bold text-gray-800 whitespace-nowrap">全部商品</span>
                                <div class="flex gap-2">
                                    <el-button
                                        v-for="sort in sortOptions"
                                        :key="sort.value"
                                        size="small"
                                        :type="currentSort === sort.value ? 'primary' : 'default'"
                                        class="rounded-lg!"
                                        :plain="currentSort !== sort.value"
                                        @click="currentSort = sort.value"
                                    >
                                        {{ sort.label }}
                                    </el-button>
                                </div>
                            </div>

                            <div class="relative w-full md:w-80">
                                <el-input
                                    v-model="searchQuery"
                                    placeholder="搜索店内商品"
                                    class="custom-search-input"
                                    :prefix-icon="Search"
                                    clearable
                                />
                            </div>
                        </div>

                        <!-- 商品网格 -->
                        <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            <div
                                v-for="product in filteredProducts"
                                :key="product.id"
                                class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
                                @click="viewProduct(product.id)"
                            >
                                <div class="aspect-square overflow-hidden bg-gray-50 relative">
                                    <img
                                        :src="getImageURL(product.img)"
                                        :alt="product.title"
                                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div v-if="product.sale && product.sale > 100" class="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                                        热销
                                    </div>
                                </div>
                                <div class="p-4">
                                    <h3 class="text-gray-900 font-bold line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                                        {{ product.title }}
                                    </h3>
                                    <p class="text-gray-500 text-xs line-clamp-1 mb-3">{{ product.desc }}</p>
                                    <div class="flex justify-between items-end">
                                        <div class="flex items-baseline gap-0.5">
                                            <span class="text-orange-700 text-xs font-bold">¥</span>
                                            <span class="text-orange-700 text-xl font-black">{{ fenToYuan(product.price) }}</span>
                                        </div>
                                        <span class="text-gray-500 text-[10px]">已售 {{ product.sale || 0 }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 空状态 -->
                        <div
                            v-else
                            class="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100"
                        >
                            <el-icon :size="64" class="text-gray-200 mb-4"><Search /></el-icon>
                            <p class="text-gray-500">没有找到相关商品</p>
                            <el-button
                                v-if="searchQuery"
                                type="primary"
                                link
                                class="mt-2 text-orange-600!"
                                @click="searchQuery = ''"
                            >
                                清除搜索条件
                            </el-button>
                        </div>
                    </div>
                </template>

                <!-- 错误状态 -->
                <div
                    v-else
                    class="flex flex-col items-center justify-center py-32 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                    <div class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                        <el-icon class="text-4xl text-gray-300"><Warning /></el-icon>
                    </div>
                    <p class="text-gray-600 text-lg font-medium">抱歉，该店铺不存在或已关闭</p>
                    <el-button
                        type="primary"
                        class="mt-6 bg-orange-600! border-orange-600! rounded-xl!"
                        @click="$router.push('/')"
                    >返回首页</el-button>
                </div>
            </div>

            <Footer />
        </el-main>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { ElMessage } from 'element-plus'
    import {
        Loading,
        Shop,
        Check,
        Share,
        Search,
        Warning
    } from '@element-plus/icons-vue'
    import Header from '@/views/home/model/Header.vue'
    import Footer from '@/views/home/model/Footer.vue'
    import {
        fetchStoreInfo,
        fetchStoreProducts,
        toggleFollowStore,
        type StoreItem,
        type StoreProductItem,
    } from '@/api/store'
    import { getImageURL } from '@/utils/image'
    import { fenToYuan } from '@/utils/price'

    const route = useRoute()
    const router = useRouter()
    const storeId = route.params.storeId as string

    const loading = ref(true)
    const storeInfo = ref<StoreItem | null>(null)
    const products = ref<StoreProductItem[]>([])
    const searchQuery = ref('')
    const isFollowed = ref(false)
    const currentSort = ref('default')

    const sortOptions = [
        { label: '综合', value: 'default' },
        { label: '销量', value: 'sales' },
        { label: '价格', value: 'price' },
        { label: '新品', value: 'new' }
    ]

    const filteredProducts = computed(() => {
        let result = [...products.value]

        // 搜索过滤
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase()
            result = result.filter((product) =>
                product.title.toLowerCase().includes(query) ||
                product.desc.toLowerCase().includes(query)
            )
        }

        // 排序逻辑 (示例)
        if (currentSort.value === 'price') {
            result.sort((a, b) => {
                const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price
                const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price
                return (priceA || 0) - (priceB || 0)
            })
        } else if (currentSort.value === 'sales') {
            result.sort((a, b) => (b.sale || 0) - (a.sale || 0))
        }

        return result
    })

    const loadStoreData = async () => {
        if (!storeId) {
            loading.value = false
            return
        }

        try {
            loading.value = true
            const [infoRes, productsRes] = await Promise.all([
                fetchStoreInfo(storeId),
                fetchStoreProducts(storeId)
            ])

            storeInfo.value = infoRes.data
            products.value = productsRes.data || []
        } catch (error) {
            console.error('加载店铺数据失败:', error)
            ElMessage.error('加载店铺数据失败')
        } finally {
            loading.value = false
        }
    }

    const handleFollow = async () => {
        try {
            await toggleFollowStore(storeId)
            isFollowed.value = !isFollowed.value
            ElMessage.success(isFollowed.value ? '关注成功' : '已取消关注')

            // 更新粉丝数 (本地模拟)
            if (storeInfo.value) {
                storeInfo.value.followerCount += isFollowed.value ? 1 : -1
            }
        } catch {
            ElMessage.error('操作失败，请稍后再试')
        }
    }

    const viewProduct = (productId: string) => {
        router.push({ name: 'GoodsDetail', params: { goodsId: productId } })
    }

    const formatNumber = (num?: number) => {
        if (!num) return '0'
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + 'w'
        }
        return num.toString()
    }

    onMounted(() => {
        loadStoreData()
    })
</script>

<style scoped>
    :deep(.el-header) {
        padding: 0 !important;
        height: auto !important;
    }

    :deep(.el-main) {
        padding: 0;
        display: block !important;
    }

    :deep(.custom-search-input .el-input__wrapper) {
        border-radius: 12px;
        background-color: #f8fafc;
        box-shadow: none !important;
        border: 1px solid #f1f5f9;
        padding: 0 12px;
        height: 40px;
    }

    :deep(.custom-search-input .el-input__wrapper.is-focus) {
        border-color: #f97316;
        background-color: #fff;
    }

    /* 隐藏滚动条但保持功能 */
    .overflow-y-auto {
        scrollbar-width: thin;
        scrollbar-color: #e2e8f0 transparent;
    }

    .overflow-y-auto::-webkit-scrollbar {
        width: 6px;
    }

    .overflow-y-auto::-webkit-scrollbar-track {
        background: transparent;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb {
        background-color: #e2e8f0;
        border-radius: 20px;
    }
</style>
