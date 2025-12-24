<template>
    <div class="flex flex-col h-screen overflow-hidden bg-slate-50">
        <el-header class="sticky top-0 z-30 shrink-0" style="padding-bottom: 10px">
            <Header />
        </el-header>

        <el-main class="flex-1 overflow-y-auto overflow-x-hidden space-y-5">
          <NoticeBar />
            <div class="p-4">
                <el-container class="h-120">
                    <el-aside width="280px" class="categoryAside">
                        <CategorySidebar :categories="categories" @select="handleCategorySelect" />
                    </el-aside>
                    <el-main style="padding: 0 16px">
                        <BannerCarousel
                            class="overflow-hidden rounded-2xl shadow-lg shadow-gray-200"
                            :banners="banners"
                            :interval="5000"
                            arrow="always"
                            :motion-blur="true"
                        />
                    </el-main>

                    <el-aside width="280px">
                        <!-- 个人信息组件 -->
                        <div
                            class="shadow-md flex flex-col gap-6 rounded-2xl w-full h-full items-center p-6 bg-white border border-gray-100"
                        >
                            <!-- 头像部分 -->
                            <div class="relative group cursor-pointer" @click="goToProfile">
                                <div
                                    class="absolute -inset-0.5 bg-linear-to-r from-orange-400 to-pink-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"
                                ></div>
                                <img
                                    :src="user.avatar"
                                    :alt="user.nickname"
                                    class="relative rounded-full bg-gray-100 object-cover w-20 h-20 border-2 border-white shadow-sm"
                                />
                            </div>

                            <!-- 用户名/欢迎语 -->
                            <div class="text-center cursor-pointer" @click="goToProfile">
                                <h2 class="text-lg font-bold text-gray-800 mb-1">
                                    Hi, {{ user.nickname }}
                                </h2>
                                <p class="text-xs text-gray-400">欢迎来到在线商城</p>
                            </div>

                            <!-- 登录/注册状态 -->
                            <div v-if="!isLoggedIn" class="w-full space-y-4">
                                <div class="flex justify-center gap-4 text-sm">
                                    <router-link
                                        to="/register"
                                        class="text-gray-600 hover:text-orange-500 transition-colors"
                                        >注册</router-link
                                    >
                                    <span class="text-gray-300">|</span>
                                    <router-link
                                        to="/openStore"
                                        class="text-gray-600 hover:text-orange-500 transition-colors"
                                        >开店</router-link
                                    >
                                </div>
                                <el-button
                                    type="primary"
                                    class="w-full bg-orange-500! border-orange-500! hover:bg-orange-600! rounded-xl! h-10! font-bold shadow-lg shadow-orange-200"
                                    @click="goToLogin"
                                >
                                    立即登录
                                </el-button>
                            </div>

                            <div v-else class="w-full py-2 bg-orange-50 rounded-xl text-center">
                                <span class="text-sm text-orange-600 font-medium">
                                    尊贵的会员，欢迎回来
                                </span>
                            </div>

                            <!-- 功能入口 -->
                            <div class="grid grid-cols-3 gap-2 w-full pt-4 border-t border-gray-50">
                                <div
                                    class="flex flex-col items-center gap-2 cursor-pointer group"
                                    @click="goToOrders"
                                >
                                    <div
                                        class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all"
                                    >
                                        <el-icon :size="24"><Tickets /></el-icon>
                                    </div>
                                    <span class="text-xs text-gray-600 group-hover:text-orange-500"
                                        >我的订单</span
                                    >
                                </div>
                                <div
                                    class="flex flex-col items-center gap-2 cursor-pointer group"
                                    @click="goToFavorites"
                                >
                                    <div
                                        class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all"
                                    >
                                        <el-icon :size="24"><Star /></el-icon>
                                    </div>
                                    <span class="text-xs text-gray-600 group-hover:text-blue-500"
                                        >我的收藏</span
                                    >
                                </div>
                                <div
                                    class="flex flex-col items-center gap-2 cursor-pointer group"
                                    @click="goToAddress"
                                >
                                    <div
                                        class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all"
                                    >
                                        <el-icon :size="24"><Location /></el-icon>
                                    </div>
                                    <span class="text-xs text-gray-600 group-hover:text-green-500"
                                        >收货地址</span
                                    >
                                </div>
                            </div>
                        </div>
                    </el-aside>
                </el-container>

                <!-- <div class="mt-6">
                    <GuessYouLike :title="'猜你喜欢'" :items="likedItems" />
                </div> -->

                <!-- 分类商品展示组件 -->
                <div class="mt-6" v-for="cat in topCategories" :key="cat.id">
                    <CategoryProducts
                        :category-title="cat.name"
                        :category-id="cat.id"
                        :tabs="categoryTabsMap[cat.id] || []"
                        :goodsList="
                            categoryProductsMap[cat.id]?.[categoryActiveTabMap[cat.id]] || []
                        "
                        :active-tab="categoryActiveTabMap[cat.id]"
                        @product-click="(goodsId, storeId) => handleGoodsClick(goodsId)"
                        @tab-change="(tabId) => handleTabChange(cat.id, tabId)"
                        @view-more="(categryName) => handleViewMore(categryName)"
                    />
                </div>
            </div>

            <Footer />
        </el-main>
    </div>
</template>

