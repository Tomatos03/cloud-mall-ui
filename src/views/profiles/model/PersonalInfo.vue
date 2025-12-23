<template>
    <div class="p-8">
        <!-- 标题 -->
        <div class="flex items-center gap-3 mb-8">
            <div class="w-2 h-8 bg-orange-500 rounded-full"></div>
            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">个人信息</h1>
        </div>

        <div class="max-w-2xl">
            <!-- 头像设置 -->
            <div class="flex items-center gap-8 mb-10">
                <div class="relative group">
                    <el-avatar
                        :size="100"
                        :src="userStore.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                        class="border-4 border-orange-50 shadow-sm"
                    />
                    <div
                        class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        <el-icon class="text-white text-2xl"><Camera /></el-icon>
                    </div>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-gray-800 mb-1">我的头像</h3>
                    <p class="text-sm text-gray-400">支持 jpg、png 格式，大小不超过 2MB</p>
                    <el-button type="primary" plain size="small" class="mt-3 border-orange-500! text-orange-500! hover:bg-orange-50! rounded-lg!">
                        修改头像
                    </el-button>
                </div>
            </div>

            <!-- 信息表单 -->
            <el-form
                ref="formRef"
                :model="formData"
                :rules="rules"
                label-position="top"
                class="personal-form"
            >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <el-form-item label="用户 ID" class="opacity-70">
                        <el-input v-model="userStore.id" disabled class="custom-input" />
                    </el-form-item>
                    
                    <el-form-item label="昵称" prop="nickname">
                        <el-input
                            v-model="formData.nickname"
                            placeholder="请输入您的昵称"
                            class="custom-input"
                        />
                    </el-form-item>

                    <el-form-item label="手机号码" prop="phone">
                        <el-input
                            v-model="formData.phone"
                            placeholder="请输入手机号"
                            class="custom-input"
                        />
                    </el-form-item>

                    <el-form-item label="电子邮箱" prop="email">
                        <el-input
                            v-model="formData.email"
                            placeholder="请输入邮箱"
                            class="custom-input"
                        />
                    </el-form-item>
                </div>

                <el-form-item label="个人简介" prop="bio">
                    <el-input
                        v-model="formData.bio"
                        type="textarea"
                        :rows="4"
                        placeholder="介绍一下你自己吧..."
                        class="custom-input"
                    />
                </el-form-item>

                <div class="mt-8">
                    <el-button
                        type="primary"
                        :loading="loading"
                        class="bg-orange-500! border-orange-500! hover:bg-orange-600! rounded-xl! h-11 px-10 font-bold shadow-lg shadow-orange-100 transition-all"
                        @click="handleSave"
                    >
                        保存修改
                    </el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive } from 'vue'
    import { useUserStore } from '@/stores/user'
    import { Camera } from '@element-plus/icons-vue'
    import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

    const userStore = useUserStore()
    const formRef = ref<FormInstance>()
    const loading = ref(false)

    const formData = reactive({
        nickname: userStore.nickname || '',
        phone: '',
        email: '',
        bio: '',
    })

    const rules: FormRules = {
        nickname: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
        ],
        phone: [
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
        ],
        email: [
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
        ],
    }

    const handleSave = async () => {
        if (!formRef.value) return
        
        await formRef.value.validate(async (valid) => {
            if (valid) {
                try {
                    loading.value = true
                    // 模拟 API 调用
                    await new Promise(resolve => setTimeout(resolve, 800))
                    
                    userStore.setUser({
                        nickname: formData.nickname
                    })
                    
                    ElMessage.success('个人信息更新成功')
                } catch (error) {
                    ElMessage.error('保存失败，请稍后重试')
                } finally {
                    loading.value = false
                }
            }
        })
    }
</script>

<style scoped>
    .personal-form :deep(.el-form-item__label) {
        font-weight: 600;
        color: #4b5563;
        padding-bottom: 8px;
    }

    :deep(.custom-input .el-input__wrapper) {
        border-radius: 12px;
        padding: 4px 12px;
        box-shadow: 0 0 0 1px #f3f4f6 inset;
        background-color: #f9fafb;
    }

    :deep(.custom-input .el-input__wrapper.is-focus) {
        box-shadow: 0 0 0 1px #f97316 inset !important;
        background-color: #fff;
    }

    :deep(.custom-input .el-textarea__inner) {
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 0 0 1px #f3f4f6 inset;
        background-color: #f9fafb;
    }

    :deep(.custom-input .el-textarea__inner:focus) {
        box-shadow: 0 0 0 1px #f97316 inset !important;
        background-color: #fff;
    }

    :deep(.el-input.is-disabled .el-input__wrapper) {
        background-color: #f3f4f6;
    }
</style>