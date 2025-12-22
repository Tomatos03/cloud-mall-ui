<template>
    <div class="p-6">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h2 class="text-2xl font-bold">我的收藏</h2>
                <p class="text-gray-500">在这里可以看到你加入收藏的商品</p>
            </div>
        </div>

        <div v-if="favorites.length === 0" class="py-12">
            <el-empty description="暂无收藏，去逛逛吧~" />
        </div>

        <el-row :gutter="20" v-else>
            <el-col :span="6" v-for="item in favorites" :key="item.id">
                <el-card class="rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                    <div class="cursor-pointer" @click="goToProduct(item.id)">
                        <el-image :src="item.img" fit="cover" style="width: 100%; height: 180px" />
                        <div class="mt-3">
                            <div class="text-lg font-semibold text-gray-800">{{ item.title }}</div>
                            <div class="text-sm text-gray-500 mt-1">{{ item.storeName }}</div>
                            <div class="text-red-500 font-bold mt-2">{{ item.price }}</div>
                        </div>
                    </div>

                    <div class="mt-3 flex items-center justify-between">
                        <el-button type="primary" size="small" @click="goToProduct(item.id)"
                            >查看商品</el-button
                        >
                        <el-button type="danger" size="small" @click="onRemove(item.id)"
                            >取消收藏</el-button
                        >
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElMessage } from 'element-plus'
    import { fetchFavorites, removeFavorite, type FavoriteItem } from '@/api/favorite'

    const router = useRouter()
    const favorites = ref<FavoriteItem[]>([])

    const load = async () => {
        const res = await fetchFavorites()
        favorites.value = res.data || []
    }

    const onRemove = async (id: number) => {
        await removeFavorite(id)
        favorites.value = favorites.value.filter((i) => i.id !== id)
        ElMessage({ type: 'success', message: '已取消收藏' })
    }

    const goToProduct = (id: number) => {
        // 跳转到商品页（使用 Goods 路由并传 id）
        router.push({ name: 'Goods', query: { id } }).catch(() => {})
    }

    onMounted(load)
</script>

<style scoped>
    /* 简单修饰，结合 Tailwind 和 Element Plus */
    .el-card {
        min-height: 280px;
    }
</style>