<script setup lang="ts">
    import {
        fetchBanner,
        fetchCategory,
        fetchProductsByCategory,
        type BannerItem,
        type CategoryItem,
        type User,
    } from '@/api/home'
    import BannerCarousel from '@/components/banner/BannerCarousel.vue'
    import NoticeBar from './model/NoticeBar.vue'
    import CategorySidebar from './model/CategorySidebar.vue'
    import Header from '@/views/home/model/Header.vue'
    import CategoryProducts from '@/views/home/model/CategoryProducts.vue'
    import Footer from '@/views/home/model/Footer.vue'
    import { useUserStore } from '@/stores/user'
    import { onMounted, ref, computed, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { Tickets, Star, Location } from '@element-plus/icons-vue'
    import type { GoodsItem } from '@/api/goods'

    const banners = ref<BannerItem[]>([])
    const router = useRouter()
    const loadBanner = async () => {
        const res = await fetchBanner()
        banners.value = res.data
    }

    const categories = ref<CategoryItem[]>([])

    // 顶级分类
    const topCategories = ref<CategoryItem[]>([])
    // 每个顶级分类的二级分类
    const categoryTabsMap = ref<Record<string, { id: string; name: string }[]>>({})
    // 每个顶级分类当前激活的tab
    const categoryActiveTabMap = ref<Record<string, string>>({})
    // 每个分类每个tab对应的商品列表
    const categoryProductsMap = ref<Record<string, Record<string, GoodsItem[]>>>({})

    // 异步加载猜你喜欢（示例），目前暂不调用（已在 onMounted 注释掉）
    // const loadLiked = async () => {
    //     try {
    //         const res = await fetchRecommendedProducts({ limit: 10 })
    //         likedItems.value = res.data || []
    //     } catch (err) {
    //         console.error('加载推荐商品失败', err)
    //     }
    // }

    const userStore = useUserStore()

    const user = computed<User>(() => {
        return {
            id: userStore.id ? parseInt(userStore.id) : 0,
            nickname: userStore.nickname || 'Guest',
            avatar: userStore.avatar || '/default-avatar.png',
        }
    })

    const isLoggedIn = computed(() => {
        return !!userStore.token || !!userStore.id
    })

    const loadCategoryAndProducts = async () => {
        const res = await fetchCategory()
        categories.value = res.data
        // 过滤出所有 level === 1 的顶级分类
        topCategories.value = categories.value.filter((cat) => cat.level === 1)

        // 为每个顶级分类找出二级分类
        for (const cat of topCategories.value) {
            const subCats = categories.value.filter((c) => c.parentId === cat.id && c.level === 2)
            categoryTabsMap.value[cat.id] = subCats
            // 默认激活第一个tab
            const firstTab = subCats[0]
            if (firstTab) {
                categoryActiveTabMap.value[cat.id] = firstTab.id
                loadProducts(cat.id, firstTab.id)
            }
        }
        console.log('顶级分类直接子类', categoryTabsMap)
        console.log('顶级分类：', topCategories.value)
        console.log('所有分类：', categories.value)
    }

    const loadProducts = async (categoryId: string, tabId: string) => {
        const res = await fetchProductsByCategory(tabId)
        if (!categoryProductsMap.value[categoryId]) {
            categoryProductsMap.value[categoryId] = {}
        }
        categoryProductsMap.value[categoryId][tabId] = res.data || []
    }

    watch(
        () => [userStore.id, userStore.token],
        async ([newId, newToken], [oldId, oldToken]) => {
            if (newId !== oldId || newToken !== oldToken) {
                console.log('用户信息已变化，重新加载首页数据')
                // 重新拉取页面数据
                await loadBanner()
                await loadCategoryAndProducts()
                // 如果需要重新加载“猜你喜欢”，取消下面的注释
                // await loadLiked()
            }
        },
    )

    const goToLogin = () => {
        router.push('/auth/login')
    }

    const goToProfile = () => {
        router.push({ name: 'profile' }).catch(() => {})
    }

    const goToOrders = () => {
        router.push({ name: 'profile', query: { tab: 'orders' } }).catch(() => {})
    }

    const goToFavorites = () => {
        router.push({ name: 'profile', query: { tab: 'favorites' } }).catch(() => {})
    }

    const goToAddress = () => {
        router.push({ name: 'profile', query: { tab: 'address' } }).catch(() => {})
    }

    // 来自 CategorySidebar 的选择回调：跳转到搜索页并带上 categoryId
    const handleCategorySelect = (payload: { id: string; name: string }) => {
        console.log(payload)
        const { id, name } = payload
        // router.push({ path: '/search', query: { categoryId: id, keyword: name } })
        router.push({ name: 'Search', query: { keyword: name } })
    }

    function handleGoodsClick(goodsId: string) {
        router.push({
            name: 'GoodsDetail',
            params: { goodsId },
        })
    }

    function handleTabChange(categoryId: string, tabId: string) {
        categoryActiveTabMap.value[categoryId] = tabId
        loadProducts(categoryId, tabId)
    }

    function handleViewMore(categoryName: string) {
        router.push({ name: 'Search', query: { keyword: categoryName } })
    }

    onMounted(() => {
        loadBanner()
        loadCategoryAndProducts()
        // 如果需要从接口加载“猜你喜欢”，取消下面调用的注释即可
        // loadLiked()
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

    :deep(.el-footer) {
        padding: 0 !important;
        height: auto !important;
    }

    :deep(.el-container) {
        display: flex !important;
    }

    :deep(.categoryAside) {
        overflow: visible;
    }
</style>
