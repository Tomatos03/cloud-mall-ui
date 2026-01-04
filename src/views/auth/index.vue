<template>
    <div
        class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center relative"
    >
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

        <div
            class="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl relative z-10 border border-white/20"
        >
            <div>
                <div class="flex justify-center">
                    <div
                        class="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 transform transition-transform hover:scale-110 duration-300"
                    >
                        <el-icon :size="32" color="white"><Shop /></el-icon>
                    </div>
                </div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    {{ mode === 'login' ? '欢迎回来' : '创建新账号' }}
                </h2>
                <p class="mt-2 text-center text-sm text-gray-500">
                    {{ mode === 'login' ? '登录您的商城账号以继续购物' : '加入我们，开启您的购物之旅' }}
                </p>
            </div>

            <div class="mt-8">
                <transition name="fade" mode="out-in">
                    <LoginForm v-if="mode === 'login'" />
                    <RegisterForm v-else />
                </transition>
            </div>

            <div class="mt-6">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-100"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-4 bg-white/0 text-gray-400">
                            {{ mode === 'login' ? '还没有账号？' : '已经有账号了？' }}
                        </span>
                    </div>
                </div>

                <div class="mt-6">
                    <button
                        v-if="mode === 'login'"
                        @click="switchToRegister"
                        class="w-full flex justify-center py-3 px-4 border border-orange-500 rounded-xl shadow-sm text-sm font-bold text-orange-600 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
                    >
                        立即注册
                    </button>
                    <button
                        v-else
                        @click="switchToLogin"
                        class="w-full flex justify-center py-3 px-4 border border-orange-500 rounded-xl shadow-sm text-sm font-bold text-orange-600 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
                    >
                        返回登录
                    </button>
                </div>
            </div>

            <div class="mt-8 text-center">
                <router-link
                    to="/"
                    class="text-xs text-gray-400 hover:text-orange-500 transition-colors flex items-center justify-center gap-1"
                >
                    <el-icon><Back /></el-icon>
                    返回首页
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import LoginForm from './LoginForm.vue'
    import RegisterForm from './Register.vue'
    import { Shop, Back } from '@element-plus/icons-vue'

    type Mode = 'login' | 'register'

    const route = useRoute()
    const router = useRouter()

    const normalize = (m: unknown): Mode => (String(m) === 'register' ? 'register' : 'login')

    const mode = ref<Mode>(normalize(route.params.mode))

    // 当路由参数变化时更新模式
    watch(
        () => route.params.mode,
        (val) => {
            mode.value = normalize(val)
        },
    )

    const switchToLogin = () => {
        router.push({ name: 'Auth', params: { mode: 'login' } })
    }
    const switchToRegister = () => {
        router.push({ name: 'Auth', params: { mode: 'register' } })
    }
</script>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.2s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>