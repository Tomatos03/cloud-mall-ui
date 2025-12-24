<template>
    <div class="flex flex-col h-screen bg-gray-50 overflow-hidden">
        <!-- 顶部导航 -->
        <div class="shrink-0 z-30 shadow-sm">
            <Header />
        </div>

        <!-- 主内容滚动区 -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-32">
            <div class="max-w-300 mx-auto px-6 py-8">
                <!-- 页面标题 -->
                <div class="flex items-baseline gap-4 mb-8">
                    <h2 class="text-3xl font-black text-gray-900">购物车</h2>
                    <span class="text-gray-400 font-medium">共 {{ totalItemCount }} 件商品</span>
                </div>

                <!-- 购物车内容 -->
                <div v-if="cartData.shops.length > 0" class="space-y-6">
                    <!-- 收货地址选择 -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <el-icon :size="20" class="text-orange-500"><Location /></el-icon>
                                收货地址
                            </h3>
                            <el-button
                                text
                                type="primary"
                                class="text-orange-500! font-bold"
                                @click="showAddressDialog = true"
                            >
                                <el-icon><Edit /></el-icon>
                                {{ selectedAddress ? '更换地址' : '选择地址' }}
                            </el-button>
                        </div>

                        <!-- 已选择的地址显示 -->
                        <div v-if="selectedAddress" class="bg-orange-50 rounded-xl p-4 border border-orange-100">
                            <div class="flex items-start gap-3">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="font-bold text-gray-800">{{ selectedAddress.receiver }}</span>
                                        <span class="text-gray-600">{{ selectedAddress.phone }}</span>
                                        <el-tag v-if="selectedAddress.isDefault" type="warning" size="small" effect="plain">
                                            默认
                                        </el-tag>
                                    </div>
                                    <p class="text-sm text-gray-600">
                                        {{ selectedAddress.detail }}
                                    </p>
                                    <p class="text-xs text-gray-400 mt-1">
                                        邮编: {{ selectedAddress.zipCode }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- 未选择地址提示 -->
                        <div v-else class="bg-gray-50 rounded-xl p-4 border border-gray-200 border-dashed">
                            <p class="text-gray-400 text-center">
                                请选择收货地址
                            </p>
                        </div>
                    </div>
                    <!-- 全选操作栏 -->
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 px-6 flex justify-between items-center"
                    >
                        <div class="flex items-center gap-2">
                            <el-checkbox
                                v-model="isAllSelected"
                                @change="handleSelectAll"
                                class="custom-checkbox"
                            >
                                <span class="text-gray-600 font-bold ml-1">全选</span>
                            </el-checkbox>
                        </div>
                        <button
                            v-if="selectedItems.length > 0"
                            class="text-sm font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                            @click="handleBatchDelete"
                        >
                            <el-icon><Delete /></el-icon>
                            删除选中 ({{ selectedItems.length }})
                        </button>
                    </div>

                    <!-- 按商店分组显示 -->
                    <div
                        v-for="shop in cartData.shops"
                        :key="shop.shopId"
                        class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <!-- 商店头部 -->
                        <div
                            class="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-100/50 transition-colors"
                            @click="goToShop(shop.shopId)"
                        >
                            <div
                                class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600"
                            >
                                <el-icon :size="18"><Shop /></el-icon>
                            </div>
                            <span class="font-bold text-gray-800">{{ shop.shopName }}</span>
                            <el-icon class="text-gray-400 ml-auto"><ArrowRight /></el-icon>
                        </div>

                        <!-- 商品列表 -->
                        <div class="divide-y divide-gray-50">
                            <div
                                v-for="item in shop.items"
                                :key="item.productId"
                                class="p-6 hover:bg-gray-50/30 transition-colors group"
                            >
                                <div class="flex items-center gap-6">
                                    <!-- 选择框 -->
                                    <el-checkbox
                                        :model-value="item.selected"
                                        @change="(val: boolean) => handleItemSelect(item, val)"
                                        class="custom-checkbox"
                                        @click.stop
                                    />

                                    <!-- 商品信息区域（可点击） -->
                                    <div
                                        class="flex items-center gap-6 flex-1 cursor-pointer"
                                        @click="goToProduct(item.productId)"
                                    >
                                        <!-- 商品图片 -->
                                        <div
                                            class="relative w-24 h-24 shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100"
                                        >
                                            <img
                                                :src="item.mainImage"
                                                :alt="item.productName"
                                                class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>

                                        <!-- 商品信息 -->
                                        <div class="flex-1 min-w-0">
                                            <h3
                                                class="text-base font-bold text-gray-800 mb-2 truncate group-hover:text-orange-500 transition-colors"
                                            >
                                                {{ item.productName }}
                                            </h3>
                                            <div class="text-xs text-gray-400">
                                                库存: {{ item.stock }} {{ item.unit }}
                                            </div>
                                        </div>

                                        <!-- 价格 -->
                                        <div class="text-right min-w-25">
                                            <div class="text-xl font-black text-orange-500">
                                                <span class="text-xs font-bold mr-0.5">￥</span
                                                >{{ (item.price / 100).toFixed(2) }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 数量控制 -->
                                    <div class="flex items-center bg-gray-100 rounded-xl p-1" @click.stop>
                                        <button
                                            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                            @click="updateQuantity(item, item.quantity - 1)"
                                            :disabled="item.quantity <= 1"
                                        >
                                            <el-icon :size="14"><Minus /></el-icon>
                                        </button>
                                        <el-input-number
                                            :model-value="item.quantity"
                                            @change="(val: number | null | undefined) => handleQuantityInput(item, val)"
                                            :min="1"
                                            :max="item.stock"
                                            :controls="false"
                                            class="quantity-input"
                                            size="small"
                                        />
                                        <button
                                            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                            @click="updateQuantity(item, item.quantity + 1)"
                                            :disabled="item.quantity >= item.stock"
                                        >
                                            <el-icon :size="14"><Plus /></el-icon>
                                        </button>
                                    </div>

                                    <!-- 删除按钮 -->
                                    <button
                                        class="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        @click.stop="handleRemoveItem(item)"
                                    >
                                        <el-icon :size="20"><Delete /></el-icon>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 空购物车状态 -->
                <div
                    v-else
                    class="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm"
                >
                    <div
                        class="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6"
                    >
                        <el-icon size="48" class="text-orange-200"><ShoppingCartFull /></el-icon>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">购物车空空如也</h3>
                    <p class="text-gray-400 text-sm mb-8">快去挑选心仪的商品吧</p>
                    <el-button
                        type="primary"
                        round
                        class="bg-orange-500! border-orange-500! px-10 h-12! font-bold shadow-lg shadow-orange-200"
                        @click="goToHome"
                    >
                        去逛逛
                    </el-button>
                </div>
            </div>
        </div>

        <!-- 底部结算栏 -->
        <div
            v-if="cartData.shops.length > 0"
            class="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-6xl px-6 z-40"
        >
            <div
                class="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl p-4 px-8 flex justify-between items-center"
            >
                <div class="flex items-center gap-8">
                    <el-checkbox
                        v-model="isAllSelected"
                        @change="handleSelectAll"
                        class="custom-checkbox"
                    >
                        <span class="text-gray-600 font-bold ml-1">全选</span>
                    </el-checkbox>
                    <div class="h-6 w-px bg-gray-100"></div>
                    <span class="text-sm text-gray-500">
                        已选
                        <span class="text-orange-500 font-black text-lg mx-1">{{
                            selectedItems.length
                        }}</span>
                        件商品
                    </span>
                </div>

                <div class="flex items-center gap-8">
                    <div class="text-right">
                        <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                            合计金额
                        </p>
                        <div class="text-2xl font-black text-orange-500">
                            <span class="text-sm mr-0.5">￥</span
                            >{{ (totalSelectedPrice / 100).toFixed(2) }}
                        </div>
                    </div>
                    <el-button
                        type="primary"
                        class="bg-orange-500! border-orange-500! rounded-2xl! h-14! px-10! text-lg! font-black shadow-xl shadow-orange-200 hover:scale-105! active:scale-95! transition-all"
                        :loading="checkoutLoading"
                        @click="handleCheckout"
                    >
                        立即结算
                    </el-button>
                </div>
            </div>
        </div>

        <!-- 支付弹窗 -->
        <PaymentModal
            v-model:visible="showPaymentModal"
            :amount="totalSelectedPrice / 100"
            :order-no="currentOrderNo"
            :quantity="selectedItems.length"
            @success="handlePaymentSuccess"
        />

        <!-- 地址选择对话框 -->
        <el-dialog
            v-model="showAddressDialog"
            title="选择收货地址"
            width="600px"
            :close-on-click-modal="false"
        >
            <div class="space-y-3 max-h-96 overflow-y-auto">
                <div
                    v-for="address in addressList"
                    :key="address.id"
                    class="border rounded-xl p-4 cursor-pointer transition-all hover:border-orange-300 hover:bg-orange-50/30"
                    :class="selectedAddress?.id === address.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'"
                    @click="selectedAddress = address"
                >
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <el-radio
                                    :model-value="selectedAddress?.id"
                                    :label="address.id"
                                    @click.stop="selectedAddress = address"
                                />
                                <span class="font-bold text-gray-800">{{ address.receiver }}</span>
                                <span class="text-gray-600">{{ address.phone }}</span>
                                <el-tag v-if="address.isDefault" type="warning" size="small" effect="plain">
                                    默认
                                </el-tag>
                            </div>
                            <p class="text-sm text-gray-600 ml-6">
                                {{ address.detail }}
                            </p>
                            <p class="text-xs text-gray-400 mt-1 ml-6">
                                邮编: {{ address.zipCode }}
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="addressList.length === 0" class="text-center py-8 text-gray-400">
                    暂无收货地址
                </div>
            </div>

            <template #footer>
                <div class="flex justify-between items-center">
                    <el-button @click="goToAddressManagement" text type="primary">
                        <el-icon><Plus /></el-icon>
                        管理地址
                    </el-button>
                    <div class="space-x-2">
                        <el-button @click="showAddressDialog = false">取消</el-button>
                        <el-button
                            type="primary"
                            @click="showAddressDialog = false"
                            :disabled="!selectedAddress"
                        >
                            确认
                        </el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Shop, ShoppingCartFull, Delete, Plus, Minus, ArrowRight, Location, Edit } from '@element-plus/icons-vue'
import Header from '@/views/home/model/Header.vue'
import PaymentModal from '@/views/goods/model/PaymentModal.vue'
import {
    fetchCart,
    updateCartItem,
    removeCartItem,
    type CartItem,
    type CartResponse,
} from '@/api/cart'
import { createCartOrder, type TradeShopItem } from '@/api/order'
import { fetchAddressList, type Address } from '@/api/address'

const router = useRouter()
const cartData = ref<CartResponse>({ shops: [] })
const checkoutLoading = ref(false)
const showPaymentModal = ref(false)
const currentOrderNo = ref('')

// 地址相关
const addressList = ref<Address[]>([])
const selectedAddress = ref<Address | null>(null)
const showAddressDialog = ref(false)

// 获取所有商品项（扁平化）
const allItems = computed(() => {
    return cartData.value.shops.flatMap((shop) => shop.items)
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

// 加载购物车数据
// 加载地址列表
const loadAddressList = async () => {
    try {
        const res = await fetchAddressList()
        addressList.value = res.data
        // 自动选择默认地址
        const defaultAddress = addressList.value.find(addr => addr.isDefault)
        if (defaultAddress) {
            selectedAddress.value = defaultAddress
        } else if (addressList.value.length > 0) {
            selectedAddress.value = addressList.value[0] || null
        }
    } catch (err) {
        console.error('加载地址列表失败:', err)
    }
}

const loadCart = async () => {
    try {
        const res = await fetchCart()
        cartData.value = res.data
    } catch (err) {
        console.error('加载购物车失败:', err)
        ElMessage.error('加载购物车失败')
    }
}

// 更新数量
const updateQuantity = async (item: CartItem, newQty: number) => {
    if (newQty < 1 || newQty > item.stock) return
    try {
        const res = await updateCartItem({
            storeId: item.shopId,
            goodsId: item.productId,
            quantity: newQty
        })
        // 更新本地数据
        item.quantity = res.data.quantity
    } catch {
        ElMessage.error('更新失败')
    }
}

// 处理输入数量
const handleQuantityInput = async (item: CartItem, value: number | null | undefined) => {
    let newQty = value || 1

    // 如果输入值小于1，设置为1
    if (newQty < 1) {
        newQty = 1
    }

    // 如果输入值大于库存，设置为库存数量
    if (newQty > item.stock) {
        newQty = item.stock
    }

    // 如果数量没有变化，直接返回
    if (newQty === item.quantity) {
        return
    }

    await updateQuantity(item, newQty)
}

// 切换单项选中状态（仅本地操作）
const handleItemSelect = (item: CartItem, selected: boolean) => {
    // 仅切换本地状态，不发送请求
    item.selected = selected
}

// 全选/取消全选（仅本地操作）
const handleSelectAll = (selected: boolean) => {
    const isSelected = !!selected
    // 更新所有商品的本地选中状态
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
        await removeCartItem(item.shopId, item.productId)

        // 从本地数据中移除
        cartData.value.shops.forEach((shop) => {
            shop.items = shop.items.filter((i) => i.productId !== item.productId)
        })
        // 移除空店铺
        cartData.value.shops = cartData.value.shops.filter((shop) => shop.items.length > 0)

        ElMessage.success('已移除')
    } catch (err) {
        // 用户取消或删除失败
        if (err !== 'cancel') {
            console.error('删除失败:', err)
        }
    }
}

// 批量删除
const handleBatchDelete = async () => {
    if (selectedItems.value.length === 0) {
        ElMessage.warning('请先选择要删除的商品')
        return
    }

    try {
        await ElMessageBox.confirm(
            `确定要删除选中的 ${selectedItems.value.length} 件商品吗？`,
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )

        // 批量删除所有选中的商品
        const deletePromises = selectedItems.value.map((item) =>
            removeCartItem(item.shopId, item.productId)
        )
        await Promise.all(deletePromises)

        // 重新加载购物车
        await loadCart()
        ElMessage.success('删除成功')
    } catch (err) {
        // 用户取消或删除失败
        if (err !== 'cancel') {
            console.error('批量删除失败:', err)
        }
    }
}

// 结算 - 创建订单
const handleCheckout = async () => {
    if (cartData.value.shops.length === 0) {
        ElMessage.warning('购物车是空的，快去添加商品吧')
        return
    }

    if (selectedItems.value.length === 0) {
        ElMessage.warning('没有选中任何商品')
        return
    }

    if (!selectedAddress.value) {
        ElMessage.warning('请先选择收货地址')
        return
    }

    // 按店铺分组选中的商品
    const cartItemsByStore = new Map<number, TradeShopItem[]>()
    
    selectedItems.value.forEach((item) => {
        const storeId = item.shopId
        if (!cartItemsByStore.has(storeId)) {
            cartItemsByStore.set(storeId, [])
        }
        cartItemsByStore.get(storeId)!.push({
            goodsId: item.productId,
            quantity: item.quantity,
        })
    })

    checkoutLoading.value = true
    try {
        // 调用创建订单接口 - 支持多店铺多商品
        const res = await createCartOrder(
            selectedAddress.value.id,
            cartItemsByStore
        )

        // 检查是否返回订单编号
        if (res && res.data) {
            // 保存订单编号并打开支付弹窗
            currentOrderNo.value = res.data.orderNo
            showPaymentModal.value = true
        }
    } catch (err) {
        console.error('创建订单失败:', err)
        // http工具类会处理错误提示，这里不需要手动处理
    } finally {
        checkoutLoading.value = false
    }
}

// 支付成功回调
const handlePaymentSuccess = async () => {
    showPaymentModal.value = false

    // 删除已结算的商品
    const deletePromises = selectedItems.value.map((item) =>
        removeCartItem(item.shopId, item.productId)
    )
    await Promise.all(deletePromises)

    // 重新加载购物车
    await loadCart()

    // 跳转到订单列表页
    router.push({ path: '/profile', query: { tab: 'orders' } })
}

// 跳转到商品详情
const goToProduct = (productId: number) => {
    router.push(`/goods/${productId}`)
}

// 跳转到店铺
const goToShop = (shopId: number) => {
    router.push({ name: 'Store', params: { storeId: shopId.toString() } })
}

// 跳转到首页
const goToHome = () => {
    router.push('/')
}

const goToAddressManagement = () => {
  showAddressDialog.value = false
  router.push('/profile?tab=address')
}

onMounted(() => {
    loadCart()
    loadAddressList()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

:deep(.custom-checkbox.el-checkbox) {
    height: auto;
}
:deep(.custom-checkbox .el-checkbox__inner) {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    border-color: #e5e7eb;
}
:deep(.custom-checkbox .el-checkbox__inner::after) {
    width: 6px;
    height: 10px;
    left: 6px;
}
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #f97316;
    border-color: #f97316;
}

:deep(.quantity-input) {
    width: 50px;
    margin: 0 4px;
}

:deep(.quantity-input .el-input__wrapper) {
    background: transparent;
    box-shadow: none;
    padding: 0;
}

:deep(.quantity-input .el-input__inner) {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #374151;
    height: 32px;
}
</style>
