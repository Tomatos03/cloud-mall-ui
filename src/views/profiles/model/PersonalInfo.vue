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
                        :src="getImageURL(formData.avatarUrl) || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                        class="border-4 border-orange-50 shadow-sm"
                    />
                    <div
                        class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        @click="triggerFileInput"
                    >
                        <el-icon class="text-white text-2xl"><Camera /></el-icon>
                    </div>
                    <!-- 上传进度 -->
                    <div
                        v-if="uploadProgress > 0 && uploadProgress < 100"
                        class="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full"
                    >
                        <span class="text-white text-sm font-bold">{{ uploadProgress }}%</span>
                    </div>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-gray-800 mb-1">我的头像</h3>
                    <p class="text-sm text-gray-400">支持 jpg、png 格式，大小不超过 2MB</p>
                    <el-button
                        type="primary"
                        plain
                        size="small"
                        class="mt-3 border-orange-500! text-orange-500! hover:bg-orange-50! rounded-lg!"
                        @click="triggerFileInput"
                        :loading="uploading"
                    >
                        {{ uploading ? '上传中...' : '修改头像' }}
                    </el-button>
                    <!-- 隐藏的文件上传 input -->
                    <input
                        ref="fileInputRef"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        class="hidden"
                        @change="handleFileChange"
                    />
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
                        <el-input v-model="formData.id" disabled class="custom-input" />
                    </el-form-item>

                    <el-form-item label="昵称" prop="nickname">
                        <el-input
                            v-model="formData.nickname"
                            placeholder="请输入您的昵称"
                            class="custom-input"
                            maxlength="20"
                            show-word-limit
                        />
                    </el-form-item>

                    <el-form-item label="手机号码" prop="phone">
                        <el-input
                            v-model="formData.phone"
                            placeholder="请输入手机号"
                            class="custom-input"
                            maxlength="11"
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
                        maxlength="200"
                        show-word-limit
                    />
                </el-form-item>

                <div class="mt-8 flex gap-4">
                    <el-button
                        type="primary"
                        :loading="loading"
                        class="bg-orange-500! border-orange-500! hover:bg-orange-600! rounded-xl! h-11 px-10 font-bold shadow-lg shadow-orange-100 transition-all"
                        @click="handleSave"
                    >
                        保存修改
                    </el-button>
                    <el-button
                        plain
                        class="rounded-xl! h-11 px-10"
                        @click="handleReset"
                        :disabled="loading"
                    >
                        重置
                    </el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, onMounted } from 'vue'
    import { useUserStore } from '@/stores/user'
    import { Camera } from '@element-plus/icons-vue'
    import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
    import { getUserInfo, updateUserInfo, uploadAvatar, type UpdateUserInfoPayload } from '@/api/user'
    import { getImageURL } from '@/utils/image'

    const userStore = useUserStore()
    const formRef = ref<FormInstance>()
    const fileInputRef = ref<HTMLInputElement>()
    const loading = ref(false)
    const uploading = ref(false)
    const uploadProgress = ref(0)

    const formData = reactive({
        id: '',
        nickname: '',
        phone: '',
        email: '',
        bio: '',
        avatarUrl: '',
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
        bio: [
            { max: 200, message: '个人简介不能超过 200 个字符', trigger: 'blur' },
        ],
    }

    // 加载用户信息
    const loadUserInfo = async () => {
        try {
            // HTTP 工具类已判断成功/失败，能执行到这里说明请求成功
            const res = await getUserInfo()
            Object.assign(formData, {
                id: res.data.id || userStore.id,
                nickname: res.data.nickname || userStore.nickname,
                phone: res.data.phone ?? '',        // 使用 ?? 处理 null
                email: res.data.email ?? '',        // 使用 ?? 处理 null
                bio: res.data.bio ?? '',            // 使用 ?? 处理 null
                avatarUrl: res.data.avatarUrl ?? userStore.avatarUrl ?? '',
            })
        } catch (error) {
            // HTTP 工具类已处理错误提示，这里仅使用 store 中的数据作为降级方案
            Object.assign(formData, {
                id: userStore.id,
                nickname: userStore.nickname,
                avatarUrl: userStore.avatarUrl ?? '',
            })
        }
    }

    // 触发文件选择
    const triggerFileInput = () => {
        if (uploading.value) return
        fileInputRef.value?.click()
    }

    // 验证文件
    const validateFile = (file: File): boolean => {
        // 验证文件类型
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
        if (!allowedTypes.includes(file.type)) {
            ElMessage.error('只支持 JPG、PNG 格式的图片')
            return false
        }

        // 验证文件大小 (2MB)
        const maxSize = 2 * 1024 * 1024
        if (file.size > maxSize) {
            ElMessage.error('图片大小不能超过 2MB')
            return false
        }

        return true
    }

    // 处理文件选择
    const handleFileChange = async (event: Event) => {
        const target = event.target as HTMLInputElement
        const file = target.files?.[0]

        if (!file) return

        // 验证文件
        if (!validateFile(file)) {
            target.value = '' // 清空文件选择
            return
        }

        try {
            uploading.value = true
            uploadProgress.value = 0

            // 模拟上传进度
            const progressInterval = setInterval(() => {
                if (uploadProgress.value < 90) {
                    uploadProgress.value += 10
                }
            }, 100)

            // 调用上传接口（HTTP 工具类已判断成功/失败）
            const res = await uploadAvatar(file)

            clearInterval(progressInterval)
            uploadProgress.value = 100

            // 能执行到这里说明上传成功
            formData.avatarUrl = res.data.url

            // 同时更新用户信息中的头像
            await updateUserInfo({ avatarUrl: res.data.url })

            // 更新 store
            userStore.setUser({ avatar: res.data.url })

            ElMessage.success('头像上传成功')
        } finally {
            uploading.value = false
            setTimeout(() => {
                uploadProgress.value = 0
            }, 500)
            target.value = '' // 清空文件选择，允许重复上传同一文件
        }
    }

    // 保存修改
    const handleSave = async () => {
        if (!formRef.value) return

        await formRef.value.validate(async (valid) => {
            if (valid) {
                try {
                    loading.value = true

                    // 构建请求参数，空字符串不发送
                    const payload: UpdateUserInfoPayload = {
                        nickname: formData.nickname,
                        phone: formData.phone.trim() || undefined,
                        email: formData.email.trim() || undefined,
                        bio: formData.bio.trim() || undefined,
                    }

                    // HTTP 工具类已判断成功/失败，能执行到这里说明请求成功
                    await updateUserInfo(payload)

                    // 更新 store 中的用户信息
                    userStore.setUser({
                        nickname: formData.nickname,
                        avatar: formData.avatarUrl,
                    })

                    ElMessage.success('个人信息更新成功')
                } catch (error) {
                    // HTTP 工具类已处理错误提示
                } finally {
                    loading.value = false
                }
            }
        })
    }

    // 重置表单
    const handleReset = () => {
        loadUserInfo()
        formRef.value?.clearValidate()
    }

    // 组件挂载时加载用户信息
    onMounted(() => {
        loadUserInfo()
    })
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
        transition: all 0.3s ease;
    }

    :deep(.custom-input .el-input__wrapper.is-focus) {
        box-shadow: 0 0 0 1px #f97316 inset !important;
        background-color: #fff;
    }

    :deep(.custom-input .el-input__wrapper:hover) {
        background-color: #fff;
    }

    :deep(.custom-input .el-textarea__inner) {
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 0 0 1px #f3f4f6 inset;
        background-color: #f9fafb;
        transition: all 0.3s ease;
    }

    :deep(.custom-input .el-textarea__inner:focus) {
        box-shadow: 0 0 0 1px #f97316 inset !important;
        background-color: #fff;
    }

    :deep(.custom-input .el-textarea__inner:hover) {
        background-color: #fff;
    }

    :deep(.el-input.is-disabled .el-input__wrapper) {
        background-color: #f3f4f6;
    }

    .hidden {
        display: none;
    }
</style>
