<template>
    <div class="p-8">
        <!-- 标题 -->
        <div class="flex items-center gap-3 mb-8">
            <div class="w-2 h-8 bg-orange-500 rounded-full"></div>
            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">我的收藏</h1>
        </div>

        <!-- 加载中状态 -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-32">
            <el-icon class="text-4xl text-orange-500 animate-spin">
                <Loading />
            </el-icon>
            <p class="mt-4 text-gray-400 font-medium">正在加载收藏列表...</p>
        </div>

        <!-- 收藏列表 -->
        <div v-else-if="favorites.length > 0">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div
                    v-for="item in favorites"
                    :key="item.id"
                    class="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-100 transition-all duration-300"
                >
                    <!-- 商品图片 -->
                    <div class="relative aspect-square overflow-hidden cursor-pointer" @click="goToProduct(item.id)">
                        <el-image
                            :src="item.img"
                            fit="cover"
                            class="w-full h-full group-hover:scale-110 transition-transform duration-500"
                        >
                            <template #placeholder>
                                <div class="w-full h-full bg-gray-50 flex items-center justify-center">
                                    <el-icon class="text-gray-200 text-3xl"><Picture /></el-icon>
                                </div>
                            </template>
                        </el-image>
                        <!-- 悬浮操作 -->
                        <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <el-button
                                type="danger"
                                circle
                                class="shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform"
                                @click.stop="onRemove(item.id)"
                            >
                                <el-icon><Delete /></el-icon>
                            </el-button>
                        </div>
                    </div>

                    <!-- 商品信息 -->
                    <div class="p-4">
                        <h3
                            class="text-gray-800 font-bold text-sm line-clamp-2 mb-2 hover:text-orange-500 cursor-pointer transition-colors h-10"
                            @click="goToProduct(item.id)"
                        >
                            {{ item.title }}
                        </h3>
                        <div class="flex items-center gap-2 mb-3">
                            <el-tag size="small" effect="plain" class="border-gray-100! text-gray-400! rounded-md!">
                                {{ item.storeName }}
                            </el-tag>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="text-lg font-black text-orange-600">
                                <span class="text-xs">¥</span>{{ item.price }}
                            </div>
                            <el-button
                                type="primary"
                                plain
                                size="small"
                                class="border-orange-500! text-orange-500! hover:bg-orange-500! hover:text-white! rounded-lg!"
                                @click="goToProduct(item.id)"
                            >
                                查看详情
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="flex flex-col items-center justify-center py-32">
            <div class="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                <el-icon class="text-5xl text-gray-200">
                    <Star />
                </el-icon>
            </div>
            <p class="text-gray-400 text-lg mb-6">您还没有收藏任何商品哦</p>
            <el-button
                type="primary"
                class="bg-orange-500! border-orange-500! hover:bg-orange-600! rounded-xl! px-8 font-bold"
                @click="$router.push('/')"
            >
                去逛逛
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { Star, Delete, Loading, Picture } from '@element-plus/icons-vue'
    import { fetchFavorites, removeFavorite, type FavoriteItem } from '@/api/favorite'

    const router = useRouter()
    const favorites = ref<FavoriteItem[]>([])
    const loading = ref(false)

    const load = async () => {
        try {
            loading.value = true
            const res = await fetchFavorites()
            favorites.value = res.data || []
        } catch (error) {
            console.error('加载收藏失败:', error)
            ElMessage.error('加载收藏失败')
        } finally {
            loading.value = false
        }
    }

    const onRemove = async (id: number) => {
        try {
            await ElMessageBox.confirm('确定要取消收藏该商品吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                roundButton: true
            })
            
            await removeFavorite(id)
            favorites.value = favorites.value.filter((i) => i.id !== id)
            ElMessage.success('已取消收藏')
        } catch (error) {
            if (error !== 'cancel') {
                console.error('取消收藏失败:', error)
                ElMessage.error('操作失败')
            }
        }
    }

    const goToProduct = (id: number) => {
        router.push({ name: 'Goods', query: { id } }).catch(() => {})
    }

    onMounted(load)
</script>

<style scoped>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
</style>