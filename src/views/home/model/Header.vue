<template>
    <div class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div class="max-w-350 mx-auto flex items-center justify-between h-20 px-6 lg:px-10">
            <!-- Logo 和文本 -->
            <div
                class="flex items-center space-x-3 cursor-pointer group transition-all"
                role="button"
                tabindex="0"
                title="返回首页"
                @click="handleLogoClick"
                @keyup.enter="handleLogoClick"
            >
                <div class="shrink-0 relative">
                    <div class="absolute -inset-1 bg-orange-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <img class="relative h-10 w-10 rounded-xl shadow-sm" src="/favicon.ico" alt="Logo" />
                </div>
                <div class="flex flex-col">
                    <h1 class="text-xl font-black bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        在线商城
                    </h1>
                    <span class="text-[10px] uppercase tracking-widest text-orange-500 font-bold">Online Shop</span>
                </div>
            </div>

            <!-- 搜索框 -->
            <div class="flex-1 max-w-2xl mx-12">
                <div class="relative flex items-center group">
                    <el-input
                        v-model="searchKeyword"
                        placeholder="搜索你心仪的商品..."
                        class="search-input"
                        clearable
                        @keyup.enter="handleSearch"
                    >
                        <template #prefix>
                            <el-icon class="text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                    <button
                        @click="handleSearch"
                        class="absolute right-1.5 px-6 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-orange-200 active:scale-95"
                    >
                        搜索
                    </button>
                </div>
            </div>

            <!-- 右侧操作区 -->
            <div class="flex items-center space-x-5">
                <!-- 购物车 -->
                <div
                    class="relative p-2.5 text-gray-600 hover:text-orange-500 hover:bg-orange-50 cursor-pointer rounded-full transition-all group"
                    @click="goToCart"
                >
                    <el-icon :size="24"><ShoppingCart /></el-icon>
                    <span class="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                </div>

                <!-- 用户中心 -->
                <el-dropdown @command="handleCommand" trigger="click" placement="bottom-end">
                    <div class="flex items-center gap-2 p-1 pr-3 hover:bg-gray-50 rounded-full cursor-pointer transition-all border border-transparent hover:border-gray-100">
                        <div class="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 overflow-hidden border border-orange-200">
                            <img v-if="userStore.avatarUrl" :src="getImageURL(userStore.avatarUrl)" class="w-full h-full object-cover" />
                            <el-icon v-else :size="20"><User /></el-icon>
                        </div>
                        <span class="text-sm font-medium text-gray-700 hidden sm:inline">{{ userStore.nickname || '未登录' }}</span>
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
    import { Search, ShoppingCart, User, List, SwitchButton } from '@element-plus/icons-vue'
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
        if (searchKeyword.value.trim()) {
            router.push({ name: 'Search', query: { keyword: searchKeyword.value } })
        }
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
    /* 搜索框深度定制 */
    :deep(.search-input .el-input__wrapper) {
        border-radius: 9999px;
        padding-left: 20px;
        padding-right: 80px;
        height: 44px;
        box-shadow: 0 2px 12px -2px rgba(0, 0, 0, 0.05) !important;
        border: 2px solid transparent;
        transition: all 0.3s;
        background-color: #f9fafb;
    }

    :deep(.search-input .el-input__wrapper.is-focus) {
        background-color: #fff;
        border-color: #f97316; /* orange-500 */
        box-shadow: 0 4px 20px -5px rgba(249, 115, 22, 0.2) !important;
    }

    /* 下拉菜单样式 */
    .header-dropdown :deep(.el-dropdown-menu__item) {
        padding: 10px 20px;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .header-dropdown :deep(.el-dropdown-menu__item:hover) {
        background-color: #fff7ed;
        color: #f97316;
    }
</style>
