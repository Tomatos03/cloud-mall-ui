<template>
    <el-table :data="tableData" style="width: 100%" :height="height" v-model:selection="selectList">
        <el-table-column type="selection" width="55" v-if="selectList" />
        <el-table-column type="index" label="序号" width="100" v-if="props.showId" />
        <el-table-column
            v-for="col in columns"
            :key="col.key"
            :prop="col.key"
            :label="col.label"
            :fixed="col.isFixed"
            show-overflow-tooltip
            max-width="200px"
        />

        <!-- 操作插槽 -->
        <el-table-column v-if="$slots.action" label="操作" fixed="right">
            <template #default="scope">
                <slot name="action" :row="scope.row" :index="scope.$index" />
            </template>
        </el-table-column>

        <!-- 自定表格为空时的内容 -->
        <template #empty>
            <div class="flex flex-col items-center justify-center py-10">
                <el-icon :size="50">
                    <document />
                </el-icon>
                <p class="mt-4 text-gray-500">暂无数据</p>
            </div>
        </template>
    </el-table>
</template>

<script lang="ts" setup>
    import { toRef } from 'vue'

    interface Column {
        id: string
        label: string
        key: string
        isFixed?: boolean
    }

    interface Props {
        columns: Column[]
        data: unknown[]
        selectList: string[]
        height?: number
        showId?: boolean
    }

    const props = withDefaults(defineProps<Props>(), {
        columns: () => [],
        data: () => [],
    })

    const columns = toRef(props, 'columns')
    const tableData = toRef(props, 'data')
    const height = toRef(props, 'height')
    const selectList = toRef(props, 'selectList')
</script>
