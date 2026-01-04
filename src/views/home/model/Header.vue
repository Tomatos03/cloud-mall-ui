<template>
    <div class="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div class="max-w-[1400px] mx-auto flex items-center justify-between h-16 px-6 lg:px-8">
            <!-- Logo 和文本 -->
            <div
                class="flex items-center space-x-3 cursor-pointer group transition-all"
                role="button"
                tabindex="0"
                title="返回首页"
                @click="handleLogoClick"
                @keyup.enter="handleLogoClick"
            >
                <div class="shrink-0">
                    <div class="h-9 w-9 rounded-lg bg-orange-500 flex items-center justify-center text-white transition-transform group-hover:scale-105">
                        <el-icon :size="20"><Shop /></el-icon>
                    </div>
                </div>
                <div class="flex flex-col">
                    <h1 class="text-lg font-bold text-gray-900 tracking-tight">
                        在线商城
                    </h1>
                    <span class="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium">Online Shop</span>
                </div>
            </div>

            <!-- 搜索框 -->
            <div class="flex-1 max-w-xl mx-10">
                <div class="relative flex items-center">
                    <el-input
                        v-model="searchKeyword"
                        placeholder="搜索商品..."
                        class="search-input"

                        clearable
                        @keyup.enter="handleSearch"
                    >
                        <template #prefix>
                            <el-icon class="text-gray-400">
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                    <button
                        @click="handleSearch"
                        class="absolute right-1 px-5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-full transition-colors active:scale-95"
                    >
                        搜索
                    </button>
                </div>
            </div>

            <!-- 右侧操作区 -->
            <div class="flex items-center space-x-4">
                <!-- 购物车 -->
                <div
                    class="relative p-2 text-gray-500 hover:text-orange-500 hover:bg-gray-50 cursor-pointer rounded-lg transition-all"
                    @click="goToCart"
                >
                    <el-icon :size="22"><ShoppingCart /></el-icon>
                    <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                </div>

                <!-- 用户中心 -->
                <el-dropdown @command="handleCommand" trigger="click" placement="bottom-end">
                    <div class="flex items-center gap-2 p-1 pl-1 pr-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-all border border-transparent">
                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden border border-gray-200">
                            <img v-if="userStore.avatarUrl" :src="getImageURL(userStore.avatarUrl)" class="w-full h-full object-cover" />
                            <el-icon v-else :size="18"><User /></el-icon>
                        </div>
                        <span class="text-sm font-medium text-gray-600 hidden sm:inline">{{ userStore.nickname || '未登录' }}</span>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu class="header-dropdown">
                            <el-dropdown-item command="profile">
                                <el-icon><User /></el-icon>个人中心
                            </el-dropdown-item>
                            <el-dropdown-item command="orders">
                                <el-icon><List /></el-icon>我的订单
                            </el-dropdown-item>
                            <el-dropdown-item divided command="logout" class="text-red-500!">
                                <el-icon><SwitchButton /></el-icon>退出登录
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { Search, ShoppingCart, User, List, SwitchButton, Shop } from '@element-plus/icons-vue'
    import { useRouter } from 'vue-router'
    import { ElMessageBox, ElMessage } from 'element-plus'
    import { useUserStore } from '@/stores/user'
    import { getImageURL } from '@/utils/image'

    const router = useRouter()
    const searchKeyword = ref('')
    const userStore = useUserStore()

    const goToCart = () => {
        router.push({ name: 'Cart' }).catch(() => {})
    }

    const handleLogoClick = () => {
        router.push({ name: 'Home' }).catch(() => {})
    }

    const handleSearch = () => {
        router.push({ name: 'Search', query: { keyword: searchKeyword.value || '' } })
    }

    const handleCommand = async (command: string) => {
        if (command === 'profile') {
            router.push({ name: 'profile' }).catch(() => {})
        } else if (command === 'logout') {
            try {
                await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    buttonSize: 'default'
                })
                userStore.logout()
                ElMessage({ type: 'success', message: '已退出登录' })
            } catch {
                // 取消退出
            }
        } else if (command === 'orders') {
            router.push({ name: 'profile', query: { tab: 'orders' } }).catch(() => {})
        }
    }
</script>

<style scoped>
    /* 搜索框极简定制 */
    :deep(.search-input .el-input__wrapper) {
        border-radius: 9999px;
        padding-left: 16px;
        padding-right: 70px;
        height: 38px;
        box-shadow: none !important;
        border: 1px solid #f3f4f6;
        transition: all 0.2s;
        background-color: #f9fafb;
    }

    :deep(.search-input .el-input__wrapper.is-focus) {
        background-color: #fff;
        border-color: #e5e7eb;
        box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.05) !important;
    }

    /* 下拉菜单样式 */
    .header-dropdown :deep(.el-dropdown-menu__item) {
        padding: 8px 16px;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .header-dropdown :deep(.el-dropdown-menu__item:hover) {
        background-color: #f9fafb;
        color: #f97316;
    }
</style>