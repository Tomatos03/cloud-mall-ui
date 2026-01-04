<template>
    <el-dialog
        :model-value="visible"
        title="商品评价"
        width="700px"
        :close-on-click-modal="false"
        @close="resetForm"
        @update:model-value="(val: boolean) => $emit('update:visible', val)"
    >
        <!-- 商品信息展示 -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg flex gap-4">
            <div class="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                <img
                    :src="getImageURL(goods.goodsImg)"
                    :alt="goods.goodsName"
                    class="w-full h-full object-cover"
                />
            </div>
            <div class="flex-1 min-w-0">
                <h4 class="text-gray-900 font-bold truncate mb-2">{{ goods.goodsName }}</h4>
                <p class="text-sm text-gray-500 mb-2">
                    <span>数量：{{ goods.quantity }}</span>
                    <span class="ml-4">单价：¥{{ goods.goodsPrice }}</span>
                </p>
                <p class="text-lg text-orange-600 font-bold">
                    ¥{{ goods.totalPrice }}
                </p>
            </div>
        </div>

        <!-- 评价表单 -->
        <el-form :model="form" label-width="100px" @keyup.enter="handleSubmit">
            <!-- 上传图片 -->
            <el-form-item label="上传图片" prop="images">
                <div class="w-full">
                    <div class="flex flex-wrap gap-3">
                        <!-- 已上传图片预览 -->
                        <div
                            v-for="(image, index) in form.imageList"
                            :key="index"
                            class="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group"
                        >
                            <img
                                :src="getImageURL(image)"
                                :alt="`评价图片${index + 1}`"
                                class="w-full h-full object-cover"
                            />
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <el-icon class="text-white text-2xl cursor-pointer" @click="removeImage(index)">
                                    <Delete />
                                </el-icon>
                            </div>
                        </div>

                        <!-- 上传按钮 -->
                        <el-upload
                            v-if="form.imageList.length < maxImages"
                            ref="uploadRef"
                            action="#"
                            :auto-upload="false"
                            :show-file-list="false"
                            accept="image/*"
                            @change="handleImageChange"
                        >
                            <div class="w-24 h-24 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors cursor-pointer bg-gray-50 group">
                                <el-icon v-if="uploading" class="text-2xl text-orange-500 animate-spin"><LoadingIcon /></el-icon>
                                <template v-else>
                                    <el-icon class="text-2xl text-gray-400 group-hover:text-orange-500"><Plus /></el-icon>
                                    <span class="text-[10px] text-gray-400 mt-1">{{ form.imageList.length }}/{{ maxImages }}</span>
                                </template>
                            </div>
                        </el-upload>
                    </div>
                    <div class="el-upload__tip text-xs text-gray-500 mt-2">
                        最多上传 {{ maxImages }} 张图片，单张图片大小不超过 5MB
                    </div>
                </div>
            </el-form-item>

            <!-- 评分 -->
            <el-form-item label="评分" prop="rating" required>
                <el-rate
                    v-model="form.rating"
                    show-score
                    text-color="#ff9900"
                    class="text-lg"
                />
            </el-form-item>

            <!-- 评价内容 -->
            <el-form-item label="评价内容" prop="content" required>
                <el-input
                    v-model="form.content"
                    type="textarea"
                    :rows="5"
                    placeholder="请详细描述您的购物体验，包括商品质量、物流服务等"
                    maxlength="500"
                    show-word-limit
                    clearable
                    class="text-base!"
                />
            </el-form-item>


            <!-- 匿名选项 -->
            <el-form-item label="匿名评价" prop="isAnonymous">
                <el-switch
                    v-model="form.isAnonymous"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#ff9900"
                    inactive-color="#ccc"
                />
                <span class="ml-3 text-sm text-gray-500">匿名发布此评价</span>
            </el-form-item>

            <!-- 表单提示 -->
            <div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700">
                <el-icon class="mr-2"><InfoFilled /></el-icon>
                <span>您的评价将帮助其他用户更好地了解该商品，感谢您的反馈！</span>
            </div>
        </el-form>

        <!-- 操作按钮 -->
        <template #footer>
            <el-button @click="handleCancel">取消</el-button>
            <el-button
                type="primary"
                :loading="loading"
                class="bg-orange-500! border-orange-500! hover:bg-orange-600!"
                @click="handleSubmit"
            >
                提交评价
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled, Plus, Delete, Loading as LoadingIcon } from '@element-plus/icons-vue'
import { addComment, type CreateCommentDTO } from '@/api/comment'
import { uploadImage } from '@/api/common'
import { getImageURL } from '@/utils/image'
import { useUserStore } from '@/stores/user'

