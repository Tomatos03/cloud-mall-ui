<template>
    <div v-if="loading && addressCount === 0" class="flex flex-col items-center justify-center py-32">
        <el-icon class="text-4xl text-orange-500 animate-spin">
            <Loading />
        </el-icon>
        <p class="mt-4 text-gray-400 font-medium">正在为您加载地址列表...</p>
    </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

defineProps<{
    loading: boolean
    addressCount: number
}>()
</script>