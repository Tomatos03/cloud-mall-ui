<template>
    <div class="flex items-center justify-between mb-1 pb-6 border-b border-gray-50">
        <div class="flex items-center gap-4">
            <div class="relative cursor-pointer" @click="goToStore">
                <img
                    v-if="storeAvatarUrl"
                    class="w-14 h-14 rounded-full border-2 border-orange-50 shadow-sm object-cover"
                    :src="getImageURL(storeAvatarUrl)"
                    alt="店铺头像"
                />
                <div
                    v-else
                    class="w-14 h-14 rounded-full border-2 border-orange-50 shadow-sm bg-gray-50 flex items-center justify-center text-gray-400"
                >
                    <el-icon :size="28"><Shop /></el-icon>
                </div>
                <div class="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-0.5">
                    <el-icon :size="12"><Check /></el-icon>
                </div>
            </div>
            <div class="cursor-pointer" @click="goToStore">
                <h2 class="text-lg font-bold text-gray-800">
                    {{ storeName }}
                </h2>
                <div class="flex items-center gap-2">
                    <el-tag
                        size="small"
                        type="warning"
                        effect="plain"
                        class="border-orange-400! text-orange-700! bg-orange-50!"
                    >
                        官方旗舰店
                    </el-tag>
                    <span class="text-xs text-gray-500">综合体验 9.8</span>
                </div>
            </div>
        </div>
        <el-button
            type="primary"
            plain
            class="border-orange-600! text-orange-600! hover:bg-orange-50! rounded-xl! px-6"
            @click="goToStore"
        >
            进入店铺
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Check, Shop } from '@element-plus/icons-vue'
import { getImageURL } from '@/utils/image'

const props = defineProps<{
    storeId: number | string
    storeName: string
    storeAvatarUrl: string
}>()

const router = useRouter()

const goToStore = () => {
    if (props.storeId) {
        router.push({ name: 'Store', params: { storeId: props.storeId } })
    }
}
</script>
