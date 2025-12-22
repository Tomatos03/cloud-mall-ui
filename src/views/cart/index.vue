<template>
    <div class="flex flex-col h-screen overflow-hidden bg-gray-100">
        <el-header class="sticky top-0 z-30 shrink-0" style="padding-bottom: 10px">
            <Header />
        </el-header>

        <el-main class="flex-1 overflow-y-auto overflow-x-hidden">
            <div class="p-4">
                <el-card class="mb-6">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <span class="text-xl font-bold">购物车</span>
                            <span class="text-gray-500">共 {{ cartItems.length }} 件商品</span>
                        </div>
                    </template>

                    <!-- 全选操作栏 -->
                    <div class="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded">
                        <div class="flex items-center">
                            <el-checkbox
                                v-model="isAllSelected"
                                @change="handleSelectAll"
                            >
                                全选
                            </el-checkbox>
                        </div>
                        <el-button
                            type="danger"
                            text
                            :disabled="selectedItems.length === 0"
                            @click="handleBatchDelete"
                        >
                            删除选中 ({{ selectedItems.length }})
                        </el-button>
                    </div>

                    <!-- 购物车商品列表 -->
                    <div v-if="cartItems.length > 0">
                        <!-- 按商店分组显示 -->
                        <div v-for="store in groupedItems" :key="store.storeId" class="mb-6">
                            <div class="flex items-center mb-3 p-2 bg-blue-50 rounded">
                                <el-icon class="mr-2"><Shop /></el-icon>
                                <span class="font-medium">{{ store.storeName }}</span>
                            </div>

                            <div v-for="item in store.items" :key="item.id" class="border-b pb-4 mb-4">
                                <div class="flex items-center space-x-4">
                                    <!-- 选择框 -->
                                    <el-checkbox
                                        v-model="item.selected"
                                        @change="handleItemSelect(item)"
                                    />
                                    
                                    <!-- 商品图片 -->
                                    <img
                                        :src="item.img"
                                        :alt="item.title"
                                        class="w-20 h-20 object-cover rounded"
                                    />
                                    
                                    <!-- 商品信息 -->
                                    <div class="flex-1">
                                        <h3 class="text-lg font-medium">{{ item.title }}</h3>
                                        <div v-if="item.attributes" class="text-sm text-gray-500 mt-1">
                                            <span v-if="item.attributes.color">颜色: {{ item.attributes.color }}</span>
                                            <span v-if="item.attributes.size" class="ml-2">尺寸: {{ item.attributes.size }}</span>
                                            <span v-if="item.attributes.spec" class="ml-2">规格: {{ item.attributes.spec }}</span>
                                        </div>
                                        <div class="text-sm text-gray-500 mt-1">
                                            库存: {{ item.stock }} 件
                                        </div>
                                    </div>
                                    
                                    <!-- 价格 -->
                                    <div class="text-right">
                                        <div class="text-lg font-bold text-red-500">{{ item.price }}</div>
                                    </div>
                                    
                                    <!-- 数量控制 -->
                                    <div class="flex items-center space-x-2">
                                        <el-button
                                            size="small"
                                            @click="decreaseQuantity(item)"
                                            :disabled="item.quantity <= 1"
                                        >
                                            -
                                        </el-button>
                                        <span class="w-12 text-center">{{ item.quantity }}</span>
                                        <el-button
                                            size="small"
                                            @click="increaseQuantity(item)"
                                            :disabled="item.quantity >= item.stock"
                                        >
                                            +
                                        </el-button>
                                    </div>
                                    
                                    <!-- 删除按钮 -->
                                    <el-button
                                        type="danger"
                                        text
                                        @click="handleRemoveItem(item)"
                                    >
                                        删除
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 空购物车状态 -->
                    <div v-else class="text-center py-20">
                        <el-icon size="80" class="text-gray-400"><ShoppingCartFull /></el-icon>
                        <p class="text-gray-500 mt-4">购物车是空的</p>
                        <el-button type="primary" class="mt-4" @click="goToHome">
                            去逛逛
                        </el-button>
                    </div>
                </el-card>
            </div>

            <Footer />
        </el-main>

        <!-- 底部结算栏 -->
        <div v-if="cartItems.length > 0" class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
            <div class="flex justify-between items-center p-4">
                <div class="flex items-center">
                    <el-checkbox
                        v-model="isAllSelected"
                        @change="handleSelectAll"
                    >
                        全选
                    </el-checkbox>
                    <span class="ml-4 text-gray-600">
                        已选 {{ selectedItems.length }} 件商品
                    </span>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="text-right">
                        <div class="text-sm text-gray-500">
                            合计: <span class="text-lg font-bold text-red-500">{{ formatPrice(totalSelectedPrice) }}</span>
                        </div>
                    </div>
                    <el-button
                        type="primary"
                        size="large"
                        :disabled="selectedItems.length === 0"
                        @click="handleCheckout"
                    >
                        结算 ({{ selectedItems.length }})
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
import Header from '@/views/home/model/Header.vue'
import Footer from '@/views/home/model/Footer.vue'
import {
    fetchCartItems,
    updateCartItemQuantity,
    removeCartItem,
    removeCartItems,
    toggleCartItemSelected,
    toggleAllCartItems,
    type CartItem
} from '@/api/cart'

