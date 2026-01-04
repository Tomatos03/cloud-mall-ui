<template>
    <div class="flex flex-col h-screen overflow-hidden bg-gray-50/50">
        <!-- 顶部导航栏 -->
        <el-header class="sticky top-0 z-30 shrink-0 !h-auto !p-0 border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <Header />
        </el-header>

        <!-- 商品详情主体 -->
        <el-main class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
            <div class="max-w-7xl mx-auto p-4 lg:p-8">
                <!-- 加载中状态 -->
                <div
                    v-if="loading"
                    class="flex flex-col items-center justify-center py-40 bg-white rounded-3xl shadow-sm border border-gray-100"
                >
                    <div class="relative">
                        <div class="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                        <el-icon class="absolute inset-0 m-auto text-2xl text-orange-500 animate-pulse">
                            <Loading />
                        </el-icon>
                    </div>
                    <p class="mt-6 text-gray-500 font-medium tracking-wide">正在为您加载商品详情...</p>
                </div>

                <div v-else-if="product" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <!-- 商品核心信息卡片 -->
                    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-10">
                        <!-- 店铺信息组件 -->
                        <div class="mb-8 pb-8 border-b border-gray-50">
                            <StoreInfoCard
                                :store-id="product.storeId"
                                :store-name="product.storeName"
                                :store-avatar-url="product.storeAvatarUrl"
                            />
                        </div>

                        <!-- 商品信息区域 -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                            <!-- 左侧:图片展示区 -->
                            <div class="space-y-6">
                                <!-- 主图 -->
                                <div
                                    class="bg-gray-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center border border-gray-100 group"
                                >
                                    <img
                                        v-if="imageList.length > 0"
                                        :src="imageList[activeIndex]"
                                        alt="商品主图"
                                        class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div
                                        v-else
                                        class="flex flex-col items-center justify-center text-gray-400"
                                    >
                                        <el-icon class="text-5xl mb-3"><Picture /></el-icon>
                                        <p class="text-sm">暂时没有图片</p>
                                    </div>
                                </div>

                                <!-- 缩略图列表 -->
                                <div v-if="imageList.length > 0" class="flex gap-3 overflow-x-auto p-1 pb-2">
                                    <div
                                        v-for="(img, index) in imageList"
                                        :key="index"
                                        class="w-20 h-20 shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 bg-gray-50"
                                        :class="
                                            activeIndex === index
                                                ? 'ring-2 ring-orange-500 shadow-md shadow-orange-100'
                                                : 'hover:ring-2 hover:ring-orange-200'
                                        "
                                        @click="activeIndex = index"
                                    >
                                        <img
                                            :src="img"
                                            alt="缩略图"
                                            class="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- 右侧：商品信息 -->
                            <div class="flex flex-col">
                                <div class="flex-1 space-y-6">
                                    <!-- 商品标题 -->
                                    <div>
                                        <h1
                                            class="text-2xl font-extrabold text-gray-900 leading-tight mb-3 drop-shadow-sm"
                                        >
                                            {{ product.goodsName }}
                                        </h1>
                                        <p class="text-gray-700 leading-relaxed">
                                            {{ product.goodsInfo }}
                                        </p>
                                    </div>

                                    <!-- 价格 -->
                                    <div
                                        class="bg-gradient-to-br from-orange-50 to-orange-100/30 p-6 rounded-2xl border border-orange-100 relative overflow-hidden"
                                    >
                                        <div class="absolute -right-4 -bottom-4 opacity-5">
                                            <el-icon size="120" class="text-orange-600"><CircleCheck /></el-icon>
                                        </div>
                                        <div class="flex items-baseline gap-1 relative z-10">
                                            <span class="text-orange-600 text-lg font-bold">¥</span>
                                            <span
                                                class="text-orange-600 text-5xl font-black tracking-tighter"
                                                >{{ fenToYuan(product.price) }}</span
                                            >
                                            <span class="text-orange-400 text-sm ml-2 font-medium">起</span>
                                        </div>
                                        <div
                                            class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-orange-700/70 font-medium relative z-10"
                                        >
                                            <span class="flex items-center gap-1.5"
                                                ><el-icon class="text-orange-500"><CircleCheck /></el-icon> 官方正品</span
                                            >
                                            <span class="flex items-center gap-1.5"
                                                ><el-icon class="text-orange-500"><CircleCheck /></el-icon> 七天无理由</span
                                            >
                                            <span class="flex items-center gap-1.5"
                                                ><el-icon class="text-orange-500"><CircleCheck /></el-icon> 极速退款</span
                                            >
                                        </div>
                                    </div>

                                    <!-- 商品规格选择 (已简化为数量选择) -->
                                    <div class="space-y-6">
                                        <div class="flex items-center">
                                            <span class="text-gray-500 w-20 text-sm font-medium"
                                                >配送至</span
                                            >
                                            <div
                                                class="flex-1 flex items-center justify-between px-4 py-3 bg-gray-50/80 rounded-xl border border-gray-100 cursor-pointer hover:border-orange-200 hover:bg-white hover:shadow-sm transition-all group"
                                                @click="addressVisible = true"
                                            >
                                                <div
                                                    class="flex items-center gap-2 overflow-hidden"
                                                >
                                                    <el-icon class="text-orange-500 shrink-0"
                                                        ><Location
                                                    /></el-icon>
                                                    <span
                                                        v-if="selectedAddress"
                                                        class="text-gray-700 text-sm truncate"
                                                    >
                                                        {{ selectedAddress.receiver }} -
                                                        {{ selectedAddress.detail }}
                                                    </span>
                                                    <span v-else class="text-gray-400 text-sm"
                                                        >请选择收货地址</span
                                                    >
                                                </div>
                                                <el-icon
                                                    class="text-gray-300 group-hover:text-orange-500 transition-colors"
                                                    ><ArrowRight
                                                /></el-icon>
                                            </div>
                                        </div>
                                        <div class="flex items-center">
                                            <span class="text-gray-500 w-20 text-sm font-medium"
                                                >购买数量</span
                                            >
                                            <el-input-number
                                                v-model="quantity"
                                                :min="1"
                                                :max="product.inventory || 99"
                                                class="custom-number-input"
                                            />
                                            <span class="ml-4 text-xs text-gray-400">库存 {{ product.inventory }} 件</span>
                                        </div>
                                        
                                        <!-- 数据统计 -->
                                        <div class="grid grid-cols-3 gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
                                            <div class="text-center border-r border-gray-100 last:border-0">
                                                <p class="text-xs text-gray-400 mb-1">累计销量</p>
                                                <p class="text-base font-bold text-gray-800">{{ product.sale }}</p>
                                            </div>
                                            <div class="text-center border-r border-gray-100 last:border-0">
                                                <p class="text-xs text-gray-400 mb-1">好评率</p>
                                                <p class="text-base font-bold text-gray-800">99%</p>
                                            </div>
                                            <div class="text-center">
                                                <p class="text-xs text-gray-400 mb-1">上架日期</p>
                                                <p class="text-sm font-bold text-gray-800">{{ product.createTime?.split(' ')[0] }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 操作按钮 -->
                                <div class="flex gap-4 pt-10 mt-auto">
                                    <el-button
                                        type="danger"
                                        class="flex-[2]! bg-orange-600! border-orange-600! hover:bg-orange-700! hover:scale-[1.02] active:scale-[0.98] transition-all! rounded-2xl! h-14! font-bold text-lg shadow-xl shadow-orange-200/50"
                                        :loading="buyLoading"
                                        @click="handleBuyNow"
                                    >
                                        立即购买
                                    </el-button>
                                    <el-button
                                        type="warning"
                                        class="flex-[1.5]! bg-orange-50! border-orange-200! text-orange-600! hover:bg-orange-100! hover:border-orange-300! rounded-2xl! h-14! font-bold text-lg transition-all!"
                                        @click="handleAddToCart"
                                    >
                                        加入购物车
                                    </el-button>
                                    <el-button
                                        class="flex-none! w-14! h-14! rounded-2xl! border-gray-200! hover:text-orange-600! hover:border-orange-300! transition-all!"
                                        :class="{
                                            'text-orange-600! border-orange-200! bg-orange-50/50': isFavorite,
                                        }"
                                        @click="handleFavorite"
                                    >
                                        <el-icon :size="20"><Star v-if="!isFavorite" /><StarFilled v-else /></el-icon>
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 详情标签页卡片 -->
                    <div
                        class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <el-tabs v-model="activeTab" class="custom-tabs">
                            <el-tab-pane name="detail">
                                <template #label>
                                    <div class="flex items-center gap-2 px-2">
                                        <el-icon><Document /></el-icon>
                                        <span>商品详情</span>
                                    </div>
                                </template>
                                <div class="p-6 lg:p-12">
                                    <!-- 商品描述 - 支持 HTML 内容 -->
                                    <div
                                        v-if="product.description"
                                        class="prose max-w-none text-gray-700 leading-relaxed"
                                        v-html="product.description"
                                    >
                                    </div>
                                    <div v-else class="prose max-w-none text-center py-20">
                                        <el-empty description="暂无详细描述" :image-size="100" />
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane name="comments">
                                <template #label>
                                    <div class="flex items-center gap-2 px-2">
                                        <el-icon><ChatLineRound /></el-icon>
                                        <span>用户评价</span>
                                        <span class="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-normal">{{ commentsTotal }}</span>
                                    </div>
                                </template>
                                <!-- 商品评价组件 -->
                                <GoodsComments 
                                    v-if="goodsId"
                                    :goods-id="goodsId"
                                    @update:total="commentsTotal = $event"
                                />
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>

                <!-- 错误状态 -->
                <div
                    v-else
                    class="flex flex-col items-center justify-center py-32 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                    <div
                        class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4"
                    >
                        <el-icon class="text-4xl text-gray-300"><Warning /></el-icon>
                    </div>
                    <p class="text-gray-600 text-lg font-medium">抱歉，该商品不存在或已下架</p>
                    <el-button
                        type="primary"
                        class="mt-6 bg-orange-600! border-orange-600! rounded-xl!"
                        @click="$router.push('/')"
                        >返回首页</el-button
                    >
                </div>
            </div>
        </el-main>

        <!-- 支付弹窗 -->
        <PaymentModal
            v-if="product"
            v-model:visible="paymentVisible"
            :amount="totalAmount"
            :order-no="currentOrderNo"
            :quantity="quantity"
            @success="handlePaymentSuccess"
        />

        <!-- 地址选择弹窗 -->
        <AddressSelector v-model:visible="addressVisible" v-model="selectedAddress" />
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import { ElMessage } from 'element-plus'
    import {
        Loading,
        Star,
        StarFilled,
        CircleCheck,
        Warning,
        Location,
        ArrowRight,
        Picture,
        Document,
        ChatLineRound,
    } from '@element-plus/icons-vue'
    import Header from '@/views/home/model/Header.vue'
    import AddressSelector from './model/AddressSelector.vue'
    import StoreInfoCard from './model/StoreInfoCard.vue'
    import GoodsComments from './model/GoodsComments.vue'
    import { fetchAddressList, type Address } from '@/api/address'
    import type { GoodsDetail } from '@/api/goods'
    import { fetchGoodsDetail } from '@/api/goods'
    import { createInstantBuyOrder } from '@/api/order'
    import { addFavorite, removeFavorite, checkFavoriteStatus } from '@/api/favorite'
    import { addToCart } from '@/api/cart'
    import { useRoute, useRouter } from 'vue-router'
    import PaymentModal from './model/PaymentModal.vue'
    import { getImageURL, getImageURLs } from '@/utils/image'
    import { fenToYuan } from '@/utils/price'

    const loading = ref(true)
    const buyLoading = ref(false)
    const product = ref<GoodsDetail | null>(null)
    const activeIndex = ref(0)
    const activeTab = ref('detail')
    const quantity = ref(1)
    const goodsId = ref<string>('')
    const paymentVisible = ref(false)
    const addressVisible = ref(false)
    const selectedAddress = ref<Address | null>(null)
    const currentOrderNo = ref('')
    const isFavorite = ref(false)
    const favoriteId = ref<string | null>(null)
    const commentsTotal = ref(0)

    const totalAmount = computed(() => {
        if (!product.value) return 0
        return product.value.price * quantity.value
    })

    const loadDefaultAddress = async () => {
        try {
            const res = await fetchAddressList()
            const defaultAddr = res.data.find((item) => item.isDefault)
            if (defaultAddr) {
                selectedAddress.value = defaultAddr || null
            } else if (res.data.length > 0) {
                selectedAddress.value = res.data[0] || null
            } else {
                selectedAddress.value = null
            }
        } catch (err) {
            console.error('Failed to load default address:', err)
            selectedAddress.value = null
        }
    }

    const imageList = computed(() => {
        if (!product.value) return [] as string[]
        const imgs: string[] = []
        // 确保主图在第一位
        if (product.value.mainImg) {
            imgs.push(getImageURL(product.value.mainImg))
        }
        // 添加所有子图,不去重
        if (product.value.subImg && Array.isArray(product.value.subImg)) {
            imgs.push(...getImageURLs(product.value.subImg))
        }
        return imgs
    })

    const route = useRoute()
    const router = useRouter()

    // 加载商品详情
    const loadGoodsDetail = async () => {
        try {
            loading.value = true
            const id = route.params.goodsId
            if (!id) {
                ElMessage.error('商品ID无效')
                product.value = null
                return
            }

            goodsId.value = id as string
            const res = await fetchGoodsDetail(goodsId.value)
            const data = res.data
            if (!data) {
                product.value = null
                ElMessage.error('未找到该商品')
                return
            }

            product.value = data as GoodsDetail

            // 设置默认展示图索引为 0
            activeIndex.value = 0
        } catch (error) {
            console.error('加载商品详情失败:', error)
            product.value = null
        } finally {
            loading.value = false
        }

        // 检查收藏状态
        if (goodsId.value) {
            try {
                const res = await checkFavoriteStatus(goodsId.value)
                isFavorite.value = res.data.isFavorite
                favoriteId.value = res.data.favoriteId
            } catch (error) {
                console.error('检查收藏状态失败:', error)
                isFavorite.value = false
                favoriteId.value = null
            }
        }
    }

    const handlePaymentSuccess = () => {
        paymentVisible.value = false
        router.push({ path: '/profile', query: { tab: 'orders' } })
    }

    const handleBuyNow = async () => {
        if (!selectedAddress.value) {
            ElMessage.warning('请选择收货地址')
            addressVisible.value = true
            return
        }

        if (!product.value?.storeId) {
            ElMessage.warning('商品信息加载中，请稍后再试')
            return
        }

        buyLoading.value = true
        try {
            const res = await createInstantBuyOrder(
                selectedAddress.value.id,
                Number(product.value.storeId),
                Number(goodsId.value),
                quantity.value
            )
            if (res && res.data) {
                currentOrderNo.value = res.data.orderNo
                paymentVisible.value = true
            }
        } catch (err) {
            console.error('创建订单失败:', err)
        } finally {
            buyLoading.value = false
        }
    }

    const handleAddToCart = async () => {
        if (!product.value) {
            ElMessage.error('商品信息加载失败')
            return
        }

        if (quantity.value < 1) {
            ElMessage.warning('请选择购买数量')
            return
        }

        if (quantity.value > product.value.inventory) {
            ElMessage.warning('库存不足')
            return
        }

        try {
            await addToCart({
                goodsId: Number(goodsId.value),
                storeId: Number(product.value.storeId),
                quantity: quantity.value,
            })
            ElMessage.success('已加入购物车')
        } catch (err) {
            console.error('添加购物车失败:', err)
        }
    }

    const handleFavorite = async () => {
        if (!goodsId.value || !product.value?.storeId) {
            ElMessage.warning('商品信息加载中，请稍后再试')
            return
        }

        try {
            if (isFavorite.value) {
                if (favoriteId.value) {
                    await removeFavorite(favoriteId.value)
                    isFavorite.value = false
                    favoriteId.value = null
                    ElMessage.success('已取消收藏')
                }
            } else {
                const res = await addFavorite(goodsId.value, product.value.storeId)
                if (res.data) {
                    isFavorite.value = true
                    favoriteId.value = res.data.id
                    ElMessage.success('收藏成功')
                }
            }
        } catch (error) {
            console.error('操作收藏失败:', error)
            ElMessage.error('操作失败，请重试')
        }
    }

    onMounted(() => {
        loadGoodsDetail()
        loadDefaultAddress()
    })
