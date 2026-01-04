<template>
    <div class="w-full">
        <el-form
            :model="registerForm"
            :rules="rules"
            ref="formRef"
            label-width="0"
            class="space-y-4"
        >
            <el-form-item prop="username">
                <el-input
                    v-model="registerForm.username"
                    placeholder="请输入用户名"
                    :prefix-icon="User"
                    class="custom-input"
                />
            </el-form-item>

            <el-form-item prop="password">
                <el-input
                    v-model="registerForm.password"
                    type="password"
                    placeholder="请输入密码"
                    :prefix-icon="Lock"
                    show-password
                    class="custom-input"
                />
            </el-form-item>

            <el-form-item prop="confirmPassword">
                <el-input
                    v-model="registerForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入密码"
                    :prefix-icon="Lock"
                    show-password
                    class="custom-input"
                />
            </el-form-item>

            <el-form-item>
                <el-button
                    type="primary"
                    class="w-full bg-orange-500! border-orange-500! hover:bg-orange-600! rounded-xl! h-12! font-bold text-lg shadow-lg shadow-orange-200 transition-all duration-200"
                    :loading="loading"
                    @click="submitRegisterForm"
                >
                    立即注册
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue'
    import { ElMessage } from 'element-plus'
    import { useRouter } from 'vue-router'
    import { register } from '@/api/auth'
    import { User, Lock } from '@element-plus/icons-vue'
    import type { FormInstance, FormRules } from 'element-plus'

    interface RegisterForm {
        username: string
        password: string
        confirmPassword: string
    }

    const router = useRouter()
    const formRef = ref<FormInstance>()
    const loading = ref(false)

    const registerForm = reactive<RegisterForm>({
        username: '',
        password: '',
        confirmPassword: '',
    })

    const rules: FormRules = {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码至少6位', trigger: 'blur' },
            { max: 16, message: '密码不能超过16位', trigger: 'blur' },
        ],
        confirmPassword: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            {
                validator: (_rule, value, callback) => {
                    if (value !== registerForm.password) {
                        callback(new Error('两次输入密码不一致'))
                    } else {
                        callback()
                    }
                },
                trigger: 'blur',
            },
        ],
    }

    const submitRegisterForm = async () => {
        if (!formRef.value) return

        await formRef.value.validate(async (valid: boolean) => {
            if (!valid) return

            loading.value = true
            try {
                await register({
                    username: registerForm.username,
                    password: registerForm.password,
                })

                ElMessage.success('注册成功，请登录')
                // 注册成功后导航到登录页面
                router.push({ name: 'Auth', params: { mode: 'login' } })
            } catch (error) {
                console.error(error)
            } finally {
                loading.value = false
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