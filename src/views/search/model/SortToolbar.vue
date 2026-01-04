<template>
    <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 px-6 flex flex-wrap items-center justify-between gap-4"
    >
        <div class="flex items-center gap-6">
            <span class="text-gray-400 font-bold text-xs uppercase tracking-widest">排序</span>
            <div class="flex bg-gray-100 p-1 rounded-xl">
                <button
                    v-for="sort in sortOptions"
                    :key="sort.value"
                    :class="[
                        'px-6 py-1.5 rounded-lg text-sm font-bold transition-all',
                        modelValue === sort.value
                            ? 'bg-white text-orange-500 shadow-sm'
                            : 'text-gray-400 hover:text-gray-600',
                    ]"
                    @click="handleClick(sort.value)"
                >
                    {{ sort.label }}
                </button>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <div class="h-8 wpx bg-gray-100 mx-2 hidden sm:block"></div>
            <span class="text-sm text-gray-400">
                找到
                <span class="text-gray-900 font-black">{{ total }}</span> 件关于
                <span class="text-orange-500 font-bold">"{{ keyword || '全部' }}"</span>
                的商品
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
    type SortType = 'default' | 'new' | 'sales'

    interface Props {
        modelValue: SortType
        keyword: string
        total: number
    }

    defineProps<Props>()
    const emit = defineEmits(['update:modelValue'])

    interface SortOption {
        label: string
        value: SortType
    }

    const sortOptions: SortOption[] = [
        { label: '综合', value: 'default' },
        { label: '新品', value: 'new' },
        { label: '销量', value: 'sales' },
    ]

    const handleClick = (value: SortType) => {
        emit('update:modelValue', value)
    }
</script>

<style scoped></style>
