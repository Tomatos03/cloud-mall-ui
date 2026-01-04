<template>
    <div class="flex flex-col h-screen overflow-hidden bg-slate-50">
        <el-header class="sticky top-0 z-30 shrink-0" style="padding-bottom: 10px">
            <Header />
        </el-header>

        <el-main class="flex-1 overflow-y-auto overflow-x-hidden space-y-5">
            <div class="px-10!">
                <NoticeBar />
                <el-container class="h-120">
                    <el-aside width="280px" class="categoryAside">
                        <CategorySidebar :categories="categories" @select="handleCategorySelect" />
                    </el-aside>
                    <el-main style="padding: 0 16px">
                        <BannerCarousel
                            class="overflow-hidden rounded-xl border border-gray-100"
                            :banners="banners"
                            :interval="5000"
                            arrow="always"
                            :motion-blur="true"
                            @banner-click="handleBannerClick"
                        />
                    </el-main>
                </el-container>

                <!-- 分类商品展示组件 -->
                <template v-for="section in categorySections" :key="section.category.id">
                    <div class="mt-6">
                        <CategoryGoodsCardList
                            :category-title="section.category.name"
                            :top-category-id="section.category.id"
                            :tabs="section.tabs"
                            :goodsList="section.goodsList"
                            :active-tab="section.activeTab"
                            @goods-click="(goodsId: string) => handleGoodsClick(goodsId)"
                            @tab-change="
                                (topCategoryId: string, activeCategoryTabId: CategoryTab) =>
                                    handleTabChange(topCategoryId, activeCategoryTabId)
                            "
                            @view-more="(categryName: string) => handleViewMore(categryName)"
                        />
                    </div>
                </template>
            </div>
            <Footer />
        </el-main>
    </div>
</template>

<script setup lang="ts">
    import { fetchBanner, fetchCategory, type Banner, type CategoryItem } from '@/api/home'
    import BannerCarousel from '@/views/home/model/BannerCarousel.vue'
    import NoticeBar from './model/NoticeBar.vue'
    import CategorySidebar from './model/CategorySidebar.vue'
    import Header from '@/views/home/model/Header.vue'
    import Footer from '@/views/home/model/Footer.vue'
    import { onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { fetchGoodsByCategoryId, type GoodsItem } from '@/api/goods'
    import type { CategoryTab } from '@/api/category'
    import CategoryGoodsCardList from './model/CategoryGoodsCardList.vue'

    // 定义分类商品区域的数据结构
    interface CategorySection {
        category: CategoryItem
        tabs: CategoryTab[]
        activeTab: CategoryTab
        goodsList: GoodsItem[]
    }

    const banners = ref<Banner[]>([])
    const router = useRouter()
    const loadBanner = async () => {
        const res = await fetchBanner()
        banners.value = res.data
    }

    const categories = ref<CategoryItem[]>([])

    // 使用单一数据结构来管理分类商品区域
    const categorySections = ref<CategorySection[]>([])

    const loadCategoryGoodsCardListData = async () => {
        const res = await fetchCategory()
        categories.value = res.data

        // 过滤出所有 level === 1 的顶级分类
        const topCategories = categories.value.filter((cat) => cat.level === 1)

        // 清空之前的数据
        categorySections.value = []

        // 为每个顶级分类找出二级分类，并过滤掉没有商品的二级分类
        for (const cat of topCategories) {
            const subCats = categories.value.filter((c) => c.parentId === cat.id && c.level === 2)
            const validSubCats: CategoryTab[] = []

            // 检查每个二级分类是否有商品
            for (const subCat of subCats) {
                const checkRes = await fetchGoodsByCategoryId(subCat.id, 1)
                if (checkRes.data && checkRes.data.length > 0) {
                    validSubCats.push({ id: subCat.id, name: subCat.name })
                }
            }

            // 只有有商品的分类才添加到展示列表
            if (validSubCats.length > 0) {
                const firstTab = validSubCats[0]!
                const goodsRes = await fetchGoodsByCategoryId(firstTab.id)

                categorySections.value.push({
                    category: cat,
                    tabs: validSubCats,
                    activeTab: firstTab,
                    goodsList: goodsRes.data || [],
                })
            }
        }

        console.log('分类商品区域数据:', categorySections)
        console.log('所有分类：', categories.value)
    }

    const handleBannerClick = (banner: Banner) => {
        if (banner.goodsId) {
            handleGoodsClick(banner.goodsId)
        }
    }

    // 来自 CategorySidebar 的选择回调：跳转到搜索页并带上 categoryId
    const handleCategorySelect = (payload: { id: string; name: string }) => {
        console.log(payload)
        const { name } = payload
        router.push({ name: 'Search', query: { keyword: name } })
    }

    function handleGoodsClick(goodsId: string) {
        router.push({
            name: 'GoodsDetail',
            params: { goodsId },
        })
    }

    function handleTabChange(topCategoryId: string, activeCategoryTabId: CategoryTab) {
        // 找到对应的 section 并更新
        const section = categorySections.value.find((s) => s.category.id === topCategoryId)
        if (section) {
            section.activeTab = activeCategoryTabId
            // 加载对应 tab 的商品
            loadGoodsForTab(topCategoryId, activeCategoryTabId.id)
        }
    }

    const loadGoodsForTab = async (topCategoryId: string, tabId: string) => {
        const res = await fetchGoodsByCategoryId(tabId)
        const section = categorySections.value.find((s) => s.category.id === topCategoryId)
        if (section) {
            section.goodsList = res.data || []
        }
    }

    function handleViewMore(categoryName: string) {
        router.push({ name: 'Search', query: { keyword: categoryName } })
    }

    onMounted(() => {
        loadBanner()
        loadCategoryGoodsCardListData()
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
