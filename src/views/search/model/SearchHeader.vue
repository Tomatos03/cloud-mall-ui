<template>
    <div class="flex flex-col gap-4 mb-8">
        <!-- 分类选择 -->
        <SearchFilter
            v-model="localActiveCategory"
            :categories="categories"
            @category-change="handleCategoryChange"
        />

        <!-- 排序工具栏 -->
        <SortToolbar
            v-model="localSortType"
            :keyword="keyword"
            :total="total"
        />
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from 'vue'
    import SearchFilter from './SearchFilter.vue'
    import SortToolbar from './SortToolbar.vue'
    import type { Category } from '@/api/category'

    interface Props {
        categories: Category[]
        activeCategory: string
        sortType: 'default' | 'new' | 'sales'
        keyword: string
        total: number
    }

    interface Emits {
        'update:activeCategory': [value: string]
        'update:sortType': [value: 'default' | 'new' | 'sales']
        'category-change': [categoryId: string]
        'sort-change': [sortType: 'default' | 'new' | 'sales']
    }

    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    const localActiveCategory = ref(props.activeCategory)
    const localSortType = ref(props.sortType)

    const handleCategoryChange = (categoryId: string) => {
        localActiveCategory.value = categoryId
        emit('update:activeCategory', categoryId)
        emit('category-change', categoryId)
    }

    watch(
        () => props.activeCategory,
        (newVal) => {
            localActiveCategory.value = newVal
        },
    )

    watch(
        () => localSortType.value,
        (newVal) => {
            emit('update:sortType', newVal)
            emit('sort-change', newVal)
        },
    )

    watch(
        () => props.sortType,
        (newVal) => {
            localSortType.value = newVal
        },
    )
</script>

<style scoped></style>