<template>
    <div v-if="isEmpty" class="flex flex-col items-center justify-center py-32">
        <div class="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
            <el-icon class="text-5xl text-gray-200">
                <Location />
            </el-icon>
        </div>
        <p class="text-gray-400 text-lg mb-6">您还没有添加收货地址哦</p>
        <el-button
            type="primary"
            plain
            class="border-orange-500! text-orange-500! hover:bg-orange-50! rounded-xl!"
            @click="$emit('add')"
        >
            立即添加
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { Location } from '@element-plus/icons-vue'

defineProps<{
    isEmpty: boolean
}>()

defineEmits<{
    add: []
}>()
</script>
