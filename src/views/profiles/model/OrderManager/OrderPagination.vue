<template>
    <div v-if="total > 0" class="flex justify-center mt-8">
        <el-pagination
            :current-page="pageNum"
            :page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="custom-pagination"
        />
    </div>
</template>

<script setup lang="ts">

    defineProps<{
        pageNum: number
        pageSize: number
        total: number
    }>()

    const emit = defineEmits<{
        change: []
        'update:pageNum': [value: number]
        'update:pageSize': [value: number]
    }>()

    const handleSizeChange = (val: number): void => {
        emit('update:pageSize', val)
        emit('change')
    }

    const handleCurrentChange = (val: number): void => {
        emit('update:pageNum', val)
        emit('change')
    }
</script>

<style scoped>
    :deep(.custom-pagination) {
        text-align: center;
    }

    :deep(.custom-pagination .el-pagination__total),
    :deep(.custom-pagination .el-pagination__jump) {
        color: #9ca3af;
    }

    :deep(.custom-pagination .el-pager li.is-active) {
        color: #ff8900;
        font-weight: bold;
    }

    :deep(.custom-pagination .el-pager li:hover) {
        color: #ff8900;
    }
</style>
