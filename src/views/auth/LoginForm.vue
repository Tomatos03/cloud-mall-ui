<template>
    <div class="flex flex-col items-center justify-center gap-2.5">
        <el-form
            :model="loginForm"
            label-width="auto"
            style="max-width: 600px"
            label-position="left"
        >
            <el-form-item label="用户名">
                <el-input v-model="loginForm.username" type="text" />
            </el-form-item>

            <el-form-item label="密码">
                <el-input v-model="loginForm.password" type="password" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitLoginForm" class="w-full">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
    import { login } from '@/api/auth'
    import { useUserStore } from '@/stores/user'
    import { ElMessage } from 'element-plus'
    import { reactive } from 'vue'
    import { useRouter } from 'vue-router'

    interface LoginForm {
        username: string
        password: string
        role: string
    }

    const userStore = useUserStore()
    const router = useRouter()

    const loginForm = reactive<LoginForm>({
        username: '',
        password: '',
        role: 'NORMAL',
    })

    const submitLoginForm = async () => {
        const res = await login(loginForm)
        const token = res.data?.token
        if (token) {
            userStore.setUser(res.data)
        }
        ElMessage.success('登录成功')
        router.push('/')
    }
</script>

<style scoped></style>
