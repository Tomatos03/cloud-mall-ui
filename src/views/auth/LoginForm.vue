<template>
    <div class="w-full">
        <el-form :model="loginForm" ref="formRef" :rules="rules" label-width="0" class="space-y-4">
            <el-form-item prop="username">
                <el-input
                    v-model="loginForm.username"
                    placeholder="请输入用户名"
                    :prefix-icon="User"
                    class="custom-input"
                />
            </el-form-item>

            <el-form-item prop="password">
                <el-input
                    v-model="loginForm.password"
                    type="password"
                    placeholder="请输入密码"
                    :prefix-icon="Lock"
                    show-password
                    class="custom-input"
                />
            </el-form-item>

            <div class="flex items-center justify-between mb-4">
                <el-checkbox v-model="rememberMe" class="text-gray-500">记住我</el-checkbox>
                <a href="#" class="text-sm text-orange-500 hover:text-orange-600 transition-colors"
                    >忘记密码？</a
                >
            </div>

            <el-form-item>
                <el-button
                    type="primary"
                    @click="submitLoginForm"
                    :loading="loading"
                    class="w-full bg-orange-500! border-orange-500! hover:bg-orange-600! rounded-xl! h-12! font-bold text-lg shadow-lg shadow-orange-200 transition-all duration-200"
                >
                    登录
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
    import { login, type LoginPayload } from '@/api/auth'
    import { useUserStore } from '@/stores/user'
    import { ElMessage } from 'element-plus'
    import { reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { User, Lock } from '@element-plus/icons-vue'
    import type { FormInstance, FormRules } from 'element-plus'
    import { getUserInfo } from '@/api/user'

    const userStore = useUserStore()
    const router = useRouter()
    const formRef = ref<FormInstance>()
    const loading = ref(false)
    const rememberMe = ref(false)

    const loginForm = reactive<LoginPayload>({
        username: '',
        password: '',
    })

    const rules: FormRules = {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    }

    const submitLoginForm = async () => {
        if (!formRef.value) return

        await formRef.value.validate(async (valid) => {
            if (valid) {
                loading.value = true
                try {
                    const res = await login(loginForm)
                    const token = res.data.token
                    if (token) userStore.setToken(res.data.token)

                    const userRes = await getUserInfo()
                    userStore.setUser(userRes.data)

                    ElMessage.success('登录成功')
                    router.push('/')
                } catch (error) {
                    console.error(error)
                } finally {
                    loading.value = false
                }
            }
        })
    }
</script>

<style scoped>
    @reference "../../styles/index.css";

    .custom-input :deep(.el-input__wrapper) {
        @apply rounded-xl bg-gray-50 border-none shadow-none px-4 py-2 transition-all duration-200;
    }

    .custom-input :deep(.el-input__wrapper.is-focus) {
        @apply bg-white ring-2 ring-orange-500/20;
    }

    .custom-input :deep(.el-input__inner) {
        @apply h-10;
    }
</style>
