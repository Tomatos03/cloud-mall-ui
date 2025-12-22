<template>
    <div class="relative h-full w-full overflow-visible">
        <ul
            class="h-full w-full bg-black/90 text-white flex flex-col"
            v-if="gruopedCategories.has(1)"
        >
            <template v-for="[_, categories] in gruopedCategories.get(1)!.entries()">
                <li
                    class="px-15 py-2 hover:bg-blue-800/50 cursor-pointer flex-1 flex justify-between items-center gap-5"
                    v-for="category in categories"
                    :key="category.id"
                    @mouseenter="handleMouseEnter(category)"
                    @mouseleave="handleMouseLeave"
                >
                    <span>
                        {{ category.text }}
                    </span>
                    <el-icon class="text-white"><ArrowRightBold /></el-icon>
                </li>
            </template>
        </ul>

        <!-- 选项展示 -->
        <div
            v-if="isActive && activeCategory"
            @mouseenter="handleOptionsMouseEnter"
            @mouseleave="handleOptionsMouseLeave"
            class="absolute top-0 z-10 left-full w-96 bg-white border border-gray-300 shadow-lg flex flex-col justify-start p-4"
        >
            <div class="flex flex-col gap-4">
                <div v-for="sub in subCategories" :key="sub.level2.id" class="flex gap-4">
                    <div class="w-24 font-semibold text-gray-700">{{ sub.level2.text }}</div>
                    <div class="flex gap-1 flex-1 flex-wrap">
                        <span
                            v-for="cat3 in sub.level3"
                            :key="cat3.id"
                            class="py-1 hover:text-blue-500 cursor-pointer text-sm text-black/80"
                        >
                            {{ cat3.text }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import type { CategoryItem } from '@/api/home'
    import { ref, toRefs, computed, watchEffect } from 'vue'

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

    // 将外部传入的 categories 规范化为组件所需的格式（id/text/parentId 都为字符串）
    const normalizedCategories = computed(() =>
        categories.value.map((c: any) => ({
            id: String(c.id),
            text: c.text ?? c.name ?? '',
            level: c.level,
            parentId: String(c.parentId ?? 0),
        })),
    )

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

    const gruopedCategories = computed(() =>
        groupCategoriesByLevelThenParent(normalizedCategories.value),
    )

    // 调试：当 categories 变化时输出规范化和分组结果（方便排查）
    // watchEffect(() => {
    //     console.log('Normalized Categories:', normalizedCategories.value)
    //     console.log('Grouped Categories:', gruopedCategories.value)
    // })

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
        }, 100)
    }
</script>
