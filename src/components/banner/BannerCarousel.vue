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
                    <el-image class="w-full h-full" :src="banner.imageUrl" fit="fill" />
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script setup lang="ts">
    import type { BannerItem } from '@/api/home'
    import { toRefs } from 'vue'
    import { useRouter } from 'vue-router'

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
    const router = useRouter()

    const handleBannerClick = (banner: BannerItem) => {
        if (banner.goodsId) {
            router.push({
                name: 'GoodsDetail',
                params: { id: banner.goodsId },
            }).catch(() => {})
        }
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
