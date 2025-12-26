<template>
    <div class="w-full h-full flex flex-col">
        <el-carousel
            :height="height || '100%'"
            :interval="interval"
            :arrow="arrow"
            :motion-blur="motionBlur"
        >
            <el-carousel-item v-for="(banner, idx) in banners" :key="idx">
                <div
                    class="w-full h-full cursor-pointer"
                    @click="handleBannerClick(banner)"
                >
                    <el-image class="w-full h-full" :src="getImageURL(banner.imageUrl)" fit="cover" />
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script setup lang="ts">
    import type { BannerItem } from '@/api/home'
    import { toRefs } from 'vue'
    import { getImageURL } from '@/utils/image'

    interface Props {
        banners: BannerItem[]
        interval: number
        // 支持 Element Plus 的 arrow 字符串值，也允许布尔值兼容历史用法
        arrow?: 'always' | 'hover' | 'never' | boolean
        motionBlur: boolean
        height?: string
    }

    const props = withDefaults(defineProps<Props>(), {
        banners: () => [],
    })

    const { height, banners, interval, arrow, motionBlur } = toRefs(props)
    const emit = defineEmits(['banner-click'])

    const handleBannerClick = (banner: BannerItem) => {
        emit('banner-click', banner)
    }
</script>

<style scoped>
    :deep(.el-carousel) {
        flex: 1;
        width: 100%;
        height: 100%;
    }

    :deep(.el-carousel__container) {
        height: 100%;
    }
</style>
