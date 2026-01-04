<template>
    <div class="p-8">
        <!-- 评论列表 -->
        <div v-if="comments.length > 0" class="space-y-8">
            <div
                v-for="comment in comments"
                :key="comment.id"
                class="flex gap-6 pb-8 border-b border-gray-100 last:border-0"
                :class="{ 'bg-orange-50/40 -mx-8 px-8 py-8 rounded-2xl': isOwnComment(comment) }"
            >
                <!-- 用户头像 -->
                <div
                    class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 shadow-sm"
                >
                    <img
                        v-if="comment.userAvatar"
                        :src="getImageURL(comment.userAvatar)"
                        :alt="comment.userNickname"
                        class="w-full h-full object-cover"
                    />
                    <div
                        v-else
                        class="w-full h-full flex items-center justify-center text-gray-400"
                    >
                        <el-icon :size="24"><User /></el-icon>
                    </div>
                </div>

                <!-- 评论内容区 -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-gray-900">{{ comment.userNickname }}</span>
                            <el-tag
                                v-if="isOwnComment(comment)"
                                type="warning"
                                size="small"
                                class="ml-1"
                            >
                                我的评论
                            </el-tag>
                        </div>
                        <span class="text-xs text-gray-400">{{ comment.createTime }}</span>
                    </div>

                    <!-- 评分 -->
                    <el-rate v-model="comment.rating" disabled size="small" class="mb-3" />

                    <!-- 文字内容 -->
                    <p class="text-gray-700 leading-relaxed mb-4">
                        {{ comment.content }}
                    </p>

                    <!-- 评论图片列表 -->
                    <div class="mt-2">
                        <div
                            v-if="comment.images && comment.images.length > 0"
                            class="flex flex-wrap gap-2"
                        >
                            <el-image
                                v-for="(img, index) in comment.images"
                                :key="index"
                                :src="getImageURL(img)"
                                :preview-src-list="comment.images.map((i) => getImageURL(i))"
                                :initial-index="index"
                                fit="cover"
                                class="w-20 h-20 rounded-lg border border-gray-100 cursor-zoom-in hover:opacity-90 transition-opacity"
                                preview-teleported
                            />
                        </div>
                        <div v-else class="flex items-center gap-1 text-gray-400 text-xs">
                            <el-icon><Picture /></el-icon>
                            <span>暂无图片</span>
                        </div>
                    </div>

                    <!-- 商家回复 -->
                    <div
                        v-if="comment.reply"
                        class="mt-5 p-4 bg-gray-50 rounded-2xl border border-gray-100 relative"
                    >
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-1 h-3 bg-orange-500 rounded-full"></div>
                            <span class="text-xs font-bold text-gray-900">商家回复</span>
                        </div>
                        <p class="text-sm text-gray-600 leading-relaxed pl-3">
                            {{ comment.reply }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- 加载更多按钮 -->
            <div v-if="comments.length < total" class="flex justify-center pt-8">
                <el-button
                    :loading="loading"
                    class="rounded-xl! px-10 h-11 border-gray-200! text-gray-500! hover:text-orange-600! hover:border-orange-300! hover:bg-orange-50! transition-all duration-300"
                    @click="loadComments(pageNum + 1)"
                >
                    加载更多评价
                </el-button>
            </div>
        </div>

        <!-- 空状态或加载中 -->
        <div v-else class="flex flex-col items-center justify-center py-24">
            <template v-if="loading && pageNum === 1">
                <el-icon class="text-5xl text-orange-500 animate-spin mb-4"><Loading /></el-icon>
                <p class="text-gray-500 font-medium">正在为您加载评价...</p>
            </template>
            <template v-else>
                <div class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <el-icon class="text-4xl text-gray-300"><ChatDotRound /></el-icon>
                </div>
                <p class="text-gray-500 font-medium">暂无评价</p>
                <p class="text-gray-400 text-sm mt-1">该商品还没有人评价，快来抢首评吧</p>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, watch } from 'vue'
    import { User, ChatDotRound, Loading, Picture } from '@element-plus/icons-vue'
    import { getCommentsByGoodsId, type GoodsCommentVO } from '@/api/comment'
    import { getImageURL } from '@/utils/image'
    import { useUserStore } from '@/stores/user'

    /**
     * Props 定义
     */
    const props = defineProps<{
        goodsId: string | number
    }>()

    /**
     * Emits 定义
     */
    const emit = defineEmits<{
        'update:total': [value: number]
    }>()

    // 响应式状态
    const userStore = useUserStore()
    const comments = ref<GoodsCommentVO[]>([])
    const pageNum = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const loading = ref(false)
    const isLoaded = ref(false) // 标记是否已经加载过数据

    /**
     * 判断是否是自己的评论
     * @param comment 评论对象
     * @returns 是否是自己的评论
     */
    const isOwnComment = (comment: GoodsCommentVO) => {
        return comment.userId === parseInt(userStore.id)
    }

    /**
     * 加载评论数据
     * @param page 页码
     */
    const loadComments = async (page = 1) => {
        if (!props.goodsId || loading.value) return

        try {
            loading.value = true
            const res = await getCommentsByGoodsId(props.goodsId, page, pageSize.value)

            if (res && res.data) {
                const { records, total: totalCount } = res.data

                if (page === 1) {
                    comments.value = records
                } else {
                    comments.value.push(...records)
                }

                total.value = totalCount
                pageNum.value = page
                isLoaded.value = true

                // 同步总数给父组件
                emit('update:total', totalCount)
            }
        } catch (error) {
            console.error('Failed to load comments:', error)
        } finally {
            loading.value = false
        }
    }

    /**
     * 组件挂载时直接加载评论
     */
    onMounted(() => {
        if (!isLoaded.value) {
            loadComments(1)
        }
    })

    /**
     * 监听商品ID变化，重置状态并重新加载
     */
    watch(
        () => props.goodsId,
        () => {
            isLoaded.value = false
            comments.value = []
            pageNum.value = 1
            loadComments(1)
        },
    )

    // 暴露刷新方法给父组件
    defineExpose({
        refresh: () => loadComments(1),
    })
</script>

<style scoped>
    :deep(.el-rate) {
        --el-rate-fill-color: #ff9900;
        height: auto;
    }

    /* 优化图片预览样式 */
    :deep(.el-image-viewer__wrapper) {
        z-index: 3000 !important;
    }
</style>
