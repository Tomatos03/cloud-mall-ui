<template>
    <div class="flex flex-col h-screen overflow-hidden bg-slate-50">
        <!-- 顶部导航栏 -->
        <el-header class="sticky top-0 z-30 shrink-0" style="padding-bottom: 10px">
            <Header />
        </el-header>

        <!-- 商品详情主体 -->
        <el-main class="flex-1 overflow-y-auto overflow-x-hidden">
            <div class="max-w-7xl mx-auto p-6">
                <!-- 加载中状态 -->
                <div
                    v-if="loading"
                    class="flex flex-col items-center justify-center py-32 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                    <el-icon class="text-4xl text-orange-500 animate-spin">
                        <Loading />
                    </el-icon>
                    <p class="mt-4 text-gray-400 font-medium">正在为您加载商品详情...</p>
                </div>

                <div v-else-if="product" class="space-y-6">
                    <!-- 商品核心信息卡片 -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <!-- 顶部商店信息 -->
                        <div
                            class="flex items-center justify-between mb-8 pb-6 border-b border-gray-50"
                        >
                            <div class="flex items-center gap-4">
                                <div class="relative cursor-pointer" @click="goToStore">
                                    <img
                                        class="w-14 h-14 rounded-full border-2 border-orange-50 shadow-sm object-cover"
                                        :src="product.shopAvatar"
                                        alt="店铺头像"
                                    />
                                    <div
                                        class="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-0.5"
                                    >
                                        <el-icon :size="12"><Check /></el-icon>
                                    </div>
                                </div>
                                <div class="cursor-pointer" @click="goToStore">
                                    <h2 class="text-lg font-bold text-gray-800">
                                        {{ product.shopName }}
                                    </h2>
                                    <div class="flex items-center gap-2">
                                        <el-tag
                                            size="small"
                                            type="warning"
                                            effect="plain"
                                            class="border-orange-200! text-orange-500! bg-orange-50!"
                                            >官方旗舰店</el-tag
                                        >
                                        <span class="text-xs text-gray-400">综合体验 9.8</span>
                                    </div>
                                </div>
                            </div>
                            <el-button
                                type="primary"
                                plain
                                class="border-orange-500! text-orange-500! hover:bg-orange-50! rounded-xl! px-6"
                                @click="goToStore"
                            >
                                进入店铺
                            </el-button>
                        </div>

                        <!-- 商品信息区域 -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                                        class="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
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
                                            class="text-2xl font-extrabold text-gray-900 leading-tight mb-3"
                                        >
                                            {{ product.goodsName }}
                                        </h1>
                                        <p class="text-gray-500 leading-relaxed">
                                            {{ product.goodsInfo }}
                                        </p>
                                    </div>

                                    <!-- 价格 -->
                                    <div
                                        class="bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50"
                                    >
                                        <div class="flex items-baseline gap-1">
                                            <span class="text-orange-600 text-sm font-bold">¥</span>
                                            <span
                                                class="text-orange-600 text-4xl font-black tracking-tight"
                                                >{{ product.price }}</span
                                            >
                                            <span class="text-gray-400 text-sm ml-2">起</span>
                                        </div>
                                        <div
                                            class="mt-2 flex items-center gap-4 text-xs text-orange-600/70"
                                        >
                                            <span class="flex items-center gap-1"
                                                ><el-icon><CircleCheck /></el-icon> 官方正品</span
                                            >
                                            <span class="flex items-center gap-1"
                                                ><el-icon><CircleCheck /></el-icon> 七天无理由</span
                                            >
                                            <span class="flex items-center gap-1"
                                                ><el-icon><CircleCheck /></el-icon> 极速退款</span
                                            >
                                        </div>
                                    </div>

                                    <!-- 商品规格选择 (已简化为数量选择) -->
                                    <div class="space-y-5">
                                        <div class="flex items-center">
                                            <span class="text-gray-500 w-20 font-medium"
                                                >配送至</span
                                            >
                                            <div
                                                class="flex-1 flex items-center justify-between px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:border-orange-200 transition-colors group"
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
                                                        class="text-gray-700 truncate"
                                                    >
                                                        {{ selectedAddress.receiver }} -
                                                        {{ selectedAddress.detail }}
                                                    </span>
                                                    <span v-else class="text-gray-400"
                                                        >请选择收货地址</span
                                                    >
                                                </div>
                                                <el-icon
                                                    class="text-gray-300 group-hover:text-orange-400 transition-colors"
                                                    ><ArrowRight
                                                /></el-icon>
                                            </div>
                                        </div>
                                        <div class="flex items-center">
                                            <span class="text-gray-500 w-20 font-medium"
                                                >购买数量</span
                                            >
                                            <el-input-number
                                                v-model="quantity"
                                                :min="1"
                                                :max="product.inventory || 99"
                                                class="custom-number-input"
                                            />
                                        </div>
                                        <div class="flex gap-8 text-sm pt-2">
                                            <div class="flex flex-col">
                                                <span class="text-gray-400 mb-1">累计销量</span>
                                                <span class="text-gray-900 font-bold">{{
                                                    product.sale
                                                }}</span>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="text-gray-400 mb-1">库存数量</span>
                                                <span class="text-gray-900 font-bold">{{
                                                    product.inventory
                                                }}</span>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="text-gray-400 mb-1">上架日期</span>
                                                <span class="text-gray-900 font-bold">{{
                                                    product.createTime
                                                }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 操作按钮 -->
                                <div class="flex gap-4 pt-8 mt-auto">
                                    <el-button
                                        type="danger"
                                        class="flex-1! bg-orange-600! border-orange-600! hover:bg-orange-700! rounded-xl! h-12! font-bold text-lg shadow-lg shadow-orange-100"
                                        :loading="buyLoading"
                                        @click="handleBuyNow"
                                    >
                                        立即购买
                                    </el-button>
                                    <el-button
                                        type="warning"
                                        class="flex-1! bg-orange-50! border-orange-200! text-orange-600! hover:bg-orange-100! rounded-xl! h-12! font-bold text-lg"
                                        @click="handleAddToCart"
                                    >
                                        加入购物车
                                    </el-button>
                                    <el-button
                                        class="rounded-xl! h-12! px-6 hover:text-orange-500! hover:border-orange-200!"
                                        :class="{
                                            'text-orange-500! border-orange-200!': isFavorite,
                                        }"
                                        :icon="Star"
                                        @click="handleFavorite"
                                    >
                                        {{ isFavorite ? '已收藏' : '收藏' }}
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 详情标签页卡片 -->
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <el-tabs v-model="activeTab" class="custom-tabs">
                            <el-tab-pane label="商品详情" name="detail">
                                <div class="p-8">
                                    <!-- 商品描述 - 支持 HTML 内容 -->
                                    <div 
                                        v-if="product.description"
                                        class="prose max-w-none text-gray-700 leading-loose"
                                        v-html="product.description"
                                    >
                                    </div>
                                    <div v-else class="prose max-w-none">
                                        <p class="text-gray-700 leading-loose text-lg">
                                            {{ product.goodsInfo || '暂无商品详情' }}
                                        </p>
                                    </div>

                                </div>
                            </el-tab-pane>
                            <el-tab-pane :label="`评价 (${commentsTotal || 0})`" name="comments">
                                <div class="p-8">
                                    <div v-if="comments.length > 0" class="space-y-8">
                                        <div
                                            v-for="comment in comments"
                                            :key="comment.id"
                                            class="flex gap-4 pb-8 border-b border-gray-50 last:border-0"
                                        >
                                            <div
                                                class="w-12 h-12 rounded-full bg-gray-100 shrink-0 flex items-center justify-center text-gray-400"
                                            >
                                                <el-icon :size="24"><User /></el-icon>
                                            </div>
                                            <div class="flex-1">
                                                <div class="flex items-center justify-between mb-2">
                                                    <span class="font-bold text-gray-900">{{
                                                        comment.user
                                                    }}</span>
                                                    <span class="text-xs text-gray-400">{{
                                                        comment.time
                                                    }}</span>
                                                </div>
                                                <el-rate
                                                    v-model="comment.rating"
                                                    disabled
                                                    size="small"
                                                    class="mb-3"
                                                />
                                                <p class="text-gray-600 leading-relaxed">
                                                    {{ comment.content }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        v-else
                                        class="flex flex-col items-center justify-center py-20 text-gray-400"
                                    >
                                        <el-icon class="text-5xl mb-4"><ChatDotRound /></el-icon>
                                        <p v-if="!commentsLoading">暂无评价</p>
                                        <p v-else>加载中...</p>
                                    </div>
                                </div>
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
                        <el-icon class="text-4xl text-gray-200"><Warning /></el-icon>
                    </div>
                    <p class="text-gray-500 text-lg">抱歉，该商品不存在或已下架</p>
                    <el-button
                        type="primary"
                        class="mt-6 bg-orange-500! border-orange-500! rounded-xl!"
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
    import { ref, onMounted, computed, watch } from 'vue'
    import { ElMessage } from 'element-plus'
    import {
        Loading,
        Star,
        Check,
        CircleCheck,
        User,
        ChatDotRound,
        Warning,
        Location,
        ArrowRight,
        Picture,
    } from '@element-plus/icons-vue'
    import Header from '@/views/home/model/Header.vue'
    import AddressSelector from './model/AddressSelector.vue'
    import { fetchAddressList, type Address } from '@/api/address'
    import type { GoodsDetail, GoodsComment } from '@/api/goods'
    import { fetchGoodsDetail, fetchGoodsComments } from '@/api/goods'
    import { createOrder } from '@/api/order'
    import { addFavorite, removeFavorite, checkFavoriteStatus } from '@/api/favorite'
    import { useRoute, useRouter } from 'vue-router'
    import PaymentModal from './model/PaymentModal.vue'

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

    const totalAmount = computed(() => {
        if (!product.value) return 0
        return product.value.price * quantity.value
    })

    const loadDefaultAddress = async () => {
        try {
            const res = await fetchAddressList()
            const defaultAddr = res.data.find((item) => item.isDefault)
            if (defaultAddr) {
                selectedAddress.value = defaultAddr
            } else if (res.data.length > 0) {
                selectedAddress.value = res.data[0]
            }
        } catch (error) {
            console.error('Failed to load default address:', error)
        }
    }

    const imageList = computed(() => {
        if (!product.value) return [] as string[]
        const imgs: string[] = []
        // 确保主图在第一位
        if (product.value.mainImg) {
            imgs.push(product.value.mainImg)
        }
        // 添加所有子图,不去重
        if (product.value.subImg && Array.isArray(product.value.subImg)) {
            imgs.push(...product.value.subImg)
        }
        return imgs
    })

    // 评论懒加载相关
    const comments = ref<GoodsComment[]>([])
    const commentsPage = ref(1)
    const commentsPageSize = 10
    const commentsTotal = ref(0)
    const commentsLoading = ref(false)
    const commentsLoaded = ref(false)

    const loadComments = async (page = 1) => {
        if (!goodsId.value) return
        try {
            commentsLoading.value = true
            const res = await fetchGoodsComments(goodsId.value, {
                page,
                pageSize: commentsPageSize,
            })
            const data = res.data
            if (data && Array.isArray(data.records)) {
                if (page === 1) comments.value = data.records
                else comments.value.push(...data.records)
                commentsTotal.value = (data as any).total ?? commentsTotal.value
                commentsPage.value = page
                commentsLoaded.value = true
            }
        } catch (err) {
            console.error('加载评论失败', err)
        } finally {
            commentsLoading.value = false
        }
    }

    // 在切换到评论标签时触发懒加载
    watch(activeTab, (val) => {
        if (val === 'comments' && !commentsLoaded.value) {
            loadComments(1)
        }
    })
    const route = useRoute()
    const router = useRouter()

    const goToStore = () => {
        if (product.value?.shopId) {
            router.push({ name: 'Store', params: { storeId: product.value.shopId } })
        } else {
            ElMessage.warning('店铺信息加载中或不存在')
        }
    }

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

        buyLoading.value = true
        try {
            const res = await createOrder({
                goodsId: goodsId.value,
                addressId: selectedAddress.value.id,
                quantity: quantity.value,
                amount: totalAmount.value,
            })
            if (res && res.orderNo) {
                currentOrderNo.value = res.orderNo
                paymentVisible.value = true
            }
        } catch (error) {
            console.error('创建订单失败:', error)
        } finally {
            buyLoading.value = false
        }
    }

    const handleAddToCart = () => {
        ElMessage.success('已加入购物车')
    }

    const handleFavorite = async () => {
        if (!goodsId.value || !product.value?.shopId) {
            ElMessage.warning('商品信息加载中，请稍后再试')
            return
        }

        try {
            if (isFavorite.value) {
                // 取消收藏：直接使用已保存的 favoriteId
                if (favoriteId.value) {
                    await removeFavorite(favoriteId.value)
                    isFavorite.value = false
                    favoriteId.value = null
                    ElMessage.success('已取消收藏')
                }
            } else {
                // 添加收藏
                const res = await addFavorite(goodsId.value, product.value.shopId)
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
        background-color: white;
        border-bottom: 1px solid #f1f5f9;
    }

    :deep(.el-main) {
        padding: 0;
    }

    :deep(.custom-number-input .el-input__wrapper) {
        border-radius: 12px;
        box-shadow: 0 0 0 1px #f3f4f6 inset;
    }

    :deep(.custom-tabs .el-tabs__header) {
        margin: 0;
        padding: 0 32px;
        border-bottom: 1px solid #f9fafb;
    }

    :deep(.custom-tabs .el-tabs__nav-wrap::after) {
        display: none;
    }

    :deep(.custom-tabs .el-tabs__item) {
        height: 64px;
        font-size: 16px;
        font-weight: 700;
        color: #9ca3af;
    }

    :deep(.custom-tabs .el-tabs__item.is-active) {
        color: #f97316;
    }

    :deep(.custom-tabs .el-tabs__active-bar) {
        background-color: #f97316;
        height: 3px;
        border-radius: 3px;
    }

    /* 商品详情富文本图片适配 */
    :deep(.prose img) {
        max-width: 100% !important;
        height: auto !important;
        border-radius: 12px;
        display: block;
        margin: 1.5rem auto;
    }

    :deep(.prose p) {
        margin-bottom: 1rem;
    }
</style>
