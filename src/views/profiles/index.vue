<template>
    <div class="flex flex-col min-h-screen bg-slate-50">
        <!-- 顶部导航栏 -->
        <el-header class="shrink-0" style="padding: 0; height: auto;">
            <Header />
        </el-header>

        <!-- 个人中心主体 -->
        <el-main class="flex-1 pt-6 pb-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col md:flex-row items-start gap-8 mt-5">
                    <!-- 左侧切换选项 -->
                    <div class="w-full md:w-64 shrink-0">
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:sticky md:top-[104px] min-h-[600px] flex flex-col">
                            <!-- 用户简要信息 -->
                            <div class="p-6 border-b border-gray-50 flex flex-col items-center">
                                <el-avatar
                                    :size="80"
                                    :src="userStore.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                                    class="border-4 border-orange-50 mb-4"
                                />
                                <h2 class="text-lg font-bold text-gray-800">{{ userStore.nickname || '未设置昵称' }}</h2>
                                <p class="text-xs text-gray-400 mt-1">ID: {{ userStore.id || '---' }}</p>
                            </div>

                            <!-- 菜单列表 -->
                            <nav class="p-4 space-y-2 flex-1 flex flex-col">
                                <div
                                    v-for="item in menuItems"
                                    :key="item.key"
                                    @click="activeTab = item.key"
                                    :class="[
                                        'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group',
                                        activeTab === item.key
                                            ? 'bg-orange-50 text-orange-500 font-bold'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                    ]"
                                >
                                    <el-icon class="text-xl" :class="activeTab === item.key ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'">
                                        <component :is="item.icon" />
                                    </el-icon>
                                    <span>{{ item.label }}</span>
                                    <el-icon v-if="activeTab === item.key" class="ml-auto text-sm"><ArrowRight /></el-icon>
                                </div>

                                <div class="pt-4 mt-auto border-t border-gray-50">
                                    <div
                                        @click="handleLogout"
                                        class="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                                    >
                                        <el-icon class="text-xl"><SwitchButton /></el-icon>
                                        <span>退出登录</span>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>

                    <!-- 右侧页面展示 -->
                    <div class="flex-1 min-w-0">
                        <transition name="fade-transform" mode="out-in">
                            <div :key="activeTab" class="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden">
                                <component :is="currentComponent" />
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </el-main>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, markRaw, h, watch, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useUserStore } from '@/stores/user'
    import { ElMessageBox, ElMessage, ElIcon } from 'element-plus'
    import {
        User,
        Location,
        Tickets,
        Star,
        SwitchButton,
        ArrowRight,
        Setting
    } from '@element-plus/icons-vue'
    import Header from '@/views/home/model/Header.vue'

    // 导入子组件
    import PersonalInfo from './model/PersonalInfo.vue'
    import AddressManager from './model/AddressManager.vue'
    import OrderManager from './model/OrderManager.vue'
    import FavoriteManager from './model/FavoriteManager.vue'

    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()

    // 菜单配置
    const menuItems = [
        { key: 'personal', label: '个人信息', icon: markRaw(User), component: markRaw(PersonalInfo) },
        { key: 'address', label: '收货地址', icon: markRaw(Location), component: markRaw(AddressManager) },
        { key: 'orders', label: '我的订单', icon: markRaw(Tickets), component: markRaw(OrderManager) },
        { key: 'favorites', label: '我的收藏', icon: markRaw(Star), component: markRaw(FavoriteManager) },
        { key: 'security', label: '账号安全', icon: markRaw(Setting), component: null },
    ]

    // 当前激活的标签
    const activeTab = ref('personal')

    // 初始化时从查询参数获取标签
    onMounted(() => {
        const tab = route.query.tab as string
        if (tab && menuItems.some(item => item.key === tab)) {
            activeTab.value = tab
        }
    })

    // 监听路由参数变化
    watch(() => route.query.tab, (newTab) => {
        if (newTab && typeof newTab === 'string' && menuItems.some(item => item.key === newTab)) {
            activeTab.value = newTab
        }
    })

    // 监听标签变化更新路由
    watch(activeTab, (newTab) => {
        if (route.query.tab !== newTab) {
            router.replace({ query: { ...route.query, tab: newTab } })
        }
    })

    // 根据 activeTab 计算当前显示的组件
    const currentComponent = computed(() => {
        const item = menuItems.find(i => i.key === activeTab.value)
        if (item?.component) {
            return item.component
        }
        // 如果组件还没实现，显示一个占位
        return {
            render: () => h('div', { class: 'p-20 text-center text-gray-400' }, [
                h(ElIcon, { size: 48, class: 'mb-4' }, () => h(item?.icon || User)),
                h('p', { class: 'text-lg' }, `${item?.label} 功能开发中...`)
            ])
        }
    })

    // 退出登录
    const handleLogout = () => {
        ElMessageBox.confirm('确定要退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            roundButton: true
        }).then(() => {
            userStore.logout()
            ElMessage.success('已退出登录')
            router.push('/')
        }).catch(() => {})
    }
</script>

<style scoped>
    .fade-transform-enter-active,
    .fade-transform-leave-active {
        transition: all 0.3s ease;
    }

    .fade-transform-enter-from {
        opacity: 0;
        transform: translateX(20px);
    }

    .fade-transform-leave-to {
        opacity: 0;
        transform: translateX(-20px);
    }

    :deep(.el-main) {
        padding: 0;
    }
</style>
