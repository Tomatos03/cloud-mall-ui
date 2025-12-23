<template>
    <div class="relative h-full w-full overflow-visible">
        <!-- 左侧分类列表 -->
        <ul
            class="h-full w-full bg-gray-900/80 backdrop-blur-md text-white flex flex-col py-4 rounded-2xl shadow-lg shadow-gray-200"
            v-if="gruopedCategories.has(1)"
        >
            <template v-for="[_, categories] in gruopedCategories.get(1)!.entries()">
                <li
                    class="px-8 py-3 hover:bg-orange-500 cursor-pointer flex-1 flex justify-between items-center gap-5 transition-all group"
                    v-for="category in categories"
                    :key="category.id"
                    @mouseenter="handleMouseEnter(category)"
                    @mouseleave="handleMouseLeave"
                    @click="handleSelect(category)"
                >
                    <span class="text-base font-medium group-hover:font-bold">
                        {{ category.name }}
                    </span>
                    <el-icon
                        class="text-white/70 group-hover:text-white transition-transform group-hover:translate-x-1"
                    >
                        <ArrowRightBold />
                    </el-icon>
                </li>
            </template>
        </ul>

        <!-- 右侧二级/三级分类弹出面板 -->
        <div
            v-if="isActive && activeCategory"
            @mouseenter="handleOptionsMouseEnter"
            @mouseleave="handleOptionsMouseLeave"
            class="absolute top-0 z-999 left-full ml-2 w-200 h-full bg-white shadow-2xl flex flex-col justify-start p-8 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-left-2 duration-200"
        >
            <div class="flex flex-col gap-8 overflow-y-auto">
                <div
                    v-for="sub in subCategories"
                    :key="sub.level2.id"
                    class="flex items-start gap-8"
                >
                    <!-- 二级分类标题 -->
                    <div
                        class="w-28 shrink-0 font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors flex items-center gap-1 text-sm"
                        @click.stop="handleSelect(sub.level2, true)"
                    >
                        {{ sub.level2.name }}
                        <el-icon :size="12"><ArrowRight /></el-icon>
                    </div>
                    <!-- 三级分类列表 -->
                    <div
                        class="flex gap-x-6 gap-y-3 flex-1 flex-wrap border-b border-gray-50 pb-6 last:border-0"
                    >
                        <span
                            v-for="cat3 in sub.level3"
                            :key="cat3.id"
                            class="hover:text-orange-500 cursor-pointer text-sm text-gray-600 transition-colors"
                            @click="handleSelect(cat3, true)"
                        >
                            {{ cat3.name }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import type { CategoryItem } from '@/api/home'
    import { ref, toRefs, computed } from 'vue'
    import { ArrowRightBold, ArrowRight } from '@element-plus/icons-vue'

    const emit = defineEmits<{ (e: 'select', payload: { id: string; name: string }): void }>()

    interface Props {
        categories: CategoryItem[]
    }
    const props = withDefaults(defineProps<Props>(), {
        categories: () => [],
    })
    const isActive = ref(false)
    const activeCategory = ref<CategoryItem | null>(null)

    let hideTimeout: number | null = null

    const { categories } = toRefs(props)

    const groupCategoriesByLevelThenParent = (
        categories: CategoryItem[],
    ): Map<number, Map<string, CategoryItem[]>> => {
        const groups = new Map<number, Map<string, CategoryItem[]>>()

        for (const category of categories) {
            if (!groups.has(category.level)) {
                groups.set(category.level, new Map<string, CategoryItem[]>())
            }

            const levelGroup = groups.get(category.level)!

            // 获取或创建 parentId 数组
            if (!levelGroup.has(category.parentId)) {
                levelGroup.set(category.parentId, [])
            }
            levelGroup.get(category.parentId)!.push(category)
        }

        return groups
    }

    const gruopedCategories = computed(() => groupCategoriesByLevelThenParent(categories.value))

    const subCategories = computed(() => {
        if (!activeCategory.value) return []
        const level2 = gruopedCategories.value.get(2)?.get(activeCategory.value.id) || []
        return level2.map((cat2) => ({
            level2: cat2,
            level3: gruopedCategories.value.get(3)?.get(cat2.id) || [],
        }))
    })

    const handleMouseEnter = (category: CategoryItem) => {
        if (hideTimeout) {
            clearTimeout(hideTimeout)
            hideTimeout = null
        }
        activeCategory.value = category
        isActive.value = true
    }

    const handleMouseLeave = () => {
        hideTimeout = setTimeout(() => {
            isActive.value = false
        }, 100)
    }

    // 处理选择（点击）事件
    const handleSelect = (category: CategoryItem, isSub = false) => {
        emit('select', {
            id: category.id,
            name: category.name,
        })

        if (isSub) {
            isActive.value = false
            activeCategory.value = null
        }
    }

    const handleOptionsMouseEnter = () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout)
            hideTimeout = null
        }
        isActive.value = true
    }

    const handleOptionsMouseLeave = () => {
        hideTimeout = setTimeout(() => {
            isActive.value = false
            activeCategory.value = null
        }, 150)
    }
</script>

<style scoped>
    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slide-in-from-left {
        from {
            transform: translateX(-10px);
        }
        to {
            transform: translateX(0);
        }
    }

    .animate-in {
        animation-duration: 200ms;
        animation-fill-mode: both;
    }

    .fade-in {
        animation-name: fade-in;
    }

    .slide-in-from-left-2 {
        animation-name: slide-in-from-left;
    }
</style>