/**
 * 商品信息接口
 */
interface GoodsItem {
    id: number // orderItemId
    goodsId: number
    goodsName: string
    goodsImg: string
    goodsPrice: number
    quantity: number
    totalPrice: number
}

/**
 * Props 定义
 */
const props = defineProps<{
    visible: boolean
    orderNo: string
    goods: GoodsItem
}>()

/**
 * Emits 定义
 */
const emit = defineEmits<{
    'update:visible': [value: boolean]
    success: []
}>()

/**
 * 响应式状态
 */
 const loading = ref(false)
 const uploadRef = ref()
 const maxImages = 5
 const userStore = useUserStore()

const form = reactive({
    rating: 5,
    content: '',
    imageList: [] as string[], // 存储后端返回的相对路径
    isAnonymous: 0,
})

const uploading = ref(false)

/**
 * 监听 visible 状态
 */
watch(
    () => props.visible,
    (newVal) => {
        if (!newVal) {
            resetForm()
        }
    }
)

/**
 * 重置表单
 */
const resetForm = () => {
    form.rating = 5
    form.content = ''
    form.imageList = []
    form.isAnonymous = 0
    uploadRef.value?.clearFiles()
}

/**
 * 处理取消
 */
const handleCancel = () => {
    emit('update:visible', false)
}

/**
 * 处理图片选择并上传到后端
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleImageChange = async (file: any) => {
    if (!file.raw) return

    const fileSize = file.raw.size
    const maxSize = 5 * 1024 * 1024 // 5MB

    // 验证文件大小
    if (fileSize > maxSize) {
        ElMessage.error('图片大小不能超过 5MB')
        uploadRef.value?.clearFiles()
        return
    }

    // 验证数量限制
    if (form.imageList.length >= maxImages) {
        ElMessage.warning(`最多只能上传 ${maxImages} 张图片`)
        uploadRef.value?.clearFiles()
        return
    }

    try {
        uploading.value = true
        const res = await uploadImage(file.raw)
        if (res && res.data && res.data.url) {
            // 存储后端返回的相对路径
            form.imageList.push(res.data.url)
            ElMessage.success('图片上传成功')
        }
    } catch (error) {
        console.error('图片上传失败:', error)
    } finally {
        uploading.value = false
        // 清除 upload 组件内部的文件列表
        uploadRef.value?.clearFiles()
    }
}

/**
 * 移除图片
 */
const removeImage = (index: number) => {
    form.imageList.splice(index, 1)
}

/**
 * 验证表单
 */
const validateForm = (): boolean => {
    if (!form.content.trim()) {
        ElMessage.warning('请输入评价内容')
        return false
    }
    if (form.rating < 1 || form.rating > 5) {
        ElMessage.warning('请选择评分')
        return false
    }
    return true
}

/**
 * 提交评价
 */
 const handleSubmit = async () => {
     if (!validateForm()) {
         return
     }

    loading.value = true
    try {
        const submitData: CreateCommentDTO = {
            userId: userStore.uid,
            orderItemId: props.goods.id,
            orderNo: props.orderNo,
            goodsId: props.goods.goodsId,
            rating: form.rating,
            content: form.content.trim(),
            images: form.imageList.length > 0 ? form.imageList.join(',') : undefined,
            isAnonymous: form.isAnonymous,
            userName: userStore.nickname,
            userAvatar: userStore.avatarUrl || '',
        }

        await addComment(submitData)
        ElMessage.success('评价成功')
        emit('update:visible', false)
        emit('success')
    } catch {
        // 错误已由 http 工具类处理
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* 评分样式优化 */
:deep(.el-rate) {
    gap: 8px;
}

:deep(.el-rate__icon) {
    font-size: 28px;
}

:deep(.el-rate__text) {
    margin-left: 12px;
    font-size: 16px;
    font-weight: bold;
    color: #ff9900;
}

/* 输入框样式 */
:deep(.el-input__wrapper) {
    border-radius: 8px;
}

:deep(.el-textarea__inner) {
    border-radius: 8px;
    padding: 12px;
}

/* 上传组件样式 */
:deep(.el-upload) {
    display: inline-block;
}

/* 开关样式 */
:deep(.el-switch) {
    --el-switch-on-color: #ff9900;
}
</style>
