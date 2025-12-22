<template>
    <div class="flex flex-col h-screen overflow-hidden bg-gray-100">
        <el-header class="sticky top-0 z-30 shrink-0" style="padding-bottom: 10px">
            <Header />
        </el-header>

        <el-main class="flex-1 overflow-y-auto overflow-x-hidden space-y-5">
            <div class="p-4">
                <el-container class="h-100">
                    <el-aside width="300px" class="categoryAside">
                        <CategorySidebar :categories="categories" />
                    </el-aside>
                    <el-main style="padding: 0 16px">
                        <BannerCarousel
                            class="rounded-2xl overflow-hidden"
                            :banners="banners"
                            :interval="5000"
                            arrow="always"
                            :motion-blur="true"
                        />
                    </el-main>

                    <el-aside width="300px">
                        <!-- 个人信息组件 -->
                        <div
                            class="shadow flex flex-col gap-4 rounded-2xl w-full h-full justify-center items-center p-4 bg-white"
                        >
                            <img
                                :src="user.avatar"
                                :alt="user.nickname"
                                class="rounded-2xl bg-gray-400 text-white flex justify-center items-center w-24 h-24"
                            />
                            <h2 class="decoration-solid text-black font-bold">
                                {{ user.nickname }}
                            </h2>
                            <div v-if="!isLoggedIn">
                                <div class="flex flex-row gap-1 justify-center align-center">
                                    <router-link to="/register" class="text-blue-500"
                                        >注册</router-link
                                    >
                                    <router-link to="/openStore" class="text-blue-500"
                                        >开店</router-link
                                    >
                                </div>
                                <h3>还没有登录请先登录</h3>
                                <p class="text-gray-500/50">更懂你的搜索和推荐</p>
                                <el-button
                                    type="primary"
                                    class="w-full mb-5 h-5"
                                    size="large"
                                    @click="goToLogin"
                                >
                                    立即登录
                                </el-button>
                            </div>
                            <div v-else class="w-full mb-5 flex justify-center items-center">
                                <p class="text-gray-600">
                                    欢迎回来，<strong>{{ user.nickname }}</strong>
                                </p>
                            </div>
                            <div class="flex flex-row gap-4 align-center justify-around w-full">
                                <div class="icon-item cursor-pointer" @click="goToCart">
                                    <el-icon :size="30">
                                        <ShoppingCart />
                                    </el-icon>
                                    <p>购物车</p>
                                </div>
                                <div class="icon-item cursor-pointer" @click="goToFavorites">
                                    <el-icon :size="30">
                                        <collection />
                                    </el-icon>
                                    <p>收藏</p>
                                </div>

                                <div class="icon-item cursor-pointer" @click="goToAddress">
                                    <el-icon :size="30">
                                        <location />
                                    </el-icon>
                                    <p>地址</p>
                                </div>
                            </div>
                        </div>
                    </el-aside>
                </el-container>

                <!-- 猜你喜欢 -->
                <div class="mt-6">
                    <GuessYouLike :title="'猜你喜欢'" :items="likedItems" />
                </div>

                <!-- 分类商品展示组件 -->
                <div class="mt-6" v-for="cat in topCategories" :key="cat.id">
                    <CategoryProducts
                        :category-title="cat.text"
                        :category-id="cat.id"
                        :products="categoryProductsMap[cat.id] || []"
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
        type BannerItem,
        type CategoryItem,
        type User,
    } from '@/api/home'
    import BannerCarousel from '@/components/banner/BannerCarousel.vue'
    import CategorySidebar from './model/CategorySidebar.vue'
    import Header from '@/views/home/model/Header.vue'
    import GuessYouLike from '@/views/home/model/GuessYouLike.vue'
    import CategoryProducts from '@/views/home/model/CategoryProducts.vue'
    import Footer from '@/views/home/model/Footer.vue'
    import { useUserStore } from '@/stores/user'
    import { onMounted, ref, computed, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { ShoppingCart } from '@element-plus/icons-vue'
    import type { ProductItem } from '@/api/goods'

    const banners = ref<BannerItem[]>([])
    const router = useRouter()
    const loadBanner = async () => {
        const res = await fetchBanner()
        banners.value = res.data
    }

    const categories = ref<CategoryItem[]>([])

    // 新增：顶级分类和分类商品映射
    const topCategories = ref<CategoryItem[]>([])
    const categoryProductsMap = ref<Record<string, ProductItem[]>>({})

    // 猜你喜欢保持不变
    const likedItems = ref<ProductItem[]>([
        {
            id: 1,
            title: '寻常风格女装 休闲外套',
            img: 'https://tse2.mm.bing.net/th/id/OIP.YtiN-hpBNBdEAQq0oYN_vAHaD-?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
            price: '￥129',
        },
        {
            id: 2,
            title: '寻常风格女装 休闲外套',
            img: 'https://tse2.mm.bing.net/th/id/OIP.YtiN-hpBNBdEAQq0oYN_vAHaD-?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
            price: '￥129',
        },
        {
            id: 3,
            title: '寻常风格女装 休闲外套',
            img: 'https://tse2.mm.bing.net/th/id/OIP.YtiN-hpBNBdEAQq0oYN_vAHaD-?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
            price: '￥129',
        },

        {
            id: 4,
            title: '寻常风格女装 休闲外套',
            img: 'https://tse2.mm.bing.net/th/id/OIP.YtiN-hpBNBdEAQq0oYN_vAHaD-?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
            price: '￥129',
        },
    ])

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
            // 优先使用后端返回的 nickname 字段
            nickname: userStore.nickname || 'Guest',
            avatar: userStore.avatar || '/default-avatar.png',
        }
    })

    const isLoggedIn = computed(() => {
        return !!userStore.token || !!userStore.id
    })

    // 新增：加载分类并为每个顶级分类加载商品
    import { fetchProductsByCategory } from '@/api/home'

    const loadCategoryAndProducts = async () => {
        const res = await fetchCategory()
        categories.value = res.data
        console.log(res.data)
        // 过滤出所有 level === 1 的顶级分类
        topCategories.value = categories.value.filter((cat) => cat.level === 1)
        // 为每个顶级分类请求商品
        for (const cat of topCategories.value) {
            const prodRes = await fetchProductsByCategory(cat.id, 10)
            categoryProductsMap.value[cat.id] = prodRes.data
        }
        console.log(topCategories.value)
        console.log(categoryProductsMap.value)
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

    const goToCart = () => {
        router.push({ name: 'Cart' }).catch(() => {})
    }

    const goToAddress = () => {
        router.push({ name: 'Address' }).catch(() => {})
    }

    const goToFavorites = () => {
        router.push({ name: 'Favorites' }).catch(() => {})
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
