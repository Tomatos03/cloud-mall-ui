<template>
    <div class="flex flex-col items-center justify-center py-32">
        <div
            class="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6"
        >
            <el-icon class="text-5xl text-gray-200">
                <Document />
            </el-icon>
        </div>
        <p class="text-gray-400 text-lg mb-6">暂无相关订单信息</p>
        <el-button
            type="primary"
            plain
            class="border-orange-500! text-orange-500! hover:bg-orange-50! rounded-full! px-8"
            @click="$router.push('/')"
        >
            去逛逛
        </el-button>
    </div>
</template>

<script setup lang="ts">
    import { Document } from '@element-plus/icons-vue'
</script>