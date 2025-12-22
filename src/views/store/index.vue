<template>
    <div class="flex flex-col h-screen overflow-hidden bg-gray-100">
        <el-header class="sticky top-0 z-30 shrink-0" style="padding-bottom: 10px">
            <Header />
        </el-header>

        <el-main class="flex-1 overflow-y-auto overflow-x-hidden space-y-5">
            <div class="p-4">
                <!-- 商店信息卡片 -->
                <el-card class="mb-6">
                    <div class="flex items-center space-x-4">
                        <img
                            :src="storeInfo.avatar"
                            :alt="storeInfo.name"
                            class="w-16 h-16 rounded-full"
                        />
                        <div class="flex-1">
                            <h2 class="text-xl font-bold">{{ storeInfo.name }}</h2>
                            <p class="text-gray-600">{{ storeInfo.description }}</p>
                            <div class="flex items-center space-x-4 mt-2">
                                <span class="text-sm text-gray-500">评分: {{ storeInfo.rating }}</span>
                                <span class="text-sm text-gray-500">粉丝: {{ storeInfo.followerCount }}</span>
                                <span class="text-sm text-gray-500">商品: {{ storeInfo.productCount }}</span>
                            </div>
                        </div>
                        <el-button type="primary" @click="followStore">关注</el-button>
                    </div>
                </el-card>

                <!-- 商品列表 -->
                <el-card>
                    <template #header>
                        <div class="flex justify-between items-center">
                            <span>商品列表</span>
                            <el-input
                                v-model="searchQuery"
                                placeholder="搜索商品"
                                style="width: 200px"
                                @input="filterProducts"
                            />
                        </div>
                    </template>
                    <el-row :gutter="20">
                        <el-col
                            v-for="product in filteredProducts"
                            :key="product.id"
                            :xs="24"
                            :sm="12"
                            :md="8"
                            :lg="6"
                        >
                            <el-card class="mb-4" shadow="hover">
                                <img
                                    :src="product.img"
                                    :alt="product.title"
                                    class="w-full h-48 object-cover rounded"
                                />
                                <div class="mt-2">
                                    <h3 class="text-lg font-semibold">{{ product.title }}</h3>
                                    <p class="text-gray-600 text-sm">{{ product.desc }}</p>
                                    <div class="flex justify-between items-center mt-2">
                                        <span class="text-red-500 font-bold">{{ product.price }}</span>
                                        <el-button size="small" type="primary" @click="viewProduct(product.id)">
                                            查看详情
                                        </el-button>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>
            </div>

            <Footer />
        </el-main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/views/home/model/Header.vue'
import Footer from '@/views/home/model/Footer.vue'
import { fetchStoreInfo, fetchStoreProducts, type StoreItem, type StoreProductItem } from '@/api/store'

const route = useRoute()
const storeId = route.params.id as string

const storeInfo = ref<StoreItem>({
    id: 0,
    name: '',
    description: '',
    avatar: '',
    rating: 0,
    followerCount: 0,
    productCount: 0,
})

const products = ref<StoreProductItem[]>([])
const searchQuery = ref('')

const filteredProducts = computed(() => {
    if (!searchQuery.value) return products.value
    return products.value.filter(product =>
        product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const loadStoreInfo = async () => {
    // 暂时使用静态数据，API 调用已注释
    // const res = await fetchStoreInfo(storeId)
    // storeInfo.value = res.data
    const res = await fetchStoreInfo(storeId)
    storeInfo.value = res.data
}

const loadStoreProducts = async () => {
    // 暂时使用静态数据，API 调用已注释
    // const res = await fetchStoreProducts(storeId)
    // products.value = res.data
    const res = await fetchStoreProducts(storeId)
    products.value = res.data
}

const followStore = () => {
    // 关注商店逻辑，暂时为空
    console.log('关注商店')
}

const viewProduct = (productId: number) => {
    // 查看商品详情，跳转到商品页面
    console.log('查看商品', productId)
}

const filterProducts = () => {
    // 过滤逻辑已在 computed 中处理
}

onMounted(() => {
    loadStoreInfo()
    loadStoreProducts()
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
</style>