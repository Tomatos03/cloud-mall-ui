<template>
    <div class="flex flex-col items-center justify-between gap-2.5">
        <el-form
            :model="registerForm"
            :rules="rules"
            ref="formRef"
            label-width="auto"
            style="max-width: 600px"
            label-position="left"
        >
            <el-form-item label="用户名" prop="username">
                <el-input v-model="registerForm.username" type="text" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input v-model="registerForm.password" type="password" show-password />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="registerForm.confirmPassword" type="password" show-password />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" class="w-full" @click="submitRegisterForm">
                    注册
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
    import type { FormRules } from 'element-plus'

    interface RegisterForm {
        username: string
        password: string
        confirmPassword: string
    }

    const router = useRouter()
    const formRef = ref()

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

        formRef.value.validate(async (valid: boolean) => {
            if (!valid) return

            try {
                await register({
                    username: registerForm.username,
                    password: registerForm.password,
                })

                ElMessage.success('注册成功，请登录')
                // 注册成功后导航到登录页面（并在 url 中表明 mode）
                router.push({ name: 'Auth', params: { mode: 'login' } })
            } catch {
                ElMessage.error('注册失败')
            }
        })
    }
</script>
