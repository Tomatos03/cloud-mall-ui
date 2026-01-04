<template>
    <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
            <div class="w-2 h-8 bg-orange-500 rounded-full"></div>
            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">
                我的收货地址
            </h1>
        </div>
        <el-button
            type="primary"
            class="bg-orange-500! border-orange-500! hover:bg-orange-600! rounded-xl! h-11! px-6 font-bold shadow-lg shadow-orange-100 transition-all"
            @click="$emit('add')"
            :loading="loading"
        >
            <el-icon class="mr-2 text-lg">
                <Plus />
            </el-icon>
            添加新地址
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

defineProps<{
    loading: boolean
}>()

defineEmits<{
    add: []
}>()
</script>