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
                            <!-- 左侧：图片展示区 -->
                            <div class="space-y-6">
                                <!-- 主图 -->
                                <div
                                    class="bg-gray-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center border border-gray-100 group"
                                >
                                    <img
                                        :src="currentImage"
                                        alt="商品主图"
                                        class="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <!-- 缩略图列表 -->
                                <div class="flex gap-3 overflow-x-auto pb-2">
                                    <div
                                        v-for="(img, index) in imageList"
                                        :key="index"
                                        class="w-20 h-20 shrink-0 border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
                                        :class="
                                            currentImage === img
                                                ? 'border-orange-500 shadow-md shadow-orange-100'
                                                : 'border-transparent hover:border-orange-200'
                                        "
                                        @click="currentImage = img"
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

                                    <!-- 商品规格选择 -->
                                    <div class="space-y-5">
                                        <div class="flex items-center">
                                            <span class="text-gray-500 w-20 font-medium"
                                                >配送至</span
                                            >
                                            <div
                                                class="flex-1 flex items-center justify-between px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:border-orange-200 transition-colors group"
                                                @click="addressVisible = true"
                                            >
                                                <div class="flex items-center gap-2 overflow-hidden">
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
                                                >选择规格</span
                                            >
                                            <el-select
                                                v-model="selectedOption"
                                                placeholder="请选择"
                                                class="flex-1 custom-select"
                                            >
                                                <el-option
                                                    v-for="option in product.options"
                                                    :key="option"
                                                    :label="option"
                                                    :value="option"
                                                />
                                            </el-select>
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
                                        :icon="Star"
                                        @click="handleFavorite"
                                    >
                                        收藏
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
                                    <div class="prose max-w-none">
                                        <p
                                            class="text-gray-700 leading-loose whitespace-pre-wrap text-lg"
                                        >
                                            {{ product.description || product.goodsInfo }}
                                        </p>
                                    </div>
                                    <!-- 详情图展示 -->
                                    <div class="mt-8 space-y-4">
                                        <img
                                            v-for="(img, idx) in imageList"
                                            :key="idx"
                                            :src="img"
                                            class="w-full rounded-xl"
                                        />
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
            :amount="product.price"
            :goods-id="goodsId"
            :address-id="selectedAddress?.id"
            :selected-option="selectedOption"
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
    } from '@element-plus/icons-vue'
    import Header from '@/views/home/model/Header.vue'
    import AddressSelector from './model/AddressSelector.vue'
    import { fetchAddressList, type Address } from '@/api/address'
    import type { GoodsDetail, GoodsComment } from '@/api/goods'
    import { fetchGoodsDetail, fetchGoodsComments } from '@/api/goods'
    import { useRoute, useRouter } from 'vue-router'
    import PaymentModal from './model/PaymentModal.vue'

    const loading = ref(true)
    const product = ref<GoodsDetail | null>(null)
    const currentImage = ref('')
    const activeTab = ref('detail')
    const selectedOption = ref('')
    const goodsId = ref<string>('')
    const paymentVisible = ref(false)
    const addressVisible = ref(false)
    const selectedAddress = ref<Address | null>(null)

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
        if (product.value.mainImg) imgs.push(product.value.mainImg)
        if (product.value.subImg && product.value.subImg.length) imgs.push(...product.value.subImg)
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

            // 后端返回的字段已与前端一致，直接使用后端数据（删除不必要的映射）
            const backend = data as GoodsDetail

            product.value = backend

            // 设置默认展示图与规格
            const imgs = imageList.value
            currentImage.value =
                imgs && imgs.length ? (imgs[0] ?? '') : (product.value!.mainImg ?? '')
            selectedOption.value =
                product.value!.options && product.value!.options.length
                    ? (product.value!.options[0] ?? '')
                    : ''
        } catch (error) {
            console.error('加载商品详情失败:', error)
            product.value = null
        } finally {
            loading.value = false
        }
    }

    const handleBuyNow = () => {
        if (!selectedAddress.value) {
            ElMessage.warning('请选择收货地址')
            addressVisible.value = true
            return
        }
        if (!selectedOption.value) {
            ElMessage.warning('请选择商品规格')
            return
        }
        paymentVisible.value = true
    }


    const handleAddToCart = () => {
        ElMessage.success('已加入购物车')
    }

    const handleFavorite = () => {
        ElMessage.success('已收藏')
    }

    onMounted(() => {
        loadGoodsDetail()
        loadDefaultAddress()
    })
</script>

<style scoped>
    :deep(.el-header) {
        padding: 0 !important;
        height: auto !important;
    }

    :deep(.el-main) {
        padding: 0;
    }

    :deep(.custom-select .el-input__wrapper) {
        border-radius: 12px;
        padding: 4px 12px;
        box-shadow: 0 0 0 1px #f3f4f6 inset;
    }

    :deep(.custom-select .el-input__wrapper.is-focus) {
        box-shadow: 0 0 0 1px #f97316 inset !important;
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
</style>
