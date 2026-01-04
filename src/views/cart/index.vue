<template>
    <div class="flex flex-col h-screen bg-gray-50 overflow-hidden">
        <!-- 顶部导航 -->
        <div class="shrink-0 z-30 border-b border-gray-100 bg-white">
            <Header />
        </div>

        <!-- 主内容滚动区 -->
        <div class="flex-1 overflow-y-auto custom-scrollbar pb-32">
            <div class="max-w-5xl mx-auto px-4 py-8">
                <!-- 页面标题 -->
                <div class="flex items-baseline gap-3 mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">购物车</h2>
                    <span class="text-sm text-gray-400">共 {{ totalItemCount }} 件商品</span>
                </div>

                <!-- 购物车内容 -->
                <div v-if="cartData.length > 0" class="space-y-4">
                    <!-- 收货地址选择 -->
                    <AddressSelector v-model="selectedAddress" />

                    <!-- 全选操作栏 -->
                    <div
                        class="bg-white rounded-xl border border-gray-100 p-4 flex justify-between items-center"
                    >
                        <el-checkbox
                            v-model="isAllSelected"
                            @change="handleSelectAll"
                            class="custom-checkbox"
                        >
                            <span class="text-gray-600 font-medium ml-1">全选</span>
                        </el-checkbox>

                        <el-button
                            v-if="selectedItems.length > 0"
                            type="danger"
                            link
                            class="text-sm! font-medium"
                            @click="handleBatchDelete"
                        >
                            <el-icon class="mr-1"><Delete /></el-icon>
                            删除选中 ({{ selectedItems.length }})
                        </el-button>
                    </div>

                    <!-- 按商店分组显示 -->
                    <div
                        v-for="store in cartData"
                        :key="store.storeId"
                        class="bg-white rounded-xl border border-gray-100 overflow-hidden"
                    >
                        <!-- 商店头部 -->
                        <div
                            class="px-5 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2 cursor-pointer hover:bg-gray-100/50 transition-colors"
                            @click="goToStore(store.storeId)"
                        >
                            <el-icon class="text-gray-400"><store /></el-icon>
                            <span class="font-bold text-gray-700 text-sm">{{
                                store.storeName
                            }}</span>
                            <el-icon :size="12" class="text-gray-300"><ArrowRight /></el-icon>
                        </div>

                        <!-- 商品列表 -->
                        <div class="divide-y divide-gray-50">
                            <div
                                v-for="item in store.items"
                                :key="item.storeId"
                                class="p-5 hover:bg-gray-50/30 transition-colors"
                            >
                                <div class="flex items-center gap-4">
                                    <!-- 选择框 -->
                                    <el-checkbox
                                        :model-value="item.selected"
                                        @change="(val: boolean) => handleItemSelect(item, val)"
                                        class="custom-checkbox"
                                        @click.stop
                                    />

                                    <!-- 商品图片 -->
                                    <div
                                        class="w-20 h-20 shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100 cursor-pointer"
                                        @click="goToGoods(item.storeId)"
                                    >
                                        <img
                                            :src="getImageURL(item.mainImage)"
                                            :alt="item.goodsName"
                                            class="w-full h-full object-contain"
                                        />
                                    </div>

                                    <!-- 商品信息 -->
                                    <div class="flex-1 min-w-0">
                                        <h3
                                            class="text-sm font-bold text-gray-800 mb-1 truncate cursor-pointer hover:text-orange-500 transition-colors"
                                            @click="goToGoods(item.goodsId)"
                                        >
                                            {{ item.goodsName }}
                                        </h3>
                                        <div class="text-xs text-gray-400">
                                            库存: {{ item.inventory }} {{ item.unit }}
                                        </div>
                                        <div class="mt-2 text-lg font-bold text-orange-500">
                                            <span class="text-xs mr-0.5">￥</span
                                            >{{ (item.price / 100).toFixed(2) }}
                                        </div>
                                    </div>

                                    <!-- 数量控制与删除 -->
                                    <div class="flex flex-col items-end gap-3">
                                        <button
                                            class="text-gray-300 hover:text-red-500 transition-colors"
                                            @click.stop="handleRemoveItem(item)"
                                        >
                                            <el-icon :size="18"><Delete /></el-icon>
                                        </button>

                                        <div
                                            class="flex items-center border border-gray-200 rounded-md overflow-hidden h-8"
                                            @click.stop
                                        >
                                            <button
                                                class="w-8 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-30"
                                                @click="updateQuantity(item, item.quantity - 1)"
                                                :disabled="item.quantity <= 1"
                                            >
                                                <el-icon :size="12"><Minus /></el-icon>
                                            </button>
                                            <input
                                                type="number"
                                                class="w-10 text-center text-sm border-x border-gray-200 focus:outline-none"
                                                :value="item.quantity"
                                                @change="
                                                    (e: any) =>
                                                        handleQuantityInput(
                                                            item,
                                                            parseInt(e.target.value),
                                                        )
                                                "
                                            />
                                            <button
                                                class="w-8 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-30"
                                                @click="updateQuantity(item, item.quantity + 1)"
                                                :disabled="item.quantity >= item.inventory"
                                            >
                                                <el-icon :size="12"><Plus /></el-icon>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 空购物车状态 -->
                <div
                    v-else
                    class="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-gray-100"
                >
                    <el-icon size="64" class="text-gray-100 mb-4"><ShoppingCartFull /></el-icon>
                    <h3 class="text-lg font-bold text-gray-800 mb-1">购物车是空的</h3>
                    <p class="text-gray-400 text-sm mb-6">去挑选一些喜欢的商品吧</p>
                    <el-button
                        type="primary"
                        class="bg-orange-500! border-orange-500! px-8"
                        @click="goToHome"
                    >
                        去逛逛
                    </el-button>
                </div>
            </div>
        </div>

        <!-- 底部结算栏 -->
        <div
            v-if="cartData.length > 0"
            class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40"
        >
            <div class="max-w-5xl mx-auto px-4 h-20 flex justify-between items-center">
                <div class="flex items-center gap-6">
                    <el-checkbox
                        v-model="isAllSelected"
                        @change="handleSelectAll"
                        class="custom-checkbox"
                    >
                        <span class="text-gray-600 font-medium ml-1">全选</span>
                    </el-checkbox>
                    <div class="text-sm text-gray-500">
                        已选
                        <span class="text-orange-500 font-bold">{{ selectedItems.length }}</span> 件
                    </div>
                </div>

                <div class="flex items-center gap-6">
                    <div class="text-right">
                        <span class="text-xs text-gray-400 block">合计</span>
                        <span class="text-xl font-bold text-orange-500">
                            <span class="text-sm mr-0.5">￥</span
                            >{{ (totalSelectedPrice / 100).toFixed(2) }}
                        </span>
                    </div>
                    <el-button
                        type="primary"
                        class="bg-orange-500! border-orange-500! h-12! px-10! rounded-lg! font-bold!"
                        :loading="checkoutLoading"
                        @click="handleCheckout"
                    >
                        结算
                    </el-button>
                </div>
            </div>
        </div>

        <!-- 支付弹窗 -->
        <PaymentModal
            v-model:visible="showPaymentModal"
            :amount="totalSelectedPrice / 100"
            :order-no="currentOrderNo"
            :quantity="totalSelectedItemCount"
            @success="handlePaymentSuccess"
        />
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElMessageBox, ElMessage } from 'element-plus'
    import { ShoppingCartFull, Delete, Plus, Minus, ArrowRight } from '@element-plus/icons-vue'
    import Header from '@/views/home/model/Header.vue'
    import PaymentModal from '@/views/goods/model/PaymentModal.vue'
    import AddressSelector from './model/AddressSelector.vue'
    import {
        fetchCart,
        updateCartItem,
        removeCartItem,
        batchRemoveCartItems,
        type CartItem,
        type CartStoreItem,
    } from '@/api/cart'
    import { createCartOrder, type TradeShopItem } from '@/api/order'
    import { type Address } from '@/api/address'
    import { getImageURL } from '@/utils/image'

    const router = useRouter()
    const cartData = ref<CartStoreItem[]>([])
    const checkoutLoading = ref(false)
    const showPaymentModal = ref(false)
    const currentOrderNo = ref('')

    // 地址相关
    const selectedAddress = ref<Address | null>(null)

    // 获取所有商品项（扁平化）
    const allItems = computed(() => {
        const result: CartItem[] = []
        cartData.value.forEach((shop) => {
            result.push(...shop.items)
        })
        return result
    })

    // 总商品数量
    const totalItemCount = computed(() => {
        return allItems.value.reduce((sum, item) => Number(sum) + Number(item.quantity), 0)
    })

    // 选中项
    const selectedItems = computed(() => {
        return allItems.value.filter((item) => item.selected)
    })

    // 全选状态控制
    const isAllSelected = computed({
        get: () => allItems.value.length > 0 && allItems.value.every((item) => item.selected),
        set: () => {},
    })

    // 总价计算
    const totalSelectedPrice = computed(() => {
        return selectedItems.value.reduce((total, item) => {
            return total + item.price * item.quantity
        }, 0)
    })

    // 选中商品总数量
    const totalSelectedItemCount = computed(() => {
        return selectedItems.value.reduce((total, item) => {
            return total + item.quantity
        }, 0)
    })

    // 加载购物车数据
    const loadCart = async () => {
        const res = await fetchCart()
        cartData.value = res.data.storeList
        console.log('购物车数据:', cartData.value)
        console.log('购物车数据:', Array.isArray(cartData.value))
    }

    // 更新数量
    const updateQuantity = async (item: CartItem, newQty: number) => {
        if (newQty < 1 || newQty > item.inventory) return

        await updateCartItem({
            storeId: item.storeId,
            goodsId: item.goodsId,
            quantity: newQty,
        })
    }

    // 处理输入数量
    const handleQuantityInput = async (item: CartItem, value: number | null | undefined) => {
        let newQty = value || 1
        if (newQty < 1) newQty = 1
        if (newQty > item.inventory) newQty = item.inventory
        if (newQty === item.quantity) return
        await updateQuantity(item, newQty)
    }

    // 切换单项选中状态
    const handleItemSelect = (item: CartItem, selected: boolean) => {
        item.selected = selected
    }

    // 全选/取消全选
    const handleSelectAll = (selected: unknown) => {
        const isSelected = !!selected
        allItems.value.forEach((item) => {
            item.selected = isSelected
        })
    }

    // 删除单项
    const handleRemoveItem = async (item: CartItem) => {
        try {
            await ElMessageBox.confirm(`确定要从购物车中移除该商品吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
            await removeCartItem({ storeId: item.storeId, goodsId: item.goodsId })
            await loadCart()
            ElMessage.success('已移除')
        } catch (err) {
            if (err !== 'cancel') console.error('删除失败:', err)
        }
    }

    // 批量删除
    const handleBatchDelete = async () => {
        if (selectedItems.value.length === 0) return
        try {
            await ElMessageBox.confirm(
                `确定要删除选中的 ${selectedItems.value.length} 件商品吗？`,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                },
            )
            const itemsToDelete = selectedItems.value.map((item) => ({
                storeId: item.storeId,
                goodsId: item.goodsId,
            }))
            await batchRemoveCartItems(itemsToDelete)
            await loadCart()
            ElMessage.success('删除成功')
        } catch (err) {
            if (err !== 'cancel') console.error('批量删除失败:', err)
        }
    }

    // 结算
    const handleCheckout = async () => {
        if (selectedItems.value.length === 0) {
            ElMessage.warning('请选择商品')
            return
        }
        if (!selectedAddress.value) {
            ElMessage.warning('请选择收货地址')
            return
        }

        const cartItemsByStore = new Map<string, TradeShopItem[]>()
        selectedItems.value.forEach((item) => {
            const storeId = item.storeId
            if (!cartItemsByStore.has(storeId)) {
                cartItemsByStore.set(storeId, [])
            }
            cartItemsByStore.get(storeId)!.push({
                goodsId: item.goodsId,
                quantity: item.quantity,
            })
        })

        checkoutLoading.value = true
        try {
            const res = await createCartOrder(selectedAddress.value.id, cartItemsByStore)
            if (res && res.data) {
                currentOrderNo.value = res.data.orderNo
                showPaymentModal.value = true
            }
        } finally {
            checkoutLoading.value = false
        }
    }

    const handlePaymentSuccess = async () => {
        showPaymentModal.value = false
        router.push({ path: '/profile', query: { tab: 'orders' } })
    }

    watch(showPaymentModal, async (newVal) => {
        if (!newVal) await loadCart()
    })

    const goToGoods = (goodsId: string) => router.push(`/goods/${goodsId}`)
    const goToStore = (storeId: string) =>
        router.push({ name: 'Store', params: { storeId: storeId } })
    const goToHome = () => router.push('/')

    onMounted(() => {
        loadCart()
    })
</script>

<style scoped>
    @reference "@/styles/index.css";

    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        @apply bg-gray-200 rounded-full;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        @apply bg-transparent;
    }

    :deep(.custom-checkbox.el-checkbox) {
        @apply h-auto;
    }
    :deep(.custom-checkbox .el-checkbox__inner) {
        @apply w-5 h-5 rounded-full border-gray-300;
    }
    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
        @apply bg-orange-500 border-orange-500;
    }

    /* 移除输入框箭头 */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type='number'] {
        -moz-appearance: textfield;
    }
</style>