const router = useRouter()
const cartItems = ref<CartItem[]>([])

// 按商店分组的商品
const groupedItems = computed(() => {
    const groups = new Map()
    
    cartItems.value.forEach(item => {
        if (!groups.has(item.storeId)) {
            groups.set(item.storeId, {
                storeId: item.storeId,
                storeName: item.storeName,
                items: []
            })
        }
        groups.get(item.storeId).items.push(item)
    })
    
    return Array.from(groups.values())
})

// 选中的商品
const selectedItems = computed(() => {
    return cartItems.value.filter(item => item.selected)
})

// 是否全选
const isAllSelected = computed({
    get: () => cartItems.value.length > 0 && cartItems.value.every(item => item.selected),
    set: () => {} // 通过 handleSelectAll 处理
})

// 选中商品的总价
const totalSelectedPrice = computed(() => {
    return selectedItems.value.reduce((total, item) => {
        return total + (item.price_cents * item.quantity)
    }, 0)
})

// 加载购物车数据
const loadCartItems = async () => {
    try {
        const res = await fetchCartItems()
        cartItems.value = res.data
    } catch (error) {
        console.error('加载购物车失败:', error)
        ElMessage.error('加载购物车失败')
    }
}

// 增加数量
const increaseQuantity = async (item: CartItem) => {
    if (item.quantity >= item.stock) return
    
    try {
        await updateCartItemQuantity({
            cartItemId: item.id,
            quantity: item.quantity + 1
        })
        item.quantity++
        ElMessage.success('更新成功')
    } catch (error) {
        console.error('更新数量失败:', error)
        ElMessage.error('更新失败')
    }
}

// 减少数量
const decreaseQuantity = async (item: CartItem) => {
    if (item.quantity <= 1) return
    
    try {
        await updateCartItemQuantity({
            cartItemId: item.id,
            quantity: item.quantity - 1
        })
        item.quantity--
        ElMessage.success('更新成功')
    } catch (error) {
        console.error('更新数量失败:', error)
        ElMessage.error('更新失败')
    }
}

// 选择/取消选择商品
const handleItemSelect = async (item: CartItem) => {
    try {
        await toggleCartItemSelected(item.id, item.selected)
    } catch (error) {
        console.error('更新选择状态失败:', error)
        ElMessage.error('更新失败')
        // 回滚状态
        item.selected = !item.selected
    }
}

// 全选/取消全选
const handleSelectAll = async (selected: boolean) => {
    try {
        await toggleAllCartItems(selected)
        cartItems.value.forEach(item => {
            item.selected = selected
        })
    } catch (error) {
        console.error('全选操作失败:', error)
        ElMessage.error('操作失败')
    }
}

// 删除单个商品
const handleRemoveItem = async (item: CartItem) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除 "${item.title}" 吗？`,
            '确认删除',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )
        
        await removeCartItem(item.id)
        cartItems.value = cartItems.value.filter(i => i.id !== item.id)
        ElMessage.success('删除成功')
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败:', error)
            ElMessage.error('删除失败')
        }
    }
}

// 批量删除选中商品
const handleBatchDelete = async () => {
    if (selectedItems.value.length === 0) return
    
    try {
        await ElMessageBox.confirm(
            `确定要删除选中的 ${selectedItems.value.length} 件商品吗？`,
            '确认删除',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )
        
        const selectedIds = selectedItems.value.map(item => item.id)
        await removeCartItems(selectedIds)
        cartItems.value = cartItems.value.filter(item => !selectedIds.includes(item.id))
        ElMessage.success('删除成功')
    } catch (error) {
        if (error !== 'cancel') {
            console.error('批量删除失败:', error)
            ElMessage.error('删除失败')
        }
    }
}

// 结算
const handleCheckout = () => {
    if (selectedItems.value.length === 0) {
        ElMessage.warning('请选择要结算的商品')
        return
    }
    
    // 跳转到订单页面，传递选中的商品信息
    router.push({
        path: '/order/checkout',
        query: {
            items: JSON.stringify(selectedItems.value.map(item => ({
                cartItemId: item.id,
                productId: item.productId,
                quantity: item.quantity
            })))
        }
    })
}

// 回到首页
const goToHome = () => {
    router.push('/')
}

// 格式化价格
const formatPrice = (cents: number) => {
    return `￥${(cents / 100).toFixed(2)}`
}

onMounted(() => {
    loadCartItems()
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
    padding-bottom: 80px; /* 为底部结算栏留出空间 */
}

:deep(.el-footer) {
    padding: 0 !important;
    height: auto !important;
}

/* 购物车商品项动画 */
.cart-item {
    transition: all 0.3s ease;
}

.cart-item:hover {
    background-color: #f8f9fa;
}
</style>