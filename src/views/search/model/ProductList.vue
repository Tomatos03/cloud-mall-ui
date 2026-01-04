<template>
    <div class="min-h-[500px]">
        <!-- 加载中状态 -->
        <SearchLoading v-if="loading" />

        <!-- 空状态 -->
        <SearchEmpty v-else-if="products.length === 0" @reset="emit('reset')" />

        <!-- 商品列表 -->
        <div v-else>
            <div class="products-grid">
                <ProductCard
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                    @click="(productId) => emit('product-click', productId)"
                />
            </div>

            <!-- 分页 -->
            <div v-if="total > pageSize" class="flex justify-center mt-16 pb-10">
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :page-sizes="[12, 24, 48]"
                    :total="total"
                    layout="total, prev, pager, next"
                    class="custom-pagination"
                    @size-change="emit('size-change', $event)"
                    @current-change="emit('page-change', $event)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue'
    import ProductCard from './ProductCard.vue'
    import SearchEmpty from './SearchEmpty.vue'
    import SearchLoading from './SearchLoading.vue'
    import type { GoodsItem } from '@/api/goods'

    interface Props {
        products: GoodsItem[]
        loading: boolean
        currentPage: number
        pageSize: number
        total: number
    }

    interface Emits {
        'product-click': [productId: string]
        'reset': []
        'size-change': [size: number]
        'page-change': [page: number]
        'update:currentPage': [page: number]
        'update:pageSize': [size: number]
    }

    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    const currentPage = ref(props.currentPage)
    const pageSize = ref(props.pageSize)

    watch(
        () => props.currentPage,
        (newVal) => {
            currentPage.value = newVal
        },
    )

    watch(
        () => props.pageSize,
        (newVal) => {
            pageSize.value = newVal
        },
    )
</script>

<style scoped>
    /* 商品网格布局 - 响应式 */
    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 24px;
    }

    /* 分页样式定制 */
    :deep(.custom-pagination) {
        --el-color-primary: #f97316;
    }
    :deep(.custom-pagination .el-pager li:hover) {
        color: #f97316;
    }
    :deep(.custom-pagination .el-pager li.is-active) {
        background-color: #f97316 !important;
        color: #fff !important;
        border-radius: 8px;
    }
</style>