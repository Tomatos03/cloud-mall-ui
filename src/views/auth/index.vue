<template>
    <div class="h-screen w-screen flex items-center justify-center bg-gray-100 shadow-xl">
        <div class="w-96 h-100 bg-white p-6 rounded-lg shadow flex flex-col justify-around">
            <!-- 标题 -->
            <h2 class="text-2xl font-semibold text-center mb-6">
                {{ mode === 'login' ? '登录' : '注册' }}
            </h2>

            <!-- 表单切换 -->
            <LoginForm v-if="mode === 'login'" />
            <RegisterForm v-else />

            <!-- 切换入口 -->
            <div class="text-center text-sm mt-4">
                <span v-if="mode === 'login'">
                    没有账号？
                    <button class="text-blue-500" @click="switchToRegister">去注册</button>
                </span>

                <span v-else>
                    已有账号？
                    <button class="text-blue-500" @click="switchToLogin">去登录</button>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import LoginForm from './LoginForm.vue'
    import RegisterForm from './Register.vue'

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
