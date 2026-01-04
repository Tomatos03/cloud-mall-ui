<template>
    <div
        class="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm"
    >
        <div class="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
            <el-icon :size="40" class="text-orange-200"><Box /></el-icon>
        </div>
        <h3 class="text-lg font-bold text-gray-800">未找到匹配商品</h3>
        <p class="text-gray-400 text-sm mt-2 mb-8">
            尝试调整关键词或分类以获得更多结果
        </p>
        <el-button
            round
            class="border-orange-500! text-orange-500! hover:bg-orange-50!"
            @click="emit('reset')"
        >
            重置搜索条件
        </el-button>
    </div>
</template>

<script setup lang="ts">
    import { Box } from '@element-plus/icons-vue'

    defineEmits<{
        reset: []
    }>()
</script>

<style scoped></style>