</script>

<style scoped>
    :deep(.el-header) {
        background-color: transparent;
    }

    :deep(.el-main) {
        padding: 0;
    }

    :deep(.custom-number-input .el-input__wrapper) {
        border-radius: 12px;
        box-shadow: none !important;
        background-color: #f9fafb;
        border: 1px solid #f3f4f6;
    }

    :deep(.custom-tabs .el-tabs__header) {
        margin: 0;
        padding: 0 40px;
        border-bottom: 1px solid #f3f4f6;
        background-color: #fff;
    }

    :deep(.custom-tabs .el-tabs__nav-wrap::after) {
        display: none;
    }

    :deep(.custom-tabs .el-tabs__item) {
        height: 72px;
        font-size: 16px;
        font-weight: 600;
        color: #6b7280;
        transition: all 0.3s;
    }

    :deep(.custom-tabs .el-tabs__item.is-active) {
        color: #ea580c;
    }

    :deep(.custom-tabs .el-tabs__active-bar) {
        background-color: #ea580c;
        height: 4px;
        border-radius: 4px 4px 0 0;
    }

    /* 商品详情富文本图片适配 */
    :deep(.prose img) {
        max-width: 100% !important;
        height: auto !important;
        border-radius: 20px;
        display: block;
        margin: 2rem auto;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    }

    :deep(.prose p) {
        margin-bottom: 1.25rem;
        color: #374151;
    }

    /* 动画 */
    .animate-in {
        animation-duration: 0.5s;
        animation-fill-mode: both;
    }

    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slide-in-from-bottom {
        from { transform: translateY(20px); }
        to { transform: translateY(0); }
    }

    .fade-in { animation-name: fade-in; }
    .slide-in-from-bottom-4 { animation-name: slide-in-from-bottom; }
</style>