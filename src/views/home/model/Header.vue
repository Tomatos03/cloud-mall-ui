<template>
    <div class="bg-white flex items-center justify-around h-25 px-25">
        <!-- Logo 和文本 -->
        <div class="flex items-center space-x-3">
            <div class="shrink-0">
                <img class="h-10 w-10 rounded-lg" src="/favicon.ico" alt="Logo" />
            </div>
            <div class="flex flex-col">
                <h1 class="text-xl font-bold text-gray-900">购物商城</h1>
                <span class="text-xs text-gray-500">Online Shop</span>
            </div>
        </div>

        <!-- 搜索框 -->
        <div class="flex-1 max-w-2xl mx-8">
            <div class="flex items-center gap-2">
                <el-input
                    v-model="searchKeyword"
                    placeholder="搜索商品"
                    class="flex-1"
                    clearable
                    @keyup.enter="handleSearch"
                />
                <el-button :icon="Search" type="primary" @click="handleSearch" class="search-btn" />
            </div>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-4">
            <el-button :icon="ShoppingCart" circle size="large" @click="goToCart" />
            <!-- 使用下拉菜单包裹头像按钮，提供“个人信息”和“退出登录”两个选项 -->
            <el-dropdown @command="handleCommand" trigger="click">
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
                <el-button :icon="User" circle size="large" />
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { Search, ShoppingCart, User } from '@element-plus/icons-vue'
    import { useRouter } from 'vue-router'
    import { ElMessageBox, ElMessage } from 'element-plus'
    // 新增：引入 user store
    import { useUserStore } from '@/stores/user'

    const router = useRouter()
    const searchKeyword = ref('')
    const goToCart = () => {
        router.push({ name: 'Cart' }).catch(() => {})
    }
    // 创建 store 实例
    const userStore = useUserStore()

    const handleSearch = () => {
        if (searchKeyword.value.trim()) {
            console.log('搜索关键词:', searchKeyword.value)
            // 跳转到搜索结果页
            router.push({ name: 'Search', query: { keyword: searchKeyword.value } })
        }
    }

    // 处理下拉命令
    const handleCommand = async (command: string) => {
        if (command === 'profile') {
            // 跳转到个人信息页（请确保路由已配置）
            router.push({ name: 'profile' }).catch(() => {})
        } else if (command === 'logout') {
            await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                userStore.logout()
                ElMessage({ type: 'success', message: '已退出登录' })
            })
        }
    }
</script>

<style scoped>
    :deep(.el-input__wrapper) {
        border-radius: 4px;
        border: 1px solid #dcdfe6;
    }

    .search-btn {
        height: 32px;
        padding: 0 15px;
        border-radius: 4px;
    }

    :deep(.el-button.is-circle) {
        padding: 8px;
    }
</style>
