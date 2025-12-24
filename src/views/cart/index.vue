```vue /home/Tomatos/Projects/design/oneline-shop-buyer/src/views/cart/index.vue
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
                    <span class="text-gray-400 font-medium">共 {{ cartItems.length }} 件商品</span>
                </div>

                <!-- 购物车内容 -->
                <div v-if="cartItems.length > 0" class="space-y-6">
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
                        v-for="store in groupedItems"
                        :key="store.shopId"
                        class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <!-- 商店头部 -->
                        <div
                            class="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3"
                        >
                            <div
                                class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600"
                            >
                                <el-icon :size="18"><Shop /></el-icon>
                            </div>
                            <span class="font-bold text-gray-800">{{ store.shopName }}</span>
                        </div>

                        <!-- 商品列表 -->
                        <div class="divide-y divide-gray-50">
                            <div
                                v-for="item in store.items"
                                :key="item.id"
                                class="p-6 hover:bg-gray-50/30 transition-colors group"
                            >
                                <div class="flex items-center gap-6">
                                    <!-- 选择框 -->
                                    <el-checkbox
                                        v-model="item.selected"
                                        @change="handleItemSelect(item)"
                                        class="custom-checkbox"
                                    />

                                    <!-- 商品图片 -->
                                    <div
                                        class="relative w-24 h-24 shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100"
                                    >
                                        <img
                                            :src="item.mainImg"
                                            :alt="item.goodsName"
                                            class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    <!-- 商品信息 -->
                                    <div class="flex-1 min-w-0">
                                        <h3
                                            class="text-base font-bold text-gray-800 mb-2 truncate group-hover:text-orange-500 transition-colors"
                                        >
                                            {{ item.goodsName }}
                                        </h3>
                                        <div
                                            v-if="item.options && item.options.length > 0"
                                            class="flex flex-wrap gap-2 mb-2"
                                        >
                                            <span
                                                v-for="(opt, idx) in item.options"
                                                :key="idx"
                                                class="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500"
                                            >
                                                {{ opt }}
                                            </span>
                                        </div>
                                        <div class="text-xs text-gray-400">
                                            库存: {{ item.inventory }} 件
                                        </div>
                                    </div>

                                    <!-- 价格 -->
                                    <div class="text-right min-w-25">
                                        <div class="text-xl font-black text-orange-500">
                                            <span class="text-xs font-bold mr-0.5">￥</span
                                            >{{ (item.price / 100).toFixed(2) }}
                                        </div>
                                    </div>

                                    <!-- 数量控制 -->
                                    <div class="flex items-center bg-gray-100 rounded-xl p-1">
                                        <button
                                            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                            @click="updateQuantity(item, item.quantity - 1)"
                                            :disabled="item.quantity <= 1"
                                        >
                                            <el-icon :size="14"><Minus /></el-icon>
                                        </button>
                                        <span
                                            class="w-10 text-center text-sm font-bold text-gray-700"
                                            >{{ item.quantity }}</span
                                        >
                                        <button
                                            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                            @click="updateQuantity(item, item.quantity + 1)"
                                            :disabled="item.quantity >= item.inventory"
                                        >
                                            <el-icon :size="14"><Plus /></el-icon>
                                        </button>
                                    </div>

                                    <!-- 删除按钮 -->
                                    <button
                                        class="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        @click="handleRemoveItem(item)"
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
            v-if="cartItems.length > 0"
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
                        :disabled="selectedItems.length === 0"
                        @click="handleCheckout"
                    >
                        立即结算
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElMessageBox, ElMessage } from 'element-plus'
    import { Shop, ShoppingCartFull, Delete, Plus, Minus } from '@element-plus/icons-vue'
    import Header from '@/views/home/model/Header.vue'
    import {
        fetchCartItems,
        updateCartItem,
        removeCartItem,
        removeCartItems,
        updateCartBatch,
        type CartItem,
    } from '@/api/cart'

    const router = useRouter()
    const cartItems = ref<CartItem[]>([])

    // 按店铺分组
    const groupedItems = computed(() => {
        const groups = new Map()
        cartItems.value.forEach((item) => {
            if (!groups.has(item.shopId)) {
                groups.set(item.shopId, {
                    shopId: item.shopId,
                    shopName: item.shopName,
                    items: [],
                })
            }
            groups.get(item.shopId).items.push(item)
        })
        return Array.from(groups.values())
    })

    // 选中项
    const selectedItems = computed(() => {
        return cartItems.value.filter((item) => item.selected)
    })

    // 全选状态控制
    const isAllSelected = computed({
        get: () => cartItems.value.length > 0 && cartItems.value.every((item) => item.selected),
        set: (val) => val,
    })

    // 总价计算
    const totalSelectedPrice = computed(() => {
        return selectedItems.value.reduce((total, item) => {
            return total + item.price * item.quantity
        }, 0)
    })

    // 加载数据
    const loadCartItems = async () => {
        try {
            const res = await fetchCartItems()
            cartItems.value = res.data
        } catch (error) {
            console.error('加载购物车失败:', error)
        }
    }

    // 更新数量
    const updateQuantity = async (item: CartItem, newQty: number) => {
        if (newQty < 1 || newQty > item.inventory) return
        try {
            await updateCartItem(item.id, { quantity: newQty })
            item.quantity = newQty
        } catch (error) {
            ElMessage.error('更新失败')
        }
    }

    // 切换单项选中状态
    const handleItemSelect = async (item: CartItem) => {
        try {
            await updateCartItem(item.id, { selected: item.selected })
        } catch (error) {
            item.selected = !item.selected
            ElMessage.error('更新失败')
        }
    }

    // 全选/取消全选
    const handleSelectAll = async (selected: any) => {
        const isSelected = !!selected
        try {
            await updateCartBatch({ selected: isSelected })
            cartItems.value.forEach((item) => {
                item.selected = isSelected
            })
        } catch (error) {
            ElMessage.error('操作失败')
        }
    }

    // 删除单项
    const handleRemoveItem = async (item: CartItem) => {
        try {
            await ElMessageBox.confirm(`确定要从购物车中移除该商品吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
            await removeCartItem(item.id)
            cartItems.value = cartItems.value.filter((i) => i.id !== item.id)
            ElMessage.success('已移除')
        } catch {
            // 取消
        }
    }

    // 批量删除
    const handleBatchDelete = async () => {
        if (selectedItems.value.length === 0) return
        const ids = selectedItems.value.map((item) => item.id)
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
            await removeCartItems(ids)
            cartItems.value = cartItems.value.filter((item) => !ids.includes(item.id))
            ElMessage.success('删除成功')
        } catch {
            // 取消
        }
    }

    // 结算
    const handleCheckout = () => {
        if (selectedItems.value.length === 0) {
            ElMessage.warning('请选择要结算的商品')
            return
        }
        router.push({
            path: '/order/checkout',
            query: {
                items: JSON.stringify(
                    selectedItems.value.map((item) => ({
                        cartItemId: item.id,
                        goodsId: item.goodsId,
                        quantity: item.quantity,
                    })),
                ),
            },
        })
    }

    const goToHome = () => {
        router.push('/')
    }

    onMounted(() => {
        loadCartItems()
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
</style>
