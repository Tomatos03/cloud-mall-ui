<template>
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
        <div class="flex items-start gap-6">
            <span class="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2 shrink-0">
                分类
            </span>
            <div class="flex gap-2.5 flex-wrap">
                <button
                    v-for="category in categoryList"
                    :key="category.id"
                    :class="[
                        'px-5 py-1.5 rounded-xl text-sm font-bold transition-all border',
                        isActive(category.id)
                            ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-100'
                            : 'bg-gray-50 border-transparent text-gray-500 hover:bg-orange-50 hover:text-orange-500',
                    ]"
                    @click="emit('category-change', category.id)"
                >
                    {{ category.name }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import type { Category } from '@/api/category'

    interface Props {
        categories: Category[]
        modelValue: string
    }

    const props = defineProps<Props>()
    const emit = defineEmits<{
        'category-change': [categoryId: string]
        'update:modelValue': [categoryId: string]
    }>()

    const categoryList = computed(() => [
        { id: 'all', name: '全部商品' },
        ...props.categories,
    ])

    const isActive = (categoryId: string) => {
        return props.modelValue === categoryId
    }
</script>

<style scoped></style>